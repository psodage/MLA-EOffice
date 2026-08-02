# MLA E-Office — API Specification

> **Complete REST API Reference — Endpoints, Request/Response Formats, Authentication, Pagination, Error Codes, and Query Parameters**
> 
> Base URL: `https://api.eoffice.mlaname.in/api/v1`
> 
> *Related Documents:* [ARCHITECTURE.md](file:///s:/MLA%20E%20-%20Office/ARCHITECTURE.md) | [DATA_MODELS.md](file:///s:/MLA%20E%20-%20Office/DATA_MODELS.md) | [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md)

---

## 1. API Conventions

### Base URL

| Environment | Base URL |
|------------|---------|
| Development | `http://localhost:5000/api/v1` |
| Production | `https://api.eoffice.mlaname.in/api/v1` |

### Content Type

All requests and responses use `application/json` unless uploading files (which use `multipart/form-data`).

```
Content-Type: application/json
Accept: application/json
```

### Authentication Header

All protected endpoints require a JWT Bearer token:

```
Authorization: Bearer <access_token>
```

### Standard Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 25,
    "totalItems": 143,
    "totalPages": 6
  }
}
```

- `data` — Object (single entity) or Array (list of entities)
- `meta` — Present only on paginated list endpoints

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "NIVEDAN_NOT_FOUND",
    "message": "Nivedan with tracking ID NIV-2026-00999 not found",
    "statusCode": 404,
    "details": {}
  }
}
```

---

## 2. Pagination

All list endpoints use **page-based pagination**.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Integer | `1` | Page number (1-indexed) |
| `limit` | Integer | `25` | Items per page (max: 100) |

### Response Meta

```json
{
  "meta": {
    "page": 2,
    "limit": 25,
    "totalItems": 143,
    "totalPages": 6
  }
}
```

### Example

```
GET /api/v1/nivedans?page=2&limit=25
```

---

## 3. Sorting

All list endpoints support **multi-field sorting**.

### Format

```
?sort=field1:direction,field2:direction
```

| Direction | Meaning |
|-----------|---------|
| `asc` | Ascending (A→Z, 0→9, oldest first) |
| `desc` | Descending (Z→A, 9→0, newest first) |

### Examples

```
GET /api/v1/nivedans?sort=created_at:desc
GET /api/v1/nivedans?sort=priority:desc,created_at:asc
GET /api/v1/devworks?sort=status:asc,budget_allocated:desc
```

### Default Sort per Endpoint

| Endpoint | Default Sort |
|----------|-------------|
| Nivedans | `created_at:desc` |
| Inward entries | `date_received:desc` |
| Outward entries | `date_sent:desc` |
| Visitors | `created_at:desc` |
| Development works | `created_at:desc` |
| Karyakartas | `full_name:asc` |
| Audit logs | `created_at:desc` |
| Notifications | `created_at:desc` |

---

## 4. Filtering

List endpoints support filtering via query parameters. Multiple filters are combined with `AND` logic.

### Common Filter Patterns

| Pattern | Example | Description |
|---------|---------|-------------|
| Exact match | `?status=PENDING` | Single value match |
| Multiple values | `?status=PENDING,IN_PROGRESS` | Comma-separated OR |
| Date range | `?date_from=2026-01-01&date_to=2026-01-31` | Inclusive range |
| Search | `?search=keyword` | FULLTEXT search across searchable fields |
| Foreign key | `?category_id=3` | Filter by related entity |
| Boolean | `?is_active=true` | Boolean filter |

---

## 5. Authentication Endpoints

### `POST /auth/login`

Login and receive JWT tokens.

**Request:**
```json
{
  "username": "pa_suresh",
  "password": "SecurePass@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400,
    "user": {
      "id": 2,
      "fullName": "Suresh Patil",
      "username": "pa_suresh",
      "role": "PA",
      "mobile": "9876543210",
      "profilePhotoUrl": "https://res.cloudinary.com/...",
      "accessibleModules": ["inward", "outward", "nivedan", "visitor", "devworks", "karyakarta", "booth", "geography", "calendar", "whatsapp", "dashboard", "reports", "notifications"]
    }
  }
}
```

**Error Responses:**

| Status | Code | Condition |
|:---:|------|-----------|
| 401 | `INVALID_CREDENTIALS` | Wrong username or password |
| 423 | `ACCOUNT_LOCKED` | 5+ failed attempts in 15 minutes |
| 403 | `ACCOUNT_INACTIVE` | User is_active = false |
| 403 | `OUTSIDE_OFFICE_HOURS` | Role restricted to office hours |

---

### `POST /auth/refresh`

