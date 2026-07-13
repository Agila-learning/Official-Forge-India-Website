const express = require('express');
const router = express.Router();
const {
  estimateFare,
  requestRide,
  getNearbyRides,
  getPendingRides,
  acceptRide,
  updateRideStatus,
  rateRide,
  getRides,
  logEmergency,
  submitSafetyScore,
  getSafetyReports,
  getDriverContext,
  updateDriverLocation,
  updateDriverStatus,
} = require('../controllers/rideController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateDriverReadiness } = require('../middleware/driverValidation');

// Driver context (must be before /:id routes)
router.get('/driver/context', protect, getDriverContext);
router.put('/driver/location', protect, updateDriverLocation);
router.put('/driver/status', protect, updateDriverStatus);

router.get('/', protect, validateDriverReadiness, getRides);
router.get('/mine', protect, getRides);
router.post('/estimate', protect, estimateFare);
router.post('/request', protect, requestRide);
router.get('/nearby', protect, validateDriverReadiness, getNearbyRides);
router.get('/pending', protect, getPendingRides); // Lighter endpoint - no strict doc validation
router.put('/:id/accept', protect, validateDriverReadiness, acceptRide);
router.put('/:id/status', protect, updateRideStatus);  // removed validateDriverReadiness so customer can cancel
router.put('/:id/rate', protect, rateRide);

// Phase 2 Routes
router.post('/:id/emergency', protect, logEmergency);
router.post('/:id/safety-score', protect, submitSafetyScore);
router.get('/admin/safety-reports', protect, admin, getSafetyReports);

module.exports = router;
