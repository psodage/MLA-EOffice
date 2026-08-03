# MLA E-Office — Build Order Guide

> **Your step-by-step roadmap for building the system with AI.**
>
> Follow this order strictly — each module depends on the previous one. For each module, the guide tells you: what to build, which reference files to share with the AI, and a ready-made prompt to start the session.

---

## How to Use This File

1. Open this file + `MODULE_TRACKER.md` side by side in your editor
2. Find the current module you're working on
3. Copy the **Prompt to Start** and paste it at the start of your chat with the AI
4. Build → Test → Update `MODULE_TRACKER.md` → move to next module

---

## Phase 1 — Foundation (Build First, Everything Depends On This)

---

### 🔧 Module 1 — Project Setup & Folder Structure

**What to build:**
- Initialize Vite + React frontend (`web/`)
- Initialize Express backend (`api/`)
- Set up `.env` files for both
- Connect MySQL via Sequelize
- Verify both servers run without errors

**Reference files to share:**
- `TECH_STACK.md`
- `ARCHITECTURE.md`
- `ENV_CONFIG.md`

**Prompt to start:**
```
I'm building the MLA E-Office system. Let's set up the project from scratch.

Tech stack:
- Frontend: React 18 + Vite (folder: web/)
- Backend: Node.js + Express (folder: api/)
- Database: MySQL 8 + Sequelize ORM
- Auth: JWT (access + refresh tokens)

Please:
1. Create the folder structure for both api/ and web/
2. Initialize package.json for both
3. Set up basic Express server with health check endpoint (GET /api/v1/health)
4. Set up Sequelize with MySQL connection
5. Set up Vite + React with React Router v6

Key env vars I'll configure:
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
- PORT=5000 (api), VITE_API_URL (web)

Start with the folder structure and package.json files.
```

---

### 🔧 Module 2 — Database: Migrations & Master Data Seed

**What to build:**
- Sequelize migrations for all 22 tables (in correct FK order)
- Master data seeders: departments, categories, geography stubs
- Verify `npx sequelize-cli db:migrate` runs clean

**Reference files to share:**
- `DATA_MODELS.md`
- `MASTER_DATA.md`
- `GEOGRAPHY_RURAL.md`
- `GEOGRAPHY_URBAN.md`

**Prompt to start:**
```
Let's create Sequelize migrations for the MLA E-Office database.

I'll share DATA_MODELS.md — it has all 22 table schemas with exact column types, defaults, and indexes.

Migration order (FK dependencies):
1. departments
2. categories
3. talukas → gram_panchayats → villages → wards → booths
4. users
5. karyakartas
6. inward_entries, outward_entries
7. nivedans, nivedan_timeline
8. visitors
9. development_works, dev_work_photos
10. calendar_events
11. whatsapp_logs, notifications, audit_logs, booth_verifications

After migrations, create seeders for:
- 20 departments (from MASTER_DATA.md Section 2)
- 14 categories + sub-categories (from MASTER_DATA.md Section 1)
- Sample geography (2 talukas, 4 GPs, 8 villages, 20 booths)

Start with the first 5 migration files.
```

---

### 🔧 Module 3 — Authentication (Login / Logout / Token Refresh)

**What to build:**
- `POST /api/v1/auth/login` — returns access + refresh token
- `POST /api/v1/auth/refresh` — refresh token rotation
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me` — current user profile
- JWT middleware (`authMiddleware.js`)
- RBAC middleware (`roleMiddleware.js`)
- Login page UI (React)
- Token storage + auto-refresh in frontend

**Reference files to share:**
- `AUTH_SPEC.md`
- `USER_ROLES.md`
- `ERROR_MESSAGES.md`

**Prompt to start:**
```
Let's build the authentication system for MLA E-Office.

From AUTH_SPEC.md:
- JWT HS256, access token: 15 min, refresh token: 7 days
- Refresh token rotation (new refresh token on each refresh)
- Tokens stored: access in memory (Zustand), refresh in httpOnly cookie
- bcrypt (12 rounds) for passwords
- Rate limiting: 5 failed logins → 15 min lockout

