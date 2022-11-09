const nodemailer = require('nodemailer')



const sendMail = async (emails,subject,body)=>{
    try {
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.mail_id,
                pass:process.env.mail_pass
            }
        })

        await transporter.sendMail({
            from:process.env.mail_id,
            to:emails,
            subject:subject,
            text:body
        })

        console.log("Email sent successfully");


    } catch (error) {
        console.log(error,"Email not sent succesfully");
    }
    
}

module.exports = sendMail