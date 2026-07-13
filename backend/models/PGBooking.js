const mongoose = require('mongoose');

const pgBookingSchema = mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pgId: { type: mongoose.Schema.Types.ObjectId, required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, required: true },
    
    moveInDate: { type: Date, required: true },
    durationMonths: { type: Number, default: 1 },
    
    documents: [{
      docType: { type: String }, // e.g., Aadhaar, PAN
      url: { type: String },
      verified: { type: Boolean, default: false }
    }],
    
    pricing: {
      monthlyRent: { type: Number, required: true },
      securityDeposit: { type: Number, required: true },
      platformFee: { type: Number, default: 0 },
      totalInitialAmount: { type: Number, required: true }, // Rent + Deposit + Fee
      amountPaid: { type: Number, default: 0 }
    },
    
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Deposit Paid', 'Fully Paid', 'Refunded', 'Failed'],
      default: 'Pending'
    },
    
    status: {
      type: String,
      enum: ['Requested', 'Documents Pending', 'Confirmed', 'Active', 'Vacated', 'Cancelled'],
      default: 'Requested'
    },
    
    cancellationReason: { type: String }
  },
  { timestamps: true }
);

const PGBooking = mongoose.models.PGBooking || mongoose.model('PGBooking', pgBookingSchema);
module.exports = PGBooking;
