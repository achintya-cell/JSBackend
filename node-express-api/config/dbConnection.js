import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

const connectDB = asyncHandler(async () => {
  const connect = await mongoose.connect(process.env.CONNECTION_STRING);
  console.log(
    "Database connected: ",
    connect.connection.host,
    connect.connection.name
  );
});
 
export default connectDB;
