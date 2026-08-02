# MLA E-Office — Complete Reference File Checklist for AI Agent

> **Every document an AI agent needs to generate perfect, production-ready outputs for this project — from start to end.**

---

## How to Read This Document

Each item below is a **file or document** you should create and keep in your workspace. The AI agent reads these before generating code, UI, letters, reports, or any other output. The more complete these files are, the more accurate and consistent the AI's work will be.

Files are grouped into **8 categories** in the order they should be prepared.

---

## ✅ Category 1 — Foundation & Vision (Already Partially Done)

These set the overall context. **You already have 3 of these.**

| # | File Name | Purpose | Status |
|---|-----------|---------|--------|
| 1 | `PROJECT_OVERVIEW.md` | High-level vision, problem statement, feature list, target users | ✅ Done |
| 2 | `PROJECT_SECTIONS_BREAKDOWN.md` | 11-module functional breakdown grouped by 4 pillars | ✅ Done |
| 3 | `USER_ROLES.md` | 7 user roles, RBAC matrix, daily workflows, permission table | ✅ Done |
| 4 | `TECH_STACK.md` | **Technology choices** — Frontend framework (React/Next.js/Flutter), Backend (Node/Django/Spring), Database (PostgreSQL/MongoDB), Cloud provider (AWS/Azure/GCP), WhatsApp API provider (Twilio/WATI/Gupshup), AI engine (OpenAI/Gemini), hosting, CDN, etc. | ✅ Done |
| 5 | `ARCHITECTURE.md` | **System architecture diagram** — Client ↔ API Gateway ↔ Microservices/Monolith ↔ Database ↔ External APIs. Include Mermaid diagrams showing data flow, service boundaries, and deployment topology. | ✅ Done |
| 6 | `GLOSSARY.md` | **Term dictionary** — Marathi/English mapping of every domain term used in the project (e.g., Nivedan = Petition, आवक = Inward, कार्यकर्ता = Party Worker, बूथ प्रमुख = Booth Head). Critical for AI to use correct terminology. | ✅ Done |

---

## ✅ Category 2 — Data Models & Database Schema

The AI needs exact field definitions to generate forms, APIs, queries, and reports.

| # | File Name | Purpose | Status |
|---|-----------|---------|--------|
| 7 | `DATA_MODELS.md` | **Complete entity-relationship document** covering every database table/collection. | ✅ Done |
| 8 | `ER_DIAGRAM.md` | **Entity-Relationship diagram** in Mermaid syntax showing all table relationships, foreign keys, and cardinality (1:1, 1:N, M:N). | ✅ Done |
| 9 | `MASTER_DATA.md` | **All dropdown/enum/lookup values** used across the system — categories, statuses, enums, departments, geography. | ✅ Done |

---

## ✅ Category 3 — API & Backend Specifications

| # | File Name | Purpose | Status |
|---|-----------|---------|--------|
| 10 | `API_SPEC.md` | **Complete REST API specification** for every module — endpoints, schemas, auth, pagination, filtering. | ✅ Done |
| 11 | `AUTH_SPEC.md` | **Authentication & Authorization design** — Login flow, JWT, refresh tokens, RBAC middleware. | ✅ Done |
| 12 | `BUSINESS_RULES.md` | **All business logic rules** — auto-routing, ID formats, escalation, KPI formulas, validations. | ✅ Done |

---

## ✅ Category 4 — UI/UX Design Specifications

| # | File Name | Purpose |
|---|-----------|---------|
| 13 | `UI_DESIGN_SYSTEM.md` | **Design system tokens** — Color palette (primary, secondary, accent, status colors for Pending/Resolved/Delayed), typography (font family, sizes, weights), spacing scale, border radius, shadow styles, dark mode specification. | ✅ Done |
| 14 | `WIREFRAMES/` (directory) | **Screen wireframes or mockups** for every page. At minimum: |
|    |           | — `dashboard.png` — Main dashboard layout with KPI cards, charts, recent activity |
|    |           | — `nivedan_list.png` — Nivedan table with filters, search, status badges |
|    |           | — `nivedan_form.png` — New nivedan entry form |
|    |           | — `nivedan_detail.png` — Single nivedan detail view with timeline |
|    |           | — `inward_list.png` — Inward register list |
|    |           | — `inward_form.png` — New inward entry form with PDF upload |
|    |           | — `outward_form.png` — Outward letter form with AI draft button |
|    |           | — `visitor_book.png` — Visitor register with daily summary |
|    |           | — `dev_works_list.png` — Development works list with status filters |
|    |           | — `dev_works_detail.png` — Single project detail with photo gallery and progress bar |
|    |           | — `karyakarta_list.png` — Party workers directory with booth/ward filters |
|    |           | — `booth_structure.png` — Booth hierarchy tree view |
|    |           | — `calendar.png` — Monthly/weekly calendar view |
|    |           | — `user_management.png` — Admin panel for user CRUD and role assignment |
|    |           | — `login.png` — Login page |
|    |           | — `reports.png` — Report generation page with export options |
| 15 | `NAVIGATION_MAP.md` | **Complete sitemap / navigation structure** — Sidebar menu items, sub-menus, breadcrumb paths, and which roles see which menu items. | ✅ Done |
| 16 | `COMPONENT_LIBRARY.md` | **Reusable UI component specs** — Data tables, form inputs, modals, status badges, file upload, search bars, filter panels, notification toasts, KPI cards, chart types used. | ✅ Done |

