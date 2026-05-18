const express = require('express');
const { registerUser, authUser, onboardUser, sendOTP, verifyOTP, createRegistrationPayment } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many login/register attempts. Please try again shortly.' },
});

router.post('/login', authLimiter, authUser);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', registerUser);
router.post('/create-registration-payment', createRegistrationPayment);
router.post('/onboard', protect, admin, onboardUser);

module.exports = router;
