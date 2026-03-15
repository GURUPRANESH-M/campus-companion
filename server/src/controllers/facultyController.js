const Timetable = require("../models/Timetable");

/**
 * @desc Get today's timetable for faculty
 * @route GET /api/faculty/today
 * @access Faculty
 */
exports.getTodaySchedule = async (req, res) => {
  try {

    const today = new Date();
    const todayDay = today.toLocaleDateString("en-US", { weekday: "long" });

    const schedule = await Timetable.find({
      day: todayDay,
      $or: [
        { faculty: req.user._id },
        {
          substituteFaculty: req.user._id,
          substitutionDate: {
            $gte: new Date(today.setHours(0, 0, 0, 0)),
            $lte: new Date(today.setHours(23, 59, 59, 999))
          }
        }
      ]
    })
      .sort({ period: 1 })
      .populate("faculty", "name")
      .populate("substituteFaculty", "name");

    res.json(schedule);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching schedule"
    });
  }
};

// New: Get full weekly schedule for the logged‑in faculty (read‑only)
exports.getWeeklySchedule = async (req, res) => {
  try {
    const schedule = await Timetable.find({
      $or: [
        { faculty: req.user._id },
        { substituteFaculty: req.user._id }
      ]
    })
      .sort({ day: 1, period: 1 })
      .populate('faculty', 'name')
      .populate('substituteFaculty', 'name');
    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching weekly schedule' });
  }
}