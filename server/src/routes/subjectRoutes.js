const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
    createSubject,
    getSubjects,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

const router = express.Router();

// Allow public to fetch subjects (used by Admin/HOD for filtering, and Principal)
router.get("/", protect, getSubjects);

// Only let explicit roles like principal (and maybe admin) manage the base curriculum
router.post("/", protect, authorize("principal", "admin"), createSubject);
router.put("/:id", protect, authorize("principal", "admin"), updateSubject);
router.delete("/:id", protect, authorize("principal", "admin"), deleteSubject);

module.exports = router;
