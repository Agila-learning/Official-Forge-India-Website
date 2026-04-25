const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['Web Development', 'App Development', 'Cloud Engineer', 'Full Stack Development', 'UI/UX Design', 'Digital Marketing', 'Software Testing', 'DevOps Basics', 'Data Analytics Basics']
    },
    syllabus: [{
      module: { type: String, required: true },
      topics: [{ type: String }]
    }],
    duration: { type: String, required: true }, // e.g., "6 Months"
    fees: { type: Number, required: true },
    mode: { type: String, enum: ['Online', 'Offline', 'Both'], default: 'Both' },
    eligibility: { type: String },
    trainerInfo: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
