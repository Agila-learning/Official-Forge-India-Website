const express = require('express');
const { createContact, getContacts } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(createContact).get(protect, admin, getContacts);

module.exports = router;
