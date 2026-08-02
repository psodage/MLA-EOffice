# MLA E-Office — Entity-Relationship Diagrams

> **Visual Database Relationship Maps — Organized by Module, with Data Flow Diagrams**
> 
> *Related Documents:* [DATA_MODELS.md](file:///s:/MLA%20E%20-%20Office/DATA_MODELS.md) | [ARCHITECTURE.md](file:///s:/MLA%20E%20-%20Office/ARCHITECTURE.md) | [PROJECT_SECTIONS_BREAKDOWN.md](file:///s:/MLA%20E%20-%20Office/PROJECT_SECTIONS_BREAKDOWN.md)

---

## 1. Database Summary

| Metric | Value |
|--------|-------|
| **Total Tables** | 22 |
| **Operational Tables** | 13 |
| **Lookup / Master Tables** | 9 |
| **Total Relationships** | 40+ foreign keys |
| **Engine** | MySQL 8.x |
| **ORM** | Sequelize v6 |

---

## 2. Full System Overview

> This is the complete high-level view showing all 22 tables and their primary connections. Detailed per-module diagrams follow below.

```mermaid
erDiagram
    users {
        int id PK
        string full_name
        string username UK
        enum role
        boolean is_active
    }

    inward_entries {
        int id PK
        string inward_number UK
        date date_received
        string subject
        enum status
        int created_by FK
        int assigned_to_user_id FK
    }

    outward_entries {
        int id PK
        string outward_number UK
        date date_sent
        string subject
        boolean is_ai_drafted
        int reference_inward_id FK
        int created_by FK
    }

    nivedans {
        int id PK
        string tracking_id UK
        string citizen_name
        string citizen_mobile
        enum status
        enum priority
        int category_id FK
        int assigned_to_user_id FK
        int village_id FK
        int ward_id FK
    }

    nivedan_timeline {
        int id PK
        int nivedan_id FK
        enum action_type
        string note
        int performed_by FK
    }

    visitors {
        int id PK
        string visitor_name
        string mobile
        enum purpose
        int linked_nivedan_id FK
        int created_by FK
    }

    development_works {
        int id PK
        string project_name
        enum category
        enum status
        decimal budget_allocated
        decimal budget_spent
        int village_id FK
        int ward_id FK
    }

    dev_work_photos {
        int id PK
        int development_work_id FK
        string photo_url
        enum photo_stage
    }

    karyakartas {
        int id PK
        string full_name
        string mobile UK
        enum designation
        boolean is_active
        int booth_id FK
        int village_id FK
    }

    booths {
        int id PK
        int booth_number UK
        int total_voters
        int booth_pramukh_id FK
        int village_id FK
        int ward_id FK
    }

    booth_verifications {
        int id PK
        int booth_id FK
        int verified_by FK
        enum verification_status
    }

    categories {
        int id PK
        string name_en
        string name_mr
        string code UK
        int parent_id FK
        int default_department_id FK
        int escalation_days
    }

    departments {
        int id PK
        string name_en
        string name_mr
        string short_code UK
    }

    talukas {
        int id PK
        string name_en
        string name_mr
    }

    gram_panchayats {
        int id PK
        string name_en
        int taluka_id FK
    }

    villages {
        int id PK
        string name_en
        int gram_panchayat_id FK
    }

    wards {
        int id PK
        int ward_number UK
        string name_en
    }

    calendar_events {
        int id PK
        string title
        enum event_type
        date event_date
        boolean is_cancelled
        int created_by FK
    }

    whatsapp_logs {
        int id PK
        string recipient_mobile
        enum message_type
        enum delivery_status
        enum linked_entity_type
        int linked_entity_id
    }

    notifications {
        int id PK
        int user_id FK
        string title
        enum type
        boolean is_read
    }

    audit_logs {
        int id PK
        int user_id FK
        enum action
        string module
        string entity_type
        int entity_id
    }

    delegations {
        int id PK
        int delegated_by FK
        int delegated_to FK
        boolean is_active
    }

    users ||--o{ inward_entries : "creates / assigned"
    users ||--o{ outward_entries : "creates"
    users ||--o{ nivedans : "creates / assigned"
    users ||--o{ visitors : "creates"
    users ||--o{ development_works : "creates"
    users ||--o{ nivedan_timeline : "performs"
    users ||--o{ notifications : "receives"
    users ||--o{ audit_logs : "generates"
    users ||--o{ calendar_events : "creates"
    users ||--o{ delegations : "delegates"

    inward_entries ||--o{ outward_entries : "reference"
    departments ||--o{ inward_entries : "sender"
    departments ||--o{ outward_entries : "recipient"
    departments ||--o{ nivedans : "forwarded_to"

    categories ||--o{ nivedans : "categorizes"
    categories ||--o{ categories : "sub-categories"
    categories }o--|| departments : "default_routing"

    nivedans ||--o{ nivedan_timeline : "history"
    nivedans ||--o| visitors : "linked"

    development_works ||--o{ dev_work_photos : "has"

    booths ||--o{ karyakartas : "has workers"
    booths ||--o{ booth_verifications : "verified"
    karyakartas ||--o| booths : "pramukh_of"

    talukas ||--o{ gram_panchayats : "contains"
    gram_panchayats ||--o{ villages : "contains"
    villages ||--o{ booths : "has"
    wards ||--o{ booths : "has"

    villages ||--o{ nivedans : "location"
    wards ||--o{ nivedans : "location"
    villages ||--o{ karyakartas : "location"
    villages ||--o{ development_works : "location"
```

---

## 3. Module-Wise ER Diagrams

### 3A. Inward & Outward Module

```mermaid
erDiagram
    users {
        int id PK
        string full_name
        enum role
    }

    departments {
        int id PK
        string name_en
        string short_code UK
    }

    inward_entries {
        int id PK
        string inward_number UK "INW/2026/0001"
        date date_received
        string sender_name
        string subject
        enum priority "HIGH | MEDIUM | LOW"
        enum status "PENDING | ASSIGNED | IN_PROGRESS | COMPLETED | CANCELLED"
        json attachment_urls
        json tags
        int sender_department_id FK
        int assigned_to_user_id FK
        int created_by FK
    }

    outward_entries {
        int id PK
        string outward_number UK "OUT/2026/0001"
        date date_sent
        string recipient_name
        string subject
        text body_text
        string letter_pdf_url
        boolean is_ai_drafted
        int recipient_department_id FK
        int reference_inward_id FK
        int approved_by FK
        int created_by FK
    }

    departments ||--o{ inward_entries : "sender_department"
    departments ||--o{ outward_entries : "recipient_department"
    users ||--o{ inward_entries : "created_by"
    users ||--o{ inward_entries : "assigned_to"
    users ||--o{ outward_entries : "created_by"
    users ||--o{ outward_entries : "approved_by"
    inward_entries ||--o{ outward_entries : "reference_inward (reply to)"
```

**Key Relationships:**
- One inward can have **multiple outward replies** (1:N)
- Each inward is created by a **Receptionist or PA** and optionally assigned to a **staff member**
- Outward letters can reference the **inward entry** they are replying to
- Both link to the **departments** master table for sender/recipient classification

---

### 3B. Nivedan (Complaint) Module

```mermaid
erDiagram
    users {
        int id PK
        string full_name
        enum role
    }

    categories {
        int id PK
        string name_en
        string code UK
        int parent_id FK "self-ref for sub-categories"
        int default_department_id FK
        int escalation_days
        enum default_priority
    }

    departments {
        int id PK
        string name_en
        string short_code
    }

    villages {
        int id PK
        string name_en
    }

    wards {
        int id PK
        int ward_number
    }

    visitors {
        int id PK
        string visitor_name
        string mobile
    }

    nivedans {
        int id PK
        string tracking_id UK "NIV-2026-00001"
        string citizen_name
        string citizen_mobile
        string citizen_address_line
        string citizen_city
        string citizen_pincode
        date citizen_dob "optional"
        string subject
        text description
        enum status "PENDING | IN_PROGRESS | FORWARDED | AWAITING_RESPONSE | RESOLVED | REJECTED | CANCELLED | ARCHIVED"
        enum priority "HIGH | MEDIUM | LOW"
        enum escalation_level "NONE | LEVEL_1 | LEVEL_2"
        json attachment_urls
        text resolution_notes
        int category_id FK
        int sub_category_id FK
        int village_id FK
        int ward_id FK
        int taluka_id FK
        int assigned_to_user_id FK
        int department_forwarded_to_id FK
        int linked_visitor_id FK
        int created_by FK
    }

    nivedan_timeline {
        int id PK
        int nivedan_id FK
        enum action_type "CREATED | STATUS_CHANGE | ASSIGNED | FORWARDED | NOTE_ADDED | WHATSAPP_SENT | ESCALATED | RESOLVED"
        string old_status
        string new_status
        text note "internal staff comment"
        boolean is_internal
        int assigned_to_user_id FK
        int department_id FK
        int performed_by FK
        datetime created_at
    }

    whatsapp_logs {
        int id PK
        string recipient_mobile
        enum message_type
        enum delivery_status
    }

    notifications {
        int id PK
        int user_id FK
        string title
        enum type
    }

    categories ||--o{ nivedans : "category"
    categories ||--o{ nivedans : "sub_category"
    categories ||--o{ categories : "parent (sub-categories)"
    categories }o--|| departments : "default_department (auto-route)"
    departments ||--o{ nivedans : "forwarded_to"
    villages ||--o{ nivedans : "location"
    wards ||--o{ nivedans : "location"
    users ||--o{ nivedans : "created_by"
    users ||--o{ nivedans : "assigned_to"
    visitors ||--o| nivedans : "linked_visitor"
    nivedans ||--o{ nivedan_timeline : "activity_history"
    users ||--o{ nivedan_timeline : "performed_by"
    nivedans ||--o{ whatsapp_logs : "triggers_messages"
    nivedans ||--o{ notifications : "triggers_alerts"
```

**Key Relationships:**
- Each nivedan belongs to a **category** which has a **default department** for auto-routing
- Categories are **self-referencing** (parent → sub-categories)
- Each nivedan has a **timeline** of activity entries (append-only log)
- A nivedan can be **linked to a visitor** entry (1:1 optional)
- Multiple nivedans from the same citizen are linked by **citizen_mobile** (no FK, query-based)
- Status changes trigger **WhatsApp messages** and **in-app notifications**

---

### 3C. Development Works Module

```mermaid
erDiagram
    users {
        int id PK
        string full_name
    }

    villages {
        int id PK
        string name_en
    }

    wards {
        int id PK
        int ward_number
    }

    development_works {
        int id PK
        string project_name
        enum category "ROAD | DRAINAGE | WATER_PIPELINE | HOSPITAL | SCHOOL | ..."
        string location
        enum funding_source "MLALAD | ZP_FUND | STATE_GRANT | ..."
        decimal budget_allocated "INR"
        decimal budget_spent "INR"
        string contractor_name
        date start_date
        date expected_completion_date
        date actual_completion_date
        enum status "SANCTIONED | IN_PROGRESS | COMPLETED | DELAYED | CANCELLED"
        int progress_percentage "0-100"
        decimal geo_latitude
        decimal geo_longitude
        int village_id FK
        int ward_id FK
        int created_by FK
    }

    dev_work_photos {
        int id PK
        int development_work_id FK
        string photo_url "Cloudinary"
        string thumbnail_url
        enum photo_stage "BEFORE | DURING | AFTER"
        decimal geo_latitude
        decimal geo_longitude
        string caption
        boolean is_active
        int uploaded_by FK
    }

    villages ||--o{ development_works : "location"
    wards ||--o{ development_works : "location"
    users ||--o{ development_works : "created_by"
    development_works ||--o{ dev_work_photos : "has_photos"
    users ||--o{ dev_work_photos : "uploaded_by"
```

**Key Relationships:**
- Each development work has **many geotagged photos** categorized as Before/During/After (1:N)
- Projects are linked to **village or ward** for area-wise reporting
- Photos store **GPS coordinates** independently for location verification
- Budget is tracked with simple `allocated` vs `spent` columns

---

### 3D. Cadre Network Module (Karyakarta + Booth)

```mermaid
erDiagram
    users {
        int id PK
        string full_name
    }

    talukas {
        int id PK
        string name_en
        string name_mr
    }

    gram_panchayats {
        int id PK
        string name_en
        int taluka_id FK
    }

    villages {
        int id PK
        string name_en
        int gram_panchayat_id FK
    }

    wards {
        int id PK
        int ward_number UK
        string name_en
        string city_name
    }

    booths {
        int id PK
        int booth_number UK
        string booth_name
        string location_address
        int total_voters
        enum verification_status "NOT_VERIFIED | PARTIALLY_VERIFIED | FULLY_VERIFIED"
        int village_id FK
        int ward_id FK
        int gram_panchayat_id FK
        int booth_pramukh_id FK "→ karyakartas"
    }

    karyakartas {
        int id PK
        string full_name
        string mobile UK
        date date_of_birth
        enum designation "BOOTH_PRAMUKH | WARD_HEAD | SHAKTI_KENDRA | KARYAKARTA | VOLUNTEER | OTHER"
        boolean is_active
        int booth_id FK
        int village_id FK
        int ward_id FK
        int gram_panchayat_id FK
        int taluka_id FK
        int created_by FK
    }

    booth_verifications {
        int id PK
        int booth_id FK
        int verified_by FK "→ users (Auditor)"
        enum verification_status
        json checklist_results
        text comments
        json photo_urls
        datetime verified_at
    }

    talukas ||--o{ gram_panchayats : "contains"
    gram_panchayats ||--o{ villages : "contains"
    villages ||--o{ booths : "has_booths"
    wards ||--o{ booths : "has_booths"
    booths ||--o{ karyakartas : "has_workers"
    karyakartas ||--o| booths : "pramukh_of"
    karyakartas }o--|| villages : "resides_in"
    karyakartas }o--|| wards : "resides_in"
    karyakartas }o--|| gram_panchayats : "belongs_to"
    karyakartas }o--|| talukas : "belongs_to"
    booths ||--o{ booth_verifications : "verified_by"
    users ||--o{ booth_verifications : "auditor"
    users ||--o{ karyakartas : "created_by"
```

**Key Relationships:**
- **Geographical Hierarchy:** Taluka → Gram Panchayat → Village → Booth (rural) OR City → Ward → Booth (urban)
- Each booth has **many workers** (1:N) and **one Booth Pramukh** (1:1 via `booth_pramukh_id`)
- Each booth can be **verified multiple times** by different auditors
- Workers are linked to both their **booth** and their **geographical location** (village/ward)

---

### 3E. Automation & Intelligence Module (WhatsApp + Notifications + Audit)

```mermaid
erDiagram
    users {
        int id PK
        string full_name
        enum role
    }

    nivedans {
        int id PK
        string tracking_id
        string citizen_mobile
    }

    karyakartas {
        int id PK
        string full_name
        string mobile
    }

    calendar_events {
        int id PK
        string title
        enum event_type "MEETING | PUBLIC_PROGRAM | GOVT_DEADLINE | ASSEMBLY_SESSION | CONSTITUENCY_VISIT | PERSONAL"
        date event_date
        time start_time
        json attendees "array of user IDs"
        boolean is_cancelled
        int created_by FK
    }

    whatsapp_logs {
        int id PK
        string recipient_mobile
        enum direction "OUTBOUND | INBOUND"
        enum message_type "NIVEDAN_ACK | NIVEDAN_UPDATE | NIVEDAN_RESOLVED | BIRTHDAY | FESTIVAL | EVENT_INVITE | BROADCAST | BOT_REPLY | INBOUND_QUERY"
        string template_name
        json template_params
        text message_body
        enum delivery_status "QUEUED | SENT | DELIVERED | READ | FAILED"
        string meta_message_id
        int retry_count
        boolean sms_fallback_sent
        enum linked_entity_type "NIVEDAN | KARYAKARTA | EVENT | BROADCAST"
        int linked_entity_id
        string error_message
    }

    notifications {
        int id PK
        int user_id FK
        string title
        text message
        enum type "NIVEDAN | INWARD | DEVWORK | CALENDAR | WHATSAPP | ESCALATION | SYSTEM"
        enum severity "INFO | WARNING | CRITICAL"
        string linked_entity_type
        int linked_entity_id
        boolean is_read
    }

    audit_logs {
        int id PK
        int user_id FK
        enum action "CREATE | UPDATE | ARCHIVE | CANCEL | LOGIN | LOGOUT | LOGIN_FAILED | EXPORT | DELEGATE"
        string module
        string entity_type
        int entity_id
        json old_values
        json new_values
        string ip_address
        boolean is_delegated
    }

    delegations {
        int id PK
        int delegated_by FK
        int delegated_to FK
        boolean is_active
        datetime expires_at
    }

    users ||--o{ notifications : "receives"
    users ||--o{ audit_logs : "generates"
    users ||--o{ calendar_events : "creates"
    users ||--o{ delegations : "delegates_from"
    users ||--o{ delegations : "delegates_to"
    nivedans ||--o{ whatsapp_logs : "triggers"
    karyakartas ||--o{ whatsapp_logs : "greetings"
    calendar_events ||--o{ whatsapp_logs : "invitations"
```

**Key Relationships:**
- `whatsapp_logs` uses **polymorphic linking** (`linked_entity_type` + `linked_entity_id`) to connect to nivedans, karyakartas, or events
- `notifications` also uses **polymorphic linking** for the same reason
- `audit_logs` stores **before/after JSON snapshots** of every data change
- `delegations` links two users (PA → delegate) with auto-expiry

---

## 4. Geographical Hierarchy Diagram

```mermaid
graph TD
    A["🏛️ Constituency<br/>(मतदारसंघ)"] --> B["📍 Taluka<br/>(तालुका)"]
    A --> G["🏙️ City<br/>(शहर)"]
    
    B --> C["🏘️ Gram Panchayat<br/>(ग्रामपंचायत)"]
    C --> D["🏡 Village<br/>(गाव)"]
    D --> E["🗳️ Booth<br/>(मतदान केंद्र)"]
    
    G --> F["📍 Ward<br/>(प्रभाग)"]
    F --> E
    
    E --> H["👤 Karyakarta<br/>(कार्यकर्ता)"]
    E --> I["👑 Booth Pramukh<br/>(बूथ प्रमुख)"]
    
    style A fill:#4A90D9,color:#fff
    style B fill:#7B68EE,color:#fff
    style C fill:#9370DB,color:#fff
    style D fill:#BA55D3,color:#fff
    style E fill:#FF6347,color:#fff
    style F fill:#9370DB,color:#fff
    style G fill:#7B68EE,color:#fff
    style H fill:#3CB371,color:#fff
    style I fill:#FFD700,color:#000
```

**Table Chain:**
```
talukas (1) ──→ gram_panchayats (N) ──→ villages (N) ──→ booths (N) ──→ karyakartas (N)
                                                                       ──→ booth_pramukh (1)
wards (1) ──────────────────────────────────────────────→ booths (N)
```

---

## 5. Foreign Key Reference Map

Complete listing of every foreign key in the database.

| # | Table | Column | References | On Delete |
|:-:|-------|--------|-----------|-----------|
| 1 | `inward_entries` | `sender_department_id` | `departments.id` | SET NULL |
| 2 | `inward_entries` | `assigned_to_user_id` | `users.id` | SET NULL |
| 3 | `inward_entries` | `created_by` | `users.id` | RESTRICT |
| 4 | `inward_entries` | `updated_by` | `users.id` | SET NULL |
| 5 | `outward_entries` | `recipient_department_id` | `departments.id` | SET NULL |
| 6 | `outward_entries` | `reference_inward_id` | `inward_entries.id` | SET NULL |
| 7 | `outward_entries` | `approved_by` | `users.id` | SET NULL |
| 8 | `outward_entries` | `created_by` | `users.id` | RESTRICT |
| 9 | `nivedans` | `category_id` | `categories.id` | RESTRICT |
| 10 | `nivedans` | `sub_category_id` | `categories.id` | SET NULL |
| 11 | `nivedans` | `village_id` | `villages.id` | SET NULL |
| 12 | `nivedans` | `ward_id` | `wards.id` | SET NULL |
| 13 | `nivedans` | `taluka_id` | `talukas.id` | SET NULL |
| 14 | `nivedans` | `assigned_to_user_id` | `users.id` | SET NULL |
| 15 | `nivedans` | `department_forwarded_to_id` | `departments.id` | SET NULL |
| 16 | `nivedans` | `linked_visitor_id` | `visitors.id` | SET NULL |
| 17 | `nivedans` | `created_by` | `users.id` | RESTRICT |
| 18 | `nivedans` | `updated_by` | `users.id` | SET NULL |
| 19 | `nivedan_timeline` | `nivedan_id` | `nivedans.id` | CASCADE |
| 20 | `nivedan_timeline` | `assigned_to_user_id` | `users.id` | SET NULL |
| 21 | `nivedan_timeline` | `department_id` | `departments.id` | SET NULL |
| 22 | `nivedan_timeline` | `performed_by` | `users.id` | RESTRICT |
| 23 | `visitors` | `village_id` | `villages.id` | SET NULL |
| 24 | `visitors` | `ward_id` | `wards.id` | SET NULL |
| 25 | `visitors` | `linked_nivedan_id` | `nivedans.id` | SET NULL |
| 26 | `visitors` | `created_by` | `users.id` | RESTRICT |
| 27 | `development_works` | `village_id` | `villages.id` | SET NULL |
| 28 | `development_works` | `ward_id` | `wards.id` | SET NULL |
| 29 | `development_works` | `taluka_id` | `talukas.id` | SET NULL |
| 30 | `development_works` | `created_by` | `users.id` | RESTRICT |
| 31 | `development_works` | `updated_by` | `users.id` | SET NULL |
| 32 | `dev_work_photos` | `development_work_id` | `development_works.id` | CASCADE |
| 33 | `dev_work_photos` | `uploaded_by` | `users.id` | RESTRICT |
| 34 | `karyakartas` | `booth_id` | `booths.id` | RESTRICT |
| 35 | `karyakartas` | `village_id` | `villages.id` | SET NULL |
| 36 | `karyakartas` | `ward_id` | `wards.id` | SET NULL |
| 37 | `karyakartas` | `gram_panchayat_id` | `gram_panchayats.id` | SET NULL |
| 38 | `karyakartas` | `taluka_id` | `talukas.id` | SET NULL |
| 39 | `karyakartas` | `created_by` | `users.id` | RESTRICT |
| 40 | `karyakartas` | `updated_by` | `users.id` | SET NULL |
| 41 | `booths` | `village_id` | `villages.id` | SET NULL |
| 42 | `booths` | `ward_id` | `wards.id` | SET NULL |
| 43 | `booths` | `gram_panchayat_id` | `gram_panchayats.id` | SET NULL |
| 44 | `booths` | `booth_pramukh_id` | `karyakartas.id` | SET NULL |
| 45 | `booth_verifications` | `booth_id` | `booths.id` | CASCADE |
| 46 | `booth_verifications` | `verified_by` | `users.id` | RESTRICT |
| 47 | `gram_panchayats` | `taluka_id` | `talukas.id` | RESTRICT |
| 48 | `villages` | `gram_panchayat_id` | `gram_panchayats.id` | RESTRICT |
| 49 | `categories` | `parent_id` | `categories.id` | SET NULL |
| 50 | `categories` | `default_department_id` | `departments.id` | SET NULL |
| 51 | `calendar_events` | `created_by` | `users.id` | RESTRICT |
| 52 | `notifications` | `user_id` | `users.id` | CASCADE |
| 53 | `audit_logs` | `user_id` | `users.id` | RESTRICT |
| 54 | `delegations` | `delegated_by` | `users.id` | RESTRICT |
| 55 | `delegations` | `delegated_to` | `users.id` | RESTRICT |

### On Delete Rules

| Rule | When Used | Meaning |
|------|-----------|---------|
| **RESTRICT** | `created_by`, `performed_by`, core FKs | Cannot deactivate a user if they have records (use `is_active` instead) |
| **SET NULL** | Optional FKs (assigned_to, department, village) | If referenced record is removed, set the FK to NULL |
| **CASCADE** | Child records (timeline, photos, verifications, notifications) | If parent is deleted, delete children too |

> **Note:** Since no records are ever physically deleted in this system (soft-delete only), CASCADE and RESTRICT primarily serve as safety constraints during development/testing.

---

## 6. Data Flow Diagrams

### 6A. Nivedan Creation → Multi-Table Write

```mermaid
sequenceDiagram
    autonumber
    participant R as Receptionist
    participant API as Backend API
    participant DB as MySQL
    participant AR as Auto-Route Service
    participant NS as Notification Service
    participant WQ as WhatsApp Queue

    R->>API: POST /api/v1/visitors
    API->>DB: INSERT into visitors
    Note over DB: Check mobile for repeat visitor

    R->>API: POST /api/v1/nivedans
    API->>DB: INSERT into nivedans (status=PENDING)
    API->>DB: INSERT into nivedan_timeline (action=CREATED)
    
    API->>AR: Auto-route by category
    AR->>DB: SELECT default_department, escalation_days FROM categories
    AR->>DB: UPDATE nivedans SET assigned_to, department_forwarded_to
    AR->>DB: INSERT into nivedan_timeline (action=ASSIGNED)
    
    API->>NS: Create notification
    NS->>DB: INSERT into notifications (user=PA, type=NIVEDAN)
    
    API->>WQ: Queue WhatsApp acknowledgment
    WQ->>DB: INSERT into whatsapp_logs (status=QUEUED, type=NIVEDAN_ACK)
    
    API->>DB: INSERT into audit_logs (action=CREATE, module=nivedan)
    API->>R: Response: { tracking_id, receipt }
```

**Tables Written (1 nivedan creation = 6 table writes):**

| # | Table | Records | Purpose |
|:-:|-------|:-------:|---------|
| 1 | `visitors` | 1 | Visitor entry |
| 2 | `nivedans` | 1 | Main complaint record |
| 3 | `nivedan_timeline` | 2 | CREATED + ASSIGNED entries |
| 4 | `notifications` | 1 | Alert to PA |
| 5 | `whatsapp_logs` | 1 | Queued citizen acknowledgment |
| 6 | `audit_logs` | 1 | Audit trail |

---

### 6B. Nivedan Status Change → Cascading Updates

```mermaid
sequenceDiagram
    autonumber
    participant PA as PA / Manager
    participant API as Backend API
    participant DB as MySQL
    participant NS as Notification Service
    participant WQ as WhatsApp Queue

    PA->>API: PATCH /api/v1/nivedans/:id/status {status: "RESOLVED", notes: "..."}
    
    API->>DB: UPDATE nivedans SET status='RESOLVED', resolved_at=NOW()
    API->>DB: INSERT nivedan_timeline (action=RESOLVED, old='IN_PROGRESS', new='RESOLVED', note)
    
    API->>NS: Create notifications
    NS->>DB: INSERT notifications (user=MLA, "Nivedan resolved")
    
    API->>WQ: Queue WhatsApp resolution alert
    WQ->>DB: INSERT whatsapp_logs (type=NIVEDAN_RESOLVED, status=QUEUED)
    
    API->>DB: INSERT audit_logs (action=UPDATE, old_values, new_values)
    
    API->>PA: Response: { success: true }
```

---

### 6C. AI Letter Drafting → Outward Entry Creation

```mermaid
sequenceDiagram
    autonumber
    participant PA as PA / Manager
    participant API as Backend API
    participant AI as Google Gemini API
    participant DB as MySQL
    participant CLD as Cloudinary

    PA->>API: POST /api/v1/outward/ai-draft {ref_inward_id, dept, language, tone}
    
    API->>DB: SELECT * FROM inward_entries WHERE id=ref_inward_id
    Note over API: Build AI prompt with letter format + few-shot examples
    
    API->>AI: Generate formal letter (Marathi/English)
    AI->>API: Returns draft_text
    API->>PA: Response: { draft_text, editable }
    
    Note over PA: Reviews and edits draft

    PA->>API: POST /api/v1/outward/:id/finalize {body_text}
    
    API->>API: Generate PDF from letter body
    API->>CLD: Upload letter PDF
    CLD->>API: Returns PDF URL
    
    API->>DB: INSERT outward_entries (outward_number, body, pdf_url, is_ai_drafted=true, ref_inward_id)
    API->>DB: INSERT audit_logs (action=CREATE, module=outward)
    
    API->>PA: Response: { outward_number, pdf_url }
```

---

### 6D. WhatsApp Webhook → Delivery Status Update

```mermaid
sequenceDiagram
    autonumber
    participant META as Meta WhatsApp API
    participant API as Backend Webhook
    participant DB as MySQL
    participant SMS as SMS Gateway
    participant NS as Notification Service

    META->>API: POST /api/v1/whatsapp/webhook {status_update}
    
    API->>API: Verify webhook signature
    
    alt Delivery Status Update
        API->>DB: UPDATE whatsapp_logs SET delivery_status, delivered_at/read_at WHERE meta_message_id=X
    end
    
    alt Delivery Failed
        API->>DB: UPDATE whatsapp_logs SET delivery_status='FAILED', error_message
        
        alt retry_count < 2
            API->>DB: INSERT new whatsapp_logs (retry, status=QUEUED)
        else retry_count >= 2
            API->>SMS: Send SMS fallback
            API->>DB: UPDATE whatsapp_logs SET sms_fallback_sent=true
            API->>NS: Notify PA of failed delivery
            NS->>DB: INSERT notifications (user=PA, type=WHATSAPP, severity=WARNING)
        end
    end
    
    alt Inbound Citizen Message
        API->>API: Parse message text
        alt Text matches Tracking ID pattern
            API->>DB: SELECT status FROM nivedans WHERE tracking_id=X
            API->>META: Send bot reply with status
            API->>DB: INSERT whatsapp_logs (type=BOT_REPLY, direction=OUTBOUND)
        else Invalid text
            API->>META: Send help message
        end
        API->>DB: INSERT whatsapp_logs (type=INBOUND_QUERY, direction=INBOUND)
    end
```

---

### 6E. Daily Escalation Cron → Multi-Table Read/Write

```mermaid
sequenceDiagram
    autonumber
    participant CRON as Cron Scheduler (9 AM daily)
    participant DB as MySQL
    participant NS as Notification Service

    CRON->>DB: SELECT overdue nivedans (JOIN categories for escalation_days)
    Note over DB: WHERE status IN ('PENDING','IN_PROGRESS')<br/>AND DATEDIFF(NOW(), created_at) > escalation_days<br/>AND escalation_level = 'NONE'
    
    loop For each overdue nivedan
        CRON->>DB: UPDATE nivedans SET escalation_level='LEVEL_1', escalated_at=NOW()
        CRON->>DB: INSERT nivedan_timeline (action=ESCALATED, note="Auto-escalated: overdue")
        CRON->>NS: Create alert for PA
        NS->>DB: INSERT notifications (user=PA, severity=WARNING)
    end
    
    CRON->>DB: SELECT Level 1 nivedans still unresolved after 3 more days
    
    loop For each Level 1 still pending
        CRON->>DB: UPDATE nivedans SET escalation_level='LEVEL_2'
        CRON->>DB: INSERT nivedan_timeline (action=ESCALATED, note="Critical: escalated to MLA")
        CRON->>NS: Create critical alert for MLA + PA
        NS->>DB: INSERT notifications (user=MLA, severity=CRITICAL)
        NS->>DB: INSERT notifications (user=PA, severity=CRITICAL)
    end
```

---

### 6F. Birthday Greeting Cron → WhatsApp Queue

```mermaid
sequenceDiagram
    autonumber
    participant CRON as Cron Scheduler (8 AM daily)
    participant DB as MySQL
    participant WQ as WhatsApp Queue

    CRON->>DB: SELECT * FROM karyakartas WHERE MONTH(dob)=MONTH(NOW()) AND DAY(dob)=DAY(NOW()) AND is_active=true
    
    loop For each birthday worker
        CRON->>DB: INSERT whatsapp_logs (type=BIRTHDAY, status=QUEUED, recipient=mobile)
    end
    
    CRON->>DB: SELECT * FROM nivedans WHERE MONTH(citizen_dob)=MONTH(NOW()) AND DAY(citizen_dob)=DAY(NOW()) AND citizen_dob IS NOT NULL
    Note over CRON: Deduplicate by mobile number
    
    loop For each birthday citizen
        CRON->>DB: INSERT whatsapp_logs (type=BIRTHDAY, status=QUEUED, recipient=mobile)
    end
    
    Note over WQ: Queue processor picks up QUEUED messages<br/>every 30 seconds (batch of 10)
```

---

## 7. Cardinality Summary

| Relationship | Cardinality | Description |
|-------------|:-----------:|-------------|
| `users` → `nivedans` (created) | 1 : N | One user creates many nivedans |
| `users` → `nivedans` (assigned) | 1 : N | One user can be assigned many nivedans |
| `categories` → `nivedans` | 1 : N | One category has many nivedans |
| `categories` → `categories` | 1 : N | One parent has many sub-categories |
| `categories` → `departments` | N : 1 | Many categories route to one default department |
| `nivedans` → `nivedan_timeline` | 1 : N | One nivedan has many timeline entries |
| `nivedans` ↔ `visitors` | 1 : 1 | One nivedan optionally linked to one visitor |
| `inward_entries` → `outward_entries` | 1 : N | One inward can have many outward replies |
| `development_works` → `dev_work_photos` | 1 : N | One project has many photos |
| `booths` → `karyakartas` | 1 : N | One booth has many workers |
| `booths` ↔ `karyakartas` (pramukh) | 1 : 1 | One booth has one pramukh |
| `booths` → `booth_verifications` | 1 : N | One booth verified multiple times |
| `talukas` → `gram_panchayats` | 1 : N | Geographical hierarchy |
| `gram_panchayats` → `villages` | 1 : N | Geographical hierarchy |
| `villages` → `booths` | 1 : N | One village has many booths |
| `wards` → `booths` | 1 : N | One ward has many booths |
| `users` → `notifications` | 1 : N | One user receives many notifications |
| `users` → `audit_logs` | 1 : N | One user generates many audit entries |
| `users` → `delegations` | 1 : N | PA delegates to multiple users (over time) |

---

## 8. Polymorphic Relationships

Two tables use **polymorphic linking** (type + id pattern) instead of strict foreign keys:

### `whatsapp_logs`

| `linked_entity_type` | `linked_entity_id` points to |
|---------------------|------------------------------|
| `NIVEDAN` | `nivedans.id` |
| `KARYAKARTA` | `karyakartas.id` |
| `EVENT` | `calendar_events.id` |
| `BROADCAST` | Custom broadcast ID or NULL |

### `notifications`

| `linked_entity_type` | `linked_entity_id` points to |
|---------------------|------------------------------|
| `nivedan` | `nivedans.id` |
| `inward_entry` | `inward_entries.id` |
| `development_work` | `development_works.id` |
| `calendar_event` | `calendar_events.id` |
| `user` | `users.id` |

> **Why polymorphic?** These tables receive entries from multiple source modules. Using strict FKs for each would require many nullable FK columns. The type+id pattern is cleaner and extensible.

---
