const express = require('express');
const router = express.Router();
const { createTicket, getTickets, updateTicket, deleteTicket } = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createTicket)
    .get(protect, getTickets);

router.route('/:id')
    .put(protect, updateTicket)
    .delete(protect, deleteTicket);

module.exports = router;
