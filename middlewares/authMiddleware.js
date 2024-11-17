import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js';

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
// -------------------------protecting our routes with jwt token -----------------------------

export const jwtverification=async(req,res,next)=>{
    try {
        const decoded=JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id); // Fetch user from DB

        if (!user) {
            return res.status(404).send({ success: false, msg: "User not found" });
        }

        req.user = user; // Attach full user document to req.user
        next();
    } 
    catch (err) {
        console.log(err)
    }
}

// --------------------------------admin access-----------------------------
export const isAdmin=async (req,res,next)=>{
    try {
        // check karo jo user hai wo admin hai ki nahi-
        const user=await userModel.findById(req.user._id)
        if(user.role!==1){
            return res.status(404).send({
               success:false,
               msg:"UnAuthorize Access you are not admin"

            });
        }
        else{
            next()
        }
    } 
    catch (err) {
        console.log(err);
        res.status(404).send({
            success:false,
            err,
            msg:"error in admin middleware"
        })
    }
}