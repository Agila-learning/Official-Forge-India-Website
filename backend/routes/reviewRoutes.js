const express = require('express');
const router = express.Router();
const { createReview, getProductReviews, getPublicReviews, getMyReviews, getAllReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createReview).get(protect, getAllReviews);
router.route('/myreviews').get(protect, getMyReviews);
router.route('/public').get(getPublicReviews);
router.route('/product/:id').get(getProductReviews);

module.exports = router;
