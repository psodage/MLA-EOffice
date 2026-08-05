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

// ── Route Imports ────────────────────────────────────────────
import healthRoutes from './modules/health/health.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import inwardRoutes from './modules/inward/inward.routes.js';
import departmentRoutes from './modules/department/department.routes.js';
import outwardRoutes from './modules/outward/outward.routes.js';
import nivedanRoutes from './modules/nivedan/nivedan.routes.js';
import visitorRoutes from './modules/visitor/visitor.routes.js';
import devworksRoutes from './modules/devworks/devworks.routes.js';
import karyakartaRoutes from './modules/karyakarta/karyakarta.routes.js';
import calendarRoutes from './modules/calendar/calendar.routes.js';
import whatsappRoutes from './modules/whatsapp/whatsapp.routes.js';
import reportsRoutes from './modules/reports/reports.routes.js';
import userRoutes from './modules/user/user.routes.js';

const app = express();

// ── Security Headers ─────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────
const allowedOrigins = config.app.frontendUrl
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, UptimeRobot)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      !config.app.isProduction ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(new Error('CORS request blocked for origin: ' + origin), false);
  },
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

// ── Health Check (both /health and /api/v1/health for cloud health checks) ──
app.use('/health', healthRoutes);
app.use('/api/v1/health', healthRoutes);

// ── Root Route ───────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MLA E-Office API Server',
    status: 'online',
    health: '/api/v1/health',
  });
});


// ── API Routes ───────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/inward', inwardRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/outward', outwardRoutes);
app.use('/api/v1/nivedans', nivedanRoutes);
app.use('/api/v1/visitors', visitorRoutes);
app.use('/api/v1/devworks', devworksRoutes);
app.use('/api/v1/karyakartas', karyakartaRoutes);
app.use('/api/v1/calendar', calendarRoutes);
app.use('/api/v1/whatsapp', whatsappRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1', userRoutes);

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
