const TrustCard = require('../models/TrustCard');
const asyncHandler = require('express-async-handler');

// @desc    Get all Trust Cards
// @route   GET /api/trust-cards
// @access  Public
const getTrustCards = asyncHandler(async (req, res) => {
  const cards = await TrustCard.find({}).sort('order');
  res.json(cards);
});

// @desc    Create a Trust Card
// @route   POST /api/trust-cards
// @access  Private/Admin
const createTrustCard = asyncHandler(async (req, res) => {
  const { icon, title, val, order, isActive } = req.body;
  const card = await TrustCard.create({ icon, title, val, order, isActive });
  res.status(201).json(card);
});

// @desc    Update a Trust Card
// @route   PUT /api/trust-cards/:id
// @access  Private/Admin
const updateTrustCard = asyncHandler(async (req, res) => {
  const card = await TrustCard.findById(req.params.id);
  if (card) {
    card.icon = req.body.icon || card.icon;
    card.title = req.body.title || card.title;
    card.val = req.body.val || card.val;
    card.order = req.body.order !== undefined ? req.body.order : card.order;
    card.isActive = req.body.isActive !== undefined ? req.body.isActive : card.isActive;

    const updatedCard = await card.save();
    res.json(updatedCard);
  } else {
    res.status(404);
    throw new Error('Card not found');
  }
});

// @desc    Delete a Trust Card
// @route   DELETE /api/trust-cards/:id
// @access  Private/Admin
const deleteTrustCard = asyncHandler(async (req, res) => {
  const card = await TrustCard.findById(req.params.id);
  if (card) {
    await card.deleteOne();
    res.json({ message: 'Card removed' });
  } else {
    res.status(404);
    throw new Error('Card not found');
  }
});

module.exports = {
  getTrustCards,
  createTrustCard,
  updateTrustCard,
  deleteTrustCard
};
