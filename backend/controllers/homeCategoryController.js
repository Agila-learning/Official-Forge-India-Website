const HomeCategory = require('../models/HomeCategory');
const HomeSubCategory = require('../models/HomeSubCategory');
const asyncHandler = require('express-async-handler');

// @desc    Get all Home Categories
// @route   GET /api/home-categories
// @access  Public
const getHomeCategories = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.type && ['product', 'service'].includes(req.query.type)) {
    filter.type = req.query.type;
  }
  const categories = await HomeCategory.find(filter).sort('order');
  res.json(categories);
});

// @desc    Create a Home Category
// @route   POST /api/home-categories
// @access  Private/Admin
const createHomeCategory = asyncHandler(async (req, res) => {
  let { name, slug, order, isActive, type } = req.body;
  if (!slug && name) {
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  const category = await HomeCategory.create({ name, slug, order, isActive, type: type || 'product' });
  res.status(201).json(category);
});

// @desc    Update a Home Category
// @route   PUT /api/home-categories/:id
// @access  Private/Admin
const updateHomeCategory = asyncHandler(async (req, res) => {
  const category = await HomeCategory.findById(req.params.id);
  if (category) {
    category.name = req.body.name || category.name;
    category.slug = req.body.slug || category.slug;
    category.order = req.body.order !== undefined ? req.body.order : category.order;
    category.isActive = req.body.isActive !== undefined ? req.body.isActive : category.isActive;
    if (req.body.type && ['product', 'service'].includes(req.body.type)) {
      category.type = req.body.type;
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Delete a Home Category
// @route   DELETE /api/home-categories/:id
// @access  Private/Admin
const deleteHomeCategory = asyncHandler(async (req, res) => {
  const category = await HomeCategory.findById(req.params.id);
  if (category) {
    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Get all Home Sub-Categories
// @route   GET /api/home-categories/sub
// @access  Public
const getHomeSubCategories = asyncHandler(async (req, res) => {
  const subCategories = await HomeSubCategory.find({}).populate('categoryId').sort('order');
  res.json(subCategories);
});

// @desc    Get Sub-Categories for a specific category
// @route   GET /api/home-categories/:categoryId/sub
// @access  Public
const getSubCategoriesByCategory = asyncHandler(async (req, res) => {
    const subCategories = await HomeSubCategory.find({ categoryId: req.params.categoryId }).sort('order');
    res.json(subCategories);
});

// @desc    Create a Home Sub-Category
// @route   POST /api/home-categories/sub
// @access  Private/Admin
const createHomeSubCategory = asyncHandler(async (req, res) => {
  const { name, slug, categoryId, image, description, flowType, order, isActive } = req.body;
  
  // Validation for internal tracking
  if (!name || !slug || !categoryId) {
    res.status(400);
    throw new Error('Name, slug, and categoryId are required fields');
  }

  try {
    const subCategory = await HomeSubCategory.create({ 
        name, slug, categoryId, image, description, flowType, order, isActive 
    });
    res.status(201).json(subCategory);
  } catch (error) {
    console.error('Sub-category Creation Error:', error);
    res.status(500);
    throw new Error(`Protocol Failure: ${error.message}`);
  }
});

// @desc    Update a Home Sub-Category
// @route   PUT /api/home-categories/sub/:id
// @access  Private/Admin
const updateHomeSubCategory = asyncHandler(async (req, res) => {
  const subCategory = await HomeSubCategory.findById(req.params.id);
  if (subCategory) {
    subCategory.name = req.body.name || subCategory.name;
    subCategory.slug = req.body.slug || subCategory.slug;
    subCategory.categoryId = req.body.categoryId || subCategory.categoryId;
    subCategory.image = req.body.image || subCategory.image;
    subCategory.description = req.body.description || subCategory.description;
    subCategory.flowType = req.body.flowType || subCategory.flowType;
    subCategory.order = req.body.order !== undefined ? req.body.order : subCategory.order;
    subCategory.isActive = req.body.isActive !== undefined ? req.body.isActive : subCategory.isActive;

    const updatedSubCategory = await subCategory.save();
    res.json(updatedSubCategory);
  } else {
    res.status(404);
    throw new Error('Sub-Category not found');
  }
});

// @desc    Delete a Home Sub-Category
// @route   DELETE /api/home-categories/sub/:id
// @access  Private/Admin
const deleteHomeSubCategory = asyncHandler(async (req, res) => {
  const subCategory = await HomeSubCategory.findById(req.params.id);
  if (subCategory) {
    await subCategory.deleteOne();
    res.json({ message: 'Sub-Category removed' });
  } else {
    res.status(404);
    throw new Error('Sub-Category not found');
  }
});

module.exports = {
  getHomeCategories,
  createHomeCategory,
  updateHomeCategory,
  deleteHomeCategory,
  getHomeSubCategories,
  getSubCategoriesByCategory,
  createHomeSubCategory,
  updateHomeSubCategory,
  deleteHomeSubCategory
};
