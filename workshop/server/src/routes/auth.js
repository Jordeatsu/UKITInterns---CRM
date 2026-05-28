const express    = require('express');
const router     = express.Router();
const { authenticate }       = require('../middleware/auth');
const { login, getMe }       = require('../controllers/authController');

// POST /api/auth/login  — exchange credentials for a JWT
router.post('/login', login);

// GET  /api/auth/me     — return the currently authenticated advisor
router.get('/me', authenticate, getMe);

module.exports = router;
