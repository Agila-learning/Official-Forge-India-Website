const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    role: {
      type: String,
      required: true,
      enum: ['Customer', 'Candidate', 'Vendor', 'HR', 'Delivery Partner'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Platform UX', 'Service Quality', 'Delivery Experience', 'Support Response', 'Other'],
      default: 'Platform UX'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
