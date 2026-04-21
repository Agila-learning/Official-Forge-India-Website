const express = require('express');
const router = express.Router();
const { 
  submitFeedback, 
  getAllFeedback, 
  getPublicFeedback 
} = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, submitFeedback)
  .get(protect, admin, getAllFeedback);

router.get('/public', getPublicFeedback);

module.exports = router;
