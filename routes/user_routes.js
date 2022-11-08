const router = require('express').Router()
const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Schema = require('../models/u_schema')
const {registervalidation,loginvalidation} = require('./validation')
const e = require('express')

router.post('/register', async (req,res)=>{
     
    const {error} = registervalidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await Schema.findOne({email:req.body.email})
    if (user) return res.status(400).send("User Already Exists")

    const salt = await bcrypt.genSalt(10)
    const hashpass = await bcrypt.hash(req.body.password,salt)

    const posts = new Schema({
        name:req.body.name,
        email : req.body.email,
        password :hashpass,
        ph_no : req.body.ph_no
    })

    try {
        await posts.save()
        res.send("Registered Successfully")
    } catch (error) {
        res.send(error.message)
        }
})

router.post('/login', async (req,res)=>{

    if(req.body.email==process.env.admin_email && req.body.password==process.env.admin_password){
        const token = jwt.sign({email:req.body.email},process.env.token_admin)
        res.setHeader('auth-token',token).send({"Message":`Welcome admin`,"token":token})
    }
    else{
    const {error} = loginvalidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await Schema.findOne({email:req.body.email})
    if(!user) return res.status(400).send("User not registered")

    const validpass = await bcrypt.compare(req.body.password,user.password)
    if(!validpass) return res.status(400).send("Invalid password")
    
    const token = jwt.sign({email:user.email},process.env.token_customer)
    res.setHeader('auth-token',token).send({"Message":`Welcome ${user.role}`,"token":token})
    }
})

router.get('/get',async (req,res)=>{
    try{
    const users = await Schema.find()
    res.send(users)
    }
    catch(err){
        res.send(err.message)
    }
})

module.exports = router