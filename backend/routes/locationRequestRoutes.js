const express = require('express');
const router = express.Router();
const { createLocationRequest, getLocationRequests, updateLocationRequestStatus, deleteLocationRequest } = require('../controllers/locationRequestController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', createLocationRequest); // Public route
router.get('/', protect, admin, getLocationRequests); // Admin only
router.put('/:id', protect, admin, updateLocationRequestStatus); // Admin only
router.delete('/:id', protect, admin, deleteLocationRequest); // Admin only

module.exports = router;
