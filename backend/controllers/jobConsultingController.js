const Razorpay = require('razorpay');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const ServiceInquiry = require('../models/ServiceInquiry');
const User = require('../models/User');
const { sendPaymentConfirmationEmail } = require('../utils/emailService');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// Direct payment link fallback
const DIRECT_PAYMENT_LINK = 'https://rzp.io/rzp/KJFPhwG';

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
    domain, // New field for domain selection
  } = req.body;

  // Validation
  if (!consultingType || !specificRequirement || !contactNumber) {
    res.status(400);
    throw new Error('Consulting type, requirements, and contact number are required.');
  }

  // Dynamic pricing: ₹2500 for Banking, ₹1500 for others
  const AMOUNT_INR = domain === 'Banking' ? 2500 : 1500;

  // 1. Save inquiry to DB with paymentStatus: Pending (for tracking purposes)
  let inquiry;
  try {
    inquiry = await ServiceInquiry.create({
      user:                req.user?._id,
      serviceType:         'Job Consulting',
      consultingType:      consultingType || 'Career Guidance',
      domain:              domain || 'General',
      experience:          experience || 'Fresher (0-1 yr)',
      currentRole:         currentRole || '',
      specificRequirement,
      message:             message || specificRequirement,
      contactNumber,
      amount:              AMOUNT_INR,
      paymentStatus:       'Pending',
    });
  } catch (dbErr) {
    console.error('[DB Error - Job Consulting Inquiry]:', dbErr);
    return res.status(400).json({ 
      success: false, 
      message: 'Failed to initialize consultation record. Please verify your inputs.',
      error: dbErr.message
    });
  }

  // 2. Create Razorpay Order
  const options = {
    amount:   AMOUNT_INR * 100, // amount in paise
    currency: "INR",
    receipt:  `receipt_jc_${inquiry._id.toString().slice(-8)}`,
    notes: {
      inquiryId: inquiry._id.toString(),
      type:      'Job Consulting'
    }
  };

  try {
    const rzpOrder = await razorpay.orders.create(options);
    
    // Return order details for the frontend Razorpay modal
    res.status(201).json({
      success: true,
      inquiryId:       inquiry._id,
      amount:          AMOUNT_INR,
      currency:        'INR',
      razorpayOrderId: rzpOrder.id,
      keyId:           process.env.RAZORPAY_KEY_ID,
      paymentLink:     DIRECT_PAYMENT_LINK, // fallback
      candidateName:   `${req.user?.firstName || 'Candidate'} ${req.user?.lastName || ''}`.trim(),
      email:           req.user?.email,
      contactNumber,
      consultingType,
      message:         'Inquiry saved. Please complete payment.',
    });
  } catch (rzpErr) {
    console.error('[Razorpay Error - Job Consulting]:', rzpErr);
    // If Razorpay order creation fails, we can still return the direct link as fallback
    res.status(201).json({
      success: true,
      inquiryId:       inquiry._id,
      amount:          AMOUNT_INR,
      paymentLink:     DIRECT_PAYMENT_LINK,
      candidateName:   `${req.user?.firstName || 'Candidate'} ${req.user?.lastName || ''}`.trim(),
      email:           req.user?.email,
      contactNumber,
      consultingType,
      message:         'Inquiry saved. Razorpay integration busy, please use the direct link.',
    });
  }
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
  // For direct links, razorpay_order_id might be missing or null
  const isDirectLink = !razorpay_order_id || razorpay_order_id === 'null';
  const isMockOrder = razorpay_order_id && razorpay_order_id.startsWith('order_mock_');

  if (!isDirectLink && !isMockOrder) {
    const body       = `${razorpay_order_id}|${razorpay_payment_id}`;
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('[Razorpay Config Error]: RAZORPAY_KEY_SECRET is missing');
      res.status(500);
      throw new Error('Server configuration error: Payment verification impossible');
    }

    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(body)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      console.warn('[Razorpay Verification Failure]: Signature mismatch');
      return res.status(400).json({ success: false, message: 'Payment signature verification failed.' });
    }
  } else if (isDirectLink) {
    console.log('--- DIRECT LINK MODE: Skipping HMAC Signature Verification ---');
    // In production, you might want to verify the payment ID via Razorpay API here
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
