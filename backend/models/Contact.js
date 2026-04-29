const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: String },
    service: { type: String },
    message: { type: String, required: false },
    status: { type: String, default: 'New' }
  },
  { timestamps: true }
);

const ContactQuery = mongoose.model('ContactQuery', contactSchema);
module.exports = ContactQuery;
