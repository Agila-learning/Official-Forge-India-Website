const mongoose = require('mongoose');

const serviceInquirySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  specificRequirement: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Cancelled'],
    default: 'Pending'
  },
  contactNumber: {
    type: String,
    required: true
  },

  // ── Job Consulting Payment Fields ────────────────────────────
  consultingType: {
    type: String,
    enum: ['Career Guidance', 'Resume Review', 'Interview Preparation', 'Salary Negotiation', 'Domain Switch Guidance'],
    default: 'Career Guidance'
  },
  experience: {
    type: String,
    enum: ['Fresher (0-1 yr)', '1-3 Years', '3-6 Years', '6-10 Years', '10+ Years'],
  },
  currentRole: { type: String },
  amount: { type: Number, default: 499 },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Pending', 'Paid'],
    default: 'Unpaid'
  },
  razorpayOrderId:   { type: String },
  razorpayPaymentId: { type: String },
  emailSent: { type: Boolean, default: false },

}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceInquiry', serviceInquirySchema);
