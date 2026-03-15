const User = require("../models/User");
const Grievance = require("../models/Grievance");
const Notice = require("../models/Notice");

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { role, department } = req.query;

    let filter = {};

    if (role) filter.role = role;
    if (department) filter.department = department;

    const users = await User.find(filter).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

/**
 * @desc    Create new user
 * @route   POST /api/admin/users
 * @access  Admin
 */
exports.createUser = async (req, res) => {
  try {
    let { name, email, password, role, department, year, section, handlingSubjects } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔥 AUTO ASSIGN DEPARTMENT FOR SPECIAL ROLES
    if (role === "principal" || role === "admin") {
      department = "MANAGEMENT";
    }

    if (role === "coe") {
      department = "COE";
    }

    const user = new User({
      name,
      email,
      password,
      role,
      department,
      year,
      section,
      handlingSubjects: role === "faculty" ? handlingSubjects : undefined
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};
/**
 * @desc    Update user
 * @route   PUT /api/admin/users/:id
 * @access  Admin
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, department, year, section, handlingSubjects, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.department = department || user.department;
    user.year = year || user.year;
    user.section = section || user.section;
    user.isActive = isActive ?? user.isActive;

    if (role === "faculty" && handlingSubjects) {
      user.handlingSubjects = handlingSubjects;
    }

    const updatedUser = await user.save();

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Admin
 */
exports.getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalFaculty = await User.countDocuments({ role: "faculty" });
    const totalHOD = await User.countDocuments({ role: "hod" });
    const totalGrievances = await Grievance.countDocuments();
    const totalNotices = await Notice.countDocuments();

    res.json({
      totalStudents,
      totalFaculty,
      totalHOD,
      totalGrievances,
      totalNotices,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin stats" });
  }
};