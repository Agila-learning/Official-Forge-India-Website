const mongoose = require('mongoose');

const testimonialSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '/logo.jpg',
    },
    rating: {
      type: Number,
      required: true,
      default: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    location: { type: String },
    serviceType: { type: String },
    isApproved: { type: Boolean, default: false },
    mediaUrl: { type: String }, // Optional image/video URL
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
