import nodemailer from "nodemailer";

const mailSender = async (email,title,body) => {
    try{
        // console.log("Email sent:",info);
        console.log(process.env.MAIL_HOST)
        console.log(process.env.MAIL_PASS)
        let transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port: 587,
            secure:false,
            service: 'gmail',
            auth:{
                user: 'jhanitin906@gmail.com',
                pass: 'quhf raed tkok kxlm',
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
