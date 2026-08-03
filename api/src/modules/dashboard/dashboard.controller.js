// src/modules/dashboard/dashboard.controller.js
// ============================================================
// Dashboard controller — handles GET /api/v1/dashboard/summary
// ============================================================

import { getDashboardSummary } from './dashboard.service.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';

/**
 * GET /api/v1/dashboard/summary
 * Returns role-specific summary stats, recent activities, and quick actions
 */
export const getSummary = async (req, res, next) => {
  try {
    const summaryData = await getDashboardSummary(req.user);

    return sendSuccess(res, {
      message: 'Dashboard summary retrieved successfully',
      data: summaryData,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, {
        statusCode: err.statusCode,
        message: err.message,
      });
    }
    next(err);
  }
};
