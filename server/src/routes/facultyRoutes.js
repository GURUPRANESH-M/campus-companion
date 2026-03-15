const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");

const {
  getTodaySchedule,
  getWeeklySchedule
} = require("../controllers/facultyController");

router.get("/today", protect, authorize("faculty"), getTodaySchedule);
router.get("/weekly", protect, authorize("faculty"), getWeeklySchedule);

module.exports = router;