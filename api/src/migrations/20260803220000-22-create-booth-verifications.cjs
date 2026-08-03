'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booth_verifications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      booth_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'booths', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      verified_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      verification_status: {
        type: Sequelize.ENUM('NOT_VERIFIED', 'PARTIALLY_VERIFIED', 'FULLY_VERIFIED'),
        allowNull: false,
      },
      checklist_results: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      comments: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      photo_urls: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      verified_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });

    await queryInterface.addIndex('booth_verifications', ['booth_id'], { name: 'idx_verification_booth' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('booth_verifications');
  },
};
