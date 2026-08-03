// src/config/database.js
// ============================================================
// Sequelize instance configured for MySQL 8.x
// Uses utf8mb4 charset for full Marathi/Unicode support
// ============================================================

import { Sequelize } from 'sequelize';
import config from './env.config.js';

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',

    // Connection pool
    pool: {
      min: config.db.poolMin,
      max: config.db.poolMax,
      acquire: 30000,   // Max time (ms) to get connection before throwing error
      idle: 10000,      // Max time (ms) a connection can be idle before being released
    },

    // SSL for production (Railway, AWS RDS)
    ...(config.db.ssl && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }),

    // Charset — utf8mb4 for Marathi text support
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,           // createdAt, updatedAt on every model
      underscored: true,          // snake_case column names (created_at, not createdAt)
      freezeTableName: true,      // Don't pluralize table names
    },

    // Logging
    logging: config.app.isProduction
      ? false
      : (msg) => console.log(`  📦 SQL: ${msg}`),

    // Timezone — IST
    timezone: '+05:30',
  }
);

export default sequelize;
