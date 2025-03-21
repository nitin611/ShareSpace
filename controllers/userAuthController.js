import { comparePassword, hashedPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js"
import { z } from "zod";
import JWT from "jsonwebtoken";
import axios from "axios";
import message from "antd";
import OTP from "../models/OTP.js";
import mailSender from "../utils/mailSender.js";
import productModel from "../models/productModel.js";
import Point from "../models/pointModel.js";
// require("dotenv").config();
// const OTP = require("../models/OTP.js");
import otpGenerator from "otp-generator";
// ---------------------input validation schema zod ka use--------------

const signupSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z
    .string()
    .email()
    .refine((email) => email.endsWith("@vitstudent.ac.in"), {
      message: "Only vit mail id is accepted",
    }),
  password: z.string().min(5, "Password must be at  5 char long"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  collegeId: z.string().min(1, "College ID is required"),
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

// -------------------------------------send OTP--------------------------------

export const sendOTP = async (req, res) => {
  try {
    //fetch email from request ki body '
   
    const { email } = req.body;

    //check users already exists
    const checkUserPresent = await userModel.findOne({ email });

    //then return response

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already registered",
      });
    }

    //generate OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP Generated : ", otp);
    

    //check unique OTP or not
    // let result = await OTP.findOne({ otp: otp });

    // while (result) {
    //   otp = otpGenerator.generate(6, {
    //     upperCaseAlphabets: false,
    //     lowerCaseAlphabets: false,
    //     specialChars: false,
    //   });
    //   console.log("OTP Generated : ", otp);
    // }

    const otpPayload = { email, otp };

    //create an entry for OTP in dB
    try {
      const otpBody = await OTP.create(otpPayload);
      console.log("OTP added to db successfully", otpBody);
    } catch (error) {
      console.log("Unable to add OTP to db. Error: ", error);
    }

    //craft otp email body
    const otpBodyHtml = `<p style="color: #333;  text-align: center;">Your OTP is:</p>
                        <h3 style="color: #555;  text-align: center;">${otp}</h3>
                        <p style="font-size: 13px; color: #666; text-align: center;">Valid for 5 mins</p>`;
    //return response successful
    try {
      const mailResponse = await mailSender(
        email,
        "Verification Email from CampusCart",
        otpBodyHtml
      );
      console.log("OTP Email send successfully : ", mailResponse);
    } catch (error) {
      console.log("error occured while sending email :", error);
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ----------------------------signup the user----------------------------
export const signupController = async (req, res) => {
  try {
    const validatedData = signupSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        msg: "Validation error",
        errors: validatedData,
      });
    }

    const { name, email, password, phone, collegeId, otp } = validatedData.data;

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already registered, please login",
      });
    }

    // Find the most recent OTP for this email
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    console.log("Provided OTP:", otp);
    console.log("Stored OTP:", recentOtp?.otp);
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (String(otp) !== String(recentOtp.otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash the password and create a user
    const hashed = await hashedPassword(password);
    const newUser = await userModel.create({
      name,
      email,
      phone,
      collegeId,
      password: hashed,
    });

    res.status(201).json({
      success: true,
      msg: "User created successfully!",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Error in signup",
      error: err.message,
    });
  }
};

// -------------login route-----------
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation karo email aur password ka--
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        msg: "Email and password are required.",
      });
    }

    // Check if the email is a valid VIT student email
    if (!email.endsWith("@vitstudent.ac.in")) {
      return res.status(400).send({
        success: false,
        msg: "only vit mailId is accepted",
      });
    }

    if (password.length < 5) {
      return res.status(400).send({
        success: false,
        msg: "Password must be at least 5 characters long.",
      });
    }

    // user with that email id in database-
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        msg: "User is not registerd,kindly signup-",
      });
    }
    // password match karo - jo password yaha user diya hai with hashed password in db-
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(400).send({
        success: false,
        msg: "Invalid password",
      });
    }

    // jwt token creation after validation of user with email and password -
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({
      success: true,
      msg: "Login successfully!!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        collegeId: user.collegeId,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      msg: "Error in login",
      err,
    });
  }
};


