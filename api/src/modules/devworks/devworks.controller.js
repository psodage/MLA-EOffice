// src/modules/devworks/devworks.controller.js
// ============================================================
// Development Works Controller — Handles API requests
// ============================================================

import {
  listDevWorks,
  createDevWork,
  getDevWorkById,
  updateDevWork,
  addDevWorkPhoto,
} from './devworks.service.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';

/** GET /api/v1/devworks */
export const getDevWorksList = async (req, res, next) => {
  try {
    const result = await listDevWorks(req.query);
    return sendSuccess(res, {
      message: 'Development works list retrieved successfully',
      data: result.items,
      summary: result.summary,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

/** POST /api/v1/devworks */
export const createDevWorkController = async (req, res, next) => {
  try {
    const { project_name, category, location, budget_allocated } = req.body;

    if (!project_name || !project_name.trim()) {
      return sendError(res, { statusCode: 400, message: 'Project name is required (कामाचे नाव आवश्यक आहे)' });
    }
    if (!category) {
      return sendError(res, { statusCode: 400, message: 'Category is required (कामाचा प्रकार आवश्यक आहे)' });
    }
    if (!location || !location.trim()) {
      return sendError(res, { statusCode: 400, message: 'Location is required (ठिकाण आवश्यक आहे)' });
    }

    const userId = req.user?.userId || 1;
    const newEntry = await createDevWork(req.body, userId);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Development work project created successfully',
      data: newEntry,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/devworks/:id */
export const getDevWorkByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await getDevWorkById(id);
    return sendSuccess(res, {
      message: 'Development work details retrieved successfully',
      data: entry,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};

/** PATCH /api/v1/devworks/:id */
export const updateDevWorkController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 1;

    const updatedEntry = await updateDevWork(id, req.body, userId);
    return sendSuccess(res, {
      message: 'Development work updated successfully',
      data: updatedEntry,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};

/** POST /api/v1/devworks/:id/photos */
export const addDevWorkPhotoController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 1;

    const photo = await addDevWorkPhoto(id, req.body, userId);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Geotagged photo uploaded successfully',
      data: photo,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};
