const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const internalMarkRoutes = require("./routes/internalMarkRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/internal-marks", internalMarkRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notices", noticeRoutes);



app.get("/", (req, res) => {
  res.send("Backend is running");
});

module.exports = app;
