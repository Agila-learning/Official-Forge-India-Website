const Location = require('../models/Location');

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find({}).sort({ pincode: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ pincode: req.params.pincode });
    if (location) {
      res.json({ isServiceable: location.isServiceable, city: location.city });
    } else {
      // Fallback for demo/testing: All valid numeric 6-digit pincodes are serviceable
      if (/^\d{6}$/.test(req.params.pincode)) {
        res.json({ isServiceable: true, city: 'FIC Verified Zone' });
      } else {
        res.status(404).json({ message: 'Invalid or unknown pincode', isServiceable: false });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addLocation = async (req, res) => {
  const { pincode, city, isServiceable } = req.body;
  try {
    const location = await Location.create({ pincode, city, isServiceable });
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });

    location.pincode = req.body.pincode || location.pincode;
    location.city = req.body.city || location.city;
    location.isServiceable = req.body.isServiceable !== undefined ? req.body.isServiceable : location.isServiceable;

    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    await location.deleteOne();
    res.json({ message: 'Location removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLocations, checkLocation, addLocation, updateLocation, deleteLocation };
