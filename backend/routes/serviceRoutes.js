const express = require('express');
const { getServices, getServiceBySlug, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, admin, createService);

router.route('/slug/:slug')
  .get(getServiceBySlug);

router.route('/:id')
  .put(protect, admin, updateService)
  .delete(protect, admin, deleteService);

module.exports = router;
