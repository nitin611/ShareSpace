import { comparePassword, hashedPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";  
import { z } from 'zod';
import JWT from 'jsonwebtoken'

// ---------------------input validation schema zod ka use--------------

const signupSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email().refine(
    (email) => email.endsWith("@vitstudent.ac.in"), {
      message: "Only vit mail id is accepted"
    }
  ),
  password: z.string().min(5, "Password must be at  5 char long"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  collegeId: z.string().min(1, "College ID is required"),
});


// ----------------------------signup the user----------------------------
export const signupController = async (req, res) => {
  try {
//  -----------  input validation---
    const validatedData = signupSchema.safeParse(req.body);

    // ---agar validation fail hua to-
    if (!validatedData.success) {
      return res.status(400).json({
        success:false,
        msg: "Validation error",
        errors: validatedData, 
      });
    }
    // if the input given by the user are all correct to fir -

    const { name, email, password, phone, collegeId } = validatedData.data;

    // Check karo user already exist karta hai ki nahi -
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).send({
        success:false,
        msg: 'User already registered, please login',
      });
    }

    // user ke password ko hash karo-
    const hashed = await hashedPassword(password);

    // naya user create karo-
    const newUser = await userModel.create({
      name,
      email,
      phone,
      collegeId,
      password: hashed,
    });

    res.status(201).json({
        success:true,
      msg: "User created successfully!",
      user: newUser,  
    });
  } 
  catch (err) {
    console.error(err);
    res.status(500).send({
      success:false,
      msg: "Error in signup",
      error: err.message,
    });
  }
};


// -------------login route-----------
export const loginController=async(req,res)=>{
    try {
        const {email,password}=req.body
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
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                msg:"User is not registerd,kindly signup-"
            });
        }
        // password match karo - jo password yaha user diya hai with hashed password in db-
        const passwordMatch=await comparePassword(password,user.password)
        if(!passwordMatch){
            return res.status(400).send({
                success:false,
                msg:"Invalid password"
            })
        }

        // jwt token creation after validation of user with email and password - 
        const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"1d",})
        res.status(200).send({
            success:true,
            msg:"Login successfully!!",
            user:{
                name:user.name,
                email:user.email,
                collegeId:user.collegeId,
                phone:user.phone,
                role:user.role,
            },
            token,
        });
    } 
    catch (err) {
        console.log(err)
        res.status(500).send({
            success:false,
            msg:"Error in login",
            err
        })
    }
}
