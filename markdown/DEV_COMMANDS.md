# MLA E-Office — Developer Commands Quick Reference

> **All the terminal commands you need in one place.**
>
> Keep this open in a tab while building. Two terminals needed: one for `api/`, one for `web/`.

---

## Terminal Setup

> Open **2 terminals** side by side in VS Code (`Ctrl+Shift+5` to split):
> - **Terminal 1** → always `cd api` (backend)
> - **Terminal 2** → always `cd web` (frontend)

---

## 🚀 Start Development

```bash
# Terminal 1 — Backend (api/)
cd api
npm run dev
# → Server runs at http://localhost:5000
# → API base: http://localhost:5000/api/v1

# Terminal 2 — Frontend (web/)
cd web
npm run dev
# → App runs at http://localhost:5173
```

---

## 📦 Install Packages

```bash
# Backend packages
cd api
npm install express-validator          # form validation
npm install multer                     # file upload handling
npm install cloudinary                 # file storage
npm install nodemailer                 # email sending
npm install node-cron                  # cron jobs (WhatsApp scheduler)
npm install winston                    # logging
npm install express-rate-limit         # rate limiting
npm install helmet                     # security headers
npm install cors                       # CORS

# Frontend packages
cd web
npm install axios                      # HTTP client
npm install zustand                    # state management
npm install react-router-dom           # routing
npm install react-hook-form            # form handling
npm install @hookform/resolvers zod    # form validation
npm install recharts                   # charts (reports page)
npm install react-hot-toast            # toast notifications
npm install lucide-react               # icons
npm install date-fns                   # date formatting
npm install xlsx                       # Excel import (karyakarta)
```

---

## 🗄️ Database Commands (Sequelize)

```bash
# All Sequelize commands run from: api/

# Run all pending migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo ALL migrations (wipe schema — careful!)
npx sequelize-cli db:migrate:undo:all

# Run all seeders (master data)
npx sequelize-cli db:seed:all

# Run a specific seeder
npx sequelize-cli db:seed --seed 20260101-seed-departments.js

# Undo all seeders
npx sequelize-cli db:seed:undo:all

# Create a new migration file
npx sequelize-cli migration:generate --name add-column-to-users

# Create a new seeder file
npx sequelize-cli seed:generate --name seed-categories
```

---

## 🧪 Test APIs (curl examples)

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"pa_meena","password":"Pa@2026#Kolhapur"}'

# Get current user (replace TOKEN)
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer TOKEN_HERE"

# Create inward entry (replace TOKEN)
curl -X POST http://localhost:5000/api/v1/inward \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"sender_name":"District Collector","subject":"Test letter","priority":"MEDIUM"}'

# Get nivedans (all, paginated)
curl http://localhost:5000/api/v1/nivedans?page=1&limit=10 \
  -H "Authorization: Bearer TOKEN_HERE"

# Get nivedan by tracking ID
curl http://localhost:5000/api/v1/nivedans/track/NIV-2026-00001 \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

## 🌱 Load Sample Data (after migrations)

```bash
# Run from project root (s:\MLA E - Office\)

# Option A: MySQL CLI (if installed)
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/01_users.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/02_inward_entries.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/03_nivedans.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/04_nivedan_timeline.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/05_development_works.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/06_visitors.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/07_karyakartas.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/08_calendar_events.sql

# Option B: MySQL Workbench
# Open each .sql file → Run All (lightning bolt icon)

# Option C: TablePlus / DBeaver
# Drag .sql file into query window → Execute
```

---

## 🔧 Git Commands

```bash
# Check what changed
git status

# Stage all changes
git add .

# Commit with message
git commit -m "Add nivedan create API with auto-routing"

# Push to GitHub
git push origin main

# Create a new branch for a module
git checkout -b feature/inward-module

# Merge branch back to main
git checkout main
git merge feature/inward-module

# See recent commits
git log --oneline -10

# Discard all local changes (CAREFUL — can't undo!)
git checkout .
```

---

## 🏗️ Build for Production

```bash
# Build frontend (creates web/dist/)
cd web
npm run build

# Preview the production build locally
npm run preview

# Start backend in production mode
cd api
NODE_ENV=production npm start
```

---

## 🚀 Deploy Commands

```bash
# Deploy frontend to Vercel
cd web
npx vercel --prod

# Run migrations on Railway (production)
# Set DATABASE_URL to Railway connection string first
cd api
DATABASE_URL="mysql://user:pass@host:port/dbname" npx sequelize-cli db:migrate

# Check Render logs (backend)
# → Go to Render Dashboard → your service → Logs tab

# Check Railway DB (production)
# → Go to Railway Dashboard → MySQL service → Connect → open MySQL shell
```

---

## 🐛 Debug Tricks

```bash
# See what's running on port 5000
netstat -ano | findstr :5000

# Kill process on port 5000 (replace PID)
taskkill /PID <PID> /F

# Test if MySQL is running
mysql -u root -p -e "SHOW DATABASES;"

# Check env vars are loaded (add to server.js temporarily)
console.log(process.env.DB_NAME)

# See all Sequelize SQL queries (add to sequelize config)
logging: console.log

# Clear React app cache
cd web
rm -rf node_modules/.vite
npm run dev
```

---

## 📁 Key File Paths (Quick Reference)

```
s:\MLA E - Office\
├── api/
│   ├── .env                    ← Backend env vars (never commit!)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js     ← Sequelize connection
│   │   │   └── env.config.js   ← Joi env validator
│   │   ├── middleware/
│   │   │   ├── auth.js         ← JWT middleware
│   │   │   └── role.js         ← RBAC middleware
│   │   ├── models/             ← Sequelize models
│   │   ├── controllers/        ← Route handlers
│   │   ├── routes/             ← Express routes
│   │   └── services/           ← Business logic (WhatsApp, Cloudinary)
│   └── migrations/             ← DB migrations
│
├── web/
│   ├── .env                    ← Frontend env vars (VITE_ prefix)
│   ├── src/
│   │   ├── store/              ← Zustand stores
│   │   ├── pages/              ← Page components
│   │   ├── components/         ← Reusable UI components
│   │   ├── api/                ← API call functions
│   │   └── hooks/              ← Custom React hooks
│   └── public/
│
└── SAMPLE_DATA/                ← SQL seed files
```

---

## 🔑 Test User Credentials

| Username | Password | Role |
|----------|----------|------|
| `pa_meena` | `Pa@2026#Kolhapur` | PA — **use this most** |
| `mla_suresh` | `Mla@2026#Kolhapur` | MLA |
| `clerk_ramesh` | `Clerk@2026#Kolhapur` | Receptionist |
| `auditor_priya` | `Audit@2026#Kolhapur` | Auditor |
| `admin` | `Admin@MLA2026` | Admin |

> 🔴 Dev passwords only — change before staging/production!

---

## ⚡ Env Vars Quick Check

```bash
# Minimum required to start (api/.env)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mla_eoffice_dev
DB_USER=root
DB_PASSWORD=yourpassword
PORT=5000
JWT_ACCESS_SECRET=any-long-random-string-here
JWT_REFRESH_SECRET=another-long-random-string-here
NODE_ENV=development

# Minimum required to start (web/.env)
VITE_API_URL=http://localhost:5000/api/v1
```

---
