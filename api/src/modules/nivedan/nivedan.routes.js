// src/modules/nivedan/nivedan.routes.js
// ============================================================
// Nivedan API routes
// Includes protected management routes & public tracking route
// ============================================================

import { Router } from 'express';
import {
  getCategoriesController,
  getNivedanList,
  createNivedanController,
  getNivedanByIdController,
  updateNivedanStatusController,
  addTimelineNoteController,
  trackNivedanByMobileController,
} from './nivedan.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Public Citizen Tracking Route (No Auth required)
router.get('/track/:mobile', trackNivedanByMobileController);

// Protected Staff & MLA Routes
router.get('/categories', authMiddleware, getCategoriesController);
router.get('/', authMiddleware, getNivedanList);
router.post('/', authMiddleware, createNivedanController);
router.get('/:id', authMiddleware, getNivedanByIdController);
router.patch('/:id/status', authMiddleware, updateNivedanStatusController);
router.post('/:id/timeline', authMiddleware, addTimelineNoteController);

export default router;
