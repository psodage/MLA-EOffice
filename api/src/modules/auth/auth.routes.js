// src/modules/auth/auth.routes.js
// ============================================================
// Auth API routes
// POST /login — authenticate user
// POST /refresh — silent token refresh
// POST /logout — clear session
// GET  /me — current user profile
// ============================================================

import { Router } from 'express';
import { login, refresh, logout, me } from './auth.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Public routes (no JWT required)
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes (JWT required)
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, me);

export default router;
