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
| ☐ | Inward list API (filters + pagination) | |
| ☐ | Create inward API (auto INW/YYYY/NNNN number) | |
| ☐ | Update status / assign API | |
| ☐ | Inward list page (table + filter bar) | |
| ☐ | Create form (department dropdown, file upload) | |
| ☐ | Status badge + action buttons | |

---

### Module 6 — Outward Register (जावक)

| Status | Feature | Notes |
|:------:|---------|-------|
| ☐ | Outward CRUD APIs | |
| ☐ | AI draft endpoint (Gemini) | |
| ☐ | Approve flow | |
| ☐ | Outward list page | |
| ☐ | Create form + "AI ड्राफ्ट करा" button | |
| ☐ | Link to inward entry | |

---

### Module 7 — Nivedan (निवेदन) ⭐ Most Important

| Status | Feature | Notes |
|:------:|---------|-------|
| ☐ | Create nivedan API (auto NIV-YYYY-NNNNN, auto-routing) | |
| ☐ | Nivedan list API (filters: status, category, priority, village, date) | |
| ☐ | Nivedan detail API (with full timeline) | |
| ☐ | Status transition API (state machine validation) | |
| ☐ | Add timeline note API | |
| ☐ | Public tracking API (by mobile number — no auth) | |
| ☐ | Escalation cron job | |
| ☐ | Nivedan list page (tabbed: All/Pending/Escalated/Resolved) | |
| ☐ | Register nivedan form (cascading location, category auto-dept) | |
| ☐ | Nivedan detail page (status + timeline) | |
| ☐ | Status update modal | |
| ☐ | Public tracking page | |

---

### Module 8 — Visitor Book (भेट नोंद)

| Status | Feature | Notes |
|:------:|---------|-------|
| ☐ | Check-in API (mobile → auto-detect repeat visitor) | |
| ☐ | Check-out API | |
| ☐ | Visitor list API (date filter, default today) | |
| ☐ | Quick check-in form (2-step) | |
| ☐ | Repeat visitor badge | |
| ☐ | "Convert to Nivedan" button | |

---

### Module 9 — Development Works (विकासकामे)

| Status | Feature | Notes |
|:------:|---------|-------|
| ☐ | DevWorks CRUD APIs | |
| ☐ | Photo upload API (Cloudinary) | |
| ☐ | Project list page (category + status filter) | |
| ☐ | Add/Edit project form | |
| ☐ | Project detail page (progress bar + photo gallery) | |
| ☐ | Budget progress bar | |

---

## Phase 3 — Supporting Modules

### Module 10 — Karyakarta Directory (कार्यकर्ता)

| Status | Feature | Notes |
|:------:|---------|-------|
| ☐ | Karyakarta CRUD APIs | |
| ☐ | Bulk Excel import API | |
| ☐ | Search + filter (booth / village / designation) | |
| ☐ | Karyakarta list + add form | |
| ☐ | Booth-level view | |
| ☐ | Birthday upcoming widget | |

---

### Module 11 — Calendar (दिनदर्शिका)

| Status | Feature | Notes |
|:------:|---------|-------|
| ☐ | Calendar CRUD APIs | |
| ☐ | Month view calendar page | |
| ☐ | Add event modal | |
| ☐ | Today's events on dashboard | |
| ☐ | Upcoming 7-days widget | |

---

### Module 12 — WhatsApp Integration

| Status | Feature | Notes |
|:------:|---------|-------|
| ☐ | Send template message service | |
| ☐ | Webhook handler (delivery status) | |
| ☐ | WhatsApp log to DB | |
| ☐ | Festival greeting cron job | |
| ☐ | Birthday greeting cron job | |
| ☐ | Retry logic (3 attempts) | |

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
| Phase 2 — Core | 3 | 31 | █░░░░░░░░░ 10% |
| Phase 3 — Supporting | 0 | 21 | ░░░░░░░░░░ 0% |
| Phase 4 — Deploy | 0 | 10 | ░░░░░░░░░░ 0% |
| **Total** | **3** | **67** | ░░░░░░░░░░ **4%** |

---
