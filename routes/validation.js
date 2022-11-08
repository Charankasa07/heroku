const joi = require('joi')

const registervalidation = (data)=>{
    const ucheck = joi.object({

        name : joi.string().required(),
        email : joi.string().required().email(),
        password : joi.string().required().min(8),
        ph_no : joi.number().default(0),
        role : joi.string().required()
    })
    return ucheck.validate(data)
}

const loginvalidation = (data)=>{
    const check = joi.object({
        email : joi.string().required().email(),
        password : joi.string().required(),
        admin_id:joi.string()
        //role:joi.string().required()
    })
    return check.validate(data)
}

module.exports.registervalidation = registervalidation
module.exports.loginvalidation = loginvalidation