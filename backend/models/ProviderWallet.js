const mongoose = require('mongoose');

const providerWalletSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    withdrawableAmount: { type: Number, default: 0 },
    transactions: [
      {
        type: { type: String, enum: ['Credit', 'Debit'], required: true },
        amount: { type: Number, required: true },
        description: { type: String },
        bookingId: { type: mongoose.Schema.Types.ObjectId }, // Reference to Order/Rental/Ride
        status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const ProviderWallet = mongoose.model('ProviderWallet', providerWalletSchema);
module.exports = ProviderWallet;
