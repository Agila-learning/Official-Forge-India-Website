const ContactQuery = require('../models/Contact');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, category, service, message, attachmentUrl } = req.body;
    const contact = await ContactQuery.create({ firstName, lastName, email, phone, category, service, message, attachmentUrl });
    
    // Notify Admins
    const io = req.app.get('io');
    const admins = await User.find({ role: 'Admin' });
    for (const admin of admins) {
        await createNotification(io, {
            user: admin._id,
            title: 'New Contact Query',
            message: `Strategic Alert: New query received from ${firstName} ${lastName} regarding ${category || 'General'}.`,
            type: 'contact',
            link: '/admin/contacts'
        });
    }

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await ContactQuery.find({});
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createContact, getContacts };
