// src/modules/department/department.controller.js
// ============================================================
// Department controller — provides GET /api/v1/departments
// ============================================================

import Department from '../../models/Department.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';

/**
 * GET /api/v1/departments
 * List active departments for form dropdowns & filters
 */
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.findAll({
      where: { is_active: true },
      order: [['sort_order', 'ASC'], ['name_mr', 'ASC']],
      attributes: ['id', 'name_en', 'name_mr', 'short_code', 'officer_name', 'phone', 'email'],
    });

    return sendSuccess(res, {
      message: 'Departments list retrieved successfully',
      data: departments,
    });
  } catch (err) {
    next(err);
  }
};
