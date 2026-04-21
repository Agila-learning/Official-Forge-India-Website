const express = require('express');
const { registerUser, authUser, onboardUser, sendOTP, verifyOTP } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/onboard', protect, admin, onboardUser);

module.exports = router;
