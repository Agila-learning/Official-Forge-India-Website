const WorkflowStep = require('../models/WorkflowStep');
const asyncHandler = require('express-async-handler');

// @desc    Get all Workflow Steps
// @route   GET /api/workflow-steps
// @access  Public
const getWorkflowSteps = asyncHandler(async (req, res) => {
  const steps = await WorkflowStep.find({}).sort('order');
  res.json(steps);
});

// @desc    Create a Workflow Step
// @route   POST /api/workflow-steps
// @access  Private/Admin
const createWorkflowStep = asyncHandler(async (req, res) => {
  const { stepNumber, title, description, icon, order, isActive } = req.body;
  const step = await WorkflowStep.create({ stepNumber, title, description, icon, order, isActive });
  res.status(201).json(step);
});

// @desc    Update a Workflow Step
// @route   PUT /api/workflow-steps/:id
// @access  Private/Admin
const updateWorkflowStep = asyncHandler(async (req, res) => {
  const step = await WorkflowStep.findById(req.params.id);
  if (step) {
    step.stepNumber = req.body.stepNumber || step.stepNumber;
    step.title = req.body.title || step.title;
    step.description = req.body.description || step.description;
    step.icon = req.body.icon || step.icon;
    step.order = req.body.order !== undefined ? req.body.order : step.order;
    step.isActive = req.body.isActive !== undefined ? req.body.isActive : step.isActive;

    const updatedStep = await step.save();
    res.json(updatedStep);
  } else {
    res.status(404);
    throw new Error('Step not found');
  }
});

// @desc    Delete a Workflow Step
// @route   DELETE /api/workflow-steps/:id
// @access  Private/Admin
const deleteWorkflowStep = asyncHandler(async (req, res) => {
  const step = await WorkflowStep.findById(req.params.id);
  if (step) {
    await step.deleteOne();
    res.json({ message: 'Step removed' });
  } else {
    res.status(404);
    throw new Error('Step not found');
  }
});

module.exports = {
  getWorkflowSteps,
  createWorkflowStep,
  updateWorkflowStep,
  deleteWorkflowStep
};
