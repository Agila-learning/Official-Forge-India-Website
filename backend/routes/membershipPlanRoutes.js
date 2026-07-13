const express = require('express');
const router = express.Router();
const { getPlans, getAllPlans, createPlan, updatePlan, deletePlan } = require('../controllers/membershipPlanController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/all').get(protect, admin, getAllPlans);   // Admin sees inactive too

router.route('/')
  .get(getPlans)
  .post(protect, admin, createPlan);

router.route('/:id')
  .put(protect, admin, updatePlan)
  .delete(protect, admin, deletePlan);

module.exports = router;
