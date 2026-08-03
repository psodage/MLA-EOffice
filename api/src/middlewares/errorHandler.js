// src/middlewares/errorHandler.js
// ============================================================
// Global Express error handler.
// Catches all errors thrown/next(err) in routes and middleware.
// Returns a consistent JSON error response.
// ============================================================

import config from '../config/env.config.js';

/**
 * Global error handling middleware
 * Must have 4 parameters for Express to recognize it as an error handler
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  // Default values
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Validation Error';
    const errors = err.errors?.map(e => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Joi validation errors
  if (err.isJoi) {
    statusCode = 400;
    message = 'Validation Error';
    const errors = err.details?.map(d => ({
      field: d.path?.join('.'),
      message: d.message,
    }));
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  // Log error in development
  if (!config.app.isProduction) {
    console.error('❌ Error:', err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    // Include stack trace in development only
    ...((!config.app.isProduction) && { stack: err.stack }),
  });
};

export default errorHandler;
