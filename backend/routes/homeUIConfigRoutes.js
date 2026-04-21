const express = require('express');
const router = express.Router();
const { getHomeUIConfig, updateHomeUIConfig } = require('../controllers/homeUIConfigController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getHomeUIConfig)
  .put(protect, admin, updateHomeUIConfig);

module.exports = router;
