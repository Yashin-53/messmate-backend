require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const messRoutes = require("./routes/messRoutes");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const authMiddleware = require("./middleware/authMiddleware");
const logger = require("./logger");

const rateLimit = require("express-rate-limit");
const compression = require("compression");
const xss = require("xss-clean");

const app = express();

const PORT = process.env.PORT || 3000;


// ========================================
// SECURITY
// ========================================

app.use(helmet());


// ========================================
// CORS
// ========================================

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://messmate-frontend.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);


// ========================================
// REQUEST LOGGING
// ========================================

app.use(morgan("dev"));


// ========================================
// BODY PARSER
// ========================================

app.use(express.json());

// Logging only in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ========================================
// Security & Performance Middleware
// ========================================

// Compress API responses
app.use(compression());


// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// ========================================
// ROOT ROUTE
// ========================================

app.get("/", (req, res) => {
  res.status(200).send(
    "Welcome to MessMate API - powered by Express + MongoDB!"
  );
});


// ========================================
// HEALTH CHECK
// ========================================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development"
  });
});


// ========================================
// TEST ERROR ROUTE
// ========================================

app.get("/crash", (req, res, next) => {
  try {
    throw new Error("Something went wrong");
  } catch (error) {
    next(error);
  }
});


// ========================================
// AUTHENTICATION ROUTES
// ========================================

app.use("/auth", authRoutes);


// ========================================
// PROFILE ROUTES
// ========================================

app.use("/profile", profileRoutes);


// ========================================
// PROTECTED MESS ROUTES
// ========================================

app.use("/messes", authMiddleware, messRoutes);


// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: "Route not found"
  });
});


// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {

  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl
  });

  res.status(err.statusCode || 500).json({
    error: true,
    message:
      err.message || "Internal Server Error"
  });
});


// ========================================
// MONGODB CONNECTION
// ========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    logger.info("Connected to MongoDB");

    app.listen(PORT, () => {

      logger.info(
        `Server running at http://localhost:${PORT}`
      );

    });

  })
  .catch((error) => {

    logger.error({
      message: "MongoDB connection failed",
      error: error.message
    });

  });