Refresh an expired access token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...(new)...",
    "expiresIn": 86400
  }
}
```

---

### `POST /auth/logout`

Invalidate the refresh token.

**Request:** No body needed. Uses `Authorization: Bearer` header.

**Success Response (200):**
```json
{
  "success": true,
  "data": { "message": "Logged out successfully" }
}
```

---

### `GET /auth/me`

Get current authenticated user profile.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "fullName": "Suresh Patil",
    "username": "pa_suresh",
    "role": "PA",
    "mobile": "9876543210",
    "email": "suresh@example.com",
    "profilePhotoUrl": "https://res.cloudinary.com/...",
    "accessibleModules": ["inward", "outward", "nivedan", "..."],
    "lastLoginAt": "2026-08-01T04:30:00.000Z",
    "createdAt": "2026-01-15T10:00:00.000Z"
  }
}
```

---

## 6. Nivedan Endpoints (Full Examples)

### `POST /nivedans` — Create New Nivedan

> **Roles:** `PA`, `RECEPTIONIST`

**Request:**
```json
{
  "citizenName": "राम शिंदे",
  "citizenMobile": "9876543210",
  "citizenAddressLine": "गाव - वडगाव, ता. हवेली",
  "citizenCity": "पुणे",
  "citizenPincode": "411041",
  "citizenState": "Maharashtra",
  "citizenDob": "1985-05-15",
  "villageId": 42,
  "wardId": null,
  "talukaId": 3,
  "categoryId": 1,
  "subCategoryId": 4,
  "subject": "गावात गेल्या ५ दिवसांपासून पाणी पुरवठा बंद",
  "description": "वडगाव गावात गेल्या ५ दिवसांपासून पाणी पुरवठा पूर्णतः बंद आहे. पाइपलाइन फुटलेली असून दुरुस्ती झालेली नाही.",
  "attachmentUrls": [
    "https://res.cloudinary.com/xxx/nivedan/doc1.pdf"
  ]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 143,
    "trackingId": "NIV-2026-00143",
    "citizenName": "राम शिंदे",
    "citizenMobile": "9876543210",
    "citizenAddressLine": "गाव - वडगाव, ता. हवेली",
    "citizenCity": "पुणे",
    "citizenPincode": "411041",
    "citizenState": "Maharashtra",
    "citizenDob": "1985-05-15",
    "village": { "id": 42, "nameEn": "Vadgaon", "nameMr": "वडगाव" },
    "ward": null,
    "taluka": { "id": 3, "nameEn": "Haveli", "nameMr": "हवेली" },
    "category": { "id": 1, "nameEn": "Water Supply", "nameMr": "पाणीपुरवठा", "code": "WATER_SUPPLY" },
    "subCategory": { "id": 4, "nameEn": "Pipeline leak / burst", "nameMr": "पाइपलाइन गळती / फुटणे" },
    "subject": "गावात गेल्या ५ दिवसांपासून पाणी पुरवठा बंद",
    "description": "वडगाव गावात गेल्या ५ दिवसांपासून...",
    "attachmentUrls": ["https://res.cloudinary.com/xxx/nivedan/doc1.pdf"],
    "status": "PENDING",
    "priority": "MEDIUM",
    "escalationLevel": "NONE",
    "assignedTo": null,
    "departmentForwardedTo": { "id": 10, "nameEn": "Water Supply Department", "nameMr": "पाणीपुरवठा विभाग" },
    "linkedVisitorId": null,
    "whatsappNotified": false,
    "createdBy": { "id": 3, "fullName": "Sita Reseptionist", "role": "RECEPTIONIST" },
    "createdAt": "2026-08-01T04:45:00.000Z",
    "updatedAt": "2026-08-01T04:45:00.000Z",
    "citizenHistory": {
      "previousComplaints": 2,
      "nivedans": [
        { "trackingId": "NIV-2026-00089", "subject": "रस्ता खराब", "status": "RESOLVED", "createdAt": "2026-05-10" },
        { "trackingId": "NIV-2025-00412", "subject": "वीज समस्या", "status": "RESOLVED", "createdAt": "2025-11-20" }
      ]
    }
  }
}
```

**Error Responses:**

| Status | Code | Condition |
|:---:|------|-----------|
| 400 | `VALIDATION_ERROR` | Missing required fields |
| 400 | `INVALID_CATEGORY` | category_id doesn't exist |
| 400 | `INVALID_VILLAGE` | village_id doesn't exist |
| 403 | `FORBIDDEN` | Role cannot create nivedans |

---

### `GET /nivedans` — List Nivedans

> **Roles:** `MLA`, `PA` (all), `RECEPTIONIST` (own created), `AUDITOR` (assigned)

**Query Parameters:**

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `page` | Integer | `1` | Page number |
| `limit` | Integer | `25` | Items per page |
| `sort` | String | `created_at:desc` | Sort fields |
| `search` | String | `पाणी` | FULLTEXT search (citizen_name, subject) |
| `status` | String | `PENDING,IN_PROGRESS` | Comma-separated status filter |
| `category_id` | Integer | `1` | Filter by category |
| `village_id` | Integer | `42` | Filter by village |
| `ward_id` | Integer | `5` | Filter by ward |
| `assigned_to` | Integer | `7` | Filter by assigned user ID |
| `priority` | String | `HIGH` | Filter by priority |
| `escalation_level` | String | `LEVEL_1,LEVEL_2` | Filter escalated nivedans |
| `date_from` | Date | `2026-01-01` | Created after this date |
| `date_to` | Date | `2026-01-31` | Created before this date |
| `is_escalated` | Boolean | `true` | Only escalated nivedans |

