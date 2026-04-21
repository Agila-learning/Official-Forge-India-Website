const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: null for system-wide
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['Order', 'System', 'Support', 'Account', 'Promotion'],
        default: 'System'
    },
    isRead: { type: Boolean, default: false },
    link: { type: String } // Optional: URL to redirect user
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
