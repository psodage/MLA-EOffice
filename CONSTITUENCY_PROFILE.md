# MLA E-Office — Constituency Profile

> **Structured Placeholder Template — Fill in before going live**
>
> This document is the single source of truth for MLA identity, office details, letterhead configuration, and dashboard branding. All values here are imported into `constituency.config.js` and used throughout the system — greeting messages, letter headers, WhatsApp sender name, dashboard welcome, and PDF generation.
>
> ⚠️ **Action required:** PA or System Administrator must fill every `[PLACEHOLDER]` value before the system goes live. Do not leave any section blank.
>
> *Related Documents:* [WHATSAPP_TEMPLATES.md](file:///s:/MLA%20E%20-%20Office/WHATSAPP_TEMPLATES.md) | [GREETING_CALENDAR.md](file:///s:/MLA%20E%20-%20Office/GREETING_CALENDAR.md) | [AUTO_ROUTING_RULES.md](file:///s:/MLA%20E%20-%20Office/AUTO_ROUTING_RULES.md) | [AI_LETTER_DRAFTING.md](file:///s:/MLA%20E%20-%20Office/AI_LETTER_DRAFTING.md)

---

## 1. MLA Identity

| Field | English Value | Marathi Value | Config Key |
|-------|--------------|--------------|------------|
| **Full Name** | `[MLA_FULL_NAME_EN]` | `[MLA_FULL_NAME_MR]` | `mla_name_en` / `mla_name_mr` |
| **Short Name / Common Name** | `[MLA_SHORT_NAME_EN]` | `[MLA_SHORT_NAME_MR]` | `mla_short_name_en` / `mla_short_name_mr` |
| **Salutation / Prefix** | `[Hon. / Shri / Smt.]` | `[मा. / श्री. / सौ.]` | `mla_salutation_en` / `mla_salutation_mr` |
| **Designation** | Member of Legislative Assembly | विधानसभा सदस्य (आमदार) | `mla_designation_en` / `mla_designation_mr` |
| **Party Name** | `[PARTY_NAME_EN]` | `[PARTY_NAME_MR]` | `party_name_en` / `party_name_mr` |
| **Party Short Code** | `[BJP / NCP / INC / SS / etc.]` | — | `party_code` |
| **MLA Photo File** | `assets/mla_photo.jpg` | — | `mla_photo_path` |
| **Party Symbol File** | `assets/party_symbol.png` | — | `party_symbol_path` |
| **Party Logo File** | `assets/party_logo.png` | — | `party_logo_path` |

> **Photo specs:** MLA photo — minimum 300×400px, JPG/PNG, white or neutral background. Party symbol — minimum 200×200px, PNG with transparent background preferred.

---

## 2. Constituency Details

| Field | English Value | Marathi Value | Config Key |
|-------|--------------|--------------|------------|
| **Constituency Name** | `[CONSTITUENCY_NAME_EN]` | `[CONSTITUENCY_NAME_MR]` | `constituency_name_en` / `constituency_name_mr` |
| **Constituency Number** | `[CONSTITUENCY_NUMBER]` | — | `constituency_number` |
| **District** | `[DISTRICT_NAME_EN]` | `[DISTRICT_NAME_MR]` | `district_name_en` / `district_name_mr` |
| **Division** | `[DIVISION_NAME_EN]` | `[DIVISION_NAME_MR]` | `division_name_en` / `division_name_mr` |
| **State** | Maharashtra | महाराष्ट्र | `state_name_en` / `state_name_mr` |
| **Constituency Type** | `[Rural / Urban / Mixed]` | `[ग्रामीण / शहरी / मिश्र]` | `constituency_type` |
| **Taluka(s) Covered** | `[TALUKA_1, TALUKA_2, ...]` | `[तालुका_१, तालुका_२, ...]` | `talukas` *(array)* |
| **Total Booths** | `[TOTAL_BOOTH_COUNT]` | — | `total_booths` |
| **Total Registered Voters** | `[TOTAL_VOTER_COUNT]` | — | `total_voters` |
| **Current Term (Year)** | `[ELECTED_YEAR] – Present` | — | `elected_year` |
| **Assembly (Vidhan Sabha)** | Maharashtra Legislative Assembly | महाराष्ट्र विधानसभा | `assembly_name_en` / `assembly_name_mr` |

---

## 3. Office Details

| Field | Value | Config Key |
|-------|-------|------------|
| **Office Name (English)** | `[OFFICE_NAME_EN]` *(e.g., "Office of MLA, Amravati")* | `office_name_en` |
| **Office Name (Marathi)** | `[OFFICE_NAME_MR]` *(e.g., "आमदार कार्यालय, अमरावती")* | `office_name_mr` |
| **Address Line 1** | `[BUILDING / PLOT NAME]` | `office_address_line1` |
| **Address Line 2** | `[STREET / ROAD NAME]` | `office_address_line2` |
| **City / Town** | `[CITY]` | `office_city` |
| **District** | `[DISTRICT]` | `office_district` |
| **State** | Maharashtra | `office_state` |
| **PIN Code** | `[6-DIGIT PIN]` | `office_pincode` |
| **Primary Phone** | `[OFFICE_PHONE_1]` *(e.g., 0721-XXXXXXX)* | `office_phone_primary` |
| **Secondary Phone** | `[OFFICE_PHONE_2]` *(optional)* | `office_phone_secondary` |
| **Mobile / WhatsApp** | `[OFFICE_MOBILE]` | `office_mobile` |
| **Email** | `[OFFICE_EMAIL]` | `office_email` |
| **Website** | `[WEBSITE_URL]` *(optional)* | `office_website` |
| **Office Hours** | `[e.g., Monday–Saturday, 10:00 AM – 6:00 PM]` | `office_hours_en` |
| **Office Hours (Marathi)** | `[e.g., सोमवार–शनिवार, सकाळी १०:०० – सायंकाळी ६:००]` | `office_hours_mr` |
| **Holiday** | `[e.g., Sunday and 2nd Saturday]` | `office_holiday` |

---

## 4. Letter Header Configuration

Used for all outward letters, AI-generated drafts, and printed PDF headers.

| Field | Value | Config Key |
|-------|-------|------------|
| **Letterhead Title Line 1 (English)** | `[MLA_SALUTATION_EN] [MLA_FULL_NAME_EN]` | `letterhead_title_en` |
| **Letterhead Title Line 1 (Marathi)** | `[मा. MLA_FULL_NAME_MR]` | `letterhead_title_mr` |
| **Letterhead Title Line 2 (English)** | `Member, Maharashtra Legislative Assembly` | `letterhead_subtitle_en` |
| **Letterhead Title Line 2 (Marathi)** | `सदस्य, महाराष्ट्र विधानसभा` | `letterhead_subtitle_mr` |
| **Letterhead Title Line 3 (Constituency)** | `[CONSTITUENCY_NAME_EN] Constituency` | `letterhead_constituency_en` |
| **Letterhead Title Line 3 (Marathi)** | `[CONSTITUENCY_NAME_MR] मतदारसंघ` | `letterhead_constituency_mr` |
| **Letter Office Address Block** | Multi-line — see §3 above | `letter_address_block` |
| **Letter Phone/Email Footer** | `Phone: [PHONE] | Email: [EMAIL]` | `letter_contact_footer` |
| **Signature Block (English)** | `Yours faithfully, [MLA_FULL_NAME_EN], MLA, [CONSTITUENCY_NAME_EN]` | `signature_block_en` |
| **Signature Block (Marathi)** | `आपला विश्वासू, [MLA_FULL_NAME_MR], आमदार, [CONSTITUENCY_NAME_MR] मतदारसंघ` | `signature_block_mr` |
| **MLA Digital Signature File** | `assets/mla_signature.png` | `mla_signature_path` |
| **Official Stamp Description** | `[e.g., "Round rubber stamp: Office of MLA [NAME]"]` | `stamp_description` |

---

## 5. Dashboard Branding

| Field | Value | Config Key |
|-------|-------|------------|
| **Dashboard Welcome (English)** | `Welcome to [MLA_NAME_EN]'s Office Management System` | `dashboard_welcome_en` |
| **Dashboard Welcome (Marathi)** | `[MLA_NAME_MR] यांच्या कार्यालय व्यवस्थापन प्रणालीत स्वागत आहे` | `dashboard_welcome_mr` |
| **Primary Theme Color** | `[HEX COLOR CODE]` *(default: #1B2A4A — Navy)* | `theme_color_primary` |
| **Accent Theme Color** | `[HEX COLOR CODE]` *(default: #F59E0B — Amber)* | `theme_color_accent` |
| **App Title (Browser Tab)** | `[MLA_NAME_EN] — E-Office` | `app_title` |
| **Favicon Path** | `assets/favicon.ico` | `favicon_path` |
| **Sidebar Logo** | `assets/party_logo.png` *(or MLA photo)* | `sidebar_logo_path` |
| **Footer Text** | `© [YEAR] [PARTY_NAME_EN]. All rights reserved.` | `footer_text` |

---

## 6. WhatsApp Sender Identity

Used by `greeting.service.js`, `whatsapp.service.js`, and all template messages.

| Field | Value | Config Key |
|-------|-------|------------|
| **WhatsApp Business Account Name** | `[WABA_DISPLAY_NAME]` *(as registered with Meta)* | `whatsapp_sender_name` |
| **WhatsApp Sender Number** | `+91[10-DIGIT-NUMBER]` | `whatsapp_sender_mobile` |
| **Meta WABA ID** | `[WABA_ID from Meta Business Manager]` | `whatsapp_waba_id` |
| **Meta Phone Number ID** | `[PHONE_NUMBER_ID from Meta]` | `whatsapp_phone_number_id` |
| **Meta API Access Token** | *(stored in `.env` — never in this file)* | `WHATSAPP_TOKEN` *(env var)* |
| **Template Namespace** | `[TEMPLATE_NAMESPACE from Meta]` | `whatsapp_template_namespace` |

> ⚠️ **Security Note:** Never store the Meta API Access Token in this file. It must only exist in the `.env` file as `WHATSAPP_TOKEN`. See [ENV_CONFIG.md](file:///s:/MLA%20E%20-%20Office/ENV_CONFIG.md) for environment variable setup.

---

## 7. System Configuration Reference

These are the values that link this profile to system behavior. Every time a field changes (e.g., new phone number), update this document AND the `constituency.config.js` file.

| Used In | Fields Referenced |
|---------|-----------------|
| **Greeting messages** (`greeting.service.js`) | `mla_name_mr`, `constituency_name_mr` |
| **WhatsApp templates** (`whatsapp.service.js`) | `mla_name_mr`, `whatsapp_sender_name`, `whatsapp_sender_mobile` |
| **Letter drafting AI prompt** | `mla_name_en`, `mla_name_mr`, `constituency_name_en`, `party_name_en` |
| **PDF letter generation** | `letterhead_title_*`, `signature_block_*`, `mla_signature_path` |
| **Dashboard header** | `mla_name_en`, `mla_photo_path`, `party_logo_path`, `theme_color_*` |
| **Nivedan receipt printing** | `office_name_mr`, `office_address_line1`, `office_phone_primary` |
| **Auto-routing** | *(uses DB-stored routing rules — no direct config needed)* |

---

## 8. `constituency.config.js` — Node.js Config File

This is the live config file imported by all backend services. Update this file after filling in the profile fields above.

```javascript
// src/config/constituency.config.js
// ============================================================
// CONSTITUENCY PROFILE CONFIGURATION
// Action: Fill every [PLACEHOLDER] before going live.
// After editing: restart the Node.js server.
// ============================================================

module.exports = {

  // ── MLA Identity ─────────────────────────────────────────
  mla_name_en:          '[MLA_FULL_NAME_EN]',           // e.g., 'Suresh Ramrao Deshmukh'
  mla_name_mr:          '[MLA_FULL_NAME_MR]',           // e.g., 'सुरेश रामराव देशमुख'
  mla_short_name_en:    '[MLA_SHORT_NAME_EN]',          // e.g., 'Suresh Deshmukh'
  mla_short_name_mr:    '[MLA_SHORT_NAME_MR]',          // e.g., 'सुरेश देशमुख'
  mla_salutation_en:    '[Hon. / Shri / Smt.]',        // e.g., 'Hon.'
  mla_salutation_mr:    '[मा. / श्री. / सौ.]',         // e.g., 'मा.'
  mla_designation_en:   'Member of Legislative Assembly',
  mla_designation_mr:   'विधानसभा सदस्य (आमदार)',
  mla_photo_path:       'assets/mla_photo.jpg',
  mla_signature_path:   'assets/mla_signature.png',

  // ── Party ─────────────────────────────────────────────────
  party_name_en:        '[PARTY_NAME_EN]',             // e.g., 'Bharatiya Janata Party'
  party_name_mr:        '[PARTY_NAME_MR]',             // e.g., 'भारतीय जनता पार्टी'
  party_code:           '[BJP]',                        // e.g., 'BJP', 'NCP', 'INC', 'SS'
  party_symbol_path:    'assets/party_symbol.png',
  party_logo_path:      'assets/party_logo.png',

  // ── Constituency ──────────────────────────────────────────
  constituency_name_en:   '[CONSTITUENCY_NAME_EN]',    // e.g., 'Amravati'
  constituency_name_mr:   '[CONSTITUENCY_NAME_MR]',    // e.g., 'अमरावती'
  constituency_number:    '[CONSTITUENCY_NUMBER]',      // e.g., '19'
  district_name_en:       '[DISTRICT_NAME_EN]',        // e.g., 'Amravati'
  district_name_mr:       '[DISTRICT_NAME_MR]',        // e.g., 'अमरावती'
  division_name_en:       '[DIVISION_NAME_EN]',        // e.g., 'Amravati Division'
  division_name_mr:       '[DIVISION_NAME_MR]',        // e.g., 'अमरावती विभाग'
  state_name_en:          'Maharashtra',
  state_name_mr:          'महाराष्ट्र',
  constituency_type:      '[Rural / Urban / Mixed]',
  talukas:                ['[TALUKA_1]', '[TALUKA_2]'], // Add all talukas
  total_booths:           '[TOTAL_BOOTH_COUNT]',        // e.g., 285
  total_voters:           '[TOTAL_VOTER_COUNT]',        // e.g., 210450
  elected_year:           '[ELECTED_YEAR]',             // e.g., 2024
  assembly_name_en:       'Maharashtra Legislative Assembly',
  assembly_name_mr:       'महाराष्ट्र विधानसभा',

  // ── Office ────────────────────────────────────────────────
  office_name_en:         '[OFFICE_NAME_EN]',          // e.g., 'Office of MLA, Amravati'
  office_name_mr:         '[OFFICE_NAME_MR]',          // e.g., 'आमदार कार्यालय, अमरावती'
  office_address_line1:   '[BUILDING / PLOT NAME]',
  office_address_line2:   '[STREET / ROAD NAME]',
  office_city:            '[CITY]',
  office_district:        '[DISTRICT]',
  office_state:           'Maharashtra',
  office_pincode:         '[6-DIGIT PIN]',
  office_phone_primary:   '[OFFICE_PHONE_1]',          // e.g., '0721-2345678'
  office_phone_secondary: '[OFFICE_PHONE_2]',          // optional
  office_mobile:          '[OFFICE_MOBILE]',
  office_email:           '[OFFICE_EMAIL]',
  office_website:         '[WEBSITE_URL]',             // optional, or null
  office_hours_en:        '[e.g., Monday–Saturday, 10:00 AM – 6:00 PM]',
  office_hours_mr:        '[e.g., सोमवार–शनिवार, सकाळी १०:०० – सायंकाळी ६:००]',
  office_holiday:         '[e.g., Sunday and 2nd Saturday]',

  // ── Letter Header ─────────────────────────────────────────
  letterhead_title_en:         '[mla_salutation_en] [mla_name_en]',
  letterhead_title_mr:         '[मा. mla_name_mr]',
  letterhead_subtitle_en:      'Member, Maharashtra Legislative Assembly',
  letterhead_subtitle_mr:      'सदस्य, महाराष्ट्र विधानसभा',
  letterhead_constituency_en:  '[CONSTITUENCY_NAME_EN] Constituency',
  letterhead_constituency_mr:  '[CONSTITUENCY_NAME_MR] मतदारसंघ',
  signature_block_en:          'Yours faithfully,\n[MLA_FULL_NAME_EN]\nMLA, [CONSTITUENCY_NAME_EN]',
  signature_block_mr:          'आपला विश्वासू,\n[MLA_FULL_NAME_MR]\nआमदार, [CONSTITUENCY_NAME_MR] मतदारसंघ',
  stamp_description:           '[OFFICIAL STAMP DESCRIPTION]',

  // ── Dashboard Branding ────────────────────────────────────
  dashboard_welcome_en:   "[MLA_NAME_EN]'s Office Management System",
  dashboard_welcome_mr:   '[MLA_NAME_MR] यांच्या कार्यालय व्यवस्थापन प्रणालीत स्वागत आहे',
  theme_color_primary:    '#1B2A4A',                   // Navy — change if needed
  theme_color_accent:     '#F59E0B',                   // Amber — change if needed
  app_title:              '[MLA_NAME_EN] — E-Office',
  favicon_path:           'assets/favicon.ico',
  sidebar_logo_path:      'assets/party_logo.png',
  footer_text:            '© [YEAR] [PARTY_NAME_EN]. All rights reserved.',

  // ── WhatsApp ──────────────────────────────────────────────
  // NOTE: API token is in .env as WHATSAPP_TOKEN — never here.
  whatsapp_sender_name:         '[WABA_DISPLAY_NAME]',
  whatsapp_sender_mobile:       '+91[10-DIGIT-NUMBER]',
  whatsapp_waba_id:             '[WABA_ID]',
  whatsapp_phone_number_id:     '[PHONE_NUMBER_ID]',
  whatsapp_template_namespace:  '[TEMPLATE_NAMESPACE]',
};
```

---

## 9. Pre-Live Checklist

The PA or System Administrator should verify every item before the system goes live:

| # | Item | Status |
|:-:|------|:------:|
| 1 | MLA full name filled (English) | ⬜ |
| 2 | MLA full name filled (Marathi) | ⬜ |
| 3 | Party name filled (both languages) | ⬜ |
| 4 | Constituency name filled (both languages) | ⬜ |
| 5 | District and taluka details filled | ⬜ |
| 6 | Office address, phone, email filled | ⬜ |
| 7 | Office hours filled (both languages) | ⬜ |
| 8 | MLA photo uploaded → `assets/mla_photo.jpg` | ⬜ |
| 9 | Party logo uploaded → `assets/party_logo.png` | ⬜ |
| 10 | MLA digital signature uploaded → `assets/mla_signature.png` | ⬜ |
| 11 | WhatsApp WABA ID, Phone Number ID filled | ⬜ |
| 12 | WhatsApp sender name and number filled | ⬜ |
| 13 | `WHATSAPP_TOKEN` set in `.env` | ⬜ |
| 14 | `constituency.config.js` updated with all values | ⬜ |
| 15 | Server restarted after config changes | ⬜ |
| 16 | Test WhatsApp message sent to verify sender identity | ⬜ |
| 17 | Test letter PDF generated to verify letterhead | ⬜ |
| 18 | Dashboard branding verified (logo, colors, welcome message) | ⬜ |