**Example Request:**
```
GET /api/v1/nivedans?status=PENDING,IN_PROGRESS&category_id=1&sort=created_at:desc&page=1&limit=25
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 143,
      "trackingId": "NIV-2026-00143",
      "citizenName": "राम शिंदे",
      "citizenMobile": "9876543210",
      "category": { "id": 1, "nameEn": "Water Supply", "nameMr": "पाणीपुरवठा" },
      "subject": "गावात गेल्या ५ दिवसांपासून पाणी पुरवठा बंद",
      "status": "PENDING",
      "priority": "MEDIUM",
      "escalationLevel": "NONE",
      "assignedTo": null,
      "village": { "id": 42, "nameMr": "वडगाव" },
      "createdAt": "2026-08-01T04:45:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 25,
    "totalItems": 143,
    "totalPages": 6
  }
}
```

> **Note:** List endpoints return **summary fields** only. Use `GET /nivedans/:id` for full detail with timeline.

---

### `GET /nivedans/:id` — Nivedan Detail (with Timeline)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 143,
    "trackingId": "NIV-2026-00143",
    "citizenName": "राम शिंदे",
    "citizenMobile": "9876543210",
    "citizenAddressLine": "गाव - वडगाव, ता. हवेली",
    "citizenCity": "पुणे",
    "citizenPincode": "411041",
    "citizenDob": "1985-05-15",
    "village": { "id": 42, "nameEn": "Vadgaon", "nameMr": "वडगाव" },
    "taluka": { "id": 3, "nameEn": "Haveli", "nameMr": "हवेली" },
    "category": { "id": 1, "nameEn": "Water Supply", "nameMr": "पाणीपुरवठा", "code": "WATER_SUPPLY" },
    "subCategory": { "id": 4, "nameEn": "Pipeline leak / burst", "nameMr": "पाइपलाइन गळती / फुटणे" },
    "subject": "गावात गेल्या ५ दिवसांपासून पाणी पुरवठा बंद",
    "description": "वडगाव गावात गेल्या ५ दिवसांपासून...",
    "attachmentUrls": ["https://res.cloudinary.com/xxx/nivedan/doc1.pdf"],
    "status": "IN_PROGRESS",
    "priority": "MEDIUM",
    "escalationLevel": "NONE",
    "assignedTo": { "id": 7, "fullName": "Ramesh Kadam", "role": "PA" },
    "departmentForwardedTo": { "id": 10, "nameEn": "Water Supply Department" },
    "resolutionNotes": null,
    "resolvedAt": null,
    "whatsappNotified": true,
    "linkedVisitorId": 892,
    "createdBy": { "id": 3, "fullName": "Sita Receptionist" },
    "createdAt": "2026-08-01T04:45:00.000Z",
    "updatedAt": "2026-08-03T09:30:00.000Z",

    "timeline": [
      {
        "id": 301,
        "actionType": "CREATED",
        "oldStatus": null,
        "newStatus": "PENDING",
        "note": null,
        "isInternal": false,
        "performedBy": { "id": 3, "fullName": "Sita Receptionist" },
        "createdAt": "2026-08-01T04:45:00.000Z"
      },
      {
        "id": 302,
        "actionType": "ASSIGNED",
        "oldStatus": null,
        "newStatus": null,
        "assignedToUserId": 7,
        "department": { "id": 10, "nameEn": "Water Supply Department" },
        "note": "Auto-routed to Water Supply Dept",
        "isInternal": true,
        "performedBy": { "id": 0, "fullName": "System" },
        "createdAt": "2026-08-01T04:45:01.000Z"
      },
      {
        "id": 303,
        "actionType": "WHATSAPP_SENT",
        "note": "Acknowledgment sent to citizen",
        "isInternal": true,
        "performedBy": { "id": 0, "fullName": "System" },
        "createdAt": "2026-08-01T04:46:00.000Z"
      },
      {
        "id": 304,
        "actionType": "STATUS_CHANGE",
        "oldStatus": "PENDING",
        "newStatus": "IN_PROGRESS",
        "note": "ZP कार्यालयाशी संपर्क साधला. साइट व्हिजिट शेड्यूल.",
        "isInternal": true,
        "performedBy": { "id": 7, "fullName": "Ramesh Kadam" },
        "createdAt": "2026-08-03T09:30:00.000Z"
      }
    ],

    "citizenHistory": {
      "previousComplaints": 2,
      "nivedans": [
        { "trackingId": "NIV-2026-00089", "subject": "रस्ता खराब", "status": "RESOLVED", "createdAt": "2026-05-10" },
        { "trackingId": "NIV-2025-00412", "subject": "वीज समस्या", "status": "RESOLVED", "createdAt": "2025-11-20" }
      ]
    },

    "whatsappHistory": [
      {
        "id": 501,
        "messageType": "NIVEDAN_ACK",
        "deliveryStatus": "READ",
        "sentAt": "2026-08-01T04:46:00.000Z",
        "readAt": "2026-08-01T05:10:00.000Z"
      }
    ]
  }
}
```

---

### `PATCH /nivedans/:id/status` — Change Status

> **Roles:** `PA`

**Request:**
```json
{
  "status": "RESOLVED",
  "resolutionNotes": "पाइपलाइन दुरुस्ती पूर्ण. साइट व्हिजिटद्वारे पुष्टी."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 143,
    "trackingId": "NIV-2026-00143",
    "status": "RESOLVED",
    "resolutionNotes": "पाइपलाइन दुरुस्ती पूर्ण...",
    "resolvedAt": "2026-08-07T10:00:00.000Z",
    "updatedAt": "2026-08-07T10:00:00.000Z"
  }
}
```

**Side Effects:**
- Inserts `nivedan_timeline` entry (action=RESOLVED)
- Queues WhatsApp resolution alert to citizen
- Creates notification for MLA

---

### `POST /nivedans/:id/notes` — Add Internal Note

> **Roles:** `PA`, Assigned Staff

**Request:**
```json
{
  "note": "ZP अभियंत्याशी बोललो. उद्या साइट व्हिजिट करणार.",
  "isInternal": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 305,
    "nivedanId": 143,
    "actionType": "NOTE_ADDED",
    "note": "ZP अभियंत्याशी बोललो...",
    "isInternal": true,
    "performedBy": { "id": 7, "fullName": "Ramesh Kadam" },
    "createdAt": "2026-08-04T11:00:00.000Z"
  }
}
```

---

### `GET /nivedans/citizen/:mobile` — Citizen History

> **Roles:** `PA`, `RECEPTIONIST`

```
GET /api/v1/nivedans/citizen/9876543210
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "mobile": "9876543210",
    "totalComplaints": 3,
    "nivedans": [
      { "id": 143, "trackingId": "NIV-2026-00143", "subject": "पाणी पुरवठा बंद", "status": "IN_PROGRESS", "category": "Water Supply", "createdAt": "2026-08-01" },
      { "id": 89, "trackingId": "NIV-2026-00089", "subject": "रस्ता खराब", "status": "RESOLVED", "category": "Road / Drainage", "createdAt": "2026-05-10" },
      { "id": 412, "trackingId": "NIV-2025-00412", "subject": "वीज समस्या", "status": "RESOLVED", "category": "Electricity", "createdAt": "2025-11-20" }
    ]
  }
}
```

---

## 7. Inward Endpoints (Full Examples)

### `POST /inward` — Create Inward Entry

> **Roles:** `PA`, `RECEPTIONIST`

**Request:**
```json
{
  "dateReceived": "2026-08-01",
  "senderName": "जिल्हाधिकारी, पुणे",
  "senderDesignation": "जिल्हाधिकारी",
  "senderDepartmentId": 1,
  "subject": "आमदार निधी वापर बाबत माहिती",
  "description": "आमदार स्थानिक क्षेत्र विकास निधीच्या वापराबाबत तपशील मागवणारे पत्र.",
  "tags": ["MLALAD", "Finance"],
  "priority": "HIGH",
  "attachmentUrls": ["https://res.cloudinary.com/xxx/inward/letter1.pdf"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 78,
    "inwardNumber": "INW/2026/0078",
    "dateReceived": "2026-08-01",
    "senderName": "जिल्हाधिकारी, पुणे",
    "senderDesignation": "जिल्हाधिकारी",
    "senderDepartment": { "id": 1, "nameEn": "District Collector Office", "nameMr": "जिल्हाधिकारी कार्यालय" },
    "subject": "आमदार निधी वापर बाबत माहिती",
    "description": "आमदार स्थानिक क्षेत्र विकास निधीच्या वापराबाबत...",
    "tags": ["MLALAD", "Finance"],
    "priority": "HIGH",
    "attachmentUrls": ["https://res.cloudinary.com/xxx/inward/letter1.pdf"],
    "assignedTo": null,
    "status": "PENDING",
    "createdBy": { "id": 3, "fullName": "Sita Receptionist" },
    "createdAt": "2026-08-01T05:00:00.000Z"
  }
}
```

---

### `GET /inward` — List Inward Entries

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page`, `limit`, `sort` | — | Standard pagination/sorting |
| `search` | String | Search inward_number, sender_name, subject |
| `status` | String | `PENDING,ASSIGNED,IN_PROGRESS,COMPLETED` |
| `priority` | String | `HIGH,MEDIUM,LOW` |
| `sender_department_id` | Integer | Filter by department |
| `assigned_to` | Integer | Filter by assigned user |
| `date_from`, `date_to` | Date | Date range filter |
| `tags` | String | Filter by tag (e.g., `?tags=MLALAD`) |

