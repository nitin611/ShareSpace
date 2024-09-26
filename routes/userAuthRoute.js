import express from "express";
import { signupController,loginController } from "../controllers/userAuthController.js";
import {isSeller,jwtverification} from "../middlewares/authMiddleware.js"

// router objec create karo-
const router=express.Router();

//user  signup-

router.post("/signup",signupController,(req,res)=>{

});

// user login ---
router.post("/login",loginController,(req,res)=>{

})
// test route-
router.get("/test",jwtverification,isSeller,(req,res)=>{
    res.send("test is running");
})

export default router