Roles: MLA, PA, RECEPTIONIST, AUDITOR, BOOTH_PRAMUKH, CITIZEN, ADMIN
Each role has different accessible_modules (stored as JSON in users table)

Build:
1. authController.js (login, logout, refresh, me)
2. authMiddleware.js (verify JWT, attach user to req)
3. roleMiddleware.js (check role permissions)
4. Login page in React (Marathi UI, clean form)
5. useAuthStore.js (Zustand store for auth state)
6. axiosInstance.js (with auto token refresh interceptor)
```

---

## Phase 2 — Core Modules

---

### 📋 Module 4 — Dashboard

**What to build:**
- Summary stats cards (pending nivedans, today's visitors, active devworks)
- Recent activity feed
- Quick action buttons
- Role-aware layout (different cards per role)

**Reference files to share:**
- `USER_ROLES.md` (dashboard permissions per role)
- `API_SPEC.md` (dashboard API endpoints)

**Prompt to start:**
```
Let's build the Dashboard for MLA E-Office.

The dashboard shows different widgets depending on the user's role:
- MLA: Total nivedans by status, devworks progress, karyakarta count
- PA: Pending nivedans count, overdue (escalated) nivedans, today's visitors, inward pending
- RECEPTIONIST: Today's visitor count, pending nivedans to register
- AUDITOR: Devworks by status, booth verification stats

Build:
1. GET /api/v1/dashboard/summary — returns stats for logged-in user's role
2. Dashboard page (React) with stat cards, recent activity list
3. Role-aware rendering using the user's role from auth store
4. Bilingual labels (Marathi primary, English secondary)
5. Nice design — use card components with icons and count badges
```

---

### 📋 Module 5 — Inward Register (आवक नोंदवही)

**What to build:**
- List view with filters (status, date range, priority, department)
- Create inward entry form
- View/Edit inward entry
- Assign to PA
- Status update (PENDING → ASSIGNED → IN_PROGRESS → COMPLETED)
- Search by sender name / subject

**Reference files to share:**
- `DATA_MODELS.md` (Table 2: inward_entries)
- `BUSINESS_RULES.md` (Section 3 — Inward rules)
- `API_SPEC.md`

**Prompt to start:**
```
Let's build the Inward Register module for MLA E-Office.

Schema (from DATA_MODELS.md Table 2 — inward_entries):
- inward_number: auto-generated INW/YYYY/NNNN
- sender_name, sender_designation, sender_department_id
- subject, description, tags (JSON array), priority (HIGH/MEDIUM/LOW)
- attachment_urls (JSON — Cloudinary URLs)
- assigned_to_user_id, status (PENDING/ASSIGNED/IN_PROGRESS/COMPLETED/CANCELLED)
- created_by

Build:
1. GET /api/v1/inward — list with filters + pagination (20 per page)
2. POST /api/v1/inward — create new entry (auto-generate inward_number)
3. GET /api/v1/inward/:id — single entry
4. PATCH /api/v1/inward/:id — update status / assign
5. Inward list page with filter bar + table
6. Create/Edit form with department dropdown and file upload
7. Status badge component (color-coded)
```

---

### 📋 Module 6 — Outward Register (जावक नोंदवही)

**What to build:**
- Create outward letter (link to inward if reply)
- AI draft button (Gemini integration)
- PDF generation
- Approve & send flow

**Reference files to share:**
- `DATA_MODELS.md` (Table 3: outward_entries)
- `AI_LETTER_DRAFTING.md`
- `LETTER_TEMPLATES/LETTER_TEMPLATES.md`

**Prompt to start:**
```
Let's build the Outward Register module for MLA E-Office.

Schema: outward_entries table — outward_number (OUT/YYYY/NNNN), recipient details,
subject, body_text, reference_inward_id (optional), is_ai_drafted, approved_by.

Key feature: AI Letter Drafting using Google Gemini API
- PA clicks "AI ड्राफ्ट करा" button
- System sends: subject + department + context to Gemini
- Gemini returns a formal Marathi government letter draft
- PA can edit the draft then approve

