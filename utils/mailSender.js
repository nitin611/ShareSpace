import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const generateEmailTemplate = (bodyhtml) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">ShareSpace - Sharing Platform</h2>
        ${bodyhtml}
        <hr>
        <p style="font-size: 12px; color: #777; text-align: center;">This is an automated email from ShareSpace. Please do not reply.</p>
    </div>`;
};

const mailSender = async (email, subject, bodyhtml) => {
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            service: 'gmail',
            auth: {
                user: 'sharespacestore@gmail.com',
                pass: process.env.EMAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: '"Sharespace || Sharing Platform" <sharespacestore@gmail.com>',
            to: email,
            subject: subject,
            html: generateEmailTemplate(bodyhtml),
        });

        return info;
    } catch (error) {
        console.error("Error in sending email:", error.message);
        throw new Error(error.message);
    }
};

export default mailSender;
