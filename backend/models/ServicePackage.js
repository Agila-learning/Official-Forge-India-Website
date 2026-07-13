const mongoose = require('mongoose');

const servicePackageSchema = mongoose.Schema(
  {
    service: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Service',
      required: true 
    },
    tier: { 
      type: String, 
      enum: ['Basic', 'Standard', 'Premium', 'Enterprise'],
      required: true 
    },
    price: { type: Number, required: true },
    duration: { type: String }, // e.g. "60 mins"
    features: { type: [String], default: [] },
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    status: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Ensure a service can only have one package of each tier
servicePackageSchema.index({ service: 1, tier: 1 }, { unique: true });

const ServicePackage = mongoose.model('ServicePackage', servicePackageSchema);
module.exports = ServicePackage;
