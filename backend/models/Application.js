const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linked candidate (if logged in)
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost' }, // Linked job posting
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    domain: { type: String, required: true },
    jobRole: { type: String, required: true },
    resumeUrl: { type: String }, // PDF resume URL
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Shortlisted', 'Hired', 'Rejected'],
      default: 'Pending',
    },
    hrNotes: { type: String }, // Internal notes from HR
    statusHistory: [
      {
        status: { type: String },
        note: { type: String },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
