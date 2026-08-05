# MLA E-Office — User → Pages Access Map

> **One-page reference: who can see which pages and what they can do on each.**
>
> Access levels: `👀 View` `✏️ Edit` `➕ Create` `✅ Approve` `⬇️ Export` `❌ No Access`

---

## Quick Role Legend

| Symbol | Role | Typical Person |
|:------:|------|---------------|
| 👑 | **MLA** | Suresh Jadhav (आमदार) |
| 🗂️ | **PA** | Meena Deshpande (PA) |
| 🪑 | **Receptionist** | Ramesh Shinde (Front Desk) |
| 🔍 | **Auditor** | Priya Kulkarni (Field) |
| 🗳️ | **Booth Pramukh** | Rajesh Patil (कार्यकर्ता) |
| 👤 | **Citizen** | Public (no login) |
| ⚙️ | **Admin** | IT person |

---

## 🔐 Login / Auth Pages

| Page | Route | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor | 🗳️ Booth | 👤 Citizen | ⚙️ Admin |
|------|-------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Login Page | `/login` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| First-time Password Set | `/login/first-time` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Change Password | `/login/change-password` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |

> 🗳️ Booth Pramukh: **WhatsApp only** — no web app login
> 👤 Citizens: **Public tracking portal only** — no login required

---

## 📊 Dashboard

| Page | Route | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor | ⚙️ Admin | Notes |
|------|-------|:---:|:---:|:---:|:---:|:---:|-------|
| Dashboard Home | `/dashboard` | 👀✅ | 👀✅ | 👀⚠️ | 👀⚠️ | 👀✅ | |

**What each role sees on Dashboard:**

| Card / Widget | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor |
|---|:---:|:---:|:---:|:---:|
| Pending Nivedans count | ✅ | ✅ | ✅ (own only) | ❌ |
| Escalated Nivedans alert | ✅ | ✅ | ❌ | ❌ |
| Today's Visitor count | ✅ | ✅ | ✅ | ❌ |
| Inward Pending this week | ✅ | ✅ | ❌ | ❌ |
| Dev Works progress | ✅ | ✅ | ❌ | ✅ |
| Booth Verification stats | ✅ | ✅ | ❌ | ✅ |
| Active Karyakartas count | ✅ | ✅ | ❌ | ✅ |
| Unread Notifications | ✅ | ✅ | ✅ | ✅ |
| Quick Action buttons | ❌ | ✅ (all) | ✅ (limited) | ❌ |
| Charts (nivedan trends) | ✅ | ✅ | ❌ | ❌ |

---

## 📨 Inward & Outward (आवक-जावक)

| Page | Route | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor | ⚙️ Admin |
|------|-------|:---:|:---:|:---:|:---:|:---:|
| Inward List | `/inward` | 👀 | 👀✏️ | 👀➕ | ❌ | 👀 |
| New Inward Form | `/inward/new` | ❌ | ✅ | ✅ | ❌ | ✅ |
| Inward Detail | `/inward/:id` | 👀 | 👀✏️ | 👀 | ❌ | 👀 |
| Edit Inward | `/inward/:id/edit` | ❌ | ✅ | ✅ | ❌ | ✅ |
| Outward List | `/inward?tab=outward` | 👀 | 👀✏️ | ❌ | ❌ | 👀 |
| New Outward Form | `/outward/new` | ❌ | ✅ | ❌ | ❌ | ✅ |
| Outward Detail | `/outward/:id` | 👀 | 👀✅ | ❌ | ❌ | 👀 |

**Actions available per role:**

| Action | 👑 MLA | 🗂️ PA | 🪑 Recep |
|--------|:---:|:---:|:---:|
| Receive new letter (create inward) | ❌ | ✅ | ✅ |
| Assign inward to user | ❌ | ✅ | ❌ |
| Change inward status | ❌ | ✅ | ❌ |
| Draft outward letter | ❌ | ✅ | ❌ |
| Use AI "Draft करा" button | ❌ | ✅ | ❌ |
| Approve outward letter | ✅ | ✅ | ❌ |
| Download / print letter | ✅ | ✅ | ❌ |

---

## 👤 Visitor Book (भेट नोंद)

