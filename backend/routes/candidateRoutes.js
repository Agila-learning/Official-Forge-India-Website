const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all candidates — PROTECTED (was publicly accessible before)
router.get('/', protect, async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a candidate (Admin only)
router.post('/', protect, admin, async (req, res) => {
  const { name, image, videoUrl, text, domain } = req.body;

  try {
    const candidate = new Candidate({
      name,
      image,
      videoUrl,
      text,
      domain
    });

    const createdCandidate = await candidate.save();
    res.status(201).json(createdCandidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a candidate (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  const { name, image, videoUrl, text, domain } = req.body;

  try {
    const candidate = await Candidate.findById(req.params.id);

    if (candidate) {
      candidate.name = name || candidate.name;
      candidate.image = image || candidate.image;
      candidate.videoUrl = videoUrl || candidate.videoUrl;
      candidate.text = text || candidate.text;
      candidate.domain = domain || candidate.domain;

      const updatedCandidate = await candidate.save();
      res.json(updatedCandidate);
    } else {
      res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a candidate (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (candidate) {
      await candidate.deleteOne();
      res.json({ message: 'Candidate removed' });
    } else {
      res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
