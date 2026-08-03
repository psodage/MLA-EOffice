// src/modules/reports/reports.routes.js
// ============================================================
// Reports & Analytics API routes
// GET /reports/nivedans — Nivedans summary by status & category
// GET /reports/devworks — Budget utilization by funding source
// GET /reports/visitors — Visitor stats by purpose & period
// GET /reports/inward-pendency — Inward entries aging report
// GET /reports/booth-coverage — Polling booth coverage stats
// ============================================================

import { Router } from 'express';
import {
  getNivedanReportController,
  getDevWorksReportController,
  getVisitorsReportController,
  getInwardPendencyReportController,
  getBoothCoverageReportController,
} from './reports.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Protected routes
router.get('/nivedans', authMiddleware, getNivedanReportController);
router.get('/devworks', authMiddleware, getDevWorksReportController);
router.get('/visitors', authMiddleware, getVisitorsReportController);
router.get('/inward-pendency', authMiddleware, getInwardPendencyReportController);
router.get('/booth-coverage', authMiddleware, getBoothCoverageReportController);

export default router;
