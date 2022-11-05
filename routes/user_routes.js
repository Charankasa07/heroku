const router = require('express').Router()
const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Schema = require('../models/u_schema')
const {registervalidation,loginvalidation} = require('./validation')

router.post('/register', async (req,res)=>{
     
    const {error} = registervalidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await Schema.findOne({mail:req.body.mail})
    if (user) return res.status(400).send("User Already Exists")

    const salt = await bcrypt.genSalt(10)
    const hashpass = await bcrypt.hash(req.body.password,salt)

    const posts = new Schema({
        name:req.body.name,
        email : req.body.email,
        password :hashpass,
        ph_no : req.body.ph_no,
        role: req.body.role
    })

    try {
        await posts.save()
        res.send("Registered Successfully")
    } catch (error) {
        res.send(error.message)
        }
})

router.post('/login', async (req,res)=>{

    const {error} = loginvalidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await Schema.findOne({email:req.body.email})
    if(!user) return res.status(400).send("User not registered")

    const validpass = await bcrypt.compare(req.body.password,user.password)
    if(!validpass) return res.status(400).send("Invalid password")
    
    const token = jwt.sign({email:user.email},process.env.token_secret)
    res.header('auth-token',token).send({"Message":"Welcome customer","token":token})
    
})

module.exports = router