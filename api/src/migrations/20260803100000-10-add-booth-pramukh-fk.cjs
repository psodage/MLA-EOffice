'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add FK constraint for booth_pramukh_id → karyakartas.id
    // This resolves the circular dependency: booths → karyakartas → booths
    await queryInterface.addConstraint('booths', {
      fields: ['booth_pramukh_id'],
      type: 'foreign key',
      name: 'fk_booth_pramukh',
      references: {
        table: 'karyakartas',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('booths', 'fk_booth_pramukh');
  },
};