---

## 8. Outward Endpoints (Full Examples)

### `POST /outward/ai-draft` — Generate AI Letter Draft

> **Roles:** `PA`

**Request:**
```json
{
  "referenceInwardId": 78,
  "recipientDepartmentId": 1,
  "subject": "आमदार निधी वापर तपशील",
  "context": "कलेक्टर कार्यालयाने आमदार निधी वापराची माहिती मागवली आहे. 2025-26 मध्ये मंजूर कामांची यादी पाठवायची आहे.",
  "language": "marathi",
  "tone": "formal"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "draftText": "सेवेशी,\nमा. जिल्हाधिकारी,\nपुणे.\n\nविषय: आमदार स्थानिक क्षेत्र विकास निधी वापर तपशील बाबत.\n\nसंदर्भ: आपले पत्र क्र. INW/2026/0078, दिनांक 01/08/2026.\n\nमहोदय,\n\nउपरोक्त संदर्भित पत्रान्वये आमदार स्थानिक क्षेत्र विकास निधीच्या वापराबाबत खालीलप्रमाणे माहिती सादर करत आहे...\n\nआपला विश्वासू,\n\n(सही)\nमा. आमदार\nउदाहरण मतदारसंघ",
    "referenceInward": { "id": 78, "inwardNumber": "INW/2026/0078", "subject": "आमदार निधी वापर बाबत माहिती" },
    "isEditable": true
  }
}
```

