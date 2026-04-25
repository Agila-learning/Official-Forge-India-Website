const mongoose = require('mongoose');

const materialSchema = mongoose.Schema(
  {
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['Note', 'Recording', 'Code', 'Other'], default: 'Note' },
    url: { type: String, required: true },
    description: { type: String }
  },
  { timestamps: true }
);

const Material = mongoose.model('Material', materialSchema);
module.exports = Material;
