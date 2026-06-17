const prisma = require('../config/db');
const { calculateHealthScore, getScoreCategory } = require('../utils/healthScore');
const { generateInsights } = require('../utils/insights');

// Create a health record
const createRecord = async (req, res) => {
  try {
    const { sleepHours, waterGlasses, exerciseMinutes, screenTimeHours, date } = req.body;
    const userId = req.user.id;

    const recordDate = date ? new Date(date) : new Date();
    // Normalize to date only (no time)
    recordDate.setHours(0, 0, 0, 0);

    // Check if record already exists for this date
    const existing = await prisma.healthRecord.findUnique({
      where: {
        userId_date: { userId, date: recordDate },
      },
    });

    if (existing) {
      return res.status(400).json({
        message: 'Data untuk tanggal ini sudah ada. Gunakan fitur edit untuk mengubahnya.',
      });
    }

    // Calculate health score
    const healthScore = calculateHealthScore({
      sleepHours, waterGlasses, exerciseMinutes, screenTimeHours,
    });

    const record = await prisma.healthRecord.create({
      data: {
        userId,
        date: recordDate,
        sleepHours,
        waterGlasses,
        exerciseMinutes,
        screenTimeHours,
        healthScore,
      },
    });

    const insights = generateInsights({
      sleepHours, waterGlasses, exerciseMinutes, screenTimeHours,
    });

    // Generate notification automatically
    const category = getScoreCategory(healthScore);
    let notifType = 'info';
    let notifMessage = `Kamu telah mencatat data kesehatan hari ini. Skor Kesehatan: ${healthScore} (${category}).`;

    if (healthScore >= 80) {
      notifType = 'success';
      notifMessage = `Luar biasa! Skor kesehatanmu hari ini adalah ${healthScore} (${category}). Pilihan hidup sehatmu membuahkan hasil yang bagus!`;
    } else if (healthScore < 50) {
      notifType = 'warning';
      notifMessage = `Skor kesehatanmu hari ini adalah ${healthScore} (${category}). Coba perbanyak istirahat dan kurangi waktu menatap layar besok ya!`;
    }

    try {
      await prisma.notification.create({
        data: {
          userId,
          title: 'Data Kesehatan Disimpan',
          message: notifMessage,
          type: notifType,
        },
      });
    } catch (err) {
      console.error('Failed to create notification on record creation:', err);
    }

    res.status(201).json({
      message: 'Data kesehatan berhasil disimpan!',
      record: {
        ...record,
        category,
      },
      insights,
    });
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Get all records (with pagination, search, filter)
const getRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const sortBy = req.query.sortBy || 'date';
    const order = req.query.order || 'desc';

    // Build where clause
    const where = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const [records, total] = await Promise.all([
      prisma.healthRecord.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      }),
      prisma.healthRecord.count({ where }),
    ]);

    const recordsWithCategory = records.map(r => ({
      ...r,
      category: getScoreCategory(r.healthScore),
    }));

    res.json({
      records: recordsWithCategory,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Get single record
const getRecord = async (req, res) => {
  try {
    const record = await prisma.healthRecord.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });

    if (!record) {
      return res.status(404).json({ message: 'Data tidak ditemukan.' });
    }

    const insights = generateInsights({
      sleepHours: record.sleepHours,
      waterGlasses: record.waterGlasses,
      exerciseMinutes: record.exerciseMinutes,
      screenTimeHours: record.screenTimeHours,
    });

    res.json({
      record: {
        ...record,
        category: getScoreCategory(record.healthScore),
      },
      insights,
    });
  } catch (error) {
    console.error('Get record error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Update record
const updateRecord = async (req, res) => {
  try {
    const { sleepHours, waterGlasses, exerciseMinutes, screenTimeHours } = req.body;
    const recordId = parseInt(req.params.id);

    // Check ownership
    const existing = await prisma.healthRecord.findFirst({
      where: { id: recordId, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Data tidak ditemukan.' });
    }

    // Recalculate health score
    const healthScore = calculateHealthScore({
      sleepHours, waterGlasses, exerciseMinutes, screenTimeHours,
    });

    const record = await prisma.healthRecord.update({
      where: { id: recordId },
      data: {
        sleepHours,
        waterGlasses,
        exerciseMinutes,
        screenTimeHours,
        healthScore,
      },
    });

    const insights = generateInsights({
      sleepHours, waterGlasses, exerciseMinutes, screenTimeHours,
    });

    const category = getScoreCategory(healthScore);
    try {
      await prisma.notification.create({
        data: {
          userId: req.user.id,
          title: 'Data Kesehatan Diperbarui',
          message: `Kamu memperbarui data kesehatan hari ini. Skor Kesehatan baru: ${healthScore} (${category}).`,
          type: 'info',
        },
      });
    } catch (err) {
      console.error('Failed to create notification on record update:', err);
    }

    res.json({
      message: 'Data berhasil diperbarui!',
      record: {
        ...record,
        category,
      },
      insights,
    });
  } catch (error) {
    console.error('Update record error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Delete record
const deleteRecord = async (req, res) => {
  try {
    const recordId = parseInt(req.params.id);

    const existing = await prisma.healthRecord.findFirst({
      where: { id: recordId, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Data tidak ditemukan.' });
    }

    await prisma.healthRecord.delete({ where: { id: recordId } });

    res.json({ message: 'Data berhasil dihapus!' });
  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Get today's record
const getTodayRecord = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await prisma.healthRecord.findUnique({
      where: {
        userId_date: { userId: req.user.id, date: today },
      },
    });

    if (!record) {
      return res.json({ record: null, insights: [], message: 'Belum ada data hari ini.' });
    }

    const insights = generateInsights({
      sleepHours: record.sleepHours,
      waterGlasses: record.waterGlasses,
      exerciseMinutes: record.exerciseMinutes,
      screenTimeHours: record.screenTimeHours,
    });

    res.json({
      record: {
        ...record,
        category: getScoreCategory(record.healthScore),
      },
      insights,
    });
  } catch (error) {
    console.error('Get today error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Get weekly stats
const getWeeklyStats = async (req, res) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const records = await prisma.healthRecord.findMany({
      where: {
        userId: req.user.id,
        date: { gte: weekAgo },
      },
      orderBy: { date: 'asc' },
    });

    if (records.length === 0) {
      return res.json({
        stats: null,
        message: 'Belum ada data minggu ini.',
      });
    }

    const stats = {
      totalDays: records.length,
      avgScore: Math.round(records.reduce((sum, r) => sum + r.healthScore, 0) / records.length),
      avgSleep: parseFloat((records.reduce((sum, r) => sum + r.sleepHours, 0) / records.length).toFixed(1)),
      avgWater: Math.round(records.reduce((sum, r) => sum + r.waterGlasses, 0) / records.length),
      avgExercise: Math.round(records.reduce((sum, r) => sum + r.exerciseMinutes, 0) / records.length),
      avgScreenTime: parseFloat((records.reduce((sum, r) => sum + r.screenTimeHours, 0) / records.length).toFixed(1)),
      bestScore: Math.max(...records.map(r => r.healthScore)),
      worstScore: Math.min(...records.map(r => r.healthScore)),
    };

    stats.category = getScoreCategory(stats.avgScore);

    res.json({ stats, records });
  } catch (error) {
    console.error('Weekly stats error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Get monthly stats
const getMonthlyStats = async (req, res) => {
  try {
    const now = new Date();
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);
    monthAgo.setHours(0, 0, 0, 0);

    const records = await prisma.healthRecord.findMany({
      where: {
        userId: req.user.id,
        date: { gte: monthAgo },
      },
      orderBy: { date: 'asc' },
    });

    if (records.length === 0) {
      return res.json({
        stats: null,
        message: 'Belum ada data bulan ini.',
      });
    }

    const stats = {
      totalDays: records.length,
      avgScore: Math.round(records.reduce((sum, r) => sum + r.healthScore, 0) / records.length),
      avgSleep: parseFloat((records.reduce((sum, r) => sum + r.sleepHours, 0) / records.length).toFixed(1)),
      avgWater: Math.round(records.reduce((sum, r) => sum + r.waterGlasses, 0) / records.length),
      avgExercise: Math.round(records.reduce((sum, r) => sum + r.exerciseMinutes, 0) / records.length),
      avgScreenTime: parseFloat((records.reduce((sum, r) => sum + r.screenTimeHours, 0) / records.length).toFixed(1)),
      bestScore: Math.max(...records.map(r => r.healthScore)),
      worstScore: Math.min(...records.map(r => r.healthScore)),
    };

    stats.category = getScoreCategory(stats.avgScore);

    res.json({ stats, records });
  } catch (error) {
    console.error('Monthly stats error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Get trend data for charts
const getTrends = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const records = await prisma.healthRecord.findMany({
      where: {
        userId: req.user.id,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        sleepHours: true,
        waterGlasses: true,
        exerciseMinutes: true,
        screenTimeHours: true,
        healthScore: true,
      },
    });

    res.json({ records, days });
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

module.exports = {
  createRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord,
  getTodayRecord,
  getWeeklyStats,
  getMonthlyStats,
  getTrends,
};
