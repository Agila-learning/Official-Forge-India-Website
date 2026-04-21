const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createProductReview = async (req, res) => {
  const { rating, comment, productId } = req.body;
  const product = await Product.findById(productId);

  if (product) {
    const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }
    const review = await Review.create({
      name: `${req.user.firstName} ${req.user.lastName}`,
      rating: Number(rating),
      comment,
      user: req.user._id,
      product: productId,
    });
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added', review });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
  res.json(reviews);
};

// @desc    Get ALL reviews (admin)
// @route   GET /api/reviews
// @access  Admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .populate('product', 'name image')
      .populate('user', 'firstName lastName email');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review (admin)
// @route   DELETE /api/reviews/:id/admin
// @access  Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    const product = await Product.findById(review.product);
    if (product) {
      const reviews = await Review.find({ product: product._id });
      product.numReviews = reviews.length;
      product.rating = reviews.length > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
        : 0;
      await product.save();
    }
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Edit a review (admin)
// @route   PUT /api/reviews/:id/admin
// @access  Admin
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (req.body.comment !== undefined) review.comment = req.body.comment;
    if (req.body.rating) review.rating = Number(req.body.rating);
    const updated = await review.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's own reviews
// @route   GET /api/reviews/myreviews
// @access  Private
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('product', 'name image');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public reviews for testimonials
// @route   GET /api/reviews/public
// @access  Public
const getPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ rating: { $gte: 4 } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('product', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProductReview, getProductReviews, getAllReviews, deleteReview, updateReview, getPublicReviews, getMyReviews };
