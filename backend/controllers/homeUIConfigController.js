const HomeUIConfig = require('../models/HomeUIConfig');
const asyncHandler = require('express-async-handler');

// @desc    Get Home UI Config
// @route   GET /api/home-ui-config
// @access  Public
const getHomeUIConfig = asyncHandler(async (req, res) => {
  let config = await HomeUIConfig.findOne();
  if (!config) {
    // Create default if not exists
    config = await HomeUIConfig.create({});
  }
  res.json(config);
});

// @desc    Update Home UI Config
// @route   PUT /api/home-ui-config
// @access  Private/Admin
const updateHomeUIConfig = asyncHandler(async (req, res) => {
  let config = await HomeUIConfig.findOne();
  if (config) {
    config.hero = req.body.hero || config.hero;
    config.standards = req.body.standards || config.standards;
    config.isActive = req.body.isActive !== undefined ? req.body.isActive : config.isActive;

    const updatedConfig = await config.save();
    res.json(updatedConfig);
  } else {
    const newConfig = await HomeUIConfig.create(req.body);
    res.status(201).json(newConfig);
  }
});

module.exports = {
  getHomeUIConfig,
  updateHomeUIConfig
};
