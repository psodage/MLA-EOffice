# MLA E-Office — Deployment Guide

> **Complete Step-by-Step Deployment Manual — Free Tier Hosting, Service Setup, Database Migration, Monitoring, Backup, Rollback & Scaling**
>
> This guide walks you through deploying a fresh MLA E-Office instance from scratch. Written for junior developers and IT staff — every step includes exact commands and screenshots locations.
>
> ⚠️ **Read this entire document before starting. Follow sections in order.**
>
> *Related Documents:* [TECH_STACK.md](file:///s:/MLA%20E%20-%20Office/TECH_STACK.md) | [ARCHITECTURE.md](file:///s:/MLA%20E%20-%20Office/ARCHITECTURE.md) | [ENV_CONFIG.md](file:///s:/MLA%20E%20-%20Office/ENV_CONFIG.md) | [AUTH_SPEC.md](file:///s:/MLA%20E%20-%20Office/AUTH_SPEC.md) | [DATA_MODELS.md](file:///s:/MLA%20E%20-%20Office/DATA_MODELS.md)

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Infrastructure Overview](#2-infrastructure-overview)
3. [Step 1 — Railway (MySQL Database)](#3-step-1--railway-mysql-database)
4. [Step 2 — Cloudinary (File Storage)](#4-step-2--cloudinary-file-storage)
5. [Step 3 — External API Keys](#5-step-3--external-api-keys)
6. [Step 4 — Render (Backend API)](#6-step-4--render-backend-api)
7. [Step 5 — Vercel (Frontend)](#7-step-5--vercel-frontend)
8. [Step 6 — Database Migration & Seeding](#8-step-6--database-migration--seeding)
9. [Step 7 — SSL & Custom Domain Setup](#9-step-7--ssl--custom-domain-setup)
10. [Step 8 — WhatsApp Business Setup](#10-step-8--whatsapp-business-setup)
11. [Step 9 — Post-Deployment Verification](#11-step-9--post-deployment-verification)
12. [Monitoring & Health Checks](#12-monitoring--health-checks)
13. [Backup & Disaster Recovery](#13-backup--disaster-recovery)
14. [Rollback Procedures](#14-rollback-procedures)
15. [Scaling Guide — Free Tier to Paid](#15-scaling-guide--free-tier-to-paid)
16. [New MLA Onboarding Checklist](#16-new-mla-onboarding-checklist)
17. [Troubleshooting](#17-troubleshooting)
18. [Quick Reference Card](#18-quick-reference-card)

---

## 1. Prerequisites

### 1A. Accounts Required (All Free)

Before you begin, create accounts on these platforms. **Use a single email** (preferably the MLA office's official email) for all accounts:

| # | Platform | URL | What It's For |
|:-:|----------|-----|---------------|
| 1 | **GitHub** | https://github.com | Code repository & auto-deploy trigger |
| 2 | **Railway** | https://railway.app | MySQL database hosting |
| 3 | **Render** | https://render.com | Node.js backend API hosting |
| 4 | **Vercel** | https://vercel.com | React frontend hosting |
| 5 | **Cloudinary** | https://cloudinary.com | File storage (PDFs, images) |
| 6 | **Google AI Studio** | https://aistudio.google.com | Gemini API key for AI letter drafting |
| 7 | **Meta Business** | https://business.facebook.com | WhatsApp Business API |
| 8 | **Gmail** | https://mail.google.com | SMTP email notifications |

### 1B. Tools to Install on Your Computer

```bash
# Required (install in this order)
1. Node.js v20 LTS          → https://nodejs.org (includes npm)
2. Git                       → https://git-scm.com
3. MySQL 8.x (local dev)    → https://dev.mysql.com/downloads/
4. VS Code (code editor)    → https://code.visualstudio.com

# Verify installations — run these in your terminal:
node --version      # Should show v20.x.x
npm --version       # Should show 10.x.x
git --version       # Should show 2.x.x
mysql --version     # Should show 8.x.x
```

### 1C. Repository Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/mla-eoffice.git
cd mla-eoffice

# 2. Install dependencies for both frontend and backend
cd api && npm install
cd ../web && npm install
cd ..

# 3. Verify folder structure
# You should see:
#   mla-eoffice/
#   ├── api/        ← Backend (Node.js + Express)
#   ├── web/        ← Frontend (React + Vite)
#   ├── shared/     ← Shared utilities
#   └── mobile/     ← React Native (future)
```

---

## 2. Infrastructure Overview

### Architecture Diagram

```
                    INTERNET (Users)
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
┌──────────────────┐         ┌──────────────────┐
│     VERCEL        │         │      RENDER       │
│  (Free Tier)      │  API    │   (Free Tier)     │
│                   │ Calls   │                   │
│  React + Vite     │────────▶│  Node.js +        │
│  Static Frontend  │         │  Express API      │
│                   │         │                   │
│  eoffice.         │         │  api.eoffice.     │
│  mlaname.in       │         │  mlaname.in       │
└──────────────────┘         └────────┬──────────┘
                                      │ SQL
                                      ▼
                             ┌──────────────────┐
                             │    RAILWAY        │
                             │  (Free Tier)      │
                             │                   │
                             │  MySQL 8.x        │
                             │  22 tables        │
                             └──────────────────┘

     External Services:
     ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
     │Cloudinary│  │ Gemini   │  │ WhatsApp │  │  Gmail   │
     │ (Files)  │  │ (AI)     │  │ (Msgs)   │  │ (SMTP)   │
     └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

### Free Tier Limits

| Platform | Free Tier Limits | ⚠️ Watch Out For |
|----------|-----------------|------------------|
| **Vercel** | 100GB bandwidth/month, unlimited deploys | Hobby plan — 1 user only |
| **Render** | 750 hours/month | ⚠️ Spins down after 15min inactivity; cold start ~30s |
| **Railway** | $5 free credit/month (~500h + 1GB RAM) | Credit exhausts → service stops |
| **Cloudinary** | 25GB storage, 25GB bandwidth/month | Monitor usage in dashboard |

---

## 3. Step 1 — Railway (MySQL Database)

> 🎯 **Goal:** Create a MySQL 8.x database on Railway and get the connection credentials.

### 3A. Create a Railway Project

1. Go to https://railway.app and sign in with GitHub
2. Click **"New Project"** → **"Provision MySQL"**
3. Railway will automatically create a MySQL 8.x instance
4. Wait 30–60 seconds for the database to spin up (green status indicator)

### 3B. Get Connection Credentials

1. Click on the **MySQL service** in your Railway project
2. Go to the **"Variables"** tab
3. Copy these values — you'll need them later:

```
MYSQL_HOST     = containers-us-west-XXX.railway.app   (or similar)
MYSQL_PORT     = 7890                                   (Railway uses non-standard ports)
MYSQL_DATABASE = railway                                (default database name)
MYSQL_USER     = root
MYSQL_PASSWORD = aBcDeFgH1234567890                     (auto-generated)
MYSQL_URL      = mysql://root:password@host:port/railway
```

> 💡 **Tip:** You can also find these under the **"Connect"** tab → **"Available Variables"**.

### 3C. Create the Application Database

Option A — Via Railway's built-in query editor:
1. Click your MySQL service → **"Data"** tab → **"Query"**
2. Run:
```sql
CREATE DATABASE IF NOT EXISTS mla_eoffice_prod
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Option B — Via local MySQL client:
```bash
# Connect to Railway MySQL from your computer
mysql -h containers-us-west-XXX.railway.app -P 7890 -u root -p

# Enter the password when prompted, then run:
CREATE DATABASE IF NOT EXISTS mla_eoffice_prod
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 3D. Record Your Database Config

Save these for later (you'll enter them in Render's environment variables):

```env
DB_HOST=containers-us-west-XXX.railway.app
DB_PORT=7890
DB_NAME=mla_eoffice_prod
DB_USER=root
DB_PASSWORD=your_railway_generated_password
DB_SSL=true
```

---

## 4. Step 2 — Cloudinary (File Storage)

> 🎯 **Goal:** Create a Cloudinary account, get API keys, and configure upload presets and folder structure.

### 4A. Create Account & Get API Keys

1. Go to https://cloudinary.com → **Sign up for free**
2. After sign-up, go to **Dashboard** → you'll see:
   - **Cloud Name** (e.g., `dxyz12345`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `aBcDeFgHiJkLmNoPqRsT`)

3. Copy all three — you'll need them for the backend `.env`.

### 4B. Create Upload Preset

1. Go to **Settings** → **Upload** tab → **Upload presets**
2. Click **"Add upload preset"**
3. Configure:
   - **Upload preset name:** `mla_eoffice`
   - **Signing mode:** `Unsigned` (for direct client uploads < 2MB)
   - **Folder:** `mla-eoffice` (auto-organizes files)
4. Click **Save**

### 4C. Create Folder Structure

1. Go to **Media Library** → **Create Folder** and create these folders:

```
mla-eoffice/
├── inward/           ← Scanned inward letters (PDFs, images)
├── outward/          ← Generated outward letters
├── nivedans/         ← Citizen complaint attachments
├── devworks/         ← Development work photos (geotagged)
├── workers/          ← Karyakarta profile photos
├── calendar/         ← Event-related images
├── backups/          ← Database backup files (production)
└── branding/         ← MLA photo, party logo, office logo
```

### 4D. Configure Upload Restrictions (Recommended)

1. Go to **Settings** → **Upload** tab
2. Set **maximum file size:** `10 MB`
3. Under **Allowed formats**, add: `jpg, jpeg, png, pdf, xlsx`

### 4E. Record Your Cloudinary Config

```env
CLOUDINARY_CLOUD_NAME=dxyz12345
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=aBcDeFgHiJkLmNoPqRsT
CLOUDINARY_UPLOAD_PRESET=mla_eoffice
```

---

## 5. Step 3 — External API Keys

### 5A. Google Gemini API Key (AI Letter Drafting)

1. Go to https://aistudio.google.com
2. Sign in with Google account
3. Click **"Get API Key"** → **"Create API Key"**
4. Select or create a Google Cloud project
5. Copy the generated API key

```env
GEMINI_API_KEY=AIzaSyD_your_actual_key_here
GEMINI_MODEL=gemini-2.0-flash
```

> 💡 **Free Tier:** 15 requests/minute, 1 million tokens/day — sufficient for office use.

### 5B. Gmail App Password (SMTP Notifications)

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (required)
3. Go to https://myaccount.google.com/apppasswords
4. Select **App:** "Mail" → **Device:** "Other (MLA E-Office)"
5. Click **Generate** → Copy the 16-character app password

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=mlaeoffice@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop    # 16-char app password (spaces are fine)
SMTP_FROM_NAME=MLA E-Office
SMTP_FROM_EMAIL=noreply@mlaeoffice.com
ADMIN_EMAIL=admin@mlaeoffice.com
```

### 5C. Generate Security Secrets

Run these commands on your computer to generate strong secrets:

```bash
# Generate JWT_SECRET (256-bit, 64 hex characters)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Output example: a1b2c3d4e5f6...64 characters total

# Generate WHATSAPP_VERIFY_TOKEN (128-bit, 32 hex characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output example: f1e2d3c4b5a6...32 characters total
```

> 🔴 **CRITICAL:** Save these secrets securely (password manager). Never share them via email or chat. Never commit them to Git.

---

## 6. Step 4 — Render (Backend API)

> 🎯 **Goal:** Deploy the Node.js + Express backend API on Render with auto-deploy from GitHub.

### 6A. Create a New Web Service

1. Go to https://render.com → **Dashboard** → **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `your-org/mla-eoffice`
3. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `mla-eoffice-api` |
| **Region** | `Singapore` (closest to India) or `Oregon` |
| **Branch** | `main` |
| **Root Directory** | `api` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 6B. Set Environment Variables

1. In your Render service → **"Environment"** tab
2. Click **"Add Environment Variable"** for each:

```env
# ── Application ──────────────────────────────────────────────
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://eoffice.mlaname.in
API_BASE_URL=https://api.eoffice.mlaname.in

# ── Database (from Railway — Step 1) ────────────────────────
DB_HOST=containers-us-west-XXX.railway.app
DB_PORT=7890
DB_NAME=mla_eoffice_prod
DB_USER=root
DB_PASSWORD=your_railway_password
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_SSL=true

# ── JWT Authentication ───────────────────────────────────────
JWT_SECRET=your_generated_64_char_hex_secret
JWT_ACCESS_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# ── Bcrypt ───────────────────────────────────────────────────
BCRYPT_SALT_ROUNDS=12

# ── Cloudinary (from Step 2) ────────────────────────────────
CLOUDINARY_CLOUD_NAME=dxyz12345
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=aBcDeFgHiJkLmNoPqRsT
CLOUDINARY_UPLOAD_PRESET=mla_eoffice
FILE_MAX_SIZE_MB=10
FILE_ALLOWED_TYPES=image/jpeg,image/png,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

# ── Google Gemini AI (from Step 3A) ─────────────────────────
GEMINI_API_KEY=AIzaSyD_your_key
GEMINI_MODEL=gemini-2.0-flash
GEMINI_MAX_TOKENS=2048
GEMINI_TEMPERATURE=0.7

# ── WhatsApp (configure after Step 8) ───────────────────────
WHATSAPP_PHONE_NUMBER_ID=placeholder_update_later
WHATSAPP_ACCESS_TOKEN=placeholder_update_later
WHATSAPP_VERIFY_TOKEN=your_generated_32_char_hex
WHATSAPP_API_VERSION=v21.0
WHATSAPP_MAX_RETRIES=2

# ── SMTP (from Step 3B) ────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=mlaeoffice@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM_NAME=MLA E-Office
SMTP_FROM_EMAIL=noreply@mlaeoffice.com
ADMIN_EMAIL=admin@mlaeoffice.com

# ── Office Hours & Timezone ─────────────────────────────────
OFFICE_HOURS_START=10:00
OFFICE_HOURS_END=18:00
TIMEZONE=Asia/Kolkata
OFFICE_HOURS_ENABLED=true

# ── Rate Limiting ────────────────────────────────────────────
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5
LOGIN_LOCKOUT_MINUTES=15

# ── Logging ──────────────────────────────────────────────────
LOG_LEVEL=warn
LOG_FILE_PATH=logs/app.log
LOG_MAX_SIZE=20m
LOG_MAX_FILES=14d

# ── Cron Jobs ────────────────────────────────────────────────
CRON_BIRTHDAY_GREETING=0 8 * * *
CRON_ESCALATION_CHECK=0 9 * * 1-6
CRON_WHATSAPP_QUEUE=*/30 * * * * *

# ── Backup ───────────────────────────────────────────────────
BACKUP_ENABLED=true
BACKUP_CRON=0 2 * * *
BACKUP_RETENTION_DAYS=30
```

> ⚠️ **Important:** Use Render's "Secret File" feature for sensitive keys. Click **"Add Secret File"** → filename: `.env` → paste all variables. This is more secure than individual env vars for `🔴 SECRET` level values.

### 6C. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone the `api/` directory
   - Run `npm install`
   - Run `npm start`
3. Wait for the build to complete (2–5 minutes)
4. You'll get a URL like: `https://mla-eoffice-api.onrender.com`

### 6D. Verify Backend is Running

```bash
# Check the health endpoint
curl https://mla-eoffice-api.onrender.com/api/v1/health

# Expected response:
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": "...",
    "database": "connected",
    "timestamp": "2026-08-02T..."
  }
}
```

---

## 7. Step 5 — Vercel (Frontend)

> 🎯 **Goal:** Deploy the React + Vite frontend on Vercel with auto-deploy from GitHub.

### 7A. Import Project

1. Go to https://vercel.com → **Dashboard** → **"Add New..."** → **"Project"**
2. Select your GitHub repository: `your-org/mla-eoffice`
3. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `web` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 7B. Set Environment Variables

In Vercel → **"Environment Variables"** section during setup (or later in Settings → Environment Variables):

```env
VITE_API_BASE_URL=https://mla-eoffice-api.onrender.com/api/v1
VITE_APP_NAME=MLA E-Office
VITE_DEFAULT_LOCALE=mr
VITE_CLOUDINARY_CLOUD_NAME=dxyz12345
VITE_CLOUDINARY_UPLOAD_PRESET=mla_eoffice
```

> 📌 **Note:** Replace `https://mla-eoffice-api.onrender.com` with your actual Render URL from Step 4C. Once you set up a custom domain (Step 7), update this to `https://api.eoffice.mlaname.in/api/v1`.

### 7C. Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Clone the `web/` directory
   - Run `npm install` → `npm run build` (Vite production build)
   - Deploy to global CDN edge network
3. Wait 1–3 minutes
4. You'll get a URL like: `https://mla-eoffice.vercel.app`

### 7D. Configure SPA Routing

Create or verify this file exists in `web/`:

```json
// web/vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures all React Router routes work correctly (prevents 404 on page refresh).

### 7E. Verify Frontend

1. Open `https://mla-eoffice.vercel.app` in your browser
2. You should see the MLA E-Office login page
3. Open browser DevTools (F12) → Console → Check for errors
4. Network tab → Verify API calls go to your Render backend URL

---

## 8. Step 6 — Database Migration & Seeding

> 🎯 **Goal:** Create all 22 tables and insert initial seed data (admin user, MLA profile, master data).

### 8A. Run Migrations

Migrations are run from your **local machine** connecting to the **Railway production database**:

```bash
# Navigate to the API directory
cd api

# Set production database URL temporarily
# (Option A — using environment variable)
export DATABASE_URL="mysql://root:YOUR_PASSWORD@YOUR_RAILWAY_HOST:PORT/mla_eoffice_prod"

# (Option B — create a temporary .env.production file)
# Copy from .env.example and fill in Railway credentials

# Run all pending migrations
npx sequelize-cli db:migrate --env production

# Verify — should show "No pending migrations"
npx sequelize-cli db:migrate:status --env production
```

Expected output:
```
== 20260101000001-create-users-table: migrating =======
== 20260101000001-create-users-table: migrated (0.134s)
== 20260101000002-create-categories-table: migrating =======
== 20260101000002-create-categories-table: migrated (0.098s)
... (all 22 tables)
```

### 8B. Seed Master Data

```bash
# Seed in this order (due to foreign key dependencies):

# 1. Lookup tables first (no foreign keys)
npx sequelize-cli db:seed --seed 01-seed-departments.js --env production
npx sequelize-cli db:seed --seed 02-seed-categories.js --env production
npx sequelize-cli db:seed --seed 03-seed-talukas.js --env production

# 2. Geography data (depends on talukas)
npx sequelize-cli db:seed --seed 04-seed-gram-panchayats.js --env production
npx sequelize-cli db:seed --seed 05-seed-villages.js --env production
npx sequelize-cli db:seed --seed 06-seed-wards.js --env production

# 3. Booths (depends on geography)
npx sequelize-cli db:seed --seed 07-seed-booths.js --env production

# Or run all seeders at once (if seeder files are numbered correctly):
npx sequelize-cli db:seed:all --env production
```

### 8C. Create Initial Admin User

The System Administrator account must be created manually (or via a dedicated seeder):

```bash
# Run the admin creation seeder
npx sequelize-cli db:seed --seed 00-seed-admin-user.js --env production
```

The default admin seeder creates:

| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `Admin@MLA2026` (must be changed on first login) |
| **Role** | `System Administrator` |
| **Name** | `System Admin` |
| **Email** | Value from `ADMIN_EMAIL` env variable |

> 🔴 **CRITICAL — First Login:** Log in with the admin account immediately and change the password. The system enforces a password change on first login. Then create the MLA user, PA user, and other staff accounts through the Admin panel.

### 8D. Verify Database

```bash
# Connect to Railway MySQL and verify
mysql -h YOUR_RAILWAY_HOST -P PORT -u root -p mla_eoffice_prod

# Check tables were created
SHOW TABLES;
# Expected: 22 tables

# Check seed data
SELECT COUNT(*) FROM departments;     -- Should show 30+ departments
SELECT COUNT(*) FROM categories;      -- Should show 10+ categories
SELECT COUNT(*) FROM users;           -- Should show 1 (admin)
```

---

## 9. Step 7 — SSL & Custom Domain Setup

> 🎯 **Goal:** Configure `eoffice.mlaname.in` (frontend) and `api.eoffice.mlaname.in` (backend) with auto-SSL.

### 9A. Purchase a Domain

1. Buy a domain from any registrar:
   - **Recommended:** Hostinger, GoDaddy, Namecheap, Google Domains
   - **Suggested format:** `eoffice.mlaname.in` (e.g., `eoffice.rajeshpawar.in`)
   - **Cost:** ₹500–1,000/year for `.in` domains

### 9B. Configure DNS Records

Go to your domain registrar's **DNS Management** panel and add these records:

#### For Frontend (Vercel):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `@` (or `eoffice`) | `cname.vercel-dns.com` | 300 |
| `CNAME` | `www` | `cname.vercel-dns.com` | 300 |

#### For Backend API (Render):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `api` | `mla-eoffice-api.onrender.com` | 300 |

> 💡 **DNS Propagation:** Changes can take 5 minutes to 48 hours. Usually 15–30 minutes. Use https://dnschecker.org to verify.

### 9C. Add Custom Domain in Vercel

1. Go to Vercel → Your Project → **"Settings"** → **"Domains"**
2. Add domain: `eoffice.mlaname.in`
3. Add domain: `www.eoffice.mlaname.in` (redirect to primary)
4. Vercel will automatically provision an **SSL certificate** (Let's Encrypt)
5. Wait for ✅ "Valid Configuration" status

### 9D. Add Custom Domain in Render

1. Go to Render → Your Service → **"Settings"** → **"Custom Domains"**
2. Add domain: `api.eoffice.mlaname.in`
3. Render will automatically provision an **SSL certificate**
4. Wait for ✅ "Verified" status

### 9E. Update Environment Variables

After custom domains are live, update these variables:

**On Render (Backend):**
```env
FRONTEND_URL=https://eoffice.mlaname.in
API_BASE_URL=https://api.eoffice.mlaname.in
```

**On Vercel (Frontend):**
```env
VITE_API_BASE_URL=https://api.eoffice.mlaname.in/api/v1
```

> ⚠️ After updating env vars, **redeploy both services** — Render will auto-redeploy when you save env changes. For Vercel, trigger a redeploy from the dashboard.

### 9F. Verify SSL

```bash
# Check frontend SSL
curl -I https://eoffice.mlaname.in
# Should return: HTTP/2 200 (with SSL headers)

# Check backend SSL
curl https://api.eoffice.mlaname.in/api/v1/health
# Should return: { "success": true, ... }
```

---

## 10. Step 8 — WhatsApp Business Setup

> 🎯 **Goal:** Set up Meta WhatsApp Business Cloud API for automated citizen notifications.

### 10A. Prerequisites

- A **Meta Business Account** (https://business.facebook.com)
- A **dedicated phone number** for the MLA office (not a personal number)
- Business verification completed on Meta

### 10B. Create WhatsApp Business App

1. Go to https://developers.facebook.com
2. Click **"My Apps"** → **"Create App"**
3. Select **"Business"** type → Fill in app name: `MLA EOffice WhatsApp`
4. In the app dashboard, find **"WhatsApp"** → Click **"Set Up"**
5. Follow the guided setup:
   - Select your Meta Business Account
   - Add a phone number (the MLA office's dedicated number)
   - Verify the phone number via SMS/call

### 10C. Get API Credentials

After setup, go to **WhatsApp** → **"API Setup"** in your app dashboard:

```env
WHATSAPP_PHONE_NUMBER_ID=1234567890123456   # From "Phone Number ID" field
WHATSAPP_ACCESS_TOKEN=EAABx...very_long     # From "Temporary Access Token" — replace with permanent token
WHATSAPP_WABA_ID=9876543210                 # WhatsApp Business Account ID
```

### 10D. Generate Permanent Access Token

> ⚠️ The temporary token expires in 24 hours. You need a **permanent token**:

1. Go to **Business Settings** → **"System Users"**
2. Create a system user named `mla-eoffice-bot`
3. Grant it **"WhatsApp Business Account"** full access
4. Click the system user → **"Generate Token"**
5. Select the app → add permissions: `whatsapp_business_messaging`, `whatsapp_business_management`
6. Copy the generated token — this is your **permanent access token**

### 10E. Submit Message Templates for Approval

You need to create and get Meta's approval for message templates. Go to **WhatsApp Manager** → **"Message Templates"**:

#### Template 1: Nivedan Status Update (Marathi)
```
Template Name:  nivedan_status_update_mr
Language:       Marathi (mr)
Category:       UTILITY
Header:         None
Body:           नमस्कार {{1}},
                आपला निवेदन ({{2}}) अद्ययावत:
                स्थिती: {{3}}
                टिप्पणी: {{4}}
                संदर्भासाठी: {{5}}
Footer:         MLA E-Office
Buttons:        None
```

#### Template 2: Birthday Greeting (Marathi)
```
Template Name:  birthday_greeting_mr
Language:       Marathi (mr)
Category:       MARKETING
Header:         Image
Body:           {{1}} यांना वाढदिवसाच्या हार्दिक शुभेच्छा! 🎂
                आ. {{2}} यांच्या कार्यालयातर्फे.
Footer:         MLA E-Office
```

> 📌 Template approval typically takes 1–24 hours. Status visible in WhatsApp Manager.

### 10F. Configure Webhook

1. In your Facebook App → **WhatsApp** → **"Configuration"**
2. Set **Callback URL:** `https://api.eoffice.mlaname.in/api/v1/whatsapp/webhook`
3. Set **Verify Token:** Same value as your `WHATSAPP_VERIFY_TOKEN` env variable
4. Subscribe to these webhook fields:
   - `messages` (incoming messages)
   - `message_deliveries` (delivery status)
   - `message_reads` (read receipts)

### 10G. Update Render Environment Variables

Go back to Render and update the WhatsApp placeholders with real values:

```env
WHATSAPP_PHONE_NUMBER_ID=1234567890123456
WHATSAPP_ACCESS_TOKEN=EAABx_your_permanent_token
WHATSAPP_VERIFY_TOKEN=your_32_char_hex_from_step_3C
WHATSAPP_WABA_ID=9876543210
WHATSAPP_API_VERSION=v21.0
WHATSAPP_MAX_RETRIES=2
```

### 10H. Test WhatsApp Integration

```bash
# Send a test message via the API
curl -X POST https://api.eoffice.mlaname.in/api/v1/whatsapp/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "919876543210",
    "template": "nivedan_status_update_mr",
    "params": ["राजेश", "NIV-2026-00001", "प्रक्रियेत", "काम सुरू", "eoffice.mlaname.in/track"]
  }'
```

---

## 11. Step 9 — Post-Deployment Verification

> 🎯 **Goal:** Verify everything works end-to-end before handing over to the MLA office.

### 11A. Health Check Endpoints

```bash
# 1. Backend API health
curl https://api.eoffice.mlaname.in/api/v1/health
# ✅ Expected: { "success": true, "data": { "status": "healthy", "database": "connected" } }

# 2. Frontend loads
curl -I https://eoffice.mlaname.in
# ✅ Expected: HTTP/2 200

# 3. Database connectivity (via API)
curl https://api.eoffice.mlaname.in/api/v1/health/db
# ✅ Expected: { "success": true, "data": { "tables": 22, "connection": "ok" } }
```

### 11B. End-to-End Smoke Test

Perform these tests manually in the browser:

| # | Test | Expected Result | ✅/❌ |
|:-:|------|----------------|:-----:|
| 1 | Open `https://eoffice.mlaname.in` | Login page loads | |
| 2 | Login with admin credentials | Dashboard loads | |
| 3 | Change admin password | Success toast notification | |
| 4 | Create MLA user account | User created successfully | |
| 5 | Create PA user account | User created successfully | |
| 6 | Login as MLA | Full dashboard with all modules | |
| 7 | Create a test nivedan | Nivedan saved, tracking ID generated | |
| 8 | Upload a file (PDF/image) | File uploaded to Cloudinary | |
| 9 | Draft a letter using AI | Gemini generates a letter | |
| 10 | Check WhatsApp sending | Test message sent | |
| 11 | Check bilingual toggle | UI switches between English ↔ Marathi | |
| 12 | Check responsive layout | Works on mobile browser | |

### 11C. Security Verification

```bash
# 1. CORS — should reject requests from unknown origins
curl -H "Origin: https://malicious-site.com" \
     https://api.eoffice.mlaname.in/api/v1/health
# ✅ Expected: CORS error or missing Access-Control-Allow-Origin header

# 2. Rate limiting — should block after 100 requests
# (Don't run 100 times in production — test this in development)

# 3. Auth — should reject unauthenticated requests
curl https://api.eoffice.mlaname.in/api/v1/nivedans
# ✅ Expected: { "success": false, "error": { "code": "AUTH_TOKEN_MISSING" } }
```

---

## 12. Monitoring & Health Checks

### 12A. Automated Uptime Monitoring

Set up free uptime monitoring using **UptimeRobot** (https://uptimerobot.com):

1. Create a free account (up to 50 monitors)
2. Add these monitors:

| Monitor | URL | Check Interval | Alert On |
|---------|-----|:---------:|----------|
| Frontend | `https://eoffice.mlaname.in` | 5 min | Down > 1 min |
| Backend API | `https://api.eoffice.mlaname.in/api/v1/health` | 5 min | Down > 1 min |
| Database (via API) | `https://api.eoffice.mlaname.in/api/v1/health/db` | 15 min | Down > 5 min |

3. Set up alert contacts: Admin email + Admin WhatsApp number

### 12B. Built-in System Health Check

The backend runs an automated health check cron job every 15 minutes:

```
Checks:
  ✅ MySQL database connection
  ✅ Cloudinary API reachability
  ✅ WhatsApp API reachability
  ✅ Gemini API reachability
  ✅ SMTP connection test

If any check fails → Admin receives:
  📧 Email alert with failure details
  🔔 In-app notification (red alert in Notification Center)
```

### 12C. Accessing Logs

#### Render (Backend Logs):
1. Go to Render Dashboard → Your Service → **"Logs"** tab
2. View real-time log stream
3. Filter by log level using the search bar

#### Application Logs (Winston):
- **Error logs:** `logs/error.log` — exceptions, stack traces, critical failures
- **Combined logs:** `logs/combined.log` — HTTP requests, operations, warnings
- **Debug logs:** `logs/debug.log` — (development only) SQL queries, API payloads

#### Audit Logs (Database):
```sql
-- View recent audit log entries
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50;

-- View actions by a specific user
SELECT * FROM audit_logs WHERE user_id = 5 ORDER BY created_at DESC;

-- View all login attempts
SELECT * FROM audit_logs WHERE action = 'LOGIN' ORDER BY created_at DESC;
```

### 12D. Error Alert Severity Matrix

| Severity | Examples | Alert Method | Response Time |
|----------|---------|--------------|:------------:|
| 🔴 **Critical** | DB connection lost, server crash, OOM | Email + In-app + UptimeRobot | **Immediate** |
| 🟠 **High** | WhatsApp API failure, Gemini down, upload failure | In-app notification | **< 1 hour** |
| 🟡 **Medium** | Validation errors, rate limit exceeded | Log file only | **Next business day** |
| 🟢 **Low** | 404 Not Found, duplicate entries | Client error response | **No action needed** |

---

## 13. Backup & Disaster Recovery

### 13A. Automated Backup Schedule

| Backup Type | Frequency | Time (IST) | Method | Stored In |
|-------------|:---------:|:----------:|--------|-----------|
| **Incremental** | Daily | 2:00 AM | MySQL binary log backup | `api/backups/` + Cloudinary `/backups/` |
| **Full** | Weekly (Sunday) | 3:00 AM | `mysqldump --all-databases` | `api/backups/` + Cloudinary `/backups/` |
| **Railway Auto** | Continuous | — | Railway's built-in point-in-time recovery | Railway platform |
| **Retention** | 30 days | — | Auto-delete backups older than 30 days | — |

### 13B. Manual Backup (Emergency)

If you need an immediate backup:

```bash
# From your local machine, connect to Railway and dump the database
mysqldump -h YOUR_RAILWAY_HOST -P PORT -u root -p \
  --single-transaction \
  --routines \
  --triggers \
  mla_eoffice_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Compress the backup
gzip backup_*.sql

# Upload to Cloudinary for safe storage
# (use the Cloudinary dashboard or API)
```

### 13C. Restore from Backup

> ⚠️ **WARNING:** Restoring a backup will **overwrite all current data**. Only do this in an emergency.

```bash
# Step 1: Stop the backend (optional — prevents new writes during restore)
# Go to Render Dashboard → Your Service → "Suspend Service"

# Step 2: Download the backup file
# From Cloudinary or local storage

# Step 3: Decompress if gzipped
gunzip backup_20260801_020000.sql.gz

# Step 4: Restore to Railway MySQL
mysql -h YOUR_RAILWAY_HOST -P PORT -u root -p mla_eoffice_prod < backup_20260801_020000.sql

# Step 5: Verify data
mysql -h YOUR_RAILWAY_HOST -P PORT -u root -p mla_eoffice_prod -e "SELECT COUNT(*) FROM users;"

# Step 6: Resume the backend service
# Go to Render Dashboard → Your Service → "Resume Service"
```

### 13D. Backup Verification

- **Weekly:** Automated restore test to a temporary database (runs via cron)
- **Monthly:** Manual verification by Admin — check backup file integrity and recent dates
- Backup success/failure is **emailed to Admin** and logged in the `audit_logs` table

---

## 14. Rollback Procedures

### 14A. Rollback a Bad Frontend Deployment (Vercel)

Vercel keeps every deployment as an immutable snapshot. Rolling back is instant:

1. Go to **Vercel Dashboard** → Your Project → **"Deployments"** tab
2. Find the **last known good deployment** (look at timestamps)
3. Click the **"⋮"** menu on that deployment → **"Promote to Production"**
4. Done — rollback is instant (< 10 seconds), zero downtime

### 14B. Rollback a Bad Backend Deployment (Render)

Option 1 — **Revert the Git commit:**
```bash
# Find the last good commit
git log --oneline -10

# Revert the bad commit
git revert HEAD
git push origin main

# Render will auto-deploy the reverted code
```

Option 2 — **Manual rollback in Render:**
1. Go to **Render Dashboard** → Your Service → **"Events"** tab
2. Find the previous successful deploy
3. Click **"Rollback"** (if available) or redeploy from a specific commit

### 14C. Rollback a Bad Database Migration

```bash
# Undo the last migration
npx sequelize-cli db:migrate:undo --env production

# Undo a specific migration
npx sequelize-cli db:migrate:undo --name 20260801000001-add-new-column.js --env production

# Undo ALL migrations (⚠️ DANGER — drops all tables!)
# npx sequelize-cli db:migrate:undo:all --env production
# ☝️ NEVER run this in production unless rebuilding from scratch
```

### 14D. Rollback Environment Variable Changes

1. **Document all env var changes** before making them (screenshot or note the old values)
2. If a bad env var causes issues:
   - Go to Render/Vercel Dashboard → Environment Variables
   - Change the value back to the previous one
   - Redeploy (Render auto-redeploys; Vercel needs manual trigger)

---

## 15. Scaling Guide — Free Tier to Paid

### 15A. When to Upgrade

| Signal | What It Means | Action |
|--------|--------------|--------|
| Render cold starts are annoying users | 30-second delay after 15 min inactivity | Upgrade Render to **Starter ($7/month)** |
| Railway credits running out mid-month | Database is heavily used | Upgrade Railway to **Pro ($20/month)** |
| Cloudinary approaching 25GB storage | Many file uploads | Upgrade Cloudinary to **Plus ($89/month)** |
| WhatsApp 1,000 free conversations exhausted | High citizen engagement | Budget ₹0.30–0.50 per additional conversation |
| Vercel bandwidth approaching 100GB | High traffic | Upgrade Vercel to **Pro ($20/month)** |
| API response times > 2 seconds | Database queries are slow | Add database indexes, optimize queries |
| 50+ concurrent users | High office activity | Consider dedicated VPS or cloud hosting |

### 15B. Upgrade Priority Order

Upgrade in this order based on impact:

```
Priority 1 (Most Impact):
  └── Render → Starter ($7/month)
      • Eliminates cold starts (always-on)
      • Bigger: 512MB RAM → 1GB RAM

Priority 2 (When Needed):
  └── Railway → Pro ($20/month)
      • More DB resources (2GB RAM, 10GB storage)
      • Better performance for complex queries

Priority 3 (When Limits Hit):
  └── Cloudinary → Plus ($89/month)
      • 75GB storage, 75GB bandwidth
      • Video support, advanced transformations

Priority 4 (At Scale):
  └── Vercel → Pro ($20/month)
      • 1TB bandwidth, team collaboration
      • Performance analytics
```

### 15C. Cost Estimates

| Stage | Monthly Cost (₹) | When |
|-------|:-----------------:|------|
| **Startup (Free Tier)** | ₹0 | Day 1 — first 2–3 months |
| **Growth (Essential Upgrades)** | ₹600–2,000 | When free limits are hit |
| **Production (Reliable)** | ₹3,500–5,000 | For a busy MLA office |
| **Scale (Multiple Offices)** | ₹8,000–15,000 | Managing 3–5 MLA instances |

### 15D. Future Architecture Upgrade Path

When the system outgrows free tier platforms:

```
Current (Free Tier):           Future (Production):
  Vercel + Render + Railway  →   AWS / DigitalOcean / Azure
  
  Vercel (Frontend)          →   AWS S3 + CloudFront (CDN)
  Render (Backend)           →   AWS EC2 / ECS / DigitalOcean Droplet
  Railway (MySQL)            →   AWS RDS / DigitalOcean Managed MySQL
  Cloudinary (Files)         →   AWS S3 (with CloudFront) or keep Cloudinary
```

---

## 16. New MLA Onboarding Checklist

> 🎯 **Complete workflow to set up a fresh MLA E-Office instance for a new MLA client — from domain purchase to first login.**

### Phase 1: Client Information Gathering (Day 1)

- [ ] **MLA Details:**
  - [ ] Full name (English + Marathi)
  - [ ] Constituency name and number
  - [ ] Party name and logo (high-res PNG)
  - [ ] MLA's official photo (high-res)
  - [ ] Office address
  - [ ] Office phone number(s)
  - [ ] Preferred domain name (e.g., `eoffice.rajeshpawar.in`)

- [ ] **Constituency Type:**
  - [ ] Rural or Urban (determines geography data: villages vs wards)
  - [ ] Number of talukas
  - [ ] Number of villages / wards
  - [ ] Number of polling booths

- [ ] **Staff Information:**
  - [ ] PA name, phone, email
  - [ ] Front Desk Clerk details
  - [ ] Field Auditor details (if any)
  - [ ] How many total staff users?

- [ ] **WhatsApp Setup:**
  - [ ] Dedicated phone number for WhatsApp Business
  - [ ] Meta Business Account (or need to create?)

### Phase 2: Infrastructure Setup (Day 1–2)

- [ ] **Domain:**
  - [ ] Purchase domain (`eoffice.mlaname.in`)
  - [ ] Set up DNS records (Vercel + Render CNAME records)

- [ ] **Platforms:**
  - [ ] Railway — Create MySQL database (follow Step 1)
  - [ ] Cloudinary — Create account + upload preset + folders (follow Step 2)
  - [ ] Render — Deploy backend API + set env vars (follow Step 4)
  - [ ] Vercel — Deploy frontend + set env vars (follow Step 5)

- [ ] **API Keys:**
  - [ ] Generate Gemini API key (follow Step 3A)
  - [ ] Generate Gmail App Password (follow Step 3B)
  - [ ] Generate JWT_SECRET and WHATSAPP_VERIFY_TOKEN (follow Step 3C)

### Phase 3: Data Setup (Day 2–3)

- [ ] **Database:**
  - [ ] Run all Sequelize migrations (follow Step 6A)
  - [ ] Seed master data — departments, categories (follow Step 6B)
  - [ ] Seed constituency-specific geography data (talukas, villages/wards, booths)
  - [ ] Create admin user (follow Step 6C)

- [ ] **Branding:**
  - [ ] Upload MLA photo to Cloudinary `/branding/`
  - [ ] Upload party logo to Cloudinary `/branding/`
  - [ ] Configure MLA branding env vars (`MLA_NAME`, `MLA_CONSTITUENCY`, etc.)

- [ ] **User Accounts:**
  - [ ] Login as admin → Create MLA user account
  - [ ] Create PA user account
  - [ ] Create Front Desk Clerk account
  - [ ] Create Field Auditor account (if applicable)
  - [ ] Create Booth Pramukh accounts (bulk import via CSV)

### Phase 4: WhatsApp & Integrations (Day 3–4)

- [ ] **WhatsApp Business:**
  - [ ] Set up Meta Business Account (follow Step 8A–8B)
  - [ ] Get API credentials (follow Step 8C–8D)
  - [ ] Submit message templates for approval (follow Step 8E)
  - [ ] Configure webhook (follow Step 8F)
  - [ ] Update Render env vars with WhatsApp credentials (follow Step 8G)
  - [ ] Send test message (follow Step 8H)

- [ ] **Custom Domain:**
  - [ ] Verify DNS propagation
  - [ ] Add custom domain in Vercel (follow Step 7C)
  - [ ] Add custom domain in Render (follow Step 7D)
  - [ ] Update env vars with custom domain URLs (follow Step 7E)
  - [ ] Verify SSL certificates are active

### Phase 5: Testing & Verification (Day 4–5)

- [ ] Run full end-to-end smoke test (follow Step 9B)
- [ ] Run security verification (follow Step 9C)
- [ ] Set up UptimeRobot monitoring (follow Step 10A)
- [ ] Verify automated backups are working
- [ ] Test WhatsApp message delivery
- [ ] Test AI letter drafting (Marathi + English)
- [ ] Test file upload (PDF + image)
- [ ] Test bilingual toggle (English ↔ Marathi)
- [ ] Test on mobile browser

### Phase 6: Training & Handover (Day 5–7)

- [ ] **Training Sessions:**
  - [ ] Admin training (user management, system settings, backup access)
  - [ ] MLA training (dashboard overview, reports)
  - [ ] PA training (all modules — nivedan, inward/outward, devworks, AI drafting)
  - [ ] Front Desk training (visitor book, nivedan registration, scanning)
  - [ ] Field Auditor training (devworks, photo upload, booth verification)

- [ ] **Documentation Handover:**
  - [ ] Provide this deployment guide (printed + digital)
  - [ ] Provide admin login credentials (sealed envelope + digital via encrypted channel)
  - [ ] Provide emergency contact information
  - [ ] Provide the quick reference card (Section 18)

- [ ] **Go-Live Sign-Off:**
  - [ ] MLA / PA confirms all features are working
  - [ ] Admin confirms monitoring and alerts are set up
  - [ ] Support contact established for first 30 days

---

## 17. Troubleshooting

### Common Issues & Solutions

#### 🔴 Backend won't start on Render

| Symptom | Cause | Solution |
|---------|-------|----------|
| `🚨 ENVIRONMENT VALIDATION FAILED` | Missing required env vars | Check Render logs for exact missing variable name. Add it in Environment settings. |
| `SequelizeConnectionRefusedError` | Can't connect to Railway MySQL | Verify `DB_HOST`, `DB_PORT`, `DB_PASSWORD` in Render env vars. Check Railway is running. |
| `JWT_SECRET must be at least 32 characters` | Weak JWT secret | Generate a new 64-character secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| Build fails: `npm ERR! code ELIFECYCLE` | Dependency issue | Check `package.json` for incompatible versions. Run `npm install` locally first to catch errors. |

#### 🔴 Frontend shows blank page / API errors

| Symptom | Cause | Solution |
|---------|-------|----------|
| Blank white page | Build error or missing env vars | Check Vercel build logs. Ensure `VITE_API_BASE_URL` is set correctly. |
| `Network Error` in console | CORS blocking API calls | Verify `FRONTEND_URL` on Render matches your Vercel domain exactly (including `https://`). |
| 404 on page refresh | SPA routing not configured | Add `vercel.json` with rewrite rule (see Step 5D). |
| API calls going to `localhost` | Wrong `VITE_API_BASE_URL` | Update to production Render URL. **Must start with `VITE_`** for Vite to include it. |

#### 🔴 Database issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| `ER_ACCESS_DENIED_ERROR` | Wrong DB credentials | Double-check Railway credentials. Reset password in Railway if needed. |
| `ER_BAD_DB_ERROR` | Database doesn't exist | Create the database manually (see Step 1C). |
| Migration fails midway | Table already partially exists | Run `npx sequelize-cli db:migrate:undo` then retry. |
| `ER_NOT_SUPPORTED_AUTH_MODE` | MySQL auth plugin issue | Railway uses `mysql_native_password` by default. Ensure `mysql2` package is installed. |

#### 🔴 WhatsApp issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| `Error 190: Invalid OAuth access token` | Token expired or wrong | Regenerate permanent token (Step 8D). |
| `Error 131030: Template not found` | Template not approved | Check template status in WhatsApp Manager. Wait for approval. |
| Webhook not receiving messages | Wrong callback URL or verify token | Verify the URL matches exactly. Test with Meta's webhook test tool. |
| Messages sent but not delivered | Phone number not registered on WhatsApp | WhatsApp can only reach numbers with WhatsApp installed. Fallback to SMS. |

#### 🟡 Performance issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| First request takes 30+ seconds | Render free tier cold start | Upgrade to Render Starter ($7/month) for always-on. Or use a keep-alive ping. |
| Dashboard loads slowly | Unindexed database queries | Add indexes to frequently queried columns (status, created_at, category_id). |
| File uploads timing out | Large files (>5MB) on slow connection | Reduce `FILE_MAX_SIZE_MB` or use Cloudinary direct upload for large files. |

### Keep-Alive Hack (Prevent Render Cold Starts)

If you can't upgrade to paid, use this free workaround:

1. Go to https://uptimerobot.com
2. Add an **HTTP monitor** for `https://api.eoffice.mlaname.in/api/v1/health`
3. Set check interval to **every 5 minutes**
4. This pings your backend regularly, preventing it from sleeping

> ⚠️ This uses your Render free hours faster. 750 hours/month ÷ 24 hours = 31 days, so it works for a single service.

---

## 18. Quick Reference Card

> 📋 **Print this page and keep it at the IT desk for quick access.**

### Service URLs

| Service | URL | Dashboard |
|---------|-----|-----------|
| **Frontend** | `https://eoffice.mlaname.in` | https://vercel.com/dashboard |
| **Backend API** | `https://api.eoffice.mlaname.in` | https://render.com/dashboard |
| **Database** | *(internal — no public URL)* | https://railway.app/dashboard |
| **File Storage** | *(CDN URLs)* | https://cloudinary.com/console |
| **Uptime Monitor** | — | https://uptimerobot.com/dashboard |

### Emergency Procedures

| Emergency | Steps |
|-----------|-------|
| **Site is down** | 1. Check UptimeRobot → identify which service is down. 2. Check Render/Vercel/Railway dashboard for errors. 3. Check Render logs. 4. Restart service if needed. |
| **Database data lost** | 1. Don't panic. 2. Suspend Render backend. 3. Restore from latest backup (Section 13C). 4. Resume backend. |
| **Bad deployment** | 1. Rollback frontend in Vercel (instant — Section 14A). 2. Revert Git commit for backend (Section 14B). |
| **Security breach suspected** | 1. Rotate ALL secrets immediately (Section below). 2. Check audit logs. 3. Disable compromised user accounts. |
| **WhatsApp not working** | 1. Check Meta Business Status page. 2. Verify access token hasn't expired. 3. Check Render logs for WhatsApp errors. |

### Secret Rotation Quick Commands

```bash
# Rotate JWT_SECRET (invalidates all user sessions — users must re-login)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# → Copy output → Update in Render env vars → Render auto-redeploys

# Rotate WHATSAPP_VERIFY_TOKEN
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# → Copy output → Update in Render env vars AND in Meta webhook config

# Rotate DB_PASSWORD
# 1. Change in Railway dashboard first
# 2. Then update DB_PASSWORD in Render env vars
# 3. Render auto-redeploys with new password
```

### Important Contacts

| Role | Contact | Purpose |
|------|---------|---------|
| **System Admin** | *(fill in)* | Technical issues, server management |
| **Railway Support** | https://railway.app/help | Database hosting issues |
| **Render Support** | https://render.com/support | Backend hosting issues |
| **Vercel Support** | https://vercel.com/support | Frontend hosting issues |
| **Meta Business Help** | https://business.facebook.com/help | WhatsApp API issues |

---

> **Document Version:** 1.0
> **Last Updated:** August 2026
> **Author:** MLA E-Office Development Team
>
> *This document is part of the MLA E-Office reference documentation.*
> *For architecture details, see [ARCHITECTURE.md](file:///s:/MLA%20E%20-%20Office/ARCHITECTURE.md). For environment variables, see [ENV_CONFIG.md](file:///s:/MLA%20E%20-%20Office/ENV_CONFIG.md).*
