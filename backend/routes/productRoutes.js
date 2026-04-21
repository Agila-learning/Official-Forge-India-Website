const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin, vendor } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getProducts).post(protect, vendor, createProduct);
router.route('/:id').get(getProductById).put(protect, vendor, updateProduct).delete(protect, vendor, deleteProduct);

module.exports = router;
