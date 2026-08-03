'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wards', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      ward_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      name_en: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      name_mr: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      city_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('wards');
  },
};
