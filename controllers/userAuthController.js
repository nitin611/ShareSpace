import { comparePassword, hashedPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import { z } from "zod";
import JWT from "jsonwebtoken";
import { message } from "antd";
import OTP from "../models/OTP.js";
import mailSender from "../utils/mailSender.js";


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

// ----------------------------send OTP----------------------------

export const sendOTP = async (req, res) => {
  try {
    //fetch email from request ki body '
    console.log("hhh");
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
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      console.log("OTP Generated : ", otp);
    }

    const otpPayload = { email, otp };

    //create an entry for OTP in dB
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    //return response successful
    try {
      const mailResponse = await mailSender(
        email,
        "Verification Email from Sharespace",
        otp
      );
      console.log("Email send successfully : ", mailResponse);
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
