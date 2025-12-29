const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      enum: ['academic', 'exam', 'hostel', 'admin', 'other'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved'],
      default: 'open'
    },
    remarks: {
      type: String
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Grievance', grievanceSchema);
