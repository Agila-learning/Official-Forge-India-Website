const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: 'LayoutDashboard' }, // Lucide icon name
    bannerImage: { type: String },
    description: { type: String },
    status: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    themeColor: { type: String, default: '#7C3AED' }
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
