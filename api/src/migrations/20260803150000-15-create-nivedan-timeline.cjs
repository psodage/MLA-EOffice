'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nivedan_timeline', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nivedan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'nivedans', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      action_type: {
        type: Sequelize.ENUM('CREATED', 'STATUS_CHANGE', 'ASSIGNED', 'FORWARDED', 'NOTE_ADDED', 'WHATSAPP_SENT', 'ESCALATED', 'RESOLVED', 'REJECTED', 'CANCELLED', 'ARCHIVED'),
        allowNull: false,
      },
      old_status: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      new_status: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      assigned_to_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'departments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_internal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      performed_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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

    await queryInterface.addIndex('nivedan_timeline', ['nivedan_id'], { name: 'idx_timeline_nivedan' });
    await queryInterface.addIndex('nivedan_timeline', ['created_at'], { name: 'idx_timeline_created' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('nivedan_timeline');
  },
};
