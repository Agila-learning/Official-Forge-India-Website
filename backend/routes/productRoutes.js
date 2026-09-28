const express = require('express');
const { getProducts, getVendorProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin, vendor } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const router = express.Router();

// @desc    Public product listing (no auth) — used for PG/Hotel/Rental customer pages
// @route   GET /api/products/public?category=Rentals&propertyType=PG&location=Coimbatore
router.get('/public', async (req, res) => {
  try {
    const { category, propertyType, vehicleType, location, limit = 50 } = req.query;
    let filter = {};
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    if (propertyType) filter.propertyType = { $regex: propertyType, $options: 'i' };
    if (vehicleType) filter.vehicleType = { $regex: vehicleType, $options: 'i' };
    // Location filter — matches against product.location field (city/area)
    if (location) {
      filter.$or = [
        { location: { $regex: location, $options: 'i' } },
        { serviceableArea: { $elemMatch: { $regex: location, $options: 'i' } } }
      ];
    }
    
    // If no filters, default to showing Rentals/Stays/Hotels categories
    if (!category && !propertyType && !vehicleType) {
      const baseOr = [
        { category: { $regex: 'rental|stay|hotel|villa|pg|hostel|room', $options: 'i' } },
        { propertyType: { $exists: true, $ne: 'None', $ne: null } }
      ];
      filter.$or = filter.$or ? [...(filter.$or || []), ...baseOr] : baseOr;
    }
    
    const products = await Product.find(filter)
      .select('name description price image category propertyType vehicleType location amenities isAvailable rating slots vendorId createdAt viewImages')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.route('/vendor').get(protect, vendor, getVendorProducts);

router.route('/').get(getProducts).post(protect, vendor, createProduct);
router.route('/:id').get(getProductById).put(protect, vendor, updateProduct).delete(protect, vendor, deleteProduct);

module.exports = router;
