'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('villages', {
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
      gram_panchayat_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'gram_panchayats', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    });

    await queryInterface.addIndex('villages', ['gram_panchayat_id'], { name: 'idx_village_gp' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('villages');
  },
};
