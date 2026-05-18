const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
  {
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
    bookingFields: { 
      type: Array, 
      default: [] 
    }, // Array of fields like [{ name: "pickup", label: "Pickup Location", type: "text", required: true }]
    features: { 
      type: Array, 
      default: [] 
    }, // Array of features like [{ title: "Verified Riders", description: "...", icon: "Shield" }]
    stats: { 
      type: Array, 
      default: [] 
    }, // Array of stats like [{ value: "100+", label: "Riders" }]
    status: { type: Boolean, default: true },
    serviceColor: {
      type: String,
      default: '#7C3AED' // Hex color string, or primary HSL tailwind
    }
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