| Page | Route | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor | ⚙️ Admin |
|------|-------|:---:|:---:|:---:|:---:|:---:|
| Visitor List (today) | `/visitors` | 👀 | 👀 | 👀✅ | ❌ | 👀 |
| Check-In Form | `/visitors/check-in` | ❌ | ✅ | ✅ | ❌ | ✅ |
| Visitor Detail | `/visitors/:id` | 👀 | 👀 | 👀 | ❌ | 👀 |

**Actions available per role:**

| Action | 👑 MLA | 🗂️ PA | 🪑 Recep |
|--------|:---:|:---:|:---:|
| Check-in a visitor | ❌ | ✅ | ✅ |
| Check-out a visitor | ❌ | ✅ | ✅ |
| Link visitor to nivedan | ❌ | ✅ | ✅ |
| View all visitors (any date) | ✅ | ✅ | ✅ (own entry) |
| Export visitor log | ❌ | ✅ | ❌ |

---

## 📝 Nivedans / Petitions (निवेदने) ⭐ Core Module

| Page | Route | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor | 👤 Citizen | ⚙️ Admin |
|------|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| Nivedan List | `/nivedans` | 👀 | 👀✏️ | 👀➕ | ❌ | ❌ | 👀 |
| New Nivedan Form | `/nivedans/new` | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Nivedan Detail | `/nivedans/:id` | 👀 | 👀✏️ | 👀⚠️ | ❌ | ❌ | 👀 |
| Edit Nivedan | `/nivedans/:id/edit` | ❌ | ✅ | ✅ (own only) | ❌ | ❌ | ✅ |
| Print Receipt | `/nivedans/:id/print` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Public Tracking** | `/track` | ❌ | ❌ | ❌ | ❌ | ✅ (mobile) | ❌ |

**Actions available per role:**

| Action | 👑 MLA | 🗂️ PA | 🪑 Recep |
|--------|:---:|:---:|:---:|
| Register new nivedan | ❌ | ✅ | ✅ |
| Assign to PA/staff | ❌ | ✅ | ❌ |
| Forward to department | ❌ | ✅ | ❌ |
| Add internal note to timeline | ❌ | ✅ | ❌ |
| Mark as Resolved | ❌ | ✅ | ❌ |
| Mark as Rejected | ❌ | ✅ | ❌ |
| Send WhatsApp update to citizen | ❌ | ✅ | ❌ |
| View full timeline history | ✅ | ✅ | ✅ (own) |
| Print/Download receipt | ✅ | ✅ | ✅ |
| Export nivedan list | ❌ | ✅ | ❌ |

**Data visibility:**
- 👑 MLA → sees ALL nivedans across all areas
- 🗂️ PA → sees ALL nivedans (full operational access)
- 🪑 Receptionist → sees only nivedans **they created** + all PENDING ones
- 👤 Citizen → enters mobile number on `/track` → sees only **their own** nivedans

---

## 🏗️ Development Works (विकासकामे)

| Page | Route | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor | ⚙️ Admin |
|------|-------|:---:|:---:|:---:|:---:|:---:|
| Dev Works List | `/devworks` | 👀 | 👀✏️ | ❌ | 👀✅ | 👀 |
| New Project Form | `/devworks/new` | ❌ | ✅ | ❌ | ❌ | ✅ |
| Project Detail | `/devworks/:id` | 👀 | 👀✏️ | ❌ | 👀✏️ | 👀 |
| Edit Project | `/devworks/:id/edit` | ❌ | ✅ | ❌ | ⚠️ (progress %) | ✅ |
| Photo Gallery | `/devworks/:id/photos` | 👀 | 👀✏️ | ❌ | 👀✅ | 👀 |

**Actions available per role:**

| Action | 👑 MLA | 🗂️ PA | 🔍 Auditor |
|--------|:---:|:---:|:---:|
| Add new project | ❌ | ✅ | ❌ |
| Edit project details | ❌ | ✅ | ❌ |
| Update progress % | ❌ | ✅ | ✅ |
| Upload Before/During/After photos | ❌ | ✅ | ✅ |
| Update budget spent | ❌ | ✅ | ❌ |
| Mark project as Completed | ❌ | ✅ | ❌ |
| View map view of projects | ✅ | ✅ | ✅ |
| Export project report | ✅ | ✅ | ✅ |

---

## 👥 Karyakarta Directory (कार्यकर्ता संचिका)

