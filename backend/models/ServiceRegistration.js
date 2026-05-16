const mongoose = require('mongoose');

const serviceRegistrationSchema = new mongoose.Schema({
  // Service context
  serviceSlug: {
    type: String,
    required: true,
    // e.g. 'it-solutions', 'website-development', 'app-development'
  },
  serviceName: {
    type: String,
    required: true,
  },

  // Registrant Info
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
    default: '',
  },

  // Requirement Details
  budget: {
    type: String,
    enum: ['Under ₹50K', '₹50K - ₹2L', '₹2L - ₹5L', '₹5L - ₹15L', '₹15L+', 'Not Sure'],
    default: 'Not Sure',
  },
  timeline: {
    type: String,
    enum: ['ASAP', '1 Month', '1-3 Months', '3-6 Months', '6+ Months'],
    default: '1-3 Months',
  },
  message: {
    type: String,
    trim: true,
    default: '',
  },

  // CRM Status
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
    default: 'New',
  },
  adminNotes: {
    type: String,
    default: '',
  },

  // Optional: Linked user account
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
}, {
  timestamps: true,
  strict: false,
});

module.exports = mongoose.model('ServiceRegistration', serviceRegistrationSchema);
