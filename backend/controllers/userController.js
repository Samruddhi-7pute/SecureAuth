const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

// @desc    Get the logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toSafeObject() });
});

// @desc    Update the logged-in user's name and/or email
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  // If the email is changing, make sure it isn't already taken
  if (normalizedEmail !== req.user.email) {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'That email is already in use by another account.',
      });
    }
  }

  const user = await User.findById(req.user._id);
  user.name = name.trim();
  user.email = normalizedEmail;
  await user.save();

  res.status(200).json({ success: true, user: user.toSafeObject() });
});

module.exports = { getProfile, updateProfile };
