const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN, JWT_REMEMBER_EXPIRES_IN } = require('../config/env');

/**
 * Signs a JWT for the given user id.
 * @param {string} userId
 * @param {boolean} rememberMe - issues a longer-lived token when true
 */
const generateToken = (userId, rememberMe = false) => {
  const expiresIn = rememberMe ? JWT_REMEMBER_EXPIRES_IN : JWT_EXPIRES_IN;
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn,
    issuer: 'secureauth-system',
  });
};

module.exports = generateToken;
