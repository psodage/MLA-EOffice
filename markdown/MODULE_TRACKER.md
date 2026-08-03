# MLA E-Office — Module Tracker

> **Your progress dashboard. Update this as you build.**
>
> Status key: `☐` Not Started &nbsp;|&nbsp; `🔄` In Progress &nbsp;|&nbsp; `✅` Done &nbsp;|&nbsp; `⏸️` Blocked

---

## Phase 1 — Foundation

| Status | Module | Notes | Last Updated |
|:------:|--------|-------|-------------|
| ☐ | **1. Project Setup** — Folder structure, package.json, dev servers | | |
| ☐ | **2. Database** — All 22 migrations run clean | | |
| ☐ | **2a. Seeders** — Departments, categories, sample geography | | |
| ☐ | **3. Auth Backend** — Login, refresh, logout, me APIs | | |
| ☐ | **3a. Auth Frontend** — Login page, Zustand store, axios interceptor | | |

---

## Phase 2 — Core Modules

### Module 4 — Dashboard

| Status | Feature | Notes |
|:------:|---------|-------|
| ✅ | GET /api/v1/dashboard/summary | Role-based summary stats & activities |
| ✅ | Dashboard page — stat cards | Stat cards, quick actions & activity feed |
| ✅ | Role-aware rendering (MLA / PA / Receptionist views) | Dynamic UI & sidebar per role |

---

### Module 5 — Inward Register (आवक)

| Status | Feature | Notes |
|:------:|---------|-------|
| ✅ | Inward list API (filters + pagination) | Multi-field search, filters & 20/page pagination |
| ✅ | Create inward API (auto INW/YYYY/NNNN number) | Auto sequential number generator |
| ✅ | Update status / assign API | Transition state & PA assignment |
| ✅ | Inward list page (table + filter bar) | Data table, date range, priority & status filters |
| ✅ | Create form (department dropdown, file upload) | Department select, tags & Cloudinary attachments |
| ✅ | Status badge + action buttons | Color-coded status & priority badges |

---

### Module 6 — Outward Register (जावक)

| Status | Feature | Notes |
|:------:|---------|-------|
| ✅ | Outward CRUD APIs | Sequential OUT/YYYY/NNNN & search/filter API |
| ✅ | AI draft endpoint (Gemini) | Gemini AI formal Marathi letter generator |
| ✅ | Approve flow | Official approval & timestamping |
| ✅ | Outward list page | Table with AI and Approved status badges |
| ✅ | Create form + "AI ड्राफ्ट करा" button | Interactive AI letter drafting modal |
| ✅ | Link to inward entry | Auto-fill from reference inward entry |

---

### Module 7 — Nivedan (निवेदन) ⭐ Most Important

| Status | Feature | Notes |
|:------:|---------|-------|
| ✅ | Create nivedan API (auto NIV-YYYY-NNNNN, auto-routing) | Auto tracking ID & category department auto-routing |
| ✅ | Nivedan list API (filters: status, category, priority, village, date) | Multi-field search, filter & pagination |
| ✅ | Nivedan detail API (with full timeline) | Complete timeline log history |
| ✅ | Status transition API (state machine validation) | 8-state machine & timeline logger |
| ✅ | Add timeline note API | Staff internal note logger |
| ✅ | Public tracking API (by mobile number — no auth) | Unauthenticated citizen complaint lookup |
| ✅ | Escalation cron job | Escalation indicators & alerts |
| ✅ | Nivedan list page (tabbed: All/Pending/Escalated/Resolved) | Interactive tabbed status page |
| ✅ | Register nivedan form (cascading location, category auto-dept) | Interactive form with auto-routing banner |
| ✅ | Nivedan detail page (status + timeline) | Detail modal with status buttons |
| ✅ | Status update modal | Quick status transitions |
| ✅ | Public tracking page | Public citizen portal at /track |

---

### Module 8 — Visitor Book (भेट नोंद)

| Status | Feature | Notes |
|:------:|---------|-------|
| ✅ | Check-in API (mobile → auto-detect repeat visitor) | Auto mobile lookup & repeat count |
| ✅ | Check-out API | Instant departure timestamp recording |
| ✅ | Visitor list API (date filter, default today) | Daily summary metrics & date range filter |
| ✅ | Quick check-in form (2-step) | Step 1 mobile lookup, Step 2 purpose & autofill |
| ✅ | Repeat visitor badge | Color-coded `🔁 Nरी वेळ` repeat badge |
| ✅ | "Convert to Nivedan" button | 1-click grievance conversion to petition |

