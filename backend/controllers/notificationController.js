const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ 
            $or: [{ user: req.user._id }, { user: null }] 
        }).sort({ createdAt: -1 }).limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification) {
            notification.isRead = true;
            await notification.save();
            res.json({ message: 'Marked as read' });
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ message: 'All signals acknowledged' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Internal utility to create notifications
// Can be called from other controllers
exports.createNotification = async (io, data) => {
    try {
        const notification = await Notification.create(data);
        if (io && data.user) {
            io.to(data.user.toString()).emit('new-notification', notification);
        }
        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
};
