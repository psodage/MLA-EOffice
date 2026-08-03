'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('NIVEDAN', 'INWARD', 'DEVWORK', 'CALENDAR', 'WHATSAPP', 'ESCALATION', 'SYSTEM'),
        allowNull: false,
      },
      severity: {
        type: Sequelize.ENUM('INFO', 'WARNING', 'CRITICAL'),
        allowNull: false,
        defaultValue: 'INFO',
      },
      linked_entity_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      linked_entity_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex('notifications', ['user_id'], { name: 'idx_notif_user' });
    await queryInterface.addIndex('notifications', ['user_id', 'is_read'], { name: 'idx_notif_read' });
    await queryInterface.addIndex('notifications', ['created_at'], { name: 'idx_notif_created' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notifications');
  },
};
