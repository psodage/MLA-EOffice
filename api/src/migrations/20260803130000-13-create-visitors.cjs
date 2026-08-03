'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('visitors', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      visitor_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      mobile: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      address_line: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      pincode: {
        type: Sequelize.STRING(10),
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
      purpose: {
        type: Sequelize.ENUM('GRIEVANCE', 'COURTESY_CALL', 'PARTY_WORK', 'INVITATION', 'PERSONAL_MEETING', 'DOCUMENT_SUBMISSION', 'FOLLOWUP', 'RECOMMENDATION', 'GENERAL_INQUIRY', 'OTHER'),
        allowNull: false,
      },
      purpose_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      check_in_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      check_out_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_repeat_visitor: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      previous_visit_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      linked_nivedan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // FK added after nivedans table is created (migration 14)
        // We'll handle this with a self-contained approach: no FK here,
        // nivedan references visitor instead
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
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });

    await queryInterface.addIndex('visitors', ['mobile'], { name: 'idx_visitor_mobile' });
    await queryInterface.addIndex('visitors', ['created_at'], { name: 'idx_visitor_date' });
    await queryInterface.addIndex('visitors', ['purpose'], { name: 'idx_visitor_purpose' });
    await queryInterface.addIndex('visitors', ['visitor_name'], { name: 'idx_visitor_search', type: 'FULLTEXT' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('visitors');
  },
};
