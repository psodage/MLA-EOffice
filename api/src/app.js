// src/app.js
// ============================================================
// Express application setup
// Middleware stack, routes, and error handler
// ============================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import config from './config/env.config.js';
import errorHandler from './middlewares/errorHandler.js';
import { sendSuccess } from './utils/responseHelper.js';

// ── Route Imports ────────────────────────────────────────────
import authRoutes from './modules/auth/auth.routes.js';

const app = express();

// ── Security Headers ─────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────
app.use(cors({
  origin: config.app.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parsers ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Cookie Parser (for httpOnly refresh token) ───────────────
app.use(cookieParser());

// ── HTTP Request Logging ─────────────────────────────────────
if (!config.app.isProduction) {
  app.use(morgan('dev'));
}

// ── Health Check ─────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  sendSuccess(res, {
    message: 'MLA E-Office API is running',
    data: {
      status: 'ok',
      environment: config.app.env,
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
    },
  });
});

// ── API Routes ───────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);

// ── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

export default app;
