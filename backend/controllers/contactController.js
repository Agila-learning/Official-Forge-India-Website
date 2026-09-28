const ContactQuery = require('../models/Contact');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

const createContact = async (req, res) => {
  try {
    const { 
      firstName, lastName, email, phone, category, service, message, attachmentUrl,
      companyOrCollege, location, userType, interest, sourcePage 
    } = req.body;
    
    const contact = await ContactQuery.create({ 
      firstName, lastName, email, phone, category, service, message, attachmentUrl,
      companyOrCollege, location, userType, interest, sourcePage, status: 'NEW'
    });
    
    // Notify Admins
    const io = req.app.get('io');
    const admins = await User.find({ role: 'Admin' });
    for (const admin of admins) {
        await createNotification(io, {
            user: admin._id,
            title: 'New Enquiry / Contact',
            message: `New query received from ${firstName} regarding ${interest || category || 'General'}.`,
            type: 'contact',
            link: '/admin/contacts'
        });
    }

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const { status, internalNotes } = req.body;
    const contact = await ContactQuery.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Enquiry not found' });
    
    if (status) contact.status = status;
    if (internalNotes !== undefined) contact.internalNotes = internalNotes;
    
    await contact.save();
    res.json(contact);
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

module.exports = { createContact, getContacts, updateContact };
