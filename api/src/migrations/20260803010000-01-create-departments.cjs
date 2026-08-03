'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('departments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name_en: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      name_mr: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      short_code: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      officer_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      officer_designation: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      office_address: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('departments');
  },
};
