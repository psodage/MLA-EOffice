# MLA E-Office — Sample Data

> **Realistic Test Data for Development, Demo, and Testing**
>
> This directory contains ready-to-execute SQL INSERT scripts with fictional but realistic data modeled on a **Kolhapur district constituency** in Maharashtra.
>
> ⚠️ **This is fictional data.** All names, phone numbers, and addresses are made up. Do NOT use in production.
>
> *Related Documents:* [DATA_MODELS.md](file:///s:/MLA%20E%20-%20Office/DATA_MODELS.md) | [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md) | [GEOGRAPHY_RURAL.md](file:///s:/MLA%20E%20-%20Office/GEOGRAPHY_RURAL.md) | [KARYAKARTA_SEED_DATA.md](file:///s:/MLA%20E%20-%20Office/KARYAKARTA_SEED_DATA.md)

---

## Fictional Constituency Profile

| Property | Value |
|----------|-------|
| **MLA Name** | आ. सुरेश पाटील (Hon. Suresh Patil) |
| **Constituency** | कोल्हापूर दक्षिण (Kolhapur South — Assembly No. 274) |
| **District** | कोल्हापूर (Kolhapur) |
| **Type** | Mixed (Rural + Urban) |
| **Talukas** | Karveer |
| **Cities** | Kolhapur (Municipal Corporation) |
| **Party** | Fictional — राष्ट्रवादी (Rashtrawadi) |

---

## File Listing

| # | File | Entity | Records | Description |
|:-:|------|--------|:-------:|-------------|
| 1 | `01_users.sql` | `users` | 7 | System users — MLA, PA, Receptionist, Auditor, Booth Pramukh, Citizen, Admin |
| 2 | `02_inward_entries.sql` | `inward_entries` | 20 | Incoming letters from govt departments — mixed statuses and priorities |
| 3 | `03_nivedans.sql` | `nivedans` | 20 | Citizen complaints — all 8 statuses covered, multiple categories |
| 4 | `04_nivedan_timeline.sql` | `nivedan_timeline` | 40 | Activity history for nivedans — status changes, assignments, notes |
| 5 | `05_development_works.sql` | `development_works` | 10 | Infrastructure projects — roads, water, schools — various statuses |
| 6 | `06_visitors.sql` | `visitors` | 50 | Office visitor register — all 10 purpose types covered |
| 7 | `07_karyakartas.sql` | `karyakartas` | 100 | Party workers across 20 booths — all 6 designations |
| 8 | `08_calendar_events.sql` | `calendar_events` | 5 | Office schedule — meetings, programs, visits, deadlines |

**Total: 252 sample records across 8 files**

---

## Execution Order

> [!IMPORTANT]
> Run these scripts **AFTER** running the master data seeders (departments, categories, geography). The sample data has foreign key references to those tables.

```bash
# Prerequisites — run these first (from Sequelize seeders):
# 1. departments (20 departments)
# 2. categories (14 categories + sub-categories)
# 3. talukas, gram_panchayats, villages, wards, booths (geography)

# Then run sample data in this order:
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/01_users.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/02_inward_entries.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/03_nivedans.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/04_nivedan_timeline.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/05_development_works.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/06_visitors.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/07_karyakartas.sql
mysql -u root -p mla_eoffice_dev < SAMPLE_DATA/08_calendar_events.sql
```

---

## Data Relationships

```
users (7)
  ├── created_by / assigned_to in inward_entries
  ├── created_by / assigned_to in nivedans
  ├── performed_by in nivedan_timeline
  ├── created_by in visitors
  ├── created_by in development_works
  └── created_by in calendar_events

departments (from master data)
  ├── sender_department_id in inward_entries
  └── department_forwarded_to_id in nivedans

categories (from master data)
  └── category_id / sub_category_id in nivedans

geography (from master data)
  ├── village_id / ward_id in nivedans, visitors, development_works
  └── booth_id / village_id in karyakartas
```

---

## User Accounts for Testing

| # | Username | Password | Role | What to Test |
|:-:|----------|----------|------|--------------|
| 1 | `mla_suresh` | `Mla@2026#Kolhapur` | MLA | Dashboard, reports, approvals |
| 2 | `pa_meena` | `Pa@2026#Kolhapur` | PA | All modules, AI drafting, assignments |
| 3 | `clerk_ramesh` | `Clerk@2026#Kolhapur` | RECEPTIONIST | Visitor book, nivedan registration |
| 4 | `auditor_priya` | `Audit@2026#Kolhapur` | AUDITOR | DevWorks audit, booth verification |
| 5 | `bp_ganesh` | `Booth@2026#Kolhapur` | BOOTH_PRAMUKH | Booth-scoped view, local issues |
| 6 | `citizen_test` | `Citizen@2026` | CITIZEN | Public tracking portal |
| 7 | `admin` | `Admin@MLA2026` | ADMIN | User management, system settings |

> 🔴 All passwords are for **development only**. Change immediately in staging/production.

---
