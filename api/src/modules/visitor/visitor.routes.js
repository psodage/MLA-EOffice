// src/modules/visitor/visitor.routes.js
// ============================================================
// Visitor Book API routes
// GET   /visitors — list with date filter & summary
// GET   /visitors/lookup/:mobile — mobile lookup for repeat visitors
// POST  /visitors/checkin — record visitor check-in
// PATCH /visitors/:id/checkout — record departure time
// POST  /visitors/:id/convert-nivedan — convert to Nivedan
// ============================================================

import { Router } from 'express';
import {
  lookupMobileController,
  checkInController,
  checkOutController,
  listVisitorsController,
  convertToNivedanController,
} from './visitor.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Protected routes
router.get('/', authMiddleware, listVisitorsController);
router.get('/lookup/:mobile', authMiddleware, lookupMobileController);
router.post('/checkin', authMiddleware, checkInController);
router.patch('/:id/checkout', authMiddleware, checkOutController);
router.post('/:id/convert-nivedan', authMiddleware, convertToNivedanController);

export default router;
