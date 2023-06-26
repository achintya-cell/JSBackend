import express from "express";
import dotenv from "dotenv";
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import connectDB from "./config/dbConnection.js";

dotenv.config();

connectDB();
const app = express();

const port = process.env.PORT || 5000;

//* To parse the json data in req.body otherwise the json data coming in reqeust will be undefined
app.use(express.json());
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); 
});
