const prisma = require('../config/db');

// Get all notifications for user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user has recorded health data today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await prisma.healthRecord.findUnique({
      where: {
        userId_date: { userId, date: today },
      },
    });

    if (!record) {
      // Check if reminder was already generated today
      const startOfToday = new Date(today);
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);

      const existingReminder = await prisma.notification.findFirst({
        where: {
          userId,
          type: 'reminder',
          createdAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      });

      if (!existingReminder) {
        await prisma.notification.create({
          data: {
            userId,
            title: 'Pengingat Harian',
            message: 'Jangan lupa untuk mencatat data kesehatan harianmu hari ini untuk memantau kesehatanmu!',
            type: 'reminder',
            isRead: false,
          },
        });
      }
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server saat mengambil notifikasi.' });
  }
};

// Mark single notification as read
const markAsRead = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.id;

    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notifikasi tidak ditemukan.' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({ message: 'Notifikasi ditandai telah dibaca.', notification: updated });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.json({ message: 'Semua notifikasi ditandai telah dibaca.' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Delete single notification
const deleteNotification = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.id;

    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notifikasi tidak ditemukan.' });
    }

    await prisma.notification.delete({
      where: { id },
    });

    res.json({ message: 'Notifikasi berhasil dihapus.' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Clear all notifications
const clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.notification.deleteMany({
      where: { userId },
    });

    res.json({ message: 'Semua notifikasi berhasil dihapus.' });
  } catch (error) {
    console.error('Clear all notifications error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};
