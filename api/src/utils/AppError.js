// src/utils/AppError.js
// ============================================================
// Operational error class — carries bilingual messages and
// machine-readable error codes (ERROR_MESSAGES.md format).
// ============================================================

class AppError extends Error {
  /**
   * @param {string} code - Error code (e.g. AUTH_INVALID_CREDENTIALS)
   * @param {number} httpStatus - HTTP status code
   * @param {{ en: string, mr: string }} message - Bilingual message
   * @param {string|null} [field] - Form field name
   * @param {object|null} [details] - Additional context
   */
  constructor(code, httpStatus, message, field = null, details = null) {
    super(message.en);
    this.code = code;
    this.httpStatus = httpStatus;
    this.message = message;
    this.field = field;
    this.details = details;
    this.isOperational = true;
  }
}

export default AppError;
