const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  text: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    enum: ['Banking', 'IT', 'Non-IT', 'Manufacturing', 'Automobile', 'Other'],
    default: 'Other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);
