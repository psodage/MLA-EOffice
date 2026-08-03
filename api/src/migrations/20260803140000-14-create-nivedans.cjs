'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nivedans', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tracking_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      citizen_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      citizen_mobile: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      citizen_address_line: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      citizen_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      citizen_pincode: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      citizen_state: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'Maharashtra',
      },
      citizen_dob: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      village_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'villages', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      ward_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'wards', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      taluka_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'talukas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      sub_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      subject: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      attachment_urls: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'IN_PROGRESS', 'FORWARDED', 'AWAITING_RESPONSE', 'RESOLVED', 'REJECTED', 'CANCELLED', 'ARCHIVED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      priority: {
        type: Sequelize.ENUM('HIGH', 'MEDIUM', 'LOW'),
        allowNull: false,
        defaultValue: 'MEDIUM',
      },
      assigned_to_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      department_forwarded_to_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'departments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      resolution_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      escalation_level: {
        type: Sequelize.ENUM('NONE', 'LEVEL_1', 'LEVEL_2'),
        allowNull: false,
        defaultValue: 'NONE',
      },
      escalated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      whatsapp_notified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      linked_visitor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'visitors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      resolved_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.addIndex('nivedans', ['citizen_mobile'], { name: 'idx_nivedan_mobile' });
    await queryInterface.addIndex('nivedans', ['status'], { name: 'idx_nivedan_status' });
    await queryInterface.addIndex('nivedans', ['category_id'], { name: 'idx_nivedan_category' });
    await queryInterface.addIndex('nivedans', ['assigned_to_user_id'], { name: 'idx_nivedan_assigned' });
    await queryInterface.addIndex('nivedans', ['priority'], { name: 'idx_nivedan_priority' });
    await queryInterface.addIndex('nivedans', ['escalation_level'], { name: 'idx_nivedan_escalation' });
    await queryInterface.addIndex('nivedans', ['created_at'], { name: 'idx_nivedan_created_at' });
    await queryInterface.addIndex('nivedans', ['village_id'], { name: 'idx_nivedan_village' });
    await queryInterface.addIndex('nivedans', ['ward_id'], { name: 'idx_nivedan_ward' });
    await queryInterface.addIndex('nivedans', ['created_by'], { name: 'idx_nivedan_created_by' });
    await queryInterface.addIndex('nivedans', ['citizen_name', 'subject'], { name: 'idx_nivedan_search', type: 'FULLTEXT' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('nivedans');
  },
};
