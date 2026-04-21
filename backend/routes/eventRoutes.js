const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getEvents).post(protect, admin, createEvent);
router.route('/:id').put(protect, admin, updateEvent).delete(protect, admin, deleteEvent);

module.exports = router;