| Page | Route | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor | ⚙️ Admin |
|------|-------|:---:|:---:|:---:|:---:|:---:|
| Karyakarta List | `/karyakarta` | 👀 | 👀✏️ | ❌ | 👀 | 👀✏️ |
| Add Karyakarta | `/karyakarta/new` | ❌ | ✅ | ❌ | ❌ | ✅ |
| Karyakarta Detail | `/karyakarta/:id` | 👀 | 👀✏️ | ❌ | 👀 | 👀✏️ |
| Area / GP View | `/karyakarta/areas` | 👀 | 👀✏️ | ❌ | 👀 | 👀 |
| Booth Structure View | `/karyakarta/booths` | 👀 | 👀✏️ | ❌ | 👀 | 👀 |
| Bulk Import (Excel) | `/karyakarta/import` | ❌ | ✅ | ❌ | ❌ | ✅ |

**Actions available per role:**

| Action | 👑 MLA | 🗂️ PA | 🔍 Auditor |
|--------|:---:|:---:|:---:|
| Add single karyakarta | ❌ | ✅ | ❌ |
| Bulk import from Excel | ❌ | ✅ | ❌ |
| Edit karyakarta details | ❌ | ✅ | ❌ |
| Deactivate worker | ❌ | ✅ | ❌ |
| View booth strength | ✅ | ✅ | ✅ |
| Assign Booth Pramukh | ❌ | ✅ | ❌ |
| Export karyakarta list | ❌ | ✅ | ❌ |

---

## 📅 Calendar (दिनदर्शिका)

| Page | Route | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor | ⚙️ Admin |
|------|-------|:---:|:---:|:---:|:---:|:---:|
| Calendar View | `/calendar` | 👀✏️ | 👀✏️ | 👀 | ❌ | 👀✏️ |

**Actions available per role:**

| Action | 👑 MLA | 🗂️ PA |
|--------|:---:|:---:|
| View all events | ✅ | ✅ |
| Add new event | ✅ | ✅ |
| Edit/cancel event | ✅ | ✅ |
| Set reminders | ✅ | ✅ |
| Mark as recurring | ❌ | ✅ |
| View PERSONAL events | ✅ (own) | ✅ (all) |

---

## 💬 WhatsApp (व्हॉट्सअॅप)

| Page | Route | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor | ⚙️ Admin |
|------|-------|:---:|:---:|:---:|:---:|:---:|
| WhatsApp Logs | `/whatsapp` | 👀 | 👀✏️ | ❌ | ❌ | 👀✏️ |

**Actions available per role:**

| Action | 👑 MLA | 🗂️ PA | ⚙️ Admin |
|--------|:---:|:---:|:---:|
| View sent message logs | ✅ | ✅ | ✅ |
| Send manual WhatsApp | ❌ | ✅ | ✅ |
| Manage templates | ❌ | ❌ | ✅ |
| View delivery status | ✅ | ✅ | ✅ |
| Retry failed messages | ❌ | ✅ | ✅ |
| Configure festival greetings | ❌ | ✅ | ✅ |

---

## 📑 Reports (अहवाल)

| Page | Route | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor | ⚙️ Admin |
|------|-------|:---:|:---:|:---:|:---:|:---:|
| Reports Home | `/reports` | 👀⬇️ | 👀⬇️ | ❌ | 👀⬇️ | 👀⬇️ |

**Which reports each role can see:**

| Report | 👑 MLA | 🗂️ PA | 🔍 Auditor |
|--------|:---:|:---:|:---:|
| Nivedan Summary (by category, status, taluka) | ✅ | ✅ | ❌ |
| Inward Pendency Report | ✅ | ✅ | ❌ |
| Development Works Budget Report | ✅ | ✅ | ✅ |
| Karyakarta Booth Coverage | ✅ | ✅ | ✅ |
| Visitor Statistics | ✅ | ✅ | ❌ |
| WhatsApp Delivery Stats | ❌ | ✅ | ❌ |
| Export all reports to CSV/PDF | ✅ | ✅ | ✅ |

---

## 🔔 Notifications (सूचना)

| Page | Route | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor | ⚙️ Admin |
|------|-------|:---:|:---:|:---:|:---:|:---:|
| Notifications | `/notifications` | ✅ | ✅ | ✅ | ✅ | ✅ |

**Who gets which notifications:**

