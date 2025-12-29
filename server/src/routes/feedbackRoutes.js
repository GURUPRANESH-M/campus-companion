const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const {
  submitFeedback,
  getFacultyFeedback,
} = require("../controllers/feedbackController");

/* Student */
router.post("/", protect, submitFeedback);

/* Faculty */
router.get("/faculty", protect, getFacultyFeedback);

module.exports = router;
