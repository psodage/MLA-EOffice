// src/modules/whatsapp/whatsapp.routes.js
// ============================================================
// WhatsApp API routes
// GET  /whatsapp/webhook — Meta Hub verification challenge
// POST /whatsapp/webhook — Meta live status updates
// GET  /whatsapp/logs — list message delivery logs
// POST /whatsapp/send — manual message dispatcher
// ============================================================

import { Router } from 'express';
import {
  verifyWebhookController,
  receiveWebhookController,
  getWhatsAppLogsController,
  sendTestMessageController,
} from './whatsapp.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Public Webhook endpoints (called directly by Meta servers)
router.get('/webhook', verifyWebhookController);
router.post('/webhook', receiveWebhookController);

// Protected routes (require auth token)
router.get('/logs', authMiddleware, getWhatsAppLogsController);
router.post('/send', authMiddleware, sendTestMessageController);

export default router;