Build:
1. POST /api/v1/outward — create outward entry
2. POST /api/v1/outward/ai-draft — call Gemini, return draft text
3. PATCH /api/v1/outward/:id/approve — mark as approved
4. Outward list page + Create form
5. Rich text editor for body_text (basic formatting)
6. "AI ड्राफ्ट करा" button with loading state
7. Link to related inward entry (reference_inward_id dropdown)
```

---

### 📋 Module 7 — Nivedan (Citizen Complaints) — निवेदन

> **Most complex module. Plan 2–3 sessions for this.**

**What to build:**
- Register nivedan (from walk-in or phone)
- Auto-routing by category → suggest department
- Status machine (8 statuses per business rules)
- Timeline view (activity history)
- Escalation alerts
- WhatsApp notification on status change
- Public tracking link (by mobile number)

**Reference files to share:**
- `DATA_MODELS.md` (Tables 4, 5: nivedans, nivedan_timeline)
- `BUSINESS_RULES.md` (Section 2 — Nivedan rules)
- `AUTO_ROUTING_RULES.md`
- `ERROR_MESSAGES.md`

**Prompt to start (Session A — Backend):**
```
Let's build the Nivedan module backend for MLA E-Office. This is the most critical module.

Key rules (from BUSINESS_RULES.md):
- Tracking ID format: NIV-YYYY-NNNNN (resets each year)
- Status machine: PENDING → IN_PROGRESS → FORWARDED → AWAITING_RESPONSE → RESOLVED → ARCHIVED
  (also REJECTED, CANCELLED from any state; ARCHIVED is final)
- Every status change must create a nivedan_timeline entry
- Auto-routing: category.default_department_id suggests which dept to forward to
- Escalation: auto-escalate after category.escalation_days if still not resolved
- WhatsApp notification on: creation (ACK), status change, resolution

Build:
1. POST /api/v1/nivedans — create (auto-generate tracking ID, auto-route)
2. GET /api/v1/nivedans — list with filters (status, category, priority, village, date)
3. GET /api/v1/nivedans/:id — full detail + timeline
4. PATCH /api/v1/nivedans/:id/status — status transition (validate state machine)
5. POST /api/v1/nivedans/:id/timeline — add internal note
6. GET /api/v1/nivedans/track/:mobile — public tracking by mobile
7. Nivedan model + NivedanTimeline model (Sequelize)
```

**Prompt to start (Session B — Frontend):**
```
Let's build the Nivedan module frontend for MLA E-Office (backend APIs are ready).

Build:
1. Nivedan list page — table with status filter tabs (All / Pending / In Progress / Escalated / Resolved)
2. Register Nivedan form — citizen details, cascading location (Taluka→GP→Village), category dropdown with auto-department suggestion
3. Nivedan detail page — header info + status badge + action buttons (Assign / Forward / Resolve / Reject) + timeline log
4. Timeline component — vertical timeline with action icons, timestamps, internal/public note badges
5. Status update modal — select new status + optional note + WhatsApp notification toggle
6. Public tracking page — citizen enters mobile number → sees their nivedans list (no login)
```

---

### 📋 Module 8 — Visitor Book (भेटणाऱ्यांची नोंद)

**What to build:**
- Quick check-in form (name, mobile, purpose)
- Auto-detect repeat visitors by mobile
- Check-out time
- Link visitor to nivedan if purpose = GRIEVANCE
- Daily visitor log view

**Reference files to share:**
- `DATA_MODELS.md` (Table 6: visitors)
- `BUSINESS_RULES.md` (Section 5 — Visitor rules)

**Prompt to start:**
```
Let's build the Visitor Book module for MLA E-Office.

Schema: visitors table — visitor_name, mobile, address, village_id/ward_id,
purpose (ENUM: GRIEVANCE/COURTESY_CALL/PARTY_WORK/INVITATION/PERSONAL_MEETING/
DOCUMENT_SUBMISSION/FOLLOWUP/RECOMMENDATION/GENERAL_INQUIRY/OTHER),
purpose_description, check_in_time (auto), check_out_time (manual),
is_repeat_visitor (auto by mobile lookup), previous_visit_count (auto),
linked_nivedan_id (optional).