---

### `POST /outward/:id/finalize` — Finalize Letter

> **Roles:** `PA`

**Request:**
```json
{
  "bodyText": "सेवेशी,\nमा. जिल्हाधिकारी,\nपुणे.\n\n(edited AI draft text)...",
  "recipientName": "मा. जिल्हाधिकारी",
  "recipientDesignation": "जिल्हाधिकारी",
  "recipientDepartmentId": 1,
  "subject": "आमदार निधी वापर तपशील"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 45,
    "outwardNumber": "OUT/2026/0045",
    "dateSent": "2026-08-02",
    "recipientName": "मा. जिल्हाधिकारी",
    "subject": "आमदार निधी वापर तपशील",
    "letterPdfUrl": "https://res.cloudinary.com/xxx/outward/OUT_2026_0045.pdf",
    "isAiDrafted": true,
    "referenceInward": { "id": 78, "inwardNumber": "INW/2026/0078" },
    "approvedBy": { "id": 2, "fullName": "Suresh PA" },
    "createdAt": "2026-08-02T06:00:00.000Z"
  }
}
```

---

## 9. Visitor Endpoints (Full Examples)

### `POST /visitors` — Register Visitor

> **Roles:** `PA`, `RECEPTIONIST`

**Request:**
```json
{
  "visitorName": "सुनील जाधव",
  "mobile": "9123456789",
  "addressLine": "मु.पो. लोणावळा",
  "villageId": 15,
  "purpose": "GRIEVANCE",
  "purposeDescription": "पाणी पुरवठा तक्रार दाखल करण्यासाठी"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 892,
    "visitorName": "सुनील जाधव",
    "mobile": "9123456789",
    "purpose": "GRIEVANCE",
    "purposeDescription": "पाणी पुरवठा तक्रार दाखल करण्यासाठी",
    "checkInTime": "2026-08-01T04:30:00.000Z",
    "checkOutTime": null,
    "isRepeatVisitor": true,
    "previousVisitCount": 3,
    "linkedNivedanId": null,
    "createdBy": { "id": 3, "fullName": "Sita Receptionist" },
    "createdAt": "2026-08-01T04:30:00.000Z"
  }
}
```

### `GET /visitors/check-repeat/:mobile` — Check Repeat Visitor

```
GET /api/v1/visitors/check-repeat/9123456789
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "isRepeat": true,
    "visitCount": 3,
    "lastVisit": {
      "date": "2026-06-15",
      "purpose": "FOLLOWUP"
    },
    "activeNivedans": [
      { "trackingId": "NIV-2026-00089", "subject": "रस्ता खराब", "status": "IN_PROGRESS" }
    ]
  }
}
```

---

## 10. Development Works Endpoints (Full Examples)

### `POST /devworks` — Create Project

> **Roles:** `PA`

