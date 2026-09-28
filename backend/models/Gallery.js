const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['Industrial Visits', 'Internships', 'Company Achievements', 'Placement Achievements']
    },
    imageUrl: { type: String, required: true },
    description: { type: String },
    date: { type: Date },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