// edit user profile controller-
export const edituserProfileController=async(req,res)=>{
  try {
    const { name,password, phone, collegeId}=req.body

  const user=await userModel.findById(req.user._id)
  // passowrd-
  if(password && password.length<5){
    return res.json({error:'password is required and 5 char long'})
  }
  const hashPassword=password ?await hashedPassword(password):undefined
  const updatedUser=await userModel.findByIdAndUpdate(req.user._id,{
    name:name || user.name,
    password:hashPassword||user.password,
    phone:phone ||user.phone,
    collegeId:collegeId ||user.collegeId

  },{new:true})
  res.status(200).send({
    success:true,
    msg:"user updated successfully",
    updatedUser
  })

  } catch (err) {
    console.log(err)
    res.status(400).send({
      success:false,
      msg:"Error while updating the profile",
      err
    })
  }
}

// ------------------------------------user order controller------------------------------------------
export const getOrderController=async(req,res)=>{
  try {
   
    const orders=await orderModel
    .find({buyer:req.user._id})
    .populate("products","-photo")
    .populate("buyer","name email")
    res.json(orders)
   
  } catch (err) {
    console.log(err)
    res.status(400).send({
      success:false,
      msg:"Error in getting order",
      err
    })
   
  }
}

// ---------------------------------------add order--------------------------------------------

export const addOrderController = async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Check if the product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    // Check quantity
    if (product.quantity <= 0) {
      return res.status(400).json({ success: false, message: "Product is out of stock" });
    }

    // Create the order
    const order = new orderModel({
      products: [productId],
      buyer: req.user._id,
    });
    await order.save();

    // Get seller information
    const seller = await userModel.findById(product.userId);
    
    // Try to send email, but don't let failure block the order process
    try {
      const productBodyHtml = `<p style="color: #333;">An order was placed for the following product of yours:</p>
        <h3 style="color: #555;">Name: ${product.name}</h3>
        <p>Description: ${product.description}</p>
        <p style="font-size: 13px; color: #666;">Open your CampusCart dashboard to know more and complete the process.</p>`;
      
      const mailResponse = await mailSender(
        seller.email,
        "CampusCart - Order placed for your Product",
        productBodyHtml
      );
      console.log("Order placed Email sent successfully : ", mailResponse);
    } catch (emailError) {
      // Log the error but don't fail the order
      console.error("Email sending failed, but order created:", emailError);
    }

    // Update product quantity
    product.quantity = Math.max(0, product.quantity - 1);
    await product.save();
    
    // Return success with updated product
    res.status(201).json({ 
      success: true, 
      order,
      product,
      message: "Order placed successfully"
    });
  } catch (err) {
    console.error("Error in add-order:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// ----------------------------------sellers order controller-------------------------------------------

export const getOrderReceived = async (req, res) => {
  try {
    // Get users id
    const sellerId = req.user._id; 
    

    // sab product id find karo ish seller ka-
    const sellerProducts = await productModel.find({ userId: sellerId }).select("_id");
    const sellerProductIds = sellerProducts.map(product => product._id); 
    

    // fetch orders that include products from this signin user-
    const orders = await orderModel
      .find({ products: { $in: sellerProductIds } }) 
      .populate({
        path: "products",
        select: "-photo", 
      })
      .populate("buyer", "name") 
      .sort({ createdAt: -1 }); // Sort by most recent orders

    // Step 3: Log and filter orders (if necessary)
   
    const filteredOrders = orders.filter(order => order.products.length > 0);
    // send kardo result ko-
    res.status(200).json({
      success: true,
      data: filteredOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update Order Status (Delivered, Cancelled, etc.)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Not Process", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order status
    order.status = status;
    await order.save();

    // If order is marked as Delivered, give points to seller
    if (status === "Delivered") {
      const product = await productModel.findById(order.products[0]);
      if (product) {
        const sellerId = product.userId;
        const points = await Point.findOne({ userId: sellerId });
        
        if (points) {
          points.points += 100;
          await points.save();
        } else {
          await Point.create({
            userId: sellerId,
            points: 100
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in updating order status",
      error: error.message,
    });
  }
};

// Delete order controller
export const deleteOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    // Find the order and check if it belongs to the user
    const order = await orderModel.findOne({ _id: orderId, buyer: userId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized",
      });
    }

    // Delete the order
    await orderModel.findByIdAndDelete(orderId);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting order",
      error: error.message,
    });
  }
};
