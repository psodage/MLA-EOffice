// src/modules/visitor/visitor.controller.js
// ============================================================
// Visitor Book Controller — Handles API requests
// ============================================================

import {
  checkInVisitor,
  checkOutVisitor,
  listVisitors,
  lookupVisitorByMobile,
  convertVisitorToNivedan,
} from './visitor.service.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';

/** GET /api/v1/visitors/lookup/:mobile */
export const lookupMobileController = async (req, res, next) => {
  try {
    const { mobile } = req.params;
    if (!mobile || mobile.trim().length < 10) {
      return sendError(res, { statusCode: 400, message: 'Valid 10-digit mobile number required' });
    }

    const repeatDetails = await lookupVisitorByMobile(mobile);
    return sendSuccess(res, {
      message: 'Mobile lookup completed',
      data: repeatDetails,
    });
  } catch (err) {
    next(err);
  }
};

/** POST /api/v1/visitors/checkin */
export const checkInController = async (req, res, next) => {
  try {
    const { visitor_name, mobile, purpose } = req.body;

    if (!visitor_name || !visitor_name.trim()) {
      return sendError(res, { statusCode: 400, message: 'Visitor name is required (भेटणाऱ्याचे नाव आवश्यक आहे)' });
    }
    if (!mobile || !mobile.trim() || mobile.trim().length < 10) {
      return sendError(res, { statusCode: 400, message: 'Valid 10-digit mobile number is required' });
    }
    if (!purpose) {
      return sendError(res, { statusCode: 400, message: 'Purpose is required (भेटण्याचे कारण आवश्यक आहे)' });
    }

    const userId = req.user?.userId || 3; // Receptionist default
    const newVisitor = await checkInVisitor(req.body, userId);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Visitor checked in successfully',
      data: newVisitor,
    });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/v1/visitors/:id/checkout */
export const checkOutController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedVisitor = await checkOutVisitor(id);

    return sendSuccess(res, {
      message: 'Visitor checked out successfully',
      data: updatedVisitor,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};

/** GET /api/v1/visitors */
export const listVisitorsController = async (req, res, next) => {
  try {
    const result = await listVisitors(req.query);

    return sendSuccess(res, {
      message: 'Visitor log retrieved successfully',
      data: result.items,
      summary: result.summary,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

/** POST /api/v1/visitors/:id/convert-nivedan */
export const convertToNivedanController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 3;

    const result = await convertVisitorToNivedan(id, req.body, userId);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Visitor grievance successfully converted to official Nivedan petition',
      data: result,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};
