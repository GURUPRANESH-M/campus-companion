const express = require("express");
const router = express.Router();

const {
    createExamSchedule,
    getExamSchedules,
    updateExamSchedule,
    deleteExamSchedule,
} = require("../controllers/examController");

const { protect, authorize } = require("../middlewares/authMiddleware");

// COE can manage schedules
router.post("/", protect, authorize("coe"), createExamSchedule);
router.put("/:id", protect, authorize("coe"), updateExamSchedule);
router.delete("/:id", protect, authorize("coe"), deleteExamSchedule);

// Anyone logged in can view schedules
router.get("/", protect, getExamSchedules);

module.exports = router;
