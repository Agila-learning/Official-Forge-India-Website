const mongoose = require('mongoose');

const jobPostSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    companyName: { type: String, required: true, default: 'Forge India Connect Partner' },
    location: { type: String, required: true },
    salary: { type: String },
    description: { type: String },
    responsibilities: { type: String },
    requirements: { type: String }, // Simplified to string for flexible rich text or lists
    education: { type: String },
    experience: { type: String },
    openings: { type: Number, default: 1 },
    expiryDate: { type: Date },
    companyWebsite: { type: String },
    recruitmentStatus: { type: String, enum: ['Active', 'Freezed'], default: 'Active' },
    status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
    hrId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const JobPost = mongoose.model('JobPost', jobPostSchema);
module.exports = JobPost;
