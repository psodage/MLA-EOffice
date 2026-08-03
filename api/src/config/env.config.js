// src/config/env.config.js
// ============================================================
// Validates required env vars on server boot.
// If any required variable is missing or invalid, the server
// refuses to start and prints the exact error.
//
// Module 1: Only core vars validated as required.
// External service vars (Cloudinary, Gemini, WhatsApp, SMTP)
// default to empty/disabled so the server can boot without them.
// ============================================================

import Joi from 'joi';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file (only in non-production)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}

const envSchema = Joi.object({

  // ── Application ───────────────────────────────────────────
  NODE_ENV:       Joi.string().valid('development', 'staging', 'production').default('development'),
  PORT:           Joi.number().default(5000),
  FRONTEND_URL:   Joi.string().uri().default('http://localhost:5173'),
  API_BASE_URL:   Joi.string().uri().default('http://localhost:5000'),

  // ── Database ──────────────────────────────────────────────
  DB_HOST:        Joi.string().default('localhost'),
  DB_PORT:        Joi.number().default(3306),
  DB_NAME:        Joi.string().default('mla_eoffice_dev'),
  DB_USER:        Joi.string().default('root'),
  DB_PASSWORD:    Joi.string().allow('').default(''),
  DB_POOL_MIN:    Joi.number().default(2),
  DB_POOL_MAX:    Joi.number().default(10),
  DB_SSL:         Joi.boolean().default(false),

  // ── JWT ───────────────────────────────────────────────────
  JWT_SECRET:         Joi.string().min(16).default('dev_jwt_secret_change_this_in_production_please'),
  JWT_ACCESS_EXPIRY:  Joi.string().default('24h'),
  JWT_REFRESH_EXPIRY: Joi.string().default('7d'),

  // ── Bcrypt ────────────────────────────────────────────────
  BCRYPT_SALT_ROUNDS: Joi.number().min(10).max(14).default(12),

  // ── Cloudinary (optional for Module 1) ────────────────────
  CLOUDINARY_CLOUD_NAME:    Joi.string().allow('').default(''),
  CLOUDINARY_API_KEY:       Joi.string().allow('').default(''),
  CLOUDINARY_API_SECRET:    Joi.string().allow('').default(''),
  CLOUDINARY_UPLOAD_PRESET: Joi.string().default('mla_eoffice'),
  FILE_MAX_SIZE_MB:         Joi.number().default(10),
  FILE_ALLOWED_TYPES:       Joi.string().default('image/jpeg,image/png,application/pdf'),

  // ── Gemini AI (optional for Module 1) ─────────────────────
  GEMINI_API_KEY:     Joi.string().allow('').default(''),
  GEMINI_MODEL:       Joi.string().default('gemini-2.0-flash'),
  GEMINI_MAX_TOKENS:  Joi.number().default(2048),
  GEMINI_TEMPERATURE: Joi.number().min(0).max(1).default(0.7),

  // ── WhatsApp (optional for Module 1) ──────────────────────
  WHATSAPP_PHONE_NUMBER_ID: Joi.string().allow('').default(''),
  WHATSAPP_ACCESS_TOKEN:    Joi.string().allow('').default(''),
  WHATSAPP_VERIFY_TOKEN:    Joi.string().allow('').default(''),
  WHATSAPP_WABA_ID:         Joi.string().allow('').default(''),
  WHATSAPP_API_VERSION:     Joi.string().default('v21.0'),
  WHATSAPP_MAX_RETRIES:     Joi.number().default(2),

  // ── SMS (optional) ───────────────────────────────────────
  SMS_PROVIDER:   Joi.string().valid('none', 'msg91', 'textlocal', 'twilio').default('none'),
  SMS_API_KEY:    Joi.string().allow('').default(''),
  SMS_SENDER_ID:  Joi.string().default('MLAOFF'),

  // ── SMTP (optional for Module 1) ─────────────────────────
  SMTP_HOST:       Joi.string().default('smtp.gmail.com'),
  SMTP_PORT:       Joi.number().default(587),
  SMTP_SECURE:     Joi.boolean().default(false),
  SMTP_USER:       Joi.string().allow('').default(''),
  SMTP_PASSWORD:   Joi.string().allow('').default(''),
  SMTP_FROM_NAME:  Joi.string().default('MLA E-Office'),
  SMTP_FROM_EMAIL: Joi.string().allow('').default(''),
  ADMIN_EMAIL:     Joi.string().allow('').default(''),

  // ── Office Hours ──────────────────────────────────────────
  OFFICE_HOURS_START:   Joi.string().pattern(/^\d{2}:\d{2}$/).default('10:00'),
  OFFICE_HOURS_END:     Joi.string().pattern(/^\d{2}:\d{2}$/).default('18:00'),
  TIMEZONE:             Joi.string().default('Asia/Kolkata'),
  OFFICE_HOURS_ENABLED: Joi.boolean().default(false), // disabled in dev

  // ── Rate Limiting ─────────────────────────────────────────
  RATE_LIMIT_WINDOW_MS:     Joi.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS:  Joi.number().default(1000), // relaxed in dev
  LOGIN_RATE_LIMIT_MAX:     Joi.number().default(5),
  LOGIN_LOCKOUT_MINUTES:    Joi.number().default(15),

  // ── Logging ───────────────────────────────────────────────
  LOG_LEVEL:     Joi.string().valid('debug', 'info', 'warn', 'error').default('debug'),
  LOG_FILE_PATH: Joi.string().default('logs/app.log'),
  LOG_MAX_SIZE:  Joi.string().default('20m'),
  LOG_MAX_FILES: Joi.string().default('14d'),

  // ── Cron ──────────────────────────────────────────────────
  CRON_BIRTHDAY_GREETING: Joi.string().default('0 8 * * *'),
  CRON_ESCALATION_CHECK:  Joi.string().default('0 9 * * 1-6'),
  CRON_WHATSAPP_QUEUE:    Joi.string().default('*/30 * * * * *'),

  // ── Backup ───────────────────────────────────────────────
  BACKUP_ENABLED:        Joi.boolean().default(false),
  BACKUP_CRON:           Joi.string().default('0 2 * * *'),
  BACKUP_RETENTION_DAYS: Joi.number().default(30),

}).unknown(true); // Allow extra vars from system

