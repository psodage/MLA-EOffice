'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inward_entries', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      inward_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      date_received: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal('(CURDATE())'),
      },
      sender_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      sender_designation: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      sender_department_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'departments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      subject: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      priority: {
        type: Sequelize.ENUM('HIGH', 'MEDIUM', 'LOW'),
        allowNull: false,
        defaultValue: 'MEDIUM',
      },
      attachment_urls: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      assigned_to_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    await queryInterface.addIndex('inward_entries', ['date_received'], { name: 'idx_inward_date' });
    await queryInterface.addIndex('inward_entries', ['status'], { name: 'idx_inward_status' });
    await queryInterface.addIndex('inward_entries', ['assigned_to_user_id'], { name: 'idx_inward_assigned' });
    await queryInterface.addIndex('inward_entries', ['created_by'], { name: 'idx_inward_created_by' });
    await queryInterface.addIndex('inward_entries', ['priority'], { name: 'idx_inward_priority' });
    await queryInterface.addIndex('inward_entries', ['sender_name', 'subject'], { name: 'idx_inward_search', type: 'FULLTEXT' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inward_entries');
  },
};
