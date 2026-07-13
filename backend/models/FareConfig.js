const mongoose = require('mongoose');

const fareConfigSchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    required: true,
    unique: true,
    enum: ['Bike', 'Auto', 'Mini', 'Sedan', 'SUV', 'Luxury', 'Van', 'Pickup Truck', 'Delivery Service']
  },
  displayName: { type: String },   // e.g. "Bike Taxi", "Auto Rickshaw"
  baseFare: { type: Number, default: 20 },        // ₹ flat charge at start
  perKmRate: { type: Number, default: 8 },         // ₹ per km
  perMinRate: { type: Number, default: 1 },         // ₹ per minute
  minimumFare: { type: Number, default: 30 },      // Minimum billable fare
  waitingChargePerMin: { type: Number, default: 1 }, // ₹ per minute driver waits
  commissionPct: { type: Number, default: 20 },    // Platform commission %
  // Surge multipliers
  peakSurge: { type: Number, default: 1.3 },       // Weekdays 8-10am / 5-8pm
  nightSurge: { type: Number, default: 1.5 },      // 11pm - 5am
  peakHoursStart: { type: Number, default: 8 },    // 8 AM
  peakHoursEnd: { type: Number, default: 22 },     // 10 PM
  nightHoursStart: { type: Number, default: 23 },  // 11 PM
  nightHoursEnd: { type: Number, default: 5 },     // 5 AM
  // Serviceability
  isActive: { type: Boolean, default: true },
  iconEmoji: { type: String, default: '🚗' },
  colorHex: { type: String, default: '#3B82F6' },  // For UI badges
}, { timestamps: true });

module.exports = mongoose.model('FareConfig', fareConfigSchema);
