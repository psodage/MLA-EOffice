// src/modules/health/health.controller.js
// ============================================================
// Health Check Controllers
// Provides application and database health endpoints for Render,
// UptimeRobot, and monitoring agents (Deployment Guide Section 11A & 12A)
// ============================================================

import sequelize from '../../config/database.js';
import config from '../../config/env.config.js';
import { sendSuccess } from '../../utils/responseHelper.js';

/**
 * Basic system health check
 * GET /api/v1/health
 */
export const getHealth = async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'disconnected';
  }

  return sendSuccess(res, {
    message: 'MLA E-Office API health check',
    data: {
      status: dbStatus === 'connected' ? 'healthy' : 'degraded',
      database: dbStatus,
      environment: config.app.env,
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
    },
  });
};

/**
 * Detailed database health check
 * GET /api/v1/health/db
 */
export const getDbHealth = async (req, res) => {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query('SHOW TABLES;');
    const tableCount = Array.isArray(results) ? results.length : 0;

    return sendSuccess(res, {
      message: 'Database connection healthy',
      data: {
        connection: 'ok',
        database: config.db.name,
        host: config.db.host,
        port: config.db.port,
        tables: tableCount,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failure',
      error: {
        code: 'DB_CONNECTION_FAILED',
        details: error.message,
      },
    });
  }
};
