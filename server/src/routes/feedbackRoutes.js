const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getFacultyFeedback,
} = require("../controllers/feedbackController");
const { protect } = require("../middlewares/authMiddleware");

/* Student */
router.post("/", protect, submitFeedback);

/* Faculty */
router.get("/faculty", protect, getFacultyFeedback);

module.exports = router;
