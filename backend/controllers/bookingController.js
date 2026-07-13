const ServiceBooking = require('../models/ServiceBooking');
const HotelBooking = require('../models/HotelBooking');
const PGBooking = require('../models/PGBooking');
const RentalBooking = require('../models/RentalBooking');
const Booking = require('../models/Booking'); // Legacy

// Factory function for creating bookings to keep it DRY
const createGenericBooking = (Model) => async (req, res) => {
  try {
    const booking = new Model({ ...req.body, customer: req.user ? req.user._id : req.body.customer });
    const created = await booking.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getGenericBookings = (Model) => async (req, res) => {
  try {
    const bookings = await Model.find({}).populate('customer', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGenericMyBookings = (Model) => async (req, res) => {
  try {
    const bookings = await Model.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGenericBookingStatus = (Model) => async (req, res) => {
  try {
    const booking = await Model.findById(req.params.id);
    if (booking) {
      if (req.body.status) booking.status = req.body.status;
      if (req.body.paymentStatus) booking.paymentStatus = req.body.paymentStatus;
      const updated = await booking.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Legacy Booking (for backward compat if needed)
exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, user: req.user ? req.user._id : null });
    const created = await booking.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getBookings = getGenericBookings(Booking);
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateBookingStatus = updateGenericBookingStatus(Booking);

// Service Bookings
exports.createServiceBooking = createGenericBooking(ServiceBooking);
exports.getServiceBookings = getGenericBookings(ServiceBooking);
exports.getMyServiceBookings = getGenericMyBookings(ServiceBooking);
exports.updateServiceBookingStatus = updateGenericBookingStatus(ServiceBooking);

// Hotel Bookings
exports.createHotelBooking = createGenericBooking(HotelBooking);
exports.getHotelBookings = getGenericBookings(HotelBooking);
exports.getMyHotelBookings = getGenericMyBookings(HotelBooking);
exports.updateHotelBookingStatus = updateGenericBookingStatus(HotelBooking);

// PG Bookings
exports.createPGBooking = createGenericBooking(PGBooking);
exports.getPGBookings = getGenericBookings(PGBooking);
exports.getMyPGBookings = getGenericMyBookings(PGBooking);
exports.updatePGBookingStatus = updateGenericBookingStatus(PGBooking);

// Rental Bookings
exports.createRentalBooking = createGenericBooking(RentalBooking);
exports.getRentalBookings = getGenericBookings(RentalBooking);
exports.getMyRentalBookings = getGenericMyBookings(RentalBooking);
exports.updateRentalBookingStatus = updateGenericBookingStatus(RentalBooking);
