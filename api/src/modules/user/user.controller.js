// src/modules/user/user.controller.js
// ============================================================
// User Management & Settings Controller — Handles API requests
// ============================================================

import {
  listUsers,
  createUser,
  toggleUserActive,
  resetUserPassword,
  updateAccessibleModules,
} from './user.service.js';
import {
  getDepartmentSettings,
  getGreetingSettings,
  addGreetingSetting,
  getCategorySettings,
} from './settings.service.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';

/** GET /api/v1/users */
export const getUsersListController = async (req, res, next) => {
  try {
    const users = await listUsers();
    return sendSuccess(res, {
      message: 'System users list retrieved successfully',
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

/** POST /api/v1/users */
export const createUserController = async (req, res, next) => {
  try {
    const { username, full_name, role } = req.body;
    if (!username || !username.trim()) {
      return sendError(res, { statusCode: 400, message: 'Username is required (युझरनेम आवश्यक आहे)' });
    }
    if (!full_name || !full_name.trim()) {
      return sendError(res, { statusCode: 400, message: 'Full name is required (पूर्ण नाव आवश्यक आहे)' });
    }

    const creatorId = req.user?.userId || 1;
    const newUser = await createUser(req.body, creatorId);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'New system user created successfully',
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};

/** PATCH /api/v1/users/:id/active */
export const toggleUserActiveController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await toggleUserActive(id);
    return sendSuccess(res, {
      message: 'User active status updated successfully',
      data: updated,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};

/** PATCH /api/v1/users/:id/password */
export const resetUserPasswordController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { new_password } = req.body;
    const result = await resetUserPassword(id, new_password);
    return sendSuccess(res, {
      message: result.message,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};

/** PATCH /api/v1/users/:id/modules */
export const updateAccessibleModulesController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { accessible_modules } = req.body;
    if (!Array.isArray(accessible_modules)) {
      return sendError(res, { statusCode: 400, message: 'Array of accessible modules is required' });
    }

    const updated = await updateAccessibleModules(id, accessible_modules);
    return sendSuccess(res, {
      message: 'Accessible modules updated successfully',
      data: updated,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};

// ── Settings Handlers ────────────────────────────────────────

/** GET /api/v1/settings/departments */
export const getDepartmentSettingsController = async (req, res, next) => {
  try {
    const deps = await getDepartmentSettings();
    return sendSuccess(res, { message: 'Department directory retrieved', data: deps });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/settings/greetings */
export const getGreetingSettingsController = async (req, res, next) => {
  try {
    const greetings = await getGreetingSettings();
    return sendSuccess(res, { message: 'Festival greeting calendar retrieved', data: greetings });
  } catch (err) {
    next(err);
  }
};

/** POST /api/v1/settings/greetings */
export const addGreetingSettingController = async (req, res, next) => {
  try {
    const newGreeting = await addGreetingSetting(req.body);
    return sendSuccess(res, { statusCode: 201, message: 'Festival greeting added', data: newGreeting });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/settings/categories */
export const getCategorySettingsController = async (req, res, next) => {
  try {
    const cats = await getCategorySettings();
    return sendSuccess(res, { message: 'Nivedan categories retrieved', data: cats });
  } catch (err) {
    next(err);
  }
};
