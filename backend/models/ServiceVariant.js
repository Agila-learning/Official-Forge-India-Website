const mongoose = require('mongoose');

const serviceVariantSchema = mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true }, // e.g. "Basic Cleaning", "Foam Cleaning"
    description: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    duration: { type: String }, // e.g. "2 Hours", "1 Day"
    addOns: [
      {
        name: { type: String },
        price: { type: Number },
        unit: { type: String }
      }
    ],
    isActive: { type: Boolean, default: true },
    membershipDiscount: { type: Number, default: 0 } // Percentage discount for members
  },
  { timestamps: true }
);

const ServiceVariant = mongoose.model('ServiceVariant', serviceVariantSchema);
module.exports = ServiceVariant;
