const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many login attempts. Please try again later."
  }
});

// ========================================
// POST /auth/register
// Register a new user
// ========================================

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required."
    });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed due to server error."
    });
  }
});


// ========================================
// POST /auth/login
// Login existing user
// ========================================

router.post("/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required."
    });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials."
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed due to server error."
    });
  }
});


module.exports = router;