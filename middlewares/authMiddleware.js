import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js';


// -------------------------protecting our routes with jwt token -----------------------------
export const jwtverification=async(req,res,next)=>{
    try {
        const decoded=JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
       
        // decrypt to get id -
        req.user=decoded;
        next();
    } 
    catch (err) {
        console.log(err)
    }
}

// --------------------------------seller access-----------------------------
export const isSeller=async (req,res,next)=>{
    try {
        // check karo jo user hai wo seller hai ki nahi-
        const user=await userModel.findById(req.user._id)
        if(user.role!==1){
            return res.status(404).send({
               success:false,
               msg:"UnAuthorize Access you are not seller"

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
            msg:"error in seller middleware"
        })
    }
}