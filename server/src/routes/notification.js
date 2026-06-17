const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// GET /api/notifications - Get all notifications for user (and dynamically trigger reminders)
router.get('/', getNotifications);

// PATCH /api/notifications/read-all - Mark all as read
router.patch('/read-all', markAllAsRead);

// PATCH /api/notifications/:id/read - Mark one as read
router.patch('/:id/read', markAsRead);

// DELETE /api/notifications/ - Clear all notifications
router.delete('/', clearAllNotifications);

// DELETE /api/notifications/:id - Delete one notification
router.delete('/:id', deleteNotification);

module.exports = router;
