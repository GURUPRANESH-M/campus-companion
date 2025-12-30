const express = require("express");
const router = express.Router();

const {
  submitFeedback,
  getFacultyFeedback,
} = require("../controllers/feedbackController");

const { protect, authorize } = require("../middlewares/authMiddleware");

/* ================= STUDENT ================= */
router.post(
  "/",
  protect,
  authorize("student"),
  submitFeedback
);

/* ================= FACULTY ================= */
router.get(
  "/faculty",
  protect,
  authorize("faculty"),
  getFacultyFeedback
);

module.exports = router;
