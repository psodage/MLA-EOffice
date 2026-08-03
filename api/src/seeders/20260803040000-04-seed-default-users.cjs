'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const hash = bcrypt.hashSync('Pa@12345', 12);

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        full_name: 'Honorable MLA',
        username: 'mla',
        password_hash: hash,
        role: 'MLA',
        mobile: '9876543210',
        email: 'mla@eoffice.gov.in',
        accessible_modules: JSON.stringify(['dashboard', 'inward', 'outward', 'nivedan', 'visitor', 'devworks', 'karyakarta', 'booth', 'geography', 'calendar', 'whatsapp', 'reports', 'notifications', 'audit']),
        is_active: true,
        token_version: 1,
        failed_login_count: 0,
        password_changed_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        full_name: 'Suresh Patil (PA)',
        username: 'pa',
        password_hash: hash,
        role: 'PA',
        mobile: '9876543211',
        email: 'pa@eoffice.gov.in',
        accessible_modules: JSON.stringify(['dashboard', 'inward', 'outward', 'nivedan', 'visitor', 'devworks', 'karyakarta', 'booth', 'geography', 'calendar', 'whatsapp', 'reports', 'notifications']),
        is_active: true,
        token_version: 1,
        failed_login_count: 0,
        password_changed_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        full_name: 'Priya Deshmukh (Receptionist)',
        username: 'receptionist',
        password_hash: hash,
        role: 'RECEPTIONIST',
        mobile: '9876543212',
        email: 'receptionist@eoffice.gov.in',
        accessible_modules: JSON.stringify(['inward', 'nivedan', 'visitor', 'calendar', 'notifications']),
        is_active: true,
        token_version: 1,
        failed_login_count: 0,
        password_changed_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        full_name: 'Rahul Jadhav (Auditor)',
        username: 'auditor',
        password_hash: hash,
        role: 'AUDITOR',
        mobile: '9876543213',
        email: 'auditor@eoffice.gov.in',
        accessible_modules: JSON.stringify(['devworks', 'booth', 'calendar', 'notifications']),
        is_active: true,
        token_version: 1,
        failed_login_count: 0,
        password_changed_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        id: 5,
        full_name: 'Admin User',
        username: 'admin',
        password_hash: hash,
        role: 'ADMIN',
        mobile: '9876543214',
        email: 'admin@eoffice.gov.in',
        accessible_modules: JSON.stringify(['users', 'audit', 'notifications']),
        is_active: true,
        token_version: 1,
        failed_login_count: 0,
        password_changed_at: now,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { id: [1, 2, 3, 4, 5] });
  },
};
