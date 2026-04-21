const express = require('express');
const router  = express.Router();
const {
  submitConsultingInquiry,
  verifyConsultingPayment,
  getMyConsultingInquiries,
} = require('../controllers/jobConsultingController');
const { protect } = require('../middleware/authMiddleware');

// All routes are private — require authenticated Candidate (or Admin)
router.post('/submit',         protect, submitConsultingInquiry);
router.post('/verify-payment', protect, verifyConsultingPayment);
router.get('/mine',            protect, getMyConsultingInquiries);

module.exports = router;
