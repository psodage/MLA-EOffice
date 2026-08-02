# MLA E-Office — Project Sections & Functional Breakdown

> **Detailed Functional Specifications for All 13 Modules — Fields, Workflows, Rules, UI Components, and Reports**
> 
> *Related Documents:* [PROJECT_OVERVIEW.md](file:///s:/MLA%20E%20-%20Office/PROJECT_OVERVIEW.md) | [USER_ROLES.md](file:///s:/MLA%20E%20-%20Office/USER_ROLES.md) | [TECH_STACK.md](file:///s:/MLA%20E%20-%20Office/TECH_STACK.md)

---

## System Architecture — 4 Pillars, 13 Modules

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         MLA E-OFFICE SYSTEM                            │
├────────────────┬────────────────┬─────────────────┬────────────────────┤
│   PILLAR 1     │   PILLAR 2     │    PILLAR 3     │     PILLAR 4       │
│  Office Admin  │  Public Griev. │  Cadre Network  │  Intelligence &    │
│  कार्यालयीन    │  जनतक्रार      │  पक्षीय संघटन   │  Automation        │
│  कामकाज        │  व विकासकामे   │  व भौगोलिक रचना │  डॅशबोर्ड व तंत्र  │
├────────────────┼────────────────┼─────────────────┼────────────────────┤
│ 1. Inward &    │ 3. Nivedan     │ 5. Karyakarta   │ 8. Dashboard       │
│    Outward     │                │    Master       │                    │
│ 2. Visitor     │ 4. Development │ 6. Gram/Ward    │ 9. Calendar        │
│    Book        │    Works       │    Organization │                    │
│                │                │ 7. Booth Arch.  │ 10. WhatsApp       │
│                │                │    & Verify     │ 11. RBAC/Security  │
│                │                │                 │ 12. Reports        │
│                │                │                 │ 13. Notifications  │
└────────────────┴────────────────┴─────────────────┴────────────────────┘
```

---

## 🔍 Global Search

The system features a **Global Search bar** fixed in the top header/navigation, accessible from any page.

| Feature | Detail |
|---------|--------|
| **Location** | Top navigation bar, always visible |
| **Scope** | Searches across ALL modules simultaneously — nivedans, inward entries, outward entries, visitors, karyakartas, development works, calendar events |
| **Search Fields** | Name, mobile number, subject, tracking ID, inward/outward number, village/ward name, booth number |
| **Results** | Grouped by module type (e.g., "Nivedans (3 results)", "Visitors (2 results)", "Workers (5 results)") |
| **Behavior** | Instant filtering as user types (debounced — 300ms delay) |
| **Access Control** | Results are filtered by the user's role permissions (Receptionist won't see modules they can't access) |

Additionally, every list page (nivedans, inward, visitors, workers, etc.) has its **own local search bar** for filtering within that specific table.

---

## 🏛️ Pillar 1: Office & Document Administration (कार्यालयीन कामकाज)

---

### Module 1: 📨 Inward & Outward Register (आवक-जावक व्यवस्थापन)

The official digital registry for managing all incoming and outgoing office correspondence.

---

#### 1A. Inward System (आवक)

**Purpose:** Record and track every letter, application, notice, or document received at the MLA office.

##### Form Fields — New Inward Entry

| Field | Type | Required | Rules / Notes |
|-------|------|:---:|------|
| Inward Number | Auto-generated | ✅ | Format: `INW/YYYY/NNNN` (e.g., `INW/2026/0001`). Auto-increments per year. Resets to 0001 on January 1st. |
| Date Received | Date picker | ✅ | Defaults to today. Can be backdated if entering old letters. |
| Sender Name | Text input | ✅ | Name of person or officer who sent the letter |
| Sender Designation | Text input | ❌ | e.g., "District Collector", "Tahsildar", "ZP CEO" |
| Sender Department | Dropdown | ❌ | Dropdown from government department master list |
| Subject | Text input | ✅ | Brief subject line of the letter |
| Description | Text area | ❌ | Detailed notes about the letter content |
| Category / Tags | Multi-select tags | ❌ | e.g., "Water", "Road", "Land", "Urgent" — for easy filtering |
| Priority | Dropdown | ✅ | `High` / `Medium` / `Low` — default: Medium |
| Attachment (PDF) | File upload | ❌ | Scanned copy of the physical letter. Accepts PDF, JPG, PNG. Max 10MB. |
| Assigned To | User dropdown | ❌ | Staff member responsible for action. Set by PA after review. |
| Status | Auto-set | ✅ | Default: `Pending`. Options: `Pending` → `Assigned` → `In Progress` → `Completed` |
| Created By | Auto-captured | ✅ | Logged-in user who created the entry |
| Created At | Auto-timestamp | ✅ | Date and time of entry creation |

##### List Page — Inward Register

| Feature | Detail |
|---------|--------|
| **Default View** | Table with columns: Inward No., Date, Sender, Subject, Priority, Status, Assigned To |
| **Sorting** | Click any column header to sort ascending/descending |
| **Pagination** | 25 entries per page (configurable) |
| **Search** | Local search bar — searches across Inward No., Sender Name, Subject |
| **Filters** | Date range, Sender/Department, Subject keyword, Status, Priority, Assigned To, Tags |
| **Actions** | View detail, Edit (PA only), Assign to staff (PA only), Print |
| **Export** | PDF / Excel export of filtered list |

##### Inward Workflow

```
Physical Letter     Receptionist          PA / Manager
Arrives         →   Scans & Uploads   →   Reviews & Assigns
at Office           Creates Inward         to Staff Member
                    Entry                  Sets Priority
                    
                         │
                         ▼
                    ┌──────────┐     ┌──────────┐     ┌──────────┐
                    │ Pending  │ ──▶ │ Assigned │ ──▶ │Completed │
                    └──────────┘     └──────────┘     └──────────┘
                                          │
                                          ▼
                                    ┌──────────┐
                                    │In Progress│
                                    └──────────┘
```

---

#### 1B. Outward System (जावक)

**Purpose:** Record and track every letter sent from the MLA office, with AI-powered drafting.

##### Form Fields — New Outward Entry

| Field | Type | Required | Rules / Notes |
|-------|------|:---:|------|
| Outward Number | Auto-generated | ✅ | Format: `OUT/YYYY/NNNN` (e.g., `OUT/2026/0001`). Auto-increments per year. |
| Date | Date picker | ✅ | Defaults to today |
| Recipient Name | Text input | ✅ | Name of person or officer receiving the letter |
| Recipient Designation | Text input | ❌ | e.g., "Hon. District Collector" |
| Recipient Department | Dropdown | ❌ | From government department master list |
| Subject | Text input | ✅ | Subject line of the outgoing letter |
| Letter Body | Rich text editor | ✅ | Full body text of the letter. Can be manually typed or AI-generated. |
| Reference Inward | Linked dropdown | ❌ | Links this outward to a related inward entry (if replying to an incoming letter) |
| AI Drafted | Boolean flag | Auto | `true` if the letter was generated by AI, `false` if manually typed |
| Attachment | File upload | ❌ | Additional supporting documents. PDF, JPG, PNG. Max 10MB. |
| Approved By | Auto-captured | ✅ | User who finalized the letter (PA) |
| Created By | Auto-captured | ✅ | Logged-in user |
| Created At | Auto-timestamp | ✅ | Date and time |

##### AI Letter Drafting Flow

```
PA clicks "Draft with AI"
        │
        ▼
┌─────────────────────────────────┐
│  AI Input Form:                 │
│  • Reference Inward (optional)  │
│  • Recipient Department         │
│  • Subject / Context            │
│  • Language (Marathi / English)  │
│  • Tone (Formal / Request /     │
│         Complaint / Follow-up)  │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Gemini AI generates draft      │
│  in formal government letter    │
│  format with:                   │
│  • Reference line               │
│  • Proper salutation            │
│  • Structured body              │
│  • Formal closing               │
│  • MLA signature block          │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  PA reviews draft in editor     │
│  • Edits text if needed         │
│  • Clicks "Finalize"           │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  System auto-creates:           │
│  • Outward entry with number    │
│  • Letter saved as PDF          │
│  • Linked to reference inward   │
│  • Ready for printing           │
└─────────────────────────────────┘
```

##### List Page — Outward Register

| Feature | Detail |
|---------|--------|
| **Default View** | Table: Outward No., Date, Recipient, Subject, AI Drafted (yes/no badge), Ref. Inward |
| **Filters** | Date range, Recipient/Department, Subject keyword, AI vs Manual |
| **Actions** | View detail, Edit (before finalize only), Print letter, Download PDF |
| **Export** | PDF / Excel export of filtered list |

---

### Module 2: 📖 Visitor Book (व्हिजिटर बुक)

**Purpose:** Digital reception register replacing paper visitor logbooks. Records every person visiting the MLA office.

##### Form Fields — New Visitor Entry

| Field | Type | Required | Rules / Notes |
|-------|------|:---:|------|
| Visitor Name | Text input | ✅ | Full name of the visitor |
| Mobile Number | Number input | ✅ | 10-digit Indian mobile number. Used for repeat visitor detection. |
| Address | Text area | ❌ | Residential address |
| Village / Ward | Dropdown | ❌ | From geographical master data |
| Purpose of Visit | Dropdown | ✅ | Categories: Grievance/Complaint, Courtesy Call/VIP Visit, Party Work, Invitation, Personal Meeting, Document Submission, Follow-up on Previous Complaint, Recommendation Request, General Inquiry, Other |
| Purpose Description | Text area | ❌ | Additional detail about the visit purpose |
| Check-in Time | Auto-timestamp | ✅ | Auto-captured at entry creation |
| Check-out Time | Time picker | ❌ | Manually entered when visitor leaves |
| Is Repeat Visitor | Auto-detected | Auto | System checks mobile number against previous entries. Shows badge: "First Visit" or "Repeat (X previous visits)" |
| Linked Nivedan | Auto-linked | Auto | If a nivedan is registered during this visit, it is auto-linked to this visitor entry |
| Created By | Auto-captured | ✅ | Logged-in user (Receptionist) |

##### List Page — Visitor Book

| Feature | Detail |
|---------|--------|
| **Default View** | Today's visitors by default. Table: Name, Mobile, Purpose, Check-in Time, Check-out Time, Repeat Badge |
| **Date Filter** | Switch between today / this week / this month / custom date range |
| **Search** | Search by name or mobile number |
| **Filters** | Purpose category, Village/Ward, Repeat vs First-time |
| **Summary Card** | Top of page shows: "Today: X visitors | This Week: X | This Month: X" |
| **Actions** | View detail, Edit, Checkout (update departure time), Print daily register |

##### Repeat Visitor Detection

When the receptionist enters a mobile number:
- System **instantly checks** the database for matching mobile numbers
- If found: Shows a popup/banner: *"Repeat Visitor — {Name} has visited {X} times before. Last visit: {date}. Previous purpose: {purpose}."*
- If the visitor has linked nivedans: *"Has {X} active complaints: {Tracking IDs}."*
- This helps staff quickly understand the citizen's history without asking them to repeat everything

---

## 🏛️ Pillar 2: Public Grievances & Infrastructure (जनतक्रार व विकासकामे)

---

### Module 3: 📝 Nivedan — Citizen Complaints & Petitions (निवेदन व्यवस्थापन)

**Purpose:** The central grievance redressal system tracking citizen complaints from registration to resolution.

> **Creation Rule:** Only **Receptionist** and **PA** can create new nivedans. Citizens cannot submit online — they must visit the office.

##### Form Fields — New Nivedan

| Field | Type | Required | Rules / Notes |
|-------|------|:---:|------|
| Tracking ID | Auto-generated | ✅ | Format: `NIV-YYYY-NNNNN` (e.g., `NIV-2026-00001`). Auto-increments. |
| Citizen Name | Text input | ✅ | Full name of the complainant |
| Mobile Number | Number input | ✅ | 10-digit Indian mobile. Used for WhatsApp notifications and citizen history lookup. |
| Address | Text area | ✅ | Residential address |
| Village / Ward | Dropdown | ✅ | From geographical master data |
| Taluka | Dropdown | ❌ | Auto-populated based on village selection (for rural) |
| Category | Dropdown | ✅ | **14 categories:** Water Supply, Road/Drainage, Electricity, Land/Revenue, Education, Health/Medical, Pension/Social Welfare, Ration Card/PDS, Caste/Income Certificate, Housing/Awas Yojana, Agriculture, Employment/Rojgar, Police/Law & Order, General/Other |
| Sub-Category | Dropdown | ❌ | Dynamic — changes based on selected category |
| Subject | Text input | ✅ | Brief one-line summary of the complaint |
| Description | Text area | ✅ | Detailed description of the issue |
| Attachments | File upload (multi) | ❌ | Supporting documents — PDF, JPG, PNG. Multiple files allowed. Max 10MB per file. |
| Status | Auto-set | ✅ | Default: `Pending` |
| Assigned To | Auto / Manual | ❌ | Set by **auto-routing** based on category, or manually by PA |
| Department Forwarded To | Dropdown | ❌ | Government department (if forwarded externally) |
| Priority | Auto / Manual | ✅ | Auto-set based on category escalation deadline. Can be overridden by PA. |
| Created By | Auto-captured | ✅ | Logged-in user (Receptionist or PA) |
| Created At | Auto-timestamp | ✅ | Date and time of registration |

##### Citizen History Lookup

When the receptionist enters a **mobile number** during nivedan registration:
- System searches for **all previous nivedans** from that same mobile number
- If found: Shows a collapsible panel below the form:
  - *"This citizen has {X} previous complaints:"*
  - Table: Tracking ID, Date, Subject, Category, Current Status
  - Clicking a Tracking ID opens that nivedan's detail page in a new tab
- All nivedans from the same mobile number are **linked** as related records in the citizen's complaint history

##### Nivedan Status Lifecycle

```
                    ┌──────────┐
                    │ PENDING  │ ← Initial status on creation
                    └────┬─────┘
                         │
                    ┌────┴─────┐
                    │   AUTO   │  Auto-routing assigns to
                    │  ROUTE   │  staff/department based
                    │          │  on category
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              ▼                     ▼
       ┌────────────┐      ┌──────────────────┐
       │IN PROGRESS │      │ FORWARDED TO     │
       │(Staff      │      │ GOVT DEPARTMENT  │
       │ working)   │      │ (external)       │
       └─────┬──────┘      └────────┬─────────┘
             │                      │
             │               ┌──────┴──────┐
             │               │  AWAITING   │
             │               │  RESPONSE   │
             │               │  (from dept)│
             │               └──────┬──────┘
             │                      │
             └──────────┬───────────┘
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
       ┌──────────┐ ┌────────┐ ┌───────────┐
       │ RESOLVED │ │REJECTED│ │ CANCELLED │
       │(issue    │ │(invalid│ │ (citizen   │
       │ fixed)   │ │/dupe)  │ │ withdrew)  │
       └────┬─────┘ └────────┘ └───────────┘
            │
            ▼
       ┌──────────┐
       │ ARCHIVED │ (old resolved complaints
       └──────────┘  moved for housekeeping)
```

**Status Values Summary:**

| Status | Marathi | Description | Who Can Set |
|--------|---------|-------------|-------------|
| Pending | प्रलंबित | Newly registered, no action yet | Auto (on creation) |
| In Progress | कार्यवाही सुरू | Staff is working on the issue | PA |
| Forwarded to Dept | विभागाकडे वर्ग | Sent to external govt department | PA |
| Awaiting Response | प्रतिसाद प्रतीक्षा | Waiting for department reply | PA |
| Resolved | निकाली | Issue fixed, citizen informed | PA |
| Rejected | नाकारले | Invalid or duplicate complaint | PA |
| Cancelled | रद्द | Citizen withdrew the complaint | PA |
| Archived | संग्रहित | Old resolved/rejected moved to archive | PA / System (auto after 90 days) |

##### Nivedan Detail Page

The detail page for a single nivedan contains:

**Section 1 — Citizen Information**
- Name, Mobile, Address, Village/Ward, Taluka
- Citizen complaint history link: "View all {X} complaints from this citizen"

**Section 2 — Complaint Details**
- Tracking ID, Date, Category, Sub-Category, Subject, Description
- Attached documents (viewable/downloadable)
- Status badge (color-coded)
- Assigned staff member
- Forwarded department (if applicable)

**Section 3 — Activity Timeline (Vertical Timeline)**
- Chronological log of every action taken on this nivedan
- Each entry shows: **Date/Time → Action → By (user) → Notes**
- Staff can **add internal notes/comments** at each step (not visible to citizen)
- Example timeline:
  ```
  📝 01-Aug-2026 10:15 AM — Nivedan Registered — by Receptionist Sita
  🔄 01-Aug-2026 10:20 AM — Auto-routed to Water Supply category
  👤 01-Aug-2026 11:00 AM — Assigned to Staff: Ramesh — by PA Suresh
     Note: "Forwarding to ZP water supply for action"
  📲 01-Aug-2026 11:01 AM — WhatsApp sent to citizen: Acknowledgment
  🔄 03-Aug-2026 02:30 PM — Status → In Progress — by Staff Ramesh
     Note: "Contacted ZP office, site visit scheduled"
  📲 03-Aug-2026 02:31 PM — WhatsApp sent to citizen: Status update
  ✅ 07-Aug-2026 04:00 PM — Status → Resolved — by PA Suresh
     Note: "Water pipeline repair completed. Confirmed by field visit."
  📲 07-Aug-2026 04:01 PM — WhatsApp sent to citizen: Resolution alert
  ```

**Section 4 — WhatsApp History**
- Log of all WhatsApp/SMS messages sent to the citizen for this nivedan
- Delivery status: Sent / Delivered / Read / Failed

##### Nivedan Printing

Two print options available:

| Print Type | Content | When Used |
|-----------|---------|-----------|
| **Full Receipt** | MLA office header, Tracking ID, Date, Citizen Name, Subject, Category, QR code for tracking portal, office contact | Given to citizen at registration |
| **Simple Slip** | Tracking ID, Date, Subject only — compact size | Quick reference slip |

##### List Page — Nivedan Register

| Feature | Detail |
|---------|--------|
| **Default View** | All non-archived nivedans. Table: Tracking ID, Date, Citizen Name, Category, Subject, Status, Assigned To, Priority |
| **Status Badges** | Color-coded: Pending (yellow), In Progress (blue), Forwarded (orange), Awaiting (purple), Resolved (green), Rejected (red), Cancelled (gray) |
| **Search** | Tracking ID, Citizen Name, Mobile Number, Subject keyword |
| **Filters** | Status, Category, Village/Ward, Assigned To, Date range, Priority, Escalated (yes/no) |
| **Sorting** | By date (newest first default), priority, status |
| **Pagination** | 25 per page |
| **Tab Views** | Quick tabs: All | Pending | In Progress | Forwarded | Resolved | Escalated |
| **Export** | PDF / Excel export of filtered list |
| **Receptionist Scope** | Receptionist sees only nivedans **they created** |
| **PA/MLA Scope** | See all nivedans across the entire system |

---

### Module 4: 🏗️ Development Works (विकासकामे)

**Purpose:** Comprehensive tracker for public infrastructure projects with budget accountability and geotagged photo evidence.

##### Form Fields — New Development Work

| Field | Type | Required | Rules / Notes |
|-------|------|:---:|------|
| Project Name | Text input | ✅ | e.g., "Amravati Road CC Road Construction" |
| Category | Dropdown | ✅ | **13 categories:** Road Construction, Drainage/Sewage, Water Supply Pipeline, Hospital/Health Center, School Building, Community Hall, Street Lighting, Bridge/Culvert, Electrification, Garden/Park, Toilet/Sanitation, Crematorium/Burial Ground, Other |
| Location | Text input | ✅ | Specific address or landmark |
| Village / Ward | Dropdown | ✅ | From geographical master data |
| Taluka | Dropdown | ❌ | Auto-populated based on village |
| Geo Coordinates | Auto-captured | ❌ | Latitude/Longitude from GPS when uploading site photos |
| Funding Source | Dropdown | ✅ | **9 options:** MLALAD (आमदार निधी), Zilla Parishad Fund, State Govt Grant, Central Govt Grant, Municipal Corporation Fund, Gram Panchayat Fund, MPLAD (MP Fund), CSR, Other/Mixed |
| Budget Allocated (₹) | Number input | ✅ | Total sanctioned budget amount |
| Budget Spent (₹) | Number input | ❌ | Amount spent so far (updated periodically). Default: 0 |
| Contractor Name | Text input | ❌ | Name of the contractor executing the work |
| Contractor Contact | Number input | ❌ | Contractor's mobile number |
| Start Date | Date picker | ❌ | Actual work start date |
| Expected Completion | Date picker | ❌ | Target completion date |
| Actual Completion | Date picker | ❌ | Filled when project is marked Completed |
| Status | Dropdown | ✅ | `Sanctioned` → `In Progress` → `Completed` / `Delayed` |
| Progress (%) | Slider / Number | ❌ | 0–100 percentage. Default: 0 |
| Site Photos | File upload (multi) | ❌ | Geotagged photos. Multiple uploads allowed. Categorized: Before / During / After |
| Description / Notes | Text area | ❌ | Additional project notes |
| Created By | Auto-captured | ✅ | Logged-in user |
| Created At | Auto-timestamp | ✅ | Date and time |

##### Development Work Detail Page

**Section 1 — Project Info**
- Name, Category, Location, Village/Ward, Status badge, Progress bar (0–100%)

**Section 2 — Financial Summary**
- Budget Allocated vs. Budget Spent — visual bar chart
- Funding source label
- Remaining budget amount

**Section 3 — Timeline**
- Start Date → Expected Completion → Actual Completion
- If delayed: shows red "Delayed by X days" badge

**Section 4 — Photo Gallery**
- Grid of uploaded photos with date, GPS coordinates, and uploader name
- Tabs: Before | During | After
- Click to view full-size with map pin showing GPS location

**Section 5 — Activity Log**
- Every status change and update logged with user and timestamp

##### List Page

| Feature | Detail |
|---------|--------|
| **Default View** | Table: Project Name, Category, Village/Ward, Funding, Budget, Status, Progress % |
| **Status Badges** | Sanctioned (blue), In Progress (yellow), Completed (green), Delayed (red) |
| **Filters** | Category, Status, Village/Ward, Funding Source, Date range, Budget range |
| **View Modes** | Table view + Card/Grid view (showing photo thumbnails) |
| **Export** | PDF / Excel |

---

## 🏛️ Pillar 3: Cadre Network & Geographical Organization (पक्षीय संघटन व भौगोलिक रचना)

---

### Module 5: 👥 Karyakarta Master — Party Worker Database (कार्यकर्ता डायरेक्टरी)

**Purpose:** Centralized directory of 5,000–10,000 party workers across the constituency.

##### Form Fields — New Karyakarta

| Field | Type | Required | Rules / Notes |
|-------|------|:---:|------|
| Full Name | Text input | ✅ | Worker's full name |
| Mobile Number | Number input | ✅ | Primary 10-digit mobile |
| Alternate Mobile | Number input | ❌ | Secondary contact number |
| Date of Birth | Date picker | ❌ | Used for auto birthday greetings via WhatsApp |
| Address | Text area | ❌ | Residential address |
| Village / Ward | Dropdown | ✅ | From geographical master data |
| Gram Panchayat | Dropdown | ❌ | Auto-populated based on village (rural areas) |
| Taluka | Dropdown | ❌ | Auto-populated |
| Booth Number | Dropdown | ✅ | Polling booth assigned to this worker |
| Designation | Dropdown | ✅ | Options: Booth Pramukh, Ward Head, Shakti Kendra Pramukh, Karyakarta, Volunteer, Other |
| Profile Photo | Image upload | ❌ | Worker's photo. Max 5MB. |
| Is Active | Toggle | ✅ | Default: Active. Inactive workers are hidden from main lists. |
| Joined Date | Date picker | ❌ | When the worker joined the organization |
| Notes | Text area | ❌ | Internal notes about the worker |
| Created By | Auto-captured | ✅ | User who added this worker |
| Created At | Auto-timestamp | ✅ | Date and time |

##### Bulk Import from Excel

| Feature | Detail |
|---------|--------|
| **File Format** | `.xlsx` or `.csv` |
| **Required Columns** | Name, Mobile, Village/Ward, Booth Number, Designation |
| **Optional Columns** | Alt Mobile, Date of Birth, Address, Gram Panchayat |
| **Validation** | System validates each row — shows error list for invalid entries (e.g., duplicate mobile, invalid booth number) |
| **Preview** | Shows first 10 rows for confirmation before import |
| **Duplicate Handling** | If mobile number already exists, shows warning — user chooses to skip or update |

##### List Page

| Feature | Detail |
|---------|--------|
| **Default View** | Table: Name, Mobile, Village/Ward, Booth No., Designation, Active Status |
| **Search** | By name, mobile number |
| **Filters** | Booth number, Village/Ward, Gram Panchayat, Taluka, Designation, Active/Inactive |
| **View Modes** | Table view + Card view (with profile photos) |
| **Bulk Actions** | Select multiple → Change designation, Mark inactive, Send WhatsApp broadcast |
| **Export** | PDF / Excel directory |
| **Booth Pramukh Scope** | Booth Pramukhs (via WhatsApp) can only add/view workers in their own booth |

---

### Module 6: 📍 Gram & City Ward Organization (ग्राम व वॉर्ड रचना)

**Purpose:** Geographical hierarchy supporting both rural and urban constituencies. Backbone of area-wise filtering and reporting.

##### Geographical Hierarchy

**Rural Constituency:**
```
Constituency
  └── Taluka (तालुका)
        └── Gram Panchayat (ग्रामपंचायत)
              └── Village (गाव)
                    └── Booth (मतदान केंद्र)
```

**Urban Constituency:**
```
Constituency
  └── City (शहर)
        └── Ward (प्रभाग)
              └── Booth (मतदान केंद्र)
```

##### Master Data Tables

| Table | Fields | Managed By |
|-------|--------|-----------|
| Talukas | id, name (EN), name (MR), constituency_id | Admin / PA |
| Gram Panchayats | id, name (EN), name (MR), taluka_id | Admin / PA |
| Villages | id, name (EN), name (MR), gram_panchayat_id | Admin / PA |
| Wards | id, ward_number, name (EN), name (MR), city_name | Admin / PA |
| Booths | id, booth_number, name, location, village_id or ward_id, total_voters | Admin / PA |

##### Area-wise Dashboard

Each village/ward has a summary card showing:
- Total complaints from this area (pending vs resolved)
- Active development works
- Number of party workers
- Booth Pramukh assigned (yes/no)

##### Features
- **Area-wise filtering** on all modules — view nivedans, visitors, workers, dev works by village/ward
- **Area-wise reports** — generate PDF report for a specific village/ward
- **Heatmap visualization** — color-coded map showing complaint density per area (D3.js)
- **Bulk import** — village, ward, and booth data can be imported from Excel

---

### Module 7: 🗳️ Booth Architecture & Field Verification (बूथ रचना व पडताळणी)

**Purpose:** Polling booth-level organizational structure and ground work verification.

##### Booth Structure View

Each booth displays:

| Field | Detail |
|-------|--------|
| Booth Number | Unique polling booth identifier |
| Booth Name / Location | Physical address of the booth |
| Village / Ward | Parent geographical area |
| Total Registered Voters | Voter count for this booth |
| Booth Pramukh | Assigned head — name, mobile, photo |
| Workers Count | Number of karyakartas assigned to this booth |
| Worker List | Expandable list of all workers in this booth |
| Verification Status | `Not Verified` / `Partially Verified` / `Fully Verified` |

##### Booth Verification

| Feature | Detail |
|---------|--------|
| **Who Verifies** | Field Auditors visit booth areas and submit verification reports |
| **Verification Checklist** | Configurable list of items to check (e.g., "Booth committee formed?", "Local issues reported?", "Public works completed?") |
| **Photo Evidence** | Auditors upload geotagged photos as proof |
| **Status Update** | Auditor marks booth as Verified / Partially Verified / Not Verified |
| **Report Generation** | Booth-wise verification report with photos, checklist results, and auditor comments |

##### List Page

| Feature | Detail |
|---------|--------|
| **Default View** | Grid of booth cards: Booth No., Location, Pramukh Name, Workers Count, Verification Status |
| **Filters** | Village/Ward, Verification status, Has Pramukh assigned (yes/no) |
| **Summary Bar** | Total booths: X | Verified: X | Pending Verification: X | No Pramukh: X |
| **Export** | Booth structure report (PDF/Excel) |

---

## 🏛️ Pillar 4: Executive Intelligence & Automation (डॅशबोर्ड व तंत्रज्ञान)

---

### Module 8: 📊 Executive Dashboard (डॅशबोर्ड)

**Purpose:** Command center home screen with live KPIs, charts, and activity feed.

##### KPI Cards (Top Row — Live Counters)

| # | KPI Card | Value Displayed | Color |
|---|----------|----------------|-------|
| 1 | Total Nivedans | Today / This Week / This Month / All Time (toggle) | Blue |
| 2 | Pending Nivedans | Count of status = Pending | Yellow |
| 3 | In Progress Nivedans | Count of status = In Progress | Blue |
| 4 | Resolved Nivedans | Count of status = Resolved | Green |
| 5 | Overdue / Escalated | Count of nivedans past escalation deadline | Red |
| 6 | Today's Visitors | Visitor count for today | Teal |
| 7 | Active Dev Works | Count of status = In Progress | Orange |
| 8 | Completed Dev Works | Count of status = Completed | Green |
| 9 | Delayed Dev Works | Count of status = Delayed | Red |
| 10 | Active Karyakartas | Total active party workers | Purple |
| 11 | Today's Inward | Inward entries created today | Blue |
| 12 | Today's Outward | Outward entries created today | Blue |
| 13 | WhatsApp Sent Today | Messages dispatched today | Green |

##### Charts & Visualizations (Below KPI Cards)

| Chart | Type | Library | Data |
|-------|------|---------|------|
| Nivedans by Status | Donut / Pie chart | Recharts | Pending, In Progress, Forwarded, Resolved, Rejected |
| Monthly Nivedan Trend | Line chart | Recharts | Month-wise count for past 12 months |
| Visitor Footfall | Bar chart | Recharts | Daily count for past 30 days |
| Dev Works by Status | Stacked bar chart | Recharts | Sanctioned, In Progress, Completed, Delayed |
| Area-wise Complaints | Horizontal bar chart | Recharts | Top 10 villages/wards by complaint count |
| Booth-wise Worker Strength | Heatmap | D3.js | Color intensity by worker count per booth |
| Category-wise Complaints | Bar chart | Recharts | Complaint count per category (Water, Road, etc.) |

##### Activity Feed (Right Sidebar or Bottom Section)

- Latest 20 activities across the system
- Each entry: icon + text + timestamp
- Examples:
  - 🆕 "New Nivedan NIV-2026-00143 registered — Water Supply — by Sita"
  - ✅ "Nivedan NIV-2026-00098 resolved — by PA Suresh"
  - 👤 "12 visitors checked in today"
  - 📲 "WhatsApp broadcast sent to 150 workers — Festival Greeting"

##### Dashboard Access

| Role | Access |
|------|--------|
| MLA | Full dashboard — all KPIs, charts, activity feed |
| PA | Full dashboard — same as MLA |
| All others | ❌ No dashboard access |
| Admin | System health dashboard only (separate) |

---

### Module 9: 🗓️ Calendar & Events (कॅलेंडर)

**Purpose:** Digital scheduler for the MLA's timetable, office events, and government deadlines.

##### Form Fields — New Event

| Field | Type | Required | Rules / Notes |
|-------|------|:---:|------|
| Title | Text input | ✅ | e.g., "ZP Budget Meeting" |
| Description | Text area | ❌ | Event details |
| Event Type | Dropdown | ✅ | Meeting, Public Program, Government Deadline, Assembly Session, Constituency Visit, Personal |
| Date | Date picker | ✅ | Event date |
| Start Time | Time picker | ❌ | Event start time |
| End Time | Time picker | ❌ | Event end time |
| Location | Text input | ❌ | Venue address |
| Attendees | Multi-select | ❌ | Select staff members who should attend |
| Is Recurring | Toggle | ❌ | If yes: Daily / Weekly / Monthly / Custom |
| Reminder | Dropdown | ❌ | 15 min / 30 min / 1 hour / 1 day before event |
| Color Code | Auto-assigned | Auto | Based on event type (see below) |
| Created By | Auto-captured | ✅ | Logged-in user |

##### Color Coding by Event Type

| Event Type | Color | Marathi |
|-----------|-------|---------|
| Meeting | 🔵 Blue | बैठक |
| Public Program | 🟢 Green | सार्वजनिक कार्यक्रम |
| Government Deadline | 🔴 Red | शासकीय मुदत |
| Assembly Session | 🟣 Purple | विधानसभा अधिवेशन |
| Constituency Visit | 🟠 Orange | मतदारसंघ दौरा |
| Personal | ⚪ Gray | वैयक्तिक |

##### Calendar Views

| View | Detail |
|------|--------|
| **Monthly View** | Grid calendar showing event dots/badges per day. Click a day to see event list. |
| **Weekly View** | 7-day time grid showing event blocks |
| **Daily Agenda** | List of all events for a single day with full details |
| **Event Type Filter** | Toggle visibility of event types (e.g., show only Government Deadlines) |

---

### Module 10: 📲 WhatsApp Automation Engine (व्हॉट्सअॅप ऑटोमेशन)

**Purpose:** Automated messaging engine connecting the MLA office with citizens and party workers via WhatsApp.

##### Message Types

| # | Message Type | Trigger | Recipient | Template |
|---|-------------|---------|-----------|----------|
| 1 | Nivedan Acknowledgment | New nivedan created | Citizen (mobile from nivedan) | "नमस्कार {name}, आपली तक्रार क्र. {tracking_id} नोंदवली गेली आहे..." |
| 2 | Nivedan Status Update | Status changes | Citizen | "आपल्या तक्रार क्र. {tracking_id} वर कार्यवाही सुरू आहे..." |
| 3 | Nivedan Resolved | Status → Resolved | Citizen | "आपली तक्रार यशस्वीरित्या निकाली काढली आहे..." |
| 4 | Birthday Greeting | Worker/citizen DOB match | Worker/Citizen | "वाढदिवसाच्या हार्दिक शुभेच्छा, {name}!" |
| 5 | Festival Greeting | Festival date from calendar | All workers / selected groups | Festival-specific template |
| 6 | Event Invitation | PA sends broadcast | Selected workers/groups | "आपणास {event_name} कार्यक्रमास निमंत्रण..." |
| 7 | Broadcast Announcement | PA composes custom message | Selected groups | Custom text |
| 8 | Tracking Bot Reply | Citizen sends Tracking ID | Citizen | Current status of their nivedan |

##### WhatsApp Bot (Inbound)

| Citizen Sends | Bot Response |
|--------------|-------------|
| Any valid Tracking ID (e.g., `NIV-2026-00001`) | Current status in Marathi: status, department, last action date |
| Invalid text / random message | "कृपया आपला ट्रॅकिंग आयडी पाठवा. उदा: NIV-2026-00001" |
| `HELP` or `मदत` | Instructions on how to use the tracking bot |

##### Broadcast Management

| Feature | Detail |
|---------|--------|
| **Compose** | PA types message or selects a template |
| **Audience Selection** | All workers / By booth / By village/ward / By designation / Custom list |
| **Preview** | Shows recipient count and sample message before sending |
| **Schedule** | Send now or schedule for later |
| **Delivery Tracking** | Dashboard showing: Total, Sent, Delivered, Read, Failed counts |
| **Retry Failed** | One-click retry for failed messages |
| **SMS Fallback** | If WhatsApp delivery fails after 2 retries, auto-send via SMS |

##### Message Log

Every message is logged with:
- Recipient mobile, message type, template used, delivery status (Sent/Delivered/Read/Failed), linked entity (nivedan/event), timestamp

---

### Module 11: 🔐 Multi-Admin Access & Security (युजर रोल व सुरक्षा)

**Purpose:** Role-Based Access Control, user management, and audit logging.

##### User Management Page (Admin Only)

| Feature | Detail |
|---------|--------|
| **User List** | Table: Name, Username, Role, Mobile, Last Login, Active Status |
| **Create User** | Form: Full Name, Username, Password, Role (dropdown), Mobile, Email, Accessible Modules |
| **Edit User** | Change role, update contact info, toggle active/inactive |
| **Deactivate** | Mark user as inactive (no delete — data preserved) |
| **Reset Password** | Admin generates a new temporary password for the user |
| **Role Assignment** | Dropdown with 7 roles — permissions auto-applied per role |
| **Search** | By name or username |

##### Audit Log Viewer (Admin + MLA)

| Feature | Detail |
|---------|--------|
| **Log Entry Fields** | Timestamp, User, Action (Create/Update/Login/Logout), Module, Entity Type, Entity ID, IP Address |
| **Filters** | User, Action type, Module, Date range |
| **Search** | By user name or entity ID |
| **Export** | CSV export for external audit |
| **Retention** | Logs retained indefinitely (no auto-purge) |

> 📎 *Full permission details:* [USER_ROLES.md](file:///s:/MLA%20E%20-%20Office/USER_ROLES.md)

---

### Module 12: 📑 Reports & Analytics (अहवाल व विश्लेषण)

**Purpose:** Generate formatted, exportable reports for data-driven decision making.

##### Report Types

| # | Report Name | Filters Available | Export |
|---|------------|-------------------|--------|
| 1 | **Nivedan Summary** | Date range, Category, Status, Village/Ward, Assigned To | PDF, Excel |
| 2 | **Nivedan Department-wise** | Date range, Department, Status | PDF, Excel |
| 3 | **Inward/Outward Register** | Date range, Department, AI vs Manual (outward) | PDF, Excel |
| 4 | **Visitor Footfall** | Date range (daily/weekly/monthly), Purpose category | PDF, Excel |
| 5 | **Development Works Progress** | Category, Status, Village/Ward, Funding source | PDF, Excel |
| 6 | **Budget vs Expenditure** | Category, Funding source, Village/Ward | PDF, Excel |
| 7 | **Karyakarta Directory** | Booth, Village/Ward, Designation, Active/Inactive | PDF, Excel |
| 8 | **Booth Verification** | Village/Ward, Verification status | PDF, Excel |
| 9 | **Area-wise Analysis** | Village/Ward — combined: complaints + works + workers | PDF, Excel |
| 10 | **Monthly Office Performance** | Month selection — all KPIs combined in one report | PDF, Excel |
| 11 | **Escalation Report** | Date range — overdue nivedans with escalation history | PDF, Excel |

##### Report Page UI

| Feature | Detail |
|---------|--------|
| **Layout** | Left sidebar: Report type selector. Right panel: Filters + Preview + Download buttons. |
| **Preview** | Shows report in-page before downloading |
| **PDF Format** | Formatted with MLA office letterhead, date, title, data table, summary section |
| **Excel Format** | Raw data with column headers, ready for further analysis |
| **Access** | MLA and PA only |

---

### Module 13: 🔔 Notification Center (सूचना केंद्र)

**Purpose:** In-app notification system keeping staff informed of relevant updates in real-time.

##### UI Components

| Component | Detail |
|-----------|--------|
| **Bell Icon** | Fixed in top navigation bar. Shows unread count as a red badge. |
| **Dropdown Panel** | Clicking bell opens a dropdown showing latest 10 notifications |
| **Full Page** | "View All" link opens full notification history page |
| **Mark as Read** | Click to mark individual notification as read, or "Mark all as read" |

##### Notification Events

| Event | Notification Text | Recipients |
|-------|-------------------|------------|
| New nivedan registered | "New complaint registered: {subject} — {category}" | PA |
| Nivedan assigned | "Complaint {tracking_id} assigned to you" | Assigned staff |
| Nivedan status changed | "Complaint {tracking_id} status → {new_status}" | PA |
| Nivedan overdue (Level 1) | "⚠️ Complaint {tracking_id} is overdue — no action in {X} days" | PA |
| Nivedan overdue (Level 2) | "🔴 CRITICAL: Complaint {tracking_id} escalated — overdue {X} days" | MLA, PA |
| New inward entry | "New inward entry: {subject} from {sender}" | PA |
| Dev work status changed | "Project '{name}' status → {status}" | MLA, PA, Assigned Auditor |
| Calendar event reminder | "Upcoming: {event_title} at {time} today" | MLA, PA, Attendees |
| WhatsApp delivery failed | "WhatsApp to {mobile} failed — {message_type}" | PA |
| System alert | "Storage usage at 90%" / "API quota nearing limit" | Admin |

##### Notification Rules by Role

| Role | Sees Notifications For |
|------|----------------------|
| MLA | Level 2 escalations, dev work updates, calendar reminders |
| PA | Everything operational — new nivedans, assignments, status changes, escalations, WhatsApp failures |
| Receptionist | Only their own created entries |
| Auditor | Assigned inspections and dev work tasks |
| Admin | System health alerts only |

---

## 📑 Module Summary Matrix

| # | Module | Marathi | Pillar | Key Entities | Primary Users | Core Output |
|:-:|--------|---------|--------|-------------|---------------|-------------|
| 1 | Inward & Outward | आवक-जावक | Office Admin | inward_entries, outward_entries | Receptionist, PA | Digital Letter Archive + AI Drafts |
| 2 | Visitor Book | व्हिजिटर बुक | Office Admin | visitors | Receptionist | Footfall Analytics + Repeat Detection |
| 3 | Nivedan | निवेदन | Public Grievances | nivedans, nivedan_timeline | Receptionist, PA | Complaint Tracking + WhatsApp Updates |
| 4 | Development Works | विकासकामे | Infrastructure | development_works | PA, Auditor | Progress Reports + Budget Tracking |
| 5 | Karyakarta Master | कार्यकर्ता | Cadre Network | karyakartas | PA, Booth Pramukh | Worker Directory + Bulk Import |
| 6 | Gram/Ward Org | ग्राम/वॉर्ड | Geography | villages, wards, talukas | PA, Admin | Area-wise Filtering + Heatmaps |
| 7 | Booth Architecture | बूथ रचना | Cadre Network | booths, verifications | PA, Auditor | Booth Reports + Verification |
| 8 | Dashboard | डॅशबोर्ड | Intelligence | — (aggregated views) | MLA, PA | 13 KPIs + 7 Charts + Activity Feed |
| 9 | Calendar | कॅलेंडर | Operations | calendar_events | MLA, PA | Schedule + Color-coded Events |
| 10 | WhatsApp Engine | व्हॉट्सअॅप | Automation | whatsapp_logs | PA (compose), Citizens (receive) | Auto Alerts + Broadcasts + Bot |
| 11 | RBAC & Security | सुरक्षा | Security | users, audit_logs | Admin | User Management + Audit Trail |
| 12 | Reports | अहवाल | Analytics | — (generated views) | MLA, PA | 11 Report Types + PDF/Excel Export |
| 13 | Notifications | सूचना केंद्र | Intelligence | notifications | All staff | Bell Icon + Real-time Alerts |

---

## 📑 Enum / Dropdown Values — Quick Reference

### Nivedan Categories (14)

| # | English | Marathi |
|:-:|---------|---------|
| 1 | Water Supply | पाणीपुरवठा |
| 2 | Road / Drainage | रस्ते / गटार |
| 3 | Electricity | वीजपुरवठा |
| 4 | Land / Revenue | जमीन / महसूल |
| 5 | Education | शिक्षण |
| 6 | Health / Medical | आरोग्य |
| 7 | Pension / Social Welfare | पेन्शन / समाजकल्याण |
| 8 | Ration Card / PDS | रेशनकार्ड |
| 9 | Caste / Income Certificate | जात / उत्पन्न प्रमाणपत्र |
| 10 | Housing / Awas Yojana | घरकुल / आवास योजना |
| 11 | Agriculture | शेती |
| 12 | Employment / Rojgar | रोजगार |
| 13 | Police / Law & Order | पोलीस |
| 14 | General / Other | इतर |

### Nivedan Statuses (8)

| # | Status | Marathi | Color |
|:-:|--------|---------|-------|
| 1 | Pending | प्रलंबित | 🟡 Yellow |
| 2 | In Progress | कार्यवाही सुरू | 🔵 Blue |
| 3 | Forwarded to Dept | विभागाकडे वर्ग | 🟠 Orange |
| 4 | Awaiting Response | प्रतिसाद प्रतीक्षा | 🟣 Purple |
| 5 | Resolved | निकाली | 🟢 Green |
| 6 | Rejected | नाकारले | 🔴 Red |
| 7 | Cancelled | रद्द | ⚪ Gray |
| 8 | Archived | संग्रहित | ⚫ Dark Gray |

### Visitor Purpose Categories (10)

| # | English | Marathi |
|:-:|---------|---------|
| 1 | Grievance / Complaint | तक्रार |
| 2 | Courtesy Call / VIP Visit | सद्भेट |
| 3 | Party Work | पक्ष काम |
| 4 | Invitation | निमंत्रण |
| 5 | Personal Meeting | वैयक्तिक भेट |
| 6 | Document Submission | कागदपत्रे जमा |
| 7 | Follow-up on Previous Complaint | पाठपुरावा |
| 8 | Recommendation Request | शिफारसपत्र |
| 9 | General Inquiry | सामान्य चौकशी |
| 10 | Other | इतर |

### Development Work Categories (13)

| # | English | Marathi |
|:-:|---------|---------|
| 1 | Road Construction | रस्ते बांधकाम |
| 2 | Drainage / Sewage | गटार / नाले |
| 3 | Water Supply Pipeline | पाणीपुरवठा |
| 4 | Hospital / Health Center | रुग्णालय |
| 5 | School Building | शाळा बांधकाम |
| 6 | Community Hall | समाजमंदिर |
| 7 | Street Lighting | रस्ता दिवे |
| 8 | Bridge / Culvert | पूल / मोरी |
| 9 | Electrification | विद्युतीकरण |
| 10 | Garden / Park | उद्यान / बगीचा |
| 11 | Toilet / Sanitation | शौचालय |
| 12 | Crematorium / Burial Ground | स्मशानभूमी |
| 13 | Other | इतर |

### Funding Sources (9)

| # | English | Marathi |
|:-:|---------|---------|
| 1 | MLALAD (MLA Fund) | आमदार निधी |
| 2 | Zilla Parishad Fund | जिल्हा परिषद निधी |
| 3 | State Government Grant | राज्य शासन अनुदान |
| 4 | Central Government Grant | केंद्र शासन अनुदान |
| 5 | Municipal Corporation Fund | महानगरपालिका निधी |
| 6 | Gram Panchayat Fund | ग्रामपंचायत निधी |
| 7 | MPLAD (MP Fund) | खासदार निधी |
| 8 | CSR (Corporate) | सीएसआर |
| 9 | Other / Mixed | इतर / मिश्र |

### Karyakarta Designations (6)

| # | English | Marathi |
|:-:|---------|---------|
| 1 | Booth Pramukh | बूथ प्रमुख |
| 2 | Ward Head | वॉर्ड प्रमुख |
| 3 | Shakti Kendra Pramukh | शक्ती केंद्र प्रमुख |
| 4 | Karyakarta | कार्यकर्ता |
| 5 | Volunteer | स्वयंसेवक |
| 6 | Other | इतर |

---
