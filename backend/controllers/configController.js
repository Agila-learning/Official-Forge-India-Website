const Config = require('../models/Config');

// @desc    Get all configs
// @route   GET /api/configs
// @access  Public
const getConfigs = async (req, res) => {
  try {
    const configs = await Config.find({});
    res.json(configs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a config by key
// @route   PUT /api/configs/:key
// @access  Private/Admin
const updateConfig = async (req, res) => {
  try {
    const { value } = req.body;
    let config = await Config.findOne({ key: req.params.key });
    
    if (config) {
      config.value = value;
      await config.save();
    } else {
      config = await Config.create({
        key: req.params.key,
        value,
        description: req.body.description || ''
      });
    }
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConfigs, updateConfig };
