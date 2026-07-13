const mongoose = require('mongoose');

const hotelBookingSchema = mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hotelId: { type: mongoose.Schema.Types.ObjectId, required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, required: true },
    
    guests: {
      adults: { type: Number, required: true, default: 1 },
      children: { type: Number, default: 0 }
    },
    
    dates: {
      checkIn: { type: Date, required: true },
      checkOut: { type: Date, required: true },
      totalNights: { type: Number, required: true }
    },
    
    pricing: {
      basePrice: { type: Number, required: true },
      taxes: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
      advancePaid: { type: Number, default: 0 },
      remainingDue: { type: Number, default: 0 }
    },
    
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Advance Paid', 'Fully Paid', 'Refunded', 'Failed'],
      default: 'Pending'
    },
    
    status: {
      type: String,
      enum: ['Requested', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'],
      default: 'Requested'
    },
    
    cancellationReason: { type: String }
  },
  { timestamps: true }
);

const HotelBooking = mongoose.models.HotelBooking || mongoose.model('HotelBooking', hotelBookingSchema);
module.exports = HotelBooking;
