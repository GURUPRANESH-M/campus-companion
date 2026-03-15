const express = require("express");
const router = express.Router();
const { getExamGrievances, resolveExamGrievance } = require("../controllers/examGrievanceController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Get all exam grievances
router.get("/", protect, authorize("coe"), getExamGrievances);

// Resolve a specific exam grievance
router.put("/:id/resolve", protect, authorize("coe"), resolveExamGrievance);

module.exports = router;
