'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booths', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      booth_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      booth_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      location_address: {
        type: Sequelize.STRING(500),
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
      gram_panchayat_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'gram_panchayats', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      total_voters: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      // booth_pramukh_id FK added in migration 10 (circular dependency)
      booth_pramukh_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      verification_status: {
        type: Sequelize.ENUM('NOT_VERIFIED', 'PARTIALLY_VERIFIED', 'FULLY_VERIFIED'),
        allowNull: false,
        defaultValue: 'NOT_VERIFIED',
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });

    await queryInterface.addIndex('booths', ['booth_number'], { name: 'idx_booth_number' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('booths');
  },
};
