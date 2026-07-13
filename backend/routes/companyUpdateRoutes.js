const express = require('express');
const router = express.Router();
const { 
    getCompanyUpdates, 
    createCompanyUpdate, 
    deleteCompanyUpdate 
} = require('../controllers/companyUpdateController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCompanyUpdates)
    .post(protect, admin, createCompanyUpdate);

router.route('/:id')
    .delete(protect, admin, deleteCompanyUpdate);

module.exports = router;
