const express = require("express");
const router = express.Router();
// const { getHODDashboard } = require("../controllers/hodController");
const { getDepartmentFaculty } = require("../controllers/hodController");
const { protect, authorize } = require("../middlewares/authMiddleware");


const { getHODDashboard, getStudentPerformance, } = require("../controllers/hodController");
const {
  createWeeklyTimetable,
  getClassTimetable,
  assignSubstitution,
  createFacultyTimetable,
  getFacultyTimetable
} = require("../controllers/hodController");

router.get(
  "/students-performance",
  protect,
  authorize("hod"),
  getStudentPerformance
);


router.get(
  "/dashboard",
  protect,
  authorize("hod"),
  getHODDashboard
);

router.get(
  "/faculty",
  protect,
  authorize("hod"),
  getDepartmentFaculty
);

router.post("/timetable", protect, authorize("hod"), createWeeklyTimetable);
router.get("/timetable", protect, authorize("hod"), getClassTimetable);

router.post("/timetable/faculty", protect, authorize("hod"), createFacultyTimetable);
router.get("/timetable/faculty", protect, authorize("hod"), getFacultyTimetable);

router.put("/timetable/substitute/:id", protect, authorize("hod"), assignSubstitution);



module.exports = router;

