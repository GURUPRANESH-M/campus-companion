const express = require("express");
const router = express.Router();

const {
  getDepartmentGrievances,
  updateGrievanceStatus,
} = require("../controllers/hodGrievanceController");

const { protect, authorize } = require("../middlewares/authMiddleware");

/* HOD */
router.get(
  "/grievances",
  protect,
  authorize("hod"),
  getDepartmentGrievances
);

router.patch(
  "/grievances/:id",
  protect,
  authorize("hod"),
  updateGrievanceStatus
);

module.exports = router;
