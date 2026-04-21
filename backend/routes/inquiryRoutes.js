const express = require('express');
const router = express.Router();
const ServiceInquiry = require('../models/ServiceInquiry');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Create a new service inquiry
// @route   POST /api/inquiries
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { serviceType, specificRequirement, message, contactNumber } = req.body;

    const inquiry = new ServiceInquiry({
      user: req.user._id,
      serviceType,
      specificRequirement,
      message,
      contactNumber
    });

    const createdInquiry = await inquiry.save();
    res.status(201).json(createdInquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all service inquiries (Admin only)
// @route   GET /api/inquiries
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const inquiries = await ServiceInquiry.find({}).populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update inquiry status (Admin only)
// @route   PUT /api/inquiries/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await ServiceInquiry.findById(req.params.id);

    if (inquiry) {
      inquiry.status = status;
      const updatedInquiry = await inquiry.save();
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get current user's inquiries
// @route   GET /api/inquiries/my-inquiries
// @access  Private
router.get('/my-inquiries', protect, async (req, res) => {
  try {
    const inquiries = await ServiceInquiry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
