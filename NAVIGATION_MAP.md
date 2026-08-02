# MLA E-Office — Navigation Map & Sitemap

> **Complete Navigation Structure — Sidebar Menu, Page Routes, Breadcrumbs, Role-Based Visibility, and Sub-Page Flows**
> 
> *Related Documents:* [PROJECT_SECTIONS_BREAKDOWN.md](file:///s:/MLA%20E%20-%20Office/PROJECT_SECTIONS_BREAKDOWN.md) | [USER_ROLES.md](file:///s:/MLA%20E%20-%20Office/USER_ROLES.md) | [UI_DESIGN_SYSTEM.md](file:///s:/MLA%20E%20-%20Office/UI_DESIGN_SYSTEM.md) | [AUTH_SPEC.md](file:///s:/MLA%20E%20-%20Office/AUTH_SPEC.md)

---

## 1. Navigation Architecture Overview

The application uses a **persistent sidebar + topbar** shell layout. The sidebar follows the **4-pillar module architecture** defined in `PROJECT_SECTIONS_BREAKDOWN.md`.

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOPBAR [fixed, z:300]                                              │
│  ☰ Toggle │ 🔍 Global Search │ 🌐 Lang │ 🔔 Notif │ 👤 Avatar    │
├──────────┬───────────────────────────────────────────────────────────┤
│ SIDEBAR  │  MAIN CONTENT AREA                                      │
│ [fixed,  │                                                          │
│  z:200,  │  ┌─ Breadcrumb: Dashboard / Nivedans / NIV-2026-01247   │
│  240px]  │  │                                                       │
│          │  │  Page Header + Actions                                │
│ ┌──────┐ │  │                                                       │
│ │ Logo │ │  │  [ Content... ]                                       │
│ ├──────┤ │  │                                                       │
│ │ Menu │ │  │                                                       │
│ │ ...  │ │  │                                                       │
│ │ ...  │ │  │                                                       │
│ └──────┘ │  │                                                       │
│          │  └───────────────────────────────────────────────────────│
└──────────┴───────────────────────────────────────────────────────────┘
```

### Key Layout Constants

| Property | Value | Notes |
|----------|-------|-------|
| Sidebar Width | `240px` | Collapsible to `60px` (icon-only mode) on ☰ toggle |
| Topbar Height | `56px` | Fixed, always visible |
| Content Max Width | None (fluid) | Except form pages: `960px` centered |
| Mobile Breakpoint | `768px` | Sidebar hidden by default, shown as overlay on toggle |
| Sidebar Position | `fixed` | Does not scroll with content |
| Topbar Position | `fixed` | Always visible at top |

---

## 2. Sidebar Menu Structure

The sidebar is organized into **4 section groups** matching the project's 4 pillars, plus a **System** section at the bottom.

### Section Labels & Menu Items

```
┌─────────────────────────────────────────┐
│  🏛️  MLA E-Office                      │  ← Logo + App Name
├─────────────────────────────────────────┤
│                                         │
│  INTELLIGENCE · बुद्धिमत्ता              │  ← Section Label (Pillar 4)
│  📊  Dashboard · डॅशबोर्ड              │  /dashboard
│                                         │
│  OFFICE ADMIN · कार्यालयीन              │  ← Section Label (Pillar 1)
│  📨  Inward & Outward · आवक-जावक       │  /inward
│  👤  Visitor Book · अभ्यागत पुस्तिका    │  /visitors
│                                         │
│  PUBLIC GRIEVANCES · जनतक्रार           │  ← Section Label (Pillar 2)
│  📝  Nivedans · निवेदने                 │  /nivedans
│  🏗️  Dev Works · विकासकामे             │  /devworks
│                                         │
│  CONSTITUENCY · मतदारसंघ                │  ← Section Label (Pillar 3)
│  👥  Karyakarta · कार्यकर्ता   ▶        │  /karyakarta        (expandable)
│       ├ 📍 Gram/Ward · ग्राम/वॉर्ड     │  /karyakarta/areas
│       └ 🗳️ Booths · बूथ रचना           │  /karyakarta/booths
│                                         │
│  TOOLS · साधने                          │  ← Section Label (Pillar 4 contd.)
│  📅  Calendar · दिनदर्शिका              │  /calendar
│  💬  WhatsApp · व्हॉट्सअॅप              │  /whatsapp
│  📑  Reports · अहवाल                   │  /reports
│  🔔  Notifications · सूचना              │  /notifications
│                                         │
│  ─────────── divider ───────────        │
│                                         │
│  SYSTEM · प्रणाली                       │  ← Bottom Section
│  ⚙️  Settings · सेटिंग्ज               │  /settings
│  🛡️  User Management                   │  /admin/users  (Admin only)
│                                         │
└─────────────────────────────────────────┘
```

> **Design Rule:** Dashboard is placed at the very top of the sidebar (first item) because it is the default landing page after login for MLA, PA, and Admin roles. The 4-pillar ordering places Intelligence first since the dashboard is the most frequently accessed page.

---

## 3. Complete Route Map

### 3.1 Authentication Routes (No Sidebar)

These pages use a **full-screen centered layout** — no sidebar, no topbar.

| Route | Page | Title (EN) | Title (MR) | Description |
|-------|------|-----------|-----------|-------------|
| `/login` | Login | Login | लॉगिन | Username + password form, OTP option |
| `/login/first-time` | First Time Password | Set Password | पासवर्ड सेट करा | Forced password change on first login |
| `/login/change-password` | Change Password | Change Password | पासवर्ड बदला | 90-day password rotation prompt |

**Post-Login Redirect Rules:**

| Role | Redirects To | Reason |
|------|-------------|--------|
| MLA | `/dashboard` | Executive overview is primary view |
| PA | `/dashboard` | Operational overview needed first |
| Receptionist | `/visitors` | First task: register arriving visitors |
| Field Auditor | `/devworks` | Check assigned inspections |
| System Admin | `/admin/users` | User management is primary task |

---

### 3.2 Intelligence — Pillar 4 (Top Position)

#### 📊 Dashboard Module

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/dashboard` | Dashboard Home | `Dashboard` | KPI cards, charts, activity feed, quick actions |

**Dashboard Sections (single page, scrollable):**

| Section | Content |
|---------|---------|
| KPI Row | 6 cards: Pending Nivedans, Today's Visitors, Inward This Week, Overdue Dev Works, Active Workers, Unread Notifications |
| Charts Row | Nivedan trend (line), Category breakdown (donut), Resolution rate (bar) |
| Activity Feed | Last 20 system events across all modules |
| Quick Actions | + New Nivedan, + New Inward, + Check In Visitor, + New Event |

---

### 3.3 Office Admin — Pillar 1

#### 📨 Inward & Outward Module

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/inward` | Inward List | `Inward & Outward` | Table view of all inward entries with tab toggle |
| `/inward?tab=outward` | Outward List | `Inward & Outward` | Same page, Outward tab selected |
| `/inward/new` | New Inward Form | `Inward & Outward / New Inward Entry` | 4-section form: details, sender, content, attachments |
| `/inward/:id` | Inward Detail | `Inward & Outward / INW-2026-0389` | Detail view with metadata, description, linked outward |
| `/inward/:id/edit` | Edit Inward | `Inward & Outward / INW-2026-0389 / Edit` | Pre-filled edit form |
| `/outward/new` | New Outward Form | `Inward & Outward / New Outward Letter` | Two-column: form + live letter preview, AI draft button |
| `/outward/new?ref=:inwardId` | Outward (linked) | `Inward & Outward / New Outward Letter` | Pre-filled from linked inward entry |
| `/outward/:id` | Outward Detail | `Inward & Outward / OUT-2026-0157` | Letter preview, delivery status, print/PDF options |

**Tab Behavior on `/inward`:**

| Tab | Label | Badge Count |
|-----|-------|-------------|
| Inward (active) | `📨 Inward · आवक` | Total count (e.g., 389) |
| Outward | `📤 Outward · जावक` | Total count (e.g., 156) |

**Navigation Flow:**
```
/inward (list) ─── [+ New Inward] ──→ /inward/new ──→ [Save] → /inward/:id
       │                                                         │
       │── [Row Click] ──→ /inward/:id (detail) ─── [Edit] ──→ /inward/:id/edit
       │                          │
       │                          └── [Create Outward] ──→ /outward/new?ref=:id
       │
       └── [Outward Tab] ──→ /inward?tab=outward
                                   │
                                   └── [+ New Outward] ──→ /outward/new
```

---

#### 👤 Visitor Book Module

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/visitors` | Visitor Book | `Visitor Book` | Daily register with date navigator, summary KPIs |
| `/visitors/check-in` | New Check-In | `Visitor Book / Check In` | Quick-entry modal or inline form |
| `/visitors/:id` | Visitor Detail | `Visitor Book / Suresh Jadhav` | Visit history, linked nivedans, repeat count |

**Visitor Check-In Flow:**
```
/visitors (daily list) ─── [+ Check In] ──→ Modal: name, mobile, purpose
       │                                           │
       │                                           └── [Save] → row added to table, 
       │                                                         linked nivedan created if purpose=Nivedan
       │
       │── [✓ Check Out] ──→ Inline action (updates row, no navigation)
       │
       └── [Row Click] ──→ /visitors/:id (visit detail + history)
```

**Date Navigation (on `/visitors`):**
- `‹` / `›` buttons change the displayed date
- URL updates: `/visitors?date=2026-08-02`
- "Today" button resets to current date

---

### 3.4 Public Grievances — Pillar 2

#### 📝 Nivedans Module

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/nivedans` | Nivedan List | `Nivedans` | Filterable data table with status tabs |
| `/nivedans/new` | New Nivedan Form | `Nivedans / New Nivedan` | 3-section form: citizen info, complaint, attachments |
| `/nivedans/:id` | Nivedan Detail | `Nivedans / NIV-2026-01247` | Two-column: description + attachments (left), timeline (right) |
| `/nivedans/:id/edit` | Edit Nivedan | `Nivedans / NIV-2026-01247 / Edit` | Pre-filled edit form |
| `/nivedans/:id/print` | Print Receipt | — | Print-optimized receipt page (opens in new tab) |

**Status Tabs on `/nivedans`:**

| Tab | Label | Filter | Badge |
|-----|-------|--------|-------|
| All | `All · सर्व` | No filter | Total count |
| Pending | `🟡 Pending · प्रलंबित` | `status=pending` | Count |
| In Progress | `🔵 In Progress · सुरू` | `status=in_progress` | Count |
| Forwarded | `🟣 Forwarded · अग्रेषित` | `status=forwarded` | Count |
| Resolved | `🟢 Resolved · निकाली` | `status=resolved` | Count |
| Rejected | `🔴 Rejected · नाकारले` | `status=rejected` | Count |

**Navigation Flow:**
```
/nivedans (list) ─── [+ New Nivedan] ──→ /nivedans/new ──→ [Submit] → /nivedans/:id
       │                                                              │
       │── [Row Click] ──→ /nivedans/:id (detail)                     │
       │                          │                                    │
       │                          ├── [Edit] ──→ /nivedans/:id/edit   │
       │                          ├── [Print Receipt] ──→ new tab     │
       │                          ├── [Assign] ──→ Modal (staff dropdown)
       │                          └── [Mark Resolved / Reject] ──→ Status change + timeline entry
       │
       └── [Filter/Status Tab Click] ──→ /nivedans?status=pending&category=water
```

---

#### 🏗️ Development Works Module

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/devworks` | Dev Works List | `Development Works` | Card grid / table / map toggle, status KPIs |
| `/devworks/new` | New Project Form | `Development Works / New Project` | Project creation form |
| `/devworks/:id` | Project Detail | `Development Works / NH-4 Road Widening` | Photo gallery, milestones, budget tracker |
| `/devworks/:id/edit` | Edit Project | `Development Works / NH-4 Road Widening / Edit` | Pre-filled edit form |
| `/devworks/:id/photos` | Photo Gallery | `Development Works / NH-4 Road Widening / Photos` | Full photo management with upload |

**View Toggle on `/devworks`:**

| View | Icon | Description |
|------|------|-------------|
| Cards (default) | 🃏 | Grid of project cards with progress bars |
| Table | 📋 | Traditional data table with sortable columns |
| Map | 📍 | Map view with project location pins (uses GPS coordinates) |

**Navigation Flow:**
```
/devworks (list) ─── [+ New Project] ──→ /devworks/new ──→ [Save] → /devworks/:id
       │
       │── [Card/Row Click] ──→ /devworks/:id (detail)
       │                              │
       │                              ├── [Edit] ──→ /devworks/:id/edit
       │                              ├── [Add Photo] ──→ Upload modal
       │                              └── [Photo Gallery] ──→ /devworks/:id/photos
       │
       └── [View Toggle] ──→ /devworks?view=table or /devworks?view=map
```

---

### 3.5 Constituency — Pillar 3 (Expandable Sub-Menu)

The **Constituency** section uses an expandable parent menu item. Clicking `👥 Karyakarta` expands to show 3 sub-items: Karyakarta directory, Gram/Ward areas, and Booth structure.

#### 👥 Karyakarta Master

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/karyakarta` | Karyakarta List | `Karyakarta` | Worker card grid with role badges, filters |
| `/karyakarta/new` | Add Worker Form | `Karyakarta / Add Worker` | Worker registration form |
| `/karyakarta/:id` | Worker Detail | `Karyakarta / Ramesh Patil` | Full profile, booth assignment, activity history |
| `/karyakarta/:id/edit` | Edit Worker | `Karyakarta / Ramesh Patil / Edit` | Pre-filled edit form |
| `/karyakarta/import` | Import Workers | `Karyakarta / Import CSV` | Bulk CSV import with validation preview |

---

#### 📍 Gram/Ward Organization

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/karyakarta/areas` | Area List | `Constituency / Gram & Ward` | All villages, wards, gram panchayats grouped by taluka |
| `/karyakarta/areas/:id` | Area Detail | `Constituency / Gram & Ward / Wadgaon Village` | Area stats, booth list, worker count, linked nivedans |
| `/karyakarta/areas/new` | Add Area | `Constituency / Gram & Ward / New Area` | New village/ward registration |

---

#### 🗳️ Booth Architecture

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/karyakarta/booths` | Booth Structure | `Constituency / Booth Structure` | Two-panel: tree hierarchy (left) + detail (right) |
| `/karyakarta/booths/:id` | Booth Detail | `Constituency / Booth Structure / Booth 145` | Booth info, pramukh, workers, voter count |
| `/karyakarta/booths/new` | Add Booth | `Constituency / Booth Structure / New Booth` | New booth creation with area assignment |

**Constituency Sub-Menu Behavior:**
```
👥 Karyakarta ▶  ←── Clicking expands sub-menu
    ├── 👥 All Workers         /karyakarta
    ├── 📍 Gram/Ward           /karyakarta/areas
    └── 🗳️ Booths              /karyakarta/booths
```

---

### 3.6 Tools — Pillar 4 (Continued)

#### 📅 Calendar Module

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/calendar` | Calendar | `Calendar` | Monthly grid view (default), week, day toggle |
| `/calendar?view=week` | Week View | `Calendar` | 7-day column layout |
| `/calendar?view=day` | Day View | `Calendar` | Single day hour-by-hour view |
| `/calendar/new` | New Event | `Calendar / New Event` | Event creation form (or modal) |
| `/calendar/:id` | Event Detail | `Calendar / Road Inauguration` | Event details, attendees, reminders |

**View Toggle:**

| View | URL Param | Description |
|------|-----------|-------------|
| Month (default) | `?view=month` | 7×5 calendar grid |
| Week | `?view=week` | 7-column time slots |
| Day | `?view=day` | Single day with hourly blocks |

**Event Color Coding:**

| Event Type | Color Token | Border Color |
|------------|-------------|-------------|
| Meeting · बैठक | `blue / #2563EB` | Left border accent |
| Program · कार्यक्रम | `green / #16A34A` | Left border accent |
| Deadline · मुदत | `red / #DC2626` | Left border accent |
| Personal · वैयक्तिक | `purple / #7C3AED` | Left border accent |
| Assembly Session · अधिवेशन | `orange / #EA580C` | Left border accent |
| Holiday · सुट्टी | `amber / #D97706` | Left border accent |

---

#### 💬 WhatsApp Module

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/whatsapp` | WhatsApp Dashboard | `WhatsApp` | Overview: sent/failed/pending stats, recent activity |
| `/whatsapp/broadcasts` | Broadcasts | `WhatsApp / Broadcasts` | Compose & send mass messages |
| `/whatsapp/broadcasts/new` | New Broadcast | `WhatsApp / Broadcasts / New` | Compose broadcast: audience, template, schedule |
| `/whatsapp/templates` | Message Templates | `WhatsApp / Templates` | All WhatsApp message templates (CRUD) |
| `/whatsapp/templates/new` | New Template | `WhatsApp / Templates / New` | Create new template |
| `/whatsapp/delivery-log` | Delivery Log | `WhatsApp / Delivery Log` | Full message log: sent, delivered, read, failed |
| `/whatsapp/greetings` | Greeting Calendar | `WhatsApp / Greeting Calendar` | Auto-greeting schedule: festivals, birthdays |

**WhatsApp Dashboard Sections:**

| Section | Content |
|---------|---------|
| KPI Row | Messages Sent Today, Delivery Rate %, Failed Messages, Pending Queue |
| Recent Activity | Last 10 messages with status (Sent/Delivered/Read/Failed) |
| Quick Actions | + New Broadcast, + Birthday Greetings Today, + View Failed |

**Sub-Tab Navigation (horizontal tabs on `/whatsapp`):**

| Tab | Route | Label |
|-----|-------|-------|
| Overview | `/whatsapp` | 📊 Overview · सारांश |
| Broadcasts | `/whatsapp/broadcasts` | 📢 Broadcasts · प्रसारण |
| Templates | `/whatsapp/templates` | 📝 Templates · नमुने |
| Delivery Log | `/whatsapp/delivery-log` | 📋 Delivery Log · वितरण लॉग |
| Greetings | `/whatsapp/greetings` | 🎉 Greetings · शुभेच्छा |

---

#### 📑 Reports Module

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/reports` | Reports Home | `Reports` | Report type cards + quick generate form |
| `/reports/generate` | Generate Report | `Reports / Generate` | Full form: type, date range, filters, format |
| `/reports/history` | Report History | `Reports / History` | Previously generated reports with download links |
| `/reports/preview/:id` | Report Preview | `Reports / Preview` | In-browser PDF/table preview before download |

**Available Report Types:**

| Report | Description | Export Formats |
|--------|-------------|----------------|
| Nivedan Summary | Category-wise breakdown, resolution stats | PDF, Excel, Print |
| Inward/Outward Register | Full correspondence log | PDF, Excel, Print |
| Visitor Daily | Day-wise count, purpose, wait times | PDF, Print |
| Dev Works Progress | Project status, budget vs spent | PDF, Excel, Print |
| Booth Worker Report | Hierarchy-wise worker coverage | PDF, Excel |
| WhatsApp Message Log | Sent/failed messages, template usage | PDF, CSV |

---

#### 🔔 Notifications Module

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/notifications` | Notifications Page | `Notifications` | Full notification history with filters |

**Notification Page Sections:**

| Section | Content |
|---------|---------|
| Filter Bar | All / Unread / Read — Category: Nivedan, Inward, DevWorks, System |
| Notification List | Scrollable list with: icon, title, description, timestamp, read/unread dot |
| Bulk Actions | Mark all read, Clear read notifications |

**Bell Icon Behavior (Topbar):**
- Shows unread count badge (red dot with number)
- Clicking the bell icon navigates to `/notifications` (full page)
- No dropdown preview — direct navigation

---

### 3.7 System Section

#### ⚙️ Settings

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/settings` | Settings | `Settings` | Tabbed settings page |
| `/settings?tab=profile` | Profile Tab | `Settings` | User name, avatar, password change |
| `/settings?tab=office` | Office Info Tab | `Settings` | Office name, address, MLA photo, party logo, constituency |
| `/settings?tab=integrations` | Integrations Tab | `Settings` | WhatsApp API keys, AI engine config, Cloudinary |
| `/settings?tab=security` | Security Tab | `Settings` | Login history, active sessions, 2FA settings |

**Settings Tabs:**

| Tab | Label | Visible To |
|-----|-------|-----------|
| Profile | 👤 My Profile | All roles |
| Office Info | 🏛️ Office Configuration | PA, Admin |
| Integrations | 🔗 API Integrations | Admin only |
| Security | 🔒 Security & Sessions | All roles (own data), Admin (all data) |

---

#### 🛡️ User Management (Admin Only)

| Route | Page | Breadcrumb | Description |
|-------|------|-----------|-------------|
| `/admin/users` | User List | `User Management` | All user accounts with roles, status, modules |
| `/admin/users/new` | Add User | `User Management / Add User` | New user form with role & module assignment |
| `/admin/users/:id` | User Detail | `User Management / Rajesh Patil` | User profile, permissions, login history |
| `/admin/users/:id/edit` | Edit User | `User Management / Rajesh Patil / Edit` | Edit role, modules, status |
| `/admin/audit-log` | Audit Log | `User Management / Audit Log` | System-wide audit trail |

---

## 4. Role-Based Sidebar Visibility Matrix

Each role sees **only the sidebar items they have permission to access**. Hidden items are completely removed from the DOM (not grayed out).

| Sidebar Item | MLA | PA | Receptionist | Auditor | Admin |
|-------------|:---:|:--:|:---:|:---:|:---:|
| 📊 Dashboard | ✅ | ✅ | ❌ | ❌ | ✅ |
| 📨 Inward & Outward | ✅ | ✅ | ✅¹ | ❌ | ✅ |
| 👤 Visitor Book | ✅ | ✅ | ✅ | ❌ | ✅ |
| 📝 Nivedans | ✅ | ✅ | ✅² | ❌ | ✅ |
| 🏗️ Dev Works | ✅ | ✅ | ❌ | ✅³ | ✅ |
| 👥 Karyakarta | ✅ | ✅ | ❌ | ❌ | ✅ |
| 📍 Gram/Ward | ✅ | ✅ | ❌ | 👁️ | ✅ |
| 🗳️ Booths | ✅ | ✅ | ❌ | ✅⁴ | ✅ |
| 📅 Calendar | ✅ | ✅ | 👁️ | 👁️ | ✅ |
| 💬 WhatsApp | ✅ | ✅ | ❌ | ❌ | ✅ |
| 📑 Reports | ✅ | ✅ | ❌ | ❌ | ✅ |
| 🔔 Notifications | ✅ | ✅ | ✅ | ✅ | ✅ |
| ⚙️ Settings | ✅ | ✅ | ✅⁵ | ✅⁵ | ✅ |
| 🛡️ User Management | ❌ | ❌ | ❌ | ❌ | ✅ |

**Footnotes:**
1. Receptionist: Inward create + view own only; no Outward access
2. Receptionist: Nivedan create + view own only; no status change or routing
3. Auditor: Dev Works view assigned + update progress/photos only
4. Auditor: Booth verification reports only
5. Settings limited to Profile + Security (own data) tab only

---

## 5. Topbar Elements & Behavior

```
┌─────────────────────────────────────────────────────────────────────┐
│ ☰  │  🔍 Search nivedans, visitors, inward...  │  🌐  🔔⁵  [RP] │
└─────────────────────────────────────────────────────────────────────┘
  │       │                                          │   │    │
  │       │                                          │   │    └── Avatar dropdown menu
  │       │                                          │   └── Bell → /notifications
  │       │                                          └── Language toggle (EN ↔ MR)
  │       └── Global search (all modules)
  └── Sidebar collapse/expand toggle
```

### Topbar Element Details

| Element | Position | Behavior |
|---------|----------|----------|
| **☰ Toggle** | Left | Toggles sidebar between `240px` (expanded) and `60px` (icon-only). On mobile: shows/hides overlay sidebar. |
| **🔍 Global Search** | Center | Searches across ALL modules. Results grouped by type. Debounced (300ms). Respects role permissions. Max width: `520px`. |
| **🌐 Language** | Right | Toggles entire UI between English and Marathi. Persists in `localStorage`. |
| **🔔 Notification Bell** | Right | Shows unread count badge. Clicking navigates to `/notifications`. |
| **👤 Avatar** | Right | Shows initials. Dropdown menu with: Profile, Settings, Logout. |

### Avatar Dropdown Menu

| Item | Route | Icon |
|------|-------|------|
| My Profile | `/settings?tab=profile` | 👤 |
| Settings | `/settings` | ⚙️ |
| Logout | `POST /api/auth/logout` | 🚪 |

---

## 6. Global Search Result Structure

When a user types in the global search bar, results appear in a dropdown grouped by module:

```
┌─────────────────────────────────────────────┐
│  🔍  "Suresh"                               │
├─────────────────────────────────────────────┤
│  📝 NIVEDANS (2 results)                    │
│    NIV-2026-01247 — Suresh Jadhav — Water   │
│    NIV-2026-01102 — Suresh Patil — Road     │
│                                             │
│  👤 VISITORS (1 result)                     │
│    Suresh Jadhav — 02 Aug 2026, 4:05 PM     │
│                                             │
│  👥 KARYAKARTA (3 results)                  │
│    Suresh More — Booth Pramukh — Booth 45   │
│    Suresh Kale — Karyakarta — Ward 3        │
│    Suresh Deshmukh — Volunteer — Wadgaon    │
│                                             │
│  ──── View all 6 results ────               │
└─────────────────────────────────────────────┘
```

**Searchable Fields Per Module:**

| Module | Searchable Fields |
|--------|-------------------|
| Nivedans | Tracking ID, citizen name, mobile, subject, category |
| Inward | Inward number, sender name, subject, department |
| Outward | Outward number, recipient name, subject |
| Visitors | Visitor name, mobile number |
| Dev Works | Project title, contractor name, location |
| Karyakarta | Worker name, mobile, booth number |
| Calendar | Event title, description |

---

## 7. Breadcrumb Patterns

Every page (except Dashboard and Login) shows a breadcrumb trail below the topbar. Breadcrumbs are clickable links for navigation.

### Breadcrumb Rules

| Rule | Example |
|------|---------|
| **Max depth:** 3 levels | `Dashboard / Nivedans / NIV-2026-01247` |
| **Root is always clickable** | `Dashboard` links to `/dashboard` |
| **Current page is plain text** | Last item in breadcrumb is not a link |
| **ID pages show the ID** | Use tracking ID, not generic "Detail" |
| **Use module name for parent** | `Nivedans`, not `Public Grievances` |

### Complete Breadcrumb Map

| Route | Breadcrumb Trail |
|-------|------------------|
| `/dashboard` | `Dashboard` |
| `/inward` | `Inward & Outward` |
| `/inward/new` | `Inward & Outward / New Inward Entry` |
| `/inward/:id` | `Inward & Outward / INW-2026-0389` |
| `/inward/:id/edit` | `Inward & Outward / INW-2026-0389 / Edit` |
| `/outward/new` | `Inward & Outward / New Outward Letter` |
| `/outward/:id` | `Inward & Outward / OUT-2026-0157` |
| `/visitors` | `Visitor Book` |
| `/visitors/:id` | `Visitor Book / Suresh Jadhav` |
| `/nivedans` | `Nivedans` |
| `/nivedans/new` | `Nivedans / New Nivedan` |
| `/nivedans/:id` | `Nivedans / NIV-2026-01247` |
| `/nivedans/:id/edit` | `Nivedans / NIV-2026-01247 / Edit` |
| `/devworks` | `Development Works` |
| `/devworks/new` | `Development Works / New Project` |
| `/devworks/:id` | `Development Works / NH-4 Road Widening` |
| `/devworks/:id/edit` | `Development Works / NH-4 Road Widening / Edit` |
| `/karyakarta` | `Karyakarta` |
| `/karyakarta/new` | `Karyakarta / Add Worker` |
| `/karyakarta/:id` | `Karyakarta / Ramesh Patil` |
| `/karyakarta/areas` | `Constituency / Gram & Ward` |
| `/karyakarta/areas/:id` | `Constituency / Gram & Ward / Wadgaon Village` |
| `/karyakarta/booths` | `Constituency / Booth Structure` |
| `/karyakarta/booths/:id` | `Constituency / Booth Structure / Booth 145` |
| `/calendar` | `Calendar` |
| `/calendar/:id` | `Calendar / Road Inauguration` |
| `/whatsapp` | `WhatsApp` |
| `/whatsapp/broadcasts` | `WhatsApp / Broadcasts` |
| `/whatsapp/broadcasts/new` | `WhatsApp / Broadcasts / New Broadcast` |
| `/whatsapp/templates` | `WhatsApp / Templates` |
| `/whatsapp/delivery-log` | `WhatsApp / Delivery Log` |
| `/whatsapp/greetings` | `WhatsApp / Greeting Calendar` |
| `/reports` | `Reports` |
| `/reports/generate` | `Reports / Generate` |
| `/reports/history` | `Reports / History` |
| `/notifications` | `Notifications` |
| `/settings` | `Settings` |
| `/admin/users` | `User Management` |
| `/admin/users/new` | `User Management / Add User` |
| `/admin/users/:id` | `User Management / Rajesh Patil` |
| `/admin/audit-log` | `User Management / Audit Log` |

---

## 8. Mobile Navigation Behavior

On screens `≤ 768px`:

| Element | Desktop Behavior | Mobile Behavior |
|---------|-----------------|-----------------|
| Sidebar | Fixed, always visible, `240px` | Hidden by default, slides in as full overlay on ☰ tap |
| Topbar | Shows search bar + all actions | Search collapses to icon, actions stack |
| Global Search | Inline text input | Tap 🔍 icon → full-width search overlay |
| Breadcrumbs | Full path shown | Truncated to last 2 levels |
| Tables | Full width | Horizontal scroll with sticky first column |
| Form grids | 2-column | Single column stack |
| Card grids | Auto-fill columns | Single column stack |

**Mobile Sidebar Overlay:**
```
[Backdrop: rgba(0,0,0,0.5)] ← Tap backdrop to close
┌────────────────────┐
│  🏛️  MLA E-Office  │
│  ✕ Close            │  ← Also closes on menu item click
├────────────────────┤
│  Full sidebar menu  │
│  (same structure)   │
│  ...                │
└────────────────────┘
```

---

## 9. Page Transition & Loading States

| Scenario | Behavior |
|----------|----------|
| **Route change** | Instant (client-side routing via React Router). Content area fades in (150ms). |
| **Data loading** | Skeleton loader in content area. Sidebar + topbar remain visible. |
| **Form submit** | Button shows spinner + disabled state. Toast notification on success/error. |
| **Error page** | 404: "Page not found" with link back to Dashboard. 403: "Access denied" with role info. |
| **Empty state** | Illustration + message + CTA button (e.g., "No nivedans yet. Create your first.") |

---

## 10. Complete Route Count Summary

| Category | Routes | Pages |
|----------|--------|-------|
| Authentication | 3 | 3 |
| Dashboard | 1 | 1 |
| Inward & Outward | 8 | 8 |
| Visitor Book | 3 | 3 |
| Nivedans | 5 | 5 |
| Dev Works | 5 | 5 |
| Karyakarta | 5 | 5 |
| Gram/Ward | 3 | 3 |
| Booth Structure | 3 | 3 |
| Calendar | 4 | 4 |
| WhatsApp | 7 | 7 |
| Reports | 4 | 4 |
| Notifications | 1 | 1 |
| Settings | 1 (+4 tabs) | 1 |
| User Management | 5 | 5 |
| **Total** | **58** | **58** |

---

## 11. Quick Reference — Wireframe to Route Mapping

Maps each wireframe file to its corresponding route(s):

| Wireframe File | Primary Route | Additional Routes |
|----------------|---------------|-------------------|
| `login.html` | `/login` | `/login/first-time`, `/login/change-password` |
| `dashboard.html` | `/dashboard` | — |
| `nivedan_list.html` | `/nivedans` | — |
| `nivedan_form.html` | `/nivedans/new` | `/nivedans/:id/edit` |
| `nivedan_detail.html` | `/nivedans/:id` | — |
| `inward_list.html` | `/inward` | `/inward?tab=outward` |
| `inward_form.html` | `/inward/new` | `/inward/:id/edit` |
| `outward_form.html` | `/outward/new` | `/outward/new?ref=:id` |
| `visitor_book.html` | `/visitors` | `/visitors?date=YYYY-MM-DD` |
| `dev_works_list.html` | `/devworks` | `/devworks?view=table`, `/devworks?view=map` |
| `dev_works_detail.html` | `/devworks/:id` | `/devworks/:id/photos` |
| `karyakarta_list.html` | `/karyakarta` | `/karyakarta/import` |
| `booth_structure.html` | `/karyakarta/booths` | `/karyakarta/areas` |
| `calendar.html` | `/calendar` | `/calendar?view=week`, `/calendar?view=day` |
| `user_management.html` | `/admin/users` | `/admin/audit-log` |
| `reports.html` | `/reports` | `/reports/generate`, `/reports/history` |

---

## 12. Navigation State Indicators

### Active State Rules

| Scenario | Sidebar Behavior |
|----------|-----------------|
| On `/dashboard` | Dashboard item highlighted |
| On `/nivedans/new` | Nivedans item highlighted (parent) |
| On `/nivedans/:id` | Nivedans item highlighted (parent) |
| On `/karyakarta/booths` | Constituency expanded, Booths sub-item highlighted |
| On `/karyakarta/areas/:id` | Constituency expanded, Gram/Ward sub-item highlighted |
| On `/whatsapp/broadcasts` | WhatsApp item highlighted |
| On `/settings` | Settings item highlighted |
| On `/admin/users` | User Management item highlighted |

### Active State Styling

| State | Style |
|-------|-------|
| **Default** | `color: rgba(255,255,255,0.7)` — semi-transparent white |
| **Hover** | `background: rgba(255,255,255,0.08)` — subtle highlight |
| **Active** | `background: rgba(255,255,255,0.12)` — visible highlight, `color: #fff` — full white |
| **Section Label** | `color: rgba(255,255,255,0.35)` — muted, `font-size: 10px`, `uppercase`, `letter-spacing: 1.2px` |
