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
| 23 | `ERROR_MESSAGES.md` | **All system error and validation messages** — Complete dictionary of standardized error payloads, HTTP status codes, and bilingual messages (English & Marathi) across Auth, Validation, Business Rules, File Uploads, and System Integrations. | ✅ Done |

---

## ✅ Category 7 — Constituency-Specific Master Data

| # | File Name | Purpose |
|---|-----------|---------|
| 24 | `CONSTITUENCY_PROFILE.md` | **MLA and constituency details** — MLA's full name, party name, constituency name, district, state, office address, office contact numbers, official photo, party logo. This is used in letter headers, dashboard branding, and WhatsApp sender identity. |
| 25 | `GEOGRAPHY_MASTER.xlsx` or `.md` | **Complete geographical hierarchy**: |
|    |           | — Taluka → Gram Panchayat → Village → Booth Number |
|    |           | — City → Ward → Booth Number |
|    |           | This is the backbone of all area-wise filtering, reporting, and booth architecture. **Source:** Use your existing `New Booth Pramukh Yadi.xlsx` as a starting point. |
| 26 | `DEPARTMENT_DIRECTORY.md` | **Government department contact directory** — Name of every government office/department the MLA office corresponds with, along with: department name, officer designation, office address, phone, email. E.g., District Collector Office, Tahsildar Office, ZP, PWD, MSEDCL, Jal Sandharan, Education, Health, etc. |
| 27 | `KARYAKARTA_SEED_DATA.xlsx` or `.csv` | **Initial party worker data** — Pre-populated list of existing booth pramukhs, ward heads, and workers to seed the system. Columns: Name, Mobile, Village/Ward, Booth No., Designation. |

---

## ✅ Category 8 — DevOps, Testing & Deployment

| # | File Name | Purpose |
|---|-----------|---------|
| 28 | `ENV_CONFIG.md` | **Environment variables and secrets** the system needs: |
|    |           | — Database connection string |
|    |           | — WhatsApp API key and sender number |
|    |           | — AI/LLM API key (for letter drafting) |
|    |           | — Cloud storage bucket name and credentials |
|    |           | — JWT secret key |
|    |           | — SMTP settings (if email is used) |
| 29 | `DEPLOYMENT_GUIDE.md` | **Deployment instructions** — How to deploy to production (Docker/Kubernetes/Vercel/Railway/VPS), domain setup, SSL certificates, database migration steps, backup schedule. |
| 30 | `TESTING_PLAN.md` | **Test scenarios** for each module — What to test, expected behavior, edge cases. E.g., "Create nivedan with missing mobile → should show validation error", "Assign inward to non-existent user → should fail gracefully". |
| 31 | `SAMPLE_DATA/` (directory) | **Realistic test data** for development and demo: |
|    |           | — 20 sample inward entries |
|    |           | — 20 sample nivedans with various statuses |
|    |           | — 10 sample development works |
|    |           | — 50 sample visitor entries |
|    |           | — 100 sample party workers across booths |
|    |           | — 5 sample calendar events |

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