Build:
1. POST /api/v1/visitors/checkin — check in (auto-detect repeat visitor)
2. PATCH /api/v1/visitors/:id/checkout — record departure time
3. GET /api/v1/visitors — list with date filter (default: today)
4. Quick check-in form (2-step: search mobile → fill details if new)
5. Repeat visitor badge + visit history count
6. "Convert to Nivedan" button (purpose = GRIEVANCE)
7. Today's visitor count widget for dashboard
```

---

### 📋 Module 9 — Development Works (विकासकामे)

**What to build:**
- Project list with status filter
- Add/Edit project with GPS coordinates
- Progress percentage slider
- Before/During/After photo upload (Cloudinary)
- Budget tracker (allocated vs spent)

**Reference files to share:**
- `DATA_MODELS.md` (Tables 7, 8: development_works, dev_work_photos)
- `BUSINESS_RULES.md` (Section 6 — DevWorks rules)

**Prompt to start:**
```
Let's build the Development Works module for MLA E-Office.

Schema: development_works — project_name, category (ROAD/DRAINAGE/WATER_PIPELINE/
HOSPITAL/SCHOOL/COMMUNITY_HALL/STREET_LIGHT/BRIDGE/ELECTRIFICATION/GARDEN_PARK/
TOILET/CREMATORIUM/OTHER), location, village_id/ward_id, geo_latitude, geo_longitude,
funding_source (MLALAD/ZP_FUND/STATE_GRANT/CENTRAL_GRANT/MUNICIPAL_FUND/GP_FUND/MPLAD/CSR/OTHER_MIXED),
budget_allocated, budget_spent, contractor_name/contact, start_date, expected_completion_date,
actual_completion_date, status (SANCTIONED/IN_PROGRESS/COMPLETED/DELAYED/CANCELLED),
progress_percentage (0-100).

dev_work_photos — photo_url (Cloudinary), photo_stage (BEFORE/DURING/AFTER), geo_lat/lng, caption.

Build:
1. CRUD APIs for development_works
2. POST /api/v1/devworks/:id/photos — upload photos (Cloudinary, max 10 per stage)
3. Project list with category + status filter + funding source filter
4. Add project form with map picker for GPS (simple lat/lng input is fine)
5. Project detail page with progress bar + photo gallery (Before/During/After tabs)
6. Budget progress bar (spent vs allocated)
```

---

## Phase 3 — Supporting Modules

---

### 👥 Module 10 — Karyakarta Directory (कार्यकर्ता संचिका)

**Reference files to share:**
- `KARYAKARTA_SEED_DATA.md`
- `DATA_MODELS.md` (Table 9: karyakartas)

**Prompt to start:**
```
Let's build the Karyakarta Directory module for MLA E-Office.

Key features:
1. Search + filter by taluka / village / booth / designation
2. Add single karyakarta form
3. Bulk Excel import (POST /api/v1/karyakartas/import — xlsx file upload)
4. Birthday coming up (next 7 days) widget
5. Booth-level view — list all karyakartas per booth with booth pramukh highlighted

From KARYAKARTA_SEED_DATA.md:
- Import validates: mobile (10 digits, unique), booth_number (must exist), designation enum
- Invalid rows are skipped, valid rows committed — return {totalRows, imported, skipped, errors}

Build backend first: CRUD + import endpoint. Then build list + filter UI.
```

---

### 📅 Module 11 — Calendar & Schedule (दिनदर्शिका)

**Reference files to share:**
- `DATA_MODELS.md` (Table 10: calendar_events)
- `GREETING_CALENDAR.md`

**Prompt to start:**
```
Let's build the Calendar module for MLA E-Office.

Schema: calendar_events — title, description, event_type (MEETING/PUBLIC_PROGRAM/
GOVT_DEADLINE/ASSEMBLY_SESSION/CONSTITUENCY_VISIT/PERSONAL),
event_date, start_time, end_time, location, attendees (JSON array of user IDs),
is_recurring, recurrence_rule, reminder_minutes, is_cancelled.

