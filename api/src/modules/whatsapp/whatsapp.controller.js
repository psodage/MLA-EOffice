// src/modules/whatsapp/whatsapp.controller.js
// ============================================================
// WhatsApp Controller — Handles API requests & Meta Webhook verification
// ============================================================

import {
  sendWhatsAppMessage,
  listWhatsAppLogs,
  processWebhookStatusUpdate,
} from '../../services/whatsapp.service.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';
import config from '../../config/env.config.js';

/** GET /api/v1/whatsapp/webhook — Meta Hub Verification Challenge */
export const verifyWebhookController = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'mla_eoffice_secret_token';

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WhatsApp Webhook Verified Successfully!');
    return res.status(200).send(challenge);
  }

  return res.status(403).json({ success: false, message: 'Webhook verification failed' });
};

/** POST /api/v1/whatsapp/webhook — Meta Webhook Delivery Event Listener */
export const receiveWebhookController = async (req, res, next) => {
  try {
    await processWebhookStatusUpdate(req.body);
    return res.status(200).json({ status: 'EVENT_RECEIVED' });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(200).json({ status: 'EVENT_RECEIVED' });
  }
};

/** GET /api/v1/whatsapp/logs — List message logs */
export const getWhatsAppLogsController = async (req, res, next) => {
  try {
    const result = await listWhatsAppLogs(req.query);
    return sendSuccess(res, {
      message: 'WhatsApp message logs retrieved successfully',
      data: result.items,
      summary: result.summary,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

/** POST /api/v1/whatsapp/send — Manual / Test message sender */
export const sendTestMessageController = async (req, res, next) => {
  try {
    const { recipient_mobile, template_name, template_params, custom_text } = req.body;

    if (!recipient_mobile || recipient_mobile.trim().length < 10) {
      return sendError(res, { statusCode: 400, message: 'Valid 10-digit mobile number required' });
    }

    const logEntry = await sendWhatsAppMessage({
      recipient_mobile: recipient_mobile.trim(),
      template_name: template_name || 'nivedan_ack',
      template_params: template_params || ['नागरिक', 'NIV-2026-00001', new Date().toLocaleDateString('mr-IN'), 'आमदार'],
      custom_text,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'WhatsApp message dispatched successfully',
      data: logEntry,
    });
  } catch (err) {
    next(err);
  }
};
