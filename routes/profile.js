const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authenticateToken = require("../middleware/authMiddleware");


// ========================================
// GET USER PROFILE
// GET /profile
// Protected Route
// ========================================

router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      username: user.username,
      role: user.role,
      joinedAt: user.createdAt
    });

  } catch (error) {
    console.error("GET /profile error:", error);

    res.status(500).json({
      message: "Failed to fetch profile"
    });
  }
});

module.exports = router;