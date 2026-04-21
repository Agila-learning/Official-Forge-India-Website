const mongoose = require('mongoose');

const homeSubCategorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'HomeCategory', required: true },
    image: { type: String },
    description: { type: String },
    flowType: { 
        type: String, 
        enum: ['BHK-Based', 'Sqft-Based', 'Slot-Only', 'Count-Based'], 
        default: 'Slot-Only' 
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const HomeSubCategory = mongoose.model('HomeSubCategory', homeSubCategorySchema);
module.exports = HomeSubCategory;
