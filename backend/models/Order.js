const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        isService: { type: Boolean, default: false },
        category: { type: String },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          ref: 'Product',
        },
        slot: {
            date: String,
            time: String
        },
        selectedConfig: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Stripe'
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String }
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Partially Paid', 'Failed', 'Refunded', 'Cancelled', 'Scheduled'],
      default: 'Pending'
    },
    advancePaid: { type: Number, default: 0 },
    remainingDue: { type: Number, default: 0 },
    dueDate: { type: Date },
    autoCancelAt: { type: Date },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    status: {
        type: String,
        enum: [
          'Order Confirmed', 
          'Partner Assigned',
          'Paid',
          'Packed', 
          'Packing Started',
          'Ready for Pickup', 
          'Picked Up', 
          'In Transit', 
          'Reached Hub',
          'Out for Delivery', 
          'Delivered', 
          'Completed',
          'Cancelled',
          'Refund Processing',
          'Refunded',
          'Return Requested',
          'Return Approved',
          'Return Rejected',
          'Returned',
          'Settlement Pending',
          'Settled'
        ],
        default: 'Order Confirmed'
    },
    fulfillmentType: { 
      type: String, 
      enum: [
        'Direct Shopping', 
        'Delivery Partner', 
        'Home Service Execution', 
        'Digital Fulfillment', 
        'Courier',
        'Technician Visit',
        'Remote Consultation',
        'Instant Activation'
      ],
      default: 'Direct Shopping'
    },
    pickupDetails: {
      location: { type: String },
      instructions: { type: String },
      window: { type: String }
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    instructions: {
      type: String
    },
    cancellationReason: {
      type: String
    },
    returnReason: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
