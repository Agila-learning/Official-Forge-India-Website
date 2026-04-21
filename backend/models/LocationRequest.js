const mongoose = require('mongoose');

const locationRequestSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    location: { type: String, required: true }, // The requested city/area
    industry: { type: String }, // Industry/Service type
    message: { type: String },
    status: { 
      type: String, 
      enum: ['Pending', 'Reviewed', 'Integrated'], 
      default: 'Pending' 
    }
  },
  { timestamps: true }
);

const LocationRequest = mongoose.model('LocationRequest', locationRequestSchema);
module.exports = LocationRequest;
