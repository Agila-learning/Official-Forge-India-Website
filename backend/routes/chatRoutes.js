const express = require('express');
const router = express.Router();
const { getMessages, getThreads, sendMessage, getChatContacts, editMessage, deleteMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/threads', protect, getThreads);
router.get('/contacts', protect, getChatContacts);
router.get('/:userId', protect, getMessages);
router.post('/', protect, sendMessage);
router.put('/:id', protect, editMessage);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
