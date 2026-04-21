const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'New' }
  },
  { timestamps: true }
);

const ContactQuery = mongoose.model('ContactQuery', contactSchema);
module.exports = ContactQuery;
