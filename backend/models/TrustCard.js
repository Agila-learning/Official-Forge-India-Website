const mongoose = require('mongoose');

const trustCardSchema = mongoose.Schema(
  {
    icon: { type: String, required: true }, // Lucide icon name
    title: { type: String, required: true },
    val: { type: String, required: true }, // e.g. "100% Checked"
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TrustCard = mongoose.model('TrustCard', trustCardSchema);
module.exports = TrustCard;
