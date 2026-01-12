const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendWelcomeEmail } = require("../config/mailer");
require("dotenv").config();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide username, email and password",
        success: false,
      });
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
        success: false,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        message: "Username must be at least 3 characters long",
        success: false,
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists",
        success: false,
      });
    }

    // Hash password BEFORE creating user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password
    const user = new User({
      username,
      email,
      password: hashedPassword, // Already hashed, so no middleware needed
    });

    await user.save();

    const token = generateToken(user._id);

    // Send welcome email (async)
    sendWelcomeEmail(email, username).catch((err) => {
      console.error("❌ Failed to send welcome email:", err.message);
    });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error registering user:", error.message);
    console.error("❌ Full error stack:", error.stack);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Username or email already exists",
        success: false,
      });
    }

    res.status(500).json({
      message: "Error registering user",
      success: false,
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // Compare password directly with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
        success: false,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error logging in user:", error.message);
    res.status(500).json({
      message: "Error logging in user",
      success: false,
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      message: "User profile retrieved successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error.message);
    res.status(500).json({
      message: "Error fetching user profile",
      success: false,
      error: error.message,
    });
  }
};

module.exports = { register, login, getProfile };