**Request:**
```json
{
  "projectName": "वडगाव - आंबेगाव CC रस्ता बांधकाम",
  "category": "ROAD",
  "location": "वडगाव ते आंबेगाव रस्ता, ता. हवेली",
  "villageId": 42,
  "talukaId": 3,
  "fundingSource": "MLALAD",
  "budgetAllocated": 1500000,
  "contractorName": "शिवाजी कन्स्ट्रक्शन",
  "contractorContact": "9876500000",
  "startDate": "2026-07-15",
  "expectedCompletionDate": "2026-10-15",
  "description": "500 मीटर CC रस्ता बांधकाम"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 28,
    "projectName": "वडगाव - आंबेगाव CC रस्ता बांधकाम",
    "category": "ROAD",
    "location": "वडगाव ते आंबेगाव रस्ता, ता. हवेली",
    "village": { "id": 42, "nameMr": "वडगाव" },
    "fundingSource": "MLALAD",
    "budgetAllocated": 1500000,
    "budgetSpent": 0,
    "contractorName": "शिवाजी कन्स्ट्रक्शन",
    "startDate": "2026-07-15",
    "expectedCompletionDate": "2026-10-15",
    "status": "SANCTIONED",
    "progressPercentage": 0,
    "createdAt": "2026-08-01T05:00:00.000Z"
  }
}
```

### `POST /devworks/:id/photos` — Upload Photos

> **Roles:** `PA`, `AUDITOR`. Content-Type: `multipart/form-data`

**Request (form-data):**
```
photos[]: (file) site_photo_1.jpg
photos[]: (file) site_photo_2.jpg
photoStage: "DURING"
caption: "रस्ता बांधकाम प्रगती - 50% पूर्ण"
geoLatitude: 18.5204
geoLongitude: 73.8567
```

**Success Response (201):**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "photoUrl": "https://res.cloudinary.com/xxx/devworks/28/photo1.jpg",
      "thumbnailUrl": "https://res.cloudinary.com/xxx/devworks/28/photo1_thumb.jpg",
      "photoStage": "DURING",
      "geoLatitude": 18.5204,
      "geoLongitude": 73.8567,
      "caption": "रस्ता बांधकाम प्रगती - 50% पूर्ण",
      "uploadedBy": { "id": 4, "fullName": "Auditor Name" },
      "createdAt": "2026-08-15T07:00:00.000Z"
    }
  ]
}
```

---

## 11. Karyakarta Endpoints (Full Examples)

### `POST /karyakartas` — Add Worker

> **Roles:** `PA`, `BOOTH_PRAMUKH` (own booth only)

**Request:**
```json
{
  "fullName": "संजय पाटील",
  "mobile": "9988776655",
  "altMobile": "9988776600",
  "dateOfBirth": "1990-03-20",
  "addressLine": "मु.पो. वडगाव",
  "villageId": 42,
  "boothId": 105,
  "designation": "KARYAKARTA"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 2501,
    "fullName": "संजय पाटील",
    "mobile": "9988776655",
    "dateOfBirth": "1990-03-20",
    "village": { "id": 42, "nameMr": "वडगाव" },
    "booth": { "id": 105, "boothNumber": 105 },
    "designation": "KARYAKARTA",
    "isActive": true,
    "createdAt": "2026-08-01T06:00:00.000Z"
  }
}
```

| Status | Code | Condition |
|:---:|------|-----------|
| 409 | `DUPLICATE_MOBILE` | Mobile number already exists in karyakartas |

### `POST /karyakartas/bulk-import` — Excel Import

> **Roles:** `PA`. Content-Type: `multipart/form-data`

**Request:**
```
file: (xlsx) karyakartas_import.xlsx
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRows": 150,
    "imported": 142,
    "skipped": 5,
    "errors": 3,
    "errorDetails": [
      { "row": 23, "field": "mobile", "error": "Duplicate mobile: 9876543210" },
      { "row": 67, "field": "booth_number", "error": "Booth 999 not found" },
      { "row": 112, "field": "mobile", "error": "Invalid mobile number format" }
    ]
  }
}
```

---

## 12. Dashboard Endpoints

### `GET /dashboard/kpis` — All KPI Counters

> **Roles:** `MLA`, `PA`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "nivedans": {
      "today": 8,
      "thisWeek": 42,
      "thisMonth": 156,
      "total": 2450
    },
    "nivedansByStatus": {
      "pending": 89,
      "inProgress": 45,
      "resolved": 2100,
      "overdue": 12
    },
    "visitors": {
      "today": 23
    },
    "devWorks": {
      "active": 15,
      "completed": 42,
      "delayed": 3
    },
    "karyakartas": {
      "totalActive": 5420
    },
    "inward": {
      "today": 5
    },
    "outward": {
      "today": 3
    },
    "whatsapp": {
      "sentToday": 47
    }
  }
}
```

### `GET /dashboard/charts/:chartType` — Chart Data

**Chart Types:**

| chartType | Returns |
|-----------|---------|
| `nivedan-by-status` | `{ labels: [...], values: [...] }` |
| `nivedan-monthly-trend` | `{ months: [...], counts: [...] }` |
| `visitor-footfall` | `{ dates: [...], counts: [...] }` |
| `devwork-by-status` | `{ labels: [...], values: [...] }` |
| `area-complaints` | `{ areas: [...], counts: [...] }` |
| `category-complaints` | `{ categories: [...], counts: [...] }` |

---

## 13. Other Endpoints (Compact Reference)

