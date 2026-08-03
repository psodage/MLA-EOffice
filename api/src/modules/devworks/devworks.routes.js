// src/modules/devworks/devworks.routes.js
// ============================================================
// Development Works API routes
// GET   /devworks — list projects with filters & financial stats
// POST  /devworks — create new project
// GET   /devworks/:id — single project view with photo gallery
// PATCH /devworks/:id — update progress percentage & budget spent
// POST  /devworks/:id/photos — upload geotagged photos (Before/During/After)
// ============================================================

import { Router } from 'express';
import {
  getDevWorksList,
  createDevWorkController,
  getDevWorkByIdController,
  updateDevWorkController,
  addDevWorkPhotoController,
} from './devworks.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Protected routes
router.get('/', authMiddleware, getDevWorksList);
router.post('/', authMiddleware, createDevWorkController);
router.get('/:id', authMiddleware, getDevWorkByIdController);
router.patch('/:id', authMiddleware, updateDevWorkController);
router.post('/:id/photos', authMiddleware, addDevWorkPhotoController);

export default router;
