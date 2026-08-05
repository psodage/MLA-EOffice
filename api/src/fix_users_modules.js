import sequelize from './config/database.js';

const updateModules = async () => {
  try {
    await sequelize.authenticate();
    const modulesJson = JSON.stringify([
      'inward', 'outward', 'nivedan', 'visitor', 'devworks',
      'karyakarta', 'booth', 'geography', 'calendar', 'whatsapp',
      'dashboard', 'reports', 'notifications'
    ]);
    await sequelize.query('UPDATE users SET accessible_modules = :modules WHERE role = "MLA"', {
      replacements: { modules: modulesJson }
    });
    console.log('✅ Updated MLA accessible_modules in DB (removed users module)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating DB:', err.message);
    process.exit(1);
  }
};

updateModules();
