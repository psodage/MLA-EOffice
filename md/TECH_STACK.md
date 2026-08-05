# MLA E-Office — Technology Stack

> **Complete Technology Decisions & Infrastructure Blueprint**
> 
> *Related Documents:* [PROJECT_OVERVIEW.md](file:///s:/MLA%20E%20-%20Office/PROJECT_OVERVIEW.md) | [PROJECT_SECTIONS_BREAKDOWN.md](file:///s:/MLA%20E%20-%20Office/PROJECT_SECTIONS_BREAKDOWN.md) | [USER_ROLES.md](file:///s:/MLA%20E%20-%20Office/USER_ROLES.md)

---

## 📌 Stack Summary at a Glance

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend (Web)** | React 18 + Vite | Lightweight, fast HMR, modern tooling |
| **Frontend (Mobile)** | React Native | Same language (JS), shared business logic with web |
| **Backend / API** | Node.js + Express.js | JavaScript everywhere, fast development, huge ecosystem |
| **Database** | MySQL 8.x | Relational, structured data, widely supported, simpler |
| **ORM** | Sequelize | Mature, feature-rich, excellent MySQL support |
| **Authentication** | JWT (JSON Web Tokens) | Stateless, scalable, industry standard |
| **File Storage** | Cloudinary | Free 25GB tier, image/PDF optimization, CDN delivery |
| **AI / LLM** | Google Gemini API | Strong Marathi/multilingual support, competitive pricing |
| **WhatsApp API** | Meta WhatsApp Business Cloud API | Free tier available, direct from Meta, official |
| **Charts / Dashboard** | Recharts + D3.js | Recharts for standard charts, D3.js for custom visuals |
| **UI Language** | English primary + Marathi toggle | Bilingual, English-first interface |
| **Hosting (Frontend)** | Vercel | Free tier, auto-deploy, global CDN |
| **Hosting (Backend)** | Render | Free tier, easy Node.js deployment |
| **Hosting (Database)** | Railway | Free MySQL hosting, managed service |
| **Budget Target** | Free tier maximum | Startup phase, minimal operational cost |

---

## 🖥️ 1. Frontend — Web Application

### Framework: **React 18 + Vite**

* **React 18** — Component-based UI library with hooks, concurrent rendering, and the largest ecosystem of UI libraries.
* **Vite** — Lightning-fast build tool with instant HMR (Hot Module Replacement), significantly faster than Create React App or Webpack.
* **Language:** JavaScript (ES2022+)

### Key Frontend Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| `react` | UI framework | ^18.x |
| `react-dom` | DOM rendering | ^18.x |
| `react-router-dom` | Client-side routing & navigation | ^6.x |
| `axios` | HTTP client for API calls | ^1.x |
| `recharts` | Dashboard charts & graphs (bar, line, pie, area) | ^2.x |
| `d3` | Custom advanced visualizations & data-driven graphics | ^7.x |
| `react-hook-form` | Form management with validation | ^7.x |
| `zod` | Schema validation (form inputs, API responses) | ^3.x |
| `react-query` / `@tanstack/react-query` | Server state management, caching, auto-refetch | ^5.x |
| `zustand` | Lightweight client state management | ^4.x |
| `react-i18next` | Internationalization (English ↔ Marathi toggle) | ^13.x |
| `react-toastify` | Toast notifications | ^9.x |
| `react-datepicker` | Date picker for forms & calendar | ^4.x |
| `lucide-react` | Icon library (modern, lightweight) | ^0.x |
| `react-dropzone` | Drag-and-drop file upload | ^14.x |
| `react-pdf` | PDF viewer for scanned letter preview | ^7.x |
| `dayjs` | Lightweight date manipulation (replaces moment.js) | ^1.x |

### Styling

| Tool | Purpose |
|------|---------|
| **Vanilla CSS** + **CSS Modules** | Scoped component styling, no external CSS framework dependency |
| **CSS Custom Properties (Variables)** | Design system tokens (colors, spacing, typography) |
| **Google Fonts: Inter** | Modern, clean UI typography |

### Build & Dev Tools

| Tool | Purpose |
|------|---------|
| `vite` | Dev server & production bundler |
| `eslint` | Code linting |
| `prettier` | Code formatting |
| `vitest` | Unit testing (Vite-native) |

---

## 📱 2. Frontend — Mobile Application

### Framework: **React Native**

* **Why:** Same JavaScript language as the web app and backend. Allows sharing business logic, API services, validation schemas, and utility functions across web and mobile.
* **Target Platforms:** Android (primary) + iOS

### Key Mobile Libraries

| Library | Purpose |
|---------|---------|
| `react-native` | Core mobile framework |
| `@react-navigation/native` | Screen navigation (stack, tabs, drawer) |
| `react-native-paper` | Material Design UI components |
| `react-native-image-picker` | Camera & gallery access for photo uploads |
| `react-native-document-picker` | Document/PDF file selection |
| `react-native-push-notification` | Local & remote push notifications |
| `@react-native-async-storage/async-storage` | Local data persistence |
| `axios` | API calls (shared with web) |
| `react-native-maps` | Map integration for geotagged development works |

### Build & Distribution

| Tool | Purpose |
|------|---------|
| **Expo** (optional) | Simplified build pipeline, OTA updates |
| **EAS Build** | Cloud builds for APK/AAB (Android) and IPA (iOS) |
| **Google Play Store** | Android distribution |
| **Apple App Store** | iOS distribution |

---

## ⚙️ 3. Backend / API Server

### Framework: **Node.js + Express.js**

* **Node.js v20 LTS** — JavaScript runtime, event-driven, non-blocking I/O.
* **Express.js v4.x** — Minimal, flexible web framework for REST APIs.
* **Language:** JavaScript (ES2022+ with ESM modules)

### Backend Architecture

```
src/
├── config/            # Database, Cloudinary, JWT, WhatsApp config
├── controllers/       # Route handler logic (per module)
│   ├── auth.controller.js
│   ├── nivedan.controller.js
│   ├── inward.controller.js
│   ├── outward.controller.js
│   ├── visitor.controller.js
│   ├── devworks.controller.js
│   ├── karyakarta.controller.js
│   ├── booth.controller.js
│   ├── calendar.controller.js
│   ├── dashboard.controller.js
│   ├── whatsapp.controller.js
│   └── user.controller.js
├── models/            # Sequelize model definitions (per table)
├── routes/            # Express route definitions (per module)
├── middlewares/        # Auth, RBAC, error handling, file upload
│   ├── auth.middleware.js
│   ├── rbac.middleware.js
│   ├── upload.middleware.js
│   └── errorHandler.js
├── services/          # Business logic layer
│   ├── ai.service.js          # Gemini API integration
│   ├── whatsapp.service.js    # Meta WhatsApp Cloud API
│   ├── cloudinary.service.js  # File upload service
│   └── notification.service.js
├── utils/             # Helpers (ID generators, date formatters, validators)
├── seeders/           # Database seed data
├── migrations/        # Sequelize migrations
├── app.js             # Express app setup
└── server.js          # Server entry point
```

### Key Backend Libraries

| Library | Purpose |
|---------|---------|
| `express` | Web server & REST API framework |
| `sequelize` | ORM for MySQL (models, migrations, queries) |
| `mysql2` | MySQL driver (required by Sequelize) |
| `jsonwebtoken` | JWT token creation & verification |
| `bcryptjs` | Password hashing |
| `cors` | Cross-Origin Resource Sharing |
| `helmet` | HTTP security headers |
| `morgan` | HTTP request logging |
| `multer` | Multipart file upload handling |
| `cloudinary` | Cloudinary SDK for file storage |
| `@google/generative-ai` | Google Gemini API SDK for AI letter drafting |
| `node-cron` | Scheduled tasks (greeting cron jobs, escalation checks) |
| `express-rate-limit` | API rate limiting |
| `joi` or `zod` | Request body validation |
| `dotenv` | Environment variable management |
| `winston` | Structured logging |
| `nodemon` | Dev auto-restart |

---

## 🗄️ 4. Database

### Engine: **MySQL 8.x**

* **Type:** Relational (SQL)
* **Why:** Structured data (users, nivedans, inward/outward entries) maps naturally to tables with foreign key relationships. MySQL is widely supported, well-documented, and simple to manage.

### ORM: **Sequelize v6**

* Model definitions in JavaScript
* Auto-generates migrations
* Supports associations (1:1, 1:N, M:N)
* Built-in query builder with raw SQL fallback

### Key Tables (11 Core Tables)

| Table | Description |
|-------|-------------|
| `users` | All system users (MLA, PA, Receptionist, Auditor, Booth Pramukh, Admin) |
| `inward_entries` | Incoming letter/document register |
| `outward_entries` | Outgoing letter/correspondence register |
| `nivedans` | Citizen complaints and petitions |
| `visitors` | Visitor book entries |
| `development_works` | Infrastructure project tracker |
| `karyakartas` | Party worker directory |
| `booths` | Polling booth master data |
| `calendar_events` | Office calendar & schedule |
| `whatsapp_logs` | WhatsApp message delivery logs |
| `audit_logs` | System activity audit trail |

### Supporting/Lookup Tables

| Table | Description |
|-------|-------------|
| `categories` | Nivedan categories & sub-categories |
| `departments` | Government department directory |
| `villages` | Village/Gram Panchayat master |
| `wards` | City ward master |
| `talukas` | Taluka master |
| `designations` | Worker designation types |

---

## 🔐 5. Authentication & Security

### Method: **JWT (JSON Web Tokens)**

| Component | Detail |
|-----------|--------|
| **Login** | Username + Password |
| **Token Type** | JWT access token (short-lived: 24h) + Refresh token (long-lived: 7d) |
| **Password Storage** | bcrypt hash with salt rounds = 12 |
| **Authorization** | RBAC middleware checks user role against route permissions |
| **Token Storage (Web)** | httpOnly secure cookie (access token) |
| **Token Storage (Mobile)** | AsyncStorage (encrypted) |
| **Security Headers** | Helmet.js (CSP, XSS protection, etc.) |
| **Rate Limiting** | 100 requests/15 min per IP (configurable) |
| **Audit Trail** | Every create/update/delete action logged with user ID and timestamp |

---

## 📁 6. File Storage

### Provider: **Cloudinary**

| Feature | Detail |
|---------|--------|
| **Free Tier** | 25GB storage, 25GB bandwidth/month |
| **Supported Files** | Images (JPG, PNG), PDFs, Documents |
| **Use Cases** | Scanned inward letters, nivedan attachments, development work photos, worker profile photos |
| **Upload Flow** | Client → Backend (multer) → Cloudinary SDK → Returns secure URL |
| **Optimization** | Auto image compression, format conversion (WebP), responsive thumbnails |
| **Folder Structure** | `/mla-eoffice/inward/`, `/mla-eoffice/nivedans/`, `/mla-eoffice/devworks/`, `/mla-eoffice/workers/` |

---

## 🤖 7. AI — Letter Drafting Engine

### Provider: **Google Gemini API**

| Feature | Detail |
|---------|--------|
| **Model** | Gemini 2.0 Flash (or latest available) |
| **Use Case** | Auto-drafting formal outward response letters based on inward complaint content |
| **Languages** | Marathi and English |
| **Input** | Inward letter subject, sender, department, complaint description |
| **Output** | Formal government-style letter with reference number, subject, body, closing, MLA signature block |
| **Integration** | `@google/generative-ai` npm package |
| **Pricing** | Free tier: 15 RPM, 1M tokens/day; Paid: ~$0.075/1M input tokens |
| **Prompt Engineering** | System prompt with letter format rules, tone guidelines, and 5+ few-shot examples |

---

## 📲 8. WhatsApp Automation

### Provider: **Meta WhatsApp Business Cloud API**

| Feature | Detail |
|---------|--------|
| **Type** | Official Meta API (direct integration, no third-party middleman) |
| **Free Tier** | 1,000 free service conversations/month |
| **Message Types** | Template messages (pre-approved by Meta) + Session messages (24h reply window) |
| **Use Cases** | Nivedan status updates, birthday/festival greetings, event invitations, broadcast announcements |
| **Integration** | REST API calls from backend via `axios` |
| **Webhook** | Receives delivery status callbacks (sent, delivered, read, failed) |
| **Template Language** | Marathi (primary), English (secondary) |
| **Approval** | Message templates must be submitted to and approved by Meta before use |

### Required Setup
1. Meta Business Account
2. WhatsApp Business Platform access
3. Verified phone number (dedicated to the MLA office)
4. Pre-approved message templates in Marathi & English

---

## 📊 9. Dashboard & Charts

### Primary: **Recharts**
* Used for standard dashboard visualizations: bar charts, line charts, pie charts, area charts.
* React-native, declarative, easy to style and animate.

### Advanced: **D3.js**
* Used for custom, complex visualizations: booth-wise heatmaps, constituency maps, advanced data-driven graphics.
* Full control over SVG rendering.

### Dashboard KPIs (Example)

| KPI | Chart Type |
|-----|-----------|
| Nivedans by status (Pending/Resolved/In Progress) | Donut/Pie chart |
| Monthly nivedan trend | Line chart |
| Visitor footfall (daily/weekly/monthly) | Bar chart |
| Development works by status | Stacked bar chart |
| Area-wise complaint distribution | Horizontal bar chart |
| Booth-wise worker strength | Heatmap (D3) |

---

## 🌐 10. Internationalization (i18n)

### Library: **react-i18next**

| Feature | Detail |
|---------|--------|
| **Primary Language** | English |
| **Secondary Language** | Marathi (मराठी) |
| **Toggle** | Language switch button in the app header/sidebar |
| **Coverage** | All UI labels, buttons, menus, form placeholders, error messages, toast notifications |
| **Translation Files** | `en.json` and `mr.json` in `/src/i18n/locales/` |
| **Date/Number Formatting** | Locale-aware (Indian number system: 1,00,000 not 100,000) |

---

## 🚀 11. Hosting & Deployment

### Infrastructure Map

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│    VERCEL (Free)     │     │    RENDER (Free)     │     │   RAILWAY (Free)    │
│                      │     │                      │     │                     │
│  React + Vite App    │────▶│  Node.js + Express   │────▶│   MySQL 8.x         │
│  (Static Frontend)   │ API │  (Backend API)       │ SQL │   (Database)        │
│                      │     │                      │     │                     │
│  CDN: Global Edge    │     │  Auto-deploy: GitHub  │     │  Auto-backups       │
│  SSL: Auto           │     │  SSL: Auto            │     │  SSL: Auto          │
│  Custom Domain: Yes  │     │  Custom Domain: Yes   │     │                     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
         │
         │ CDN
         ▼
┌─────────────────────┐
│   CLOUDINARY (Free)  │
│                      │
│  File Storage (25GB) │
│  Image Optimization  │
│  PDF Hosting         │
└─────────────────────┘
```

### Deployment Details

| Service | Tier | Free Limits | Auto-Deploy |
|---------|------|-------------|-------------|
| **Vercel** | Hobby (Free) | 100GB bandwidth/month, unlimited deploys | ✅ GitHub push |
| **Render** | Free | 750 hours/month, spins down after 15min inactivity | ✅ GitHub push |
| **Railway** | Starter (Free) | $5 free credit/month, ~500 hours + 1GB RAM | ✅ GitHub push |
| **Cloudinary** | Free | 25GB storage, 25GB bandwidth | N/A |

### Custom Domain Setup
* **Frontend:** `eoffice.mlaname.in` → Vercel
* **API:** `api.eoffice.mlaname.in` → Render
* **SSL:** Auto-provisioned by all three platforms

> ⚠️ **Free Tier Limitation:** Render's free tier spins down the server after 15 minutes of inactivity. First request after sleep takes ~30 seconds. For production use, consider upgrading to Render's $7/month tier.

---

## 🛠️ 12. Development Workflow

### Version Control
* **Git** + **GitHub** (private repository)
* **Branch Strategy:** `main` (production) → `develop` (staging) → `feature/*` (individual features)

### Project Structure (Monorepo or Separate Repos)

```
mla-eoffice/
├── web/                    # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── api/                    # Node.js + Express backend
│   ├── src/
│   ├── package.json
│   └── .env
├── mobile/                 # React Native mobile app
│   ├── src/
│   ├── app.json
│   └── package.json
└── shared/                 # Shared utilities, types, validation schemas
    ├── constants/
    ├── validators/
    └── utils/
```

### CI/CD Pipeline
* **Vercel:** Auto-deploys `web/` on push to `main`
* **Render:** Auto-deploys `api/` on push to `main`
* **GitHub Actions:** Run linting + tests before merge

---

## 💰 13. Cost Estimate (Monthly)

| Service | Free Tier | Paid Upgrade (When Needed) |
|---------|-----------|---------------------------|
| **Vercel** (Frontend) | ₹0 | ₹1,500/month (Pro) |
| **Render** (Backend) | ₹0 | ₹600/month (Starter) |
| **Railway** (MySQL) | ₹0 (~$5 credit) | ₹400–800/month |
| **Cloudinary** (Files) | ₹0 | ₹750/month (Plus) |
| **Gemini API** (AI) | ₹0 (free tier) | ₹200–500/month (usage-based) |
| **WhatsApp Cloud API** | ₹0 (1000 msgs) | ₹0.30–0.50 per conversation after free tier |
| **Domain** (annual) | — | ₹500–1,000/year |
| **Total (Startup)** | **₹0/month** | **₹3,500–5,000/month** (at scale) |

---

## 📋 Summary — Full Stack at a Glance

```
┌──────────────────────────────────────────────────────────┐
│                    MLA E-OFFICE STACK                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  🖥️  WEB         React 18 + Vite + CSS Modules           │
│  📱  MOBILE      React Native                            │
│  ⚙️  BACKEND     Node.js + Express.js                    │
│  🗄️  DATABASE    MySQL 8.x + Sequelize ORM               │
│  🔐  AUTH        JWT + bcrypt + RBAC middleware           │
│  📁  FILES       Cloudinary (25GB free)                   │
│  🤖  AI          Google Gemini API                        │
│  📲  WHATSAPP    Meta WhatsApp Business Cloud API         │
│  📊  CHARTS      Recharts + D3.js                         │
│  🌐  i18n        react-i18next (EN + MR)                  │
│  🚀  DEPLOY      Vercel + Render + Railway                │
│  💰  COST        ₹0/month (free tier startup)             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---
