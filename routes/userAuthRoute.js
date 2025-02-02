import express from "express";
import { signupController,loginController, sendOTP, edituserProfileController, getOrderController, addOrderController, getOrderReceived } from "../controllers/userAuthController.js";
import {isAdmin,jwtverification} from "../middlewares/authMiddleware.js"

// router object create karo-
const router=express.Router();

//-----------------------user  signup --------

router.post("/signup",signupController,(req,res)=>{

});

// otp route-
router.post("/otp",sendOTP,(req,res)=>{

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

// edit user profile-
router.put("/Editprofile",jwtverification,edituserProfileController);
// order route-
router.get('/orders',jwtverification,getOrderController);
// add order-
router.post('/add-order', jwtverification, addOrderController);

// get all order-like seller backend route-
router.get("/allOrders", jwtverification, getOrderReceived);


export default router