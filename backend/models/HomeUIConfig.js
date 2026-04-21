const mongoose = require('mongoose');

const homeUIConfigSchema = mongoose.Schema(
  {
    hero: {
      title: { type: String, default: 'Modernize Your Domain' },
      highlightedText: { type: String, default: 'Precision' },
      subtitle: { type: String, default: 'Scientific Domestic Operation Infrastructure' },
      ctaText: { type: String, default: 'Book Service in 30 Seconds' },
      ctaLink: { type: String, default: '#services-grid' },
      backgroundMedia: { type: String }, // YouTube/Cloudinary URL
      mediaType: { type: String, enum: ['image', 'video'], default: 'video' },
      rating: { type: Number, default: 4.8 },
      proCount: { type: Number, default: 1200 },
      stats: [{ label: String, val: String, dataTarget: Number }]
    },
    standards: {
      sectionTitle: { type: String, default: 'Visible Standards' },
      subtitle: { type: String, default: 'Operational Efficacy' },
      description: { type: String, default: "We don't just maintain; we restore. Observe the forensic difference." },
      bulletPoints: [{ type: String }],
      comparisonBefore: { type: String },
      comparisonAfter: { type: String },
      labelBefore: { type: String, default: 'Initial State' },
      labelAfter: { type: String, default: 'FIC Sanitized Profile' }
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const HomeUIConfig = mongoose.model('HomeUIConfig', homeUIConfigSchema);
module.exports = HomeUIConfig;
