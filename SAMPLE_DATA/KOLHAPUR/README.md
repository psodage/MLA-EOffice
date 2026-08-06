# MLA E-Office — Sample Data (Kolhapur Division)

> **Realistic Test Data for Kolhapur District Constituency**
>
> This directory contains ready-to-execute SQL INSERT scripts modeled on **Kolhapur District** in Maharashtra.
> Booth Pramukh data sourced from actual: `docs/New Booth Pramukh Yadi.xlsx`
>
> ⚠️ **Note:** All citizen names, addresses, and complaint data are fictional for demo purposes.  
> ✅ **Booth Pramukh names and mobile numbers are from the actual Excel file.**

---

## Constituency Profile

| Property | Value |
|----------|-------|
| **MLA Name** | आ. राजेश नाईक (Hon. Rajesh Naik) |
| **Constituency** | कोल्हापूर दक्षिण (Kolhapur South) |
| **District** | कोल्हापूर (Kolhapur) |
| **Party** | भारतीय जनता पार्टी (BJP) |
| **Type** | Mixed (Urban + Rural) |
| **Urban Areas** | Kolhapur City — 33 Wards, 186 Booths |
| **Rural Areas** | Karveer Taluka — 38 Villages, 168 Booths |

---

## Source Data (Excel)

| Sheet | Description | Booths |
|-------|-------------|--------|
| `shahar` | Urban booths — Kolhapur City | 186 booths (1–186) |
| `Gramin` | Rural booths — Karveer Taluka | 168 booths (187–354) |
| **Total** | | **354 booths** |

**Urban Wards (33):** लक्षतीर्थ वसाहत, मंगळवार पेठ, महावीर नगर, रंकाळा, शिवाजी पार्क, राजोपाध्ये कॉलनी, संभाजी नगर, रुईकर कॉलनी, बापट कॅंप, सिद्धार्थ नगर, मोरेवाडी, आर.के.नगर, रमणमळा, श्रीपती कॉलनी, टेंबलाईवाडी, विक्रमनगर, अवचीतनगर, राजारामपुरी पूर्व बाजू, शाहूनगर, नेहरू नगर, बाबा जरग नगर, साळोखे पार्क, सुभाष नगर, सम्राटनगर, राजेंद्रनगर, पद्माळा...

**Rural Villages (38):** कळंबे तर्फे ठाणे, पाचगाव, मोरेवाडी, आर.के.नगर, तामगाव, नेर्ली, वसगडे, सांगवडे, सांगवडेवाडी, हलसवडे, विकासवाडी, कोगील बु, द.वडगाव, दिंडनेर्ली, इस्पुर्ली, वडकशिवाले, चुये, कावणे, निगवे खालसा, नागाव, नंदगाव, खेबवडे...

---

## File Listing

| # | File | Entity | Records | Description |
|:-:|------|--------|:-------:|-------------|
| 1 | `01_users.sql` | `users` | 7 | System users — MLA (राजेश नाईक), PA, Receptionist, Auditor, Booth Pramukh, Citizen, Admin |
| 2 | `02_inward_entries.sql` | `inward_entries` | 20 | Incoming letters — Kolhapur district offices |
| 3 | `03_nivedans.sql` | `nivedans` | 20 | Citizen complaints — real ward/village names |
| 4 | `04_nivedan_timeline.sql` | `nivedan_timeline` | 40 | Activity history for nivedans |
| 5 | `05_development_works.sql` | `development_works` | 10 | Infrastructure projects in Kolhapur South |
| 6 | `06_visitors.sql` | `visitors` | 50 | Visitor register — real area names |
| 7 | `07_karyakartas.sql` | `karyakartas` | **429** | **All 354 Booth Pramukhs + Shakti Kendra from Excel** |
| 8 | `08_calendar_events.sql` | `calendar_events` | 5 | Office schedule — meetings, jansunwai, field visits |

**Total: ~581 sample records across 8 files**

---

## User Accounts for Testing

| # | Username | Password | Role | What to Test |
|:-:|----------|----------|------|--------------|
| 1 | `mla_rajesh` | `Mla@2026#Kolhapur` | MLA | Dashboard, reports, approvals |
| 2 | `pa_sunita` | `Pa@2026#Kolhapur` | PA | All modules, AI drafting, assignments |
| 3 | `clerk_suresh` | `Clerk@2026#Kolhapur` | RECEPTIONIST | Visitor book, nivedan registration |
| 4 | `auditor_meera` | `Audit@2026#Kolhapur` | AUDITOR | DevWorks audit, booth verification |
| 5 | `bp_ganpat` | `Booth@2026#Kolhapur` | BOOTH_PRAMUKH | Booth-scoped view, local issues |
| 6 | `citizen_kolhapur` | `Citizen@2026#Kolhapur` | CITIZEN | Public tracking portal |
| 7 | `admin_kolhapur` | `Admin@2026#Kolhapur` | ADMIN | User management, system settings |

> 🔴 Use same bcrypt hashes as Kolhapur set — passwords are the same strings.

---

## Execution Order

```bash
# Run after Sequelize migrations and master data seeders
mysql -u root -p railway < SAMPLE_DATA/KOLHAPUR/01_users.sql
mysql -u root -p railway < SAMPLE_DATA/KOLHAPUR/02_inward_entries.sql
mysql -u root -p railway < SAMPLE_DATA/KOLHAPUR/03_nivedans.sql
mysql -u root -p railway < SAMPLE_DATA/KOLHAPUR/04_nivedan_timeline.sql
mysql -u root -p railway < SAMPLE_DATA/KOLHAPUR/05_development_works.sql
mysql -u root -p railway < SAMPLE_DATA/KOLHAPUR/06_visitors.sql
mysql -u root -p railway < SAMPLE_DATA/KOLHAPUR/07_karyakartas.sql
mysql -u root -p railway < SAMPLE_DATA/KOLHAPUR/08_calendar_events.sql
```

### Or use the seeder script (recommended for Railway cloud DB):

```bash
# From api/ directory:
node src/seed_kolhapur_data.cjs
```

---

## Geography FK Mapping

### Urban Wards (ward_id → ward_name)
Sequential IDs assigned based on order of appearance in Excel `shahar` sheet.

### Rural Villages (village_id → village_name)
Sequential IDs assigned based on order of appearance in Excel `Gramin` sheet.

> **Note:** These FK IDs are relative to this dataset. When integrating with production geography master data, update the IDs to match your actual `wards` and `villages` table entries for Kolhapur district.

---
