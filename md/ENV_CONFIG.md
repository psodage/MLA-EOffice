# MLA E-Office — Environment Configuration

> **Complete Environment Variables Specification — 3 Environments, Security Classification, Joi Validator, Docker Compose, Secrets Rotation**
>
> This document defines every environment variable used by the backend (`api/`) and frontend (`web/`) applications. It includes ready-to-copy `.env.example` files, a variable-by-variable reference table with security classification, a Joi-based startup validator, Docker Compose config, and secrets management guidance.
>
> ⚠️ **NEVER commit `.env` files to Git.** Only `.env.example` (with placeholder values) should be committed.
>
> *Related Documents:* [ARCHITECTURE.md](file:///s:/MLA%20E%20-%20Office/ARCHITECTURE.md) | [AUTH_SPEC.md](file:///s:/MLA%20E%20-%20Office/AUTH_SPEC.md) | [TECH_STACK.md](file:///s:/MLA%20E%20-%20Office/TECH_STACK.md) | [CONSTITUENCY_PROFILE.md](file:///s:/MLA%20E%20-%20Office/CONSTITUENCY_PROFILE.md)

---

## 1. Security Classification Legend

Every variable is tagged with a security level:

| Tag | Level | Description | Can Commit to Git? |
|:---:|-------|-------------|:------------------:|
| 🟢 | **PUBLIC** | Non-sensitive configuration. Safe to share. | ✅ Yes (in `.env.example`) |
| 🟡 | **SENSITIVE** | Internal config. Not secret, but environment-specific. | ⚠️ Only placeholder |
| 🔴 | **SECRET** | API keys, passwords, tokens. Must never be committed or logged. | ❌ Never |

---

## 2. Backend `.env.example` — `api/.env.example`

```env
# ============================================================
# MLA E-OFFICE — BACKEND ENVIRONMENT VARIABLES
# Copy this file to .env and fill in real values
# NEVER commit .env to Git
# ============================================================

# ── Application ──────────────────────────────────────────────
NODE_ENV=development                    # 🟢 development | staging | production
PORT=5000                               # 🟢 Express server port
FRONTEND_URL=http://localhost:5173      # 🟡 CORS origin — frontend URL
API_BASE_URL=http://localhost:5000      # 🟡 Self-reference for internal links

# ── Database (MySQL 8.x) ────────────────────────────────────
DB_HOST=localhost                        # 🟡 MySQL host
DB_PORT=3306                             # 🟢 MySQL port
DB_NAME=mla_eoffice_dev                  # 🟡 Database name
DB_USER=root                             # 🟡 Database username
DB_PASSWORD=your_database_password       # 🔴 Database password
DB_POOL_MIN=2                            # 🟢 Sequelize pool min connections
DB_POOL_MAX=10                           # 🟢 Sequelize pool max connections
DB_SSL=false                             # 🟢 Enable SSL for DB connection (true in production)

# ── JWT Authentication ───────────────────────────────────────
JWT_SECRET=change_this_to_a_256bit_random_string   # 🔴 HMAC secret for Access Token signing
JWT_ACCESS_EXPIRY=24h                    # 🟢 Access token lifetime
JWT_REFRESH_EXPIRY=7d                    # 🟢 Refresh token lifetime

# ── Bcrypt ───────────────────────────────────────────────────
BCRYPT_SALT_ROUNDS=12                    # 🟢 Password hashing cost factor

# ── Cloudinary (File Storage) ────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name    # 🟡 Cloudinary cloud name
CLOUDINARY_API_KEY=your_api_key          # 🔴 Cloudinary API key
CLOUDINARY_API_SECRET=your_api_secret    # 🔴 Cloudinary API secret
CLOUDINARY_UPLOAD_PRESET=mla_eoffice     # 🟡 Upload preset name (created in Cloudinary dashboard)
FILE_MAX_SIZE_MB=10                      # 🟢 Max file upload size in MB
FILE_ALLOWED_TYPES=image/jpeg,image/png,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet   # 🟢 Allowed MIME types

# ── Google Gemini AI (Letter Drafting) ───────────────────────
GEMINI_API_KEY=your_gemini_api_key       # 🔴 Google Gemini API key
GEMINI_MODEL=gemini-2.0-flash           # 🟢 Model name
GEMINI_MAX_TOKENS=2048                   # 🟢 Max output tokens per request
GEMINI_TEMPERATURE=0.7                   # 🟢 Creativity factor (0.0–1.0)

# ── Meta WhatsApp Cloud API ──────────────────────────────────
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id      # 🔴 Meta Phone Number ID
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token   # 🔴 Meta permanent access token
WHATSAPP_VERIFY_TOKEN=your_webhook_verify_token     # 🔴 Webhook verification token (you define this)
WHATSAPP_WABA_ID=your_waba_id                       # 🟡 WhatsApp Business Account ID
WHATSAPP_API_VERSION=v21.0                           # 🟢 Meta Graph API version
WHATSAPP_MAX_RETRIES=2                               # 🟢 Message retry count before SMS fallback

# ── SMS Fallback (Optional) ─────────────────────────────────
SMS_PROVIDER=none                        # 🟢 none | msg91 | textlocal | twilio
SMS_API_KEY=your_sms_api_key             # 🔴 SMS provider API key (if SMS_PROVIDER ≠ none)
SMS_SENDER_ID=MLAOFF                     # 🟡 6-char sender ID registered with provider

# ── Email / SMTP (Notifications) ────────────────────────────
SMTP_HOST=smtp.gmail.com                 # 🟡 SMTP server hostname
SMTP_PORT=587                            # 🟢 SMTP port (587 for TLS, 465 for SSL)
SMTP_SECURE=false                        # 🟢 true for port 465, false for 587
SMTP_USER=your_email@gmail.com           # 🟡 SMTP username
SMTP_PASSWORD=your_app_password          # 🔴 SMTP password (use App Password for Gmail)
SMTP_FROM_NAME=MLA E-Office              # 🟢 Sender display name
SMTP_FROM_EMAIL=noreply@mlaeoffice.com   # 🟡 Sender email address
ADMIN_EMAIL=admin@mlaeoffice.com         # 🟡 Admin notification recipient

# ── Office Hours & Timezone ──────────────────────────────────
OFFICE_HOURS_START=10:00                 # 🟢 Login restriction start (HH:MM, 24hr)
OFFICE_HOURS_END=18:00                   # 🟢 Login restriction end (HH:MM, 24hr)
TIMEZONE=Asia/Kolkata                    # 🟢 Server timezone for IST display
OFFICE_HOURS_ENABLED=true                # 🟢 Toggle office hours restriction on/off

# ── Rate Limiting ────────────────────────────────────────────
RATE_LIMIT_WINDOW_MS=900000              # 🟢 Rate limit window (15 minutes = 900000ms)
RATE_LIMIT_MAX_REQUESTS=100              # 🟢 Max requests per window per IP
LOGIN_RATE_LIMIT_MAX=5                   # 🟢 Max login attempts before lockout
LOGIN_LOCKOUT_MINUTES=15                 # 🟢 Lockout duration in minutes

# ── Logging ──────────────────────────────────────────────────
LOG_LEVEL=debug                          # 🟢 debug | info | warn | error
LOG_FILE_PATH=logs/app.log               # 🟢 Winston log file path
LOG_MAX_SIZE=20m                         # 🟢 Max log file size before rotation
LOG_MAX_FILES=14d                        # 🟢 Keep logs for 14 days

# ── Cron / Scheduled Tasks ──────────────────────────────────
CRON_BIRTHDAY_GREETING=0 8 * * *        # 🟢 Daily 8:00 AM IST — birthday WhatsApp
CRON_ESCALATION_CHECK=0 9 * * 1-6       # 🟢 Daily 9:00 AM Mon-Sat — overdue nivedans
CRON_WHATSAPP_QUEUE=*/30 * * * * *      # 🟢 Every 30 seconds — process message queue

# ── Backup (Production Only) ────────────────────────────────
BACKUP_ENABLED=false                     # 🟢 Enable automated backups
BACKUP_CRON=0 2 * * *                   # 🟢 Daily 2:00 AM — backup schedule
BACKUP_RETENTION_DAYS=30                 # 🟢 Keep backups for 30 days
BACKUP_S3_BUCKET=                        # 🟡 S3 bucket name (if using AWS S3 for backups)
BACKUP_S3_ACCESS_KEY=                    # 🔴 S3 access key
BACKUP_S3_SECRET_KEY=                    # 🔴 S3 secret key
```

---

## 3. Frontend `.env.example` — `web/.env.example`

```env
# ============================================================
# MLA E-OFFICE — FRONTEND ENVIRONMENT VARIABLES (Vite)
# All variables MUST start with VITE_ to be accessible in browser
# ============================================================

VITE_API_BASE_URL=http://localhost:5000/api/v1    # 🟡 Backend API base URL
VITE_APP_NAME=MLA E-Office                        # 🟢 App name in browser tab
VITE_DEFAULT_LOCALE=mr                            # 🟢 Default language (mr = Marathi)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name        # 🟡 For direct client-side uploads < 2MB
VITE_CLOUDINARY_UPLOAD_PRESET=mla_eoffice         # 🟡 Unsigned upload preset
```

> **Note:** Frontend env vars are **bundled into the build** and visible to end users in the browser. Never put secrets in frontend `.env` files.

---

## 4. Variable Reference Table (All 55+ Variables)

### Backend Variables (`api/.env`)

| # | Variable | Type | Required | Default | Security | Used By |
|:-:|----------|------|:--------:|---------|:--------:|---------|
| 1 | `NODE_ENV` | string | ✅ | `development` | 🟢 | Express, Sequelize, Winston |
| 2 | `PORT` | number | ✅ | `5000` | 🟢 | Express server |
| 3 | `FRONTEND_URL` | url | ✅ | `http://localhost:5173` | 🟡 | CORS, CSP headers |
| 4 | `API_BASE_URL` | url | ❌ | `http://localhost:5000` | 🟡 | Self-reference links |
| 5 | `DB_HOST` | string | ✅ | `localhost` | 🟡 | Sequelize |
| 6 | `DB_PORT` | number | ✅ | `3306` | 🟢 | Sequelize |
| 7 | `DB_NAME` | string | ✅ | — | 🟡 | Sequelize |
| 8 | `DB_USER` | string | ✅ | — | 🟡 | Sequelize |
| 9 | `DB_PASSWORD` | string | ✅ | — | 🔴 | Sequelize |
| 10 | `DB_POOL_MIN` | number | ❌ | `2` | 🟢 | Sequelize pool |
| 11 | `DB_POOL_MAX` | number | ❌ | `10` | 🟢 | Sequelize pool |
| 12 | `DB_SSL` | boolean | ❌ | `false` | 🟢 | Sequelize |
| 13 | `JWT_SECRET` | string | ✅ | — | 🔴 | Auth middleware |
| 14 | `JWT_ACCESS_EXPIRY` | string | ❌ | `24h` | 🟢 | jwt.sign() |
| 15 | `JWT_REFRESH_EXPIRY` | string | ❌ | `7d` | 🟢 | jwt.sign() |
| 16 | `BCRYPT_SALT_ROUNDS` | number | ❌ | `12` | 🟢 | bcrypt.hash() |
| 17 | `CLOUDINARY_CLOUD_NAME` | string | ✅ | — | 🟡 | cloudinary.config() |
| 18 | `CLOUDINARY_API_KEY` | string | ✅ | — | 🔴 | cloudinary.config() |
| 19 | `CLOUDINARY_API_SECRET` | string | ✅ | — | 🔴 | cloudinary.config() |
| 20 | `CLOUDINARY_UPLOAD_PRESET` | string | ❌ | `mla_eoffice` | 🟡 | Upload service |
| 21 | `FILE_MAX_SIZE_MB` | number | ❌ | `10` | 🟢 | Multer |
| 22 | `FILE_ALLOWED_TYPES` | csv | ❌ | *(see .env.example)* | 🟢 | Upload validation |
| 23 | `GEMINI_API_KEY` | string | ✅ | — | 🔴 | AI letter drafting |
| 24 | `GEMINI_MODEL` | string | ❌ | `gemini-2.0-flash` | 🟢 | Gemini SDK |
| 25 | `GEMINI_MAX_TOKENS` | number | ❌ | `2048` | 🟢 | Gemini SDK |
| 26 | `GEMINI_TEMPERATURE` | number | ❌ | `0.7` | 🟢 | Gemini SDK |
| 27 | `WHATSAPP_PHONE_NUMBER_ID` | string | ✅ | — | 🔴 | WhatsApp service |
| 28 | `WHATSAPP_ACCESS_TOKEN` | string | ✅ | — | 🔴 | WhatsApp service |
| 29 | `WHATSAPP_VERIFY_TOKEN` | string | ✅ | — | 🔴 | Webhook handler |
| 30 | `WHATSAPP_WABA_ID` | string | ❌ | — | 🟡 | WhatsApp config |
| 31 | `WHATSAPP_API_VERSION` | string | ❌ | `v21.0` | 🟢 | Graph API URL |
| 32 | `WHATSAPP_MAX_RETRIES` | number | ❌ | `2` | 🟢 | Retry logic |
| 33 | `SMS_PROVIDER` | string | ❌ | `none` | 🟢 | SMS fallback |
| 34 | `SMS_API_KEY` | string | ❌ | — | 🔴 | SMS service |
| 35 | `SMS_SENDER_ID` | string | ❌ | `MLAOFF` | 🟡 | SMS header |
| 36 | `SMTP_HOST` | string | ❌ | `smtp.gmail.com` | 🟡 | Nodemailer |
| 37 | `SMTP_PORT` | number | ❌ | `587` | 🟢 | Nodemailer |
| 38 | `SMTP_SECURE` | boolean | ❌ | `false` | 🟢 | Nodemailer |
| 39 | `SMTP_USER` | string | ❌ | — | 🟡 | Nodemailer |
| 40 | `SMTP_PASSWORD` | string | ❌ | — | 🔴 | Nodemailer |
| 41 | `SMTP_FROM_NAME` | string | ❌ | `MLA E-Office` | 🟢 | Email headers |
| 42 | `SMTP_FROM_EMAIL` | string | ❌ | — | 🟡 | Email headers |
| 43 | `ADMIN_EMAIL` | string | ❌ | — | 🟡 | Error notifications |
| 44 | `OFFICE_HOURS_START` | string | ❌ | `10:00` | 🟢 | Auth middleware |
| 45 | `OFFICE_HOURS_END` | string | ❌ | `18:00` | 🟢 | Auth middleware |
| 46 | `TIMEZONE` | string | ❌ | `Asia/Kolkata` | 🟢 | Date utilities |
| 47 | `OFFICE_HOURS_ENABLED` | boolean | ❌ | `true` | 🟢 | Auth middleware |
| 48 | `RATE_LIMIT_WINDOW_MS` | number | ❌ | `900000` | 🟢 | express-rate-limit |
| 49 | `RATE_LIMIT_MAX_REQUESTS` | number | ❌ | `100` | 🟢 | express-rate-limit |
| 50 | `LOGIN_RATE_LIMIT_MAX` | number | ❌ | `5` | 🟢 | Auth service |
| 51 | `LOGIN_LOCKOUT_MINUTES` | number | ❌ | `15` | 🟢 | Auth service |
| 52 | `LOG_LEVEL` | string | ❌ | `debug` | 🟢 | Winston |
| 53 | `LOG_FILE_PATH` | string | ❌ | `logs/app.log` | 🟢 | Winston |

### Frontend Variables (`web/.env`)

| # | Variable | Type | Required | Default | Security | Used By |
|:-:|----------|------|:--------:|---------|:--------:|---------|
| 1 | `VITE_API_BASE_URL` | url | ✅ | — | 🟡 | Axios baseURL |
| 2 | `VITE_APP_NAME` | string | ❌ | `MLA E-Office` | 🟢 | Document title |
| 3 | `VITE_DEFAULT_LOCALE` | string | ❌ | `mr` | 🟢 | i18next config |
| 4 | `VITE_CLOUDINARY_CLOUD_NAME` | string | ✅ | — | 🟡 | Direct upload widget |
| 5 | `VITE_CLOUDINARY_UPLOAD_PRESET` | string | ❌ | `mla_eoffice` | 🟡 | Unsigned upload |

---

## 5. Per-Environment Comparison

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| `NODE_ENV` | `development` | `staging` | `production` |
| `PORT` | `5000` | `5000` | `5000` *(or port from hosting)* |
| `FRONTEND_URL` | `http://localhost:5173` | `https://staging.mlaeoffice.in` | `https://eoffice.mlaname.in` |
| `DB_HOST` | `localhost` | Railway internal host | Railway/AWS RDS host |
| `DB_NAME` | `mla_eoffice_dev` | `mla_eoffice_staging` | `mla_eoffice_prod` |
| `DB_PASSWORD` | `local_password` | Generated strong password | Generated strong password |
| `DB_SSL` | `false` | `true` | `true` |
| `JWT_SECRET` | `dev_jwt_secret_...` | 256-bit random | 256-bit random (different) |
| `JWT_ACCESS_EXPIRY` | `24h` | `1h` | `1h` |
| `JWT_REFRESH_EXPIRY` | `7d` | `7d` | `7d` |
| `CLOUDINARY_*` | Dev account keys | Same or separate | Production account keys |
| `GEMINI_API_KEY` | Free tier key | Same | Production key |
| `WHATSAPP_*` | Test number (Meta) | Test number | Production WABA number |
| `SMTP_PASSWORD` | Gmail App Password | SES/Mailgun credentials | SES/Mailgun credentials |
| `OFFICE_HOURS_ENABLED` | `false` | `true` | `true` |
| `LOG_LEVEL` | `debug` | `info` | `warn` |
| `BACKUP_ENABLED` | `false` | `false` | `true` |
| `RATE_LIMIT_MAX_REQUESTS` | `1000` *(relaxed)* | `100` | `100` |

---

## 6. Joi Startup Validator — `env.config.js`

```javascript
// src/config/env.config.js
// ============================================================
// Validates ALL required env vars on server boot.
// If any required variable is missing or invalid, the server
// refuses to start and prints the exact error.
// ============================================================

const Joi = require('joi');
const path = require('path');

// Load .env file (only in non-production)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });
}

const envSchema = Joi.object({

  // ── Application ───────────────────────────────────────────
  NODE_ENV:       Joi.string().valid('development', 'staging', 'production').required(),
  PORT:           Joi.number().default(5000),
  FRONTEND_URL:   Joi.string().uri().required(),
  API_BASE_URL:   Joi.string().uri().default('http://localhost:5000'),

  // ── Database ──────────────────────────────────────────────
  DB_HOST:        Joi.string().required(),
  DB_PORT:        Joi.number().default(3306),
  DB_NAME:        Joi.string().required(),
  DB_USER:        Joi.string().required(),
  DB_PASSWORD:    Joi.string().required(),
  DB_POOL_MIN:    Joi.number().default(2),
  DB_POOL_MAX:    Joi.number().default(10),
  DB_SSL:         Joi.boolean().default(false),

  // ── JWT ───────────────────────────────────────────────────
  JWT_SECRET:         Joi.string().min(32).required()
    .messages({ 'string.min': 'JWT_SECRET must be at least 32 characters for security' }),
  JWT_ACCESS_EXPIRY:  Joi.string().default('24h'),
  JWT_REFRESH_EXPIRY: Joi.string().default('7d'),

  // ── Bcrypt ────────────────────────────────────────────────
  BCRYPT_SALT_ROUNDS: Joi.number().min(10).max(14).default(12),

  // ── Cloudinary ────────────────────────────────────────────
  CLOUDINARY_CLOUD_NAME:    Joi.string().required(),
  CLOUDINARY_API_KEY:       Joi.string().required(),
  CLOUDINARY_API_SECRET:    Joi.string().required(),
  CLOUDINARY_UPLOAD_PRESET: Joi.string().default('mla_eoffice'),
  FILE_MAX_SIZE_MB:         Joi.number().default(10),
  FILE_ALLOWED_TYPES:       Joi.string().default('image/jpeg,image/png,application/pdf'),

  // ── Gemini AI ─────────────────────────────────────────────
  GEMINI_API_KEY:     Joi.string().required(),
  GEMINI_MODEL:       Joi.string().default('gemini-2.0-flash'),
  GEMINI_MAX_TOKENS:  Joi.number().default(2048),
  GEMINI_TEMPERATURE: Joi.number().min(0).max(1).default(0.7),

  // ── WhatsApp ──────────────────────────────────────────────
  WHATSAPP_PHONE_NUMBER_ID: Joi.string().required(),
  WHATSAPP_ACCESS_TOKEN:    Joi.string().required(),
  WHATSAPP_VERIFY_TOKEN:    Joi.string().required(),
  WHATSAPP_WABA_ID:         Joi.string().allow('').default(''),
  WHATSAPP_API_VERSION:     Joi.string().default('v21.0'),
  WHATSAPP_MAX_RETRIES:     Joi.number().default(2),

  // ── SMS (Optional) ───────────────────────────────────────
  SMS_PROVIDER:   Joi.string().valid('none', 'msg91', 'textlocal', 'twilio').default('none'),
  SMS_API_KEY:    Joi.string().when('SMS_PROVIDER', { not: 'none', then: Joi.required() }),
  SMS_SENDER_ID:  Joi.string().default('MLAOFF'),

  // ── SMTP (Optional — required if email notifications enabled) ──
  SMTP_HOST:       Joi.string().default('smtp.gmail.com'),
  SMTP_PORT:       Joi.number().default(587),
  SMTP_SECURE:     Joi.boolean().default(false),
  SMTP_USER:       Joi.string().allow('').default(''),
  SMTP_PASSWORD:   Joi.string().allow('').default(''),
  SMTP_FROM_NAME:  Joi.string().default('MLA E-Office'),
  SMTP_FROM_EMAIL: Joi.string().email().allow('').default(''),
  ADMIN_EMAIL:     Joi.string().email().allow('').default(''),

  // ── Office Hours ──────────────────────────────────────────
  OFFICE_HOURS_START:   Joi.string().pattern(/^\d{2}:\d{2}$/).default('10:00'),
  OFFICE_HOURS_END:     Joi.string().pattern(/^\d{2}:\d{2}$/).default('18:00'),
  TIMEZONE:             Joi.string().default('Asia/Kolkata'),
  OFFICE_HOURS_ENABLED: Joi.boolean().default(true),

  // ── Rate Limiting ─────────────────────────────────────────
  RATE_LIMIT_WINDOW_MS:     Joi.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS:  Joi.number().default(100),
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

  // ── Backup (Production) ───────────────────────────────────
  BACKUP_ENABLED:        Joi.boolean().default(false),
  BACKUP_CRON:           Joi.string().default('0 2 * * *'),
  BACKUP_RETENTION_DAYS: Joi.number().default(30),

}).unknown(true); // Allow extra vars from system

// Validate
const { error, value: envVars } = envSchema.validate(process.env, {
  abortEarly: false,   // Report ALL errors, not just the first one
  stripUnknown: false,
});

if (error) {
  const details = error.details.map(d => `  ❌ ${d.message}`).join('\n');
  console.error(`\n🚨 ENVIRONMENT VALIDATION FAILED:\n${details}\n`);
  console.error('Fix the above issues in your .env file and restart the server.\n');
  process.exit(1);
}

// Export typed config object
module.exports = {
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
```

**Usage in any service:**
```javascript
const config = require('./config/env.config');

// Access validated config
const db = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'mysql',
});

const token = jwt.sign(payload, config.jwt.secret, {
  expiresIn: config.jwt.accessExpiry,
});
```

---

## 7. Docker Compose Environment

```yaml
# docker-compose.yml

version: '3.8'

services:
  api:
    build: ./api
    ports:
      - "${PORT:-5000}:5000"
    env_file:
      - ./api/.env
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=3306
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  web:
    build: ./web
    ports:
      - "3000:80"
    environment:
      - VITE_API_BASE_URL=https://api.mlaeoffice.in/api/v1
    depends_on:
      - api
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME:-mla_eoffice_prod}
      MYSQL_CHARACTER_SET_SERVER: utf8mb4
      MYSQL_COLLATION_SERVER: utf8mb4_unicode_ci
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  mysql_data:
```

---

## 8. Secrets Management & Rotation

### 8A. Generating Strong Secrets

```bash
# Generate a 256-bit JWT_SECRET (Node.js one-liner)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate a 128-bit random string (shorter, for WHATSAPP_VERIFY_TOKEN)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 8B. Rotation Procedures

| Secret | How to Rotate | Downtime? |
|--------|--------------|:---------:|
| **JWT_SECRET** | 1. Generate new secret. 2. Update `.env`. 3. Restart server. **Effect:** All existing tokens become invalid — all users must re-login. | ⚠️ 30s restart |
| **DB_PASSWORD** | 1. Change password in MySQL. 2. Update `.env`. 3. Restart server. | ⚠️ 30s restart |
| **WHATSAPP_ACCESS_TOKEN** | 1. Generate new permanent token in Meta Business Manager. 2. Update `.env`. 3. Restart server. | ⚠️ 30s restart |
| **CLOUDINARY_API_SECRET** | 1. Regenerate in Cloudinary dashboard. 2. Update `.env`. 3. Restart server. Old URLs still work. | ⚠️ 30s restart |
| **GEMINI_API_KEY** | 1. Create new key in Google AI Studio. 2. Update `.env`. 3. Restart. 4. Delete old key. | ⚠️ 30s restart |
| **SMTP_PASSWORD** | 1. Generate new Gmail App Password. 2. Update `.env`. 3. Restart. | ⚠️ 30s restart |

### 8C. Security Best Practices

| # | Practice | Implementation |
|:-:|----------|---------------|
| 1 | **Never commit `.env`** | Add `.env` to `.gitignore` (both `api/.env` and `web/.env`) |
| 2 | **Use `.env.example`** | Commit `.env.example` with placeholder values for onboarding |
| 3 | **Different secrets per env** | Dev, staging, and production must have unique `JWT_SECRET` values |
| 4 | **Rotate quarterly** | Schedule JWT_SECRET and API key rotation every 90 days |
| 5 | **Audit access** | Only MLA and PA should have access to production `.env` |
| 6 | **Use hosting secrets** | On Render/Vercel, set env vars in the dashboard — never upload `.env` |
| 7 | **Log redaction** | Winston logger must NEVER log `JWT_SECRET`, `DB_PASSWORD`, or any `🔴 SECRET` variable |
| 8 | **Startup validation** | `env.config.js` Joi validator ensures server won't boot with missing secrets |

---

## 9. `.gitignore` Entries

```gitignore
# Environment files — NEVER commit
api/.env
web/.env
.env
.env.local
.env.staging
.env.production

# Keep examples
!api/.env.example
!web/.env.example
```
