// src/modules/dashboard/dashboard.routes.js
// ============================================================
// Dashboard API routes
// GET /summary — returns role-specific summary stats
// ============================================================

import { Router } from 'express';
import { getSummary } from './dashboard.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// GET /api/v1/dashboard/summary (Protected by JWT)
router.get('/summary', authMiddleware, getSummary);

export default router;