---

## ✅ Category 5 — AI & Automation Specifications

| # | File Name | Purpose |
|---|-----------|---------|
| 17 | `AI_LETTER_DRAFTING.md` | **AI outward letter generation spec** — Input fields (inward subject, sender, department), output format (formal Marathi/English government letter), tone guidelines, mandatory sections (reference number, subject line, body, signature block), sample input-output pairs (at least 5 examples). | ✅ Done |
| 18 | `LETTER_TEMPLATES/` (directory) | **Sample formal letter templates** the AI must follow: 10 templates — Collector, Tahsildar, ZP CEO, PWD, Water Supply, Education, Recommendation, MSEDCL, Police SP, Health Dept. Each template includes official address format, Marathi placeholder, filled Marathi example, English placeholder, and filled English example. | ✅ Done |
| 19 | `WHATSAPP_TEMPLATES.md` | **All WhatsApp message templates** — 11 templates: Nivedan Acknowledgment, Status Update, Resolved, Rejected, Tracking Bot Reply, Tracking Bot Help, Event Invitation, Broadcast Announcement, Karyakarta Welcome, Dev Work Update, Visitor Reminder. Each with Marathi text, numbered placeholders, and Meta WABA JSON submission format. | ✅ Done |
| 20 | `AUTO_ROUTING_RULES.md` | **Nivedan auto-routing configuration** — 14 categories mapped to dept + office staff + priority. Priority override rules (HIGH for health/electricity emergencies, LOW for requests). DB schema, SQL seeds, `autoRoute.service.js` Node.js code, controller integration, API endpoint, and frontend badge behavior. | ✅ Done |
| 21 | `GREETING_CALENDAR.md` | **Festival & greeting schedule** — 21 festival events (3 National + 18 Hindu/State), Marathi message templates, 2026/2027 pre-loaded dates, DB schema & SQL seed, node-cron + greeting service implementation, and duplicate send protection. | ✅ Done |

---

## ✅ Category 6 — Localization & Content

| # | File Name | Purpose |
|---|-----------|---------|
| 22 | `TRANSLATIONS.md` or `i18n/` (directory) | **Bilingual UI text** — Comprehensive 25-section, ~496-key i18n dictionary covering all 13 modules. Includes react-i18next config, complete `en.json` and `mr.json` locale files, all form fields, statuses, categories, departments, designations, funding sources, modals, toasts, pagination, and table headers. | ✅ Done |
| 23 | `ERROR_MESSAGES.md` | **All system error and validation messages** — Comprehensive 15-domain, ~130-code bilingual dictionary covering Auth (13), RBAC (7), Validation (16), Nivedan (13), Inward/Outward (9), Visitor (5), DevWorks (10), Karyakarta (7), Booth (5), File Upload (7), WhatsApp (12), AI (6), Import/Export (8), Reports (4), System (8). Includes Express.js AppError class, error dictionary with `{{template}}` interpolation, global error handler middleware, controller usage, and frontend `getErrorMessage()` utility. | ✅ Done |

---

## ✅ Category 7 — Constituency-Specific Master Data

