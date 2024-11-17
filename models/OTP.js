const mongoose = require ("mongoose");
const mailSender = require("../utils/mailSender");

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
        default: Date.now(),
        expires:5*60, //5 Min k liye valid rahega
    }

});


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

//pre- middleware

OTPSchema.pre("save",async function(next){
    await sendVarificationEmail(this.email,this.otp);
    next();
})


module.exports = mongoose.model("OTP",OTPSchema);