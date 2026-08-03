// src/services/whatsapp.service.js
// ============================================================
// Meta Cloud API (WhatsApp Business API) Service
// Message dispatch, webhook status listener & message logger
// ============================================================

import config from '../config/env.config.js';
import WhatsAppLog from '../models/WhatsAppLog.js';
import sequelize from '../config/database.js';

const { Op } = sequelize.Sequelize;

/** Sample in-memory logs fallback */
const SAMPLE_WA_LOGS = [
  {
    id: 1,
    recipient_mobile: '9822011223',
    direction: 'OUTBOUND',
    message_type: 'NIVEDAN_ACK',
    template_name: 'nivedan_ack',
    message_body: 'नमस्कार सुरेश जाधव, आपली तक्रार (NIV-2026-00001) यशस्वीरित्या नोंदवली गेली आहे.',
    delivery_status: 'DELIVERED',
    meta_message_id: 'wamid.HBgMOTE5ODIyMDExMjIzFQIAERgSQjE2ODg4QUFBN0NDMjg1OUVBAA==',
    retry_count: 0,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    delivered_at: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: 2,
    recipient_mobile: '9876543210',
    direction: 'OUTBOUND',
    message_type: 'BIRTHDAY',
    template_name: 'birthday_wish',
    message_body: 'सस्नेह नमस्कार प्रशांत देशमुखजी, आमदारांच्या वतीने आपणास वाढदिवसाच्या हार्दिक शुभेच्छा! 💐',
    delivery_status: 'READ',
    meta_message_id: 'wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgSQjE3OTk5QkJCNDREMjg1OUVBAA==',
    retry_count: 0,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    read_at: new Date(Date.now() - 7000000).toISOString(),
  },
  {
    id: 3,
    recipient_mobile: '9422098765',
    direction: 'OUTBOUND',
    message_type: 'NIVEDAN_UPDATE',
    template_name: 'nivedan_update',
    message_body: 'तक्रार निवारण अपडेट: आपली तक्रार (NIV-2026-00002) ग्रामविकास विभागाकडे वर्ग करण्यात आली आहे.',
    delivery_status: 'SENT',
    meta_message_id: 'wamid.HBgMOTE5NDIyMDk4NzY1FQIAERgSQjE4OTk5Q0NDNEREMjg1OUVBAA==',
    retry_count: 0,
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
];

/** Send WhatsApp Template Message via Meta Cloud API */
export const sendWhatsAppMessage = async (payload) => {
  const {
    recipient_mobile,
    template_name = 'nivedan_ack',
    template_params = [],
    message_type = 'NIVEDAN_ACK',
    linked_entity_type = 'NIVEDAN',
    linked_entity_id = null,
    custom_text = null,
  } = payload;

  const cleanMobile = recipient_mobile.replace(/\D/g, '');
  const formattedMobile = cleanMobile.length === 10 ? `91${cleanMobile}` : cleanMobile;

  // Prepare Meta API Payload
  const metaPayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formattedMobile,
    type: 'template',
    template: {
      name: template_name,
      language: { code: 'mr' }, // Marathi
      components: [
        {
          type: 'body',
          parameters: template_params.map((val) => ({ type: 'text', text: String(val) })),
        },
      ],
    },
  };

  const messageBodyText = custom_text || `WhatsApp Template: ${template_name} (${template_params.join(', ')})`;

  // Try calling Meta Cloud API if configured
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  let metaMessageId = `wamid.LOCAL_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  let status = 'SENT';
  let errorMsg = null;

  if (token && phoneId && token !== 'mock-token') {
    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metaPayload),
      });

      const resData = await res.json();
      if (res.ok && resData.messages?.[0]?.id) {
        metaMessageId = resData.messages[0].id;
        status = 'SENT';
      } else {
        status = 'FAILED';
        errorMsg = resData.error?.message || 'Meta API error';
      }
    } catch (err) {
      status = 'FAILED';
      errorMsg = err.message;
    }
  }

  // Create Log in Database
  try {
    const logEntry = await WhatsAppLog.create({
      recipient_mobile: cleanMobile,
      direction: 'OUTBOUND',
      message_type,
      template_name,
      template_params: template_params,
      message_body: messageBodyText,
      delivery_status: status,
      meta_message_id: metaMessageId,
      retry_count: status === 'FAILED' ? 1 : 0,
      linked_entity_type,
      linked_entity_id,
      error_message: errorMsg,
      sent_at: status !== 'FAILED' ? new Date() : null,
    });

    return logEntry;
  } catch (err) {
    console.warn('DB WhatsAppLog fallback:', err.message);
    const mockLog = {
      id: Date.now(),
      recipient_mobile: cleanMobile,
      direction: 'OUTBOUND',
      message_type,
      template_name,
      message_body: messageBodyText,
      delivery_status: status,
      meta_message_id: metaMessageId,
      retry_count: 0,
      created_at: new Date().toISOString(),
    };
    SAMPLE_WA_LOGS.unshift(mockLog);
    return mockLog;
  }
};

/** List WhatsApp Message Logs with status & type filters */
export const listWhatsAppLogs = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const where = {};

  if (query.delivery_status && query.delivery_status !== 'ALL') {
    where.delivery_status = query.delivery_status;
  }
  if (query.message_type && query.message_type !== 'ALL') {
    where.message_type = query.message_type;
  }
  if (query.search) {
    const term = `%${query.search.trim()}%`;
    where[Op.or] = [
      { recipient_mobile: { [Op.like]: term } },
      { message_body: { [Op.like]: term } },
    ];
  }

  try {
    const { count, rows } = await WhatsAppLog.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    if (count > 0 || Object.keys(query).length > 0) {
      const deliveredCount = rows.filter((r) => r.delivery_status === 'DELIVERED').length;
      const readCount = rows.filter((r) => r.delivery_status === 'READ').length;
      const failedCount = rows.filter((r) => r.delivery_status === 'FAILED').length;

      return {
        items: rows,
        summary: {
          totalSent: count,
          deliveredCount,
          readCount,
          failedCount,
        },
        meta: {
          page,
          limit,
          totalItems: count,
          totalPages: Math.ceil(count / limit) || 1,
        },
      };
    }
  } catch (err) {
    console.warn('DB listWhatsAppLogs fallback:', err.message);
  }

  // Memory fallback filtering
  let filtered = [...SAMPLE_WA_LOGS];
  if (query.delivery_status && query.delivery_status !== 'ALL') {
    filtered = filtered.filter((l) => l.delivery_status === query.delivery_status);
  }
  if (query.message_type && query.message_type !== 'ALL') {
    filtered = filtered.filter((l) => l.message_type === query.message_type);
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    filtered = filtered.filter((l) => l.recipient_mobile.includes(q) || l.message_body.toLowerCase().includes(q));
  }

  const totalItems = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    items: paginated,
    summary: {
      totalSent: totalItems,
      deliveredCount: filtered.filter((l) => l.delivery_status === 'DELIVERED').length,
      readCount: filtered.filter((l) => l.delivery_status === 'READ').length,
      failedCount: filtered.filter((l) => l.delivery_status === 'FAILED').length,
    },
    meta: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit) || 1,
    },
  };
};

/** Webhook status update handler */
export const processWebhookStatusUpdate = async (body) => {
  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;

  if (value?.statuses && value.statuses.length > 0) {
    const statusObj = value.statuses[0];
    const metaMsgId = statusObj.id;
    const statusStr = statusObj.status?.toUpperCase(); // DELIVERED, READ, FAILED

    try {
      const log = await WhatsAppLog.findOne({ where: { meta_message_id: metaMsgId } });
      if (log) {
        const updates = { delivery_status: statusStr };
        if (statusStr === 'DELIVERED') updates.delivered_at = new Date();
        if (statusStr === 'READ') updates.read_at = new Date();
        if (statusStr === 'FAILED') {
          updates.error_message = statusObj.errors?.[0]?.title || 'Delivery failed';
          updates.retry_count = log.retry_count + 1;
        }

        await log.update(updates);
      }
    } catch (err) {
      console.warn('DB webhook update error:', err.message);
    }
  }

  return { status: 'processed' };
};
