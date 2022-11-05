const mongoose = require('mongoose')

const schema = mongoose.Schema({

    name : {
        type:String,
        required : true
    },
    email : {
        type:String,
        required:true
    },
    password : {
        type :String,
        required : true,
        min:8
    },
    ph_no : {
        type :Number,
        default : 0
    },
    role : {
        type: String,
        required : true
    }
},{collection : "users"})

module.exports = mongoose.model('users',schema)