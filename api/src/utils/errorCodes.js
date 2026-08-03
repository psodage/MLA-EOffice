// src/utils/errorCodes.js
// ============================================================
// Auth + RBAC error dictionary (ERROR_MESSAGES.md §2.1–2.2)
// ============================================================

import AppError from './AppError.js';

const errors = {
  AUTH_INVALID_CREDENTIALS: {
    code: 'AUTH_INVALID_CREDENTIALS',
    httpStatus: 401,
    message: {
      en: 'Invalid username or password.',
      mr: 'अमान्य वापरकर्ता नाव किंवा पासवर्ड.',
    },
  },
  AUTH_ACCOUNT_INACTIVE: {
    code: 'AUTH_ACCOUNT_INACTIVE',
    httpStatus: 403,
    message: {
      en: 'Your account has been deactivated. Contact administrator.',
      mr: 'आपले खाते निष्क्रिय केले आहे. प्रशासकाशी संपर्क साधा.',
    },
  },
  AUTH_ACCOUNT_LOCKED: {
    code: 'AUTH_ACCOUNT_LOCKED',
    httpStatus: 423,
    message: {
      en: 'Account locked due to 5 failed login attempts. Try after 15 minutes.',
      mr: '५ अयशस्वी प्रयत्नांमुळे खाते बंद आहे. १५ मिनिटांनंतर प्रयत्न करा.',
    },
  },
  AUTH_TOKEN_EXPIRED: {
    code: 'AUTH_TOKEN_EXPIRED',
    httpStatus: 401,
    message: {
      en: 'Session expired. Please log in again.',
      mr: 'सत्र संपले आहे. कृपया पुन्हा लॉगिन करा.',
    },
  },
  AUTH_TOKEN_INVALID: {
    code: 'AUTH_TOKEN_INVALID',
    httpStatus: 401,
    message: {
      en: 'Invalid or malformed authentication token.',
      mr: 'अमान्य प्रमाणीकरण टोकन.',
    },
  },
  AUTH_TOKEN_MISSING: {
    code: 'AUTH_TOKEN_MISSING',
    httpStatus: 401,
    message: {
      en: 'No auth token provided.',
      mr: 'प्रमाणीकरण टोकन प्रदान केले नाही.',
    },
  },
  AUTH_REFRESH_TOKEN_INVALID: {
    code: 'AUTH_REFRESH_TOKEN_INVALID',
    httpStatus: 401,
    message: {
      en: 'Refresh token is invalid or revoked. Please log in again.',
      mr: 'रीफ्रेश टोकन अमान्य आहे. कृपया पुन्हा लॉगिन करा.',
    },
  },
  AUTH_REFRESH_TOKEN_EXPIRED: {
    code: 'AUTH_REFRESH_TOKEN_EXPIRED',
    httpStatus: 401,
    message: {
      en: 'Refresh token has expired. Please log in again.',
      mr: 'रीफ्रेश टोकन संपले आहे. कृपया पुन्हा लॉगिन करा.',
    },
  },
  AUTH_OUTSIDE_OFFICE_HOURS: {
    code: 'AUTH_OUTSIDE_OFFICE_HOURS',
    httpStatus: 403,
    message: {
      en: 'Login restricted to office hours ({{start}} – {{end}}) for your role.',
      mr: 'आपल्या भूमिकेसाठी लॉगिन कार्यालयीन वेळेतच ({{start}} – {{end}}) उपलब्ध आहे.',
    },
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    httpStatus: 400,
    message: {
      en: 'Multiple validation errors occurred.',
      mr: 'अनेक वैधता त्रुटी आढळल्या.',
    },
  },
  RBAC_FORBIDDEN: {
    code: 'RBAC_FORBIDDEN',
    httpStatus: 403,
    message: {
      en: 'Insufficient permissions.',
      mr: 'ही कृती करण्याची आपल्याला परवानगी नाही.',
    },
  },
  RBAC_FORBIDDEN_MODULE: {
    code: 'RBAC_FORBIDDEN_MODULE',
    httpStatus: 403,
    message: {
      en: 'You do not have access to this module.',
      mr: 'या मॉड्यूलमध्ये आपल्याला प्रवेश नाही.',
    },
  },
  SYS_INTERNAL_ERROR: {
    code: 'SYS_INTERNAL_ERROR',
    httpStatus: 500,
    message: {
      en: 'Internal server error. Please try again later.',
      mr: 'अंतर्गत सर्व्हर त्रुटी. कृपया नंतर प्रयत्न करा.',
    },
  },
};

const interpolate = (str, params = {}) =>
  str.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] ?? key);

/**
 * Create an AppError from the error dictionary.
 * @param {string} errorCode
 * @param {object} [params]
 * @param {string|null} [field]
 * @param {object|null} [details]
 */
export const createError = (errorCode, params = {}, field = null, details = null) => {
  const errDef = errors[errorCode] || errors.SYS_INTERNAL_ERROR;

  return new AppError(
    errDef.code,
    errDef.httpStatus,
    {
      en: interpolate(errDef.message.en, params),
      mr: interpolate(errDef.message.mr, params),
    },
    field,
    details
  );
};

export { errors };
