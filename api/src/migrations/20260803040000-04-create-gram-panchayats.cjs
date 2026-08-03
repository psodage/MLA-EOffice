'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gram_panchayats', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name_en: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      name_mr: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      taluka_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'talukas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });

    await queryInterface.addIndex('gram_panchayats', ['taluka_id'], { name: 'idx_gp_taluka' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('gram_panchayats');
  },
};
