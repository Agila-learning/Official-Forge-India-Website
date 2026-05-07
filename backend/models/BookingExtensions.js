const mongoose = require('mongoose');

// ─── RENTAL BOOKING MODEL ─────────────────────────────────────────────
const rentalBookingSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reusing Product for Rental Listing
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date },
    guests: { type: Number, default: 1 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'CheckedIn', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String }
  },
  { timestamps: true }
);

// ─── RIDE BOOKING MODEL ───────────────────────────────────────────────
const rideBookingSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned later
    pickupLocation: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    dropLocation: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    distance: { type: Number }, // in km
    estimatedFare: { type: Number, required: true },
    actualFare: { type: Number },
    rideType: { type: String, enum: ['Bike', 'Car', 'Scooter', 'Auto'], default: 'Bike' },
    status: {
      type: String,
      enum: ['Searching', 'Accepted', 'Arrived', 'InRide', 'Completed', 'Cancelled'],
      default: 'Searching'
    },
    otp: { type: String }, // Ride start OTP
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
    paymentMethod: { type: String, enum: ['Cash', 'Wallet', 'Online'], default: 'Online' }
  },
  { timestamps: true }
);

const RentalBooking = mongoose.model('RentalBooking', rentalBookingSchema);
const RideBooking = mongoose.model('RideBooking', rideBookingSchema);

module.exports = { RentalBooking, RideBooking };
