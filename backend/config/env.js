require('dotenv').config();

/**
 * Centralized, validated access to environment variables. Fails fast in
 * production if a required secret is missing, instead of running silently
 * with an insecure default.
 */
const required = ['MONGO_URI', 'JWT_SECRET'];

if (process.env.NODE_ENV === 'production') {
  required.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'dev_only_insecure_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_REMEMBER_EXPIRES_IN: process.env.JWT_REMEMBER_EXPIRES_IN || '30d',
  JWT_COOKIE_EXPIRES_IN_DAYS: Number(process.env.JWT_COOKIE_EXPIRES_IN_DAYS) || 1,
  JWT_REMEMBER_COOKIE_EXPIRES_IN_DAYS:
    Number(process.env.JWT_REMEMBER_COOKIE_EXPIRES_IN_DAYS) || 30,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5500',
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  AUTH_RATE_LIMIT_WINDOW_MINUTES: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES) || 15,
  AUTH_RATE_LIMIT_MAX: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
};
