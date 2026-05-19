const asyncHandler = require('express-async-handler');
const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const Order = require('../models/Order');

// @desc    Generate a new invoice
// @route   POST /api/invoices
// @access  Private (Admin or System)
const generateInvoice = asyncHandler(async (req, res) => {
  const { bookingId, orderId } = req.body;

  let sourceDoc = null;
  let sourceType = '';

  if (bookingId) {
    sourceDoc = await Booking.findById(bookingId).populate('user');
    sourceType = 'booking';
  } else if (orderId) {
    sourceDoc = await Order.findById(orderId).populate('user');
    sourceType = 'order';
  }

  if (!sourceDoc) {
    res.status(404);
    throw new Error(`${sourceType === 'booking' ? 'Booking' : 'Order'} not found`);
  }

  // Calculate fees
  const serviceAmount = sourceDoc.totalPrice || 0;
  const platformFee = serviceAmount * 0.05; // Default 5% platform fee
  const gstAmount = (serviceAmount + platformFee) * 0.18; // 18% GST
  const convenienceCharge = 50; // Flat fee
  const totalAmount = serviceAmount + platformFee + gstAmount + convenienceCharge;

  const invoice = new Invoice({
    invoiceId: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    booking: bookingId || undefined,
    order: orderId || undefined,
    user: sourceDoc.user._id,
    serviceAmount,
    platformFee,
    gstAmount,
    convenienceCharge,
    totalAmount,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  });

  const createdInvoice = await invoice.save();
  res.status(201).json(createdInvoice);
});

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('user', 'firstName lastName email')
    .populate('vendor', 'businessName exactLocation');

  if (invoice) {
    res.json(invoice);
  } else {
    res.status(404);
    throw new Error('Invoice not found');
  }
});

// @desc    Get all invoices for admin
// @route   GET /api/invoices
// @access  Private/Admin
const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({}).populate('user', 'firstName lastName email');
  res.json(invoices);
});

module.exports = {
  generateInvoice,
  getInvoiceById,
  getInvoices,
};
