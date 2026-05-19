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
          'Searching Driver',
          'Driver Assigned',
          'Driver Arriving',
          'Ride Started',
          'Reached Destination',
          'Order Confirmed', 
          'Paid',
          'Packed', 
          'Packing Started',
          'Ready for Pickup', 
          'Picked Up', 
          'Partner Assigned', 
          'In Transit', 
          'Reached Hub',
          'Out for Delivery', 
          'Delivered', 
          'Completed',
          'Cancelled',
          'Rescheduled',
          'Refund Processing',
          'Refunded',
          'Settlement Pending',
          'Settled',
          'Survey Scheduled',
          'Packing Team Assigned',
          'Loading Completed',
          'Moving In Transit',
          'Unloading Started'
        ],
        default: 'Order Confirmed'
    },
    serviceType: {
      type: String,
      enum: ['Bike Taxi', 'Car Taxi', 'Parcel Delivery', 'Express Delivery', 'Packers & Movers', 'Rental', 'General'],
      default: 'General'
    },
    rideMetadata: {
      otp: { type: String },
      driverRating: { type: Number },
      vehicleNumber: { type: String },
      vehicleModel: { type: String },
      estimatedArrival: { type: Date }
    },
    logisticsMetadata: {
      weight: { type: String },
      inventory: [{ name: String, qty: Number }],
      insuranceStatus: { type: String, enum: ['Active', 'None'], default: 'None' },
      deliveryPriority: { type: String, enum: ['Standard', 'Express', 'Critical'], default: 'Standard' },
      currentHub: { type: String }
    },
    liveTracking: {
      currentLat: { type: Number },
      currentLng: { type: Number },
      lastUpdate: { type: Date }
    },
    settlementStatus: {
      type: String,
      enum: ['None', 'Pending', 'Approved', 'Processing', 'Settled', 'Failed', 'On Hold'],
      default: 'None'
    },
    commissionApplied: {
      type: Number,
      default: 0
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
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
