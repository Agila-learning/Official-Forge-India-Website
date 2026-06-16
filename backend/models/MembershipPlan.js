const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  period: {
    type: String,
    default: '/month'
  },
  features: [{
    type: String
  }],
  color: {
    type: String,
    default: 'blue'
  },
  popular: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
