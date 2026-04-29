const mongoose = require('mongoose');

const subscriberSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    }
  },
  { timestamps: true }
);

const Subscriber = mongoose.model('Subscriber', subscriberSchema);
module.exports = Subscriber;
