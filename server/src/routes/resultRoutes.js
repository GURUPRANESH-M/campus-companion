const express = require("express");
const router = express.Router();
const { uploadResults, getResults, updateResult, publishResults, getMyResults, deleteAllResults } = require("../controllers/resultController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Upload results
router.post("/upload", protect, authorize("coe"), uploadResults);

// Get all results
router.get("/", protect, getResults);

// Update single result
router.put("/:id", protect, authorize("coe"), updateResult);

// Publish all pending results
router.post("/publish", protect, authorize("coe"), publishResults);

// Get logged in student's results
router.get("/my", protect, authorize("student"), getMyResults);

// Revoke all results
router.delete("/clear", protect, authorize("coe"), deleteAllResults);

module.exports = router;
