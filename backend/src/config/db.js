import mongoose from "mongoose";

const connectDB= async()=>{
    console.log("Connecting to MongoDB...")
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongoDB CONNECTED",conn.connection.host)
    } catch (error) {
        console.error("ERROR connecting to MongoDB:", error)
        process.exit(1)// 1 status code for failure
    }
}
export default connectDB;
/*
co
*/