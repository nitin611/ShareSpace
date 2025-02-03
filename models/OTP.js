import dotenv from "dotenv";
import mongoose from "mongoose";

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
        expires:5*60, //5 Min k liye valid rahega
    }

});

export default  mongoose.model("OTP", OTPSchema);
