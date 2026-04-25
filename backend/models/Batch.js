const mongoose = require('mongoose');

const batchSchema = mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Trainer role
    name: { type: String, required: true }, // e.g., "Batch A - June 2026"
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    timings: { type: String, required: true }, // e.g., "10:00 AM - 12:00 PM"
    days: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
    mode: { type: String, enum: ['Online', 'Offline'], required: true },
    maxStudents: { type: Number, default: 30 },
    status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
    meetingLink: { type: String }, // For Online mode
    location: { type: String }, // For Offline mode
  },
  { timestamps: true }
);

const Batch = mongoose.model('Batch', batchSchema);
module.exports = Batch;
