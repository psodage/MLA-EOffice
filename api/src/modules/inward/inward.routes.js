// src/modules/inward/inward.routes.js
// ============================================================
// Inward Register API routes
// GET  /inward — list entries with filters
// POST /inward — create new entry
// GET  /inward/:id — single entry details
// PATCH /inward/:id — update status/assign
// ============================================================

import { Router } from 'express';
import {
  getInwardList,
  createInward,
  getInwardById,
  updateInward,
} from './inward.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Protected by JWT auth
router.get('/', authMiddleware, getInwardList);
router.post('/', authMiddleware, createInward);
router.get('/:id', authMiddleware, getInwardById);
router.patch('/:id', authMiddleware, updateInward);

export default router;
