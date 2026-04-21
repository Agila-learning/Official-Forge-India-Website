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
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        slot: {
            date: String,
            time: String
        },
        selectedConfig: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        isService: { type: Boolean, default: false }
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
          'Packed', 
          'Ready for Pickup', 
          'Picked Up', 
          'Partner Assigned', 
          'In Transit', 
          'Out for Delivery', 
          'Delivered', 
          'Cancelled',
          'Completed',
          'Rescheduled'
        ],
        default: 'Order Confirmed'
    },
    rescheduledAt: {
      type: Date
    },
    previousSlot: {
        date: String,
        time: String
    },
    fulfillmentType: { 
      type: String, 
      enum: ['Direct Shopping', 'Delivery Partner'],
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
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
