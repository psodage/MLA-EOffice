# MLA E-Office — Government Department Directory

> **Complete Contact Directory of All Government Departments**
>
> This is the master reference for every government department the MLA office corresponds with. It powers the "Forward to Department" dropdown in the Nivedan module, the recipient auto-fill in Outward letters, and the auto-routing engine.
>
> ⚠️ **Action required:** PA must fill in `[OFFICER_NAME]`, `[ADDRESS]`, `[PHONE]`, and `[EMAIL]` placeholders for each department before the system goes live.
>
> *Related Documents:* [AUTO_ROUTING_RULES.md](file:///s:/MLA%20E%20-%20Office/AUTO_ROUTING_RULES.md) | [TRANSLATIONS.md](file:///s:/MLA%20E%20-%20Office/TRANSLATIONS.md) | [AI_LETTER_DRAFTING.md](file:///s:/MLA%20E%20-%20Office/AI_LETTER_DRAFTING.md) | [DATA_MODELS.md](file:///s:/MLA%20E%20-%20Office/DATA_MODELS.md)

---

## 1. Directory Fields Reference

Each department entry contains the following fields:

| Field | Description |
|-------|-------------|
| **System Code** | Internal key used in DB and auto-routing (`COLLECTOR`, `PWD`, etc.) |
| **Name EN / MR** | Bilingual department name matching `TRANSLATIONS.md` `departments.*` keys |
| **Head Designation** | Official title of the department head |
| **Head Officer Name** | Current officer's name — PA fills this in; must update when officer changes |
| **Office Address** | Complete mailing address |
| **Phone** | Primary office phone number(s) |
| **Email** | Official government email |
| **Nivedan Categories Routed Here** | Which complaint types auto-route to this dept (from `AUTO_ROUTING_RULES.md`) |
| **Letter Submission Channel** | Preferred method for sending outward letters |

---

## 2. Department Directory

---

### DEPT-01 — District Collector Office

| Field | Value |
|-------|-------|
| **System Code** | `COLLECTOR` |
| **Name (English)** | District Collector Office |
| **Name (Marathi)** | जिल्हाधिकारी कार्यालय |
| **Head Designation** | District Collector (जिल्हाधिकारी) |
| **Head Officer Name** | `[DISTRICT_COLLECTOR_NAME]` |
| **Office Address** | `[COLLECTOR_OFFICE_ADDRESS]`, `[DISTRICT]` – `[PIN]` |
| **Phone** | `[PHONE_1]` / `[PHONE_2]` |
| **Email** | `[collector.district@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Housing / Awas Yojana (`HOUSING`) |
| **Letter Submission Channel** | In-person dak (government courier) + Email |

---

### DEPT-02 — Tahsildar Office

| Field | Value |
|-------|-------|
| **System Code** | `TAHSILDAR` |
| **Name (English)** | Tahsildar Office |
| **Name (Marathi)** | तहसीलदार कार्यालय |
| **Head Designation** | Tahsildar (तहसीलदार) |
| **Head Officer Name** | `[TAHSILDAR_NAME]` |
| **Office Address** | `[TAHSILDAR_OFFICE_ADDRESS]`, `[TALUKA]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[tahsil.taluka@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Caste/Income Certificate (`CERTIFICATE`), Land/Revenue (`LAND_REVENUE`) |
| **Letter Submission Channel** | In-person dak + Email |

---

### DEPT-03 — Zilla Parishad (ZP)

| Field | Value |
|-------|-------|
| **System Code** | `ZP` |
| **Name (English)** | Zilla Parishad |
| **Name (Marathi)** | जिल्हा परिषद |
| **Head Designation** | Chief Executive Officer / CEO (मुख्य कार्यकारी अधिकारी) |
| **Head Officer Name** | `[ZP_CEO_NAME]` |
| **Office Address** | `[ZP_OFFICE_ADDRESS]`, `[DISTRICT]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[ceo.zp.district@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Road/Drainage (`ROAD_DRAINAGE`), Education (`EDUCATION`), Water Supply (`WATER_SUPPLY`) |
| **Letter Submission Channel** | In-person dak + Email |

---

### DEPT-04 — Panchayat Samiti

| Field | Value |
|-------|-------|
| **System Code** | `PANCHAYAT_SAMITI` |
| **Name (English)** | Panchayat Samiti |
| **Name (Marathi)** | पंचायत समिती |
| **Head Designation** | Block Development Officer / BDO (गटविकास अधिकारी) |
| **Head Officer Name** | `[BDO_NAME]` |
| **Office Address** | `[PANCHAYAT_SAMITI_ADDRESS]`, `[TALUKA]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[bdo.taluka@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Employment/Rojgar (`EMPLOYMENT`), Rural Development schemes |
| **Letter Submission Channel** | In-person dak |

---

### DEPT-05 — Gram Panchayat (GP)

| Field | Value |
|-------|-------|
| **System Code** | `GRAM_PANCHAYAT` |
| **Name (English)** | Gram Panchayat |
| **Name (Marathi)** | ग्रामपंचायत |
| **Head Designation** | Gram Sevak (ग्रामसेवक) / Sarpanch (सरपंच) |
| **Head Officer Name** | `[GRAM_SEVAK_NAME]` *(varies by village — use specific GP name)* |
| **Office Address** | `[GP_NAME] Gram Panchayat Office`, `[VILLAGE]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | *(Usually none — use in-person)* |
| **Nivedan Categories Routed Here** | Water Supply (`WATER_SUPPLY`) — village level, Sanitation |
| **Letter Submission Channel** | In-person only |

---

### DEPT-06 — Municipal Corporation

| Field | Value |
|-------|-------|
| **System Code** | `MUNICIPAL_CORP` |
| **Name (English)** | Municipal Corporation |
| **Name (Marathi)** | महानगरपालिका |
| **Head Designation** | Municipal Commissioner (आयुक्त) |
| **Head Officer Name** | `[MUNICIPAL_COMMISSIONER_NAME]` |
| **Office Address** | `[MUNICIPAL_CORP_ADDRESS]`, `[CITY]` – `[PIN]` |
| **Phone** | `[PHONE_1]` / `[PHONE_2]` |
| **Email** | `[commissioner.municipality@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Road/Drainage (urban, `ROAD_DRAINAGE`), Water Supply (urban, `WATER_SUPPLY`) |
| **Letter Submission Channel** | Email + In-person dak |

---

### DEPT-07 — Municipal Council

| Field | Value |
|-------|-------|
| **System Code** | `MUNICIPAL_COUNCIL` |
| **Name (English)** | Municipal Council |
| **Name (Marathi)** | नगरपरिषद |
| **Head Designation** | Chief Officer (मुख्याधिकारी) |
| **Head Officer Name** | `[CHIEF_OFFICER_NAME]` |
| **Office Address** | `[MUNICIPAL_COUNCIL_ADDRESS]`, `[TOWN]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[chiefoffice.nagar@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Road/Drainage (town-level), Sanitation, Street Lighting |
| **Letter Submission Channel** | In-person dak + Email |

---

### DEPT-08 — Nagar Panchayat

| Field | Value |
|-------|-------|
| **System Code** | `NAGAR_PANCHAYAT` |
| **Name (English)** | Nagar Panchayat |
| **Name (Marathi)** | नगरपंचायत |
| **Head Designation** | Chief Officer (मुख्याधिकारी) |
| **Head Officer Name** | `[NAGAR_PANCHAYAT_CHIEF_OFFICER]` |
| **Office Address** | `[NAGAR_PANCHAYAT_ADDRESS]`, `[TOWN]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | *(Usually none — use in-person)* |
| **Nivedan Categories Routed Here** | Basic civic amenities |
| **Letter Submission Channel** | In-person only |

---

### DEPT-09 — Public Works Department (PWD)

| Field | Value |
|-------|-------|
| **System Code** | `PWD` |
| **Name (English)** | Public Works Department (PWD) |
| **Name (Marathi)** | सार्वजनिक बांधकाम विभाग |
| **Head Designation** | Executive Engineer / EE (कार्यकारी अभियंता) |
| **Head Officer Name** | `[PWD_EE_NAME]` |
| **Office Address** | `[PWD_OFFICE_ADDRESS]`, `[DISTRICT]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[ee.pwddivision@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Road/Drainage (`ROAD_DRAINAGE`) |
| **Letter Submission Channel** | In-person dak + Email |

---

### DEPT-10 — Water Supply Department

| Field | Value |
|-------|-------|
| **System Code** | `WATER_DEPT` |
| **Name (English)** | Water Supply Department |
| **Name (Marathi)** | पाणीपुरवठा विभाग |
| **Head Designation** | Executive Engineer — Water Supply (कार्यकारी अभियंता, पाणीपुरवठा) |
| **Head Officer Name** | `[WATER_DEPT_EE_NAME]` |
| **Office Address** | `[WATER_DEPT_ADDRESS]`, `[DISTRICT]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[water.district@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Water Supply (`WATER_SUPPLY`) |
| **Letter Submission Channel** | In-person dak + Email |

---

### DEPT-11 — MSEDCL / Maharashtra State Electricity Distribution Co. Ltd.

| Field | Value |
|-------|-------|
| **System Code** | `MSEDCL` |
| **Name (English)** | MSEDCL (Maharashtra Electricity Board / Mahavitaran) |
| **Name (Marathi)** | महावितरण |
| **Head Designation** | Superintendent Engineer / SE (अधीक्षक अभियंता) |
| **Head Officer Name** | `[MSEDCL_SE_NAME]` |
| **Office Address** | `[MSEDCL_DIVISION_OFFICE]`, `[DISTRICT]` – `[PIN]` |
| **Phone** | `[PHONE_1]` / Helpline: 1800-200-3435 |
| **Email** | `[se.msedcl.division@mahadiscom.in]` |
| **Nivedan Categories Routed Here** | Electricity (`ELECTRICITY`) |
| **Letter Submission Channel** | Email + In-person dak |

---

### DEPT-12 — Revenue Department

| Field | Value |
|-------|-------|
| **System Code** | `REVENUE` |
| **Name (English)** | Revenue Department |
| **Name (Marathi)** | महसूल विभाग |
| **Head Designation** | Sub-Divisional Officer / SDO (उपविभागीय अधिकारी) |
| **Head Officer Name** | `[SDO_NAME]` |
| **Office Address** | `[SDO_OFFICE_ADDRESS]`, `[TALUKA]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[sdo.taluka@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Land/Revenue (`LAND_REVENUE`) |
| **Letter Submission Channel** | In-person dak |

---

### DEPT-13 — Education Department

| Field | Value |
|-------|-------|
| **System Code** | `EDUCATION_DEPT` |
| **Name (English)** | Education Department |
| **Name (Marathi)** | शिक्षण विभाग |
| **Head Designation** | Block Education Officer / BEO (गटशिक्षणाधिकारी) |
| **Head Officer Name** | `[BEO_NAME]` |
| **Office Address** | `[BEO_OFFICE_ADDRESS]`, `[TALUKA]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[beo.taluka@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Education (`EDUCATION`) |
| **Letter Submission Channel** | In-person dak + Email |

---

### DEPT-14 — Health Department

| Field | Value |
|-------|-------|
| **System Code** | `HEALTH_DEPT` |
| **Name (English)** | Health Department |
| **Name (Marathi)** | आरोग्य विभाग |
| **Head Designation** | Taluka Health Officer / THO (तालुका आरोग्य अधिकारी) |
| **Head Officer Name** | `[THO_NAME]` |
| **Office Address** | `[THO_OFFICE_ADDRESS]`, `[TALUKA]` – `[PIN]` |
| **Phone** | `[PHONE_1]` / Aarogya Setu: 104 |
| **Email** | `[tho.taluka@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Health/Medical (`HEALTH_MEDICAL`) |
| **Letter Submission Channel** | Email (urgent) + In-person dak |

---

### DEPT-15 — Social Welfare Department

| Field | Value |
|-------|-------|
| **System Code** | `SOCIAL_WELFARE` |
| **Name (English)** | Social Welfare Department |
| **Name (Marathi)** | समाजकल्याण विभाग |
| **Head Designation** | District Social Welfare Officer / DSWO (जिल्हा समाजकल्याण अधिकारी) |
| **Head Officer Name** | `[DSWO_NAME]` |
| **Office Address** | `[SOCIAL_WELFARE_ADDRESS]`, `[DISTRICT]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[dswo.district@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Pension/Welfare (`PENSION_WELFARE`), Employment (`EMPLOYMENT`) |
| **Letter Submission Channel** | In-person dak + Email |

---

### DEPT-16 — Agriculture Department

| Field | Value |
|-------|-------|
| **System Code** | `AGRICULTURE_DEPT` |
| **Name (English)** | Agriculture Department |
| **Name (Marathi)** | कृषी विभाग |
| **Head Designation** | Taluka Agriculture Officer / TAO (तालुका कृषी अधिकारी) |
| **Head Officer Name** | `[TAO_NAME]` |
| **Office Address** | `[KRISHI_OFFICE_ADDRESS]`, `[TALUKA]` – `[PIN]` |
| **Phone** | `[PHONE_1]` / Kisan Helpline: 1800-180-1551 |
| **Email** | `[tao.taluka@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Agriculture (`AGRICULTURE`) |
| **Letter Submission Channel** | In-person dak + Email |

---

### DEPT-17 — Police Department

| Field | Value |
|-------|-------|
| **System Code** | `POLICE_DEPT` |
| **Name (English)** | Police Department |
| **Name (Marathi)** | पोलीस विभाग |
| **Head Designation** | Superintendent of Police / SP (पोलीस अधीक्षक) |
| **Head Officer Name** | `[SP_NAME]` |
| **Office Address** | `[SP_OFFICE_ADDRESS]`, `[DISTRICT]` – `[PIN]` |
| **Phone** | `[PHONE_1]` / Emergency: 100 |
| **Email** | `[sp.district@mahapolice.gov.in]` |
| **Nivedan Categories Routed Here** | Police/Law & Order (`POLICE`) — always HIGH priority |
| **Letter Submission Channel** | In-person dak |

---

### DEPT-18 — Tribal Development Department

| Field | Value |
|-------|-------|
| **System Code** | `TRIBAL_DEPT` |
| **Name (English)** | Tribal Development Department |
| **Name (Marathi)** | आदिवासी विकास विभाग |
| **Head Designation** | Project Officer — Tribal (प्रकल्प अधिकारी, आदिवासी) |
| **Head Officer Name** | `[TRIBAL_PO_NAME]` |
| **Office Address** | `[TRIBAL_OFFICE_ADDRESS]`, `[DISTRICT]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[po.tribal.district@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Pension/Welfare for ST community, Housing (tribal areas) |
| **Letter Submission Channel** | In-person dak + Email |

---

### DEPT-19 — Women & Child Development Department

| Field | Value |
|-------|-------|
| **System Code** | `WOMEN_CHILD` |
| **Name (English)** | Women & Child Development Department |
| **Name (Marathi)** | महिला व बालविकास विभाग |
| **Head Designation** | Child Development Project Officer / CDPO (बाल विकास प्रकल्प अधिकारी) |
| **Head Officer Name** | `[CDPO_NAME]` |
| **Office Address** | `[WCD_OFFICE_ADDRESS]`, `[TALUKA]` – `[PIN]` |
| **Phone** | `[PHONE_1]` / Women Helpline: 181 |
| **Email** | `[cdpo.taluka@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Pension/Welfare (women beneficiaries), Ladki Bahin Yojana |
| **Letter Submission Channel** | In-person dak + Email |

---

### DEPT-20 — Food & Civil Supplies Department

| Field | Value |
|-------|-------|
| **System Code** | `FOOD_SUPPLY` |
| **Name (English)** | Food & Civil Supplies Department |
| **Name (Marathi)** | अन्न व नागरी पुरवठा विभाग |
| **Head Designation** | Supply Inspector (पुरवठा निरीक्षक) |
| **Head Officer Name** | `[SUPPLY_INSPECTOR_NAME]` |
| **Office Address** | `[FOOD_SUPPLY_ADDRESS]`, `[TALUKA]` – `[PIN]` |
| **Phone** | `[PHONE_1]` / PDS Helpline: 1967 |
| **Email** | `[si.supply.taluka@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Ration Card/PDS (`RATION_CARD`) |
| **Letter Submission Channel** | In-person dak |

---

### DEPT-21 — MSRTC (Maharashtra State Road Transport Corporation)

| Field | Value |
|-------|-------|
| **System Code** | `MSRTC` |
| **Name (English)** | MSRTC (Maharashtra State Road Transport Corporation) |
| **Name (Marathi)** | महाराष्ट्र राज्य मार्ग परिवहन महामंडळ (एसटी) |
| **Head Designation** | Divisional Controller (विभागीय नियंत्रक) |
| **Head Officer Name** | `[MSRTC_DC_NAME]` |
| **Office Address** | `[MSRTC_DEPOT_ADDRESS]`, `[DISTRICT]` – `[PIN]` |
| **Phone** | `[PHONE_1]` / MSRTC Helpline: 1800-22-1250 |
| **Email** | `[dc.msrtc.division@msrtc.gov.in]` |
| **Nivedan Categories Routed Here** | Transport complaints (General/Other → `GENERAL_OTHER`) |
| **Letter Submission Channel** | Email + In-person dak |

---

### DEPT-22 — Forest Department

| Field | Value |
|-------|-------|
| **System Code** | `FOREST_DEPT` |
| **Name (English)** | Forest Department |
| **Name (Marathi)** | वन विभाग |
| **Head Designation** | Range Forest Officer / RFO (वनपाल) |
| **Head Officer Name** | `[RFO_NAME]` |
| **Office Address** | `[FOREST_RANGE_OFFICE]`, `[TALUKA]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[rfo.range@mahaforest.gov.in]` |
| **Nivedan Categories Routed Here** | Forest land encroachment, tree cutting permissions (`GENERAL_OTHER`) |
| **Letter Submission Channel** | In-person dak |

---

### DEPT-23 — Irrigation Department (Water Resources)

| Field | Value |
|-------|-------|
| **System Code** | `IRRIGATION_DEPT` |
| **Name (English)** | Irrigation / Water Resources Department |
| **Name (Marathi)** | जलसंधारण विभाग / सिंचाई विभाग |
| **Head Designation** | Sub-Divisional Engineer — Irrigation (उपविभागीय अभियंता, सिंचन) |
| **Head Officer Name** | `[IRRIGATION_SDE_NAME]` |
| **Office Address** | `[IRRIGATION_OFFICE_ADDRESS]`, `[DISTRICT]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[sde.irrigation.district@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Agriculture water issues (`AGRICULTURE`), canal/dam complaints |
| **Letter Submission Channel** | In-person dak + Email |

---

### DEPT-24 — District Court / Legal Services

| Field | Value |
|-------|-------|
| **System Code** | `DISTRICT_COURT` |
| **Name (English)** | District Court / District Legal Services Authority |
| **Name (Marathi)** | जिल्हा न्यायालय / जिल्हा विधि सेवा प्राधिकरण |
| **Head Designation** | District Judge (जिल्हा न्यायाधीश) |
| **Head Officer Name** | `[DISTRICT_JUDGE_NAME]` |
| **Office Address** | `[COURT_ADDRESS]`, `[DISTRICT]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[dlsa.district@nic.in]` |
| **Nivedan Categories Routed Here** | Legal aid referrals, land dispute support (`LAND_REVENUE`, `GENERAL_OTHER`) |
| **Letter Submission Channel** | Formal written application only |

---

### DEPT-25 — Collector Sub-Office (Assistant Collector)

| Field | Value |
|-------|-------|
| **System Code** | `ASST_COLLECTOR` |
| **Name (English)** | Assistant Collector's Office |
| **Name (Marathi)** | सहायक जिल्हाधिकारी कार्यालय |
| **Head Designation** | Assistant Collector (सहायक जिल्हाधिकारी) |
| **Head Officer Name** | `[ASST_COLLECTOR_NAME]` |
| **Office Address** | `[ASST_COLLECTOR_ADDRESS]`, `[SUB-DIVISION]` – `[PIN]` |
| **Phone** | `[PHONE_1]` |
| **Email** | `[adc.subdivision@maharashtra.gov.in]` |
| **Nivedan Categories Routed Here** | Overflow from Collector — Housing, Caste certificates (`CERTIFICATE`, `HOUSING`) |
| **Letter Submission Channel** | In-person dak |

---

## 3. Quick Reference — Routing Summary

| System Code | Department (Marathi) | Routed Nivedan Category | Priority |
|-------------|---------------------|------------------------|:--------:|
| `COLLECTOR` | जिल्हाधिकारी | Housing (`HOUSING`) | MEDIUM |
| `TAHSILDAR` | तहसीलदार | Certificate (`CERTIFICATE`), Land (`LAND_REVENUE`) | MEDIUM |
| `ZP` | जिल्हा परिषद | Road (`ROAD_DRAINAGE`), Education, Water | MEDIUM |
| `PANCHAYAT_SAMITI` | पंचायत समिती | Employment (`EMPLOYMENT`) | MEDIUM |
| `PWD` | सार्व. बांधकाम | Road/Drainage (`ROAD_DRAINAGE`) | MEDIUM |
| `WATER_DEPT` | पाणीपुरवठा | Water Supply (`WATER_SUPPLY`) | MEDIUM |
| `MSEDCL` | महावितरण | Electricity (`ELECTRICITY`) | MEDIUM |
| `REVENUE` | महसूल | Land/Revenue (`LAND_REVENUE`) | MEDIUM |
| `EDUCATION_DEPT` | शिक्षण | Education (`EDUCATION`) | MEDIUM |
| `HEALTH_DEPT` | आरोग्य | Health/Medical (`HEALTH_MEDICAL`) | **HIGH** |
| `SOCIAL_WELFARE` | समाजकल्याण | Pension (`PENSION_WELFARE`), Employment | MEDIUM |
| `FOOD_SUPPLY` | अन्न व पुरवठा | Ration Card (`RATION_CARD`) | MEDIUM |
| `AGRICULTURE_DEPT` | कृषी | Agriculture (`AGRICULTURE`) | MEDIUM |
| `POLICE_DEPT` | पोलीस | Police/Law (`POLICE`) | **HIGH** |
| `TRIBAL_DEPT` | आदिवासी विकास | Tribal welfare | MEDIUM |
| `WOMEN_CHILD` | महिला व बालविकास | Women's welfare | MEDIUM |
| `MSRTC` | एसटी | Transport (`GENERAL_OTHER`) | MEDIUM |
| `FOREST_DEPT` | वन विभाग | Forest issues (`GENERAL_OTHER`) | MEDIUM |
| `IRRIGATION_DEPT` | जलसंधारण | Irrigation (`AGRICULTURE`) | MEDIUM |
| `DISTRICT_COURT` | जिल्हा न्यायालय | Legal aid (`GENERAL_OTHER`) | MEDIUM |
| `MUNICIPAL_CORP` | महानगरपालिका | Urban civic (`ROAD_DRAINAGE`, `WATER_SUPPLY`) | MEDIUM |
| `MUNICIPAL_COUNCIL` | नगरपरिषद | Town civic amenities | MEDIUM |

---

## 4. MySQL Database Schema

### `departments` Table

```sql
CREATE TABLE departments (
  id                   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code                 VARCHAR(30)  NOT NULL COMMENT 'System code — e.g., COLLECTOR, PWD',
  name_en              VARCHAR(200) NOT NULL,
  name_mr              VARCHAR(250) NOT NULL,
  head_designation_en  VARCHAR(150) NULL,
  head_designation_mr  VARCHAR(200) NULL,
  head_officer_name    VARCHAR(150) NULL COMMENT 'Current officer — update when officer changes',
  office_address       TEXT         NULL,
  phone_primary        VARCHAR(20)  NULL,
  phone_secondary      VARCHAR(20)  NULL,
  email                VARCHAR(150) NULL,
  letter_channel       ENUM('IN_PERSON','EMAIL','BOTH','FORMAL_APPLICATION')
                       NOT NULL DEFAULT 'BOTH',
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,

  PRIMARY KEY (id),
  UNIQUE KEY uq_dept_code (code),
  INDEX idx_dept_name_en (name_en(50))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Government department master — used for nivedan routing and outward letter recipient';
```

---

## 5. SQL Seed INSERT Statements

```sql
-- ============================================================
-- DEPARTMENT_DIRECTORY SEED DATA
-- Replace [PLACEHOLDER] values with real contact details
-- Run once during initial system setup
-- ============================================================

INSERT INTO departments
  (code, name_en, name_mr, head_designation_en, head_designation_mr,
   head_officer_name, office_address, phone_primary, email, letter_channel)
VALUES

-- DEPT-01: District Collector
('COLLECTOR', 'District Collector Office', 'जिल्हाधिकारी कार्यालय',
 'District Collector', 'जिल्हाधिकारी',
 '[COLLECTOR_NAME]', '[COLLECTOR_ADDRESS]', '[PHONE]',
 '[collector.district@maharashtra.gov.in]', 'BOTH'),

-- DEPT-02: Tahsildar
('TAHSILDAR', 'Tahsildar Office', 'तहसीलदार कार्यालय',
 'Tahsildar', 'तहसीलदार',
 '[TAHSILDAR_NAME]', '[TAHSILDAR_ADDRESS]', '[PHONE]',
 '[tahsil.taluka@maharashtra.gov.in]', 'BOTH'),

-- DEPT-03: Zilla Parishad
('ZP', 'Zilla Parishad', 'जिल्हा परिषद',
 'Chief Executive Officer', 'मुख्य कार्यकारी अधिकारी',
 '[ZP_CEO_NAME]', '[ZP_ADDRESS]', '[PHONE]',
 '[ceo.zp.district@maharashtra.gov.in]', 'BOTH'),

-- DEPT-04: Panchayat Samiti
('PANCHAYAT_SAMITI', 'Panchayat Samiti', 'पंचायत समिती',
 'Block Development Officer', 'गटविकास अधिकारी',
 '[BDO_NAME]', '[PANCHAYAT_SAMITI_ADDRESS]', '[PHONE]',
 '[bdo.taluka@maharashtra.gov.in]', 'IN_PERSON'),

-- DEPT-05: Gram Panchayat (generic — specific GPs loaded via geography)
('GRAM_PANCHAYAT', 'Gram Panchayat', 'ग्रामपंचायत',
 'Gram Sevak', 'ग्रामसेवक',
 '[GRAM_SEVAK_NAME]', '[GP_ADDRESS]', '[PHONE]',
 NULL, 'IN_PERSON'),

-- DEPT-06: Municipal Corporation
('MUNICIPAL_CORP', 'Municipal Corporation', 'महानगरपालिका',
 'Municipal Commissioner', 'आयुक्त',
 '[COMMISSIONER_NAME]', '[MUNICIPAL_CORP_ADDRESS]', '[PHONE]',
 '[commissioner.municipality@maharashtra.gov.in]', 'BOTH'),

-- DEPT-07: Municipal Council
('MUNICIPAL_COUNCIL', 'Municipal Council', 'नगरपरिषद',
 'Chief Officer', 'मुख्याधिकारी',
 '[CHIEF_OFFICER_NAME]', '[MUNICIPAL_COUNCIL_ADDRESS]', '[PHONE]',
 '[chiefoffice.nagar@maharashtra.gov.in]', 'BOTH'),

-- DEPT-08: Nagar Panchayat
('NAGAR_PANCHAYAT', 'Nagar Panchayat', 'नगरपंचायत',
 'Chief Officer', 'मुख्याधिकारी',
 '[NAGAR_CHIEF_NAME]', '[NAGAR_PANCHAYAT_ADDRESS]', '[PHONE]',
 NULL, 'IN_PERSON'),

-- DEPT-09: PWD
('PWD', 'Public Works Department', 'सार्वजनिक बांधकाम विभाग',
 'Executive Engineer', 'कार्यकारी अभियंता',
 '[PWD_EE_NAME]', '[PWD_ADDRESS]', '[PHONE]',
 '[ee.pwddivision@maharashtra.gov.in]', 'BOTH'),

-- DEPT-10: Water Supply
('WATER_DEPT', 'Water Supply Department', 'पाणीपुरवठा विभाग',
 'Executive Engineer (Water Supply)', 'कार्यकारी अभियंता, पाणीपुरवठा',
 '[WATER_EE_NAME]', '[WATER_DEPT_ADDRESS]', '[PHONE]',
 '[water.district@maharashtra.gov.in]', 'BOTH'),

-- DEPT-11: MSEDCL
('MSEDCL', 'MSEDCL (Mahavitaran)', 'महावितरण',
 'Superintendent Engineer', 'अधीक्षक अभियंता',
 '[MSEDCL_SE_NAME]', '[MSEDCL_ADDRESS]', '[PHONE]',
 '[se.msedcl.division@mahadiscom.in]', 'BOTH'),

-- DEPT-12: Revenue
('REVENUE', 'Revenue Department', 'महसूल विभाग',
 'Sub-Divisional Officer', 'उपविभागीय अधिकारी',
 '[SDO_NAME]', '[SDO_ADDRESS]', '[PHONE]',
 '[sdo.taluka@maharashtra.gov.in]', 'IN_PERSON'),

-- DEPT-13: Education
('EDUCATION_DEPT', 'Education Department', 'शिक्षण विभाग',
 'Block Education Officer', 'गटशिक्षणाधिकारी',
 '[BEO_NAME]', '[BEO_ADDRESS]', '[PHONE]',
 '[beo.taluka@maharashtra.gov.in]', 'BOTH'),

-- DEPT-14: Health
('HEALTH_DEPT', 'Health Department', 'आरोग्य विभाग',
 'Taluka Health Officer', 'तालुका आरोग्य अधिकारी',
 '[THO_NAME]', '[THO_ADDRESS]', '[PHONE]',
 '[tho.taluka@maharashtra.gov.in]', 'BOTH'),

-- DEPT-15: Social Welfare
('SOCIAL_WELFARE', 'Social Welfare Department', 'समाजकल्याण विभाग',
 'District Social Welfare Officer', 'जिल्हा समाजकल्याण अधिकारी',
 '[DSWO_NAME]', '[SOCIAL_WELFARE_ADDRESS]', '[PHONE]',
 '[dswo.district@maharashtra.gov.in]', 'BOTH'),

-- DEPT-16: Agriculture
('AGRICULTURE_DEPT', 'Agriculture Department', 'कृषी विभाग',
 'Taluka Agriculture Officer', 'तालुका कृषी अधिकारी',
 '[TAO_NAME]', '[KRISHI_ADDRESS]', '[PHONE]',
 '[tao.taluka@maharashtra.gov.in]', 'BOTH'),

-- DEPT-17: Police
('POLICE_DEPT', 'Police Department', 'पोलीस विभाग',
 'Superintendent of Police', 'पोलीस अधीक्षक',
 '[SP_NAME]', '[SP_OFFICE_ADDRESS]', '[PHONE]',
 '[sp.district@mahapolice.gov.in]', 'IN_PERSON'),

-- DEPT-18: Tribal
('TRIBAL_DEPT', 'Tribal Development Department', 'आदिवासी विकास विभाग',
 'Project Officer (Tribal)', 'प्रकल्प अधिकारी, आदिवासी',
 '[TRIBAL_PO_NAME]', '[TRIBAL_ADDRESS]', '[PHONE]',
 '[po.tribal.district@maharashtra.gov.in]', 'BOTH'),

-- DEPT-19: Women & Child
('WOMEN_CHILD', 'Women & Child Development', 'महिला व बालविकास विभाग',
 'Child Development Project Officer', 'बाल विकास प्रकल्प अधिकारी',
 '[CDPO_NAME]', '[WCD_ADDRESS]', '[PHONE]',
 '[cdpo.taluka@maharashtra.gov.in]', 'BOTH'),

-- DEPT-20: Food Supply
('FOOD_SUPPLY', 'Food & Civil Supplies Dept', 'अन्न व नागरी पुरवठा विभाग',
 'Supply Inspector', 'पुरवठा निरीक्षक',
 '[SUPPLY_INSPECTOR_NAME]', '[FOOD_SUPPLY_ADDRESS]', '[PHONE]',
 '[si.supply.taluka@maharashtra.gov.in]', 'IN_PERSON'),

-- DEPT-21: MSRTC
('MSRTC', 'MSRTC', 'महाराष्ट्र राज्य मार्ग परिवहन महामंडळ',
 'Divisional Controller', 'विभागीय नियंत्रक',
 '[MSRTC_DC_NAME]', '[MSRTC_DEPOT_ADDRESS]', '[PHONE]',
 '[dc.msrtc.division@msrtc.gov.in]', 'BOTH'),

-- DEPT-22: Forest
('FOREST_DEPT', 'Forest Department', 'वन विभाग',
 'Range Forest Officer', 'वनपाल',
 '[RFO_NAME]', '[FOREST_RANGE_OFFICE]', '[PHONE]',
 '[rfo.range@mahaforest.gov.in]', 'IN_PERSON'),

-- DEPT-23: Irrigation
('IRRIGATION_DEPT', 'Irrigation / Water Resources Dept', 'जलसंधारण विभाग',
 'Sub-Divisional Engineer (Irrigation)', 'उपविभागीय अभियंता, सिंचन',
 '[IRRIGATION_SDE_NAME]', '[IRRIGATION_ADDRESS]', '[PHONE]',
 '[sde.irrigation.district@maharashtra.gov.in]', 'BOTH'),

-- DEPT-24: District Court
('DISTRICT_COURT', 'District Court / DLSA', 'जिल्हा न्यायालय',
 'District Judge', 'जिल्हा न्यायाधीश',
 '[DISTRICT_JUDGE_NAME]', '[COURT_ADDRESS]', '[PHONE]',
 '[dlsa.district@nic.in]', 'FORMAL_APPLICATION'),

-- DEPT-25: Assistant Collector
('ASST_COLLECTOR', 'Assistant Collector Office', 'सहायक जिल्हाधिकारी कार्यालय',
 'Assistant Collector', 'सहायक जिल्हाधिकारी',
 '[ASST_COLLECTOR_NAME]', '[ASST_COLLECTOR_ADDRESS]', '[PHONE]',
 '[adc.subdivision@maharashtra.gov.in]', 'IN_PERSON');
```

---

## 6. Pre-Live Checklist

| # | Department | Officer Name Filled | Phone Filled | Address Filled |
|:-:|------------|:-------------------:|:------------:|:--------------:|
| 1 | District Collector | ⬜ | ⬜ | ⬜ |
| 2 | Tahsildar | ⬜ | ⬜ | ⬜ |
| 3 | Zilla Parishad | ⬜ | ⬜ | ⬜ |
| 4 | Panchayat Samiti | ⬜ | ⬜ | ⬜ |
| 5 | Gram Panchayat | ⬜ | ⬜ | ⬜ |
| 6 | Municipal Corporation | ⬜ | ⬜ | ⬜ |
| 7 | Municipal Council | ⬜ | ⬜ | ⬜ |
| 8 | Nagar Panchayat | ⬜ | ⬜ | ⬜ |
| 9 | PWD | ⬜ | ⬜ | ⬜ |
| 10 | Water Supply | ⬜ | ⬜ | ⬜ |
| 11 | MSEDCL | ⬜ | ⬜ | ⬜ |
| 12 | Revenue | ⬜ | ⬜ | ⬜ |
| 13 | Education | ⬜ | ⬜ | ⬜ |
| 14 | Health | ⬜ | ⬜ | ⬜ |
| 15 | Social Welfare | ⬜ | ⬜ | ⬜ |
| 16 | Agriculture | ⬜ | ⬜ | ⬜ |
| 17 | Police | ⬜ | ⬜ | ⬜ |
| 18 | Tribal Development | ⬜ | ⬜ | ⬜ |
| 19 | Women & Child | ⬜ | ⬜ | ⬜ |
| 20 | Food & Civil Supplies | ⬜ | ⬜ | ⬜ |
| 21 | MSRTC | ⬜ | ⬜ | ⬜ |
| 22 | Forest Department | ⬜ | ⬜ | ⬜ |
| 23 | Irrigation | ⬜ | ⬜ | ⬜ |
| 24 | District Court / DLSA | ⬜ | ⬜ | ⬜ |
| 25 | Assistant Collector | ⬜ | ⬜ | ⬜ |
