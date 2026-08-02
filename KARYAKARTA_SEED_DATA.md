# MLA E-Office — Karyakarta Seed Data & Bulk Import Specification

> **Party Worker Data Schema, Excel Import Template, Validation Rules, Import Service, and Sample Data**
>
> This document defines the complete karyakarta (party worker) data structure, the Excel file template used for bulk import, row-by-row validation logic, the Node.js import service, and realistic sample data for development and testing.
>
> ⚠️ **Action required:** PA must prepare the actual karyakarta Excel file using the template in Section 2 before go-live. Use `New Booth Pramukh Yadi.xlsx` as a starting point.
>
> *Related Documents:* [BUSINESS_RULES.md](file:///s:/MLA%20E%20-%20Office/BUSINESS_RULES.md) (Rules 6.1–6.6) | [GEOGRAPHY_RURAL.md](file:///s:/MLA%20E%20-%20Office/GEOGRAPHY_RURAL.md) | [GEOGRAPHY_URBAN.md](file:///s:/MLA%20E%20-%20Office/GEOGRAPHY_URBAN.md) | [DATA_MODELS.md](file:///s:/MLA%20E%20-%20Office/DATA_MODELS.md) | [ERROR_MESSAGES.md](file:///s:/MLA%20E%20-%20Office/ERROR_MESSAGES.md)

---

## 1. MySQL `karyakartas` Table Schema

```sql
CREATE TABLE karyakartas (
  id                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name           VARCHAR(200) NOT NULL COMMENT 'Full name (Marathi preferred)',
  mobile              VARCHAR(15)  NOT NULL COMMENT 'Primary mobile — must be unique',
  alt_mobile          VARCHAR(15)  NULL     COMMENT 'Alternate mobile (optional)',
  date_of_birth       DATE         NULL     COMMENT 'For birthday greetings via WhatsApp',
  address             VARCHAR(500) NULL     COMMENT 'Residential address',
  village_id          INT UNSIGNED NULL     COMMENT 'FK → villages.id (rural karyakartas)',
  ward_id             INT UNSIGNED NULL     COMMENT 'FK → wards.id (urban karyakartas)',
  gram_panchayat_id   INT UNSIGNED NULL     COMMENT 'Denormalized for fast filtering',
  taluka_id           INT UNSIGNED NULL     COMMENT 'Denormalized for fast filtering',
  booth_id            INT UNSIGNED NOT NULL COMMENT 'FK → booths.id — required, every worker has a booth',
  designation         ENUM('BOOTH_PRAMUKH','WARD_HEAD','SHAKTI_KENDRA','KARYAKARTA','VOLUNTEER','OTHER')
                      NOT NULL DEFAULT 'KARYAKARTA',
  profile_photo_url   VARCHAR(500) NULL     COMMENT 'Cloudinary URL',
  is_active           BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'false = soft-deactivated',
  notes               TEXT    NULL     COMMENT 'PA internal notes',
  joined_date         DATE    NULL     COMMENT 'When they joined the party network',
  created_by          INT UNSIGNED NULL COMMENT 'FK → users.id',
  updated_by          INT UNSIGNED NULL COMMENT 'FK → users.id',
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_karyakarta_mobile (mobile),
  INDEX idx_kar_booth (booth_id),
  INDEX idx_kar_village (village_id),
  INDEX idx_kar_ward (ward_id),
  INDEX idx_kar_taluka (taluka_id),
  INDEX idx_kar_designation (designation),
  INDEX idx_kar_active (is_active),
  INDEX idx_kar_dob (date_of_birth),
  FULLTEXT KEY ft_kar_name (full_name),

  CONSTRAINT fk_kar_booth FOREIGN KEY (booth_id)
    REFERENCES booths(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_kar_village FOREIGN KEY (village_id)
    REFERENCES villages(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_kar_ward FOREIGN KEY (ward_id)
    REFERENCES wards(id) ON UPDATE CASCADE ON DELETE RESTRICT

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Karyakarta (party worker) master directory';
```

---

## 2. Excel Import Template

### File: `karyakarta_import_template.xlsx`

The PA prepares this Excel file with one row per karyakarta. Column headers must match exactly (English or Marathi headers accepted).

| Col | English Header | Marathi Header | Maps To Column | Type | Required | Validation |
|:---:|---------------|---------------|----------------|------|:--------:|------------|
| A | `Name` | `नाव` | `full_name` | Text | ✅ | Min 2 chars, max 200 |
| B | `Mobile` | `मोबाईल` | `mobile` | Text | ✅ | Exactly 10 digits, unique |
| C | `Alt Mobile` | `पर्यायी मोबाईल` | `alt_mobile` | Text | ❌ | 10 digits if provided |
| D | `Date of Birth` | `जन्मतारीख` | `date_of_birth` | Date | ❌ | DD/MM/YYYY or YYYY-MM-DD; not in future |
| E | `Address` | `पत्ता` | `address` | Text | ❌ | Max 500 chars |
| F | `Village/Ward` | `गाव/वॉर्ड` | `village_id` / `ward_id` | Text | ❌ | Must match existing village or ward name |
| G | `Taluka` | `तालुका` | `taluka_id` | Text | ❌ | Must match existing taluka name |
| H | `Booth No.` | `बूथ क्र.` | `booth_id` | Text | ✅ | Must match existing `booths.booth_number` |
| I | `Designation` | `पदनाम` | `designation` | Text | ✅ | One of: `बूथ प्रमुख` / `वॉर्ड प्रमुख` / `शक्ती केंद्र प्रमुख` / `कार्यकर्ता` / `स्वयंसेवक` / `इतर` |

**Designation mapping (Marathi → Enum):**

| Marathi Input | English Alias | Enum Value |
|--------------|---------------|------------|
| बूथ प्रमुख | Booth Pramukh | `BOOTH_PRAMUKH` |
| वॉर्ड प्रमुख | Ward Head | `WARD_HEAD` |
| शक्ती केंद्र प्रमुख | Shakti Kendra Pramukh | `SHAKTI_KENDRA` |
| कार्यकर्ता | Karyakarta | `KARYAKARTA` |
| स्वयंसेवक | Volunteer | `VOLUNTEER` |
| इतर | Other | `OTHER` |

---

## 3. Data Validation Rules

Every row is validated independently. Valid rows are committed; invalid rows are skipped.

| # | Rule | Error Code | Error Message |
|:-:|------|-----------|---------------|
| 1 | `full_name` is required and ≥ 2 characters | `VAL_REQUIRED_FIELD` | "Name is required" |
| 2 | `mobile` must be exactly 10 digits (no spaces, no `+91` prefix) | `VAL_MOBILE_INVALID` | "Mobile must be 10 digits" |
| 3 | `mobile` must be unique across `karyakartas` table (including inactive) | `KAR_DUPLICATE_MOBILE` | "Mobile already exists: {{name}}" |
| 4 | `mobile` must be unique within the import file itself (no two rows same mobile) | `IMP_ROW_ERROR` | "Duplicate mobile in row {{row1}} and {{row2}}" |
| 5 | `booth_number` must exist in `booths` table | `KAR_INVALID_BOOTH` | "Booth '{{booth}}' not found" |
| 6 | `designation` must match one of the 6 enum values (EN or MR accepted) | `VAL_INVALID_ENUM` | "Invalid designation: {{value}}" |
| 7 | `date_of_birth` if provided, must be a valid date and not in the future | `VAL_INVALID_DATE` | "Invalid date of birth" |
| 8 | `village_name` if provided, must exist in `villages` table | `IMP_ROW_ERROR` | "Village '{{name}}' not found" |
| 9 | If designation = `BOOTH_PRAMUKH`, check if booth already has one | `KAR_BOOTH_PRAMUKH_EXISTS` | "Booth {{booth}} already has pramukh: {{name}}" |

---

## 4. Sample Seed Data (15 Karyakartas)

> Fictional data for development and testing. Covers multiple designations, booths, and villages.

| # | Name (full_name) | Mobile | DOB | Village/Ward | Booth No. | Designation |
|:-:|-----------------|--------|-----|-------------|-----------|-------------|
| 1 | राजेश पाटील | 9876543210 | 15/03/1985 | कुसुंबी | 101 | बूथ प्रमुख |
| 2 | सुनीता जाधव | 9876543211 | 22/08/1990 | कुसुंबी | 101 | कार्यकर्ता |
| 3 | गणेश मोरे | 9876543212 | 10/01/1978 | वरुडी | 102 | बूथ प्रमुख |
| 4 | अनिता कांबळे | 9876543213 | 05/11/1992 | वरुडी | 102 | कार्यकर्ता |
| 5 | विक्रम शिंदे | 9876543214 | 30/06/1982 | चिखलदरा | 103 | बूथ प्रमुख |
| 6 | प्रिया देशमुख | 9876543215 | 14/02/1995 | चिखलदरा | 103 | स्वयंसेवक |
| 7 | सुरेश गायकवाड | 9876543216 | 20/09/1980 | अंजनगाव | 104 | शक्ती केंद्र प्रमुख |
| 8 | मीना वाघमारे | 9876543217 | 08/12/1988 | अंजनगाव | 104 | कार्यकर्ता |
| 9 | रमेश इंगळे | 9876543218 | 25/07/1975 | गांधी प्रभाग | 201 | वॉर्ड प्रमुख |
| 10 | संगीता पवार | 9876543219 | 18/04/1993 | गांधी प्रभाग | 201 | कार्यकर्ता |
| 11 | भारत चव्हाण | 9876543220 | 03/10/1986 | नेहरू प्रभाग | 202 | बूथ प्रमुख |
| 12 | ज्योती ठाकरे | 9876543221 | 27/05/1991 | नेहरू प्रभाग | 202 | स्वयंसेवक |
| 13 | अमोल राऊत | 9876543222 | 12/09/1983 | शिवाजी प्रभाग | 203 | बूथ प्रमुख |
| 14 | सविता भोसले | 9876543223 | 01/01/1989 | शिवाजी प्रभाग | 203 | कार्यकर्ता |
| 15 | दीपक वानखेडे | 9876543224 | 16/06/1979 | कुसुंबी | 101 | स्वयंसेवक |

**Covers:**
- 6 different booths (4 rural: 101–104, 2 urban: 201–203)
- All 5 active designations: बूथ प्रमुख (5), वॉर्ड प्रमुख (1), शक्ती केंद्र प्रमुख (1), कार्यकर्ता (5), स्वयंसेवक (3)
- Mix of male and female names
- All with DOB for birthday greeting testing

---

## 5. SQL Seed INSERT (Sample Data)

```sql
-- ============================================================
-- KARYAKARTA SEED DATA — 15 sample party workers
-- booth_id values must match existing booths table IDs
-- Run AFTER geography seed and booths seed
-- ============================================================

INSERT INTO karyakartas
  (full_name, mobile, date_of_birth, address, booth_id, village_id, designation, is_active)
VALUES
  -- Booth 101 — Village: कुसुंबी (Rural)
  ('राजेश पाटील',      '9876543210', '1985-03-15', 'कुसुंबी, ता. [TALUKA]', 1, 1, 'BOOTH_PRAMUKH', TRUE),
  ('सुनीता जाधव',      '9876543211', '1990-08-22', 'कुसुंबी, ता. [TALUKA]', 1, 1, 'KARYAKARTA',    TRUE),
  ('दीपक वानखेडे',    '9876543224', '1979-06-16', 'कुसुंबी, ता. [TALUKA]', 1, 1, 'VOLUNTEER',     TRUE),

  -- Booth 102 — Village: वरुडी (Rural)
  ('गणेश मोरे',        '9876543212', '1978-01-10', 'वरुडी, ता. [TALUKA]',    2, 2, 'BOOTH_PRAMUKH', TRUE),
  ('अनिता कांबळे',    '9876543213', '1992-11-05', 'वरुडी, ता. [TALUKA]',    2, 2, 'KARYAKARTA',    TRUE),

  -- Booth 103 — Village: चिखलदरा (Rural)
  ('विक्रम शिंदे',     '9876543214', '1982-06-30', 'चिखलदरा, ता. [TALUKA]', 3, 3, 'BOOTH_PRAMUKH', TRUE),
  ('प्रिया देशमुख',     '9876543215', '1995-02-14', 'चिखलदरा, ता. [TALUKA]', 3, 3, 'VOLUNTEER',     TRUE),

  -- Booth 104 — Village: अंजनगाव (Rural)
  ('सुरेश गायकवाड',   '9876543216', '1980-09-20', 'अंजनगाव, ता. [TALUKA]', 4, 4, 'SHAKTI_KENDRA', TRUE),
  ('मीना वाघमारे',     '9876543217', '1988-12-08', 'अंजनगाव, ता. [TALUKA]', 4, 4, 'KARYAKARTA',    TRUE),

  -- Booth 201 — Ward: गांधी प्रभाग (Urban)
  ('रमेश इंगळे',       '9876543218', '1975-07-25', 'गांधी प्रभाग, [CITY]',   5, NULL, 'WARD_HEAD',     TRUE),
  ('संगीता पवार',      '9876543219', '1993-04-18', 'गांधी प्रभाग, [CITY]',   5, NULL, 'KARYAKARTA',    TRUE),

  -- Booth 202 — Ward: नेहरू प्रभाग (Urban)
  ('भारत चव्हाण',     '9876543220', '1986-10-03', 'नेहरू प्रभाग, [CITY]',   6, NULL, 'BOOTH_PRAMUKH', TRUE),
  ('ज्योती ठाकरे',     '9876543221', '1991-05-27', 'नेहरू प्रभाग, [CITY]',   6, NULL, 'VOLUNTEER',     TRUE),

  -- Booth 203 — Ward: शिवाजी प्रभाग (Urban)
  ('अमोल राऊत',       '9876543222', '1983-09-12', 'शिवाजी प्रभाग, [CITY]',  7, NULL, 'BOOTH_PRAMUKH', TRUE),
  ('सविता भोसले',      '9876543223', '1989-01-01', 'शिवाजी प्रभाग, [CITY]',  7, NULL, 'KARYAKARTA',    TRUE);

-- Update booths table with Booth Pramukh assignments
UPDATE booths SET booth_pramukh_id = 1  WHERE booth_number = '101';
UPDATE booths SET booth_pramukh_id = 4  WHERE booth_number = '102';
UPDATE booths SET booth_pramukh_id = 6  WHERE booth_number = '103';
UPDATE booths SET booth_pramukh_id = 12 WHERE booth_number = '202';
UPDATE booths SET booth_pramukh_id = 14 WHERE booth_number = '203';
```

---

## 6. Bulk Import API Endpoint

### `POST /api/v1/karyakartas/import`

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer {accessToken}
```

**Request:** Form-data with key `file` → `.xlsx` or `.csv` file

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRows": 15,
    "imported": 13,
    "skipped": 2,
    "errors": [
      {
        "row": 5,
        "field": "mobile",
        "code": "KAR_DUPLICATE_MOBILE",
        "message": {
          "en": "A karyakarta with this mobile number already exists.",
          "mr": "या मोबाईल क्रमांकाचा कार्यकर्ता आधीच अस्तित्वात आहे."
        }
      },
      {
        "row": 12,
        "field": "booth_number",
        "code": "KAR_INVALID_BOOTH",
        "message": {
          "en": "Selected booth does not exist.",
          "mr": "निवडलेला बूथ अस्तित्वात नाही."
        }
      }
    ]
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "IMP_INVALID_FILE_FORMAT",
    "httpStatus": 400,
    "message": {
      "en": "Invalid file format. Only .xlsx and .csv files are accepted.",
      "mr": "अमान्य फाईल स्वरूप. केवळ .xlsx आणि .csv फाईल्स स्वीकारल्या जातात."
    }
  }
}
```

**RBAC:** Only `PA` and `ADMIN` roles can perform bulk import.

---

## 7. Node.js Import Service

```javascript
// src/services/karyakarta.import.service.js

const XLSX    = require('xlsx');
const { Op }  = require('sequelize');
const db      = require('../models');
const { createError } = require('../utils/errorCodes');

// ── Designation mapping (Marathi → Enum) ────────────────────
const DESIGNATION_MAP = {
  'बूथ प्रमुख':           'BOOTH_PRAMUKH',
  'booth pramukh':        'BOOTH_PRAMUKH',
  'वॉर्ड प्रमुख':          'WARD_HEAD',
  'ward head':            'WARD_HEAD',
  'शक्ती केंद्र प्रमुख':   'SHAKTI_KENDRA',
  'shakti kendra pramukh':'SHAKTI_KENDRA',
  'कार्यकर्ता':            'KARYAKARTA',
  'karyakarta':           'KARYAKARTA',
  'स्वयंसेवक':             'VOLUNTEER',
  'volunteer':            'VOLUNTEER',
  'इतर':                  'OTHER',
  'other':                'OTHER',
};

// ── Column header mapping (accepts EN or MR headers) ────────
const HEADER_MAP = {
  'name': 'full_name',      'नाव': 'full_name',
  'mobile': 'mobile',       'मोबाईल': 'mobile',
  'alt mobile': 'alt_mobile','पर्यायी मोबाईल': 'alt_mobile',
  'date of birth': 'dob',   'जन्मतारीख': 'dob',
  'address': 'address',     'पत्ता': 'address',
  'village/ward': 'location','गाव/वॉर्ड': 'location',
  'taluka': 'taluka',       'तालुका': 'taluka',
  'booth no.': 'booth',     'बूथ क्र.': 'booth',
  'designation': 'desig',   'पदनाम': 'desig',
};

/**
 * Parses an uploaded Excel file and imports karyakartas row by row.
 * Valid rows are committed individually; invalid rows are collected as errors.
 *
 * @param {Buffer} fileBuffer - The uploaded file buffer
 * @param {number} userId     - ID of the user performing the import
 * @returns {{ totalRows, imported, skipped, errors }}
 */
async function importKaryakartas(fileBuffer, userId) {
  // 1. Parse Excel
  const workbook  = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const rawData   = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

  if (rawData.length === 0) {
    throw createError('IMP_EMPTY_FILE');
  }
  if (rawData.length > 5000) {
    throw createError('IMP_TOO_MANY_ROWS', { count: rawData.length, max: 5000 });
  }

  // 2. Normalize headers
  const rows = rawData.map((row) => {
    const normalized = {};
    for (const [key, value] of Object.entries(row)) {
      const mappedKey = HEADER_MAP[key.trim().toLowerCase()];
      if (mappedKey) normalized[mappedKey] = String(value).trim();
    }
    return normalized;
  });

  // 3. Pre-fetch lookup tables
  const allBooths   = await db.Booth.findAll({ attributes: ['id', 'booth_number', 'booth_pramukh_id'] });
  const boothMap    = new Map(allBooths.map(b => [b.booth_number, b]));

  const allMobiles  = await db.Karyakarta.findAll({ attributes: ['mobile'] });
  const existingSet = new Set(allMobiles.map(k => k.mobile));

  // Track mobiles within this import file for intra-file duplicates
  const importMobileSet = new Set();

  // 4. Process each row
  const result = { totalRows: rows.length, imported: 0, skipped: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const row    = rows[i];
    const rowNum = i + 2; // Excel row (header is row 1)

    try {
      // ── Validate required fields ──────────────────────
      if (!row.full_name || row.full_name.length < 2) {
        throw { field: 'full_name', code: 'VAL_REQUIRED_FIELD' };
      }
      if (!row.mobile || !/^\d{10}$/.test(row.mobile)) {
        throw { field: 'mobile', code: 'VAL_MOBILE_INVALID' };
      }
      if (!row.booth) {
        throw { field: 'booth', code: 'VAL_REQUIRED_FIELD' };
      }

      // ── Validate mobile uniqueness ────────────────────
      if (existingSet.has(row.mobile)) {
        throw { field: 'mobile', code: 'KAR_DUPLICATE_MOBILE' };
      }
      if (importMobileSet.has(row.mobile)) {
        throw { field: 'mobile', code: 'IMP_ROW_ERROR',
                message: `Duplicate mobile within file (row ${rowNum})` };
      }

      // ── Validate booth exists ─────────────────────────
      const booth = boothMap.get(row.booth);
      if (!booth) {
        throw { field: 'booth', code: 'KAR_INVALID_BOOTH' };
      }

      // ── Validate designation ──────────────────────────
      const desigInput = (row.desig || 'कार्यकर्ता').toLowerCase();
      const designation = DESIGNATION_MAP[desigInput];
      if (!designation) {
        throw { field: 'designation', code: 'VAL_INVALID_ENUM' };
      }

      // ── Parse optional date_of_birth ──────────────────
      let dob = null;
      if (row.dob) {
        dob = new Date(row.dob);
        if (isNaN(dob.getTime()) || dob > new Date()) {
          throw { field: 'date_of_birth', code: 'VAL_INVALID_DATE' };
        }
      }

      // ── INSERT into database ──────────────────────────
      const newKaryakarta = await db.Karyakarta.create({
        full_name:     row.full_name,
        mobile:        row.mobile,
        alt_mobile:    row.alt_mobile || null,
        date_of_birth: dob,
        address:       row.address || null,
        booth_id:      booth.id,
        designation:   designation,
        is_active:     true,
        created_by:    userId,
      });

      // ── Post-import: Booth Pramukh assignment ─────────
      if (designation === 'BOOTH_PRAMUKH') {
        // If booth already has a pramukh, demote old one
        if (booth.booth_pramukh_id) {
          await db.Karyakarta.update(
            { designation: 'KARYAKARTA' },
            { where: { id: booth.booth_pramukh_id } }
          );
        }
        await db.Booth.update(
          { booth_pramukh_id: newKaryakarta.id },
          { where: { id: booth.id } }
        );
      }

      // Track imported mobile
      importMobileSet.add(row.mobile);
      existingSet.add(row.mobile);
      result.imported++;

    } catch (err) {
      result.skipped++;
      result.errors.push({
        row:   rowNum,
        field: err.field || 'unknown',
        code:  err.code  || 'SYS_INTERNAL_ERROR',
        value: row[err.field] || null,
      });
    }
  }

  // 5. Log import activity
  await db.AuditLog.create({
    user_id:     userId,
    action:      'BULK_IMPORT_KARYAKARTA',
    module:      'karyakarta',
    description: `Imported ${result.imported}/${result.totalRows} karyakartas. ${result.skipped} skipped.`,
  });

  return result;
}

module.exports = { importKaryakartas };
```

---

## 8. Post-Import Actions

After a successful import, the system automatically performs:

| # | Action | Trigger | Details |
|:-:|--------|---------|---------|
| 1 | **Booth Pramukh Assignment** | Row has `designation = BOOTH_PRAMUKH` | Updates `booths.booth_pramukh_id`; if booth already has one, demotes old pramukh to `KARYAKARTA` |
| 2 | **Booth Worker Count** | Any row imported | Frontend dashboard recalculates `workers_assigned` count per booth dynamically via query |
| 3 | **Birthday Queue Check** | Row has `date_of_birth` on today | If DOB matches today, karyakarta is immediately added to the WhatsApp greeting queue |
| 4 | **Audit Log** | Every import | Logs `BULK_IMPORT_KARYAKARTA` with total/imported/skipped counts |
| 5 | **Import Report Download** | After import | Frontend shows results table + "Download Error Report" CSV for skipped rows |

---

## 9. Import Preview UI Flow

Before committing the import, the PA previews the data:

```
PA clicks "Bulk Import" button
         │
         ▼
  File picker → selects .xlsx
         │
         ▼
┌─────────────────────────────────┐
│  PREVIEW SCREEN                 │
│                                 │
│  Total Rows: 150                │
│  ✅ Valid: 143                  │
│  ❌ Errors: 7                   │
│                                 │
│  ┌─────────────────────────────┐│
│  │ Error Table:                ││
│  │ Row 23: Mobile duplicate    ││
│  │ Row 45: Booth 999 not found ││
│  │ Row 78: Invalid designation ││
│  │ ...                         ││
│  └─────────────────────────────┘│
│                                 │
│  [ Cancel ]    [ Import 143 ✅ ]│
└─────────────────────────────────┘
         │
         ▼ (PA clicks Import)
  POST /api/v1/karyakartas/import
         │
         ▼
  Toast: "Import complete — 143 imported, 7 skipped"
```

---

## 10. Pre-Live Data Preparation Checklist

| # | Task | Status |
|:-:|------|:------:|
| 1 | Collect all karyakarta names and mobile numbers | ⬜ |
| 2 | Verify mobile numbers are 10 digits (no `+91` prefix) | ⬜ |
| 3 | Remove duplicate mobile numbers within the file | ⬜ |
| 4 | Ensure booth numbers match `booths` table (`GEOGRAPHY_RURAL` / `GEOGRAPHY_URBAN` seed) | ⬜ |
| 5 | Fill designations using accepted Marathi terms (§2 mapping table) | ⬜ |
| 6 | Fill Date of Birth wherever available (for birthday greetings) | ⬜ |
| 7 | Assign exactly one `बूथ प्रमुख` per booth | ⬜ |
| 8 | Run geography seed SQL BEFORE karyakarta import (booths must exist first) | ⬜ |
| 9 | Test import with 5 sample rows first | ⬜ |
| 10 | Run full import from `karyakarta_import_template.xlsx` | ⬜ |
| 11 | Verify booth pramukh assignments in Booth Architecture screen | ⬜ |
| 12 | Send a test birthday greeting to verify WhatsApp integration | ⬜ |
