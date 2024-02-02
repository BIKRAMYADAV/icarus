const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoDBSession = require('connect-mongodb-session')(session)
const app = express();
const mongoURI = process.env.MONGO_URI
const userModel = require('./models/User')
const bcrypt = require('bcryptjs')


mongoose.connect(mongoURI)
.then((res) => {
    console.log('database connected')
});

const store = new MongoDBSession({
    uri : mongoURI,
    collection : "mySessions",
})

app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}))// This middleware parses our bodies and gives us access to the request.body

app.use(session({
    secret : 'The cookie that gets stored',
     resave : false
     , saveUninitialized : false,
     store : store
}))

app.get('/' , (req,res) =>{
    req.session.isAuth = true;// This creates a cookie for the first time
    console.log(req.session);
    console.log(req.session.id);// The id here is same as that of the cookie created
    res.send('hello friend')
})



app.listen(5000, () => {
    console.log('app is listening on port 5000');
})

app.get('/login', (req, res) => {
    res.render("login");
})

app.get('/dashboard', (req, res) => {
    res.render("dashboard");
})

app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const user = await userModel.findOne({email}) // should not forget that it should be awaited before checking

    if(!user){
      return res.redirect('/login');
    }
    
    const isMatched = await bcrypt.compare(password, user.password)
    if(!isMatched){
        return res.redirect('/login')
    }
    res.redirect('/dashboard')
})


app.get('/register', (req, res) => {
    res.render("register");
})

app.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    let user = await userModel.findOne({email});
    if(user) {
     return res.redirect('/register');
    }

    const hashedPsw = await bcrypt.hash(password, 12);

    user = new userModel({
        username,
        email,
        password : hashedPsw
    });

    await user.save();
    res.redirect("/login")
})
