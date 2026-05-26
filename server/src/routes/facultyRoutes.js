const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");

const {
  getTodaySchedule,
  getWeeklySchedule,
  getProfile,
  getDepartmentFacultyList
} = require("../controllers/facultyController");

router.get("/today", protect, authorize("faculty"), getTodaySchedule);
router.get("/weekly", protect, authorize("faculty"), getWeeklySchedule);
router.get("/profile", protect, authorize("faculty"), getProfile);
router.get("/department", protect, getDepartmentFacultyList); // Accessible to students too

module.exports = router;