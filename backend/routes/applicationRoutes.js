const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const User = require('../models/User');
const { protect, hr } = require('../middleware/authMiddleware');

// @desc   Get all applications (HR/Admin view)
// @route  GET /api/applications
// @access Private (HR/Admin)
router.get('/', protect, hr, async (req, res) => {
  try {
    let query = {};
    // HR and Admin can see all applications in the pipeline
    query = {};

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName email')
      .populate('job', 'title companyName');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc   Get my own applications (Candidate view)
// @route  GET /api/applications/mine
// @access Private (Candidate)
router.get('/mine', protect, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('job', 'title company location salary');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc   Submit a new application
// @route  POST /api/applications/apply
// @access Public / Private
router.post('/apply', async (req, res) => {
  const { fullName, email, phone, domain, jobRole, coverLetter, resumeUrl, userId, jobId } = req.body;

  // Validation: Mandatory fields check
  if (!fullName || !email || !phone || !domain || !jobRole) {
    return res.status(400).json({ message: 'Missing mandatory fields: fullName, email, phone, domain, or jobRole' });
  }

  // Sanitize IDs (Handle potential 'null' or 'undefined' strings from frontend)
  let cleanUserId = (userId && userId !== 'null' && userId !== 'undefined') ? userId : null;
  let cleanJobId = (jobId && jobId !== 'null' && jobId !== 'undefined') ? jobId : null;

  // Final ObjectID Validation to prevent CastErrors
  const mongoose = require('mongoose');
  if (cleanUserId && !mongoose.Types.ObjectId.isValid(cleanUserId)) cleanUserId = null;
  if (cleanJobId && !mongoose.Types.ObjectId.isValid(cleanJobId)) cleanJobId = null;

  try {
    // Check if already applied for this job (if logged in and job is linked)
    if (cleanUserId && cleanJobId) {
      const existing = await Application.findOne({ user: cleanUserId, job: cleanJobId });
      if (existing) {
        return res.status(400).json({ message: 'You have already applied for this job' });
      }
    }

    const application = new Application({
      user: cleanUserId,
      job: cleanJobId,
      fullName,
      email,
      phone,
      domain,
      jobRole,
      coverLetter,
      resumeUrl,
      status: 'Pending',
      statusHistory: [{ status: 'Pending', note: 'Application submitted' }],
    });

    const saved = await application.save();
    res.status(201).json({ message: 'Application submitted successfully!', data: saved });
  } catch (error) {
    console.error('Job Application Error:', error);
    res.status(500).json({ message: 'Server error during submission', error: error.message });
  }
});

// @desc   Update application status (HR)
// @route  PUT /api/applications/:id/status
// @access Private (HR/Admin)
router.put('/:id/status', protect, hr, async (req, res) => {
  try {
    const { status, hrNotes } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    if (hrNotes) application.hrNotes = hrNotes;
    application.statusHistory.push({ status, note: hrNotes || `Status changed to ${status}` });

    await application.save();
    res.json({ message: `Application marked as ${status}`, application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc   Delete application (HR/Admin)
// @route  DELETE /api/applications/:id
// @access Private (HR)
router.delete('/:id', protect, hr, async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc   Get public success stories (Hired candidates)
// @route  GET /api/applications/public-hired
// @access Public
router.get('/public-hired', async (req, res) => {
  try {
    const applications = await Application.find({ status: 'Hired' })
      .sort({ updatedAt: -1 })
      .limit(6)
      .populate('user', 'firstName lastName')
      .populate('job', 'title companyName');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
