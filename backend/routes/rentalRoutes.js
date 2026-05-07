const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const { RentalBooking } = require('../models/BookingExtensions');

// @desc    Get all rental listings
// @route   GET /api/rentals
router.get('/', async (req, res) => {
  try {
    const rentals = await Product.find({ isService: false, propertyType: { $ne: 'None' } });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Create a rental booking
// @route   POST /api/rentals/book
router.post('/book', protect, async (req, res) => {
  const { propertyId, checkInDate, checkOutDate, guests, totalPrice } = req.body;
  try {
    const property = await Product.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const booking = await RentalBooking.create({
      user: req.user._id,
      provider: property.vendorId,
      property: propertyId,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
