const mongoose = require('mongoose');

const driverDocumentSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
    unique: true
  },
  aadhaar: {
    number: String,
    frontImageUrl: String,
    backImageUrl: String,
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }
  },
  pan: {
    number: String,
    imageUrl: String,
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }
  },
  drivingLicense: {
    number: String,
    frontImageUrl: String,
    backImageUrl: String,
    expiryDate: Date,
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }
  },
  policeVerification: {
    url: String,
    issueDate: Date,
    expiryDate: Date,
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected', 'Not Uploaded'], default: 'Not Uploaded' }
  },
  profilePhoto: {
    url: String,
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }
  }
}, { timestamps: true });

module.exports = mongoose.model('DriverDocument', driverDocumentSchema);
