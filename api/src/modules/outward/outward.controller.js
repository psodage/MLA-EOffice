// src/modules/outward/outward.controller.js
// ============================================================
// Outward Register Controller — Handles API requests
// ============================================================

import {
  listOutwardEntries,
  createOutwardEntry,
  getOutwardEntryById,
  approveOutwardEntry,
  generateAiDraftService,
} from './outward.service.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';

/**
 * GET /api/v1/outward
 * List outward entries with filters & pagination
 */
export const getOutwardList = async (req, res, next) => {
  try {
    const result = await listOutwardEntries(req.query);

    return sendSuccess(res, {
      message: 'Outward entries retrieved successfully',
      data: result.items,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/outward
 * Create a new outward letter entry
 */
export const createOutward = async (req, res, next) => {
  try {
    const { recipient_name, subject, body_text } = req.body;

    if (!recipient_name || !recipient_name.trim()) {
      return sendError(res, {
        statusCode: 400,
        message: 'Recipient name is required (पत्र मिळणाऱ्याचे नाव आवश्यक आहे)',
      });
    }

    if (!subject || !subject.trim()) {
      return sendError(res, {
        statusCode: 400,
        message: 'Subject is required (विषय आवश्यक आहे)',
      });
    }

    if (!body_text || !body_text.trim()) {
      return sendError(res, {
        statusCode: 400,
        message: 'Letter body text is required (पत्राचा मसुदा आवश्यक आहे)',
      });
    }

    const userId = req.user?.userId || 1;
    const newEntry = await createOutwardEntry(req.body, userId);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Outward entry created successfully',
      data: newEntry,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/outward/ai-draft
 * Generate AI formal Marathi government letter draft
 */
export const generateAiDraft = async (req, res, next) => {
  try {
    const { subject } = req.body;
    if (!subject || !subject.trim()) {
      return sendError(res, {
        statusCode: 400,
        message: 'Subject is required for AI drafting (विषय आवश्यक आहे)',
      });
    }

    const draftResult = await generateAiDraftService(req.body);

    return sendSuccess(res, {
      message: 'AI letter draft generated successfully',
      data: draftResult,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/outward/:id
 * Get single outward entry by ID
 */
export const getOutwardById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await getOutwardEntryById(id);

    return sendSuccess(res, {
      message: 'Outward entry details retrieved successfully',
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
 * PATCH /api/v1/outward/:id/approve
 * Mark outward entry as approved
 */
export const approveOutward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 1;

    const approvedEntry = await approveOutwardEntry(id, userId);

    return sendSuccess(res, {
      message: 'Outward entry approved successfully',
      data: approvedEntry,
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
