'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dev_work_photos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      development_work_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'development_works', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      photo_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      thumbnail_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      photo_stage: {
        type: Sequelize.ENUM('BEFORE', 'DURING', 'AFTER'),
        allowNull: false,
        defaultValue: 'DURING',
      },
      geo_latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
      },
      geo_longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
      },
      caption: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      uploaded_by: {
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

    await queryInterface.addIndex('dev_work_photos', ['development_work_id'], { name: 'idx_photo_devwork' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('dev_work_photos');
  },
};
