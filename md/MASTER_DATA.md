# MLA E-Office — Master Data & Seed Configuration

> **Complete Seed Data for Database Initialization — Categories, Departments, Enums, Templates, and Default Accounts**
> 
> This document defines all the pre-populated data required for a fresh MLA E-Office installation. It is the single source of truth for database seeders, dropdown values, and system configuration.
> 
> *Related Documents:* [DATA_MODELS.md](file:///s:/MLA%20E%20-%20Office/DATA_MODELS.md) | [GLOSSARY.md](file:///s:/MLA%20E%20-%20Office/GLOSSARY.md) | [ER_DIAGRAM.md](file:///s:/MLA%20E%20-%20Office/ER_DIAGRAM.md)

---

## 1. Nivedan Categories & Sub-Categories

### Main Categories (14)

Each category has a **code** (used in code), **default department** (for auto-routing), **escalation deadline** (days before Level 1 alert), and **default priority** (PA can override).

> **Auto-Routing Rule:** When a nivedan is created, the system auto-suggests the default department based on the category. PA can override this before saving.

| # | Code | English | Marathi | Default Department | Escalation Days | Default Priority | Sort |
|:-:|------|---------|---------|-------------------|:---:|:---:|:---:|
| 1 | `WATER_SUPPLY` | Water Supply | पाणीपुरवठा | Water Supply Dept (`WATER_DEPT`) | 5 | MEDIUM | 1 |
| 2 | `ROAD_DRAINAGE` | Road / Drainage | रस्ते / गटार | PWD (`PWD`) | 10 | MEDIUM | 2 |
| 3 | `ELECTRICITY` | Electricity | वीजपुरवठा | MSEDCL (`MSEDCL`) | 3 | MEDIUM | 3 |
| 4 | `LAND_REVENUE` | Land / Revenue | जमीन / महसूल | Revenue Dept (`REVENUE`) | 5 | MEDIUM | 4 |
| 5 | `EDUCATION` | Education | शिक्षण | Education Dept (`EDUCATION_DEPT`) | 5 | MEDIUM | 5 |
| 6 | `HEALTH_MEDICAL` | Health / Medical | आरोग्य | Health Dept (`HEALTH_DEPT`) | 2 | MEDIUM | 6 |
| 7 | `PENSION_WELFARE` | Pension / Social Welfare | पेन्शन / समाजकल्याण | Social Welfare (`SOCIAL_WELFARE`) | 5 | MEDIUM | 7 |
| 8 | `RATION_CARD` | Ration Card / PDS | रेशनकार्ड | Food & Civil Supplies (`FOOD_SUPPLY`) | 5 | MEDIUM | 8 |
| 9 | `CERTIFICATE` | Caste / Income Certificate | जात / उत्पन्न प्रमाणपत्र | Tahsildar (`TAHSILDAR`) | 7 | MEDIUM | 9 |
| 10 | `HOUSING` | Housing / Awas Yojana | घरकुल / आवास योजना | Collector Office (`COLLECTOR`) | 7 | MEDIUM | 10 |
| 11 | `AGRICULTURE` | Agriculture | शेती | Agriculture Dept (`AGRICULTURE_DEPT`) | 7 | MEDIUM | 11 |
| 12 | `EMPLOYMENT` | Employment / Rojgar | रोजगार | Social Welfare (`SOCIAL_WELFARE`) | 7 | MEDIUM | 12 |
| 13 | `POLICE` | Police / Law & Order | पोलीस | Police Dept (`POLICE_DEPT`) | 5 | MEDIUM | 13 |
| 14 | `GENERAL_OTHER` | General / Other | इतर | — (PA assigns manually) | 7 | MEDIUM | 14 |

### Escalation Summary

```
                    ┌───────────────────────────────────────────────────┐
                    │            ESCALATION DEADLINES                   │
                    ├──────────────────┬──────────────┬─────────────────┤
                    │   URGENT (2-3d)  │ STANDARD (5d)│  EXTENDED (7-10)│
                    ├──────────────────┼──────────────┼─────────────────┤
                    │ Health (2 days)  │ Water (5d)   │ Certificate (7d)│
                    │ Electricity (3d) │ Land (5d)    │ Housing (7d)    │
                    │                  │ Education (5d)│ Agriculture (7d)│
                    │                  │ Pension (5d)  │ Employment (7d) │
                    │                  │ Ration (5d)   │ General (7d)    │
                    │                  │ Police (5d)   │ Road (10d)      │
                    └──────────────────┴──────────────┴─────────────────┘
```

### Sub-Categories (Top 5 Categories Only)

> Sub-categories are stored in the same `categories` table using `parent_id` to create a hierarchy.

#### Water Supply (पाणीपुरवठा) — `parent_id` → `WATER_SUPPLY`

| # | Code | English | Marathi |
|:-:|------|---------|---------|
| 1 | `WATER_NO_SUPPLY` | No water supply | पाणी येत नाही |
| 2 | `WATER_LOW_PRESSURE` | Low water pressure | पाण्याचा दाब कमी |
| 3 | `WATER_CONTAMINATED` | Contaminated / dirty water | दूषित / गढूळ पाणी |
| 4 | `WATER_PIPELINE_LEAK` | Pipeline leak / burst | पाइपलाइन गळती / फुटणे |
| 5 | `WATER_NEW_CONNECTION` | New connection request | नवीन जोडणी मागणी |
| 6 | `WATER_BILL_DISPUTE` | Water bill dispute | पाणी बिल वाद |
| 7 | `WATER_BOREWELL` | Borewell / handpump issue | बोअरवेल / हातपंप |
| 8 | `WATER_OTHER` | Other water issue | इतर पाणी समस्या |

#### Road / Drainage (रस्ते / गटार) — `parent_id` → `ROAD_DRAINAGE`

| # | Code | English | Marathi |
|:-:|------|---------|---------|
| 1 | `ROAD_POTHOLE` | Potholes / damaged road | खड्डे / खराब रस्ता |
| 2 | `ROAD_NEW_CONSTRUCTION` | New road construction request | नवीन रस्ता बांधकाम |
| 3 | `ROAD_WIDENING` | Road widening request | रस्ता रुंदीकरण |
| 4 | `ROAD_DRAINAGE_BLOCK` | Blocked drainage / nala | गटार / नाला बंद |
| 5 | `ROAD_DRAINAGE_NEW` | New drainage construction | नवीन गटार बांधकाम |
| 6 | `ROAD_FOOTPATH` | Footpath / sidewalk issue | पायवाट / फुटपाथ |
| 7 | `ROAD_SPEED_BREAKER` | Speed breaker request | स्पीडब्रेकर मागणी |
| 8 | `ROAD_OTHER` | Other road/drainage issue | इतर रस्ता/गटार |

#### Electricity (वीजपुरवठा) — `parent_id` → `ELECTRICITY`

| # | Code | English | Marathi |
|:-:|------|---------|---------|
| 1 | `ELEC_NO_SUPPLY` | No electricity supply | वीज पुरवठा बंद |
| 2 | `ELEC_FREQUENT_OUTAGE` | Frequent power cuts | वारंवार वीज खंडित |
| 3 | `ELEC_LOW_VOLTAGE` | Low voltage issue | कमी व्होल्टेज |
| 4 | `ELEC_TRANSFORMER` | Transformer problem | ट्रान्सफॉर्मर समस्या |
| 5 | `ELEC_STREETLIGHT` | Street light not working | रस्त्यावरील दिवे बंद |
| 6 | `ELEC_NEW_CONNECTION` | New connection request | नवीन वीज जोडणी |
| 7 | `ELEC_BILL_DISPUTE` | Electricity bill dispute | वीज बिल वाद |
| 8 | `ELEC_WIRE_DANGER` | Dangerous hanging wire | धोकादायक तार लटकणे |
| 9 | `ELEC_OTHER` | Other electricity issue | इतर वीज समस्या |

#### Health / Medical (आरोग्य) — `parent_id` → `HEALTH_MEDICAL`

| # | Code | English | Marathi |
|:-:|------|---------|---------|
| 1 | `HEALTH_HOSPITAL` | Hospital facility issue | रुग्णालय सुविधा समस्या |
| 2 | `HEALTH_DOCTOR` | Doctor not available | डॉक्टर उपलब्ध नाही |
| 3 | `HEALTH_MEDICINE` | Medicine shortage | औषध तुटवडा |
| 4 | `HEALTH_AMBULANCE` | Ambulance service issue | रुग्णवाहिका सेवा |
| 5 | `HEALTH_PHC` | Primary Health Center issue | प्राथमिक आरोग्य केंद्र |
| 6 | `HEALTH_INSURANCE` | Health insurance claim issue | आरोग्य विमा दावा |
| 7 | `HEALTH_SANITATION` | Sanitation / cleanliness | स्वच्छता / सफाई |
| 8 | `HEALTH_OTHER` | Other health issue | इतर आरोग्य |

#### Land / Revenue (जमीन / महसूल) — `parent_id` → `LAND_REVENUE`

| # | Code | English | Marathi |
|:-:|------|---------|---------|
| 1 | `LAND_7_12` | 7/12 extract issue | ७/१२ उतारा समस्या |
| 2 | `LAND_MUTATION` | Land mutation (ferfar) | जमीन फेरफार |
| 3 | `LAND_ENCROACHMENT` | Encroachment complaint | अतिक्रमण तक्रार |
| 4 | `LAND_DISPUTE` | Land dispute / boundary | जमीन वाद / हद्द |
| 5 | `LAND_NA_CONVERSION` | NA conversion | NA रूपांतर |
| 6 | `LAND_SURVEY` | Land survey request | जमीन मोजणी |
| 7 | `LAND_OTHER` | Other land/revenue issue | इतर जमीन/महसूल |

---

## 2. Government Departments (20)

> Pre-populated in the `departments` table. Used for nivedan auto-routing, inward sender, and outward recipient.

| # | Short Code | English Name | Marathi Name | Default Officer Designation | Sort |
|:-:|-----------|-------------|-------------|----------------------------|:---:|
| 1 | `COLLECTOR` | District Collector Office | जिल्हाधिकारी कार्यालय | जिल्हाधिकारी | 1 |
| 2 | `TAHSILDAR` | Tahsildar Office | तहसीलदार कार्यालय | तहसीलदार | 2 |
| 3 | `ZP` | Zilla Parishad | जिल्हा परिषद | मुख्य कार्यकारी अधिकारी | 3 |
| 4 | `PANCHAYAT_SAMITI` | Panchayat Samiti | पंचायत समिती | गट विकास अधिकारी | 4 |
| 5 | `GRAM_PANCHAYAT` | Gram Panchayat | ग्रामपंचायत | ग्रामसेवक / सरपंच | 5 |
| 6 | `MUNICIPAL_CORP` | Municipal Corporation | महानगरपालिका | आयुक्त | 6 |
| 7 | `MUNICIPAL_COUNCIL` | Municipal Council | नगरपरिषद | मुख्याधिकारी | 7 |
| 8 | `NAGAR_PANCHAYAT` | Nagar Panchayat | नगरपंचायत | मुख्याधिकारी | 8 |
| 9 | `PWD` | Public Works Department | सार्वजनिक बांधकाम विभाग | कार्यकारी अभियंता | 9 |
| 10 | `WATER_DEPT` | Water Supply Department | पाणीपुरवठा विभाग | कार्यकारी अभियंता | 10 |
| 11 | `MSEDCL` | MSEDCL / Electricity Board | महावितरण | अधीक्षक अभियंता | 11 |
| 12 | `REVENUE` | Revenue Department | महसूल विभाग | जिल्हाधिकारी / तहसीलदार | 12 |
| 13 | `EDUCATION_DEPT` | Education Department | शिक्षण विभाग | शिक्षणाधिकारी | 13 |
| 14 | `HEALTH_DEPT` | Health Department | आरोग्य विभाग | जिल्हा आरोग्य अधिकारी | 14 |
| 15 | `SOCIAL_WELFARE` | Social Welfare Department | समाजकल्याण विभाग | समाजकल्याण अधिकारी | 15 |
| 16 | `AGRICULTURE_DEPT` | Agriculture Department | कृषी विभाग | जिल्हा कृषी अधिकारी | 16 |
| 17 | `POLICE_DEPT` | Police Department | पोलीस विभाग | पोलीस अधीक्षक | 17 |
| 18 | `TRIBAL_DEPT` | Tribal Development Department | आदिवासी विकास विभाग | प्रकल्प अधिकारी | 18 |
| 19 | `WOMEN_CHILD` | Women and Child Development | महिला व बालविकास | जिल्हा महिला व बालविकास अधिकारी | 19 |
| 20 | `FOOD_SUPPLY` | Food and Civil Supplies | अन्न व नागरी पुरवठा | जिल्हा पुरवठा अधिकारी | 20 |

---

## 3. Category → Department Auto-Routing Map

> This is the mapping used by the `autoRoute.service.js` to auto-suggest a department when a nivedan is created. PA can always override.

```
┌─────────────────────────┐         ┌─────────────────────────────┐
│    NIVEDAN CATEGORY      │────────▶│    DEFAULT DEPARTMENT        │
├─────────────────────────┤         ├─────────────────────────────┤
│ Water Supply             │────────▶│ Water Supply Dept            │
│ Road / Drainage          │────────▶│ PWD                          │
│ Electricity              │────────▶│ MSEDCL                       │
│ Land / Revenue           │────────▶│ Revenue Department           │
│ Education                │────────▶│ Education Department         │
│ Health / Medical         │────────▶│ Health Department            │
│ Pension / Social Welfare │────────▶│ Social Welfare Department    │
│ Ration Card / PDS        │────────▶│ Food & Civil Supplies        │
│ Caste/Income Certificate │────────▶│ Tahsildar Office             │
│ Housing / Awas Yojana    │────────▶│ Collector Office             │
│ Agriculture              │────────▶│ Agriculture Department       │
│ Employment / Rojgar      │────────▶│ Social Welfare Department    │
│ Police / Law & Order     │────────▶│ Police Department            │
│ General / Other          │────────▶│ (no default — PA assigns)    │
└─────────────────────────┘         └─────────────────────────────┘
```

---

## 4. Enum Constants Reference

### 4A. User Roles

```javascript
const USER_ROLES = {
  MLA: 'MLA',
  PA: 'PA',
  RECEPTIONIST: 'RECEPTIONIST',
  AUDITOR: 'AUDITOR',
  BOOTH_PRAMUKH: 'BOOTH_PRAMUKH',
  CITIZEN: 'CITIZEN',
  ADMIN: 'ADMIN'
};
```

### 4B. Nivedan Statuses

```javascript
const NIVEDAN_STATUS = {
  PENDING: 'PENDING',               // 🟡 Yellow — newly registered
  IN_PROGRESS: 'IN_PROGRESS',       // 🔵 Blue — staff working
  FORWARDED: 'FORWARDED',           // 🟠 Orange — sent to govt dept
  AWAITING_RESPONSE: 'AWAITING_RESPONSE', // 🟣 Purple — waiting for dept reply
  RESOLVED: 'RESOLVED',             // 🟢 Green — issue fixed
  REJECTED: 'REJECTED',             // 🔴 Red — invalid/duplicate
  CANCELLED: 'CANCELLED',           // ⚪ Gray — citizen withdrew
  ARCHIVED: 'ARCHIVED'              // ⚫ Dark Gray — old resolved
};
```

### 4C. Inward Statuses

```javascript
const INWARD_STATUS = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};
```

### 4D. Priority Levels

```javascript
const PRIORITY = {
  HIGH: 'HIGH',       // 🔴 Red
  MEDIUM: 'MEDIUM',   // 🟡 Yellow
  LOW: 'LOW'          // 🟢 Green
};
```

### 4E. Escalation Levels

```javascript
const ESCALATION_LEVEL = {
  NONE: 'NONE',           // No escalation
  LEVEL_1: 'LEVEL_1',     // Alert to PA (category deadline exceeded)
  LEVEL_2: 'LEVEL_2'      // Alert to MLA (Level 1 ignored for 3+ more days)
};
```

### 4F. Visitor Purpose

```javascript
const VISITOR_PURPOSE = {
  GRIEVANCE: 'GRIEVANCE',
  COURTESY_CALL: 'COURTESY_CALL',
  PARTY_WORK: 'PARTY_WORK',
  INVITATION: 'INVITATION',
  PERSONAL_MEETING: 'PERSONAL_MEETING',
  DOCUMENT_SUBMISSION: 'DOCUMENT_SUBMISSION',
  FOLLOWUP: 'FOLLOWUP',
  RECOMMENDATION: 'RECOMMENDATION',
  GENERAL_INQUIRY: 'GENERAL_INQUIRY',
  OTHER: 'OTHER'
};
```

### 4G. Development Work Category

```javascript
const DEVWORK_CATEGORY = {
  ROAD: 'ROAD',
  DRAINAGE: 'DRAINAGE',
  WATER_PIPELINE: 'WATER_PIPELINE',
  HOSPITAL: 'HOSPITAL',
  SCHOOL: 'SCHOOL',
  COMMUNITY_HALL: 'COMMUNITY_HALL',
  STREET_LIGHT: 'STREET_LIGHT',
  BRIDGE: 'BRIDGE',
  ELECTRIFICATION: 'ELECTRIFICATION',
  GARDEN_PARK: 'GARDEN_PARK',
  TOILET: 'TOILET',
  CREMATORIUM: 'CREMATORIUM',
  OTHER: 'OTHER'
};
```

### 4H. Development Work Status

```javascript
const DEVWORK_STATUS = {
  SANCTIONED: 'SANCTIONED',   // 🔵 Blue
  IN_PROGRESS: 'IN_PROGRESS', // 🟡 Yellow
  COMPLETED: 'COMPLETED',     // 🟢 Green
  DELAYED: 'DELAYED',         // 🔴 Red
  CANCELLED: 'CANCELLED'      // ⚪ Gray
};
```

### 4I. Funding Sources

```javascript
const FUNDING_SOURCE = {
  MLALAD: 'MLALAD',
  ZP_FUND: 'ZP_FUND',
  STATE_GRANT: 'STATE_GRANT',
  CENTRAL_GRANT: 'CENTRAL_GRANT',
  MUNICIPAL_FUND: 'MUNICIPAL_FUND',
  GP_FUND: 'GP_FUND',
  MPLAD: 'MPLAD',
  CSR: 'CSR',
  OTHER_MIXED: 'OTHER_MIXED'
};
```

### 4J. Karyakarta Designations

```javascript
const KARYAKARTA_DESIGNATION = {
  BOOTH_PRAMUKH: 'BOOTH_PRAMUKH',
  WARD_HEAD: 'WARD_HEAD',
  SHAKTI_KENDRA: 'SHAKTI_KENDRA',
  KARYAKARTA: 'KARYAKARTA',
  VOLUNTEER: 'VOLUNTEER',
  OTHER: 'OTHER'
};
```

### 4K. Calendar Event Types

```javascript
const EVENT_TYPE = {
  MEETING: 'MEETING',                     // 🔵 Blue
  PUBLIC_PROGRAM: 'PUBLIC_PROGRAM',         // 🟢 Green
  GOVT_DEADLINE: 'GOVT_DEADLINE',           // 🔴 Red
  ASSEMBLY_SESSION: 'ASSEMBLY_SESSION',     // 🟣 Purple
  CONSTITUENCY_VISIT: 'CONSTITUENCY_VISIT', // 🟠 Orange
  PERSONAL: 'PERSONAL'                     // ⚪ Gray
};
```

### 4L. Booth Verification Status

```javascript
const BOOTH_VERIFICATION = {
  NOT_VERIFIED: 'NOT_VERIFIED',
  PARTIALLY_VERIFIED: 'PARTIALLY_VERIFIED',
  FULLY_VERIFIED: 'FULLY_VERIFIED'
};
```

### 4M. WhatsApp Message Types

```javascript
const WHATSAPP_MESSAGE_TYPE = {
  NIVEDAN_ACK: 'NIVEDAN_ACK',
  NIVEDAN_UPDATE: 'NIVEDAN_UPDATE',
  NIVEDAN_RESOLVED: 'NIVEDAN_RESOLVED',
  BIRTHDAY: 'BIRTHDAY',
  FESTIVAL: 'FESTIVAL',
  EVENT_INVITE: 'EVENT_INVITE',
  BROADCAST: 'BROADCAST',
  BOT_REPLY: 'BOT_REPLY',
  INBOUND_QUERY: 'INBOUND_QUERY'
};
```

### 4N. WhatsApp Delivery Status

```javascript
const DELIVERY_STATUS = {
  QUEUED: 'QUEUED',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
  FAILED: 'FAILED'
};
```

### 4O. Nivedan Timeline Action Types

```javascript
const TIMELINE_ACTION = {
  CREATED: 'CREATED',
  STATUS_CHANGE: 'STATUS_CHANGE',
  ASSIGNED: 'ASSIGNED',
  FORWARDED: 'FORWARDED',
  NOTE_ADDED: 'NOTE_ADDED',
  WHATSAPP_SENT: 'WHATSAPP_SENT',
  ESCALATED: 'ESCALATED',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  ARCHIVED: 'ARCHIVED'
};
```

### 4P. Audit Log Actions

```javascript
const AUDIT_ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  ARCHIVE: 'ARCHIVE',
  CANCEL: 'CANCEL',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LOGIN_FAILED: 'LOGIN_FAILED',
  EXPORT: 'EXPORT',
  DELEGATE: 'DELEGATE'
};
```

### 4Q. Notification Types

```javascript
const NOTIFICATION_TYPE = {
  NIVEDAN: 'NIVEDAN',
  INWARD: 'INWARD',
  DEVWORK: 'DEVWORK',
  CALENDAR: 'CALENDAR',
  WHATSAPP: 'WHATSAPP',
  ESCALATION: 'ESCALATION',
  SYSTEM: 'SYSTEM'
};
```

### 4R. Notification Severity

```javascript
const NOTIFICATION_SEVERITY = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL'
};
```

### 4S. Dev Work Photo Stages

```javascript
const PHOTO_STAGE = {
  BEFORE: 'BEFORE',
  DURING: 'DURING',
  AFTER: 'AFTER'
};
```

---

## 5. Default Seed Users (5)

> These users are created during initial database setup. Passwords are temporary and must be changed on first login.

| # | Full Name | Username | Role | Mobile | Default Password | Notes |
|:-:|-----------|----------|------|--------|-----------------|-------|
| 1 | MLA Name | `mla` | `MLA` | (configured per instance) | `Mla@12345` | Name set during installation |
| 2 | PA Name | `pa` | `PA` | (configured per instance) | `Pa@12345` | Primary operational user |
| 3 | Receptionist | `receptionist` | `RECEPTIONIST` | (configured per instance) | `Rec@12345` | Front desk user |
| 4 | Field Auditor | `auditor` | `AUDITOR` | (configured per instance) | `Aud@12345` | Ground verification user |
| 5 | System Admin | `admin` | `ADMIN` | (configured per instance) | `Admin@12345` | Technical administrator |

**First Login Flow:**
1. User logs in with default password
2. System forces password change
3. User sets new password (min 8 chars, 1 uppercase, 1 number)
4. Admin updates profile details (full name, mobile, email)

---

## 6. WhatsApp Message Templates

> These templates must be submitted to **Meta Business Manager** for approval before they can be sent. The template names follow Meta's naming convention (lowercase, underscores).

### Template 1: Nivedan Acknowledgment (`nivedan_ack`)

| Property | Value |
|----------|-------|
| **Template Name** | `nivedan_ack` |
| **Language** | Marathi (`mr`) |
| **Category** | Utility |
| **Trigger** | New nivedan created |
| **Parameters** | `{{1}}` = citizen_name, `{{2}}` = tracking_id, `{{3}}` = subject |

**Message:**
```
नमस्कार {{1}},

आपली तक्रार यशस्वीरित्या नोंदवली गेली आहे.

📋 ट्रॅकिंग आयडी: {{2}}
📝 विषय: {{3}}

आपल्या तक्रारीवर लवकरात लवकर कार्यवाही केली जाईल. ट्रॅकिंग आयडी वापरून स्थिती तपासा.

— मा. आमदार कार्यालय
```

---

### Template 2: Nivedan Status Update (`nivedan_status_update`)

| Property | Value |
|----------|-------|
| **Template Name** | `nivedan_status_update` |
| **Language** | Marathi (`mr`) |
| **Category** | Utility |
| **Trigger** | Nivedan status changes (In Progress, Forwarded, Awaiting Response) |
| **Parameters** | `{{1}}` = citizen_name, `{{2}}` = tracking_id, `{{3}}` = new_status_marathi, `{{4}}` = department_name (if forwarded) |

**Message:**
```
नमस्कार {{1}},

आपल्या तक्रार क्र. {{2}} वर अद्ययावत माहिती:

📌 सध्याची स्थिती: {{3}}
🏛️ विभाग: {{4}}

कार्यवाही सुरू आहे. ट्रॅकिंग आयडी वापरून अद्ययावत स्थिती तपासा.

— मा. आमदार कार्यालय
```

---

### Template 3: Nivedan Resolved (`nivedan_resolved`)

| Property | Value |
|----------|-------|
| **Template Name** | `nivedan_resolved` |
| **Language** | Marathi (`mr`) |
| **Category** | Utility |
| **Trigger** | Nivedan status → Resolved |
| **Parameters** | `{{1}}` = citizen_name, `{{2}}` = tracking_id, `{{3}}` = subject |

**Message:**
```
नमस्कार {{1}},

आपली तक्रार क्र. {{2}} यशस्वीरित्या निकाली काढण्यात आली आहे. ✅

📝 विषय: {{3}}

आपल्या समस्येचे निराकरण झाले. काही अडचण असल्यास कार्यालयाशी संपर्क साधा.

🙏 धन्यवाद!
— मा. आमदार कार्यालय
```

---

### Template 4: Birthday Greeting (`birthday_greeting`)

| Property | Value |
|----------|-------|
| **Template Name** | `birthday_greeting` |
| **Language** | Marathi (`mr`) |
| **Category** | Marketing |
| **Trigger** | DOB matches today (cron at 8 AM) |
| **Parameters** | `{{1}}` = name, `{{2}}` = mla_name |

**Message:**
```
🎂 वाढदिवसाच्या हार्दिक शुभेच्छा, {{1}}! 🎉

आपल्या आयुष्यात सुख, समृद्धी आणि उत्तम आरोग्य लाभो ही सदिच्छा.

— मा. {{2}} व कार्यालयीन परिवार
```

---

### Template 5: Festival Greeting (`festival_greeting`)

| Property | Value |
|----------|-------|
| **Template Name** | `festival_greeting` |
| **Language** | Marathi (`mr`) |
| **Category** | Marketing |
| **Trigger** | Festival date from calendar / PA sends broadcast |
| **Parameters** | `{{1}}` = festival_name, `{{2}}` = mla_name |

**Message:**
```
🙏 {{1}} च्या हार्दिक शुभेच्छा!

आपणास आणि आपल्या कुटुंबियांना {{1}} च्या खूप खूप शुभेच्छा. सुख, समृद्धी आणि आनंद आपल्या पदरी पडो.

— मा. {{2}} व कार्यालयीन परिवार
```

---

### Template 6: Event Invitation (`event_invite`)

| Property | Value |
|----------|-------|
| **Template Name** | `event_invite` |
| **Language** | Marathi (`mr`) |
| **Category** | Marketing |
| **Trigger** | PA sends event broadcast |
| **Parameters** | `{{1}}` = name, `{{2}}` = event_title, `{{3}}` = event_date, `{{4}}` = event_time, `{{5}}` = venue, `{{6}}` = mla_name |

**Message:**
```
नमस्कार {{1}},

आपणास खालील कार्यक्रमास उपस्थित राहण्याचे निमंत्रण:

📌 कार्यक्रम: {{2}}
📅 दिनांक: {{3}}
🕐 वेळ: {{4}}
📍 ठिकाण: {{5}}

आपली उपस्थिती अपेक्षित आहे.

— मा. {{6}} यांच्या कार्यालयातर्फे
```

---

### Template 7: Broadcast Announcement (`broadcast_custom`)

| Property | Value |
|----------|-------|
| **Template Name** | `broadcast_custom` |
| **Language** | Marathi (`mr`) |
| **Category** | Marketing |
| **Trigger** | PA composes custom broadcast |
| **Parameters** | `{{1}}` = name, `{{2}}` = message_body, `{{3}}` = mla_name |

**Message:**
```
नमस्कार {{1}},

{{2}}

— मा. {{3}} यांच्या कार्यालयातर्फे
```

---

### Template 8: Bot Reply — Complaint Status (`bot_status_reply`)

| Property | Value |
|----------|-------|
| **Template Name** | `bot_status_reply` |
| **Language** | Marathi (`mr`) |
| **Category** | Utility |
| **Trigger** | Citizen sends valid Tracking ID via WhatsApp |
| **Parameters** | `{{1}}` = tracking_id, `{{2}}` = status_marathi, `{{3}}` = department_name, `{{4}}` = last_action_date |

**Message:**
```
📋 तक्रार स्थिती:

🔖 ट्रॅकिंग आयडी: {{1}}
📌 सध्याची स्थिती: {{2}}
🏛️ विभाग: {{3}}
📅 शेवटची कार्यवाही: {{4}}

अधिक माहितीसाठी कार्यालयाशी संपर्क साधा.
```

---

### Bot — Help / Error Messages

| Scenario | Bot Response (Marathi) |
|----------|----------------------|
| Invalid text / random message | `कृपया आपला ट्रॅकिंग आयडी पाठवा. उदा: NIV-2026-00001` |
| `HELP` or `मदत` sent | `आपल्या तक्रारीची स्थिती तपासण्यासाठी ट्रॅकिंग आयडी पाठवा. उदा: NIV-2026-00001. ट्रॅकिंग आयडी आपल्या पावतीवर छापलेला आहे.` |
| Valid ID but not found | `ट्रॅकिंग आयडी {{1}} सापडला नाही. कृपया आयडी तपासून पुन्हा पाठवा.` |

---

## 7. Booth Verification Checklist (Default)

> These items are pre-configured for Field Auditors. Admin/PA can add or modify items.

| # | Checklist Item (English) | Checklist Item (Marathi) | Type |
|:-:|--------------------------|--------------------------|------|
| 1 | Booth committee formed? | बूथ समिती स्थापन केली? | Yes / No |
| 2 | Booth Pramukh assigned? | बूथ प्रमुख नेमला? | Yes / No |
| 3 | All workers identified? | सर्व कार्यकर्ते ओळखले? | Yes / No |
| 4 | Voter list available? | मतदार यादी उपलब्ध? | Yes / No |
| 5 | Local issues documented? | स्थानिक समस्या नोंदवल्या? | Yes / No |
| 6 | Public works completed in area? | परिसरातील विकासकामे पूर्ण? | Yes / No / Partial |
| 7 | Citizen complaints addressed? | नागरिक तक्रारी निकाली? | Yes / No / Partial |
| 8 | Communication channel active? | संपर्क व्यवस्था सक्रिय? | Yes / No |
| 9 | Photo evidence collected? | फोटो पुरावे गोळा केले? | Yes / No |
| 10 | Overall booth readiness? | एकूण बूथ तयारी? | Ready / Partial / Not Ready |

---

## 8. MLA Instance Configuration

> These values are customized per MLA installation. Stored in `.env` and/or a `settings` table.

| Config Key | Description | Example Value |
|-----------|-------------|---------------|
| `MLA_NAME` | Full name of the MLA | मा. उदाहरण नाव |
| `MLA_NAME_EN` | English name | Hon. Example Name |
| `MLA_CONSTITUENCY` | Constituency name (Marathi) | उदाहरण मतदारसंघ |
| `MLA_CONSTITUENCY_EN` | Constituency name (English) | Example Constituency |
| `MLA_PARTY` | Political party name | उदाहरण पक्ष |
| `MLA_PHOTO_URL` | MLA's profile photo URL | https://cloudinary.com/... |
| `MLA_OFFICE_ADDRESS` | Office address | ... |
| `MLA_OFFICE_PHONE` | Office contact number | 020-XXXXXXXX |
| `MLA_OFFICE_EMAIL` | Office email | office@example.com |
| `OFFICE_HOURS_START` | Start of working hours | 10:00 |
| `OFFICE_HOURS_END` | End of working hours | 18:00 |
| `TIMEZONE` | Server timezone | Asia/Kolkata |
| `DEFAULT_LANGUAGE` | Default UI language | mr (Marathi) |
| `LETTERHEAD_LOGO_URL` | Office letterhead logo for reports/letters | https://cloudinary.com/... |
| `RECEIPT_FOOTER_TEXT` | Text on nivedan receipt footer | कार्यालय: ... , संपर्क: ... |

---

## 9. Report Configuration

| Report Name | Report Code | Available Filters | Default Sort |
|------------|-------------|-------------------|-------------|
| Nivedan Summary | `RPT_NIVEDAN_SUMMARY` | Date, Category, Status, Village/Ward, Assigned To | Date DESC |
| Nivedan Department-wise | `RPT_NIVEDAN_DEPT` | Date, Department, Status | Department ASC |
| Inward/Outward Register | `RPT_INWARD_OUTWARD` | Date, Department, AI/Manual | Date DESC |
| Visitor Footfall | `RPT_VISITOR_FOOTFALL` | Date (daily/weekly/monthly), Purpose | Date DESC |
| Dev Works Progress | `RPT_DEVWORK_PROGRESS` | Category, Status, Village/Ward, Funding | Status ASC |
| Budget vs Expenditure | `RPT_BUDGET_EXPENSE` | Category, Funding, Village/Ward | Budget DESC |
| Karyakarta Directory | `RPT_KARYAKARTA_DIR` | Booth, Village/Ward, Designation, Active | Name ASC |
| Booth Verification | `RPT_BOOTH_VERIFY` | Village/Ward, Verification Status | Booth No. ASC |
| Area-wise Analysis | `RPT_AREA_ANALYSIS` | Village/Ward (combined data) | Village ASC |
| Monthly Office Performance | `RPT_MONTHLY_PERF` | Month selector | — |
| Escalation Report | `RPT_ESCALATION` | Date, Category | Escalation Level DESC |

---

## 10. Color Palette — Status & UI Colors

> Used consistently across the frontend for status badges, chart colors, and calendar events.

### Status Colors (CSS Custom Properties)

```css
:root {
  /* Nivedan Status */
  --status-pending: #F59E0B;          /* Yellow */
  --status-in-progress: #3B82F6;      /* Blue */
  --status-forwarded: #F97316;        /* Orange */
  --status-awaiting: #8B5CF6;         /* Purple */
  --status-resolved: #10B981;         /* Green */
  --status-rejected: #EF4444;         /* Red */
  --status-cancelled: #9CA3AF;        /* Gray */
  --status-archived: #4B5563;         /* Dark Gray */

  /* Dev Work Status */
  --devwork-sanctioned: #3B82F6;      /* Blue */
  --devwork-in-progress: #F59E0B;     /* Yellow */
  --devwork-completed: #10B981;       /* Green */
  --devwork-delayed: #EF4444;         /* Red */

  /* Priority */
  --priority-high: #EF4444;           /* Red */
  --priority-medium: #F59E0B;         /* Yellow */
  --priority-low: #10B981;            /* Green */

  /* Calendar Event Types */
  --event-meeting: #3B82F6;           /* Blue */
  --event-public-program: #10B981;    /* Green */
  --event-govt-deadline: #EF4444;     /* Red */
  --event-assembly: #8B5CF6;          /* Purple */
  --event-constituency: #F97316;      /* Orange */
  --event-personal: #9CA3AF;          /* Gray */

  /* Notification Severity */
  --notif-info: #3B82F6;             /* Blue */
  --notif-warning: #F59E0B;           /* Yellow */
  --notif-critical: #EF4444;          /* Red */

  /* WhatsApp Delivery */
  --wa-queued: #9CA3AF;               /* Gray */
  --wa-sent: #3B82F6;                 /* Blue */
  --wa-delivered: #10B981;            /* Green */
  --wa-read: #06B6D4;                 /* Cyan */
  --wa-failed: #EF4444;              /* Red */
}
```

---

## 11. Data Import Templates

> Excel templates for bulk importing master data. These `.xlsx` files should have the following column headers:

### Villages Import (`villages_import.xlsx`)

| Column | Type | Required | Notes |
|--------|------|:---:|-------|
| `village_name_en` | Text | ✅ | English name |
| `village_name_mr` | Text | ✅ | Marathi name |
| `gram_panchayat_name` | Text | ✅ | Must match existing GP name |
| `taluka_name` | Text | ✅ | Must match existing taluka |

### Wards Import (`wards_import.xlsx`)

| Column | Type | Required | Notes |
|--------|------|:---:|-------|
| `ward_number` | Number | ✅ | Unique ward number |
| `ward_name_en` | Text | ✅ | English name |
| `ward_name_mr` | Text | ✅ | Marathi name |
| `city_name` | Text | ✅ | City the ward belongs to |

### Booths Import (`booths_import.xlsx`)

| Column | Type | Required | Notes |
|--------|------|:---:|-------|
| `booth_number` | Number | ✅ | Unique booth number |
| `booth_name` | Text | ❌ | Booth name/location |
| `location_address` | Text | ❌ | Physical address |
| `village_name` OR `ward_number` | Text/Number | ✅ | Parent geography (one of the two) |
| `total_voters` | Number | ❌ | Registered voter count |

### Karyakartas Import (`karyakartas_import.xlsx`)

| Column | Type | Required | Notes |
|--------|------|:---:|-------|
| `full_name` | Text | ✅ | Worker's full name |
| `mobile` | Number | ✅ | 10-digit mobile (unique) |
| `alt_mobile` | Number | ❌ | Secondary mobile |
| `date_of_birth` | Date | ❌ | DD/MM/YYYY format |
| `address` | Text | ❌ | Residential address |
| `village_name` OR `ward_number` | Text/Number | ✅ | Worker's location |
| `booth_number` | Number | ✅ | Assigned booth |
| `designation` | Text | ✅ | Must match: BOOTH_PRAMUKH, WARD_HEAD, SHAKTI_KENDRA, KARYAKARTA, VOLUNTEER, OTHER |

---
