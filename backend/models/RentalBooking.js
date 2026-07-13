const mongoose = require('mongoose');

const rentalBookingSchema = mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // The product/equipment being rented
    
    duration: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      totalDays: { type: Number, required: true }
    },
    
    deliveryAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String }
    },
    
    pricing: {
      rentalCharge: { type: Number, required: true },
      securityDeposit: { type: Number, required: true },
      deliveryFee: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
      amountPaid: { type: Number, default: 0 }
    },
    
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Deposit Paid', 'Fully Paid', 'Refunded', 'Failed'],
      default: 'Pending'
    },
    
    status: {
      type: String,
      enum: ['Requested', 'Confirmed', 'Out for Delivery', 'Active', 'Return Requested', 'Completed', 'Cancelled'],
      default: 'Requested'
    },
    
    cancellationReason: { type: String }
  },
  { timestamps: true }
);

const RentalBooking = mongoose.models.RentalBooking || mongoose.model('RentalBooking', rentalBookingSchema);
module.exports = RentalBooking;
