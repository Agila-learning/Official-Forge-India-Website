const express = require('express');
const {
  createBooking, getBookings, getMyBookings, updateBookingStatus,
  createServiceBooking, getServiceBookings, getMyServiceBookings, updateServiceBookingStatus,
  createHotelBooking, getHotelBookings, getMyHotelBookings, updateHotelBookingStatus,
  createPGBooking, getPGBookings, getMyPGBookings, updatePGBookingStatus,
  createRentalBooking, getRentalBookings, getMyRentalBookings, updateRentalBookingStatus
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Helper to generate routes
const generateRoutes = (pathPrefix, createFn, getAllFn, getMyFn, updateFn) => {
  router.route(`/${pathPrefix}`)
    .post(protect, createFn)
    .get(protect, admin, getAllFn);
  
  router.route(`/${pathPrefix}/my-bookings`)
    .get(protect, getMyFn);
    
  router.route(`/${pathPrefix}/:id/status`)
    .put(protect, admin, updateFn);
};

// Generate for all distinct types
generateRoutes('service', createServiceBooking, getServiceBookings, getMyServiceBookings, updateServiceBookingStatus);
generateRoutes('hotel', createHotelBooking, getHotelBookings, getMyHotelBookings, updateHotelBookingStatus);
generateRoutes('pg', createPGBooking, getPGBookings, getMyPGBookings, updatePGBookingStatus);
generateRoutes('rental', createRentalBooking, getRentalBookings, getMyRentalBookings, updateRentalBookingStatus);

// Legacy routes (fallback)
router.route('/')
  .post(createBooking)
  .get(protect, admin, getBookings);
router.route('/my-bookings').get(protect, getMyBookings);
router.route('/:id/status').put(protect, admin, updateBookingStatus);
router.route('/:id').delete(protect, admin, async (req, res) => {
  const Booking = require('../models/Booking');
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
