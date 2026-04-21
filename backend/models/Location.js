const mongoose = require('mongoose');

const locationSchema = mongoose.Schema(
  {
    pincode: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    isServiceable: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
