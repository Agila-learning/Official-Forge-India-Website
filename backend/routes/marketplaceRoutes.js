const express = require('express');
const router = express.Router();
const { 
  getCategories, 
  getSubCategories, 
  getServices, 
  getServiceDetails 
} = require('../controllers/marketplaceController');

// Categories
router.get('/categories', getCategories);
router.get('/subcategories/:categoryRef', getSubCategories);

// Services
router.get('/services', getServices);
router.get('/services/:slug', getServiceDetails);

module.exports = router;
