const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ActiveUserSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    doubtsSolved : {
        type : Number
    },
    starCount : {
        type : Number,
        required : true
    } 
})

module.exports = mongoose.model("activeUser", ActiveUserSchema)