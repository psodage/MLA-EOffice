// src/models/WhatsAppLog.js
// ============================================================
// Sequelize model for `whatsapp_logs` table
// Log of every WhatsApp message sent/received by the system
// ============================================================

import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class WhatsAppLog extends Model {}

WhatsAppLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    recipient_mobile: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    direction: {
      type: DataTypes.ENUM('OUTBOUND', 'INBOUND'),
      allowNull: false,
      defaultValue: 'OUTBOUND',
    },
    message_type: {
      type: DataTypes.ENUM(
        'NIVEDAN_ACK',
        'NIVEDAN_UPDATE',
        'NIVEDAN_RESOLVED',
        'BIRTHDAY',
        'FESTIVAL',
        'EVENT_INVITE',
        'BROADCAST',
        'BOT_REPLY',
        'INBOUND_QUERY'
      ),
      allowNull: false,
    },
    template_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    template_params: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    message_body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    delivery_status: {
      type: DataTypes.ENUM('QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED'),
      allowNull: false,
      defaultValue: 'QUEUED',
    },
    meta_message_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    retry_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sms_fallback_sent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    linked_entity_type: {
      type: DataTypes.ENUM('NIVEDAN', 'KARYAKARTA', 'EVENT', 'BROADCAST'),
      allowNull: true,
    },
    linked_entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    error_message: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'whatsapp_logs',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

export default WhatsAppLog;
