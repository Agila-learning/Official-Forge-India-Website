const LocationRequest = require('../models/LocationRequest');

const createLocationRequest = async (req, res) => {
  try {
    const { name, email, mobile, location, industry, message } = req.body;
    const request = await LocationRequest.create({ name, email, mobile, location, industry, message });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLocationRequests = async (req, res) => {
  try {
    const requests = await LocationRequest.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLocationRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await LocationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    request.status = status;
    const updated = await request.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLocationRequest = async (req, res) => {
    try {
        const reqToDelete = await LocationRequest.findById(req.params.id);
        if(!reqToDelete) return res.status(404).json({ message: 'Request not found' });
        await reqToDelete.deleteOne();
        res.json({ message: 'Request deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createLocationRequest, getLocationRequests, updateLocationRequestStatus, deleteLocationRequest };
