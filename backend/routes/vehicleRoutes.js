const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMyVehicles,
  addVehicle,
  setActiveVehicle,
  uploadDocument,
  adminVerifyDocument,
  getPendingKYC
} = require('../controllers/vehicleController');

router.get('/', protect, getMyVehicles);
router.post('/', protect, addVehicle);
router.put('/:id/set-active', protect, setActiveVehicle);
router.put('/:id/document', protect, uploadDocument);
router.put('/:id/verify', protect, adminVerifyDocument);
router.get('/pending-kyc', protect, getPendingKYC);

module.exports = router;
