import dotenv from "dotenv";
import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";

dotenv.config();
const OTPSchema = new mongoose.Schema({

    email:{
        type:String,
        required: true,
    },
    otp:{
        type:String,
        required:true,
    },

    createdAt:{
        type:Date,
        default: () => Date.now(),
        expires:2.5*60, //5 Min k liye valid rahega
    }

});
export default  mongoose.model("OTP", OTPSchema);




//pre- middleware

OTPSchema.pre("save",async function(next){
    console.log("ddsdsee")
    await sendVarificationEmail(this.email,this.otp);
    next();
})


// a function -> to send mail

async function sendVarificationEmail(email,otp) {
    try{
        const mailResponse = await mailSender(email,"Verification Email from Sharespace" , otp);
        console.log("Email send successfully : ",mailResponse);
    }
    catch(error){
        console.log("error occured while sending email :" ,error);
        throw error;
    }
}



