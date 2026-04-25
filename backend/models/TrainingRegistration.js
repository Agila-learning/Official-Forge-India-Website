const mongoose = require('mongoose');

const trainingRegistrationSchema = mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    candidateName: { type: String },
    email: { type: String },
    phone: { type: String },
    location: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    preferredCourse: { type: String },
    preferredMode: { type: String, enum: ['Online', 'Offline'], required: true },
    qualification: { type: String, required: true },
    preferredBatchTiming: { type: String },
    resumeUrl: { type: String },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Partial'], default: 'Pending' },
    status: { type: String, enum: ['Registered', 'Enrolled', 'Completed', 'Dropped'], default: 'Registered' },
    progress: { type: Number, default: 0 }, // 0-100%
    attendance: [{
        date: { type: Date },
        isPresent: { type: Boolean }
    }],
    placementStatus: {
        type: String,
        enum: ['None', 'Eligible', 'Interviewing', 'Placed', 'Rejected'],
        default: 'None'
    }
  },
  { timestamps: true }
);

const TrainingRegistration = mongoose.model('TrainingRegistration', trainingRegistrationSchema);
module.exports = TrainingRegistration;
