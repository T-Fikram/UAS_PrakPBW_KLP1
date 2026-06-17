const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { validateHealthRecord } = require('../middleware/validate');
const {
  createRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord,
  getTodayRecord,
  getWeeklyStats,
  getMonthlyStats,
  getTrends,
} = require('../controllers/healthController');

// All routes require authentication
router.use(authMiddleware);

// GET /api/health/today
router.get('/today', getTodayRecord);

// GET /api/health/stats/weekly
router.get('/stats/weekly', getWeeklyStats);

// GET /api/health/stats/monthly
router.get('/stats/monthly', getMonthlyStats);

// GET /api/health/trends
router.get('/trends', getTrends);

// CRUD operations
router.post('/records', validateHealthRecord, createRecord);
router.get('/records', getRecords);
router.get('/records/:id', getRecord);
router.put('/records/:id', validateHealthRecord, updateRecord);
router.delete('/records/:id', deleteRecord);

module.exports = router;
