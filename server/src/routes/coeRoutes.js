const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const { getCoEDashboard, getExamSchedules, createExamSchedule, getResults } = require("../controllers/coeController");

router.get("/dashboard", protect, authorize("coe"), getCoEDashboard);
router.get("/schedule", protect, authorize("coe"), getExamSchedules);
router.post("/schedule", protect, authorize("coe"), createExamSchedule);
router.get("/results", protect, authorize("coe"), getResults);

module.exports = router;
