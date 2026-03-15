const Grievance = require("../models/Grievance");

exports.getExamGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ category: "Examination" })
      .populate("student", "name email regNo")
      .sort({ createdAt: -1 });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch exam grievances", error: error.message });
  }
};

exports.resolveExamGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    
    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    grievance.status = "resolved";
    grievance.remarks = req.body.remarks || grievance.remarks;
    grievance.handledBy = req.user._id;

    await grievance.save();
    
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ message: "Failed to resolve exam grievance", error: error.message });
  }
};
