// src/modules/reports/reports.controller.js
// ============================================================
// Reports & Analytics Controller — Handles API requests
// ============================================================

import {
  getNivedanReport,
  getDevWorksReport,
  getVisitorsReport,
  getInwardPendencyReport,
  getBoothCoverageReport,
} from './reports.service.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';

/** GET /api/v1/reports/nivedans */
export const getNivedanReportController = async (req, res, next) => {
  try {
    const report = await getNivedanReport(req.query);
    return sendSuccess(res, {
      message: 'Nivedans report generated successfully',
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/reports/devworks */
export const getDevWorksReportController = async (req, res, next) => {
  try {
    const report = await getDevWorksReport();
    return sendSuccess(res, {
      message: 'Development works budget report generated successfully',
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/reports/visitors */
export const getVisitorsReportController = async (req, res, next) => {
  try {
    const report = await getVisitorsReport(req.query);
    return sendSuccess(res, {
      message: 'Visitor statistics report generated successfully',
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/reports/inward-pendency */
export const getInwardPendencyReportController = async (req, res, next) => {
  try {
    const report = await getInwardPendencyReport();
    return sendSuccess(res, {
      message: 'Inward pendency aging report generated successfully',
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/reports/booth-coverage */
export const getBoothCoverageReportController = async (req, res, next) => {
  try {
    const report = await getBoothCoverageReport();
    return sendSuccess(res, {
      message: 'Booth coverage report generated successfully',
      data: report,
    });
  } catch (err) {
    next(err);
  }
};
