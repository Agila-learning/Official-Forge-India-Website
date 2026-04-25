const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema(
  {
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    maxPoints: { type: Number, default: 100 },
    attachments: [{ 
        name: String,
        url: String
    }]
  },
  { timestamps: true }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
