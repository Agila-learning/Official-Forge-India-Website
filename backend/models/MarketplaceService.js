const mongoose = require('mongoose');

const marketplaceServiceSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',
      required: true 
    },
    subCategory: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'SubCategory'
    },
    images: [{ type: String }],
    description: { type: String },
    duration: { type: String, default: '60 mins' },
    tags: [{ type: String }],
    basePrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    serviceRadius: { type: Number, default: 50 }, // in km
    requiredDocuments: [{ type: String }], // Array of document types like "RC Book", "Trade License"
    status: { type: Boolean, default: true },
    isAvailableToday: { type: Boolean, default: true },
    pricingType: {
      type: String,
      enum: ['fixed', 'hourly', 'distance', 'custom'],
      default: 'fixed'
    }
  },
  { timestamps: true }
);

const MarketplaceService = mongoose.model('MarketplaceService', marketplaceServiceSchema);
module.exports = MarketplaceService;
