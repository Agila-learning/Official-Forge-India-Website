const ContactQuery = require('../models/Contact');

const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;
    const contact = await ContactQuery.create({ firstName, lastName, email, message });
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
