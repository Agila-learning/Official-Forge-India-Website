const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  driverType: {
    type: String,
    enum: ['Bike', 'Auto', 'Taxi', 'Cab', 'Delivery Partner', 'Logistics Driver'],
    required: true
  },
  vehicleOwnership: {
    type: String,
    enum: ['Own Vehicle', 'Company Assigned Vehicle'],
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Documents Uploaded', 'Under Review', 'Verified', 'Suspended', 'Rejected'],
    default: 'Pending'
  },
  activeVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  shiftStatus: {
    type: String,
    enum: ['Offline', 'Online', 'On Trip', 'Break', 'Emergency'],
    default: 'Offline'
  },
  stats: {
    totalTrips: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    acceptanceRate: { type: Number, default: 100 },
    cancellationRate: { type: Number, default: 0 }
  },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    heading: { type: Number },
    updatedAt: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
