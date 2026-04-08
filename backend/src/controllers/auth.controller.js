import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/auth.util.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import dotenv from "dotenv"
dotenv.config()

export const signup = async (req, res) => {
   const{fullName,email,password}=req.body;
   try {
    if(!fullName||!email||!password){
        return res.status(400).json({message:"All fields are required"})
    }

    if(password.length<6){
        return res.status(400).json({
            message:"Password must be of atleast 6 characters "
        })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
       return res.status(400).json({
        message:"Invalid Email"
       })
    }
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            message:"User with this email already exists"
        })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)
    const newUser=new User({
        fullName,
        email,
        password:hashedPassword
    })
    if(newUser){
        generateToken(newUser._id,res)
        await newUser.save();
        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic
        })


        // Send welcome email to the new user
        try {
            await sendWelcomeEmail(newUser.email, newUser.fullName, process.env.CLIENT_URL);
        } catch (error) {
            console.error("Error sending welcome email:", error);
        }
    }else{
        res.status(400).json({
            message:"Invalid user data"
        })
    }





   } catch (error) {
    console.error("Error in signup controller: ", error);
    res.status(500).json({ message: "Internal server error" });
   }




}