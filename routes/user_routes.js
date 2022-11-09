const router = require('express').Router()
const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const Schema = require('../models/u_schema')
const sendmail= require('../node_mailer')
const {registervalidation,loginvalidation} = require('./validation')
const e = require('express')
const uri = 'https://charan-heroku.herokuapp.com/user'
const main_path='/Users/charan/Desktop/Vegetable Project'

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

router.post('/reset-password',async (req,res)=>{
    const user = await Schema.findOne({email:req.body.email})
    if(!user) return res.status(400).send("User not registered")

    const secret = process.env.token_customer + user.password
    const token = await jwt.sign({email:user.email},secret,{expiresIn:'10m'})
    const URI = `${uri}/reset-password/${user.email}/${token}`
    const html = `<h4>Reset password</h4><p>Valid for 10 mins</p><a href=${URI}>Click here</a>`
    await sendmail(user.email,"Password Reset",html)
    res.send("Password reset mail sent to your email account")
})

router.get('/reset-password/:email/:token',async (req,res)=>{

    const email = req.params.email
    const token = req.params.token

    try {
        const user = await Schema.findOne({email:req.params.email})
        if(!user) return res.status(400).send("User not registered")

        const secret = process.env.token_customer + user.password
        const verified= jwt.verify(token,secret)
        if(verified){
            res.sendFile(path.join(main_path+'/reset-password.html'))
        }

    } catch (error) {
        res.send(error.message)
    }
})

router.post('/reset-password/:email/:token',async (req,res)=>{
        const password = req.body.password
        const password1= req.body.password1
        const token = req.params.token
        if(password==password1){
        const user = await Schema.findOne({email:req.params.email})
        if(!user) return res.status(400).send("User not registered")

        const secret= process.env.token_customer + user.password
        const verified= jwt.verify(token,secret)
        if(verified){
            user.password=req.body.password
            await user.save()
        }

        res.send("Password reset successfully")
    }
    else{
        res.send("Passwords didnt matched")
    }
})
module.exports = router