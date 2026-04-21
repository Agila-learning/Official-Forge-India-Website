const Feedback = require('../models/Feedback');

// @desc    Submit platform feedback
// @route   POST /api/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
    try {
        const { category, rating, comment, isPublic } = req.body;
        const feedback = await Feedback.create({
            user: req.user._id,
            role: req.user.role,
            category,
            rating,
            comment,
            isPublic: isPublic !== undefined ? isPublic : false
        });
        res.status(201).json(feedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all feedback (Admin)
// @route   GET /api/feedback
// @access  Private/Admin
exports.getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({})
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get public feedback (Public)
// @route   GET /api/feedback/public
// @access  Public
exports.getPublicFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ isPublic: true })
            .populate('user', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
