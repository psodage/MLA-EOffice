// src/modules/auth/auth.controller.js
// ============================================================
// Auth controller — login, refresh, logout, me
// ============================================================

import {
  authenticateUser,
  refreshAccessToken,
  logoutUser,
  setRefreshCookie,
  clearRefreshCookie,
} from './auth.service.js';
import { loginSchema } from './auth.validation.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';

/**
 * POST /api/v1/auth/login
 */
export const login = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return sendError(res, {
        statusCode: 400,
        message: 'Validation Error',
        errors: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message,
        })),
      });
    }

    const { username, password } = value;
    const ip = req.ip || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await authenticateUser(username, password, ip, userAgent);

    // Set refresh token as httpOnly cookie
    setRefreshCookie(res, result.refreshToken);

    return sendSuccess(res, {
      message: 'Login successful',
      data: {
        accessToken: result.accessToken,
        user: result.user,
        mustChangePassword: result.mustChangePassword,
      },
    });
  } catch (err) {
    // Pass known errors with statusCode directly
    if (err.statusCode) {
      return sendError(res, {
        statusCode: err.statusCode,
        message: err.message,
      });
    }
    next(err);
  }
};

/**
 * POST /api/v1/auth/refresh
 */
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    const result = await refreshAccessToken(refreshToken);

    return sendSuccess(res, {
      message: 'Token refreshed',
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (err) {
    if (err.statusCode) {
      // Clear invalid cookie
      clearRefreshCookie(res);
      return sendError(res, {
        statusCode: err.statusCode,
        message: err.message,
      });
    }
    next(err);
  }
};

/**
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'];

    if (req.user?.userId) {
      await logoutUser(req.user.userId, ip, userAgent);
    }

    clearRefreshCookie(res);

    return sendSuccess(res, {
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/auth/me
 */
export const me = async (req, res, next) => {
  try {
    // req.user is attached by auth middleware (from JWT payload)
    return sendSuccess(res, {
      message: 'Current user profile',
      data: {
        userId: req.user.userId,
        username: req.user.username,
        role: req.user.role,
        modules: req.user.modules,
      },
    });
  } catch (err) {
    next(err);
  }
};
