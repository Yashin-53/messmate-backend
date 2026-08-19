const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Mess = require("../models/Mess");
const validateObjectId = require("../middleware/validateObjectId");


// ========================================
// GET ALL MESSES + PAGINATION
// GET /messes?limit=2&page=1
// ========================================

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    const messes = await Mess.find()
      .skip(skip)
      .limit(limit);

    const total = await Mess.countDocuments();

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      messes
    });

  } catch (error) {
    console.error("GET /messes error:", error);

    res.status(500).json({
      message: "Failed to fetch messes",
      error: error.message
    });
  }
});


// ========================================
// SEARCH BY LOCATION
// GET /messes/search?location=Wakad
// ========================================

router.get("/search", async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({
        message: "Location is required"
      });
    }

    const messes = await Mess.find({
      location: {
        $regex: location,
        $options: "i"
      }
    });

    res.status(200).json(messes);

  } catch (error) {
    console.error("GET /messes/search error:", error);

    res.status(500).json({
      message: "Failed to search messes",
      error: error.message
    });
  }
});


// ========================================
// GET SINGLE MESS
// GET /messes/:id
// ========================================

// GET single mess
router.get("/:id", validateObjectId, async (req, res, next) => {
  try {
    const mess = await Mess.findById(req.params.id);

    if (!mess) {
      return res.status(404).json({
        message: "Mess not found"
      });
    }

    res.status(200).json(mess);

  } catch (error) {
    next(error);
  }
});


// ========================================
// CREATE MESS
// POST /messes
// ========================================

router.post("/", async (req, res) => {
  try {
    const {
      name,
      location,
      price,
      rating
    } = req.body;

    if (!name || !location || price === undefined) {
      return res.status(400).json({
        message: "Name, location and price are required"
      });
    }

    const newMess = new Mess({
      name,
      location,
      price,
      rating
    });

    const savedMess = await newMess.save();

    res.status(201).json(savedMess);

  } catch (error) {
    console.error("POST /messes error:", error);

    res.status(400).json({
      message: "Failed to create mess",
      error: error.message
    });
  }
});


// ========================================
// UPDATE MESS
// PUT /messes/:id
// ========================================

router.put("/:id", validateObjectId, async (req, res, next) => {
  try {
    const mess = await Mess.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!mess) {
      return res.status(404).json({
        message: "Mess not found"
      });
    }

    res.status(200).json(mess);

  } catch (error) {
    next(error);
  }
});

// ========================================
// DELETE MESS
// DELETE /messes/:id
// ========================================
router.delete("/:id", validateObjectId, async (req, res, next) => {
  try {
    const mess = await Mess.findByIdAndDelete(req.params.id);

    if (!mess) {
      return res.status(404).json({
        message: "Mess not found"
      });
    }

    res.status(200).json({
      message: "Mess deleted successfully",
      mess
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;