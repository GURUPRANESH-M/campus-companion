const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middlewares/authMiddleware");

// Controllers (we will create next step)
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAdminStats,
} = require("../controllers/adminController");

// 🔐 All routes below are protected & admin only
router.use(protect);
router.use(authorize("admin"));

// 👥 User Management
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// 📊 Dashboard Stats
router.get("/stats", getAdminStats);

module.exports = router;