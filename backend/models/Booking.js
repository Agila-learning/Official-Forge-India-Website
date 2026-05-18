const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    serviceSlug: { type: String, required: true },
    serviceName: { type: String, required: true },
    bookingData: { type: mongoose.Schema.Types.Mixed, default: {} }, // E.g. pickup, drop, room type, date, etc.
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
    paymentMethod: { type: String, enum: ['Cash', 'Online'], default: 'Online' },
    name: { type: String }, // For guest bookings
    email: { type: String }, // For guest bookings
    contactNumber: { type: String, required: true }
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