| # | File Name | Purpose |
|---|-----------|---------|
| 24 | `CONSTITUENCY_PROFILE.md` | **MLA and constituency details** — Structured placeholder template covering: MLA identity (name EN+MR, photo, party, signature), constituency details (name, number, district, talukas, voter count, elected year), office details (address, phones, email, hours), letter header config (letterhead lines, signature block), dashboard branding (theme colors, logos, welcome text), WhatsApp sender identity (WABA ID, phone number ID), and complete `constituency.config.js` with all 50+ config keys + 18-item pre-live checklist. | ✅ Done |
| 25 | `GEOGRAPHY_RURAL.md` + `GEOGRAPHY_URBAN.md` | **Complete geographical hierarchy** — Split into two files: **Rural** (Taluka → GP → Village → Booth): MySQL schemas for `talukas`, `gram_panchayats`, `villages`, `booths` tables with FK constraints + indexes; Excel import column mapping for `New Booth Pramukh Yadi.xlsx`; 5 API cascade endpoints; React cascade dropdown logic; SQL seed template. **Urban** (City → Ward → Booth): MySQL schemas for `cities`, `wards` tables; shared `booths` table with `booth_type='URBAN'`; combined `LocationSelector` component for Rural+Urban switching; SQL seed template. | ✅ Done |
| 26 | `DEPARTMENT_DIRECTORY.md` | **Government department contact directory** — 25 departments (20 core + 5 additional: MSRTC, Forest, Irrigation, District Court, Assistant Collector). Each entry has: system code, bilingual name (EN+MR), head officer designation + name placeholder, office address, phone, email, nivedan categories routed here (linked to `AUTO_ROUTING_RULES.md`), preferred letter channel (in-person / email / formal). Includes MySQL `departments` table schema, full SQL INSERT seed for all 25, quick routing summary table, and 25-item pre-live contact checklist. | ✅ Done |
| 27 | `KARYAKARTA_SEED_DATA.md` | **Party worker data & bulk import spec** — MySQL `karyakartas` CREATE TABLE schema (20 columns, FK constraints, FULLTEXT indexes), Excel import template spec (9 columns with EN+MR header mapping), designation mapping table (6 values, MR→EN→Enum), 9 data validation rules (mobile/booth/designation/duplicate checks), 15 sample karyakartas with Marathi names across 6 booths (4 rural + 2 urban), SQL seed INSERT + booth pramukh UPDATE statements, bulk import API endpoint spec, complete Node.js `karyakarta.import.service.js` (xlsx parser + row validation + auto-pramukh assignment + audit log), post-import actions, UI preview flow, and 12-item pre-live checklist. | ✅ Done |

---

## ✅ Category 8 — DevOps, Testing & Deployment

| # | File Name | Purpose |
|---|-----------|---------|
| 28 | `ENV_CONFIG.md` | **Environment variables and secrets** — 55+ variables across backend (`api/.env`) and frontend (`web/.env`). Ready-to-copy `.env.example` files; variable-by-variable reference table with 🟢 PUBLIC / 🟡 SENSITIVE / 🔴 SECRET security classification; 3-environment comparison (Dev/Staging/Production); complete Joi-based `env.config.js` startup validator with typed exports; Docker Compose `docker-compose.yml`; secrets generation commands; rotation procedures for JWT, DB, WhatsApp, Cloudinary, Gemini, SMTP; 8 security best practices; `.gitignore` entries. | ✅ Done |
| 29 | `DEPLOYMENT_GUIDE.md` | **Complete step-by-step deployment manual** — 18-section guide for free tier hosting (Vercel + Render + Railway). Covers: prerequisites & account setup; infrastructure overview with architecture diagram and free tier limits; Railway MySQL setup (create project, get credentials, create database); Cloudinary setup (API keys, upload preset, folder structure, upload restrictions); external API keys (Gemini, Gmail App Password, security secret generation); Render backend deployment (service config, all 55+ env vars, deploy & verify); Vercel frontend deployment (Vite config, SPA routing, env vars); database migration & seeding (Sequelize migrations, master data seeding order, admin user creation, verification); SSL & custom domain setup (DNS CNAME records for frontend + API, Vercel/Render domain config, env var updates); WhatsApp Business setup (Meta Business Account, API credentials, permanent token, Marathi message templates, webhook config, test commands); post-deployment verification (health checks, 12-point end-to-end smoke test, security verification); monitoring & health checks (UptimeRobot setup, built-in 15-min cron health check, log access — Render/Winston/audit, error severity matrix); backup & disaster recovery (daily incremental + weekly full backup, manual emergency backup, restore procedure, verification); rollback procedures (Vercel instant rollback, Render Git revert, Sequelize migration undo, env var rollback); scaling guide (upgrade signals, priority order, cost estimates ₹0→₹15K, future architecture path to AWS/DigitalOcean); new MLA onboarding checklist (6-phase workflow: client info gathering, infrastructure setup, data setup, WhatsApp integration, testing, training & handover — with 50+ checkbox items); troubleshooting (20+ common issues with solutions for backend, frontend, database, WhatsApp, performance + keep-alive hack); quick reference card (service URLs, emergency procedures, secret rotation commands, support contacts). Written for junior developers/IT staff with exact commands at every step. | ✅ Done |
| 30 | `TESTING_PLAN.md` | **Test scenarios** for each module — What to test, expected behavior, edge cases. E.g., "Create nivedan with missing mobile → should show validation error", "Assign inward to non-existent user → should fail gracefully". |
| 31 | `SAMPLE_DATA/` (directory) | **Realistic SQL seed data for development & demo** — Fictional Pune Cantonment constituency. 8 files, 252 total records. `README.md`: constituency profile, file listing, execution order, data relationships, test user credentials table. `01_users.sql`: 7 users covering all 7 roles (MLA, PA, Receptionist, Auditor, Booth Pramukh, Citizen, Admin) with bcrypt-hashed passwords. `02_inward_entries.sql`: 20 incoming letters — all 5 statuses (PENDING/ASSIGNED/IN_PROGRESS/COMPLETED/CANCELLED), 3 priorities, 8 departments — all Marathi text. `03_nivedans.sql`: 20 citizen complaints — all 8 statuses, all 14 categories, escalation levels NONE/L1/L2, with GPS coords and Cloudinary attachment URLs. `04_nivedan_timeline.sql`: 40 timeline entries — all 11 action types (CREATED, STATUS_CHANGE, ASSIGNED, FORWARDED, NOTE_ADDED, WHATSAPP_SENT, ESCALATED, RESOLVED, REJECTED, CANCELLED, ARCHIVED) with Marathi notes. `05_development_works.sql`: 10 infrastructure projects — all 5 statuses, 9 project categories, all 5 funding sources (MLALAD/ZP_FUND/STATE_GRANT/CENTRAL_GRANT/GP_FUND), with budget figures and contractor details. `06_visitors.sql`: 50 visitor entries — all 10 purpose types, 8 repeat visitors linked to nivedans. `07_karyakartas.sql`: 100 party workers across 20 booths (15 rural + 5 urban) — all 6 designations (BOOTH_PRAMUKH×20, WARD_HEAD×5, SHAKTI_KENDRA×5, KARYAKARTA×55, VOLUNTEER×12, OTHER×3), 95 active / 5 inactive, all with DOB for birthday testing. `08_calendar_events.sql`: 5 events — all 6 types (PUBLIC_PROGRAM, GOVT_DEADLINE, MEETING, ASSEMBLY_SESSION, CONSTITUENCY_VISIT, PERSONAL), one recurring. | ✅ Done |

