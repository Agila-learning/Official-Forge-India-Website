const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    serviceName: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    bannerImage: { type: String },
    icon: { type: String, default: 'Zap' }, // e.g. "Zap", "Truck", "Home", "Building2"
    category: { type: String, required: true }, // e.g. "Rides", "Stays", "Services"
    subCategory: { type: String },
    pricingType: { 
      type: String, 
      enum: ['fixed', 'distance', 'hourly', 'custom'], 
      default: 'fixed' 
    },
    basePrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    duration: { type: String }, // e.g. "60 mins"
    tags: { type: [String], default: [] },
    serviceImages: { type: [String], default: [] },
    availableCities: { type: [String], default: [] },
    serviceRadius: { type: Number, default: 10 }, // km
    requiredDocuments: { type: [String], default: [] },
    bookingFields: { 
      type: Array, 
      default: [] 
    },
    features: { 
      type: Array, 
      default: [] 
    },
    stats: { 
      type: Array, 
      default: [] 
    },
    status: { type: Boolean, default: true },
    serviceColor: {
      type: String,
      default: '#7C3AED'
    }
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
