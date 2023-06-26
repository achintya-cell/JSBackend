import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  //* 1.Check if all fields exists
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  //* 2.Check for user availability
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  //* 3.If above all clear then hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //* 4.Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  //* 5.Prepare for sending the response
  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res, next) => {
  //* 1.Extract user details from req.body and verify them
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  //* 2.Exteact the details from the DB using email field
  const user = await User.findOne({ email });

  //* 3.If user exists then compare password and the hashed password stored in the DB
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          _id: user._id,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ token });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
});

//@desc Get info about current user
//@route GET /api/users/current
//@access public
const currentUser = asyncHandler(async (req, res, next) => {
  res.json({ message: "Current user endpoint" });
});

export { registerUser, loginUser, currentUser };
