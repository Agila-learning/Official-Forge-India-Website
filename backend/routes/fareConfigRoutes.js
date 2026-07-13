const express = require('express');
const router = express.Router();
const {
  getAllFareConfigs,
  getAllFareConfigsAdmin,
  updateFareConfig,
  estimateFareFromConfig,
} = require('../controllers/fareConfigController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllFareConfigs);                            // Public
router.get('/all', protect, admin, getAllFareConfigsAdmin);   // Admin all
router.post('/estimate', protect, estimateFareFromConfig);    // Authenticated estimate
router.put('/:type', protect, admin, updateFareConfig);       // Admin update

module.exports = router;