### WhatsApp

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `POST` | `/whatsapp/broadcast` | Send broadcast. Body: `{ message, audienceType, audienceFilter, scheduleAt? }` | PA |
| `GET` | `/whatsapp/logs?page=1&type=NIVEDAN_ACK&status=FAILED` | View message logs | MLA, PA |
| `POST` | `/whatsapp/retry/:logId` | Retry failed message | PA |
| `POST` | `/whatsapp/webhook` | Meta webhook receiver (no auth, signature verified) | Meta |

### Calendar

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/calendar?month=8&year=2026` | List events for month | MLA, PA, Staff |
| `POST` | `/calendar` | Create event. Body: `{ title, eventType, eventDate, startTime, endTime, location, attendees[] }` | MLA, PA |
| `PATCH` | `/calendar/:id` | Update event | MLA, PA |
| `DELETE` | `/calendar/:id` | Cancel event (soft) | MLA, PA |

### Booths

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/booths?village_id=42&verification_status=NOT_VERIFIED` | List booths | MLA, PA, Auditor |
| `GET` | `/booths/:id` | Booth detail + workers + pramukh | MLA, PA, Auditor |
| `POST` | `/booths/:id/verify` | Submit verification. Body: `{ verificationStatus, checklistResults[], comments, photoUrls[] }` | Auditor |
| `PATCH` | `/booths/:id/pramukh` | Assign pramukh. Body: `{ boothPramukhId }` | PA |

### Geography

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/geography/talukas` | List all talukas | All |
| `GET` | `/geography/gram-panchayats?taluka_id=3` | List GPs in taluka | All |
| `GET` | `/geography/villages?gp_id=12` | List villages in GP | All |
| `GET` | `/geography/wards` | List all wards | All |
| `POST` | `/geography/bulk-import` | Import from Excel | Admin, PA |

### Users & RBAC

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/users` | List users | Admin, MLA |
| `POST` | `/users` | Create user. Body: `{ fullName, username, password, role, mobile, accessibleModules[] }` | Admin |
| `PATCH` | `/users/:id` | Update user | Admin |
| `PATCH` | `/users/:id/deactivate` | Deactivate user | Admin |
| `POST` | `/users/:id/reset-password` | Reset password. Returns `{ temporaryPassword }` | Admin |
| `POST` | `/users/delegate` | PA delegation. Body: `{ delegatedTo, expiresAt }` | PA |

### Notifications

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/notifications?page=1&limit=20` | Get user's notifications | All (own) |
| `GET` | `/notifications/unread-count` | Get unread count `{ count: 5 }` | All |
| `PATCH` | `/notifications/:id/read` | Mark as read | All (own) |
| `PATCH` | `/notifications/read-all` | Mark all as read | All (own) |

### Reports

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `POST` | `/reports/generate` | Generate report. Body: `{ reportCode, filters, format: "pdf"/"excel" }`. Returns `{ downloadUrl }` | MLA, PA |
| `GET` | `/reports/download/:id` | Download generated file | MLA, PA |

### Search

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/search?q=keyword` | Global search. Returns `{ nivedans[], inward[], visitors[], karyakartas[], devworks[] }` (role-filtered) | All |

### Upload

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `POST` | `/upload/direct-token` | Get Cloudinary signed params for <2MB direct upload | All auth |
| `POST` | `/upload` | Server-side upload for ≥2MB. Content-Type: `multipart/form-data` | All auth |

### Audit

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/audit-logs?user_id=3&action=CREATE&module=nivedan&date_from=2026-01-01` | View audit logs | Admin, MLA |

### Public (No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/public/track/:trackingId` | Citizen complaint status |

**Response:**
```json
{
  "success": true,
  "data": {
    "trackingId": "NIV-2026-00143",
    "subject": "गावात गेल्या ५ दिवसांपासून पाणी पुरवठा बंद",
    "status": "IN_PROGRESS",
    "statusMarathi": "कार्यवाही सुरू",
    "category": "पाणीपुरवठा",
    "createdAt": "2026-08-01",
    "lastActionDate": "2026-08-03"
  }
}
```

---

## 14. Custom Error Code Catalog

### HTTP Status Codes Used

| Status | Meaning | When Used |
|:---:|---------|-----------|
| 200 | OK | Successful GET, PATCH |
| 201 | Created | Successful POST (new resource) |
| 400 | Bad Request | Validation errors, malformed request |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Valid token but insufficient role/permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry (e.g., mobile already exists) |
| 423 | Locked | Account locked after failed login attempts |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |

### Custom Error Codes

