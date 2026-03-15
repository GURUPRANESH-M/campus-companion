const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middlewares/authMiddleware");

const {
    getPrincipalDashboard,
    getDepartmentStats,
} = require("../controllers/principalController");

router.get("/dashboard", protect, authorize("principal"), getPrincipalDashboard);
router.get("/departments", protect, authorize("principal"), getDepartmentStats);

module.exports = router;
