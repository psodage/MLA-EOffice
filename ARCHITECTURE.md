# MLA E-Office — System Architecture

> **Complete Technical Architecture, Data Flow, Infrastructure Design, and Deployment Blueprint**
> 
> *Related Documents:* [TECH_STACK.md](file:///s:/MLA%20E%20-%20Office/TECH_STACK.md) | [PROJECT_OVERVIEW.md](file:///s:/MLA%20E%20-%20Office/PROJECT_OVERVIEW.md) | [USER_ROLES.md](file:///s:/MLA%20E%20-%20Office/USER_ROLES.md) | [PROJECT_SECTIONS_BREAKDOWN.md](file:///s:/MLA%20E%20-%20Office/PROJECT_SECTIONS_BREAKDOWN.md)

---

## 1. Architecture Overview

### Architecture Style: **Modular Monolith**

The backend is a **single Node.js + Express application** with the codebase organized into **independent feature modules**. This approach gives the simplicity and speed of a monolith for the 1–2 month MVP timeline, while keeping the code clean enough to split into microservices later if scaling demands it.

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Architecture** | Modular Monolith | Fast to build, single deployment, easy debugging |
| **API Style** | REST API (versioned: `/api/v1/`) | Simple, well-understood, sufficient for all features |
| **Real-time** | No WebSockets — REST + manual refresh | Simplicity for MVP; real-time can be added later |
| **Caching** | No Redis — direct DB queries | Keep infrastructure minimal for free tier |
| **Background Jobs** | Node-cron for WhatsApp queue only | WhatsApp messages queued; everything else synchronous |
| **Environments** | Development (local) + Production | Minimal setup; staging added when team grows |
| **API Versioning** | `/api/v1/` from day one | Future-proofs the API for mobile app and third-party integrations |

---

## 2. High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                           │
├────────────────┬──────────────────┬──────────────────┬─────────────────────────┤
│                │                  │                  │                         │
│  🖥️ Web App    │  📱 Mobile App    │  🌐 Public Portal │  📲 WhatsApp           │
│  React + Vite  │  React Native    │  (Citizen Track)  │  (Citizens +           │
│  (Vercel)      │  (Future Phase)  │  (Vercel)         │   Booth Pramukhs)      │
│                │                  │                  │                         │
│  Desktop +     │  Android + iOS   │  No login needed  │  Meta Cloud API        │
│  Tablet +      │                  │  Tracking ID only │  (Inbound + Outbound)  │
│  Mobile        │                  │                  │                         │
│  (Responsive)  │                  │                  │                         │
└───────┬────────┴─────────┬────────┴────────┬─────────┴──────────┬──────────────┘
        │                  │                 │                    │
        │   HTTPS REST     │   HTTPS REST    │   HTTPS REST       │  Webhook
        │   /api/v1/*      │   /api/v1/*     │   /api/v1/public/* │  POST
        │                  │                 │                    │
        ▼                  ▼                 ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND API SERVER                                     │
│                     Node.js + Express (Render)                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐     │
│  │   Auth   │  │  Inward  │  │ Nivedan  │  │ Visitor  │  │  Dev Works   │     │
│  │  Module  │  │ Outward  │  │  Module  │  │  Module  │  │   Module     │     │
│  │          │  │  Module  │  │          │  │          │  │              │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────────┘     │
│                                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐     │
│  │Karyakarta│  │  Booth   │  │ Calendar │  │Dashboard │  │   Reports    │     │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │  │   Module     │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────────┘     │
│                                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐       │
│  │ WhatsApp │  │  User /  │  │ Notification │  │  Global Search      │       │
│  │  Module  │  │  RBAC    │  │   Module     │  │  Module             │       │
│  └──────────┘  └──────────┘  └──────────────┘  └──────────────────────┘       │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐       │
│  │                     SHARED SERVICES LAYER                          │       │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │       │
│  │  │   Auth   │ │   RBAC   │ │  Upload  │ │   AI     │ │  Audit  │ │       │
│  │  │Middleware│ │Middleware│ │ Service  │ │ Service  │ │ Logger  │ │       │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘ │       │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │       │
│  │  │WhatsApp  │ │  Email   │ │  Error   │ │   Cron   │            │       │
│  │  │ Service  │ │ Service  │ │ Handler  │ │Scheduler │            │       │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │       │
│  └─────────────────────────────────────────────────────────────────────┘       │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐       │
│  │                       ORM LAYER (Sequelize)                        │       │
│  └──────────────────────────────┬──────────────────────────────────────┘       │
└─────────────────────────────────┼──────────────────────────────────────────────┘
                                  │ SQL
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                       │
├─────────────────┬──────────────────┬──────────────────┬────────────────────────┤
│                 │                  │                  │                        │
│  🗄️ MySQL 8.x   │  ☁️ Cloudinary    │  🤖 Gemini API   │  📲 Meta WhatsApp      │
│  (Railway)      │  (File Storage)  │  (AI Drafting)   │  Cloud API             │
│                 │                  │                  │                        │
│  17+ tables     │  25GB free       │  Letter drafting │  Send: templates       │
│  All app data   │  Images, PDFs    │  Marathi/English │  Receive: webhooks     │
│                 │                  │                  │  Bot: inbound msgs     │
└─────────────────┴──────────────────┴──────────────────┴────────────────────────┘
```

---

## 3. Backend Module Architecture

### Directory Structure

```
mla-eoffice/
│
├── web/                              # FRONTEND — React + Vite
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/                   # Images, fonts, static files
│   │   ├── components/               # Reusable UI components
│   │   │   ├── common/               # Button, Input, Modal, Table, Badge, Toast
│   │   │   ├── layout/               # Sidebar, Header, Footer, PageWrapper
│   │   │   └── charts/               # Dashboard chart components (Recharts/D3)
│   │   ├── pages/                    # Route-level page components
│   │   │   ├── auth/                 # LoginPage
│   │   │   ├── dashboard/            # DashboardPage
│   │   │   ├── inward/               # InwardListPage, InwardFormPage, InwardDetailPage
│   │   │   ├── outward/              # OutwardListPage, OutwardFormPage, OutwardDetailPage
│   │   │   ├── nivedan/              # NivedanListPage, NivedanFormPage, NivedanDetailPage
│   │   │   ├── visitor/              # VisitorListPage, VisitorFormPage
│   │   │   ├── devworks/             # DevWorksListPage, DevWorksFormPage, DevWorksDetailPage
│   │   │   ├── karyakarta/           # KaryakartaListPage, KaryakartaFormPage
│   │   │   ├── booth/                # BoothListPage, BoothDetailPage, VerificationPage
│   │   │   ├── geography/            # GramWardListPage (villages, wards, talukas)
│   │   │   ├── calendar/             # CalendarPage
│   │   │   ├── whatsapp/             # BroadcastPage, MessageLogPage
│   │   │   ├── reports/              # ReportsPage
│   │   │   ├── users/                # UserManagementPage (Admin only)
│   │   │   ├── notifications/        # NotificationListPage
│   │   │   ├── audit/                # AuditLogPage
│   │   │   └── public/               # CitizenTrackingPage (no auth)
│   │   ├── services/                 # API call functions (axios)
│   │   │   ├── api.js                # Axios instance with base URL + auth interceptor
│   │   │   ├── auth.service.js
│   │   │   ├── nivedan.service.js
│   │   │   ├── inward.service.js
│   │   │   └── ... (one per module)
│   │   ├── store/                    # Zustand state stores
│   │   │   ├── authStore.js          # Auth state (user, token, role)
│   │   │   └── uiStore.js            # UI state (sidebar, theme, language)
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── usePermission.js      # RBAC hook — checks if current role can access
│   │   │   └── useDebounce.js
│   │   ├── i18n/                     # Internationalization
│   │   │   ├── i18n.js               # react-i18next config
│   │   │   └── locales/
│   │   │       ├── en.json           # English translations
│   │   │       └── mr.json           # Marathi translations
│   │   ├── utils/                    # Helper functions
│   │   │   ├── formatDate.js
│   │   │   ├── formatCurrency.js     # Indian number formatting (₹1,00,000)
│   │   │   └── constants.js          # Status colors, category lists, etc.
│   │   ├── styles/                   # CSS
│   │   │   ├── index.css             # Global styles + CSS custom properties
│   │   │   ├── variables.css         # Design tokens (colors, spacing, typography)
│   │   │   └── components/           # CSS Modules per component
│   │   ├── router/
│   │   │   └── AppRouter.jsx         # React Router routes + protected route wrapper
│   │   ├── App.jsx                   # Root component
│   │   └── main.jsx                  # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env                          # VITE_API_BASE_URL
│
├── api/                              # BACKEND — Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js           # Sequelize MySQL connection config
│   │   │   ├── cloudinary.js         # Cloudinary SDK config
│   │   │   ├── gemini.js             # Google Gemini AI config
│   │   │   ├── whatsapp.js           # Meta WhatsApp API config
│   │   │   ├── email.js              # SMTP / email service config
│   │   │   └── constants.js          # App-wide constants, enums
│   │   │
│   │   ├── modules/                  # FEATURE MODULES (modular monolith)
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── auth.service.js
│   │   │   │   └── auth.validation.js
│   │   │   ├── inward/
│   │   │   │   ├── inward.controller.js
│   │   │   │   ├── inward.routes.js
│   │   │   │   ├── inward.service.js
│   │   │   │   └── inward.validation.js
│   │   │   ├── outward/
│   │   │   │   ├── outward.controller.js
│   │   │   │   ├── outward.routes.js
│   │   │   │   ├── outward.service.js
│   │   │   │   └── outward.validation.js
│   │   │   ├── nivedan/
│   │   │   │   ├── nivedan.controller.js
│   │   │   │   ├── nivedan.routes.js
│   │   │   │   ├── nivedan.service.js
│   │   │   │   └── nivedan.validation.js
│   │   │   ├── visitor/
│   │   │   │   ├── visitor.controller.js
│   │   │   │   ├── visitor.routes.js
│   │   │   │   ├── visitor.service.js
│   │   │   │   └── visitor.validation.js
│   │   │   ├── devworks/
│   │   │   │   ├── devworks.controller.js
│   │   │   │   ├── devworks.routes.js
│   │   │   │   ├── devworks.service.js
│   │   │   │   └── devworks.validation.js
│   │   │   ├── karyakarta/
│   │   │   │   ├── karyakarta.controller.js
│   │   │   │   ├── karyakarta.routes.js
│   │   │   │   ├── karyakarta.service.js
│   │   │   │   └── karyakarta.validation.js
│   │   │   ├── booth/
│   │   │   │   ├── booth.controller.js
│   │   │   │   ├── booth.routes.js
│   │   │   │   ├── booth.service.js
│   │   │   │   └── booth.validation.js
│   │   │   ├── geography/
│   │   │   │   ├── geography.controller.js
│   │   │   │   ├── geography.routes.js
│   │   │   │   └── geography.service.js
│   │   │   ├── calendar/
│   │   │   │   ├── calendar.controller.js
│   │   │   │   ├── calendar.routes.js
│   │   │   │   ├── calendar.service.js
│   │   │   │   └── calendar.validation.js
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.controller.js
│   │   │   │   ├── dashboard.routes.js
│   │   │   │   └── dashboard.service.js
│   │   │   ├── whatsapp/
│   │   │   │   ├── whatsapp.controller.js
│   │   │   │   ├── whatsapp.routes.js
│   │   │   │   ├── whatsapp.service.js
│   │   │   │   ├── whatsapp.webhook.js    # Handles inbound webhooks from Meta
│   │   │   │   └── whatsapp.queue.js      # Message queue (node-cron based)
│   │   │   ├── user/
│   │   │   │   ├── user.controller.js
│   │   │   │   ├── user.routes.js
│   │   │   │   ├── user.service.js
│   │   │   │   └── user.validation.js
│   │   │   ├── report/
│   │   │   │   ├── report.controller.js
│   │   │   │   ├── report.routes.js
│   │   │   │   └── report.service.js
│   │   │   ├── notification/
│   │   │   │   ├── notification.controller.js
│   │   │   │   ├── notification.routes.js
│   │   │   │   └── notification.service.js
│   │   │   ├── search/
│   │   │   │   ├── search.controller.js
│   │   │   │   ├── search.routes.js
│   │   │   │   └── search.service.js
│   │   │   └── audit/
│   │   │       ├── audit.controller.js
│   │   │       ├── audit.routes.js
│   │   │       └── audit.service.js
│   │   │
│   │   ├── models/                   # Sequelize model definitions
│   │   │   ├── index.js              # Model loader + associations
│   │   │   ├── User.js
│   │   │   ├── InwardEntry.js
│   │   │   ├── OutwardEntry.js
│   │   │   ├── Nivedan.js
│   │   │   ├── NivedanTimeline.js
│   │   │   ├── Visitor.js
│   │   │   ├── DevelopmentWork.js
│   │   │   ├── DevWorkPhoto.js
│   │   │   ├── Karyakarta.js
│   │   │   ├── Booth.js
│   │   │   ├── BoothVerification.js
│   │   │   ├── Village.js
│   │   │   ├── Ward.js
│   │   │   ├── Taluka.js
│   │   │   ├── GramPanchayat.js
│   │   │   ├── Category.js
│   │   │   ├── Department.js
│   │   │   ├── CalendarEvent.js
│   │   │   ├── WhatsappLog.js
│   │   │   ├── Notification.js
│   │   │   ├── AuditLog.js
│   │   │   └── Delegation.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js     # JWT token verification
│   │   │   ├── rbac.middleware.js     # Role-based route protection
│   │   │   ├── timeRestriction.middleware.js  # Office hours enforcement
│   │   │   ├── upload.middleware.js   # Multer file upload config
│   │   │   ├── rateLimiter.js        # Express rate limiter
│   │   │   ├── errorHandler.js       # Global error handler
│   │   │   ├── auditLogger.js        # Auto-logs every mutation to audit_logs
│   │   │   └── validator.js          # Joi/Zod schema validation wrapper
│   │   │
│   │   ├── services/                 # Shared services (cross-module)
│   │   │   ├── ai.service.js         # Gemini API — letter drafting
│   │   │   ├── cloudinary.service.js # File upload/delete to Cloudinary
│   │   │   ├── whatsapp.service.js   # Meta WhatsApp Cloud API client
│   │   │   ├── email.service.js      # SMTP email sender
│   │   │   ├── sms.service.js        # SMS gateway (future)
│   │   │   ├── notification.service.js  # Creates in-app notifications
│   │   │   ├── autoRoute.service.js  # Nivedan auto-routing logic
│   │   │   ├── escalation.service.js # Nivedan escalation checker (cron)
│   │   │   ├── greeting.service.js   # Birthday/festival greeting sender (cron)
│   │   │   └── backup.service.js     # Database backup automation
│   │   │
│   │   ├── cron/
│   │   │   └── scheduler.js          # All cron job registrations
│   │   │                             #   - WhatsApp message queue processor
│   │   │                             #   - Nivedan escalation checker (daily)
│   │   │                             #   - Birthday greeting sender (daily 8 AM)
│   │   │                             #   - Database backup trigger
│   │   │                             #   - Nivedan auto-archive (resolved > 90 days)
│   │   │
│   │   ├── utils/
│   │   │   ├── idGenerator.js        # INW/2026/0001, OUT/2026/0001, NIV-2026-00001
│   │   │   ├── dateUtils.js          # Date formatting, IST timezone helpers
│   │   │   ├── responseHelper.js     # Standard API response format
│   │   │   ├── pagination.js         # Pagination helper (page, limit, offset)
│   │   │   └── indianNumber.js       # Indian number formatting (1,00,000)
│   │   │
│   │   ├── migrations/              # Sequelize DB migrations
│   │   ├── seeders/                 # Initial seed data
│   │   │
│   │   ├── app.js                   # Express app setup (middleware, routes, error handler)
│   │   └── server.js               # HTTP server entry point
│   │
│   ├── logs/                        # Winston log files (gitignored)
│   ├── backups/                     # DB backup dumps (gitignored)
│   ├── package.json
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Template for env vars
│   └── ecosystem.config.js          # PM2 process config (production)
│
├── mobile/                          # MOBILE — React Native (Future Phase)
│   └── (to be scaffolded later)
│
├── shared/                          # SHARED — Cross-platform utilities
│   ├── constants/
│   │   ├── statuses.js              # Nivedan statuses, Dev work statuses
│   │   ├── categories.js            # All category/enum lists
│   │   └── roles.js                 # User role definitions
│   ├── validators/
│   │   ├── nivedan.validator.js     # Shared validation schemas
│   │   ├── inward.validator.js
│   │   └── user.validator.js
│   └── utils/
│       ├── formatters.js            # Date, currency, number formatters
│       └── helpers.js               # Common utility functions
│
├── .gitignore
├── README.md
└── package.json                     # Root workspace config (npm workspaces)
```

---

## 4. API Route Map

All API routes are prefixed with `/api/v1/`.

### Authentication

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|:---:|-------|
| POST | `/api/v1/auth/login` | Login with username + password | ❌ | All |
| POST | `/api/v1/auth/refresh` | Refresh expired access token | 🔑 Refresh token | All |
| POST | `/api/v1/auth/logout` | Logout and invalidate refresh token | 🔑 | All |
| GET | `/api/v1/auth/me` | Get current user profile | 🔑 | All |

### Inward

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/inward` | List inward entries (paginated, filtered) | MLA, PA, Receptionist (own) |
| GET | `/api/v1/inward/:id` | Get single inward detail | MLA, PA, Receptionist (own) |
| POST | `/api/v1/inward` | Create new inward entry | PA, Receptionist |
| PATCH | `/api/v1/inward/:id` | Update inward entry | PA |
| PATCH | `/api/v1/inward/:id/assign` | Assign to staff member | PA |
| PATCH | `/api/v1/inward/:id/status` | Change status | PA |

### Outward

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/outward` | List outward entries | MLA, PA |
| GET | `/api/v1/outward/:id` | Get single outward detail | MLA, PA |
| POST | `/api/v1/outward` | Create new outward entry | PA |
| PATCH | `/api/v1/outward/:id` | Update outward (before finalize) | PA |
| POST | `/api/v1/outward/ai-draft` | Generate AI letter draft | PA |
| POST | `/api/v1/outward/:id/finalize` | Finalize and create outward record | PA |

### Nivedan

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/nivedans` | List nivedans (paginated, filtered) | MLA, PA, Receptionist (own), Auditor (assigned) |
| GET | `/api/v1/nivedans/:id` | Get nivedan detail + timeline | MLA, PA, Receptionist (own), Auditor (assigned) |
| POST | `/api/v1/nivedans` | Register new nivedan | PA, Receptionist |
| PATCH | `/api/v1/nivedans/:id` | Update nivedan details | PA |
| PATCH | `/api/v1/nivedans/:id/status` | Change status (triggers WhatsApp) | PA |
| PATCH | `/api/v1/nivedans/:id/assign` | Assign to staff/department | PA |
| POST | `/api/v1/nivedans/:id/notes` | Add internal note to timeline | PA, Assigned Staff |
| GET | `/api/v1/nivedans/citizen/:mobile` | Get all nivedans by citizen mobile | PA, Receptionist |

### Public (No Auth)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:---:|
| GET | `/api/v1/public/track/:trackingId` | Citizen complaint status lookup | ❌ |

### Visitor

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/visitors` | List visitors (date filtered) | MLA, PA, Receptionist (own) |
| POST | `/api/v1/visitors` | Register new visitor | PA, Receptionist |
| PATCH | `/api/v1/visitors/:id` | Update visitor (checkout time) | PA, Receptionist |
| GET | `/api/v1/visitors/check-repeat/:mobile` | Check if repeat visitor | PA, Receptionist |

### Development Works

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/devworks` | List development works | MLA, PA, Auditor |
| GET | `/api/v1/devworks/:id` | Get project detail + photos | MLA, PA, Auditor |
| POST | `/api/v1/devworks` | Create new project | PA |
| PATCH | `/api/v1/devworks/:id` | Update project details | PA |
| PATCH | `/api/v1/devworks/:id/status` | Update status + progress % | PA, Auditor |
| POST | `/api/v1/devworks/:id/photos` | Upload geotagged photos | PA, Auditor |
| PATCH | `/api/v1/devworks/:id/budget` | Update budget spent | PA |

### Karyakarta

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/karyakartas` | List workers (filtered by booth/ward) | MLA, PA |
| GET | `/api/v1/karyakartas/:id` | Get worker detail | MLA, PA |
| POST | `/api/v1/karyakartas` | Add new worker | PA, Booth Pramukh (own booth) |
| PATCH | `/api/v1/karyakartas/:id` | Update worker details | PA |
| PATCH | `/api/v1/karyakartas/:id/deactivate` | Mark as inactive | PA |
| POST | `/api/v1/karyakartas/bulk-import` | Import from Excel file | PA |

### Booth

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/booths` | List all booths | MLA, PA, Auditor |
| GET | `/api/v1/booths/:id` | Get booth detail + workers | MLA, PA, Auditor |
| POST | `/api/v1/booths/:id/verify` | Submit verification report | Auditor |
| PATCH | `/api/v1/booths/:id/pramukh` | Assign booth pramukh | PA |

### Geography

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/geography/talukas` | List talukas | All |
| GET | `/api/v1/geography/gram-panchayats?taluka_id=X` | List gram panchayats | All |
| GET | `/api/v1/geography/villages?gp_id=X` | List villages | All |
| GET | `/api/v1/geography/wards` | List city wards | All |
| POST | `/api/v1/geography/bulk-import` | Import from Excel | Admin, PA |

### Calendar

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/calendar` | List events (date range) | MLA, PA, Receptionist (view), Auditor (view) |
| POST | `/api/v1/calendar` | Create event | MLA, PA |
| PATCH | `/api/v1/calendar/:id` | Update event | MLA, PA |
| DELETE | `/api/v1/calendar/:id` | Cancel event (soft delete) | MLA, PA |

### WhatsApp

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/v1/whatsapp/broadcast` | Send broadcast message | PA |
| GET | `/api/v1/whatsapp/logs` | View message log | MLA, PA |
| POST | `/api/v1/whatsapp/retry/:id` | Retry failed message | PA |
| POST | `/api/v1/whatsapp/webhook` | Meta webhook — delivery status + inbound | ❌ (Meta verified) |

### Dashboard

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/dashboard/kpis` | Get all KPI counter values | MLA, PA |
| GET | `/api/v1/dashboard/charts/:chartType` | Get chart data (nivedan-trend, visitor-footfall, etc.) | MLA, PA |
| GET | `/api/v1/dashboard/activity-feed` | Get latest 20 activity items | MLA, PA |

### Reports

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/v1/reports/generate` | Generate report (returns PDF/Excel URL) | MLA, PA |
| GET | `/api/v1/reports/download/:id` | Download generated report file | MLA, PA |

### Users & RBAC

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/users` | List all users | Admin, MLA (view) |
| POST | `/api/v1/users` | Create new user | Admin |
| PATCH | `/api/v1/users/:id` | Update user details / role | Admin |
| PATCH | `/api/v1/users/:id/deactivate` | Deactivate user | Admin |
| POST | `/api/v1/users/:id/reset-password` | Reset user password | Admin |
| POST | `/api/v1/users/delegate` | PA delegates to another user | PA |

### Notifications

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/notifications` | Get user's notifications | All (own) |
| GET | `/api/v1/notifications/unread-count` | Get unread count (for bell icon badge) | All |
| PATCH | `/api/v1/notifications/:id/read` | Mark as read | All (own) |
| PATCH | `/api/v1/notifications/read-all` | Mark all as read | All (own) |

### Search

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/search?q=keyword` | Global search across all modules | All (role-filtered) |

### Audit

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/audit-logs` | View audit logs (paginated, filtered) | Admin, MLA |

### Upload

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/v1/upload/direct-token` | Get Cloudinary signed upload token (for <2MB direct upload) | All authenticated |
| POST | `/api/v1/upload` | Server-side upload (for ≥2MB files) | All authenticated |

---

## 5. Data Flow Diagrams

### 5A. Nivedan Creation Flow

```
Citizen visits office
        │
        ▼
┌─────────────────┐    POST /api/v1/visitors     ┌──────────────┐
│   Receptionist   │ ──────────────────────────▶  │   MySQL DB   │
│   (Web App)      │                              │  visitors    │
│                  │    POST /api/v1/nivedans     │  table       │
│   Fills nivedan  │ ──────────────────────────▶  │  nivedans    │
│   form           │                              │  table       │
└─────────────────┘                               └──────┬───────┘
                                                         │
                                                         │ After insert
                                                         ▼
                                                  ┌──────────────┐
                                                  │ Auto-Route   │
                                                  │ Service      │
                                                  │              │
                                                  │ Checks       │
                                                  │ category →   │
                                                  │ assigns to   │
                                                  │ staff/dept   │
                                                  └──────┬───────┘
                                                         │
                                              ┌──────────┼──────────┐
                                              │                     │
                                              ▼                     ▼
                                      ┌──────────────┐     ┌──────────────┐
                                      │ Notification │     │  WhatsApp    │
                                      │ Service      │     │  Queue       │
                                      │              │     │              │
                                      │ In-app alert │     │ Queues ack   │
                                      │ to PA        │     │ msg for      │
                                      └──────────────┘     │ citizen      │
                                                           └──────┬───────┘
                                                                  │
                                                                  │ Cron processes queue
                                                                  ▼
                                                           ┌──────────────┐
                                                           │ Meta WhatsApp│
                                                           │ Cloud API    │
                                                           │              │
                                                           │ Sends ack    │
                                                           │ to citizen   │
                                                           └──────┬───────┘
                                                                  │
                                                                  │ Webhook callback
                                                                  ▼
                                                           ┌──────────────┐
                                                           │ whatsapp_logs│
                                                           │ table        │
                                                           │              │
                                                           │ Updates:     │
                                                           │ sent/        │
                                                           │ delivered/   │
                                                           │ read/failed  │
                                                           └──────────────┘
```

### 5B. AI Letter Drafting Flow

```
PA clicks "Draft with AI"
        │
        ▼
┌─────────────────┐    POST /api/v1/outward/ai-draft
│   Web App        │ ──────────────────────────────────▶  ┌──────────────┐
│                  │    Body: {                           │  Backend     │
│   AI Draft Form  │      reference_inward_id,            │              │
│                  │      recipient_dept,                  │  Builds AI   │
│                  │      subject,                         │  prompt with │
│                  │      language: "marathi",             │  letter      │
│                  │      tone: "formal"                   │  format +    │
│                  │    }                                  │  few-shot    │
│                  │                                      │  examples    │
│                  │                                      └──────┬───────┘
│                  │                                             │
│                  │                                             │ API call
│                  │                                             ▼
│                  │                                      ┌──────────────┐
│                  │                                      │ Google       │
│                  │                                      │ Gemini API   │
│                  │    Returns: { draft_text }            │              │
│                  │ ◀─────────────────────────────────── │ Returns      │
│                  │                                      │ letter text  │
│                  │                                      └──────────────┘
│  PA reviews      │
│  and edits draft │
│                  │
│  Clicks          │    POST /api/v1/outward/:id/finalize
│  "Finalize"      │ ──────────────────────────────────▶  ┌──────────────┐
│                  │                                      │  Backend     │
│                  │                                      │              │
│                  │                                      │  Creates     │
│                  │                                      │  outward     │
│                  │                                      │  entry +     │
│                  │                                      │  generates   │
│                  │                                      │  PDF +       │
│                  │                                      │  links to    │
│                  │                                      │  ref inward  │
└─────────────────┘                                      └──────────────┘
```

### 5C. File Upload Flow (Hybrid)

```
User selects file(s)
        │
        ├── File < 2MB ─────────────────────┐
        │                                    │
        │   GET /api/v1/upload/direct-token  │
        │   Backend returns signed params    │
        │                                    ▼
        │                            ┌──────────────┐
        │                            │  Cloudinary   │
        │                            │  (Direct      │
        │                            │   Upload)     │
        │                            │              │
        │                            │  Returns URL  │
        │                            └──────────────┘
        │
        │
        └── File ≥ 2MB ─────────────────────┐
                                             │
            POST /api/v1/upload              │
            (multipart form data)            │
                                             ▼
                                      ┌──────────────┐
                                      │  Backend     │
                                      │  (Multer)    │
                                      │              │
                                      │  Validates   │
                                      │  file type   │
                                      │  & size      │
                                      └──────┬───────┘
                                             │
                                             │ Cloudinary SDK
                                             ▼
                                      ┌──────────────┐
                                      │  Cloudinary   │
                                      │              │
                                      │  Stores file  │
                                      │  Returns URL  │
                                      └──────────────┘
```

### 5D. WhatsApp Webhook Flow (Inbound + Delivery Status)

```
┌──────────────────┐
│  Meta WhatsApp   │
│  Cloud API       │
│                  │
│  Sends webhook   │
│  POST to our     │
│  endpoint        │
└────────┬─────────┘
         │
         │  POST /api/v1/whatsapp/webhook
         ▼
┌──────────────────────────────────────────────┐
│  whatsapp.webhook.js                          │
│                                              │
│  ├── Verify webhook signature (Meta token)    │
│  │                                            │
│  ├── Parse message type:                      │
│  │                                            │
│  │   TYPE: "status_update"                    │
│  │   ├── Extract: message_id, status          │
│  │   └── Update whatsapp_logs table           │
│  │       (sent → delivered → read → failed)   │
│  │                                            │
│  │   TYPE: "inbound_message"                  │
│  │   ├── Extract: sender_mobile, text         │
│  │   ├── Check if text matches Tracking ID    │
│  │   │   (regex: /^NIV-\d{4}-\d{5}$/)        │
│  │   ├── YES → Lookup nivedan status          │
│  │   │         → Send reply with status       │
│  │   └── NO  → Send help message              │
│  │           "कृपया ट्रॅकिंग आयडी पाठवा"     │
│  │                                            │
│  └── If delivery failed:                      │
│      ├── Retry count < 2 → Re-queue message   │
│      └── Retry count ≥ 2 → Trigger SMS        │
│          fallback + notify PA                  │
└──────────────────────────────────────────────┘
```

---

## 6. Authentication & Authorization Flow

```
┌──────────────┐     POST /api/v1/auth/login        ┌──────────────────┐
│  Web App     │ ──────────────────────────────────▶ │  Auth Module     │
│  Login Page  │     { username, password }          │                  │
└──────────────┘                                     │  1. Find user    │
                                                     │  2. bcrypt verify│
                                                     │  3. Check active │
                                                     │  4. Check office │
                                                     │     hours (role) │
                                                     │  5. Generate JWT │
                                                     │  6. Log to audit │
                                                     └────────┬─────────┘
                                                              │
                              Returns:                        │
                              {                               │
                                accessToken (24h),            │
                                refreshToken (7d),            │
                                user: { id, name, role,       │
                                        modules[] }           │
                              }                               │
                                                              │
┌──────────────────────────────────────────────────────────────┘
│
│  Subsequent API requests:
│
│  Request Header: Authorization: Bearer <accessToken>
│         │
│         ▼
│  ┌────────────────────┐
│  │ auth.middleware.js  │ → Verifies JWT → Extracts user + role
│  └─────────┬──────────┘
│            │
│            ▼
│  ┌────────────────────┐
│  │ rbac.middleware.js  │ → Checks if role has permission for this route
│  └─────────┬──────────┘
│            │
│            ▼
│  ┌────────────────────────────┐
│  │ timeRestriction.middleware │ → Checks if current time is within
│  │                            │   allowed access hours for this role
│  └─────────┬──────────────────┘
│            │
│            ▼
│  ┌────────────────────┐
│  │ Controller logic    │ → Executes request
│  └─────────┬──────────┘
│            │
│            ▼
│  ┌────────────────────┐
│  │ auditLogger.js      │ → Logs action to audit_logs table
│  └────────────────────┘
```

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": 42,
    "username": "suresh_pa",
    "role": "PA",
    "modules": ["inward", "outward", "nivedan", "visitor", "devworks", "karyakarta", "booth", "geography", "calendar", "whatsapp", "dashboard", "reports", "notifications"],
    "iat": 1722534000,
    "exp": 1722620400
  }
}
```

---

## 7. Cron Jobs (Scheduled Tasks)

| Job | Schedule | Description |
|-----|----------|-------------|
| **WhatsApp Queue Processor** | Every 30 seconds | Picks pending messages from queue and sends via Meta API. Batch: 10 messages per cycle. |
| **Nivedan Escalation Checker** | Daily at 9:00 AM IST | Scans all Pending/In Progress nivedans. If age > category deadline → Level 1 alert to PA. If Level 1 ignored for 3+ more days → Level 2 alert to MLA. |
| **Birthday Greeting Sender** | Daily at 8:00 AM IST | Queries karyakartas and citizens with DOB matching today. Queues birthday WhatsApp messages. |
| **Festival Greeting Sender** | As per festival calendar | Triggered on festival dates. Queues greeting broadcast to all workers. |
| **Auto-Archive Nivedans** | Weekly (Sunday midnight) | Moves nivedans with status `Resolved` or `Rejected` older than 90 days to `Archived` status. |
| **Database Backup** | Daily at 2:00 AM IST (incremental) + Weekly Sunday 3:00 AM IST (full) | Creates MySQL dump and stores in backup directory. |
| **System Health Check** | Every 15 minutes | Checks DB connection, Cloudinary API, WhatsApp API, Gemini API. If any fails → email + in-app alert to Admin. |

---

## 8. Error Handling Strategy

### API Error Response Format

All API errors follow a consistent JSON structure:

```json
{
  "success": false,
  "error": {
    "code": "NIVEDAN_NOT_FOUND",
    "message": "Nivedan with tracking ID NIV-2026-00999 not found",
    "statusCode": 404
  }
}
```

### API Success Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 25,
    "totalItems": 143,
    "totalPages": 6
  }
}
```

### Error Severity Levels

| Level | Examples | Action |
|-------|---------|--------|
| **Critical** | DB connection lost, Server crash, Out of memory | Email + in-app alert to Admin immediately |
| **High** | WhatsApp API failure, Gemini API failure, Cloudinary upload failure | In-app notification to Admin; log to error file |
| **Medium** | Validation errors, Auth failures, Rate limit exceeded | Log to file; return error response to client |
| **Low** | 404 Not Found, duplicate entries, business rule violations | Return error response to client; no alert |

### Critical Error Alert Flow

```
Critical error occurs
        │
        ▼
┌──────────────────┐
│  errorHandler.js │
│                  │
│  1. Log to       │
│     winston      │
│     error file   │
│                  │
│  2. Create       │
│     in-app       │─────────────▶  Admin sees red alert
│     notification │               in Notification Center
│                  │
│  3. Send email   │─────────────▶  Admin email inbox
│     alert        │
│                  │
│  4. Return 500   │
│     to client    │
└──────────────────┘
```

---

## 9. Logging Strategy

### Logger: Winston

| Log Level | File | Content |
|-----------|------|---------|
| `error` | `logs/error.log` | Exceptions, stack traces, critical failures |
| `warn` | `logs/combined.log` | Deprecation warnings, retry attempts, failed validations |
| `info` | `logs/combined.log` | HTTP requests (morgan), successful operations, cron job runs |
| `debug` | `logs/debug.log` (dev only) | Detailed debugging info, SQL queries, API payloads |

### Log Rotation

| Setting | Value |
|---------|-------|
| Max file size | 10 MB per file |
| Max files | 14 (2 weeks of daily rotation) |
| Compression | Gzip old log files |
| Retention | 30 days |

### Audit Log (Separate from Application Logs)

The audit log is stored in the **MySQL `audit_logs` table** (not log files) for query-ability and reporting. Every data mutation is auto-captured by the `auditLogger.js` middleware:

```json
{
  "id": 12345,
  "user_id": 5,
  "action": "UPDATE",
  "module": "nivedan",
  "entity_type": "Nivedan",
  "entity_id": 42,
  "old_values": { "status": "Pending" },
  "new_values": { "status": "In Progress" },
  "ip_address": "103.245.67.89",
  "timestamp": "2026-08-01T10:30:00+05:30"
}
```

---

## 10. Security Architecture

| Layer | Protection |
|-------|-----------|
| **Transport** | HTTPS everywhere (SSL auto-provisioned by Vercel/Render) |
| **Authentication** | JWT (HS256) — access token in httpOnly cookie; refresh token stored securely |
| **Authorization** | RBAC middleware on every route — checks role + module permissions |
| **Time Restriction** | Office hours enforcement for Receptionist, Office Staff, Auditor |
| **Password** | bcrypt hash (salt rounds: 12). Minimum 8 chars, 1 uppercase, 1 number. |
| **Rate Limiting** | 100 requests / 15 minutes per IP (configurable). Login: 5 attempts / 15 min. |
| **Input Validation** | Joi/Zod schema validation on every request body |
| **SQL Injection** | Prevented by Sequelize ORM (parameterized queries) |
| **XSS** | Helmet.js CSP headers; React auto-escapes output |
| **CORS** | Whitelist: only frontend domain (`eoffice.mlaname.in`) |
| **File Upload** | Allowed types: PDF, JPG, PNG only. Max size: 10MB. Validated on both client and server. |
| **Audit Trail** | Every mutation logged with user, old/new values, IP, timestamp |
| **No Delete** | Soft delete only — records marked as cancelled/archived, never physically removed |
| **Webhook Verification** | Meta WhatsApp webhook signature verification to prevent spoofing |

---

## 11. Deployment Architecture

### Domain Strategy

Since each MLA gets a **separate self-hosted instance**, the simplest approach:

| Component | URL | Hosted On |
|-----------|-----|-----------|
| **Frontend** | `eoffice.mlaname.in` | Vercel |
| **Backend API** | `api.eoffice.mlaname.in` | Render |
| **Public Tracking** | `eoffice.mlaname.in/track` | Vercel (same as frontend) |

For MLAs without a custom domain, use a shared subdomain pattern:
- `mlaname.mlaeoffice.com` (frontend)
- `mlaname-api.mlaeoffice.com` (backend)

### Infrastructure Diagram

```
                    ┌─────────────────────────────────────┐
                    │            INTERNET                  │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────┴──────────────────────┐
                    │          CLOUDFLARE (Optional)       │
                    │      DNS + DDoS Protection + CDN     │
                    └──────┬─────────────────┬────────────┘
                           │                 │
              ┌────────────┴───┐    ┌───────┴────────────┐
              │                │    │                    │
              ▼                │    ▼                    │
┌──────────────────────┐       │  ┌────────────────────┐ │
│      VERCEL          │       │  │      RENDER        │ │
│  (Frontend Hosting)  │       │  │  (Backend Hosting) │ │
│                      │       │  │                    │ │
│  ┌────────────────┐  │       │  │  ┌──────────────┐  │ │
│  │ React + Vite   │  │       │  │  │ Node.js +    │  │ │
│  │ Static Build   │  │       │  │  │ Express      │  │ │
│  │ (index.html +  │  │       │  │  │ (API Server) │  │ │
│  │  JS/CSS/assets)│  │  API  │  │  │              │  │ │
│  │               ├──┼───────┼──┼──▶              │  │ │
│  │ CDN: Global   │  │Calls  │  │  │ PM2 Process  │  │ │
│  │ Edge Network  │  │       │  │  │ Manager      │  │ │
│  │               │  │       │  │  │              │  │ │
│  │ SSL: Auto     │  │       │  │  │ SSL: Auto    │  │ │
│  └────────────────┘  │       │  │  └──────┬───────┘  │ │
│                      │       │  │         │          │ │
│  ┌────────────────┐  │       │  │         │ SQL      │ │
│  │ Public Tracking│  │       │  │         │          │ │
│  │ Page (no auth) │  │       │  │         ▼          │ │
│  └────────────────┘  │       │  │  ┌──────────────┐  │ │
└──────────────────────┘       │  │  │   RAILWAY    │  │ │
                               │  │  │  MySQL 8.x   │  │ │
                               │  │  │              │  │ │
                               │  │  │  17+ tables  │  │ │
                               │  │  │  Auto backup │  │ │
                               │  │  │  SSL: Auto   │  │ │
                               │  │  └──────────────┘  │ │
                               │  └────────────────────┘ │
                               │                         │
                               │  ┌────────────────────┐ │
                               │  │    CLOUDINARY      │ │
                               │  │  (File Storage)    │ │
                               │  │                    │ │
                               │  │  PDFs, Images      │ │
                               │  │  25GB Free         │ │
                               │  │  CDN Delivery      │ │
                               │  └────────────────────┘ │
                               │                         │
                               │  ┌────────────────────┐ │
                               │  │   META WHATSAPP    │ │
                               │  │  Cloud API         │ │
                               │  │                    │ │
                               │  │  Outbound msgs     │ │
                               │  │  Inbound webhook   │ │
                               │  │  Delivery status   │ │
                               │  └────────────────────┘ │
                               │                         │
                               │  ┌────────────────────┐ │
                               │  │   GOOGLE GEMINI    │ │
                               │  │  AI API            │ │
                               │  │                    │ │
                               │  │  Letter drafting   │ │
                               │  │  Marathi/English   │ │
                               │  └────────────────────┘ │
                               └─────────────────────────┘
```

### Deployment Pipeline

```
Developer pushes to GitHub
        │
        ├── Push to `main` branch
        │
        ├──────────────────────┐
        │                      │
        ▼                      ▼
┌──────────────┐      ┌──────────────┐
│   VERCEL     │      │   RENDER     │
│              │      │              │
│ Auto-detects │      │ Auto-detects │
│ web/ folder  │      │ api/ folder  │
│              │      │              │
│ Runs:        │      │ Runs:        │
│ npm run build│      │ npm install  │
│ (Vite build) │      │ npm start    │
│              │      │ (PM2)        │
│ Deploys to   │      │              │
│ CDN edge     │      │ Deploys to   │
│              │      │ container    │
└──────────────┘      └──────────────┘
```

---

## 12. Database Backup Strategy

| Backup Type | Frequency | Time (IST) | Method | Storage |
|-------------|-----------|-----------|--------|---------|
| **Incremental** | Daily | 2:00 AM | MySQL binary log backup | Local `api/backups/` + Cloudinary `/backups/` |
| **Full** | Weekly (Sunday) | 3:00 AM | `mysqldump --all-databases` | Local `api/backups/` + Cloudinary `/backups/` |
| **Retention** | 30 days | — | Auto-delete backups older than 30 days | — |
| **Railway Auto** | Continuous | — | Railway's built-in point-in-time recovery | Railway platform |

### Backup Verification

- Weekly automated restore test to a temporary database
- Backup success/failure logged and emailed to Admin

---

## 13. Responsive Design Strategy

The web app is **fully responsive** across desktop, tablet, and mobile browsers.

| Breakpoint | Device | Layout Adaptation |
|-----------|--------|-------------------|
| `≥ 1200px` | Desktop | Full sidebar + main content + optional right panel |
| `992px – 1199px` | Small desktop / Tablet landscape | Collapsible sidebar (icon-only mode) |
| `768px – 991px` | Tablet portrait | Sidebar hidden (hamburger menu), full-width content |
| `< 768px` | Mobile phone | Bottom navigation bar, stacked cards, simplified tables |

### Mobile-Specific Adaptations

| Component | Desktop | Mobile |
|-----------|---------|--------|
| **Sidebar** | Always visible (240px wide) | Hidden — hamburger menu toggle |
| **Data Tables** | Full columns with sorting | Card-based layout, key fields only |
| **Forms** | Multi-column layout | Single-column stacked |
| **Dashboard KPIs** | 4 cards per row | 2 cards per row, scrollable |
| **Charts** | Full-width with legends | Simplified, swipeable carousel |
| **File Upload** | Drag-and-drop zone | Camera button + file picker |
| **Navigation** | Sidebar links | Bottom tab bar (Dashboard, Nivedans, Visitors, Menu) |

---

## 14. Environment Configuration

### Development (Local)

```env
# api/.env (Development)
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database (Local MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mla_eoffice_dev
DB_USER=root
DB_PASSWORD=your_local_password

# JWT
JWT_SECRET=dev_jwt_secret_key_change_in_production
JWT_ACCESS_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Meta WhatsApp
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_VERIFY_TOKEN=your_webhook_verify_token

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
ADMIN_EMAIL=admin@mlaeoffice.com

# Office Hours (for time restriction)
OFFICE_HOURS_START=10:00
OFFICE_HOURS_END=18:00
TIMEZONE=Asia/Kolkata

# MLA Branding (customized per instance)
MLA_NAME=Hon. Example Name
MLA_CONSTITUENCY=Example Constituency
MLA_PARTY=Example Party
MLA_PHOTO_URL=https://cloudinary.com/mla_photo.jpg
```

### Production

Same variables but with:
- `NODE_ENV=production`
- Production database credentials (Railway)
- Strong `JWT_SECRET` (256-bit random)
- Production API keys for all services
- `FRONTEND_URL=https://eoffice.mlaname.in`

---

## 15. Performance Considerations

| Concern | Solution |
|---------|----------|
| **Slow dashboard queries** | Indexed columns: `status`, `created_at`, `village_ward_id`, `category_id` on nivedans, visitors, devworks tables |
| **Large file uploads** | Hybrid upload (direct to Cloudinary < 2MB, via backend ≥ 2MB). Max 10MB. |
| **WhatsApp rate limits** | Queue-based sending with 30-second processing interval. Batch: 10 per cycle. |
| **Global search performance** | MySQL FULLTEXT index on name, subject, description fields |
| **Pagination** | Cursor-based pagination for large datasets (> 10,000 rows) |
| **Image optimization** | Cloudinary auto-generates responsive thumbnails (200px, 400px, 800px) |
| **API response size** | List endpoints return only summary fields; detail endpoints return full data |
| **Render cold start** | Free tier spins down after 15 min. Consider $7/month upgrade for production. |

---

## 16. Technology Stack Summary

```
┌──────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE SUMMARY                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  📐 Pattern        Modular Monolith + REST API               │
│  🔗 API Version    /api/v1/ (versioned from day 1)           │
│  🔄 Real-time      None (REST + manual refresh for MVP)      │
│  💾 Caching        None (direct DB queries for MVP)          │
│  📬 Background     Node-cron for WhatsApp queue only         │
│  🌍 Environments   Development (local) + Production          │
│  📁 Upload         Hybrid: <2MB direct to Cloudinary,        │
│                    ≥2MB via backend                           │
│  🔔 Monitoring     Email + in-app alerts for critical errors │
│  📱 Responsive     Desktop + Tablet + Mobile (fully)         │
│  🔐 Domain         eoffice.mlaname.in (customizable)         │
│  💾 Backups        Daily incremental + Weekly full            │
│  📡 Webhooks       Meta WhatsApp delivery + inbound bot      │
│  📊 Logging        Winston (file) + Audit logs (MySQL)       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---
