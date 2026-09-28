const express = require('express');
const { createContact, getContacts, updateContact } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(createContact).get(protect, admin, getContacts);
router.route('/:id').put(protect, admin, updateContact);

module.exports = router;
