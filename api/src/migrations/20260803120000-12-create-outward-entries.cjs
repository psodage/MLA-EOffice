'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('outward_entries', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      outward_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      date_sent: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal('(CURDATE())'),
      },
      recipient_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      recipient_designation: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      recipient_department_id: {
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
      body_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      letter_pdf_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      reference_inward_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'inward_entries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      is_ai_drafted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      attachment_urls: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      approved_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    await queryInterface.addIndex('outward_entries', ['date_sent'], { name: 'idx_outward_date' });
    await queryInterface.addIndex('outward_entries', ['reference_inward_id'], { name: 'idx_outward_ref_inward' });
    await queryInterface.addIndex('outward_entries', ['recipient_name', 'subject'], { name: 'idx_outward_search', type: 'FULLTEXT' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('outward_entries');
  },
};
