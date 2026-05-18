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

module.exports = router;
