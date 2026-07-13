const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'ownerModel', // Polymorphic relation (User or Admin/Company)
    required: true
  },
  ownerModel: {
    type: String,
    required: true,
    enum: ['User', 'Admin']
  },
  vehicleCategory: {
    type: String,
    enum: ['Bike', 'Auto', 'Mini', 'Sedan', 'SUV', 'Luxury', 'Tow Truck', 'Ambulance', 'Pickup Truck', 'Van', 'Other'],
    required: true
  },
  registrationNumber: { type: String, required: true, unique: true },
  make: { type: String },
  model: { type: String },
  year: { type: Number },
  color: { type: String },
  rcDocument: {
    url: String,
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
    expiryDate: Date
  },
  insuranceDocument: {
    url: String,
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
    expiryDate: Date
  },
  permitDocument: {
    url: String,
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
    expiryDate: Date
  },
  fitnessCertificate: {
    url: String,
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
    expiryDate: Date
  },
  pollutionCertificate: {
    url: String,
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
    expiryDate: Date
  },
  vehiclePhotos: [{ url: String, view: String }], // front, back, left, right, interior
  isActive: { type: Boolean, default: true },
  isCompanyAssigned: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
