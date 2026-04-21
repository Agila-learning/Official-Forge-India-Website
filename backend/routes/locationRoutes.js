const express = require('express');
const { getLocations, checkLocation, addLocation, updateLocation, deleteLocation } = require('../controllers/locationController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', getLocations);
router.get('/check/:pincode', checkLocation);

// Admin-only management
router.post('/', protect, admin, addLocation);

router.route('/:id')
  .put(protect, admin, updateLocation)
  .delete(protect, admin, deleteLocation);

module.exports = router;
