const express = require('express');
const router = express.Router();
const { createReview, getProductReviews, getPublicReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createReview);
router.route('/public').get(getPublicReviews);
router.route('/product/:id').get(getProductReviews);

module.exports = router;