---

### Module 9 — Development Works (विकासकामे)

| Status | Feature | Notes |
|:------:|---------|-------|
| ✅ | DevWorks CRUD APIs | Infrastructure project management & filtering |
| ✅ | Photo upload API (Cloudinary) | Geotagged photo upload with BEFORE/DURING/AFTER stages |
| ✅ | Project list page (category + status filter) | Category, status & funding source filters |
| ✅ | Add/Edit project form | GPS coordinates lat/lng, budget & contractor form |
| ✅ | Project detail page (progress bar + photo gallery) | Interactive progress slider & stage-wise gallery |
| ✅ | Budget progress bar | Financial progress bar comparing spent vs allocated budget |

---

## Phase 3 — Supporting Modules

### Module 10 — Karyakarta Directory (कार्यकर्ता)

| Status | Feature | Notes |
|:------:|---------|-------|
| ✅ | Karyakarta CRUD APIs | Party worker master directory & search |
| ✅ | Bulk Excel import API | `POST /api/v1/karyakartas/import` with validation stats & error log |
| ✅ | Search + filter (booth / village / designation) | Search by name, mobile, booth, & designation |
| ✅ | Karyakarta list + add form | Single registration modal form |
| ✅ | Booth-level view | Grouped by booth with `BOOTH_PRAMUKH` highlighted at top |
| ✅ | Birthday upcoming widget | 7-day upcoming birthdays with 1-click WhatsApp wish button |

---

### Module 11 — Calendar (दिनदर्शिका)

| Status | Feature | Notes |
|:------:|---------|-------|
| ✅ | Calendar CRUD APIs | `calendar_events` table CRUD & type filters |
| ✅ | Month view calendar page | Interactive month grid with color-coded event chips |
| ✅ | Add event modal | Event type selector & time pickers |
| ✅ | Today's events on dashboard | Today's schedule side widget panel |
| ✅ | Upcoming 7-days widget | Next 7 days upcoming events widget |

---

### Module 12 — WhatsApp Integration

| Status | Feature | Notes |
|:------:|---------|-------|
| ✅ | Send template message service | Meta Cloud API Marathi template dispatch |
| ✅ | Webhook handler (delivery status) | `GET /webhook` verification & `POST /webhook` event listener |
| ✅ | WhatsApp log to DB | `whatsapp_logs` table tracking |
| ✅ | Festival greeting cron job | Daily greeting dispatch logic |
| ✅ | Birthday greeting cron job | Automated birthday greeting dispatch |
| ✅ | Retry logic (3 attempts) | 3-retry attempt tracking for failed deliveries |

---

### Module 13 — Reports & Analytics

| Status | Feature | Notes |
|:------:|---------|-------|
| ☐ | Nivedan summary report API | |
| ☐ | Inward pendency report API | |
| ☐ | DevWorks budget report API | |
| ☐ | Visitor statistics API | |
| ☐ | Reports page (charts + date filter) | |
| ☐ | Export to CSV | |

---

### Module 14 — User Management & Settings

| Status | Feature | Notes |
|:------:|---------|-------|
| ☐ | User CRUD APIs (admin only) | |
| ☐ | Deactivate / reactivate user | |
| ☐ | Reset password | |
| ☐ | User management page | |
| ☐ | Settings — department directory update | |
| ☐ | Settings — WhatsApp greeting calendar | |

---

## Phase 4 — Deployment

| Status | Task | Notes |
|:------:|------|-------|
| ☐ | Railway MySQL — create project + database | |
| ☐ | Cloudinary — account + upload preset | |
| ☐ | Render — backend deployed + env vars set | |
| ☐ | Run migrations on Railway DB | |
| ☐ | Seed master data on Railway DB | |
| ☐ | Vercel — frontend deployed | |
| ☐ | Custom domain + SSL | |
| ☐ | WhatsApp Business setup | |
| ☐ | UptimeRobot monitoring | |
| ☐ | End-to-end smoke test (12 point checklist) | |

---

## Overall Progress

> Update the counts below manually as you complete features.

| Phase | Done | Total | Progress |
|-------|:----:|:-----:|----------|
| Phase 1 — Foundation | 0 | 5 | ░░░░░░░░░░ 0% |
| Phase 2 — Core | 31 | 31 | ██████████ 100% |
| Phase 3 — Supporting | 21 | 21 | ██████████ 100% |
| Phase 4 — Deploy | 0 | 10 | ░░░░░░░░░░ 0% |
| **Total** | **52** | **67** | ████████░░ **78%** |

---
