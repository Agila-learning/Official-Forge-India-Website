const express = require('express');
const router = express.Router();
const { getConfigs, updateConfig } = require('../controllers/configController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getConfigs);
router.route('/:key').put(protect, admin, updateConfig);

module.exports = router;
