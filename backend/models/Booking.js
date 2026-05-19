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
    paymentStatus: { 
      type: String, 
      enum: ['Pending', 'Paid', 'Partially Paid', 'Failed', 'Refunded', 'Cancelled', 'Scheduled'], 
      default: 'Pending' 
    },
    paymentMethod: { type: String, enum: ['Cash', 'Online'], default: 'Online' },
    advancePaid: { type: Number, default: 0 },
    remainingDue: { type: Number, default: 0 },
    dueDate: { type: Date },
    autoCancelAt: { type: Date },
    settlementStatus: { 
      type: String, 
      enum: ['Pending', 'Processing', 'Settled', 'Hold'], 
      default: 'Pending' 
    },
    name: { type: String }, // For guest bookings
    email: { type: String }, // For guest bookings
    contactNumber: { type: String, required: true }
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