// Validate
const { error, value: envVars } = envSchema.validate(process.env, {
  abortEarly: false,
  stripUnknown: false,
});

if (error) {
  const details = error.details.map(d => `  ❌ ${d.message}`).join('\n');
  console.error(`\n🚨 ENVIRONMENT VALIDATION FAILED:\n${details}\n`);
  console.error('Fix the above issues in your .env file and restart the server.\n');
  process.exit(1);
}

// Export typed config object
const config = {
  app: {
    env:          envVars.NODE_ENV,
    port:         envVars.PORT,
    frontendUrl:  envVars.FRONTEND_URL,
    apiBaseUrl:   envVars.API_BASE_URL,
    isProduction: envVars.NODE_ENV === 'production',
    isStaging:    envVars.NODE_ENV === 'staging',
  },
  db: {
    host:     envVars.DB_HOST,
    port:     envVars.DB_PORT,
    name:     envVars.DB_NAME,
    user:     envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    poolMin:  envVars.DB_POOL_MIN,
    poolMax:  envVars.DB_POOL_MAX,
    ssl:      envVars.DB_SSL,
  },
  jwt: {
    secret:        envVars.JWT_SECRET,
    accessExpiry:  envVars.JWT_ACCESS_EXPIRY,
    refreshExpiry: envVars.JWT_REFRESH_EXPIRY,
  },
  bcrypt: {
    saltRounds: envVars.BCRYPT_SALT_ROUNDS,
  },
  cloudinary: {
    cloudName:    envVars.CLOUDINARY_CLOUD_NAME,
    apiKey:       envVars.CLOUDINARY_API_KEY,
    apiSecret:    envVars.CLOUDINARY_API_SECRET,
    uploadPreset: envVars.CLOUDINARY_UPLOAD_PRESET,
    maxSizeMb:    envVars.FILE_MAX_SIZE_MB,
    allowedTypes: envVars.FILE_ALLOWED_TYPES.split(','),
  },
  gemini: {
    apiKey:      envVars.GEMINI_API_KEY,
    model:       envVars.GEMINI_MODEL,
    maxTokens:   envVars.GEMINI_MAX_TOKENS,
    temperature: envVars.GEMINI_TEMPERATURE,
  },
  whatsapp: {
    phoneNumberId: envVars.WHATSAPP_PHONE_NUMBER_ID,
    accessToken:   envVars.WHATSAPP_ACCESS_TOKEN,
    verifyToken:   envVars.WHATSAPP_VERIFY_TOKEN,
    wabaId:        envVars.WHATSAPP_WABA_ID,
    apiVersion:    envVars.WHATSAPP_API_VERSION,
    maxRetries:    envVars.WHATSAPP_MAX_RETRIES,
  },
  sms: {
    provider: envVars.SMS_PROVIDER,
    apiKey:   envVars.SMS_API_KEY,
    senderId: envVars.SMS_SENDER_ID,
  },
  smtp: {
    host:      envVars.SMTP_HOST,
    port:      envVars.SMTP_PORT,
    secure:    envVars.SMTP_SECURE,
    user:      envVars.SMTP_USER,
    password:  envVars.SMTP_PASSWORD,
    fromName:  envVars.SMTP_FROM_NAME,
    fromEmail: envVars.SMTP_FROM_EMAIL,
    adminEmail:envVars.ADMIN_EMAIL,
  },
  officeHours: {
    start:   envVars.OFFICE_HOURS_START,
    end:     envVars.OFFICE_HOURS_END,
    tz:      envVars.TIMEZONE,
    enabled: envVars.OFFICE_HOURS_ENABLED,
  },
  rateLimit: {
    windowMs:    envVars.RATE_LIMIT_WINDOW_MS,
    maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS,
    loginMax:    envVars.LOGIN_RATE_LIMIT_MAX,
    lockoutMin:  envVars.LOGIN_LOCKOUT_MINUTES,
  },
  logging: {
    level:    envVars.LOG_LEVEL,
    filePath: envVars.LOG_FILE_PATH,
    maxSize:  envVars.LOG_MAX_SIZE,
    maxFiles: envVars.LOG_MAX_FILES,
  },
  cron: {
    birthdayGreeting: envVars.CRON_BIRTHDAY_GREETING,
    escalationCheck:  envVars.CRON_ESCALATION_CHECK,
    whatsappQueue:    envVars.CRON_WHATSAPP_QUEUE,
  },
  backup: {
    enabled:       envVars.BACKUP_ENABLED,
    cron:          envVars.BACKUP_CRON,
    retentionDays: envVars.BACKUP_RETENTION_DAYS,
  },
};

export default config;
