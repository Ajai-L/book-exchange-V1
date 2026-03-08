module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'open-self-secret',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '7d',
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_URL: process.env.API_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
