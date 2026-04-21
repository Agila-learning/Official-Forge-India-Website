const express = require('express');
const router = express.Router();
const {
  createProductReview,
  getProductReviews,
  getAllReviews,
  deleteReview,
  updateReview,
  getPublicReviews,
  getMyReviews,
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createProductReview).get(protect, admin, getAllReviews);
router.get('/myreviews', protect, getMyReviews);
router.get('/public', getPublicReviews);
router.route('/:productId').get(getProductReviews);
router.route('/:id/admin').put(protect, admin, updateReview).delete(protect, admin, deleteReview);

module.exports = router;

