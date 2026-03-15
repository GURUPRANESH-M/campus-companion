const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const DEPARTMENTS = [
  "CSE",
  "IT",
  "EEE",
  "ECE",
  "MECH",
  "CIVIL",
  "MANAGEMENT",
  "COE"
];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "faculty", "hod", "principal", "coe", "admin"],
      required: true,
    },

    department: {
      type: String,
      enum: DEPARTMENTS,
      required: true,
    },

    year: {
      type: Number,
    },

    section: {
      type: String,
      trim: true,
    },

    handlingSubjects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    }],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* 🔐 HASH PASSWORD */
/* 🔐 HASH PASSWORD */
userSchema.pre("save", async function () {
  // If password isn't modified, just return (same as calling next)
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // No next() needed here; the async function resolving tells Mongoose you're done
  } catch (error) {
    // If you need to catch an error, you can throw it, 
    // and Mongoose will treat it as next(error)
    throw error;
  }
});
module.exports = mongoose.model("User", userSchema);