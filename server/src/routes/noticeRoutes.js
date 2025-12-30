const express = require("express");
const router = express.Router();
const {
  createNotice,
  getNotices,
} = require("../controllers/noticeController");
const { protect, authorize } = require("../middlewares/authMiddleware");

/* Faculty/Admin */
router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  createNotice
);

/* Student/Faculty */
router.get("/", protect, getNotices);

module.exports = router;
