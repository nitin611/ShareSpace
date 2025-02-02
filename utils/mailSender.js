import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const mailSender = async (email,title,body) => {
    try{
        // console.log("Email sent:",info);
        
        let transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port: 587,
            secure:false,
            service: 'gmail',
            auth:{
                user: 'jhanitin906@gmail.com',
                pass: process.env.EMAIL_PASS,
            }
        })


        let info = await transporter.sendMail({
            from: '"Sharespace || Sharing Platform" <jhanitin9006@gmail.com>',
            to: `${email}` ,
            subject:`${title}` ,
            html: `${body}`,
        })
        
        return info;


    }
    catch (error) {
        console.error("Error in sending email:", error.message);
        throw new Error(error.message);
    }
}



export default mailSender
