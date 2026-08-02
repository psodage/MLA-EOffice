# MLA E-Office — Geography Master: Rural Hierarchy

> **Rural Constituency Geography — Taluka → Gram Panchayat → Village → Booth**
>
> This document defines the complete rural geographic hierarchy for the constituency. It is the backbone of all area-wise filtering, nivedan routing, karyakarta booth assignments, and constituency-level reports.
>
> ⚠️ **Action required:** Import real data from `New Booth Pramukh Yadi.xlsx` before going live. Use the Excel import spec in Section 4.
>
> *Related Documents:* [GEOGRAPHY_URBAN.md](file:///s:/MLA%20E%20-%20Office/GEOGRAPHY_URBAN.md) | [CONSTITUENCY_PROFILE.md](file:///s:/MLA%20E%20-%20Office/CONSTITUENCY_PROFILE.md) | [DATA_MODELS.md](file:///s:/MLA%20E%20-%20Office/DATA_MODELS.md) | [AUTO_ROUTING_RULES.md](file:///s:/MLA%20E%20-%20Office/AUTO_ROUTING_RULES.md)

---

## 1. Rural Hierarchy Overview

```
CONSTITUENCY (1)
└── TALUKA (N)
    └── GRAM PANCHAYAT (N per Taluka)
        └── VILLAGE (N per GP)
            └── BOOTH (N per Village)
```

Each level references its parent. Booths are the lowest unit — every karyakarta is assigned to a booth, every nivedan originates from a village/booth area, and every development work is located in a village.

---

## 2. MySQL Database Schema

### Table 1: `talukas`

> Administrative subdivision of the constituency. One constituency may span multiple talukas.

```sql
CREATE TABLE talukas (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name_en         VARCHAR(100) NOT NULL COMMENT 'Taluka name in English',
  name_mr         VARCHAR(150) NOT NULL COMMENT 'Taluka name in Marathi',
  district_name   VARCHAR(100) NOT NULL COMMENT 'District this taluka belongs to',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,

  PRIMARY KEY (id),
  UNIQUE KEY uq_taluka_name_mr (name_mr),
  INDEX idx_taluka_name_en (name_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Taluka master — level 1 of rural geographic hierarchy';
```

**Columns:**

| Column | Type | Required | Description |
|--------|------|:--------:|-------------|
| `id` | INT UNSIGNED | ✅ | Auto-increment primary key |
| `name_en` | VARCHAR(100) | ✅ | Taluka name in English (e.g., `Amravati`) |
| `name_mr` | VARCHAR(150) | ✅ | Taluka name in Marathi (e.g., `अमरावती`) |
| `district_name` | VARCHAR(100) | ✅ | Parent district (e.g., `Amravati`) |
| `is_active` | BOOLEAN | ✅ | Default `true`; `false` hides from dropdowns |

---

### Table 2: `gram_panchayats`

> Village-cluster administrative unit under a taluka.

```sql
CREATE TABLE gram_panchayats (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  taluka_id     INT UNSIGNED NOT NULL COMMENT 'FK → talukas.id',
  name_en       VARCHAR(150) NOT NULL,
  name_mr       VARCHAR(200) NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,

  PRIMARY KEY (id),
  INDEX idx_gp_taluka (taluka_id),
  INDEX idx_gp_name_en (name_en),
  CONSTRAINT fk_gp_taluka FOREIGN KEY (taluka_id)
    REFERENCES talukas(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Gram Panchayat master — level 2 of rural geographic hierarchy';
```

**Columns:**

| Column | Type | Required | Description |
|--------|------|:--------:|-------------|
| `id` | INT UNSIGNED | ✅ | Auto-increment primary key |
| `taluka_id` | INT UNSIGNED | ✅ | FK → `talukas.id` |
| `name_en` | VARCHAR(150) | ✅ | GP name in English |
| `name_mr` | VARCHAR(200) | ✅ | GP name in Marathi |
| `is_active` | BOOLEAN | ✅ | Soft-disable without deletion |

---

### Table 3: `villages`

> Individual revenue villages under a Gram Panchayat.

```sql
CREATE TABLE villages (
  id                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  gram_panchayat_id   INT UNSIGNED NOT NULL COMMENT 'FK → gram_panchayats.id',
  taluka_id           INT UNSIGNED NOT NULL COMMENT 'Denormalized for faster filtering',
  name_en             VARCHAR(150) NOT NULL,
  name_mr             VARCHAR(200) NOT NULL,
  revenue_village_code VARCHAR(20) NULL COMMENT 'Government revenue code if known',
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,

  PRIMARY KEY (id),
  INDEX idx_village_gp (gram_panchayat_id),
  INDEX idx_village_taluka (taluka_id),
  INDEX idx_village_name_en (name_en),
  FULLTEXT KEY ft_village_names (name_en, name_mr),
  CONSTRAINT fk_village_gp FOREIGN KEY (gram_panchayat_id)
    REFERENCES gram_panchayats(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_village_taluka FOREIGN KEY (taluka_id)
    REFERENCES talukas(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Village master — level 3 of rural geographic hierarchy';
```

**Columns:**

| Column | Type | Required | Description |
|--------|------|:--------:|-------------|
| `id` | INT UNSIGNED | ✅ | Auto-increment primary key |
| `gram_panchayat_id` | INT UNSIGNED | ✅ | FK → `gram_panchayats.id` |
| `taluka_id` | INT UNSIGNED | ✅ | Denormalized for fast taluka-level queries |
| `name_en` | VARCHAR(150) | ✅ | Village name in English |
| `name_mr` | VARCHAR(200) | ✅ | Village name in Marathi |
| `revenue_village_code` | VARCHAR(20) | ❌ | Govt revenue village code (optional) |
| `is_active` | BOOLEAN | ✅ | Soft-disable |

---

### Table 4: `booths` (Rural)

> Polling booths within a village. A booth may cover multiple villages in some cases — the `village_id` here represents the primary/host village.

```sql
CREATE TABLE booths (
  id                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  booth_number        VARCHAR(20) NOT NULL COMMENT 'Polling booth number (unique in constituency)',
  booth_name_en       VARCHAR(200) NOT NULL COMMENT 'Polling station name in English',
  booth_name_mr       VARCHAR(250) NOT NULL COMMENT 'Polling station name in Marathi',
  booth_type          ENUM('RURAL','URBAN') NOT NULL DEFAULT 'RURAL',
  village_id          INT UNSIGNED NULL COMMENT 'FK → villages.id (rural booths)',
  ward_id             INT UNSIGNED NULL COMMENT 'FK → wards.id (urban booths)',
  taluka_id           INT UNSIGNED NULL COMMENT 'Denormalized — for rural booths',
  gram_panchayat_id   INT UNSIGNED NULL COMMENT 'Denormalized — for rural booths',
  total_voters        INT UNSIGNED NULL DEFAULT 0,
  booth_pramukh_id    INT UNSIGNED NULL COMMENT 'FK → karyakartas.id',
  verification_status ENUM('NOT_VERIFIED','PARTIALLY_VERIFIED','FULLY_VERIFIED')
                      NOT NULL DEFAULT 'NOT_VERIFIED',
  last_verified_at    DATETIME NULL,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,

  PRIMARY KEY (id),
  UNIQUE KEY uq_booth_number (booth_number),
  INDEX idx_booth_village (village_id),
  INDEX idx_booth_ward (ward_id),
  INDEX idx_booth_taluka (taluka_id),
  INDEX idx_booth_gp (gram_panchayat_id),
  INDEX idx_booth_pramukh (booth_pramukh_id),
  INDEX idx_booth_type (booth_type),
  CONSTRAINT fk_booth_village FOREIGN KEY (village_id)
    REFERENCES villages(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Polling booth master — leaf level of geographic hierarchy (both rural & urban)';
```

**Columns:**

| Column | Type | Required | Description |
|--------|------|:--------:|-------------|
| `id` | INT UNSIGNED | ✅ | Auto-increment primary key |
| `booth_number` | VARCHAR(20) | ✅ | Unique polling booth number (e.g., `101`, `101A`) |
| `booth_name_en` | VARCHAR(200) | ✅ | Official polling station name (English) |
| `booth_name_mr` | VARCHAR(250) | ✅ | Official polling station name (Marathi) |
| `booth_type` | ENUM | ✅ | `RURAL` or `URBAN` |
| `village_id` | INT UNSIGNED | ❌ | FK → `villages.id` (set for rural booths) |
| `ward_id` | INT UNSIGNED | ❌ | FK → `wards.id` (set for urban booths, see GEOGRAPHY_URBAN.md) |
| `taluka_id` | INT UNSIGNED | ❌ | Denormalized from village (rural booths only) |
| `gram_panchayat_id` | INT UNSIGNED | ❌ | Denormalized from village (rural booths only) |
| `total_voters` | INT UNSIGNED | ❌ | Registered voter count for this booth |
| `booth_pramukh_id` | INT UNSIGNED | ❌ | FK → `karyakartas.id` — current booth head |
| `verification_status` | ENUM | ✅ | `NOT_VERIFIED` / `PARTIALLY_VERIFIED` / `FULLY_VERIFIED` |
| `last_verified_at` | DATETIME | ❌ | Timestamp of last field verification |
| `is_active` | BOOLEAN | ✅ | Default `true` |

> **Note:** The `booths` table is shared between rural and urban geography. The `booth_type` column distinguishes them. Rural booths use `village_id`; urban booths use `ward_id`. See [GEOGRAPHY_URBAN.md](file:///s:/MLA%20E%20-%20Office/GEOGRAPHY_URBAN.md) for the urban section.

---

## 3. Sample Data (Rural — Template Rows)

> Replace with real data from `New Booth Pramukh Yadi.xlsx`.

### `talukas` — Sample

| id | name_en | name_mr | district_name | is_active |
|----|---------|---------|---------------|-----------|
| 1 | `[TALUKA_1_EN]` | `[तालुका_१]` | `[DISTRICT_EN]` | true |
| 2 | `[TALUKA_2_EN]` | `[तालुका_२]` | `[DISTRICT_EN]` | true |

### `gram_panchayats` — Sample

| id | taluka_id | name_en | name_mr | is_active |
|----|-----------|---------|---------|-----------|
| 1 | 1 | `[GP_1_EN]` | `[ग्रामपंचायत_१]` | true |
| 2 | 1 | `[GP_2_EN]` | `[ग्रामपंचायत_२]` | true |
| 3 | 2 | `[GP_3_EN]` | `[ग्रामपंचायत_३]` | true |

### `villages` — Sample

| id | gram_panchayat_id | taluka_id | name_en | name_mr | is_active |
|----|-------------------|-----------|---------|---------|-----------|
| 1 | 1 | 1 | `[VILLAGE_1_EN]` | `[गाव_१]` | true |
| 2 | 1 | 1 | `[VILLAGE_2_EN]` | `[गाव_२]` | true |
| 3 | 2 | 1 | `[VILLAGE_3_EN]` | `[गाव_३]` | true |

### `booths` (Rural) — Sample

| id | booth_number | booth_name_en | booth_name_mr | booth_type | village_id | total_voters |
|----|-------------|---------------|---------------|-----------|------------|-------------|
| 1 | `101` | `[Polling Station Name EN]` | `[मतदान केंद्र नाव]` | RURAL | 1 | `[VOTER_COUNT]` |
| 2 | `102` | `[Polling Station Name EN]` | `[मतदान केंद्र नाव]` | RURAL | 2 | `[VOTER_COUNT]` |

---

## 4. Excel Import Specification

### File: `New Booth Pramukh Yadi.xlsx`

Use this mapping when importing the existing Excel file into the database.

| Excel Column Header | Maps To Table | Maps To Column | Validation |
|--------------------|---------------|----------------|-----------|
| `Taluka` / `तालुका` | `talukas` | `name_mr` | Required; creates new row if not exists |
| `Gram Panchayat` / `ग्रामपंचायत` | `gram_panchayats` | `name_mr` | Required; linked to taluka |
| `Village` / `गाव` | `villages` | `name_mr` | Required; linked to GP |
| `Booth No.` / `बूथ क्र.` | `booths` | `booth_number` | Required; must be unique |
| `Booth Name` / `मतदान केंद्र` | `booths` | `booth_name_mr` | Required |
| `Total Voters` / `मतदार संख्या` | `booths` | `total_voters` | Optional; must be positive integer |

**Import rules:**
- Process in hierarchy order: Taluka → GP → Village → Booth
- Use `INSERT IGNORE` or `ON DUPLICATE KEY UPDATE` for idempotent re-imports
- Log any rows with missing required fields and skip them
- Output: `{ total, imported, skipped, errors: [{ row, reason }] }`

---

## 5. API Endpoints — Cascading Dropdowns

These are the GET routes used in all module forms (Nivedan, DevWorks, Karyakarta, Visitor) to power the cascading location selector:

```
GET /api/v1/geography/talukas
  → Returns: [{ id, name_en, name_mr }]
  → Used by: All module forms (first dropdown)

GET /api/v1/geography/gram-panchayats?taluka_id={id}
  → Returns: [{ id, name_en, name_mr, taluka_id }]
  → Used by: Second dropdown (auto-populated on taluka select)

GET /api/v1/geography/villages?gp_id={id}
  → Returns: [{ id, name_en, name_mr, gram_panchayat_id }]
  → Used by: Third dropdown (auto-populated on GP select)

GET /api/v1/geography/booths?village_id={id}
  → Returns: [{ id, booth_number, booth_name_mr, total_voters, booth_pramukh_id }]
  → Used by: Booth selector (auto-populated on village select)

GET /api/v1/geography/search?q={term}&type=rural
  → Full-text search across villages and GPs
  → Returns: [{ type, id, name_mr, breadcrumb }]
  → Used by: Global search bar
```

---

## 6. Frontend Cascade Logic

```javascript
// Cascading location selector — used in Nivedan, Visitor, DevWorks, Karyakarta forms

const [talukas, setTalukas]       = useState([]);
const [gps, setGps]               = useState([]);
const [villages, setVillages]     = useState([]);
const [booths, setBooths]         = useState([]);

// On taluka change → reset and fetch GPs
const onTalukaChange = async (talukaId) => {
  setGps([]);
  setVillages([]);
  setBooths([]);
  if (!talukaId) return;
  const data = await api.get(`/geography/gram-panchayats?taluka_id=${talukaId}`);
  setGps(data);
};

// On GP change → reset and fetch villages
const onGpChange = async (gpId) => {
  setVillages([]);
  setBooths([]);
  if (!gpId) return;
  const data = await api.get(`/geography/villages?gp_id=${gpId}`);
  setVillages(data);
};

// On village change → fetch booths
const onVillageChange = async (villageId) => {
  setBooths([]);
  if (!villageId) return;
  const data = await api.get(`/geography/booths?village_id=${villageId}`);
  setBooths(data);
};
```

---

## 7. SQL Seed Script Template

```sql
-- ============================================================
-- GEOGRAPHY_RURAL SEED DATA
-- Replace [PLACEHOLDER] values with real constituency data
-- Run ONCE during initial system setup
-- ============================================================

-- Step 1: Talukas
INSERT INTO talukas (name_en, name_mr, district_name) VALUES
  ('[TALUKA_1_EN]', '[तालुका_१]', '[DISTRICT_EN]'),
  ('[TALUKA_2_EN]', '[तालुका_२]', '[DISTRICT_EN]');
-- Add all talukas...

-- Step 2: Gram Panchayats
INSERT INTO gram_panchayats (taluka_id, name_en, name_mr) VALUES
  (1, '[GP_1_EN]', '[ग्रामपंचायत_१]'),
  (1, '[GP_2_EN]', '[ग्रामपंचायत_२]'),
  (2, '[GP_3_EN]', '[ग्रामपंचायत_३]');
-- Add all GPs...

-- Step 3: Villages
INSERT INTO villages (gram_panchayat_id, taluka_id, name_en, name_mr) VALUES
  (1, 1, '[VILLAGE_1_EN]', '[गाव_१]'),
  (1, 1, '[VILLAGE_2_EN]', '[गाव_२]'),
  (2, 1, '[VILLAGE_3_EN]', '[गाव_३]');
-- Add all villages...

-- Step 4: Rural Booths
INSERT INTO booths (booth_number, booth_name_en, booth_name_mr, booth_type, village_id, total_voters) VALUES
  ('101', '[Station Name EN]', '[मतदान केंद्र]', 'RURAL', 1, [VOTER_COUNT]),
  ('102', '[Station Name EN]', '[मतदान केंद्र]', 'RURAL', 2, [VOTER_COUNT]);
-- Add all booths from New Booth Pramukh Yadi.xlsx...
```
