const mongoose = require('mongoose')

const schema = mongoose.Schema({
    pname : {
        type: String,
        required :true
    },
    pcost : {
        type : Number,
        required : true
    },
    pcolor: {
        type : String,
        required: true
    },
    pdesc: {
        type:String
    } 

},{collection : 'products'})

module.exports = mongoose.model('schema',schema)