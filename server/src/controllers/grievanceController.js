const Grievance = require('../models/Grievance');

// Student raises grievance
exports.createGrievance = async (req, res) => {
  try {
    const { category, title, description } = req.body;

    const grievance = await Grievance.create({
      student: req.user._id,
      category,
      title,
      description
    });

    res.status(201).json(grievance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Student views own grievances
exports.getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.user._id });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin/HOD views all grievances
exports.getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find()
      .populate('student', 'name email')
      .populate('handledBy', 'name role');

    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin/HOD updates grievance status
exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    grievance.status = status;
    grievance.remarks = remarks;
    grievance.handledBy = req.user._id;

    await grievance.save();

    res.json(grievance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
