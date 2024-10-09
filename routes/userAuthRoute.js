import express from "express";
import { signupController,loginController } from "../controllers/userAuthController.js";
import {isAdmin,jwtverification} from "../middlewares/authMiddleware.js"

// router objec create karo-
const router=express.Router();

//user  signup-

router.post("/signup",signupController,(req,res)=>{

});

// user login ---
router.post("/login",loginController,(req,res)=>{

});


// protected route user dashboard ka-
router.get("/user-auth", jwtverification, (req, res) => {
    res.status(200).send({ ok: true });
});
// protected admin  route admin ka dashboard ke liye-
router.get("/admin-auth", jwtverification,isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

export default router
