const express = require("express");
const router = express.Router();

const {
  addInternalMarks,
  getMyMarks,
  getStudentsForMarks,
  submitBulkMarks,
} = require("../controllers/internalMarkController");

const { protect } = require("../middlewares/authMiddleware");

/* Faculty adds marks */
router.post("/", protect, addInternalMarks);
router.post("/bulk", protect, submitBulkMarks);

/* Faculty gets students for data entry */
router.get("/students", protect, getStudentsForMarks);

/* Student views own marks */
router.get("/me", protect, getMyMarks);

module.exports = router;
