const mongoose = require('mongoose');

const rideAssignmentSchema = new mongoose.Schema({
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  status: {
    type: String,
    enum: ['Pinged', 'Accepted', 'Rejected', 'Timeout', 'Cancelled'],
    default: 'Pinged'
  },
  pingTime: { type: Date, default: Date.now },
  responseTime: { type: Date },
  distanceToPickup: { type: Number }, // Estimated distance when pinged
  estimatedTimeToPickup: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('RideAssignment', rideAssignmentSchema);
