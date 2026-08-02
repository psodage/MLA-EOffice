# MLA E-Office — Geography Master: Urban Hierarchy

> **Urban Constituency Geography — City → Ward → Booth**
>
> This document defines the urban geographic hierarchy for the constituency. It covers city-level areas, municipal wards, and their associated polling booths. Used in all module forms where a citizen or karyakarta resides in an urban (municipal) area rather than a village.
>
> ⚠️ **Action required:** Fill city and ward data before going live. Urban booths share the `booths` table with rural booths — see `booth_type = 'URBAN'`.
>
> *Related Documents:* [GEOGRAPHY_RURAL.md](file:///s:/MLA%20E%20-%20Office/GEOGRAPHY_RURAL.md) | [CONSTITUENCY_PROFILE.md](file:///s:/MLA%20E%20-%20Office/CONSTITUENCY_PROFILE.md) | [DATA_MODELS.md](file:///s:/MLA%20E%20-%20Office/DATA_MODELS.md)

---

## 1. Urban Hierarchy Overview

```
CONSTITUENCY (1)
└── CITY / TOWN (N)          ← Municipal Corporation / Council / Nagar Panchayat
    └── WARD / PRABHAG (N)   ← Municipal ward (प्रभाग)
        └── BOOTH (N)        ← Polling booth (shared booths table, booth_type='URBAN')
```

**Urban body types covered:**

| Type | Marathi | Example |
|------|---------|---------|
| Municipal Corporation (महानगरपालिका) | महापालिका | Amravati Municipal Corporation |
| Municipal Council (नगरपरिषद) | नगरपरिषद | Achalpur Nagar Parishad |
| Nagar Panchayat (नगरपंचायत) | नगरपंचायत | Small town panchayats |

---

## 2. MySQL Database Schema

### Table 1: `cities`

> Urban local body — Municipal Corporation, Municipal Council, or Nagar Panchayat within the constituency.

```sql
CREATE TABLE cities (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name_en       VARCHAR(150) NOT NULL COMMENT 'City/town name in English',
  name_mr       VARCHAR(200) NOT NULL COMMENT 'City/town name in Marathi',
  city_type     ENUM('MUNICIPAL_CORP','MUNICIPAL_COUNCIL','NAGAR_PANCHAYAT','CANTONMENT')
                NOT NULL DEFAULT 'MUNICIPAL_COUNCIL',
  taluka_id     INT UNSIGNED NOT NULL COMMENT 'FK → talukas.id (which taluka this city is in)',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,

  PRIMARY KEY (id),
  UNIQUE KEY uq_city_name_mr (name_mr),
  INDEX idx_city_taluka (taluka_id),
  CONSTRAINT fk_city_taluka FOREIGN KEY (taluka_id)
    REFERENCES talukas(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='City/urban body master — level 1 of urban geographic hierarchy';
```

**Columns:**

| Column | Type | Required | Description |
|--------|------|:--------:|-------------|
| `id` | INT UNSIGNED | ✅ | Auto-increment primary key |
| `name_en` | VARCHAR(150) | ✅ | City/town name in English (e.g., `Amravati`) |
| `name_mr` | VARCHAR(200) | ✅ | City/town name in Marathi (e.g., `अमरावती`) |
| `city_type` | ENUM | ✅ | Type of urban local body |
| `taluka_id` | INT UNSIGNED | ✅ | FK → `talukas.id` (links urban areas to taluka for reports) |
| `is_active` | BOOLEAN | ✅ | Default `true` |

---

### Table 2: `wards`

> Municipal ward (प्रभाग / वॉर्ड) — subdivision of a city.

```sql
CREATE TABLE wards (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  city_id     INT UNSIGNED NOT NULL COMMENT 'FK → cities.id',
  ward_number VARCHAR(20) NOT NULL COMMENT 'Ward number as per municipality',
  name_en     VARCHAR(150) NOT NULL,
  name_mr     VARCHAR(200) NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,

  PRIMARY KEY (id),
  UNIQUE KEY uq_ward_city_number (city_id, ward_number),
  INDEX idx_ward_city (city_id),
  INDEX idx_ward_name_en (name_en),
  FULLTEXT KEY ft_ward_names (name_en, name_mr),
  CONSTRAINT fk_ward_city FOREIGN KEY (city_id)
    REFERENCES cities(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Municipal ward master — level 2 of urban geographic hierarchy';
```

**Columns:**

| Column | Type | Required | Description |
|--------|------|:--------:|-------------|
| `id` | INT UNSIGNED | ✅ | Auto-increment primary key |
| `city_id` | INT UNSIGNED | ✅ | FK → `cities.id` |
| `ward_number` | VARCHAR(20) | ✅ | Official ward number (e.g., `1`, `12`, `Ward-A`) |
| `name_en` | VARCHAR(150) | ✅ | Ward name in English (e.g., `Gandhi Ward`) |
| `name_mr` | VARCHAR(200) | ✅ | Ward name in Marathi (e.g., `गांधी प्रभाग`) |
| `is_active` | BOOLEAN | ✅ | Default `true` |

---

### Table 3: `booths` (Urban)

> Urban booths use the **same `booths` table** as rural booths (defined in [GEOGRAPHY_RURAL.md](file:///s:/MLA%20E%20-%20Office/GEOGRAPHY_RURAL.md)). The key difference:
> - Rural booth: `booth_type = 'RURAL'`, `village_id` is set, `ward_id` is NULL
> - Urban booth: `booth_type = 'URBAN'`, `ward_id` is set, `village_id` is NULL

```sql
-- Urban booth INSERT example (no separate table needed):
INSERT INTO booths (
  booth_number, booth_name_en, booth_name_mr,
  booth_type, ward_id, total_voters
) VALUES (
  '201', 'Primary School, Gandhi Ward', 'प्राथमिक शाळा, गांधी प्रभाग',
  'URBAN', 3, 850
);
```

**Column mapping for urban booths:**

| Column | Rural Value | Urban Value |
|--------|-------------|-------------|
| `booth_type` | `'RURAL'` | `'URBAN'` |
| `village_id` | `{village_id}` | `NULL` |
| `ward_id` | `NULL` | `{ward_id}` |
| `taluka_id` | `{taluka_id}` | `NULL` |
| `gram_panchayat_id` | `{gp_id}` | `NULL` |

---

## 3. Sample Data (Urban — Template Rows)

### `cities` — Sample

| id | name_en | name_mr | city_type | taluka_id | is_active |
|----|---------|---------|-----------|-----------|-----------|
| 1 | `[CITY_1_EN]` | `[शहर_१]` | `MUNICIPAL_CORP` | 1 | true |
| 2 | `[CITY_2_EN]` | `[शहर_२]` | `MUNICIPAL_COUNCIL` | 2 | true |

### `wards` — Sample

| id | city_id | ward_number | name_en | name_mr | is_active |
|----|---------|-------------|---------|---------|-----------|
| 1 | 1 | `1` | `[WARD_1_EN]` | `[प्रभाग_१]` | true |
| 2 | 1 | `2` | `[WARD_2_EN]` | `[प्रभाग_२]` | true |
| 3 | 2 | `1` | `[WARD_3_EN]` | `[प्रभाग_३]` | true |

### Urban `booths` — Sample

| id | booth_number | booth_name_mr | booth_type | ward_id | total_voters |
|----|-------------|---------------|-----------|---------|-------------|
| — | `201` | `[मतदान केंद्र]` | URBAN | 1 | `[VOTER_COUNT]` |
| — | `202` | `[मतदान केंद्र]` | URBAN | 2 | `[VOTER_COUNT]` |

---

## 4. API Endpoints — Urban Cascading Dropdowns

```
GET /api/v1/geography/cities
  → Returns: [{ id, name_en, name_mr, city_type }]
  → Used by: Forms where urban location is selected

GET /api/v1/geography/wards?city_id={id}
  → Returns: [{ id, ward_number, name_en, name_mr }]
  → Used by: Ward dropdown (auto-populated on city select)

GET /api/v1/geography/booths?ward_id={id}
  → Returns: [{ id, booth_number, booth_name_mr, total_voters, booth_pramukh_id }]
  → Used by: Booth selector (auto-populated on ward select)

GET /api/v1/geography/search?q={term}&type=urban
  → Full-text search across wards and cities
  → Returns: [{ type, id, name_mr, breadcrumb }]
```

---

## 5. Frontend Urban Cascade Logic

```javascript
// Urban cascading selector — used when user selects area_type = 'URBAN'

const [cities, setCities]   = useState([]);
const [wards, setWards]     = useState([]);
const [booths, setBooths]   = useState([]);

// On city change → fetch wards
const onCityChange = async (cityId) => {
  setWards([]);
  setBooths([]);
  if (!cityId) return;
  const data = await api.get(`/geography/wards?city_id=${cityId}`);
  setWards(data);
};

// On ward change → fetch booths
const onWardChange = async (wardId) => {
  setBooths([]);
  if (!wardId) return;
  const data = await api.get(`/geography/booths?ward_id=${wardId}`);
  setBooths(data);
};
```

---

## 6. Combined Area Type Selector (Rural + Urban)

Many forms (Nivedan, Visitor, Karyakarta) need to handle BOTH rural and urban locations. Use a radio/toggle to switch between hierarchies:

```jsx
// LocationSelector.jsx — handles both rural and urban paths

function LocationSelector({ onChange }) {
  const [areaType, setAreaType] = useState('RURAL'); // 'RURAL' | 'URBAN'

  return (
    <div>
      {/* Toggle */}
      <div className="area-type-toggle">
        <label>
          <input type="radio" value="RURAL"
            checked={areaType === 'RURAL'}
            onChange={() => setAreaType('RURAL')} />
          ग्रामीण (Village)
        </label>
        <label>
          <input type="radio" value="URBAN"
            checked={areaType === 'URBAN'}
            onChange={() => setAreaType('URBAN')} />
          शहरी (Ward)
        </label>
      </div>

      {/* Rural path */}
      {areaType === 'RURAL' && (
        <>
          <TalukaDropdown />    {/* → gram_panchayats */}
          <GpDropdown />        {/* → villages */}
          <VillageDropdown />   {/* → booths */}
          <BoothDropdown />
        </>
      )}

      {/* Urban path */}
      {areaType === 'URBAN' && (
        <>
          <CityDropdown />      {/* → wards */}
          <WardDropdown />      {/* → booths */}
          <BoothDropdown />
        </>
      )}
    </div>
  );
}
```

---

## 7. SQL Seed Script Template (Urban)

```sql
-- ============================================================
-- GEOGRAPHY_URBAN SEED DATA
-- Replace [PLACEHOLDER] values with real constituency city/ward data
-- Run AFTER GEOGRAPHY_RURAL seed (talukas table must exist)
-- ============================================================

-- Step 1: Cities (link to taluka_id from talukas table)
INSERT INTO cities (name_en, name_mr, city_type, taluka_id) VALUES
  ('[CITY_1_EN]', '[शहर_१]', 'MUNICIPAL_CORP',    1),
  ('[CITY_2_EN]', '[शहर_२]', 'MUNICIPAL_COUNCIL', 2);
-- Add all urban bodies...

-- Step 2: Wards
INSERT INTO wards (city_id, ward_number, name_en, name_mr) VALUES
  (1, '1',  '[WARD_1_EN]', '[प्रभाग_१]'),
  (1, '2',  '[WARD_2_EN]', '[प्रभाग_२]'),
  (2, '1',  '[WARD_3_EN]', '[प्रभाग_३]');
-- Add all wards...

-- Step 3: Urban Booths (uses shared booths table)
INSERT INTO booths (booth_number, booth_name_en, booth_name_mr, booth_type, ward_id, total_voters) VALUES
  ('201', '[Station Name EN]', '[मतदान केंद्र]', 'URBAN', 1, [VOTER_COUNT]),
  ('202', '[Station Name EN]', '[मतदान केंद्र]', 'URBAN', 2, [VOTER_COUNT]);
-- Add all urban booths...
```
