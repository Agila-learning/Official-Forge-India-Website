const mongoose = require('mongoose');

const homeCategorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const HomeCategory = mongoose.model('HomeCategory', homeCategorySchema);
module.exports = HomeCategory;
