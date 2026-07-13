const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema(
  {
    parentCategory: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',
      required: true 
    },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: 'List' }, // Lucide icon name
    description: { type: String },
    status: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;
