const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const { createNotification } = require('./notificationController');

// @desc    Get all vehicles for logged-in driver
// @route   GET /api/vehicles
// @access  Private (Driver)
exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ ownerId: req.user._id, ownerModel: 'User' });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add a new vehicle
// @route   POST /api/vehicles
// @access  Private (Driver)
exports.addVehicle = async (req, res) => {
  try {
    const { vehicleCategory, registrationNumber, make, model, year, color } = req.body;

    const existing = await Vehicle.findOne({ registrationNumber });
    if (existing) return res.status(400).json({ message: 'Vehicle with this registration number already exists.' });

    const vehicle = await Vehicle.create({
      ownerId: req.user._id,
      ownerModel: 'User',
      vehicleCategory,
      registrationNumber,
      make,
      model,
      year,
      color
    });

    // Notify admin for KYC verification
    const io = req.app.get('io');
    await createNotification(io, {
      user: null, // system-wide for admin
      title: '🚗 New Vehicle KYC Request',
      message: `Driver ${req.user.firstName} ${req.user.lastName} added ${make} ${model} (${registrationNumber}) - needs verification.`,
      type: 'Account'
    });

    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Set active vehicle for driver
// @route   PUT /api/vehicles/:id/set-active
// @access  Private (Driver)
exports.setActiveVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, ownerId: req.user._id });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    await Driver.findOneAndUpdate(
      { user: req.user._id },
      { activeVehicle: vehicle._id },
      { new: true }
    );

    res.json({ message: 'Active vehicle updated', vehicle });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Upload vehicle document
// @route   PUT /api/vehicles/:id/document
// @access  Private (Driver)
exports.uploadDocument = async (req, res) => {
  try {
    const { docType, url, expiryDate } = req.body;
    const allowedDocs = ['rcDocument', 'insuranceDocument', 'permitDocument', 'fitnessCertificate', 'pollutionCertificate'];
    if (!allowedDocs.includes(docType)) return res.status(400).json({ message: 'Invalid document type' });

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      {
        [`${docType}.url`]: url,
        [`${docType}.status`]: 'Pending',
        [`${docType}.expiryDate`]: expiryDate || null
      },
      { new: true }
    );

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    res.json({ message: 'Document submitted for verification', vehicle });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Admin: verify a vehicle document
// @route   PUT /api/vehicles/:id/verify
// @access  Private (Admin)
exports.adminVerifyDocument = async (req, res) => {
  try {
    const { docType, status, reason } = req.body; // status: 'Verified' | 'Rejected'
    const allowedDocs = ['rcDocument', 'insuranceDocument', 'permitDocument', 'fitnessCertificate', 'pollutionCertificate'];
    if (!allowedDocs.includes(docType)) return res.status(400).json({ message: 'Invalid document type' });

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { [`${docType}.status`]: status },
      { new: true }
    );

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // Notify the driver
    const io = req.app.get('io');
    await createNotification(io, {
      user: vehicle.ownerId,
      title: status === 'Verified' ? '✅ Document Verified!' : '❌ Document Rejected',
      message: `Your ${docType.replace(/([A-Z])/g, ' $1')} for vehicle ${vehicle.registrationNumber} was ${status}. ${reason || ''}`,
      type: 'Account'
    });

    res.json({ message: `Document ${status}`, vehicle });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Admin: get all vehicles pending verification
// @route   GET /api/vehicles/pending-kyc
// @access  Private (Admin)
exports.getPendingKYC = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      $or: [
        { 'rcDocument.status': 'Pending' },
        { 'insuranceDocument.status': 'Pending' },
        { 'permitDocument.status': 'Pending' }
      ]
    }).populate('ownerId', 'firstName lastName email mobile');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
