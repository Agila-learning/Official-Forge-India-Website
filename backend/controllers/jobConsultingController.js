const Razorpay = require('razorpay');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const ServiceInquiry = require('../models/ServiceInquiry');
const User = require('../models/User');
const { sendPaymentConfirmationEmail } = require('../utils/emailService');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Submit Job Consulting Inquiry + Create Razorpay Order
// @route   POST /api/job-consulting/submit
// @access  Private (Candidate)
// ─────────────────────────────────────────────────────────────────────────────
const submitConsultingInquiry = asyncHandler(async (req, res) => {
  const {
    consultingType,
    experience,
    currentRole,
    specificRequirement,
    message,
    contactNumber,
  } = req.body;

  // Validation
  if (!consultingType || !specificRequirement || !contactNumber) {
    res.status(400);
    throw new Error('Consulting type, requirements, and contact number are required.');
  }

  const AMOUNT_INR = 1500; // Consulting fee in INR

  // 1. Save inquiry to DB with paymentStatus: Pending
  const inquiry = await ServiceInquiry.create({
    user:                req.user._id,
    serviceType:         'Job Consulting',
    consultingType,
    experience:          experience || 'Fresher (0-1 yr)',
    currentRole:         currentRole || '',
    specificRequirement,
    message:             message || specificRequirement,
    contactNumber,
    amount:              AMOUNT_INR,
    paymentStatus:       'Pending',
  });

  // 2. Create Razorpay Order
  let razorpayOrder;
  const isTestKey = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('REPLACE_WITH_YOUR_KEY_ID');

  if (isTestKey) {
    // TEST MODE: Skip Razorpay and return a mock order ID
    razorpayOrder = { id: `order_mock_${Date.now()}` };
    console.log('--- TEST MODE: Razorpay Order Creation Skipped ---');
  } else {
    try {
      razorpayOrder = await razorpay.orders.create({
        amount:   AMOUNT_INR * 100, // Convert to paise
        currency: 'INR',
        receipt:  `jc_${inquiry._id.toString().slice(-8)}`,
        notes: {
          inquiryId:      inquiry._id.toString(),
          candidateEmail: req.user.email,
          candidateName:  `${req.user.firstName} ${req.user.lastName}`,
          consultingType,
        },
      });
    } catch (err) {
      // If Razorpay fails, clean up the inquiry
      await ServiceInquiry.findByIdAndDelete(inquiry._id);
      res.status(502);
      throw new Error('Payment gateway error. Please try again.');
    }
  }

  // 3. Save Razorpay order ID back to inquiry
  inquiry.razorpayOrderId = razorpayOrder.id;
  await inquiry.save();

  res.status(201).json({
    inquiryId:      inquiry._id,
    razorpayOrderId: razorpayOrder.id,
    keyId:          process.env.RAZORPAY_KEY_ID,
    amount:         AMOUNT_INR,
    currency:       'INR',
    candidateName:  `${req.user.firstName} ${req.user.lastName}`,
    email:          req.user.email,
    contactNumber,
    consultingType,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Verify Payment Signature + Mark Paid + Send Email
// @route   POST /api/job-consulting/verify-payment
// @access  Private (Candidate)
// ─────────────────────────────────────────────────────────────────────────────
const verifyConsultingPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    inquiryId,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !inquiryId) {
    res.status(400);
    throw new Error('Missing payment verification parameters.');
  }

  // 1. Verify HMAC Signature
  const isMockOrder = razorpay_order_id.startsWith('order_mock_');

  if (!isMockOrder) {
    const body       = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      res.status(400);
      throw new Error('Payment signature verification failed. Possible tampering detected.');
    }
  } else {
    console.log('--- TEST MODE: Skipping Signature Verification for Mock Order ---');
  }

  // 2. Fetch inquiry
  const inquiry = await ServiceInquiry.findById(inquiryId);
  if (!inquiry) {
    res.status(404);
    throw new Error('Consulting inquiry not found.');
  }

  if (inquiry.paymentStatus === 'Paid') {
    return res.json({ success: true, message: 'Payment already verified.', inquiry });
  }

  // 3. Mark inquiry as Paid
  inquiry.paymentStatus       = 'Paid';
  inquiry.razorpayPaymentId   = razorpay_payment_id;
  inquiry.status              = 'In Progress';
  await inquiry.save();

  // 4. Mark User as Paid
  await User.findByIdAndUpdate(req.user._id, {
    paymentStatus: 'Paid',
    isMember:      true,
  });

  // 5. Send confirmation email
  try {
    await sendPaymentConfirmationEmail(
      req.user.email,
      `${req.user.firstName} ${req.user.lastName}`,
      inquiry._id.toString(),
      inquiry.amount,
      inquiry.consultingType
    );
    inquiry.emailSent = true;
    await inquiry.save();
  } catch (emailErr) {
    console.error('[Email Service] Failed to send confirmation email:', emailErr.message);
    // Do NOT fail the request — payment is confirmed regardless
  }

  res.json({
    success: true,
    message: 'Payment verified successfully! Confirmation email sent.',
    inquiry,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get Current Candidate's Consulting Inquiries
// @route   GET /api/job-consulting/mine
// @access  Private (Candidate)
// ─────────────────────────────────────────────────────────────────────────────
const getMyConsultingInquiries = asyncHandler(async (req, res) => {
  const inquiries = await ServiceInquiry.find({
    user:        req.user._id,
    serviceType: 'Job Consulting',
  }).sort({ createdAt: -1 });

  res.json(inquiries);
});

module.exports = {
  submitConsultingInquiry,
  verifyConsultingPayment,
  getMyConsultingInquiries,
};
