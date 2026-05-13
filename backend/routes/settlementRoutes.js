const express = require('express');
const router = express.Router();
const {
    approveSettlement,
    getPendingSettlements,
    getVendorSettlements
} = require('../controllers/settlementController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/pending').get(protect, admin, getPendingSettlements);
router.route('/approve/:id').post(protect, admin, approveSettlement);
router.route('/vendor').get(protect, getVendorSettlements);

module.exports = router;
