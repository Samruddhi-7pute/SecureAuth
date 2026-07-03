const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const {
  JWT_COOKIE_EXPIRES_IN_DAYS,
  JWT_REMEMBER_COOKIE_EXPIRES_IN_DAYS,
  NODE_ENV,
} = require('../config/env');

/** Builds cookie options for the JWT httpOnly cookie. */
const buildCookieOptions = (rememberMe) => {
  const days = rememberMe ? JWT_REMEMBER_COOKIE_EXPIRES_IN_DAYS : JWT_COOKIE_EXPIRES_IN_DAYS;
  return {
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    httpOnly: true, // inaccessible to client-side JS — mitigates XSS token theft
    secure: NODE_ENV === 'production', // HTTPS only in production
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax', // cross-site cookie for Netlify <-> Render
    path: '/',
  };
};

/** Issues a JWT, sets the cookie, and returns the user + token in the response. */
const sendAuthResponse = (res, statusCode, user, rememberMe) => {
  const token = generateToken(user._id, rememberMe);
  res.cookie('token', token, buildCookieOptions(rememberMe));
  res.status(statusCode).json({ success: true, token, user: user.toSafeObject() });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists.',
    });
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password, // hashed automatically in the User model's pre-save hook
  });

  sendAuthResponse(res, 201, user, false);
});

// @desc    Authenticate user and issue a token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  // Deliberately generic message — avoids revealing whether an email is registered
  const invalidCredsMessage = 'Invalid email or password.';

  if (!user) {
    return res.status(401).json({ success: false, message: invalidCredsMessage });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: invalidCredsMessage });
  }

  user.lastLogin = new Date();
  await user.save();

  sendAuthResponse(res, 200, user, !!rememberMe);
});

// @desc    Log out the current user and clear the session cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

// @desc    Get the currently authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toSafeObject() });
});

module.exports = { registerUser, loginUser, logoutUser, getMe };
