const { isValidEmail, isValidName, validatePasswordStrength } = require('../utils/validators');

/**
 * Validates registration payloads. Collects every error so the frontend
 * can surface a complete, helpful message rather than one-at-a-time.
 */
const validateRegister = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];

  if (!isValidName(name)) errors.push('Name must be between 2 and 50 characters.');
  if (!isValidEmail(email)) errors.push('Please provide a valid email address.');

  const passwordCheck = validatePasswordStrength(password);
  if (!passwordCheck.valid) errors.push(passwordCheck.message);

  if (password !== confirmPassword) errors.push('Passwords do not match.');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors[0], errors });
  }
  next();
};

/**
 * Validates login payloads.
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!isValidEmail(email)) errors.push('Please provide a valid email address.');
  if (!password) errors.push('Password is required.');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors[0], errors });
  }
  next();
};

/**
 * Validates profile update payloads (name + email).
 */
const validateProfileUpdate = (req, res, next) => {
  const { name, email } = req.body;
  const errors = [];

  if (!isValidName(name)) errors.push('Name must be between 2 and 50 characters.');
  if (!isValidEmail(email)) errors.push('Please provide a valid email address.');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors[0], errors });
  }
  next();
};

module.exports = { validateRegister, validateLogin, validateProfileUpdate };
