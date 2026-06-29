const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Fetching notifications failed', error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user.id }, { isRead: true });
        res.json({ message: 'Notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Action failed', error: error.message });
    }
};
