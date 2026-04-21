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
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body;

  const options = {
    amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
    currency: "INR",
    receipt: `receipt_${orderId}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500);
    throw new Error('Razorpay Order Creation Failed');
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

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // Payment verified
    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'Paid',
        update_time: Date.now().toString(),
        email_address: req.user.email,
      };
      const updatedOrder = await order.save();
      res.json({ message: "Payment verified successfully", order: updatedOrder });
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } else {
    res.status(400);
    throw new Error('Invalid Payment Signature');
  }
});

module.exports = {
  createRazorpayOrder,
  verifyPayment
};
