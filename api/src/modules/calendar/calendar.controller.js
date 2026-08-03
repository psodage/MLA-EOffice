// src/modules/calendar/calendar.controller.js
// ============================================================
// Calendar & Schedule Controller — Handles API requests
// ============================================================

import {
  listEvents,
  getTodayEvents,
  getUpcomingEvents,
  createEvent,
  getEventById,
  updateEvent,
} from './calendar.service.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';

/** GET /api/v1/calendar */
export const getEventsListController = async (req, res, next) => {
  try {
    const events = await listEvents(req.query);
    return sendSuccess(res, {
      message: 'Calendar events retrieved successfully',
      data: events,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/calendar/today */
export const getTodayEventsController = async (req, res, next) => {
  try {
    const events = await getTodayEvents();
    return sendSuccess(res, {
      message: "Today's calendar events retrieved successfully",
      data: events,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/calendar/upcoming */
export const getUpcomingEventsController = async (req, res, next) => {
  try {
    const events = await getUpcomingEvents();
    return sendSuccess(res, {
      message: 'Upcoming 7-day calendar events retrieved successfully',
      data: events,
    });
  } catch (err) {
    next(err);
  }
};

/** POST /api/v1/calendar */
export const createEventController = async (req, res, next) => {
  try {
    const { title, event_date } = req.body;

    if (!title || !title.trim()) {
      return sendError(res, { statusCode: 400, message: 'Event title is required (कार्यक्रमाचे शीर्षक आवश्यक आहे)' });
    }
    if (!event_date) {
      return sendError(res, { statusCode: 400, message: 'Event date is required (तारीख आवश्यक आहे)' });
    }

    const userId = req.user?.userId || 1;
    const newEvent = await createEvent(req.body, userId);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Calendar event created successfully',
      data: newEvent,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/calendar/:id */
export const getEventByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);
    return sendSuccess(res, {
      message: 'Calendar event details retrieved successfully',
      data: event,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};

/** PATCH /api/v1/calendar/:id */
export const updateEventController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 1;

    const updated = await updateEvent(id, req.body, userId);
    return sendSuccess(res, {
      message: 'Calendar event updated successfully',
      data: updated,
    });
  } catch (err) {
    if (err.statusCode) {
      return sendError(res, { statusCode: err.statusCode, message: err.message });
    }
    next(err);
  }
};
