const express = require("express");
const router = express.Router();
// const { getHODDashboard } = require("../controllers/hodController");
const { getDepartmentFaculty } = require("../controllers/hodController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const { getHODDashboard , getStudentPerformance,} = require("../controllers/hodController");

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


module.exports = router;

