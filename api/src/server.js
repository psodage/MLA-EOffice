// src/server.js
// ============================================================
// HTTP Server Entry Point
// Tests database connection, then starts Express server
// ============================================================

import app from './app.js';
import config from './config/env.config.js';
import sequelize from './config/database.js';

const PORT = config.app.port;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    console.log(`   📦 DB: ${config.db.name}@${config.db.host}:${config.db.port}`);

    // Sync models in development (creates tables if they don't exist)
    // In production, use migrations instead
    if (!config.app.isProduction) {
      await sequelize.sync({ alter: false });
      console.log('✅ Database synced');
    }

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`\n🚀 MLA E-Office API Server`);
      console.log(`   Environment: ${config.app.env}`);
      console.log(`   Port:        ${PORT}`);
      console.log(`   Health:      http://localhost:${PORT}/api/v1/health`);
      console.log(`   Frontend:    ${config.app.frontendUrl}`);
      console.log('');
    });

  } catch (error) {
    // Database connection failed — start server anyway
    // This allows the health endpoint to work even if DB is down
    if (error.name === 'SequelizeConnectionRefusedError' ||
        error.name === 'SequelizeConnectionError' ||
        error.name === 'SequelizeHostNotFoundError' ||
        error.original?.code === 'ER_BAD_DB_ERROR' ||
        error.original?.code === 'ER_ACCESS_DENIED_ERROR' ||
        error.original?.code === 'ECONNREFUSED') {
      console.warn('⚠️  Database connection failed:', error.message);
      console.warn('   Server will start without database connection.');
      console.warn('   Configure DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD in .env\n');

      app.listen(PORT, () => {
        console.log(`\n🚀 MLA E-Office API Server (NO DATABASE)`);
        console.log(`   Environment: ${config.app.env}`);
        console.log(`   Port:        ${PORT}`);
        console.log(`   Health:      http://localhost:${PORT}/api/v1/health`);
        console.log('');
      });
    } else {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
};

startServer();