| Notification Trigger | 👑 MLA | 🗂️ PA | 🪑 Recep |
|---------------------|:---:|:---:|:---:|
| New nivedan registered | ❌ | ✅ | ❌ |
| Nivedan escalated (Level 2) | ✅ | ✅ | ❌ |
| New inward received | ❌ | ✅ | ❌ |
| Dev work delayed | ✅ | ✅ | ❌ |
| Calendar event reminder | ✅ | ✅ | ❌ |
| Birthday reminder (karyakarta) | ✅ | ✅ | ❌ |
| WhatsApp message failed | ❌ | ✅ | ❌ |

---

## ⚙️ Settings & Administration

| Page | Route | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor | ⚙️ Admin |
|------|-------|:---:|:---:|:---:|:---:|:---:|
| Settings (general) | `/settings` | ❌ | ✅ | ❌ | ❌ | ✅ |
| User Management | `/admin/users` | ❌ | ❌ | ❌ | ❌ | ✅ |
| Create / Edit User | `/admin/users/new` | ❌ | ❌ | ❌ | ❌ | ✅ |
| Audit Logs | `/admin/audit` | ❌ | ❌ | ❌ | ❌ | ✅ |
| Department Directory | `/settings/departments` | ❌ | ✅ | ❌ | ❌ | ✅ |
| Category Management | `/settings/categories` | ❌ | ❌ | ❌ | ❌ | ✅ |
| WhatsApp Greeting Calendar | `/settings/greetings` | ❌ | ✅ | ❌ | ❌ | ✅ |

**Settings actions per role:**

| Action | 🗂️ PA | ⚙️ Admin |
|--------|:---:|:---:|
| Update department officer contacts | ✅ | ✅ |
| Update festival greeting dates | ✅ | ✅ |
| Create new user | ❌ | ✅ |
| Assign roles to users | ❌ | ✅ |
| Deactivate a user | ❌ | ✅ |
| Reset user password | ❌ | ✅ |
| View audit log | ❌ | ✅ |
| Edit nivedan categories | ❌ | ✅ |

---

## 🌐 Public Portal (No Login)

| Page | Route | Who Can Access | What They Can Do |
|------|-------|---------------|-----------------|
| Public Tracking | `/track` | Anyone (Citizen) | Enter mobile number → see all their nivedans + status |
| WhatsApp Bot | WhatsApp | Booth Pramukh / Citizen | Register complaints, check status via chat |

---

## 📋 Full Role Summary Table

> One row per role — what modules they can access.

| Module | 👑 MLA | 🗂️ PA | 🪑 Recep | 🔍 Auditor | 🗳️ Booth | 👤 Citizen | ⚙️ Admin |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Dashboard | ✅ Full | ✅ Full | ✅ Limited | ✅ Limited | ❌ | ❌ | ✅ Full |
| Inward Register | 👀 Only | ✅ Full | ✅ Create | ❌ | ❌ | ❌ | 👀 Only |
| Outward Letters | 👀+Approve | ✅ Full | ❌ | ❌ | ❌ | ❌ | 👀 Only |
| Visitor Book | 👀 Only | ✅ Full | ✅ Full | ❌ | ❌ | ❌ | 👀 Only |
| Nivedans | 👀 Only | ✅ Full | ✅ Create | ❌ | WhatsApp | 🌐 Track | 👀 Only |
| Dev Works | 👀 Only | ✅ Full | ❌ | ✅ Photos+% | ❌ | ❌ | 👀 Only |
| Karyakarta | 👀 Only | ✅ Full | ❌ | 👀 Only | ❌ | ❌ | ✅ Full |
| Calendar | ✅ Full | ✅ Full | 👀 Only | ❌ | ❌ | ❌ | ✅ Full |
| WhatsApp | 👀 Only | ✅ Full | ❌ | ❌ | WhatsApp | WhatsApp | ✅ Full |
| Reports | ✅ All | ✅ All | ❌ | ✅ Limited | ❌ | ❌ | ✅ All |
| Notifications | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Settings | ❌ | ✅ Limited | ❌ | ❌ | ❌ | ❌ | ✅ Full |
| User Management | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Full |

---

## 🔄 Post-Login Landing Page

| Role | Lands On | Why |
|------|---------|-----|
| 👑 MLA | `/dashboard` | Needs overview first |
| 🗂️ PA | `/dashboard` | Needs operational overview |
| 🪑 Receptionist | `/visitors` | First task: register visitors |
| 🔍 Auditor | `/devworks` | Check field inspection list |
| ⚙️ Admin | `/admin/users` | User management is primary job |
| 👤 Citizen | `/track` | No login — public tracking |

---
