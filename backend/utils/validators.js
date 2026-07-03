const validator = require('validator');

const isValidEmail = (email) =>
  typeof email === 'string' && validator.isEmail(email.trim());

const isValidName = (name) =>
  typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 50;

/**
 * Enforces a strong password policy:
 * min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.
 */
const validatePasswordStrength = (password) => {
  if (typeof password !== 'string') {
    return { valid: false, message: 'Password is required.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must include at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must include at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must include at least one number.' };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password)) {
    return { valid: false, message: 'Password must include at least one special character.' };
  }
  return { valid: true, message: 'Password meets strength requirements.' };
};

module.exports = { isValidEmail, isValidName, validatePasswordStrength };
