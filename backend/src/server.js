import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import connectDB from "./config/db.js";
dotenv.config();
// Connect to MongoDB


connectDB();


const PORT=process.env.PORT || 3000;
const app=express();
app.use(express.json())// for parsing application/json and get access to req.body in our routes
app.use("/api/auth",authRoutes);



app.listen(PORT,()=>console.log("server is running on port " + PORT));