| Error Code | HTTP Status | Message | Module |
|-----------|:---:|---------|--------|
| `INVALID_CREDENTIALS` | 401 | Invalid username or password | Auth |
| `TOKEN_EXPIRED` | 401 | Access token has expired | Auth |
| `REFRESH_TOKEN_INVALID` | 401 | Refresh token is invalid or expired | Auth |
| `ACCOUNT_INACTIVE` | 403 | User account is deactivated | Auth |
| `ACCOUNT_LOCKED` | 423 | Account locked. Try after 15 minutes | Auth |
| `OUTSIDE_OFFICE_HOURS` | 403 | Access restricted to office hours (10:00 AM – 6:00 PM) | Auth |
| `FORBIDDEN` | 403 | You do not have permission to perform this action | RBAC |
| `MODULE_ACCESS_DENIED` | 403 | You do not have access to this module | RBAC |
| `VALIDATION_ERROR` | 400 | Validation failed (details in error.details) | All |
| `INVALID_MOBILE` | 400 | Mobile number must be 10 digits | All |
| `INVALID_FILE_TYPE` | 400 | Only PDF, JPG, PNG files are allowed | Upload |
| `FILE_TOO_LARGE` | 400 | File size must be under 10MB | Upload |
| `DUPLICATE_MOBILE` | 409 | This mobile number already exists | Karyakarta |
| `DUPLICATE_USERNAME` | 409 | This username already exists | User |
| `NIVEDAN_NOT_FOUND` | 404 | Nivedan with this tracking ID not found | Nivedan |
| `INWARD_NOT_FOUND` | 404 | Inward entry not found | Inward |
| `OUTWARD_NOT_FOUND` | 404 | Outward entry not found | Outward |
| `VISITOR_NOT_FOUND` | 404 | Visitor entry not found | Visitor |
| `DEVWORK_NOT_FOUND` | 404 | Development work not found | DevWorks |
| `KARYAKARTA_NOT_FOUND` | 404 | Karyakarta not found | Karyakarta |
| `BOOTH_NOT_FOUND` | 404 | Booth not found | Booth |
| `CATEGORY_NOT_FOUND` | 404 | Category not found | Category |
| `DEPARTMENT_NOT_FOUND` | 404 | Department not found | Department |
| `USER_NOT_FOUND` | 404 | User not found | User |
| `INVALID_STATUS_TRANSITION` | 400 | Cannot change status from {old} to {new} | Nivedan |
| `CANNOT_DELETE` | 400 | Records cannot be deleted. Use archive or cancel. | All |
| `AI_DRAFT_FAILED` | 500 | AI letter generation failed. Try again. | Outward |
| `WHATSAPP_SEND_FAILED` | 500 | WhatsApp message delivery failed | WhatsApp |
| `CLOUDINARY_UPLOAD_FAILED` | 500 | File upload to cloud storage failed | Upload |
| `REPORT_GENERATION_FAILED` | 500 | Report generation failed | Reports |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests. Try again after 15 minutes | All |

### Validation Error Response Example

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "statusCode": 400,
    "details": {
      "citizenName": "This field is required",
      "citizenMobile": "Mobile number must be 10 digits",
      "categoryId": "Invalid category ID"
    }
  }
}
```

---

## 15. Rate Limiting

| Endpoint Group | Limit | Window |
|---------------|:---:|--------|
| `POST /auth/login` | 5 requests | per 15 minutes per IP |
| All authenticated endpoints | 100 requests | per 15 minutes per user |
| `POST /upload` | 20 requests | per 15 minutes per user |
| `POST /whatsapp/broadcast` | 5 requests | per hour per user |
| `GET /search` | 30 requests | per minute per user |
| `POST /reports/generate` | 10 requests | per hour per user |

**Rate Limit Headers (returned on every response):**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1722534900
```

---

## 16. Nivedan Status Transition Rules

Not all status transitions are valid. The API enforces these rules:

```
PENDING ──────────▶ IN_PROGRESS     ✅ Valid
PENDING ──────────▶ FORWARDED       ✅ Valid
PENDING ──────────▶ REJECTED        ✅ Valid
PENDING ──────────▶ CANCELLED       ✅ Valid
IN_PROGRESS ──────▶ FORWARDED       ✅ Valid
IN_PROGRESS ──────▶ RESOLVED        ✅ Valid
IN_PROGRESS ──────▶ CANCELLED       ✅ Valid
FORWARDED ────────▶ AWAITING_RESPONSE ✅ Valid
FORWARDED ────────▶ RESOLVED        ✅ Valid
AWAITING_RESPONSE ▶ IN_PROGRESS     ✅ Valid (dept responded, now working)
AWAITING_RESPONSE ▶ RESOLVED        ✅ Valid
RESOLVED ─────────▶ ARCHIVED        ✅ Valid (auto after 90 days or manual)
REJECTED ─────────▶ ARCHIVED        ✅ Valid

RESOLVED ─────────▶ PENDING         ❌ Invalid
ARCHIVED ─────────▶ (anything)      ❌ Invalid (final state)
CANCELLED ────────▶ (anything)      ❌ Invalid (final state)
REJECTED ─────────▶ PENDING         ❌ Invalid
```

**Implementation:** The API returns `INVALID_STATUS_TRANSITION` (400) for invalid transitions.

---
