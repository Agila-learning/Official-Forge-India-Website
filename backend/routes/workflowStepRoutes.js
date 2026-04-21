const express = require('express');
const router = express.Router();
const { getWorkflowSteps, createWorkflowStep, updateWorkflowStep, deleteWorkflowStep } = require('../controllers/workflowStepController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getWorkflowSteps)
  .post(protect, admin, createWorkflowStep);

router.route('/:id')
  .put(protect, admin, updateWorkflowStep)
  .delete(protect, admin, deleteWorkflowStep);

module.exports = router;
