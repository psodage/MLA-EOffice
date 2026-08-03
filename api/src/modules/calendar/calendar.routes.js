// src/modules/calendar/calendar.routes.js
// ============================================================
// Calendar & Schedule API routes
// GET   /calendar — list events (month filter)
// GET   /calendar/today — today's events list
// GET   /calendar/upcoming — upcoming 7-day events
// POST  /calendar — create event
// GET   /calendar/:id — single event detail
// PATCH /calendar/:id — update or cancel event
// ============================================================

import { Router } from 'express';
import {
  getEventsListController,
  getTodayEventsController,
  getUpcomingEventsController,
  createEventController,
  getEventByIdController,
  updateEventController,
} from './calendar.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Protected routes
router.get('/', authMiddleware, getEventsListController);
router.get('/today', authMiddleware, getTodayEventsController);
router.get('/upcoming', authMiddleware, getUpcomingEventsController);
router.post('/', authMiddleware, createEventController);
router.get('/:id', authMiddleware, getEventByIdController);
router.patch('/:id', authMiddleware, updateEventController);

export default router;
