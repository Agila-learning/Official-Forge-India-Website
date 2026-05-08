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
  const { orderId, receipt } = req.body;
  console.log('--- RAZORPAY ORDER CREATION ATTEMPT ---');
  console.log('Request Body:', JSON.stringify(req.body));
  console.log('Order ID Received:', orderId);

  if (!orderId) {
    console.error('Validation Failure: Missing orderId in request body');
    res.status(400);
    throw new Error('Order ID is required to initiate payment.');
  }

  // 1. Fetch the order from DB to get the authoritative price
  const dbOrder = await Order.findById(orderId);
  console.log('Database Order Lookup:', dbOrder ? 'SUCCESS' : 'FAILED');
  if (dbOrder) {
    console.log('Order Details:', {
      id: dbOrder._id,
      totalPrice: dbOrder.totalPrice,
      isPaid: dbOrder.isPaid,
      userId: dbOrder.user
    });
  }

  if (!dbOrder) {
    console.error('Lookup Failure: Order ID', orderId, 'not found in database');
    res.status(404);
    throw new Error('Order not found. Cannot initiate payment for a non-existent order.');
  }

  // 2. Verify the requesting user is the order owner
  if (dbOrder.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Authorization Failure: You are not permitted to pay for this order.');
  }

  // 3. Prevent double-payment
  if (dbOrder.isPaid) {
    res.status(400);
    throw new Error('This order has already been paid.');
  }

  const options = {
    amount: Math.round(dbOrder.totalPrice * 100), // DB-sourced amount in paise — cannot be manipulated
    currency: "INR",
    receipt: receipt || `receipt_${dbOrder._id.toString().slice(-8)}_${Date.now()}`,
    notes: {
      mongoOrderId: dbOrder._id.toString(),
      userId: req.user._id.toString(),
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
    orderId
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
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

  // 2. Fetch and Update Order
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order sequence not found in database');
  }

  // Security check: Only owner or Admin can verify
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Authorization Failure: Access denied to verify this transaction');
  }

  if (order.isPaid) {
    return res.json({ message: "Payment already verified", order });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: razorpay_payment_id,
    status: 'Authorized',
    update_time: Date.now().toString(),
    email_address: req.user.email,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature
  };

  // Update status if it's a standard flow
  if (order.status === 'Order Confirmed' || !order.status) {
    order.status = 'Order Confirmed'; // Ensure it's set
  }

  const updatedOrder = await order.save();
  
  res.json({ 
    success: true, 
    message: "Payment authorized and verified successfully", 
    order: updatedOrder 
  });
});

module.exports = {
  createRazorpayOrder,
  verifyPayment
};
