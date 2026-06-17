const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { validateRegister, validateLogin, validateProfileUpdate } = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', validateRegister, register);

// POST /api/auth/login
router.post('/login', validateLogin, login);

// GET /api/auth/me
router.get('/me', authMiddleware, getMe);

// PUT /api/auth/profile
router.put('/profile', authMiddleware, validateProfileUpdate, updateProfile);

module.exports = router;

