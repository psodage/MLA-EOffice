// src/modules/inward/inward.controller.js
// ============================================================
// Inward Register Controller
// Handles request validation and response sending for Inward APIs
// ============================================================

import {
  listInwardEntries,
  createInwardEntry,
  getInwardEntryById,
  updateInwardEntry,
} from './inward.service.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';

/**
 * GET /api/v1/inward
 * List inward entries with filters, search, and pagination
 */
export const getInwardList = async (req, res, next) => {
  try {
    const result = await listInwardEntries(req.query);

    return sendSuccess(res, {
      message: 'Inward entries retrieved successfully',
      data: result.items,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/inward
 * Create a new inward letter entry
 */
export const createInward = async (req, res, next) => {
  try {
    const { sender_name, subject } = req.body;

    if (!sender_name || !sender_name.trim()) {
      return sendError(res, {
        statusCode: 400,
        message: 'Sender name is required (पाठवणाऱ्याचे नाव आवश्यक आहे)',
      });
    }

    if (!subject || !subject.trim()) {
      return sendError(res, {
        statusCode: 400,
        message: 'Subject is required (विषय आवश्यक आहे)',
      });
    }

    const userId = req.user?.userId || 1;
    const newEntry = await createInwardEntry(req.body, userId);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Inward entry created successfully',
      data: newEntry,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/inward/:id
 * Get single inward entry details
 */
export const getInwardById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await getInwardEntryById(id);

    return sendSuccess(res, {
      message: 'Inward entry details retrieved successfully',
      data: entry,
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

/**
 * PATCH /api/v1/inward/:id
 * Update status, priority, or assign inward entry
 */
export const updateInward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 1;

    const updatedEntry = await updateInwardEntry(id, req.body, userId);

    return sendSuccess(res, {
      message: 'Inward entry updated successfully',
      data: updatedEntry,
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
