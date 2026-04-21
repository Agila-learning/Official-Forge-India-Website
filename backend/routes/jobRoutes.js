const express = require('express');
const { getJobs, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, admin, hr } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getJobs).post(protect, hr, createJob);
router.route('/:id').put(protect, hr, updateJob).delete(protect, hr, deleteJob);

module.exports = router;
