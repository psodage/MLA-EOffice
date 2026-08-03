'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('karyakartas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      full_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      mobile: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
      },
      alt_mobile: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      address_line: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      pincode: {
        type: Sequelize.STRING(10),
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
      taluka_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'talukas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      booth_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'booths', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      designation: {
        type: Sequelize.ENUM('BOOTH_PRAMUKH', 'WARD_HEAD', 'SHAKTI_KENDRA', 'KARYAKARTA', 'VOLUNTEER', 'OTHER'),
        allowNull: false,
        defaultValue: 'KARYAKARTA',
      },
      profile_photo_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      joined_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      notes: {
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

    await queryInterface.addIndex('karyakartas', ['booth_id'], { name: 'idx_karyakarta_booth' });
    await queryInterface.addIndex('karyakartas', ['designation'], { name: 'idx_karyakarta_designation' });
    await queryInterface.addIndex('karyakartas', ['village_id'], { name: 'idx_karyakarta_village' });
    await queryInterface.addIndex('karyakartas', ['ward_id'], { name: 'idx_karyakarta_ward' });
    await queryInterface.addIndex('karyakartas', ['is_active'], { name: 'idx_karyakarta_active' });
    await queryInterface.addIndex('karyakartas', ['full_name'], { name: 'idx_karyakarta_search', type: 'FULLTEXT' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('karyakartas');
  },
};
