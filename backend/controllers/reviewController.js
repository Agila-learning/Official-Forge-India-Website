const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    const { orderId, rating, comment } = req.body;
    const productId = req.body.productId || req.body.product;

    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    // Verify order is completed
    if (order.status !== 'Completed' && order.status !== 'Delivered') {
        return res.status(400).json({ message: 'Can only review completed missions' });
    }

    const alreadyReviewed = await Review.findOne({
        user: req.user._id,
        order: orderId,
        product: productId
    });

    if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed for this order' });
    }

    const review = new Review({
        name: req.user.firstName,
        rating: Number(rating),
        comment,
        user: req.user._id,
        order: orderId,
        product: productId
    });

    await review.save();

    // Update Product average rating if product exists
    const product = await Product.findById(productId);
    if (product) {
        const reviews = await Review.find({ product: productId });
        product.numReviews = reviews.length;
        product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        await product.save();
    }

    res.status(201).json({ message: 'Review added and ratings recalculated' });
};

// @desc    Get top rated public reviews
// @route   GET /api/reviews/public
// @access  Public
const getPublicReviews = async (req, res) => {
    try {
        // Fetch top rated reviews (e.g., 4 and 5 stars)
        const reviews = await Review.find({ rating: { $gte: 4 } })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'firstName lastName');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:id
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.id }).populate('user', 'firstName lastName');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching product reviews' });
    }
};

// @desc    Get logged in user's reviews
// @route   GET /api/reviews/myreviews
// @access  Private
const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate('product', 'name image category')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching your reviews' });
    }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user', 'firstName lastName')
            .populate('product', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching all reviews' });
    }
};

module.exports = {
    createReview,
    getProductReviews,
    getPublicReviews,
    getMyReviews,
    getAllReviews
};
