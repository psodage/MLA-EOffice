// src/utils/responseHelper.js
// ============================================================
// Standardized API response format for all endpoints.
// Ensures consistent JSON structure across the entire API.
// ============================================================

/**
 * Send a success response
 * @param {import('express').Response} res
 * @param {object} options
 * @param {number} [options.statusCode=200] - HTTP status code
 * @param {string} [options.message='Success'] - Human-readable message
 * @param {any} [options.data=null] - Response payload
 * @param {object} [options.meta=null] - Pagination / extra metadata
 */
export const sendSuccess = (res, { statusCode = 200, message = 'Success', data = null, meta = null } = {}) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {import('express').Response} res
 * @param {object} options
 * @param {number} [options.statusCode=500] - HTTP status code
 * @param {string} [options.message='Internal Server Error'] - Error message
 * @param {any} [options.errors=null] - Validation errors or details
 */
export const sendError = (res, { statusCode = 500, message = 'Internal Server Error', errors = null } = {}) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
