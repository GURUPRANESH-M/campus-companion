const Grievance = require("../models/Grievance");

/* ===============================
   STUDENT CREATE GRIEVANCE
================================*/
const User = require("../models/User");

exports.createGrievance = async (req, res) => {
  try {

    const { category, title, description } =
      req.body;

    // ✅ fetch student properly
    const student = await User.findById(
      req.user._id
    );

    const grievance =
      await Grievance.create({
        student: student._id,

        // correct department
        department:
          student.department,

        category,
        title,
        description,
      });

    res.status(201).json(grievance);

  } catch (error) {

    console.log(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

/* ===============================
   STUDENT VIEW OWN GRIEVANCES
================================*/
exports.getMyGrievances = async (
  req,
  res
) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const query = {
      student: req.user._id,
      $or: [
        { status: { $ne: "resolved" } },
        { status: "resolved", updatedAt: { $gte: oneWeekAgo } }
      ]
    };

    const grievances =
      await Grievance.find(query)
        .populate("handledBy", "name role")
        .sort({ createdAt: -1 });

    res.json(grievances);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch grievances",
    });
  }
};

/* ===============================
   ADMIN / HOD VIEW ALL
================================*/
exports.getAllGrievances =
  async (req, res) => {
    try {
      let query = {};
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // HOD sees only department grievances + hides resolved > 1 week
      if (req.user.role === "hod") {
        query.department =
          req.user.department;

        query.$or = [
          { status: { $ne: "resolved" } },
          { status: "resolved", updatedAt: { $gte: oneWeekAgo } }
        ];
      }

      const grievances =
        await Grievance.find(query)
          .populate(
            "student",
            "name email department"
          )
          .populate(
            "handledBy",
            "name role"
          )
          .sort({ createdAt: -1 });

      res.json(grievances);
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch grievances",
      });
    }
  };

/* ===============================
   UPDATE STATUS
================================*/
exports.updateGrievanceStatus =
  async (req, res) => {
    try {
      const { status, remarks } =
        req.body;

      const grievance =
        await Grievance.findById(
          req.params.id
        );

      if (!grievance) {
        return res.status(404).json({
          message:
            "Grievance not found",
        });
      }

      grievance.status =
        status || grievance.status;

      grievance.remarks =
        remarks || grievance.remarks;

      grievance.handledBy =
        req.user._id;

      await grievance.save();

      const updated =
        await grievance.populate(
          "handledBy",
          "name role"
        );

      res.json({
        message:
          "Grievance updated successfully",
        grievance: updated,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };