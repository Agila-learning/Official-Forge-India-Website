const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    inStock: { type: Boolean, default: true },
    countInStock: { type: Number, default: 50 },
    viewImages: {
      front: { type: String },
      back: { type: String },
      top: { type: String },
      bottom: { type: String }
    },
    discountPrice: { type: Number },
    tags: [{ type: String }],
    availability: { type: String, default: 'All India' },
    pincode: { type: String }, // For location-based filtering
    shopName: { type: String }, // For shop name filtering
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isService: { type: Boolean, default: false },
    serviceType: { 
      type: String, 
      enum: ['Cleaning', 'Painting', 'Plumbing', 'Carpentry', 'Electrical', 'Tiling', 'Inspection', 'None'],
      default: 'None'
    },
    serviceConfig: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    pricingRules: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    highlights: [{ type: String }],
    whatsIncluded: [{ type: String }],
    whatsExcluded: [{ type: String }],
    duration: { type: String },
    warranty: { type: String },
    slots: [{ 
      date: String, 
      times: [String],
      isAvailable: { type: Boolean, default: true }
    }],
    fulfillmentType: { type: String, enum: ['Direct Shopping', 'Delivery Partner'], default: 'Direct Shopping' },
    pickupInstructions: { type: String },
    deliveryCharge: { type: Number, default: 0 },
    freeDeliveryThreshold: { type: Number, default: 0 },
    estimatedPickupTime: { type: String },
    estimatedDeliveryTime: { type: String },
    serviceableArea: [{ type: String }],
    gstPercentage: { type: Number, default: 18 },
    beforeImage: { type: String }, // For before/after comparison
    afterImage: { type: String },  // For before/after comparison
    proCount: { type: Number, default: 0 }, // Number of professionals
    estimatedTime: { type: String }, // Estimated time for completion
    hoverVideo: { type: String }, // Cloudinary/YouTube URL for hover preview
    badgeLabel: { type: String }, // "Most Booked", "Premium", etc.
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    categoryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'HomeCategory' },
    subCategoryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'HomeSubCategory' },
    propertyType: { type: String, enum: ['Apartment', 'Individual House', 'None'], default: 'None' },
    furnishingStatus: { type: String, enum: ['Furnished', 'Unfurnished', 'None'], default: 'None' },
    bhkType: { type: String }, // e.g. '1BHK', '2BHK'
    sqft: { type: Number },
    teamSize: { type: Number, default: 0 },
    equipmentProvided: { type: Boolean, default: false },
    safetyMeasures: [{ type: String }],
    serviceTerms: { type: String }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
