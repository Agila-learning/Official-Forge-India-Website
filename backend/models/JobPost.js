const mongoose = require('mongoose');

const jobPostSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String },
    category: { type: String },
    companyName: { type: String, required: true, default: 'Forge India Connect Partner' },
    location: { type: String, required: true },
    type: { type: String }, // Employment type
    salary: { type: String },
    description: { type: String },
    responsibilities: { type: String },
    requirements: { type: String },
    skills: { type: String },
    education: { type: String },
    experience: { type: String },
    openings: { type: Number, default: 1 },
    expiryDate: { type: Date },
    contactMethod: { type: String },
    companyWebsite: { type: String },
    recruitmentStatus: { type: String, enum: ['Active', 'Freezed'], default: 'Active' },
    status: { type: String, enum: ['Published', 'Draft', 'Closed', 'Active'], default: 'Draft' }, // Keep Active for backwards compatibility
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    hrId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const JobPost = mongoose.model('JobPost', jobPostSchema);
module.exports = JobPost;