Build:
1. CRUD APIs for calendar events
2. Month view calendar (React — use a simple calendar library)
3. Add event modal with event type selector
4. Today's events list on dashboard
5. Upcoming events widget (next 7 days)
6. Event type color-coding (GOVT_DEADLINE = red, MEETING = blue, etc.)
```

---

### 📱 Module 12 — WhatsApp Integration

**Reference files to share:**
- `WHATSAPP_TEMPLATES.md`
- `GREETING_CALENDAR.md`
- `ENV_CONFIG.md` (WhatsApp env vars section)

**Prompt to start:**
```
Let's build the WhatsApp integration for MLA E-Office.

Uses: Meta Cloud API (WhatsApp Business API)
Env vars: WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_WEBHOOK_VERIFY_TOKEN

Key features:
1. Send template messages: nivedan_ack, nivedan_update, nivedan_resolved, birthday, festival
2. Webhook handler: POST /api/v1/whatsapp/webhook — receive status updates (delivered/read/failed)
3. WhatsApp log every message in whatsapp_logs table
4. Festival greeting cron job (daily at midnight — check greeting_calendar, queue greetings)
5. Birthday greeting cron job (daily at 8am — check karyakartas.date_of_birth)
6. Retry logic: if FAILED, retry up to 3 times with 1hr delay

Approved Marathi templates are in WHATSAPP_TEMPLATES.md.
```

---

### 📊 Module 13 — Reports & Analytics

**Prompt to start:**
```
Let's build the Reports module for MLA E-Office.

Reports needed:
1. Nivedan Summary — by category, status, taluka (date range filter)
2. Inward Pendency — list of overdue inward entries by age
3. Development Works — budget utilization by funding source
4. Karyakarta Booth Coverage — booths with / without pramukh
5. Visitor Statistics — daily/weekly/monthly visitor count by purpose

Build:
1. GET /api/v1/reports/nivedans?from=&to=&taluka_id= — returns summary stats
2. GET /api/v1/reports/devworks — budget summary by funding source
3. GET /api/v1/reports/visitors?period=week — visitor stats
4. Reports page with date range picker and export to CSV button
5. Simple bar/pie charts using Recharts
```

---

### ⚙️ Module 14 — User Management & Settings

**Reference files to share:**
- `USER_ROLES.md`
- `AUTH_SPEC.md`

**Prompt to start:**
```
Let's build the User Management module for MLA E-Office.

Only ADMIN role can access this module.

Features:
1. List all users with role + active status
2. Create user (set role, accessible_modules JSON)
3. Deactivate/Reactivate user (is_active toggle — no physical delete)
4. Reset password (admin sets new temp password → user must change on next login)
5. Accessible modules editor — checkboxes for which modules each user can see

Settings page (PA access):
- Department directory (update officer names and contacts)
- WhatsApp greeting calendar (set festival dates for the year)
- Category management (add/edit nivedan categories)
```

---

## Phase 4 — Polish & Deploy

### 🚀 Module 15 — Deployment

**Reference files to share:**
- `DEPLOYMENT_GUIDE.md`
- `ENV_CONFIG.md`

**Prompt to start:**
```
I'm ready to deploy the MLA E-Office system. Please guide me through:

1. Vercel deployment for the React frontend (web/)
2. Render deployment for the Express backend (api/)
3. Railway MySQL database setup
4. Setting all environment variables on each platform
5. Running migrations on Railway database
6. Seeding master data

I have DEPLOYMENT_GUIDE.md with detailed steps. Let's start with Railway MySQL setup.
```

---

## Build Order Summary

```
Phase 1 — Foundation
  Module 1: Project Setup
  Module 2: Database Migrations
  Module 3: Authentication

Phase 2 — Core Modules (build in order)
  Module 4:  Dashboard
  Module 5:  Inward Register
  Module 6:  Outward Register
  Module 7:  Nivedan (2 sessions: backend + frontend)
  Module 8:  Visitor Book
  Module 9:  Development Works

Phase 3 — Supporting Modules
  Module 10: Karyakarta Directory
  Module 11: Calendar
  Module 12: WhatsApp Integration
  Module 13: Reports
  Module 14: User Management & Settings

Phase 4 — Deploy
  Module 15: Deployment
```

---
