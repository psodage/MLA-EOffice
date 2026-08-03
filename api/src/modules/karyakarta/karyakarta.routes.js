// src/modules/karyakarta/karyakarta.routes.js
// ============================================================
// Karyakarta Directory API routes
// GET   /karyakartas — list workers with filters
// GET   /karyakartas/birthdays — upcoming birthdays in next 7 days
// GET   /karyakartas/booth/:boothId — booth level view (Booth Pramukh top)
// POST  /karyakartas — create single worker
// POST  /karyakartas/import — bulk import validate & commit
// ============================================================

import { Router } from 'express';
import {
  getKaryakartasList,
  getUpcomingBirthdaysController,
  getBoothViewController,
  createKaryakartaController,
  bulkImportController,
} from './karyakarta.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Protected routes
router.get('/', authMiddleware, getKaryakartasList);
router.get('/birthdays', authMiddleware, getUpcomingBirthdaysController);
router.get('/booth/:boothId', authMiddleware, getBoothViewController);
router.post('/', authMiddleware, createKaryakartaController);
router.post('/import', authMiddleware, bulkImportController);

export default router;
