const express = require('express');
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, logoutUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validateMiddleware');
const { AUTH_RATE_LIMIT_WINDOW_MINUTES, AUTH_RATE_LIMIT_MAX } = require('../config/env');

const router = express.Router();

// Throttles login/register attempts per IP to slow brute-force and
// credential-stuffing attacks.
const authLimiter = rateLimit({
  windowMs: AUTH_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: AUTH_RATE_LIMIT_MAX,
  message: {
    success: false,
    message: 'Too many attempts from this device. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);

module.exports = router;
