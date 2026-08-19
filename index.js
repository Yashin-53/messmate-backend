require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const messRoutes = require("./routes/messRoutes");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 3000;


// ========================================
// Middleware
// ========================================

app.use(express.json());


// ========================================
// Root Route
// ========================================

app.get("/", (req, res) => {
  res.send(
    "Welcome to MessMate API - powered by Express + MongoDB!"
  );
});


// ========================================
// Health Check
// ========================================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});


// ========================================
// Authentication Routes
// ========================================

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);


// ========================
// Protected Mess Routes
// ========================

const authMiddleware = require("./middleware/authMiddleware");
app.use("/messes", authMiddleware, messRoutes);


// ========================================
// 404 Handler
// ========================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});


// ========================================
// Global Error Handler
// ========================================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Unexpected server error"
  });
});


// ========================================
// MongoDB Connection
// ========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(
        `Server is running at http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });