// src/modules/outward/outward.routes.js
// ============================================================
// Outward Register API routes
// GET   /outward — list entries
// POST  /outward — create entry
// POST  /outward/ai-draft — generate AI draft
// GET   /outward/:id — single entry
// PATCH /outward/:id/approve — mark as approved
// ============================================================

import { Router } from 'express';
import {
  getOutwardList,
  createOutward,
  generateAiDraft,
  getOutwardById,
  approveOutward,
} from './outward.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Protected routes
router.get('/', authMiddleware, getOutwardList);
router.post('/', authMiddleware, createOutward);
router.post('/ai-draft', authMiddleware, generateAiDraft);
router.get('/:id', authMiddleware, getOutwardById);
router.patch('/:id/approve', authMiddleware, approveOutward);

export default router;
