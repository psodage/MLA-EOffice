// src/modules/user/user.routes.js
// ============================================================
// User Management & Settings API routes
// GET   /users — list all users (Admin)
// POST  /users — create new user (Admin)
// PATCH /users/:id/active — toggle user active status
// PATCH /users/:id/password — reset user password
// PATCH /users/:id/modules — update accessible modules
// GET   /settings/departments — department directory
// GET   /settings/greetings — festival calendar
// GET   /settings/categories — Nivedan categories
// ============================================================

import { Router } from 'express';
import {
  getUsersListController,
  createUserController,
  toggleUserActiveController,
  resetUserPasswordController,
  updateAccessibleModulesController,
  getDepartmentSettingsController,
  getGreetingSettingsController,
  addGreetingSettingController,
  getCategorySettingsController,
} from './user.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Protected User Management routes (Admin access)
router.get('/users', authMiddleware, getUsersListController);
router.post('/users', authMiddleware, createUserController);
router.patch('/users/:id/active', authMiddleware, toggleUserActiveController);
router.patch('/users/:id/password', authMiddleware, resetUserPasswordController);
router.patch('/users/:id/modules', authMiddleware, updateAccessibleModulesController);

// Protected Office Settings routes (PA / Admin access)
router.get('/settings/departments', authMiddleware, getDepartmentSettingsController);
router.get('/settings/greetings', authMiddleware, getGreetingSettingsController);
router.post('/settings/greetings', authMiddleware, addGreetingSettingController);
router.get('/settings/categories', authMiddleware, getCategorySettingsController);

export default router;
