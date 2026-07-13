const mongoose = require('mongoose');

const companyUpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the update']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  type: {
    type: String,
    enum: ['Company Photo', 'Celebration', 'CEO Update', 'General'],
    default: 'General'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CompanyUpdate', companyUpdateSchema);
