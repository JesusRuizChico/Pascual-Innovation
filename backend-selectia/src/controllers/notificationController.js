// backend-selectia/src/controllers/notificationController.js
const Notification = require('../models/Notification');

// Get my notifications
exports.getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ date: -1 }) // Newest first
            .limit(20); // Limit to last 20
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching notifications');
    }
};

// Mark one as read
exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ msg: 'Notification marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating notification');
    }
};

// Mark ALL as read
exports.markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
        res.json({ msg: 'All notifications marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating notifications');
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Notification deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting notification');
    }
};