const mongoose = require('mongoose');

const discountRuleSchema = new mongoose.Schema({
  percentage: { type: Number, default: 0 },       // e.g. 5, 10, 15
  limit: { type: Number, default: 0 },             // -1 = unlimited, 0 = not included, N = N uses
}, { _id: false });

const membershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  planCode: { type: String, unique: true, sparse: true },  // 'starter' | 'premium' | 'elite'
  description: { type: String },
  price: { type: Number, required: true },
  period: { type: String, default: '/month' },
  validityDays: { type: Number, default: 30 },

  // ── Per-Category Discount Rules ──────────────────────────────────────────
  cabDiscount:      { type: discountRuleSchema, default: {} }, // Cab/Taxi rides
  bikeDiscount:     { type: discountRuleSchema, default: {} }, // Bike taxi bookings
  hotelDiscount:    { type: discountRuleSchema, default: {} }, // Hotel/Stay bookings
  cleaningDiscount: { type: discountRuleSchema, default: {} }, // Home Cleaning services

  // ── Feature Flags ────────────────────────────────────────────────────────
  prioritySupport:      { type: Boolean, default: false },
  premiumPartnerAccess: { type: Boolean, default: false },
  instantBooking:       { type: Boolean, default: false },
  freeCancellationCount: { type: Number, default: 0 },  // -1 = unlimited
  exclusiveOffers: { type: String, default: 'None' },  // 'None' | 'Monthly' | 'Weekly'
  referralBonus:   { type: Number, default: 0 },        // ₹ amount per referral

  // ── Legacy / Generic Fields (kept for backward compat) ───────────────────
  discountPercentage: { type: Number, default: 0 },
  cashbackPercentage: { type: Number, default: 0 },
  rewardPointsMultiplier: { type: Number, default: 1 },
  renewalDiscount: { type: Number, default: 0 },
  priorityBooking: { type: Boolean, default: false },
  premiumSupport:  { type: Boolean, default: false },
  eligibleCategories: [{ type: String }],
  welcomeBonusPoints: { type: Number, default: 0 },

  features: [{ type: String }],
  color: { type: String, default: 'blue' },
  popular: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
