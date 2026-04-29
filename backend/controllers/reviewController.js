const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    const { orderId, productId, rating, comment } = req.body;

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

    // Update Product average rating
    const product = await Product.findById(productId);
    const reviews = await Review.find({ product: productId });
    
    product.numReviews = reviews.length;
    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review added and ratings recalculated' });
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:id
// @access  Public
const getProductReviews = async (req, res) => {
    const reviews = await Review.find({ product: req.params.id }).populate('user', 'firstName lastName');
    res.json(reviews);
};

module.exports = {
    createReview,
    getProductReviews
};
