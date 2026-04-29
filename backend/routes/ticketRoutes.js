const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, ticketController.createTicket)
    .get(protect, ticketController.getTickets);

router.route('/:id')
    .put(protect, ticketController.updateTicket)
    .delete(protect, ticketController.deleteTicket);

module.exports = router;