---

## 📋 Priority Order for Creation

> [!IMPORTANT]
> You don't need to create all 31 files at once. Here's the recommended priority order:

### 🔴 Phase 1 — Must Have Before Any Code Generation
1. `TECH_STACK.md` — Without this, the AI doesn't know what language/framework to write in
2. `GLOSSARY.md` — Prevents terminology confusion
3. `CONSTITUENCY_PROFILE.md` — Needed for branding and letter headers
4. `DATA_MODELS.md` — Core of everything; forms, APIs, and queries depend on this
5. `MASTER_DATA.md` — Dropdowns, enums, and categories

### 🟡 Phase 2 — Needed for Building Core Modules
6. `BUSINESS_RULES.md` — Logic the AI must enforce
7. `API_SPEC.md` — Backend endpoints
8. `AUTH_SPEC.md` — Login and permissions
9. `GEOGRAPHY_MASTER.xlsx` — Booth/village/ward data
10. `NAVIGATION_MAP.md` — App structure

### 🟢 Phase 3 — Needed for AI Features & Communication
11. `AI_LETTER_DRAFTING.md` + `LETTER_TEMPLATES/`
12. `WHATSAPP_TEMPLATES.md`
13. `AUTO_ROUTING_RULES.md`
14. `GREETING_CALENDAR.md`
15. `TRANSLATIONS.md`

### 🔵 Phase 4 — Polish & Launch
16. `UI_DESIGN_SYSTEM.md` + `WIREFRAMES/`
17. `ARCHITECTURE.md` + `ER_DIAGRAM.md`
18. `DEPLOYMENT_GUIDE.md`
19. `TESTING_PLAN.md`
20. `SAMPLE_DATA/`

---

## 📊 Current Status Summary

| Category | Files Needed | Files Done | Remaining |
|----------|:---:|:---:|:---:|
| Foundation & Vision | 6 | 6 | 0 |
| Data Models & Schema | 3 | 3 | 0 |
| API & Backend | 3 | 3 | 0 |
| UI/UX Design | 4 | 1 | 3 |
| AI & Automation | 5 | 0 | 5 |
| Localization & Content | 2 | 0 | 2 |
| Constituency Master Data | 4 | 0 | 4 |
| DevOps & Testing | 4 | 0 | 4 |
| **TOTAL** | **31** | **13** | **18** |

---

> [!TIP]
> Once you tell me your **tech stack choices** (Phase 1, item #1), I can start generating many of these files automatically — especially the data models, API specs, sample data, and translations.
