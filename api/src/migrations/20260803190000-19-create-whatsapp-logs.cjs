'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('whatsapp_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      recipient_mobile: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      direction: {
        type: Sequelize.ENUM('OUTBOUND', 'INBOUND'),
        allowNull: false,
        defaultValue: 'OUTBOUND',
      },
      message_type: {
        type: Sequelize.ENUM('NIVEDAN_ACK', 'NIVEDAN_UPDATE', 'NIVEDAN_RESOLVED', 'BIRTHDAY', 'FESTIVAL', 'EVENT_INVITE', 'BROADCAST', 'BOT_REPLY', 'INBOUND_QUERY'),
        allowNull: false,
      },
      template_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      template_params: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      message_body: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      delivery_status: {
        type: Sequelize.ENUM('QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED'),
        allowNull: false,
        defaultValue: 'QUEUED',
      },
      meta_message_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      retry_count: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      sms_fallback_sent: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      linked_entity_type: {
        type: Sequelize.ENUM('NIVEDAN', 'KARYAKARTA', 'EVENT', 'BROADCAST'),
        allowNull: true,
      },
      linked_entity_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      error_message: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      delivered_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      read_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });

    await queryInterface.addIndex('whatsapp_logs', ['recipient_mobile'], { name: 'idx_wa_mobile' });
    await queryInterface.addIndex('whatsapp_logs', ['delivery_status'], { name: 'idx_wa_status' });
    await queryInterface.addIndex('whatsapp_logs', ['message_type'], { name: 'idx_wa_type' });
    await queryInterface.addIndex('whatsapp_logs', ['meta_message_id'], { name: 'idx_wa_meta_id' });
    await queryInterface.addIndex('whatsapp_logs', ['created_at'], { name: 'idx_wa_created' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('whatsapp_logs');
  },
};
