const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    let query = {};
    if (req.user && (req.user.role === 'Vendor' || req.user.role === 'HR')) {
      query = { vendorId: req.user._id };
    }
    const products = await Product.find(query).populate('vendorId', 'businessName deliveryAvailable');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;
    
    // Check if it's a valid ObjectId first, else treat as slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id).populate('vendorId', 'businessName deliveryAvailable');
    } else {
        product = await Product.findOne({ slug: id }).populate('vendorId', 'businessName deliveryAvailable');
    }

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (productData.slots === "" || !Array.isArray(productData.slots)) productData.slots = [];
    
    // Ensure vendorId is a valid ObjectId string, not an empty string
    const targetVendorId = (req.body.vendorId && req.body.vendorId !== "") ? req.body.vendorId : req.user._id;
    productData.vendorId = targetVendorId;

    // Sanitize category references
    if (productData.categoryRef === "") productData.categoryRef = null;
    if (productData.subCategoryRef === "") productData.subCategoryRef = null;

    // Default image fallback
    if (!productData.image || productData.image.trim() === '') {
        productData.image = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80';
    }

    // Default description fallback
    if (!productData.description || productData.description.trim() === '') {
        productData.description = productData.name || 'Service provided by Forge India Connect';
    }

    // Default price
    if (!productData.price && productData.price !== 0) productData.price = 0;
    
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create Product Error:', error.message);
    // Return field-level validation errors
    if (error.name === 'ValidationError') {
        const fields = Object.keys(error.errors).map(f => `${f}: ${error.errors[f].message}`);
        return res.status(400).json({ message: `Validation failed: ${fields.join(', ')}` });
    }
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Authorization check
    if (req.user.role !== 'Admin' && product.vendorId?.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this product' });
    }

    const updates = { ...req.body };
    delete updates._id; // Prevent immutable _id modification error
    
    // Ensure vendorId is not an empty string during update
    if (updates.vendorId === "") {
        updates.vendorId = product.vendorId || req.user._id;
    }

    // Sanitize category references
    if (updates.categoryRef === "") updates.categoryRef = null;
    if (updates.subCategoryRef === "") updates.subCategoryRef = null;

    if (updates.slots === "") updates.slots = [];
    
    Object.assign(product, updates);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Authorization check
      if (req.user.role !== 'Admin' && product.vendorId?.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this product' });
      }
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
