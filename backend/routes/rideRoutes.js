const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { RideBooking } = require('../models/BookingExtensions');

// @desc    Request a ride
// @route   POST /api/rides/request
router.post('/request', protect, async (req, res) => {
  const { pickupLocation, dropLocation, rideType, estimatedFare, distance } = req.body;
  try {
    const ride = await RideBooking.create({
      user: req.user._id,
      pickupLocation,
      dropLocation,
      rideType,
      estimatedFare,
      distance,
      status: 'Searching',
      otp: Math.floor(1000 + Math.random() * 9000).toString()
    });

    // In a real app, we would emit a socket event here to nearby providers
    const io = req.app.get('io');
    if (io) {
      io.emit('new-ride-request', ride);
    }

    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get current user's ride history
// @route   GET /api/rides/mine
router.get('/mine', protect, async (req, res) => {
  try {
    const rides = await RideBooking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
