'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add auth-specific columns to users table (from AUTH_SPEC.md §8)
    await queryInterface.addColumn('users', 'password_changed_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
      comment: 'NULL means first login — forced password change required',
    });

    await queryInterface.addColumn('users', 'password_history', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null,
      comment: 'Array of last 3 bcrypt hashes for reuse prevention',
    });

    await queryInterface.addColumn('users', 'token_version', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Incremented on password change; invalidates all refresh tokens',
    });

    await queryInterface.addColumn('users', 'failed_login_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Reset to 0 on successful login',
    });

    await queryInterface.addColumn('users', 'last_failed_login_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
      comment: 'Tracks lockout window start',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'last_failed_login_at');
    await queryInterface.removeColumn('users', 'failed_login_count');
    await queryInterface.removeColumn('users', 'token_version');
    await queryInterface.removeColumn('users', 'password_history');
    await queryInterface.removeColumn('users', 'password_changed_at');
  },
};
