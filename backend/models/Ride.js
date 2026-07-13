const mongoose = require('mongoose');

const rideSchema = mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickupLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true }
    },
    dropLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true }
    },
    vehicleType: { type: String, required: true },
    status: {
      type: String,
      enum: ['Requested', 'Accepted', 'Arrived', 'Started', 'Completed', 'Cancelled'],
      default: 'Requested'
    },
    fareEstimate: { type: Number, required: true },
    finalFare: { type: Number },
    distanceKm: { type: Number },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending'
    },
    paymentMethod: { type: String, enum: ['Cash', 'Online'], default: 'Cash' },
    commission: { type: Number, default: 0 },
    cancellationReason: { type: String },
    
    // Phase 2 Fields
    emergencyEvents: [{
      eventType: { type: String }, // e.g. 'SOS', 'Crash Detection', 'Route Deviation'
      timestamp: { type: Date, default: Date.now },
      location: {
        lat: { type: Number },
        lng: { type: Number }
      }
    }],
    rideSafetyScore: { type: Number }, // Out of 100
    womenSafetyMode: { type: Boolean, default: false },

    startedAt: { type: Date },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;
