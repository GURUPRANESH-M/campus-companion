const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middlewares/authMiddleware");

const {
  getStudentsForPeriod,
  markPeriodAttendance,
  getMyAttendance,
} = require("../controllers/attendanceController");

router.get(
  "/period/:id",
  protect,
  authorize("faculty"),
  getStudentsForPeriod
);

router.post(
  "/period",
  protect,
  authorize("faculty"),
  markPeriodAttendance
);

router.get(
  "/my",
  protect,
  authorize("student"),
  getMyAttendance
);

module.exports = router;