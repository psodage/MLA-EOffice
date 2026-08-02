# MLA E-Office — Auto-Routing Rules

> **Nivedan Auto-Routing Configuration — Category → Government Department + Office Staff + Priority Override**
>
> This document defines the complete auto-routing ruleset applied when a new nivedan is created. The system auto-suggests a government department AND a default office staff member based on the nivedan category. PA can always override these before saving.
>
> *Related Documents:* [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md) | [BUSINESS_RULES.md](file:///s:/MLA%20E%20-%20Office/BUSINESS_RULES.md) | [USER_ROLES.md](file:///s:/MLA%20E%20-%20Office/USER_ROLES.md) | [WHATSAPP_TEMPLATES.md](file:///s:/MLA%20E%20-%20Office/WHATSAPP_TEMPLATES.md)

---

## 1. Overview

Auto-routing is the **intelligent pre-assignment** system that fires the moment a nivedan is saved. It eliminates the need for PA to manually look up which department or staff member handles each type of complaint.

### How It Works

```
Citizen / Receptionist creates nivedan
              │
              ▼
   PA selects Category (e.g., WATER_SUPPLY)
              │
              ▼
┌─────────────────────────────────────────────────┐
│              AUTO-ROUTING ENGINE                 │
│                                                  │
│  Looks up category in routing_rules table        │
│                                                  │
│  Sets:                                           │
│  ├── department_forwarded_to_id → WATER_DEPT     │
│  ├── assigned_to_user_id        → Staff: Ramesh  │
│  └── priority                   → MEDIUM (default)│
│       (or HIGH/LOW if category has override)     │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
         PA REVIEWS the auto-suggestion
                     │
              ┌──────┴──────┐
              │             │
              ▼             ▼
         Accept         Override
         (save as-is)   (change dept/staff/priority)
```

### Key Principles

| Principle | Rule |
|-----------|------|
| **Always a Suggestion** | Auto-routing pre-fills fields — it never locks them. PA has full override ability. |
| **Category-Level** | Sub-categories inherit the parent category's routing rule. No sub-category-specific routing. |
| **Two-Tier Assignment** | Every category maps to both a Government Department AND an Office Staff member. |
| **Priority Override** | Certain high-urgency sub-categories automatically raise priority to HIGH. |
| **General/Other Exception** | `GENERAL_OTHER` category has no default — department and staff remain unassigned until PA manually sets them. |
| **Audit Trail** | Any PA override of the auto-suggestion is logged in `audit_logs` with old and new values. |
| **Configurable** | The routing table is stored in the DB (`routing_rules` table) and editable via Admin settings — no code change needed to update routing. |

---

## 2. Office Staff Roles for Assignment

Auto-routing assigns nivedans to office staff based on their specialization. The following is the **default fictional staff roster** used in this spec. In production, the Admin configures real staff names in Settings → Staff Routing.

| Staff Code | Name (Sample) | Role | Handles |
|-----------|--------------|------|---------|
| `STAFF_RAMESH` | Ramesh Patil | PA | Water Supply, Electricity, Road/Drainage |
| `STAFF_SUNITA` | Sunita Jadhav | PA | Health, Sanitation, Women & Child |
| `STAFF_GANESH` | Ganesh More | PA | Land/Revenue, Certificates, Agriculture |
| `STAFF_ANITA` | Anita Kamble | Receptionist | Housing, Pension, Ration, Employment |
| `STAFF_VIKRAM` | Vikram Shinde | PA | Police, General/Other |

> **Note:** These are sample assignments. The actual staff mapping is configured in the Admin panel under **Settings → Routing Configuration**. Developers should treat these as seed data defaults.

---

## 3. Master Routing Table

This is the single authoritative table for all routing rules. It maps directly to the `routing_rules` database table.

| # | Category Code | English Name | Marathi Name | Default Department | Dept Code | Default Staff | Staff Code | Default Priority | Escalation Days |
|---|--------------|-------------|-------------|------------------|-----------|--------------|-----------|:---:|:---:|
| 1 | `WATER_SUPPLY` | Water Supply | पाणीपुरवठा | Water Supply Dept | `WATER_DEPT` | Ramesh Patil | `STAFF_RAMESH` | MEDIUM | 5 |
| 2 | `ROAD_DRAINAGE` | Road / Drainage | रस्ते / गटार | Public Works Dept | `PWD` | Ramesh Patil | `STAFF_RAMESH` | MEDIUM | 10 |
| 3 | `ELECTRICITY` | Electricity | वीजपुरवठा | MSEDCL | `MSEDCL` | Ramesh Patil | `STAFF_RAMESH` | MEDIUM | 3 |
| 4 | `LAND_REVENUE` | Land / Revenue | जमीन / महसूल | Revenue Dept | `REVENUE` | Ganesh More | `STAFF_GANESH` | MEDIUM | 5 |
| 5 | `EDUCATION` | Education | शिक्षण | Education Dept | `EDUCATION_DEPT` | Sunita Jadhav | `STAFF_SUNITA` | MEDIUM | 5 |
| 6 | `HEALTH_MEDICAL` | Health / Medical | आरोग्य | Health Dept | `HEALTH_DEPT` | Sunita Jadhav | `STAFF_SUNITA` | MEDIUM | 2 |
| 7 | `PENSION_WELFARE` | Pension / Social Welfare | पेन्शन / समाजकल्याण | Social Welfare | `SOCIAL_WELFARE` | Anita Kamble | `STAFF_ANITA` | MEDIUM | 5 |
| 8 | `RATION_CARD` | Ration Card / PDS | रेशनकार्ड | Food & Civil Supplies | `FOOD_SUPPLY` | Anita Kamble | `STAFF_ANITA` | MEDIUM | 5 |
| 9 | `CERTIFICATE` | Caste / Income Certificate | जात / उत्पन्न प्रमाणपत्र | Tahsildar Office | `TAHSILDAR` | Ganesh More | `STAFF_GANESH` | MEDIUM | 7 |
| 10 | `HOUSING` | Housing / Awas Yojana | घरकुल / आवास योजना | Collector Office | `COLLECTOR` | Anita Kamble | `STAFF_ANITA` | MEDIUM | 7 |
| 11 | `AGRICULTURE` | Agriculture | शेती | Agriculture Dept | `AGRICULTURE_DEPT` | Ganesh More | `STAFF_GANESH` | MEDIUM | 7 |
| 12 | `EMPLOYMENT` | Employment / Rojgar | रोजगार | Social Welfare | `SOCIAL_WELFARE` | Anita Kamble | `STAFF_ANITA` | MEDIUM | 7 |
| 13 | `POLICE` | Police / Law & Order | पोलीस | Police Dept | `POLICE_DEPT` | Vikram Shinde | `STAFF_VIKRAM` | MEDIUM | 5 |
| 14 | `GENERAL_OTHER` | General / Other | इतर | _(None — PA assigns)_ | `NULL` | Vikram Shinde | `STAFF_VIKRAM` | MEDIUM | 7 |

---

## 4. Priority Override Rules

By default, all nivedans start with `MEDIUM` priority. However, certain complaint types indicate emergency or high-urgency situations and should auto-escalate to `HIGH` priority. These overrides are triggered by the **sub-category** selected, even though routing is at category level.

### 4A. Automatic HIGH Priority Triggers

| Sub-Category Code | English Name | Reason for HIGH Priority |
|-------------------|-------------|--------------------------|
| `HEALTH_DOCTOR` | Doctor not available | Patients cannot receive care — health emergency risk |
| `HEALTH_AMBULANCE` | Ambulance service issue | Emergency transport blocked — life risk |
| `HEALTH_MEDICINE` | Medicine shortage | Critical medicines unavailable |
| `ELEC_WIRE_DANGER` | Dangerous hanging wire | Immediate electrocution risk |
| `ELEC_NO_SUPPLY` | No electricity supply (whole area) | Complete blackout — essential services affected |
| `WATER_CONTAMINATED` | Contaminated/dirty water | Disease outbreak risk |
| `POLICE` (category) | Any Police/Law & Order complaint | Safety/security — always HIGH |

### 4B. Automatic LOW Priority Triggers

| Sub-Category Code | English Name | Reason for LOW Priority |
|-------------------|-------------|-------------------------|
| `WATER_BILL_DISPUTE` | Water bill dispute | Administrative — no urgency |
| `ELEC_BILL_DISPUTE` | Electricity bill dispute | Administrative — no urgency |
| `ROAD_FOOTPATH` | Footpath issue | Infrastructure non-emergency |
| `ROAD_SPEED_BREAKER` | Speed breaker request | Request, not complaint |
| `WATER_NEW_CONNECTION` | New connection request | Request, not complaint |
| `ELEC_NEW_CONNECTION` | New electricity connection request | Request, not complaint |
| `LAND_SURVEY` | Land survey request | Scheduled work — not urgent |

### 4C. Priority Decision Matrix

```
Sub-category selected?
       │
  ┌────┴────┐
  │         │
  ▼         ▼
In HIGH   In LOW    Neither?
override  override  │
list?     list?     ▼
  │         │     Use CATEGORY
  ▼         ▼     default priority
HIGH      LOW     (always MEDIUM
                   unless category
                   has own override)
```

---

## 5. Routing Configuration by Category (Detailed View)

### Category 1: Water Supply (पाणीपुरवठा)

```
Category:    WATER_SUPPLY
Department:  Water Supply Dept (WATER_DEPT)
             → Default Officer: कार्यकारी अभियंता
Staff:       Ramesh Patil (STAFF_RAMESH)
Priority:    MEDIUM (default)
Escalation:  5 days → Level 1, 8 days → Level 2

Priority Overrides:
  WATER_CONTAMINATED  → HIGH  (disease outbreak risk)
  WATER_BILL_DISPUTE  → LOW   (administrative)
  WATER_NEW_CONNECTION → LOW  (new request)
```

---

### Category 2: Road / Drainage (रस्ते / गटार)

```
Category:    ROAD_DRAINAGE
Department:  Public Works Department (PWD)
             → Default Officer: कार्यकारी अभियंता
Staff:       Ramesh Patil (STAFF_RAMESH)
Priority:    MEDIUM (default)
Escalation:  10 days → Level 1, 13 days → Level 2

Priority Overrides:
  ROAD_FOOTPATH      → LOW  (non-emergency)
  ROAD_SPEED_BREAKER → LOW  (request type)

Note: Road complaints have the longest escalation (10 days)
      because repair tendering takes time.
```

---

### Category 3: Electricity (वीजपुरवठा)

```
Category:    ELECTRICITY
Department:  MSEDCL (MSEDCL)
             → Default Officer: अधीक्षक अभियंता
Staff:       Ramesh Patil (STAFF_RAMESH)
Priority:    MEDIUM (default)
Escalation:  3 days → Level 1, 6 days → Level 2

Priority Overrides:
  ELEC_WIRE_DANGER    → HIGH  (electrocution risk)
  ELEC_NO_SUPPLY      → HIGH  (complete blackout)
  ELEC_BILL_DISPUTE   → LOW   (administrative)
  ELEC_NEW_CONNECTION → LOW   (request type)

Note: Electricity has the second-shortest escalation (3 days)
      because power outages affect health/safety.
```

---

### Category 4: Land / Revenue (जमीन / महसूल)

```
Category:    LAND_REVENUE
Department:  Revenue Department (REVENUE)
             → Default Officer: जिल्हाधिकारी / तहसीलदार
Staff:       Ganesh More (STAFF_GANESH)
Priority:    MEDIUM (default)
Escalation:  5 days → Level 1, 8 days → Level 2

Priority Overrides:
  LAND_SURVEY → LOW  (scheduled request)

Note: Land disputes often involve court proceedings.
      Ganesh More handles all revenue/legal matters.
```

---

### Category 5: Education (शिक्षण)

```
Category:    EDUCATION
Department:  Education Department (EDUCATION_DEPT)
             → Default Officer: शिक्षणाधिकारी
Staff:       Sunita Jadhav (STAFF_SUNITA)
Priority:    MEDIUM (default)
Escalation:  5 days → Level 1, 8 days → Level 2

Priority Overrides:
  None — all education complaints are MEDIUM.

Note: Sunita Jadhav handles all health and education
      as both relate to social welfare issues.
```

---

### Category 6: Health / Medical (आरोग्य)

```
Category:    HEALTH_MEDICAL
Department:  Health Department (HEALTH_DEPT)
             → Default Officer: जिल्हा आरोग्य अधिकारी
Staff:       Sunita Jadhav (STAFF_SUNITA)
Priority:    MEDIUM (default)
Escalation:  2 days → Level 1, 5 days → Level 2  ← SHORTEST

Priority Overrides:
  HEALTH_DOCTOR     → HIGH  (patients without care)
  HEALTH_AMBULANCE  → HIGH  (life risk)
  HEALTH_MEDICINE   → HIGH  (critical medicines)

Note: Health has the SHORTEST escalation deadline (2 days)
      because delays can be life-threatening.
```

---

### Category 7: Pension / Social Welfare (पेन्शन / समाजकल्याण)

```
Category:    PENSION_WELFARE
Department:  Social Welfare Department (SOCIAL_WELFARE)
             → Default Officer: समाजकल्याण अधिकारी
Staff:       Anita Kamble (STAFF_ANITA)
Priority:    MEDIUM (default)
Escalation:  5 days → Level 1, 8 days → Level 2

Priority Overrides:
  None — all pension/welfare complaints are MEDIUM.
```

---

### Category 8: Ration Card / PDS (रेशनकार्ड)

```
Category:    RATION_CARD
Department:  Food & Civil Supplies (FOOD_SUPPLY)
             → Default Officer: जिल्हा पुरवठा अधिकारी
Staff:       Anita Kamble (STAFF_ANITA)
Priority:    MEDIUM (default)
Escalation:  5 days → Level 1, 8 days → Level 2

Priority Overrides:
  None — all ration card complaints are MEDIUM.
```

---

### Category 9: Caste / Income Certificate (जात / उत्पन्न प्रमाणपत्र)

```
Category:    CERTIFICATE
Department:  Tahsildar Office (TAHSILDAR)
             → Default Officer: तहसीलदार
Staff:       Ganesh More (STAFF_GANESH)
Priority:    MEDIUM (default)
Escalation:  7 days → Level 1, 10 days → Level 2

Priority Overrides:
  None — certificate complaints are MEDIUM.

Note: Ganesh More handles Tahsildar + Revenue matters
      as they both relate to land/revenue administration.
```

---

### Category 10: Housing / Awas Yojana (घरकुल / आवास योजना)

```
Category:    HOUSING
Department:  Collector Office (COLLECTOR)
             → Default Officer: जिल्हाधिकारी
Staff:       Anita Kamble (STAFF_ANITA)
Priority:    MEDIUM (default)
Escalation:  7 days → Level 1, 10 days → Level 2

Priority Overrides:
  None — housing scheme complaints are MEDIUM.
```

---

### Category 11: Agriculture (शेती)

```
Category:    AGRICULTURE
Department:  Agriculture Department (AGRICULTURE_DEPT)
             → Default Officer: जिल्हा कृषी अधिकारी
Staff:       Ganesh More (STAFF_GANESH)
Priority:    MEDIUM (default)
Escalation:  7 days → Level 1, 10 days → Level 2

Priority Overrides:
  None — agriculture complaints are MEDIUM.

Note: Seasonal urgency (crop damage) should be manually
      elevated to HIGH by PA based on context.
```

---

### Category 12: Employment / Rojgar (रोजगार)

```
Category:    EMPLOYMENT
Department:  Social Welfare Department (SOCIAL_WELFARE)
             → Default Officer: समाजकल्याण अधिकारी
Staff:       Anita Kamble (STAFF_ANITA)
Priority:    MEDIUM (default)
Escalation:  7 days → Level 1, 10 days → Level 2

Priority Overrides:
  None — employment complaints are MEDIUM.
```

---

### Category 13: Police / Law & Order (पोलीस)

```
Category:    POLICE
Department:  Police Department (POLICE_DEPT)
             → Default Officer: पोलीस अधीक्षक
Staff:       Vikram Shinde (STAFF_VIKRAM)
Priority:    HIGH  ← ALWAYS HIGH (safety risk)
Escalation:  5 days → Level 1, 8 days → Level 2

Priority Overrides:
  ALL sub-categories → HIGH (entire category is HIGH)

Note: Any law & order complaint is treated as HIGH.
      Vikram Shinde handles security-related matters.
```

---

### Category 14: General / Other (इतर)

```
Category:    GENERAL_OTHER
Department:  NULL ← No default (PA must assign manually)
Staff:       Vikram Shinde (STAFF_VIKRAM) ← Catch-all
Priority:    MEDIUM (default)
Escalation:  7 days → Level 1, 10 days → Level 2

Priority Overrides:
  None — PA must judge urgency manually.

Note: Department field shows a warning on the nivedan form:
      "⚠️ No default department for 'General/Other'.
       Please assign a department manually."
```

---

## 6. Database Schema — routing_rules Table

```sql
CREATE TABLE routing_rules (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  category_code         VARCHAR(50)  NOT NULL UNIQUE,  -- e.g., 'WATER_SUPPLY'
  category_name_en      VARCHAR(100) NOT NULL,
  category_name_mr      VARCHAR(100) NOT NULL,
  default_department_id INT NULL,                       -- FK → departments.id (NULL for GENERAL_OTHER)
  default_staff_user_id INT NULL,                       -- FK → users.id
  default_priority      ENUM('HIGH','MEDIUM','LOW') NOT NULL DEFAULT 'MEDIUM',
  escalation_days       INT NOT NULL DEFAULT 7,         -- Days before Level 1 escalation
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (default_department_id) REFERENCES departments(id),
  FOREIGN KEY (default_staff_user_id) REFERENCES users(id)
);
```

```sql
CREATE TABLE priority_override_rules (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  sub_category_code   VARCHAR(50) NOT NULL UNIQUE,  -- e.g., 'HEALTH_DOCTOR'
  override_priority   ENUM('HIGH','MEDIUM','LOW') NOT NULL,
  reason              VARCHAR(255) NOT NULL,          -- Human-readable reason
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. Seed Data — SQL Insert Statements

```sql
-- ============================================================
-- routing_rules seed data
-- Replace user IDs and department IDs with actual values
-- from your seeded users and departments tables.
-- ============================================================

INSERT INTO routing_rules (category_code, category_name_en, category_name_mr, default_department_id, default_staff_user_id, default_priority, escalation_days) VALUES
('WATER_SUPPLY',    'Water Supply',              'पाणीपुरवठा',              10, 2, 'MEDIUM', 5),
('ROAD_DRAINAGE',   'Road / Drainage',           'रस्ते / गटार',            9,  2, 'MEDIUM', 10),
('ELECTRICITY',     'Electricity',               'वीजपुरवठा',               11, 2, 'MEDIUM', 3),
('LAND_REVENUE',    'Land / Revenue',            'जमीन / महसूल',            12, 3, 'MEDIUM', 5),
('EDUCATION',       'Education',                 'शिक्षण',                  13, 4, 'MEDIUM', 5),
('HEALTH_MEDICAL',  'Health / Medical',          'आरोग्य',                  14, 4, 'MEDIUM', 2),
('PENSION_WELFARE', 'Pension / Social Welfare',  'पेन्शन / समाजकल्याण',    15, 5, 'MEDIUM', 5),
('RATION_CARD',     'Ration Card / PDS',         'रेशनकार्ड',               20, 5, 'MEDIUM', 5),
('CERTIFICATE',     'Caste / Income Certificate','जात / उत्पन्न प्रमाणपत्र', 2, 3, 'MEDIUM', 7),
('HOUSING',         'Housing / Awas Yojana',     'घरकुल / आवास योजना',      1,  5, 'MEDIUM', 7),
('AGRICULTURE',     'Agriculture',               'शेती',                    16, 3, 'MEDIUM', 7),
('EMPLOYMENT',      'Employment / Rojgar',       'रोजगार',                  15, 5, 'MEDIUM', 7),
('POLICE',          'Police / Law & Order',      'पोलीस',                   17, 6, 'HIGH',   5),
('GENERAL_OTHER',   'General / Other',           'इतर',                     NULL, 6, 'MEDIUM', 7);

-- ============================================================
-- priority_override_rules seed data
-- ============================================================

INSERT INTO priority_override_rules (sub_category_code, override_priority, reason) VALUES
-- HIGH priority overrides
('HEALTH_DOCTOR',      'HIGH', 'Patients cannot receive care — immediate health risk'),
('HEALTH_AMBULANCE',   'HIGH', 'Emergency transport blocked — life risk'),
('HEALTH_MEDICINE',    'HIGH', 'Critical medicines unavailable'),
('ELEC_WIRE_DANGER',   'HIGH', 'Immediate electrocution risk to public'),
('ELEC_NO_SUPPLY',     'HIGH', 'Complete blackout — essential services affected'),
('WATER_CONTAMINATED', 'HIGH', 'Contaminated water — disease outbreak risk'),

-- LOW priority overrides
('WATER_BILL_DISPUTE',   'LOW', 'Administrative dispute — no public urgency'),
('ELEC_BILL_DISPUTE',    'LOW', 'Administrative dispute — no public urgency'),
('ROAD_FOOTPATH',        'LOW', 'Non-emergency infrastructure improvement'),
('ROAD_SPEED_BREAKER',   'LOW', 'Civic request — not an emergency'),
('WATER_NEW_CONNECTION', 'LOW', 'New connection request — not a complaint'),
('ELEC_NEW_CONNECTION',  'LOW', 'New connection request — not a complaint'),
('LAND_SURVEY',          'LOW', 'Scheduled administrative work');
```

---

## 8. Backend Service — autoRoute.service.js

```javascript
// services/autoRoute.service.js
// Applies auto-routing rules when a new nivedan is created.

const { RoutingRule, PriorityOverrideRule } = require('../models');

/**
 * Computes the auto-routing suggestion for a nivedan.
 * Called by nivedanController.create() BEFORE saving the record.
 *
 * @param {string} categoryCode    - e.g., 'WATER_SUPPLY'
 * @param {string} subCategoryCode - e.g., 'WATER_CONTAMINATED' (nullable)
 * @returns {Promise<AutoRouteSuggestion>}
 */
async function computeAutoRoute(categoryCode, subCategoryCode = null) {
  // 1. Look up the base routing rule for the category
  const rule = await RoutingRule.findOne({
    where: { category_code: categoryCode, is_active: true }
  });

  if (!rule) {
    // Fallback: no routing rule found — return nulls, PA must assign
    return {
      suggestedDepartmentId: null,
      suggestedStaffUserId:  null,
      suggestedPriority:     'MEDIUM',
      escalationDays:        7,
      routingSource:         'FALLBACK_NO_RULE'
    };
  }

  // 2. Start with the category's defaults
  let suggestedPriority = rule.default_priority;
  let prioritySource    = 'CATEGORY_DEFAULT';

  // 3. Check sub-category priority override (if sub-category provided)
  if (subCategoryCode) {
    const override = await PriorityOverrideRule.findOne({
      where: { sub_category_code: subCategoryCode, is_active: true }
    });

    if (override) {
      suggestedPriority = override.override_priority;
      prioritySource    = 'SUBCATEGORY_OVERRIDE';
    }
  }

  return {
    suggestedDepartmentId: rule.default_department_id,   // null for GENERAL_OTHER
    suggestedStaffUserId:  rule.default_staff_user_id,
    suggestedPriority,
    escalationDays:        rule.escalation_days,
    routingSource:         prioritySource
  };
}

/**
 * Applies the auto-routing suggestion to a nivedan record.
 * Called inside nivedanController.create() after form validation.
 *
 * @param {object} nivedanData     - Validated form data from PA
 * @param {object} routeSuggestion - Output of computeAutoRoute()
 * @returns {object} nivedanData enriched with routing fields
 */
function applyAutoRoute(nivedanData, routeSuggestion) {
  return {
    ...nivedanData,
    // Only apply suggestions if PA hasn't already set these manually
    department_forwarded_to_id: nivedanData.department_forwarded_to_id
      ?? routeSuggestion.suggestedDepartmentId,
    assigned_to_user_id: nivedanData.assigned_to_user_id
      ?? routeSuggestion.suggestedStaffUserId,
    priority: nivedanData.priority
      ?? routeSuggestion.suggestedPriority,
    escalation_days:   routeSuggestion.escalationDays,
    auto_routed:       true,
    routing_source:    routeSuggestion.routingSource,
  };
}

module.exports = { computeAutoRoute, applyAutoRoute };
```

---

## 9. Controller Integration

```javascript
// controllers/nivedan.controller.js (relevant excerpt)

const autoRouteService = require('../services/autoRoute.service');
const auditService     = require('../services/audit.service');

async function createNivedan(req, res) {
  try {
    const { categoryCode, subCategoryCode, ...formData } = req.body;

    // Step 1: Compute auto-routing suggestion
    const routeSuggestion = await autoRouteService.computeAutoRoute(
      categoryCode,
      subCategoryCode
    );

    // Step 2: Apply routing to form data (PA overrides take precedence)
    const enrichedData = autoRouteService.applyAutoRoute(
      { ...formData, category_code: categoryCode, sub_category_code: subCategoryCode },
      routeSuggestion
    );

    // Step 3: Generate tracking ID
    enrichedData.tracking_id = await generateTrackingId(); // NIV-YYYY-NNNNN

    // Step 4: Save to DB
    const nivedan = await Nivedan.create(enrichedData);

    // Step 5: Log audit entry
    await auditService.log({
      userId:      req.user.id,
      action:      'CREATE',
      module:      'nivedan',
      entityType:  'nivedan',
      entityId:    nivedan.id,
      newValues:   enrichedData,
    });

    // Step 6: Send WhatsApp acknowledgment
    await whatsappService.send({
      template:    'NIV_ACK',
      mobile:      formData.citizen_mobile,
      placeholders: {
        1: formData.citizen_name,
        2: nivedan.tracking_id,
        3: formatDate(nivedan.created_at),
        4: process.env.MLA_NAME_MR,
      }
    });

    return res.status(201).json({
      success:        true,
      tracking_id:    nivedan.tracking_id,
      routing:        routeSuggestion,
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
```

---

## 10. API Endpoint

```
GET /api/routing-rules/suggest

Query Parameters:
  ?categoryCode=WATER_SUPPLY
  &subCategoryCode=WATER_CONTAMINATED    (optional)

Response:
{
  "success": true,
  "suggestion": {
    "department": {
      "id": 10,
      "code": "WATER_DEPT",
      "name_en": "Water Supply Department",
      "name_mr": "पाणीपुरवठा विभाग",
      "default_officer": "कार्यकारी अभियंता"
    },
    "staff": {
      "id": 2,
      "name": "Ramesh Patil",
      "role": "PA"
    },
    "priority": "HIGH",
    "prioritySource": "SUBCATEGORY_OVERRIDE",
    "escalationDays": 5,
    "warningMessage": null
  }
}
```

**Special response for GENERAL_OTHER:**
```json
{
  "success": true,
  "suggestion": {
    "department": null,
    "staff": { "id": 6, "name": "Vikram Shinde", "role": "PA" },
    "priority": "MEDIUM",
    "prioritySource": "CATEGORY_DEFAULT",
    "escalationDays": 7,
    "warningMessage": "⚠️ 'General/Other' तक्रारींसाठी विभाग स्वयं-नियुक्त होत नाही. कृपया विभाग निवडा."
  }
}
```

---

## 11. Frontend Behavior (PA Nivedan Form)

When PA selects a category on the nivedan form:

```
PA selects Category dropdown
          │
          ▼
Frontend calls:
GET /api/routing-rules/suggest?categoryCode=WATER_SUPPLY
          │
          ▼
Response received:
          │
          ├── Department field: pre-filled with "पाणीपुरवठा विभाग"
          │   (shown as blue "auto-suggested" badge)
          │
          ├── Assigned To field: pre-filled with "Ramesh Patil"
          │   (shown as blue "auto-suggested" badge)
          │
          └── Priority field: set to "HIGH" (if sub-category triggered override)
              (shown as red "auto-set" badge)

PA can click any pre-filled field to override it.
Override clears the "auto-suggested" badge and shows "manually set".
```

**UI Badge Logic:**

| State | Badge Style | Color |
|-------|------------|-------|
| Auto-suggested (not touched) | `🤖 Auto` | Blue |
| Manually overridden by PA | `✏️ Manual` | Amber |
| Not set (GENERAL_OTHER) | `⚠️ Required` | Red |

---

## 12. Routing Summary Quick-Reference

```
CATEGORY              → DEPT        → STAFF       → PRIORITY  → ESC DAYS
──────────────────────────────────────────────────────────────────────────
Water Supply          → WATER_DEPT  → Ramesh      → MEDIUM    → 5d
  ↳ WATER_CONTAMINATED                            → HIGH
  ↳ WATER_BILL_DISPUTE / NEW_CONNECTION           → LOW

Road / Drainage       → PWD         → Ramesh      → MEDIUM    → 10d
  ↳ ROAD_FOOTPATH / SPEED_BREAKER                → LOW

Electricity           → MSEDCL      → Ramesh      → MEDIUM    → 3d
  ↳ ELEC_WIRE_DANGER / NO_SUPPLY                 → HIGH
  ↳ ELEC_BILL_DISPUTE / NEW_CONNECTION           → LOW

Land / Revenue        → REVENUE     → Ganesh      → MEDIUM    → 5d
  ↳ LAND_SURVEY                                  → LOW

Education             → EDUCATION   → Sunita      → MEDIUM    → 5d

Health / Medical      → HEALTH      → Sunita      → MEDIUM    → 2d ⚡
  ↳ HEALTH_DOCTOR / AMBULANCE / MEDICINE         → HIGH

Pension / Welfare     → SOCIAL_WEL  → Anita       → MEDIUM    → 5d

Ration Card / PDS     → FOOD_SUPPLY → Anita       → MEDIUM    → 5d

Certificate           → TAHSILDAR   → Ganesh      → MEDIUM    → 7d

Housing / Awas Yojana → COLLECTOR   → Anita       → MEDIUM    → 7d

Agriculture           → AGRICULTURE → Ganesh      → MEDIUM    → 7d

Employment / Rojgar   → SOCIAL_WEL  → Anita       → MEDIUM    → 7d

Police / Law & Order  → POLICE      → Vikram      → HIGH ⚠️   → 5d

General / Other       → (none)      → Vikram      → MEDIUM    → 7d
                         ⚠️ PA must assign dept manually
```
