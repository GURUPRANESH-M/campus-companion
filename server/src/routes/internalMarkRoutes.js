const express = require("express");
const router = express.Router();

const {
  addInternalMarks,
  getMyMarks,
} = require("../controllers/internalMarkController");

const { protect } = require("../middlewares/authMiddleware");

/* Faculty adds marks */
router.post("/", protect, addInternalMarks);

/* Student views own marks */
router.get("/me", protect, getMyMarks);

module.exports = router;
