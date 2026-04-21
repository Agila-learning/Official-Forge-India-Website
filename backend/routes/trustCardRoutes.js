const express = require('express');
const router = express.Router();
const { getTrustCards, createTrustCard, updateTrustCard, deleteTrustCard } = require('../controllers/trustCardController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTrustCards)
  .post(protect, admin, createTrustCard);

router.route('/:id')
  .put(protect, admin, updateTrustCard)
  .delete(protect, admin, deleteTrustCard);

module.exports = router;
