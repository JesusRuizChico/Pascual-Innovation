// backend-selectia/src/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// @route   GET api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', auth, notificationController.getMyNotifications);

// @route   PUT api/notifications/:id/read
// @desc    Mark specific notification as read
// @access  Private
router.put('/:id/read', auth, notificationController.markAsRead);

// @route   PUT api/notifications/read-all
// @desc    Mark ALL notifications as read
// @access  Private
router.put('/read-all', auth, notificationController.markAllRead);

// @route   DELETE api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', auth, notificationController.deleteNotification);

module.exports = router;