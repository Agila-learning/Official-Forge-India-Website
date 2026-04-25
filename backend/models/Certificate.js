const mongoose = require('mongoose');

const certificateSchema = mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    certificateId: { type: String, unique: true, required: true }, // FIC-CERT-YYYY-XXXX
    issueDate: { type: Date, default: Date.now },
    downloadUrl: { type: String },
    metadata: {
        attendancePercent: Number,
        grade: String
    }
  },
  { timestamps: true }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
