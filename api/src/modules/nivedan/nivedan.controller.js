// src/modules/nivedan/nivedan.controller.js
// ============================================================
// Nivedan Controller — Handles API endpoints
// ============================================================

import {
  getCategories,
  listNivedans,
  createNivedan,
  getNivedanById,
  updateNivedanStatus,
  addNivedanTimelineNote,
  trackNivedanByMobile,
} from './nivedan.service.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';

/** GET /api/v1/nivedans/categories */
export const getCategoriesController = async (req, res, next) => {
  try {
    const categories = await getCategories();
    return sendSuccess(res, {
      message: 'Categories list retrieved successfully',
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/nivedans */
export const getNivedanList = async (req, res, next) => {
  try {
    const result = await listNivedans(req.query);
    return sendSuccess(res, {
      message: 'Nivedan list retrieved successfully',
      data: result.items,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

/** POST /api/v1/nivedans */
export const createNivedanController = async (req, res, next) => {
  try {
    const { citizen_name, citizen_mobile, category_id, subject } = req.body;

    if (!citizen_name || !citizen_name.trim()) {
      return sendError(res, { statusCode: 400, message: 'Citizen name is required (नागरिकाचे नाव आवश्यक आहे)' });
    }
    if (!citizen_mobile || !citizen_mobile.trim()) {
      return sendError(res, { statusCode: 400, message: 'Citizen mobile is required (नागरिकाचा मोबाईल नंबर आवश्यक आहे)' });
    }
    if (!category_id) {
      return sendError(res, { statusCode: 400, message: 'Category is required (तक्रार वर्गवारी आवश्यक आहे)' });
    }
    if (!subject || !subject.trim()) {
      return sendError(res, { statusCode: 400, message: 'Subject is required (तक्रारीचा विषय आवश्यक आहे)' });
    }

    const userId = req.user?.userId || 1;
    const newEntry = await createNivedan(req.body, userId);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Nivedan petition created successfully',
      data: newEntry,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/nivedans/:id */
export const getNivedanByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await getNivedanById(id);
    return sendSuccess(res, {
      message: 'Nivedan details retrieved successfully',
      data: entry,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};

/** PATCH /api/v1/nivedans/:id/status */
export const updateNivedanStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 1;

    const updatedEntry = await updateNivedanStatus(id, req.body, userId);

    return sendSuccess(res, {
      message: 'Nivedan status updated successfully',
      data: updatedEntry,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};

/** POST /api/v1/nivedans/:id/timeline */
export const addTimelineNoteController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 1;

    const updatedEntry = await addNivedanTimelineNote(id, req.body, userId);

    return sendSuccess(res, {
      message: 'Timeline note added successfully',
      data: updatedEntry,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};

/** GET /api/v1/nivedans/track/:mobile (Public) */
export const trackNivedanByMobileController = async (req, res, next) => {
  try {
    const { mobile } = req.params;
    if (!mobile || mobile.trim().length < 10) {
      return sendError(res, { statusCode: 400, message: 'Valid 10-digit mobile number is required' });
    }

    const nivedans = await trackNivedanByMobile(mobile);

    return sendSuccess(res, {
      message: `Citizen petitions retrieved for mobile ${mobile}`,
      data: nivedans,
    });
  } catch (err) {
    next(err);
  }
};
