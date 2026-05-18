const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

// @desc    Create a new booking (Supports authenticated users and guest checkouts)
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const { 
      serviceSlug, 
      serviceName, 
      bookingData, 
      totalPrice, 
      name, 
      email, 
      contactNumber, 
      paymentMethod 
    } = req.body;

    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'forge_secret_key_123');
        userId = decoded.id;
      } catch (err) {
        // Fallback to guest if token is invalid or expired
      }
    }

    const booking = new Booking({
      user: userId,
      serviceSlug,
      serviceName,
      bookingData: bookingData || {},
      totalPrice: totalPrice || 0,
      paymentMethod: paymentMethod || 'Online',
      paymentStatus: paymentMethod === 'Cash' ? 'Unpaid' : 'Paid', // Assume online is paid for now (or integrated with RP)
      name: userId ? null : name,
      email: userId ? null : email,
      contactNumber
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = req.body.status || booking.status;
      booking.paymentStatus = req.body.paymentStatus || booking.paymentStatus;
      
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getMyBookings,
  updateBookingStatus
};
