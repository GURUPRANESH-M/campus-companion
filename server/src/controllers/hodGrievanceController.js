const Grievance = require("../models/Grievance");

/* =========================
   HOD → VIEW DEPT GRIEVANCES
   ========================= */
exports.getDepartmentGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({
      department: req.user.department,
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   HOD → UPDATE GRIEVANCE STATUS
   ========================= */
exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    grievance.status = status;
    await grievance.save();

    res.json(grievance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
