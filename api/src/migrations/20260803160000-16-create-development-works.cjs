'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('development_works', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      project_name: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM('ROAD', 'DRAINAGE', 'WATER_PIPELINE', 'HOSPITAL', 'SCHOOL', 'COMMUNITY_HALL', 'STREET_LIGHT', 'BRIDGE', 'ELECTRIFICATION', 'GARDEN_PARK', 'TOILET', 'CREMATORIUM', 'OTHER'),
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING(500),
        allowNull: false,
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
      geo_latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
      },
      geo_longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
      },
      funding_source: {
        type: Sequelize.ENUM('MLALAD', 'ZP_FUND', 'STATE_GRANT', 'CENTRAL_GRANT', 'MUNICIPAL_FUND', 'GP_FUND', 'MPLAD', 'CSR', 'OTHER_MIXED'),
        allowNull: false,
      },
      budget_allocated: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      budget_spent: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      contractor_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      contractor_contact: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      expected_completion_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      actual_completion_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('SANCTIONED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'SANCTIONED',
      },
      progress_percentage: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      description: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('development_works', ['status'], { name: 'idx_devwork_status' });
    await queryInterface.addIndex('development_works', ['category'], { name: 'idx_devwork_category' });
    await queryInterface.addIndex('development_works', ['village_id'], { name: 'idx_devwork_village' });
    await queryInterface.addIndex('development_works', ['ward_id'], { name: 'idx_devwork_ward' });
    await queryInterface.addIndex('development_works', ['funding_source'], { name: 'idx_devwork_funding' });
    await queryInterface.addIndex('development_works', ['project_name'], { name: 'idx_devwork_search', type: 'FULLTEXT' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('development_works');
  },
};
