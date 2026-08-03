// src/modules/karyakarta/karyakarta.controller.js
// ============================================================
// Karyakarta Directory Controller — Handles API requests
// ============================================================

import {
  listKaryakartas,
  getUpcomingBirthdays,
  getBoothView,
  createKaryakarta,
  bulkImportKaryakartas,
} from './karyakarta.service.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';

/** GET /api/v1/karyakartas */
export const getKaryakartasList = async (req, res, next) => {
  try {
    const result = await listKaryakartas(req.query);
    return sendSuccess(res, {
      message: 'Karyakartas list retrieved successfully',
      data: result.items,
      summary: result.summary,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/karyakartas/birthdays */
export const getUpcomingBirthdaysController = async (req, res, next) => {
  try {
    const birthdays = await getUpcomingBirthdays();
    return sendSuccess(res, {
      message: 'Upcoming birthdays in next 7 days retrieved successfully',
      data: birthdays,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/karyakartas/booth/:boothId */
export const getBoothViewController = async (req, res, next) => {
  try {
    const { boothId } = req.params;
    const workers = await getBoothView(boothId);
    return sendSuccess(res, {
      message: `Booth ${boothId} workers retrieved successfully`,
      data: workers,
    });
  } catch (err) {
    next(err);
  }
};

/** POST /api/v1/karyakartas */
export const createKaryakartaController = async (req, res, next) => {
  try {
    const { full_name, mobile } = req.body;
    if (!full_name || !full_name.trim()) {
      return sendError(res, { statusCode: 400, message: 'Full name is required (कार्यकर्त्याचे नाव आवश्यक आहे)' });
    }
    if (!mobile || mobile.trim().length !== 10) {
      return sendError(res, { statusCode: 400, message: 'Valid 10-digit mobile number is required' });
    }

    const userId = req.user?.userId || 1;
    const newWorker = await createKaryakarta(req.body, userId);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Karyakarta registered successfully',
      data: newWorker,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};

/** POST /api/v1/karyakartas/import */
export const bulkImportController = async (req, res, next) => {
  try {
    const { rows } = req.body;
    if (!rows || !Array.isArray(rows)) {
      return sendError(res, { statusCode: 400, message: 'Array of rows is required for import' });
    }

    const userId = req.user?.userId || 1;
    const importResult = await bulkImportKaryakartas(rows, userId);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Bulk import process completed',
      data: importResult,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};
