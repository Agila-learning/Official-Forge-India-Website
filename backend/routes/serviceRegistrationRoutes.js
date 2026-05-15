const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ServiceRegistration = require('../models/ServiceRegistration');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Submit a service registration lead
// @route   POST /api/service-registrations
// @access  Public (auth optional)
router.post('/', async (req, res) => {
  try {
    const { serviceSlug, serviceName, name, email, phone, company, budget, timeline, message } = req.body;

    if (!serviceSlug || !serviceName || !name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, phone, and service are required.' });
    }

    // Optionally link to a logged-in user
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'forge_secret_key_123');
        userId = decoded.id;
      } catch (err) {
        // Token invalid — proceed as guest
      }
    }

    const registration = new ServiceRegistration({
      serviceSlug,
      serviceName,
      name,
      email,
      phone,
      company: company || '',
      budget: budget || 'Not Sure',
      timeline: timeline || '1-3 Months',
      message: message || '',
      user: userId,
    });

    const saved = await registration.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('ServiceRegistration POST error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all service registrations (Admin only)
// @route   GET /api/service-registrations
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { slug } = req.query;
    const filter = slug ? { serviceSlug: slug } : {};
    const registrations = await ServiceRegistration.find(filter)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update registration status / admin notes
// @route   PUT /api/service-registrations/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const reg = await ServiceRegistration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });

    if (status) reg.status = status;
    if (adminNotes !== undefined) reg.adminNotes = adminNotes;

    const updated = await reg.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a registration (Admin only)
// @route   DELETE /api/service-registrations/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const reg = await ServiceRegistration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    await reg.deleteOne();
    res.json({ message: 'Registration removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
