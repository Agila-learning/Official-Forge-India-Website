const mongoose = require('mongoose');

const settlementSchema = mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    amount: {
      type: Number,
      required: true, // Amount to be paid to vendor
    },
    totalRevenue: {
      type: Number,
      required: true, // Total order value
    },
    commission: {
      type: Number,
      required: true, // Platform commission
    },
    tax: {
      type: Number,
      default: 0,
    },
    gatewayFee: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Processing', 'Settled', 'Failed', 'On Hold', 'Cancelled'],
      default: 'Pending',
    },
    payoutId: {
      type: String, // Razorpay Payout ID
    },
    payoutRef: {
      type: String, // Internal reference
    },
    processedAt: {
      type: Date,
    },
    failureReason: {
      type: String,
    },
    notes: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Settlement = mongoose.model('Settlement', settlementSchema);
module.exports = Settlement;
