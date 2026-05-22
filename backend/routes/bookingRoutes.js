const express = require('express');
const { createBooking, getBookings, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(createBooking)
  .get(protect, admin, getBookings);

router.route('/my-bookings')
  .get(protect, getMyBookings);

router.route('/:id/status')
  .put(protect, admin, updateBookingStatus);

router.route('/:id')
  .delete(protect, admin, async (req, res) => {
    try {
      const Booking = require('../models/Booking');
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      await booking.deleteOne();
      res.json({ message: 'Booking deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
