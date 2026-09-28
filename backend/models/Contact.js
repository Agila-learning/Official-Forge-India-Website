const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String, required: true },
    companyOrCollege: { type: String },
    location: { type: String },
    userType: { type: String }, // "Student", "Job Seeker", etc.
    interest: { type: String }, // "IT Solutions", "Web Development", etc.
    message: { type: String },
    sourcePage: { type: String },
    internalNotes: { type: String },
    status: { type: String, enum: ['NEW', 'CONTACTED', 'IN PROGRESS', 'CONVERTED', 'CLOSED', 'New'], default: 'NEW' }
  },
  { timestamps: true }
);

const ContactQuery = mongoose.model('ContactQuery', contactSchema);
module.exports = ContactQuery;
