const mongoose = require('mongoose');

const workflowStepSchema = mongoose.Schema(
  {
    stepNumber: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String }, // Lucide icon name or image URL
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const WorkflowStep = mongoose.model('WorkflowStep', workflowStepSchema);
module.exports = WorkflowStep;
