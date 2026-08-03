'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('calendar_events', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      event_type: {
        type: Sequelize.ENUM('MEETING', 'PUBLIC_PROGRAM', 'GOVT_DEADLINE', 'ASSEMBLY_SESSION', 'CONSTITUENCY_VISIT', 'PERSONAL'),
        allowNull: false,
      },
      event_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      attendees: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      is_recurring: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      recurrence_rule: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      reminder_minutes: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 30,
      },
      is_cancelled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_by: {
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
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });

    await queryInterface.addIndex('calendar_events', ['event_type'], { name: 'idx_event_type' });
    await queryInterface.addIndex('calendar_events', ['event_date'], { name: 'idx_event_date' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('calendar_events');
  },
};
