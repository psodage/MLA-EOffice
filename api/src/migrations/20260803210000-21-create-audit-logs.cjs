'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      action: {
        type: Sequelize.ENUM('CREATE', 'UPDATE', 'ARCHIVE', 'CANCEL', 'LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'EXPORT', 'DELEGATE'),
        allowNull: false,
      },
      module: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      old_values: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      new_values: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      is_delegated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex('audit_logs', ['user_id'], { name: 'idx_audit_user' });
    await queryInterface.addIndex('audit_logs', ['action'], { name: 'idx_audit_action' });
    await queryInterface.addIndex('audit_logs', ['module'], { name: 'idx_audit_module' });
    await queryInterface.addIndex('audit_logs', ['entity_type', 'entity_id'], { name: 'idx_audit_entity' });
    await queryInterface.addIndex('audit_logs', ['created_at'], { name: 'idx_audit_created' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('audit_logs');
  },
};
