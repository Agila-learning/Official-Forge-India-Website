const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submissionUrl: { type: String, required: true },
    remarks: { type: String },
    score: { type: Number },
    status: { type: String, enum: ['Submitted', 'Reviewed'], default: 'Submitted' }
  },
  { timestamps: true }
);

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
