const express = require('express')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const product_routes = require('./routes/product_routes')
const user_routes = require('./routes/user_routes')
const app = express()
dotenv.config()

mongoose.connect(process.env.DB,{useNewUrlParser : true},console.log('Connected to atlas'))

app.use(bodyparser.json())
app.use('/product',product_routes)
app.use('/user',user_routes)

app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.listen(3000,()=>{console.log("Listening on port 3000")})