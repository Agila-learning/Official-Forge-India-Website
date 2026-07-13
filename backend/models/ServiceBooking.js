const mongoose = require('mongoose');

const serviceBookingSchema = mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketplaceService', required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'ServicePackage' },
    
    address: {
      location: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String },
      lat: { type: Number },
      lng: { type: Number }
    },
    
    schedule: {
      date: { type: Date, required: true },
      timeSlot: { type: String, required: true }
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
      enum: ['Requested', 'Confirmed', 'Technician Assigned', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Requested'
    },
    
    completionPhotos: [{ type: String }],
    cancellationReason: { type: String },
    
    startedAt: { type: Date },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

const ServiceBooking = mongoose.models.ServiceBooking || mongoose.model('ServiceBooking', serviceBookingSchema);
module.exports = ServiceBooking;
