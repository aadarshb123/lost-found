import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import User from "../models/user.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Change client url once in prod
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for exisiting user
    let existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // PW hash - I used 10 salt rounds bc I felt like it was a good balance, feel free to change to lower or higher
    const hashedPassword = await bcrypt.hash(password, 10);

    // Make a unique verif token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });
    await newUser.save();

    // Send verif email
    const verificationLink = `${CLIENT_URL}/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: `"GT Lost & Found" <${EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click the link below to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`,
    });

    res
      .status(201)
      .json({
        message:
          "Signup successful! Please check your email to verify your account.",
      });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "User successfully logged in", token, user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Logout
// Function doesn't actually do anything other than post a message, since we use JWT token we can have frontend handle logout
export const logout = (req, res) => {
  try {
    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Find user by verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = null; // Remove the token after verification
    await user.save();

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
