const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const MarketplaceService = require('../models/MarketplaceService');
const ServicePackage = require('../models/ServicePackage');

// @desc    Get all categories
// @route   GET /api/marketplace/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: true }).sort({ displayOrder: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get subcategories by category slug or ID
// @route   GET /api/marketplace/subcategories/:categoryRef
// @access  Public
const getSubCategories = async (req, res) => {
  try {
    const categoryRef = req.params.categoryRef;
    let query = {};
    if (categoryRef.match(/^[0-9a-fA-F]{24}$/)) {
      query.parentCategory = categoryRef;
    } else {
      const cat = await Category.findOne({ slug: categoryRef });
      if (!cat) return res.status(404).json({ message: 'Category not found' });
      query.parentCategory = cat._id;
    }
    query.status = true;
    
    const subcats = await SubCategory.find(query).sort({ displayOrder: 1 });
    res.json(subcats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get services by category or subcategory
// @route   GET /api/marketplace/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const { categoryId, subCategoryId, search } = req.query;
    let query = { status: true };
    
    if (categoryId) query.category = categoryId;
    if (subCategoryId) query.subCategory = subCategoryId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await MarketplaceService.find(query)
      .populate('category', 'name slug themeColor')
      .populate('subCategory', 'name slug');
      
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get service details including packages
// @route   GET /api/marketplace/services/:slug
// @access  Public
const getServiceDetails = async (req, res) => {
  try {
    const service = await MarketplaceService.findOne({ slug: req.params.slug, status: true })
      .populate('category', 'name slug themeColor icon')
      .populate('subCategory', 'name slug');
      
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const packages = await ServicePackage.find({ service: service._id, status: true }).sort({ price: 1 });
    
    res.json({ service, packages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCategories,
  getSubCategories,
  getServices,
  getServiceDetails
};
