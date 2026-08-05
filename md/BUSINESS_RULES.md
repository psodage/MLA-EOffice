# MLA E-Office — Business Rules & Logic

> **Complete Business Rules Reference — Every "What Happens When" Rule, Validation, Automation, and Edge Case**
> 
> This document defines the business logic that governs the system's behavior. Developers must implement these rules exactly as specified.
> 
> *Related Documents:* [PROJECT_SECTIONS_BREAKDOWN.md](file:///s:/MLA%20E%20-%20Office/PROJECT_SECTIONS_BREAKDOWN.md) | [USER_ROLES.md](file:///s:/MLA%20E%20-%20Office/USER_ROLES.md) | [API_SPEC.md](file:///s:/MLA%20E%20-%20Office/API_SPEC.md) | [AUTH_SPEC.md](file:///s:/MLA%20E%20-%20Office/AUTH_SPEC.md)

---

## 1. Core System Principles

These rules apply **globally** across every module.

### Rule 1.1 — No Physical Deletion (Permanent Data)

| Rule ID | BR-CORE-001 |
|---------|-------------|
| **Rule** | No record in the database is ever physically deleted (`DELETE` SQL is forbidden). |
| **Implementation** | Use soft-delete strategies per table — `status` enum (nivedans, inward), `is_active` boolean (users, karyakartas), `is_cancelled` boolean (calendar). |
| **Rationale** | MLA office records are permanent government documents. All data must be auditable. |
| **Exception** | System Admin may purge `audit_logs` older than 3 years and `whatsapp_logs` older than 1 year via a maintenance script — only if approved by PA. |

### Rule 1.2 — Audit Trail on Every Mutation

| Rule ID | BR-CORE-002 |
|---------|-------------|
| **Rule** | Every CREATE, UPDATE, ARCHIVE, and CANCEL operation must insert an entry into the `audit_logs` table. |
| **Data Captured** | `user_id`, `action`, `module`, `entity_type`, `entity_id`, `old_values` (JSON), `new_values` (JSON), `ip_address`, `is_delegated`. |
| **Exception** | Read-only operations (GET requests) are not logged. Login/logout are logged separately. |

### Rule 1.3 — UTC Storage, IST Display

| Rule ID | BR-CORE-003 |
|---------|-------------|
| **Rule** | All timestamps are stored in UTC in the database. The frontend converts to IST (Asia/Kolkata, UTC+5:30) for display. |
| **Date Format (Display)** | `DD/MM/YYYY` (Indian standard). |
| **Time Format (Display)** | `hh:mm AM/PM` (12-hour format). |
| **Currency Format** | `₹ X,XX,XXX.XX` (Indian numbering: lakhs/crores). |

### Rule 1.4 — Bilingual Support

| Rule ID | BR-CORE-004 |
|---------|-------------|
| **Rule** | All master data (categories, departments, villages, etc.) must have both `name_en` (English) and `name_mr` (Marathi) fields. |
| **UI Default** | Marathi is the primary display language. English used for technical labels and system messages. |
| **User Input** | Citizens and staff may enter data in either language. No validation on language used. |

---

## 2. Nivedan (Complaint) Rules

### Rule 2.1 — Tracking ID Generation

| Rule ID | BR-NIV-001 |
|---------|-------------|
| **Rule** | Every nivedan receives a unique tracking ID in format `NIV-YYYY-NNNNN`. |
| **Reset** | Counter resets to `00001` on January 1st each year. |
| **Generation** | `SELECT MAX(id) FROM nivedans WHERE YEAR(created_at) = YEAR(NOW())` inside a transaction to prevent race conditions. |
| **Example** | First nivedan of 2026 → `NIV-2026-00001`, 500th → `NIV-2026-00500`. |

### Rule 2.2 — Auto-Routing by Category

| Rule ID | BR-NIV-002 |
|---------|-------------|
| **Rule** | When a nivedan is created, the system auto-suggests a default government department based on the selected category. |
| **Source** | `categories.default_department_id` field. |
| **Override** | PA can override the suggested department before or after saving. |
| **No Default** | If category is `GENERAL_OTHER` (no default department), the `department_forwarded_to_id` remains NULL until PA assigns manually. |

### Rule 2.3 — Status Transitions (State Machine)

| Rule ID | BR-NIV-003 |
|---------|-------------|
| **Rule** | Nivedan status changes must follow the valid transition matrix. Invalid transitions return `INVALID_STATUS_TRANSITION` (400). |

```
                    ┌──────────────────────────────────────────────┐
                    │          VALID STATUS TRANSITIONS             │
                    └──────────────────────────────────────────────┘

    ┌─────────┐     ┌──────────────┐     ┌───────────┐     ┌──────────────────┐
    │ PENDING │────▶│ IN_PROGRESS  │────▶│ FORWARDED │────▶│AWAITING_RESPONSE │
    └────┬────┘     └──────┬───────┘     └─────┬─────┘     └────────┬─────────┘
         │                 │                   │                    │
         │                 │                   │                    │
         ▼                 ▼                   ▼                    ▼
    ┌──────────┐     ┌──────────┐        ┌──────────┐        ┌──────────────┐
    │ REJECTED │     │ RESOLVED │◀───────│ RESOLVED │        │ IN_PROGRESS  │
    └────┬─────┘     └────┬─────┘        └──────────┘        └──────────────┘
         │                │                                        │
         ▼                ▼                                        ▼
    ┌──────────┐     ┌──────────┐                            ┌──────────┐
    │ ARCHIVED │     │ ARCHIVED │                            │ RESOLVED │
    └──────────┘     └──────────┘                            └──────────┘


    ANY STATE ─────▶ CANCELLED    (citizen withdrew)

    ARCHIVED ──────▶ (nothing)    ❌ FINAL STATE
    CANCELLED ─────▶ (nothing)    ❌ FINAL STATE
```

**Valid Transitions Table:**

| From | To | Who Can | Side Effects |
|------|----|---------|-------------|
| PENDING | IN_PROGRESS | PA | Timeline entry, notification |
| PENDING | FORWARDED | PA | Timeline entry, notification, WhatsApp update |
| PENDING | REJECTED | PA | Timeline entry, notification, WhatsApp update |
| PENDING | CANCELLED | PA, Receptionist | Timeline entry |
| IN_PROGRESS | FORWARDED | PA | Timeline entry, WhatsApp update |
| IN_PROGRESS | RESOLVED | PA | Timeline, WhatsApp resolved, notification to MLA |
| IN_PROGRESS | CANCELLED | PA | Timeline entry |
| FORWARDED | AWAITING_RESPONSE | PA | Timeline entry |
| FORWARDED | RESOLVED | PA | Timeline, WhatsApp resolved, notification |
| AWAITING_RESPONSE | IN_PROGRESS | PA | Timeline entry (dept responded) |
| AWAITING_RESPONSE | RESOLVED | PA | Timeline, WhatsApp resolved, notification |
| RESOLVED | ARCHIVED | PA, System (auto) | Timeline entry |
| REJECTED | ARCHIVED | PA, System (auto) | Timeline entry |
| Any active | CANCELLED | PA | Timeline entry, WhatsApp notification |

### Rule 2.4 — Auto-Escalation

| Rule ID | BR-NIV-004 |
|---------|-------------|
| **Rule** | If a nivedan remains in `PENDING` or `IN_PROGRESS` status beyond its category's `escalation_days`, the system auto-escalates. |
| **Trigger** | Daily cron job at 9:00 AM IST. |
| **Level 1** | Deadline exceeded → `escalation_level = LEVEL_1`, notification to PA (WARNING severity). |
| **Level 2** | Level 1 unresolved for 3 more days → `escalation_level = LEVEL_2`, notification to MLA + PA (CRITICAL severity). |
| **De-escalation** | Escalation level is NOT reset when status changes. It stays as a permanent record of delay. |

**Escalation Deadlines:**

| Category | Days to Level 1 | Days to Level 2 |
|----------|:---:|:---:|
| Health / Medical | 2 | 2 + 3 = 5 |
| Electricity | 3 | 3 + 3 = 6 |
| Water Supply | 5 | 5 + 3 = 8 |
| Land / Revenue | 5 | 5 + 3 = 8 |
| Education | 5 | 5 + 3 = 8 |
| Pension / Welfare | 5 | 5 + 3 = 8 |
| Ration Card | 5 | 5 + 3 = 8 |
| Police | 5 | 5 + 3 = 8 |
| Certificate | 7 | 7 + 3 = 10 |
| Housing | 7 | 7 + 3 = 10 |
| Agriculture | 7 | 7 + 3 = 10 |
| Employment | 7 | 7 + 3 = 10 |
| General / Other | 7 | 7 + 3 = 10 |
| Road / Drainage | 10 | 10 + 3 = 13 |

### Rule 2.5 — Auto-Archival

| Rule ID | BR-NIV-005 |
|---------|-------------|
| **Rule** | Nivedans in `RESOLVED` or `REJECTED` status are auto-archived after **90 days**. |
| **Trigger** | Weekly cron job (Sunday midnight). |
| **Override** | PA can manually archive a resolved nivedan before 90 days. |
| **Effect** | Status changes to `ARCHIVED`. Timeline entry added (action=ARCHIVED, performedBy=System). |
| **Archived data** | Remains in the `nivedans` table with `status = ARCHIVED`. Visible in reports but excluded from active dashboards. |

### Rule 2.6 — Duplicate Detection

| Rule ID | BR-NIV-006 |
|---------|-------------|
| **Rule** | When creating a nivedan, if an **open** (non-resolved/archived/cancelled) nivedan exists with the **same citizen mobile + same category**, the system shows a warning. |
| **Behavior** | Warning popup with existing nivedan's tracking ID, subject, and status. |
| **Override** | Receptionist/PA can dismiss the warning and create anyway (it may be a genuinely separate issue). |
| **Not blocked** | Creation is NOT blocked — only a warning is shown. |

### Rule 2.7 — Citizen History Lookup

| Rule ID | BR-NIV-007 |
|---------|-------------|
| **Rule** | When the Receptionist enters a citizen's mobile number in the nivedan form, the system auto-fetches all previous complaints by that mobile number. |
| **Display** | Show count of total complaints + list with tracking ID, subject, status, date. |
| **Warning Badge** | If citizen has **3 or more active (unresolved)** complaints, show a ⚠️ "Frequent Complainant" badge. |
| **No limit** | There is no limit on how many complaints a citizen can file. The badge is informational only. |

### Rule 2.8 — Printable Receipt

| Rule ID | BR-NIV-008 |
|---------|-------------|
| **Rule** | When a nivedan is created, the system generates a **printable text receipt** for the citizen. |
| **Contains** | Tracking ID, citizen name, subject, category, date, office name, footer text (from config). |
| **No QR Code** | Simple text format — no QR code for MVP. |
| **Format** | Thermal printer-compatible (80mm width) or A5 half-page. |

### Rule 2.9 — WhatsApp Acknowledgment

| Rule ID | BR-NIV-009 |
|---------|-------------|
| **Rule** | When a nivedan is created, a WhatsApp acknowledgment message is queued for the citizen. |
| **Template** | `nivedan_ack` — includes citizen name, tracking ID, subject. |
| **Timing** | Queued immediately, sent by background worker (batch of 10 every 30 seconds). |
| **Fallback** | If WhatsApp delivery fails after 2 retries, SMS fallback is attempted. PA is notified. |

### Rule 2.10 — Priority Rules

| Rule ID | BR-NIV-010 |
|---------|-------------|
| **Rule** | All nivedans default to `MEDIUM` priority regardless of category. PA can manually override to `HIGH` or `LOW`. |
| **Display** | Priority shown as colored badge: 🔴 HIGH, 🟡 MEDIUM, 🟢 LOW. |
| **Sorting** | Dashboard lists show HIGH priority nivedans first when sorted by priority. |

---

## 3. Inward / Outward Rules

### Rule 3.1 — Inward Number Generation

| Rule ID | BR-INW-001 |
|---------|-------------|
| **Rule** | Every inward entry receives a sequential number: `INW/YYYY/NNNN`. |
| **Reset** | Resets to `0001` on January 1st each year. |
| **Uniqueness** | Unique constraint in database. Generated inside a transaction. |

### Rule 3.2 — Outward Number Generation

| Rule ID | BR-OUT-001 |
|---------|-------------|
| **Rule** | Every outward entry receives a sequential number: `OUT/YYYY/NNNN`. |
| **Reset** | Resets to `0001` on January 1st each year. |

### Rule 3.3 — Inward-Outward Linking

| Rule ID | BR-INW-002 |
|---------|-------------|
| **Rule** | An outward letter can optionally reference the inward entry it is replying to via `reference_inward_id`. |
| **Display** | When viewing an inward entry, show all linked outward replies. When viewing an outward, show the original inward. |
| **Validation** | `reference_inward_id` must point to a valid, existing inward entry. |

### Rule 3.4 — AI Letter Drafting

| Rule ID | BR-OUT-002 |
|---------|-------------|
| **Rule** | PA can request an AI-generated draft for outward letters. |
| **AI Provider** | Google Gemini API. |
| **Inputs** | Reference inward (if any), recipient department, subject, context/instructions, language (Marathi/English), tone (formal). |
| **Output** | Draft letter text in standard government format (सेवेशी, विषय, संदर्भ, body, signature block). |
| **Editable** | PA can edit the draft before finalizing. The `is_ai_drafted` flag is set to `true`. |
| **Cost** | AI calls use Gemini API free tier. Monitor usage to stay within limits. |

### Rule 3.5 — Outward Letter Signing & Approval

| Rule ID | BR-OUT-003 |
|---------|-------------|
| **Rule** | PA drafts the letter → attaches pre-uploaded MLA signature image → submits for MLA approval → MLA approves via system → letter is finalized as PDF. |
| **MLA Approval** | MLA receives a notification with the draft. MLA clicks "Approve" or "Reject with comments". |
| **Signature** | Pre-uploaded digital signature image stored in Cloudinary. PA selects it during finalization. |
| **PDF Generation** | After approval, system generates PDF with letterhead, body text, and signature image. |
| **Rejected** | If MLA rejects, PA gets notification with comments and must revise the draft. |

### Rule 3.6 — Tag-Based Organization

| Rule ID | BR-INW-003 |
|---------|-------------|
| **Rule** | Inward entries can have multiple tags (free-text) stored as a JSON array. |
| **Purpose** | Quick filtering and categorization (e.g., "MLALAD", "Water", "Urgent", "ZP"). |
| **Validation** | Tags are optional. Each tag is a string, max 50 characters. Max 10 tags per entry. |

---

## 4. Visitor Management Rules

### Rule 4.1 — Repeat Visitor Detection

| Rule ID | BR-VIS-001 |
|---------|-------------|
| **Rule** | When a visitor's mobile number is entered, the system checks for previous visits. |
| **Detection** | Query `visitors` table for `mobile = entered_mobile`. |
| **Display** | If found: show "Repeat Visitor" badge, previous visit count, last visit date and purpose. |
| **Auto-fill** | `is_repeat_visitor = true`, `previous_visit_count` is auto-calculated. |

### Rule 4.2 — Visitor-Nivedan Auto-Linking

| Rule ID | BR-VIS-002 |
|---------|-------------|
| **Rule** | When a visitor checks in with purpose `FOLLOWUP`, the system auto-suggests linking to an existing nivedan by matching the visitor's mobile number against `nivedans.citizen_mobile`. |
| **Behavior** | Show a dropdown of active nivedans for that mobile number. Receptionist confirms or skips the link. |
| **Linked** | If linked, `visitors.linked_nivedan_id` is set AND `nivedans.linked_visitor_id` is set. |
| **Not forced** | Receptionist can choose not to link. |

### Rule 4.3 — Auto Check-In Time

| Rule ID | BR-VIS-003 |
|---------|-------------|
| **Rule** | `check_in_time` is automatically set to `NOW()` on creation. |
| **Check-out** | `check_out_time` is manually entered by Receptionist when visitor leaves. |
| **Duration** | Frontend calculates and displays visit duration (check_out - check_in). |
| **Overnight** | If check_out is not set by midnight, ignore it (visitor left without checkout). |

### Rule 4.4 — Visitor-to-Nivedan Conversion

| Rule ID | BR-VIS-004 |
|---------|-------------|
| **Rule** | If a visitor arrives with a grievance, Receptionist can create a nivedan directly from the visitor form. |
| **Flow** | Visitor registered → click "Create Nivedan" → citizen name and mobile auto-filled from visitor data → nivedan created with `linked_visitor_id`. |
| **Auto-fill** | `citizen_name`, `citizen_mobile`, `citizen_address_line`, `village_id` / `ward_id` are pre-populated from visitor data. |

---

## 5. Development Works Rules

### Rule 5.1 — Budget Tracking

| Rule ID | BR-DEV-001 |
|---------|-------------|
| **Rule** | Each project has `budget_allocated` and `budget_spent`. |
| **Validation** | `budget_spent` must be ≤ `budget_allocated`. If PA tries to enter a spent amount that exceeds allocation, show a warning (but allow it — over-spending happens). |
| **Display** | Progress bar: `budget_spent / budget_allocated × 100%`. Color: Green (<80%), Yellow (80-100%), Red (>100%). |

### Rule 5.2 — Progress Percentage

| Rule ID | BR-DEV-002 |
|---------|-------------|
| **Rule** | `progress_percentage` is a manually entered value (0–100). |
| **Auto-update** | When status changes to `COMPLETED`, auto-set `progress_percentage = 100` and `actual_completion_date = NOW()`. |
| **Validation** | Must be 0–100. Cannot decrease unless correcting a data entry error. |

### Rule 5.3 — Geotagged Photos

| Rule ID | BR-DEV-003 |
|---------|-------------|
| **Rule** | Photos uploaded for a project must include GPS coordinates (latitude/longitude). |
| **Source** | From device GPS or EXIF data in the image file. |
| **Stage** | Each photo is tagged as `BEFORE`, `DURING`, or `AFTER`. |
| **Minimum** | At least 1 BEFORE photo should be uploaded when project starts (soft requirement — warning, not blocking). |
| **Verification** | Auditor can compare photo GPS with project location to verify authenticity. |

### Rule 5.4 — Delayed Project Detection

| Rule ID | BR-DEV-004 |
|---------|-------------|
| **Rule** | If `expected_completion_date` has passed and status is still `IN_PROGRESS`, the system auto-flags it as overdue. |
| **Trigger** | Weekly cron job (Monday morning). |
| **Action** | Notification to PA (WARNING severity). Status is NOT auto-changed to DELAYED — PA decides. |
| **Display** | "⚠️ Overdue by X days" badge on the project card. |

### Rule 5.5 — Status Transitions

| From | To | Valid | Notes |
|------|----|:---:|-------|
| SANCTIONED | IN_PROGRESS | ✅ | Work started |
| SANCTIONED | CANCELLED | ✅ | Project cancelled before start |
| IN_PROGRESS | COMPLETED | ✅ | Auto-sets progress=100, actual_completion_date=NOW() |
| IN_PROGRESS | DELAYED | ✅ | PA marks as delayed |
| IN_PROGRESS | CANCELLED | ✅ | Project abandoned |
| DELAYED | IN_PROGRESS | ✅ | Work resumed |
| DELAYED | COMPLETED | ✅ | Completed despite delay |
| DELAYED | CANCELLED | ✅ | Project abandoned |
| COMPLETED | (anything) | ❌ | Final state |
| CANCELLED | (anything) | ❌ | Final state |

---

## 6. Karyakarta (Party Worker) Rules

### Rule 6.1 — Unique Mobile Number

| Rule ID | BR-KAR-001 |
|---------|-------------|
| **Rule** | Each karyakarta must have a unique mobile number. Duplicate mobile returns `DUPLICATE_MOBILE` (409). |
| **Scope** | Unique across the entire `karyakartas` table (including deactivated workers). |

### Rule 6.2 — Booth Assignment

| Rule ID | BR-KAR-002 |
|---------|-------------|
| **Rule** | Every karyakarta must be assigned to exactly one booth (`booth_id` is required). |
| **Transfer** | To move a karyakarta to another booth, update `booth_id`. Previous booth assignment is not tracked (no history). |

### Rule 6.3 — Booth Pramukh Rules

| Rule ID | BR-KAR-003 |
|---------|-------------|
| **Rule** | Each booth can have **exactly one** active Booth Pramukh. |
| **Assignment** | PA selects a karyakarta and sets their `designation = BOOTH_PRAMUKH` AND updates `booths.booth_pramukh_id`. |
| **Replacement** | If a new Booth Pramukh is assigned, the previous one's designation reverts to `KARYAKARTA`. |
| **Validation** | Cannot set booth_pramukh_id to a karyakarta from a different booth. |

### Rule 6.4 — Birthday Greeting

| Rule ID | BR-KAR-004 |
|---------|-------------|
| **Rule** | Workers with `date_of_birth` set and `is_active = true` receive a WhatsApp birthday greeting on their birthday. |
| **Trigger** | Daily cron at 8:00 AM IST. |
| **Query** | `WHERE MONTH(date_of_birth) = MONTH(NOW()) AND DAY(date_of_birth) = DAY(NOW()) AND is_active = true`. |
| **Template** | `birthday_greeting` — includes name and MLA name. |

### Rule 6.5 — Deactivation (Soft Delete)

| Rule ID | BR-KAR-005 |
|---------|-------------|
| **Rule** | Karyakartas are deactivated by setting `is_active = false`. They are not deleted. |
| **Effect** | Deactivated workers are excluded from lists (default filter: `is_active = true`), birthday greetings, and booth worker counts. |
| **Booth Pramukh** | If the deactivated karyakarta is a Booth Pramukh, `booths.booth_pramukh_id` is set to NULL. |
| **Reactivation** | PA can set `is_active = true` to reactivate a worker. |

### Rule 6.6 — Bulk Import Validation

| Rule ID | BR-KAR-006 |
|---------|-------------|
| **Rule** | Excel import validates each row independently. Valid rows are imported; invalid rows are skipped with error details. |
| **Validations** | Mobile (10 digits, unique), booth_number (must exist), designation (must match enum). |
| **Response** | `{ totalRows, imported, skipped, errors: [{ row, field, error }] }`. |
| **Partial success** | Import is NOT all-or-nothing. Each valid row is committed individually. |

---

## 7. Booth Management Rules

### Rule 7.1 — Verification Process

| Rule ID | BR-BTH-001 |
|---------|-------------|
| **Rule** | Field Auditors visit booths and submit verification reports with a checklist, comments, and geotagged photos. |
| **Checklist** | 10-item checklist (from MASTER_DATA.md). Each item is Yes/No or Yes/No/Partial. |
| **Status Mapping** | If all items = Yes → `FULLY_VERIFIED`. If any = No → `NOT_VERIFIED`. If any = Partial → `PARTIALLY_VERIFIED`. |
| **Multiple** | A booth can be verified multiple times. Each verification is a separate record. The latest verification determines the booth's `verification_status`. |

### Rule 7.2 — Booth Statistics

| Rule ID | BR-BTH-002 |
|---------|-------------|
| **Rule** | Booth detail page shows computed statistics. |
| **Stats** | Total workers, active workers, Booth Pramukh name, total voters, verification status, last verification date, complaints from this booth area. |

---

## 8. WhatsApp & Communication Rules

### Rule 8.1 — Message Queue Processing

| Rule ID | BR-WA-001 |
|---------|-------------|
| **Rule** | WhatsApp messages are not sent immediately. They are inserted into `whatsapp_logs` with `delivery_status = QUEUED` and processed by a background worker. |
| **Batch Size** | 10 messages per batch. |
| **Interval** | Every 30 seconds. |
| **Rate Limit** | Respects Meta API rate limits (80 messages/second for business accounts). |

### Rule 8.2 — Retry & Fallback

| Rule ID | BR-WA-002 |
|---------|-------------|
| **Rule** | If a WhatsApp message fails, the system retries up to **2 times**. |
| **Retry Delay** | 1st retry: 5 minutes later. 2nd retry: 30 minutes later. |
| **Fallback** | After 2 failed retries, if SMS gateway is configured, send SMS as fallback. Set `sms_fallback_sent = true`. |
| **Notification** | PA is notified of persistent delivery failures via in-app notification (WARNING severity). |

### Rule 8.3 — Delivery Status Tracking

| Rule ID | BR-WA-003 |
|---------|-------------|
| **Rule** | The system tracks WhatsApp delivery status via Meta webhook callbacks. |
| **Statuses** | `QUEUED → SENT → DELIVERED → READ` (or `FAILED` at any point). |
| **Webhook** | `POST /api/v1/whatsapp/webhook` — signature verified before processing. |

### Rule 8.4 — Inbound Bot (Citizen Status Check)

| Rule ID | BR-WA-004 |
|---------|-------------|
| **Rule** | Citizens can WhatsApp a tracking ID to check their complaint status. The bot auto-replies with current status. |
| **Valid Input** | Message matching pattern `NIV-YYYY-NNNNN` (case-insensitive). |
| **Bot Reply** | Tracking ID, current status (Marathi), department name, last action date. |
| **Invalid Input** | Bot replies with help text: "कृपया आपला ट्रॅकिंग आयडी पाठवा. उदा: NIV-2026-00001". |
| **Not Found** | "ट्रॅकिंग आयडी {{id}} सापडला नाही. कृपया आयडी तपासून पुन्हा पाठवा." |

### Rule 8.5 — Booth Pramukh Access

| Rule ID | BR-WA-005 |
|---------|-------------|
| **Rule** | Booth Pramukh can WhatsApp a tracking ID to check nivedan status via the bot (same as citizen). |
| **No web access** | Booth Pramukh has no web system login. Their only interaction is via WhatsApp. |
| **Receives** | Birthday greetings, festival greetings, event invitations, broadcast messages. |
| **Cannot** | Cannot submit new complaints via WhatsApp. Complaints must be submitted through the office. |

### Rule 8.6 — Broadcast Rules

| Rule ID | BR-WA-006 |
|---------|-------------|
| **Rule** | PA can send broadcast messages to filtered audiences. |
| **Audience Types** | All karyakartas, specific booth workers, specific village/ward workers, all active karyakartas, custom list. |
| **Templates** | Festival greeting, event invitation, custom broadcast. |
| **Scheduling** | Can be scheduled for a future date/time or sent immediately. |
| **Limit** | Max 5 broadcasts per hour (rate limited). |

### Rule 8.7 — Birthday Greeting for Citizens

| Rule ID | BR-WA-007 |
|---------|-------------|
| **Rule** | Citizens who provided their `date_of_birth` when filing a nivedan also receive birthday greetings. |
| **Trigger** | Same daily cron at 8:00 AM IST. |
| **Deduplication** | If the same mobile number appears in multiple nivedans, send only ONE greeting. |
| **Template** | Same `birthday_greeting` template as karyakartas. |

---

## 9. Calendar & Event Rules

### Rule 9.1 — Event Creation

| Rule ID | BR-CAL-001 |
|---------|-------------|
| **Rule** | MLA and PA can create calendar events. |
| **Types** | `MEETING`, `PUBLIC_PROGRAM`, `GOVT_DEADLINE`, `ASSEMBLY_SESSION`, `CONSTITUENCY_VISIT`, `PERSONAL`. |
| **Attendees** | Optional list of user IDs who should be notified. |

### Rule 9.2 — Reminder Notifications

| Rule ID | BR-CAL-002 |
|---------|-------------|
| **Rule** | Event reminders are sent `reminder_minutes` before the event. |
| **Default** | 30 minutes before. |
| **Delivery** | In-app notification to all attendees. |
| **Trigger** | Cron job runs every 5 minutes, checks for events starting within the next `reminder_minutes`. |

### Rule 9.3 — Cancellation (Soft Delete)

| Rule ID | BR-CAL-003 |
|---------|-------------|
| **Rule** | Cancelled events set `is_cancelled = true`. They remain visible in the calendar view with a "Cancelled" badge and strikethrough text. |

---

## 10. Dashboard & Reporting Rules

### Rule 10.1 — Dashboard Data Freshness

| Rule ID | BR-DASH-001 |
|---------|-------------|
| **Rule** | Dashboard KPI counters are calculated in real-time (not cached). |
| **Rationale** | Data volume is small enough (200-500 MB/year) that real-time queries are fast. |
| **Future** | If performance degrades, implement materialized view or Redis cache. |

### Rule 10.2 — Report Filters

| Rule ID | BR-RPT-001 |
|---------|-------------|
| **Rule** | All reports support date range filtering. Default range is current month. |
| **Max Range** | 1 year per report generation. For longer periods, generate multiple reports. |
| **Formats** | PDF (formatted) and Excel (raw data). |

### Rule 10.3 — Data Scoping in Reports

| Rule ID | BR-RPT-002 |
|---------|-------------|
| **Rule** | MLA sees all data in reports. PA sees all data. Receptionist and Auditor cannot access reports. Admin cannot access operational reports. |
| **Export** | Every report generation is logged in `audit_logs` (action=EXPORT). |

### Rule 10.4 — Area-Wise Analysis

| Rule ID | BR-RPT-003 |
|---------|-------------|
| **Rule** | Area analysis report aggregates complaints, visitors, dev works by village/ward. |
| **Purpose** | Identify which areas have the most complaints, track development work distribution, monitor response times per area. |

---

## 11. User Management Rules

### Rule 11.1 — Password Policy

| Rule ID | BR-USR-001 |
|---------|-------------|
| **Rule** | Minimum 8 characters, at least 1 uppercase letter, at least 1 number. |
| **Rotation** | Password must be changed every 90 days. |
| **History** | Cannot reuse last 3 passwords. |
| **First Login** | Temporary password triggers mandatory change. |
| **Reset** | Only System Admin can reset passwords. No self-service forgot password. |

### Rule 11.2 — Account Lockout

| Rule ID | BR-USR-002 |
|---------|-------------|
| **Rule** | 5 consecutive failed login attempts within 15 minutes lock the account. |
| **Unlock** | Auto-unlock after 15 minutes OR Admin manually unlocks. |
| **Notification** | Admin receives in-app notification when an account is locked. |

### Rule 11.3 — Deactivation vs Deletion

| Rule ID | BR-USR-003 |
|---------|-------------|
| **Rule** | Users are deactivated (`is_active = false`), never deleted. |
| **Effect** | Deactivated users cannot login. Their historical records remain linked. |
| **RESTRICT** | Cannot deactivate a user if they have active assigned nivedans. Must reassign first. |

### Rule 11.4 — Module Access Control

| Rule ID | BR-USR-004 |
|---------|-------------|
| **Rule** | Each user has an `accessible_modules` JSON array. The sidebar and routes are filtered based on this. |
| **Default** | Modules are auto-set based on role (see Role-Permission matrix in AUTH_SPEC.md). |
| **Override** | Admin can add or remove specific modules for a user. |

---

## 12. Upload & File Rules

### Rule 12.1 — File Size Limits

| Rule ID | BR-UPL-001 |
|---------|-------------|
| **Rule** | Maximum file size: **10 MB** per file. |
| **Allowed Types** | PDF, JPG, JPEG, PNG, DOC, DOCX, XLS, XLSX. |
| **Upload Strategy** | Files < 2 MB: direct upload to Cloudinary from frontend. Files ≥ 2 MB: upload via backend proxy. |

### Rule 12.2 — Cloudinary Organization

| Rule ID | BR-UPL-002 |
|---------|-------------|
| **Rule** | Files are organized in Cloudinary folders. |
| **Structure** | `mla-eoffice/{module}/{year}/{entity_id}/{filename}` |
| **Examples** | `mla-eoffice/nivedans/2026/143/complaint_doc.pdf`, `mla-eoffice/devworks/2026/28/before_photo1.jpg` |

### Rule 12.3 — Attachment Limits

| Rule ID | BR-UPL-003 |
|---------|-------------|
| **Rule** | Maximum **5 attachments** per nivedan, inward entry, or outward entry. |
| **Dev Work Photos** | No limit on photos per project (practical limit ~50). |
| **Profile Photos** | 1 per user/karyakarta. New upload replaces old. |

---

## 13. Search Rules

### Rule 13.1 — Global Search

| Rule ID | BR-SRC-001 |
|---------|-------------|
| **Rule** | Global search searches across multiple tables: nivedans, inward_entries, visitors, karyakartas, development_works. |
| **Method** | MySQL FULLTEXT search in BOOLEAN MODE. |
| **Results** | Returns top 5 results per entity type, grouped by type. |
| **Role Scoping** | Search results are filtered by role permissions (Receptionist sees only own nivedans). |

### Rule 13.2 — Search Fields

| Entity | Searchable Fields |
|--------|------------------|
| Nivedans | `citizen_name`, `subject`, `tracking_id` |
| Inward | `sender_name`, `subject`, `inward_number` |
| Visitors | `visitor_name` |
| Karyakartas | `full_name`, `mobile` |
| Dev Works | `project_name` |

### Rule 13.3 — Minimum Query Length

| Rule ID | BR-SRC-002 |
|---------|-------------|
| **Rule** | Search query must be at least **2 characters** long. |
| **Rationale** | Single-character searches return too many results and strain the database. |

---

## 14. Notification Rules

### Rule 14.1 — Notification Triggers

| Event | Recipient | Severity | Type |
|-------|-----------|----------|------|
| New nivedan created | PA | INFO | NIVEDAN |
| Nivedan resolved | MLA | INFO | NIVEDAN |
| Nivedan escalated (Level 1) | PA | WARNING | ESCALATION |
| Nivedan escalated (Level 2) | MLA + PA | CRITICAL | ESCALATION |
| WhatsApp delivery failed (permanent) | PA | WARNING | WHATSAPP |
| Calendar event reminder | Attendees | INFO | CALENDAR |
| Account locked | Admin | WARNING | SYSTEM |
| Password expiry (7 days before) | User | WARNING | SYSTEM |
| PA delegates permissions | MLA | INFO | SYSTEM |
| Dev work overdue | PA | WARNING | DEVWORK |
| New inward received (HIGH priority) | PA | INFO | INWARD |

### Rule 14.2 — Notification Lifecycle

| Rule ID | BR-NOT-001 |
|---------|-------------|
| **Rule** | Notifications are created as `is_read = false`. User marks as read manually or via "Mark all as read". |
| **Retention** | Notifications are never deleted. Old notifications remain accessible. |
| **Badge** | Frontend header shows unread count badge (real-time via polling every 30 seconds). |

---

## 15. Edge Cases & Error Handling

### EC-1: Concurrent Nivedan Creation (Race Condition)

| Scenario | Two receptionists create nivedans simultaneously |
|----------|--------------------------------------------------|
| **Risk** | Duplicate tracking IDs generated |
| **Solution** | Use `SELECT MAX(id) ... FOR UPDATE` inside a database transaction. Sequelize transaction with `SERIALIZABLE` isolation. |

### EC-2: WhatsApp API Down

| Scenario | Meta WhatsApp Cloud API is unreachable |
|----------|----------------------------------------|
| **Risk** | Messages stuck in QUEUED state |
| **Solution** | Retry queue continues attempting. After 24 hours of failure, mark as FAILED. PA receives CRITICAL notification "WhatsApp service is down". |

### EC-3: Cloudinary Upload Failure

| Scenario | File upload fails (network issue, quota exceeded) |
|----------|--------------------------------------------------|
| **Risk** | Nivedan/inward created without attachment |
| **Solution** | Return `CLOUDINARY_UPLOAD_FAILED` error. Do not save the nivedan. User must retry. |

### EC-4: Citizen Files Nivedan then Changes Mobile

| Scenario | Citizen's WhatsApp number changes after filing |
|----------|------------------------------------------------|
| **Risk** | Status updates go to old number |
| **Solution** | No self-service mobile update. PA can update `citizen_mobile` on the nivedan. WhatsApp logs continue to old number — new messages go to updated number. |

### EC-5: Booth Pramukh Replaced

| Scenario | New Booth Pramukh assigned to a booth |
|----------|---------------------------------------|
| **Risk** | Old pramukh retains designation in karyakarta record |
| **Solution** | System auto-changes old pramukh's designation from `BOOTH_PRAMUKH` to `KARYAKARTA`. Only one active pramukh per booth at any time. |

### EC-6: Year Rollover (Jan 1st)

| Scenario | System crosses year boundary |
|----------|------------------------------|
| **Risk** | ID counters should reset |
| **Solution** | ID generation queries use `WHERE YEAR(created_at) = YEAR(NOW())`. On Jan 1st, MAX returns NULL → first ID becomes 00001. |

### EC-7: Large Excel Import (5000+ Rows)

| Scenario | PA uploads 5000 karyakartas at once |
|----------|--------------------------------------|
| **Risk** | Request timeout, memory exhaustion |
| **Solution** | Process import asynchronously. Return immediately with `{ status: "PROCESSING", jobId }`. Send notification when complete. Max 10,000 rows per import. |

### EC-8: Same Citizen, Different Names

| Scenario | Citizen files as "Ram Shinde" then "R. S. Shinde" with same mobile |
|----------|----------------------------------------------------------------------|
| **Risk** | History lookup finds records but names don't match |
| **Solution** | Citizen history is linked by **mobile number only**, not by name. The form auto-fills the most recently used name but allows editing. |

### EC-9: PA on Leave, No Delegation Set

| Scenario | PA is absent and didn't delegate |
|----------|----------------------------------|
| **Risk** | No one can change nivedan statuses |
| **Solution** | MLA can request Admin to temporarily elevate a staff member's role. Admin can edit `accessible_modules` to grant temporary PA-level access. All such changes are audit-logged. |

### EC-10: Server Restart During Cron Job

| Scenario | Server restarts while escalation cron is running |
|----------|--------------------------------------------------|
| **Risk** | Some nivedans might get double-escalated or skipped |
| **Solution** | Cron job is idempotent — it checks current `escalation_level` before updating. Running it twice produces the same result. |

---

## 16. Business Rule Quick Reference

| ID | Category | Rule Summary |
|----|----------|-------------|
| BR-CORE-001 | Core | No physical deletion — soft delete only |
| BR-CORE-002 | Core | Audit trail on every mutation |
| BR-CORE-003 | Core | UTC storage, IST display |
| BR-CORE-004 | Core | Bilingual (English + Marathi) master data |
| BR-NIV-001 | Nivedan | Tracking ID: NIV-YYYY-NNNNN (resets yearly) |
| BR-NIV-002 | Nivedan | Auto-route by category → department |
| BR-NIV-003 | Nivedan | Status transitions enforced (state machine) |
| BR-NIV-004 | Nivedan | Auto-escalation: Level 1 → Level 2 |
| BR-NIV-005 | Nivedan | Auto-archive after 90 days of resolution |
| BR-NIV-006 | Nivedan | Duplicate detection (warn, don't block) |
| BR-NIV-007 | Nivedan | Citizen history by mobile, 3+ active = warning badge |
| BR-NIV-008 | Nivedan | Simple text receipt (no QR) |
| BR-NIV-009 | Nivedan | WhatsApp acknowledgment on creation |
| BR-NIV-010 | Nivedan | All default MEDIUM priority, PA overrides |
| BR-INW-001 | Inward | Number: INW/YYYY/NNNN (resets yearly) |
| BR-OUT-001 | Outward | Number: OUT/YYYY/NNNN (resets yearly) |
| BR-INW-002 | Inward | Inward-outward linking |
| BR-OUT-002 | Outward | AI draft via Gemini API |
| BR-OUT-003 | Outward | MLA approval + digital signature |
| BR-INW-003 | Inward | Free-text tags (max 10) |
| BR-VIS-001 | Visitor | Repeat visitor detection by mobile |
| BR-VIS-002 | Visitor | Auto-suggest nivedan link on followup |
| BR-VIS-003 | Visitor | Auto check-in time |
| BR-VIS-004 | Visitor | Visitor → nivedan conversion |
| BR-DEV-001 | DevWorks | Budget: allocated vs spent |
| BR-DEV-002 | DevWorks | Progress 0-100, auto-set on completion |
| BR-DEV-003 | DevWorks | Geotagged photos (Before/During/After) |
| BR-DEV-004 | DevWorks | Overdue project detection |
| BR-KAR-001 | Karyakarta | Unique mobile number |
| BR-KAR-002 | Karyakarta | Mandatory booth assignment |
| BR-KAR-003 | Karyakarta | One Booth Pramukh per booth |
| BR-KAR-004 | Karyakarta | Birthday greeting via WhatsApp |
| BR-KAR-005 | Karyakarta | Deactivation (soft delete) |
| BR-KAR-006 | Karyakarta | Bulk import with partial success |
| BR-BTH-001 | Booth | Multi-verification, latest determines status |
| BR-BTH-002 | Booth | Computed statistics |
| BR-WA-001 | WhatsApp | Queue processing (batch 10, every 30s) |
| BR-WA-002 | WhatsApp | 2 retries + SMS fallback |
| BR-WA-003 | WhatsApp | Delivery status tracking via webhook |
| BR-WA-004 | WhatsApp | Citizen bot: tracking ID → status reply |
| BR-WA-005 | WhatsApp | Booth Pramukh: status check only |
| BR-WA-006 | WhatsApp | Broadcast: max 5/hour, audience filtering |
| BR-WA-007 | WhatsApp | Citizen birthday greetings (deduped) |
| BR-CAL-001 | Calendar | Event types, attendees |
| BR-CAL-002 | Calendar | Reminder X minutes before |
| BR-CAL-003 | Calendar | Soft cancel (badge, not delete) |
| BR-DASH-001 | Dashboard | Real-time KPIs (no cache) |
| BR-RPT-001 | Reports | Date range filters, 1-year max |
| BR-RPT-002 | Reports | Role-scoped access |
| BR-RPT-003 | Reports | Area-wise aggregation |
| BR-USR-001 | User | Password: 8 chars, 1 upper, 1 digit, 90-day rotation |
| BR-USR-002 | User | Lockout: 5 attempts / 15 min |
| BR-USR-003 | User | Deactivate, never delete |
| BR-USR-004 | User | Module access via JSON array |
| BR-UPL-001 | Upload | Max 10 MB, PDF/JPG/PNG/DOC/XLS |
| BR-UPL-002 | Upload | Cloudinary folder structure |
| BR-UPL-003 | Upload | Max 5 attachments per entity |
| BR-SRC-001 | Search | Global FULLTEXT, 5 results per type |
| BR-SRC-002 | Search | Min 2-character query |
| BR-NOT-001 | Notification | Never deleted, badge with unread count |

**Total: 55 business rules documented.**

---
