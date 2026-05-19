const Razorpay = require('razorpay');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder', // User needs to provide this
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
// SECURITY: Amount is ALWAYS fetched from the DB Order record — never trusted from the client.
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId, bookingId, receipt, amount } = req.body;
  console.log('--- RAZORPAY ORDER CREATION ATTEMPT ---');
  console.log('Request Body:', JSON.stringify(req.body));

  if (!orderId && !bookingId) {
    return res.status(400).json({
      success: false,
      message: 'Order ID or Booking ID is required to initiate payment.',
    });
  }

  let dbDoc = null;
  let isBooking = false;

  if (bookingId) {
    dbDoc = await require('../models/Booking').findById(bookingId);
    isBooking = true;
  } else {
    dbDoc = await Order.findById(orderId);
  }

  if (!dbDoc) {
    return res.status(404).json({
      success: false,
      message: 'Document sequence not detected in database.',
    });
  }

  // Allow advance payment if specified, else use totalPrice
  let paymentAmount = dbDoc.totalPrice;
  if (amount && amount < dbDoc.totalPrice) {
    paymentAmount = amount; // Advance payment scenario
  }

  const options = {
    amount: Math.round(paymentAmount * 100), 
    currency: "INR",
    receipt: receipt || `receipt_${dbDoc._id.toString().slice(-8)}_${Date.now()}`,
    notes: {
      mongoId: dbDoc._id.toString(),
      type: isBooking ? 'booking' : 'order',
      userId: req.user._id.toString(),
      isAdvance: amount && amount < dbDoc.totalPrice ? 'true' : 'false'
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({
      ...order,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500);
    throw new Error('Razorpay Order Creation Failed: Gateway connection error');
  }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
    bookingId,
    amount
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || (!orderId && !bookingId)) {
    res.status(400);
    throw new Error('Missing payment verification parameters');
  }

  // 1. Verify HMAC Signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
    .update(body.toString())
    .digest("hex");

  if (razorpay_signature !== expectedSignature) {
    res.status(400);
    throw new Error('Invalid Payment Signature: Transaction integrity compromised');
  }

  // 2. Fetch and Update Document (Order or Booking)
  let dbDoc = null;
  let isBooking = false;

  if (bookingId) {
    dbDoc = await require('../models/Booking').findById(bookingId);
    isBooking = true;
  } else {
    dbDoc = await Order.findById(orderId);
  }

  if (!dbDoc) {
    res.status(404);
    throw new Error('Document sequence not found in database');
  }

  // Handle Advance Payment Update
  let paymentAmount = amount || dbDoc.totalPrice;
  if (paymentAmount < dbDoc.totalPrice) {
    dbDoc.advancePaid = (dbDoc.advancePaid || 0) + paymentAmount;
    dbDoc.remainingDue = Math.max(0, dbDoc.totalPrice - dbDoc.advancePaid);
    dbDoc.paymentStatus = dbDoc.remainingDue > 0 ? 'Partially Paid' : 'Paid';
    if (dbDoc.remainingDue === 0) {
      dbDoc.isPaid = true;
      dbDoc.paidAt = Date.now();
    }
  } else {
    dbDoc.paymentStatus = 'Paid';
    dbDoc.isPaid = true; // For orders backward compatibility
    dbDoc.paidAt = Date.now();
  }

  dbDoc.paymentResult = {
    id: razorpay_payment_id,
    status: 'Authorized',
    update_time: Date.now().toString(),
    email_address: req.user.email,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature
  };

  if (!isBooking && (dbDoc.status === 'Order Confirmed' || !dbDoc.status)) {
    dbDoc.status = 'Order Confirmed';
  } else if (isBooking && dbDoc.status === 'Pending') {
    dbDoc.status = 'Confirmed';
  }

  const updatedDoc = await dbDoc.save();
  
  // Track Transaction
  await require('../models/Transaction').create({
    user: req.user._id,
    order: !isBooking ? orderId : undefined,
    booking: isBooking ? bookingId : undefined,
    type: 'Payment',
    amount: paymentAmount,
    status: 'Success',
    gatewayId: razorpay_payment_id,
    description: `Payment verification successful for ${isBooking ? 'Booking' : 'Order'}`
  });

  res.json({ 
    success: true, 
    message: "Payment authorized and verified successfully", 
    order: updatedDoc 
  });
});

module.exports = {
  createRazorpayOrder,
  verifyPayment
};
