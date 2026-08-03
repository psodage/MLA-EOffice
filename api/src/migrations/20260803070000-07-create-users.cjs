'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      full_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('MLA', 'PA', 'RECEPTIONIST', 'AUDITOR', 'BOOTH_PRAMUKH', 'CITIZEN', 'ADMIN'),
        allowNull: false,
      },
      mobile: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      profile_photo_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      accessible_modules: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      last_login_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      last_login_ip: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      refresh_token: {
        type: Sequelize.STRING(500),
        allowNull: true,
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

    await queryInterface.addIndex('users', ['role'], { name: 'idx_user_role' });
    await queryInterface.addIndex('users', ['is_active'], { name: 'idx_user_active' });
    await queryInterface.addIndex('users', ['full_name'], { name: 'idx_user_fulltext', type: 'FULLTEXT' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
