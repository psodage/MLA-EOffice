# MLA E-Office — System Error & Validation Messages Specification

> **Comprehensive Bilingual (English & Marathi) Error Code Dictionary — 15 Domains, ~150 Error Codes, Express.js Middleware**
>
> This document defines every error code, HTTP status, bilingual message, and field reference used across the entire MLA E-Office system. It covers authentication, form validation, all 8 module-specific business rules, file uploads, integrations (WhatsApp, AI, SMS), RBAC, data import, and system-level errors.
>
> *Related Documents:* [GLOSSARY.md](file:///s:/MLA%20E%20-%20Office/GLOSSARY.md) | [TRANSLATIONS.md](file:///s:/MLA%20E%20-%20Office/TRANSLATIONS.md) | [BUSINESS_RULES.md](file:///s:/MLA%20E%20-%20Office/BUSINESS_RULES.md) | [AUTH_SPEC.md](file:///s:/MLA%20E%20-%20Office/AUTH_SPEC.md) | [API_SPEC.md](file:///s:/MLA%20E%20-%20Office/API_SPEC.md)

---

## 1. Standard API Error Response Format

Every backend error follows this unified JSON structure:

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "httpStatus": 401,
    "message": {
      "en": "Invalid username or password.",
      "mr": "अमान्य वापरकर्ता नाव किंवा पासवर्ड."
    },
    "field": null,
    "details": null
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `code` | `string` | Machine-readable unique error code (e.g., `AUTH_TOKEN_EXPIRED`) |
| `httpStatus` | `number` | HTTP status code returned (e.g., 400, 401, 403, 500) |
| `message.en` | `string` | English user-facing error message |
| `message.mr` | `string` | Marathi user-facing error message |
| `field` | `string | null` | Form field name that caused the error (for validation errors) |
| `details` | `object | null` | Additional context (e.g., `{ "from": "PENDING", "to": "ARCHIVED" }` for invalid transitions) |

**Multi-field validation errors** return an array:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "httpStatus": 400,
    "message": {
      "en": "Multiple validation errors occurred.",
      "mr": "अनेक वैधता त्रुटी आढळल्या."
    },
    "field": null,
    "details": {
      "errors": [
        { "field": "mobile", "code": "VAL_MOBILE_INVALID", "message": { "en": "...", "mr": "..." } },
        { "field": "citizen_name", "code": "VAL_REQUIRED_FIELD", "message": { "en": "...", "mr": "..." } }
      ]
    }
  }
}
```

---

## 2. Error Codes by Domain

---

### 2.1 Authentication & Session (`AUTH_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) | Field |
|:-:|------------|:----:|---------------|----------------|-------|
| 1 | `AUTH_INVALID_CREDENTIALS` | 401 | Invalid username or password. | अमान्य वापरकर्ता नाव किंवा पासवर्ड. | — |
| 2 | `AUTH_ACCOUNT_INACTIVE` | 403 | Your account has been deactivated. Contact administrator. | आपले खाते निष्क्रिय केले आहे. प्रशासकाशी संपर्क साधा. | — |
| 3 | `AUTH_ACCOUNT_LOCKED` | 423 | Account locked due to 5 failed login attempts. Try after 15 minutes. | ५ अयशस्वी प्रयत्नांमुळे खाते बंद आहे. १५ मिनिटांनंतर प्रयत्न करा. | — |
| 4 | `AUTH_TOKEN_EXPIRED` | 401 | Session expired. Please log in again. | सत्र संपले आहे. कृपया पुन्हा लॉगिन करा. | — |
| 5 | `AUTH_TOKEN_INVALID` | 401 | Invalid or malformed authentication token. | अमान्य प्रमाणीकरण टोकन. | — |
| 6 | `AUTH_REFRESH_TOKEN_INVALID` | 401 | Refresh token is invalid or revoked. Please log in again. | रीफ्रेश टोकन अमान्य आहे. कृपया पुन्हा लॉगिन करा. | — |
| 7 | `AUTH_REFRESH_TOKEN_EXPIRED` | 401 | Refresh token has expired. Please log in again. | रीफ्रेश टोकन संपले आहे. कृपया पुन्हा लॉगिन करा. | — |
| 8 | `AUTH_PASSWORD_EXPIRED` | 403 | Your password has expired. Please change your password. | आपला पासवर्ड कालबाह्य झाला आहे. कृपया पासवर्ड बदला. | — |
| 9 | `AUTH_PASSWORD_MISMATCH` | 400 | New password and confirm password do not match. | नवीन पासवर्ड आणि पुष्टीकरण पासवर्ड जुळत नाहीत. | `confirm_password` |
| 10 | `AUTH_PASSWORD_TOO_WEAK` | 400 | Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number. | पासवर्ड किमान ८ अक्षरांचा असावा — १ मोठे अक्षर, १ छोटे अक्षर आणि १ अंक आवश्यक. | `password` |
| 11 | `AUTH_PASSWORD_SAME_AS_OLD` | 400 | New password cannot be the same as the current password. | नवीन पासवर्ड जुन्या पासवर्डसारखा असू शकत नाही. | `new_password` |
| 12 | `AUTH_OUTSIDE_OFFICE_HOURS` | 403 | Login restricted to office hours (9 AM – 8 PM) for your role. | आपल्या भूमिकेसाठी लॉगिन कार्यालयीन वेळेतच (सकाळी ९ – रात्री ८) उपलब्ध आहे. | — |
| 13 | `AUTH_FIRST_LOGIN_CHANGE_PWD` | 200 | First login detected. You must change your password before continuing. | पहिले लॉगिन आढळले. पुढे जाण्यापूर्वी पासवर्ड बदलणे आवश्यक आहे. | — |

---

### 2.2 RBAC & Permissions (`RBAC_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) |
|:-:|------------|:----:|---------------|----------------|
| 1 | `RBAC_FORBIDDEN_MODULE` | 403 | You do not have access to this module. | या मॉड्यूलमध्ये आपल्याला प्रवेश नाही. |
| 2 | `RBAC_FORBIDDEN_ACTION` | 403 | You do not have permission to perform this action. | ही कृती करण्याची आपल्याला परवानगी नाही. |
| 3 | `RBAC_FORBIDDEN_CREATE` | 403 | You do not have permission to create records in this module. | या मॉड्यूलमध्ये नोंदी तयार करण्याची परवानगी नाही. |
| 4 | `RBAC_FORBIDDEN_EDIT` | 403 | You do not have permission to edit this record. | ही नोंद संपादित करण्याची परवानगी नाही. |
| 5 | `RBAC_FORBIDDEN_DELETE` | 403 | You do not have permission to delete or deactivate this record. | ही नोंद काढून टाकण्याची / निष्क्रिय करण्याची परवानगी नाही. |
| 6 | `RBAC_DELEGATION_EXPIRED` | 403 | PA delegation period has expired. Contact MLA to renew. | PA प्रतिनिधी मुदत संपली आहे. नूतनीकरणासाठी आमदारांशी संपर्क साधा. |
| 7 | `RBAC_SCOPE_VIOLATION` | 403 | You can only access records you created. | आपण फक्त स्वतः तयार केलेल्या नोंदी पाहू शकता. |

---

### 2.3 Form Validation (`VAL_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) | Field |
|:-:|------------|:----:|---------------|----------------|-------|
| 1 | `VAL_REQUIRED_FIELD` | 400 | This field is required. | हे फील्ड आवश्यक आहे. | `{field}` |
| 2 | `VAL_MOBILE_INVALID` | 400 | Mobile number must be exactly 10 digits. | मोबाईल क्रमांक १० अंकी असावा. | `mobile` |
| 3 | `VAL_MOBILE_DUPLICATE` | 409 | This mobile number is already registered. | हा मोबाईल क्रमांक आधीच नोंदणीकृत आहे. | `mobile` |
| 4 | `VAL_EMAIL_INVALID` | 400 | Please enter a valid email address. | कृपया वैध ई-मेल पत्ता प्रविष्ट करा. | `email` |
| 5 | `VAL_PINCODE_INVALID` | 400 | Pincode must be exactly 6 digits. | पिनकोड ६ अंकी असावा. | `pincode` |
| 6 | `VAL_AADHAAR_INVALID` | 400 | Aadhaar number must be exactly 12 digits. | आधार क्रमांक १२ अंकी असावा. | `aadhaar` |
| 7 | `VAL_MIN_LENGTH` | 400 | Must be at least {{min}} characters. | किमान {{min}} अक्षरे आवश्यक. | `{field}` |
| 8 | `VAL_MAX_LENGTH` | 400 | Cannot exceed {{max}} characters. | {{max}} अक्षरांपेक्षा जास्त नसावे. | `{field}` |
| 9 | `VAL_INVALID_DATE` | 400 | Please select a valid date. | कृपया वैध दिनांक निवडा. | `{field}` |
| 10 | `VAL_FUTURE_DATE_NOT_ALLOWED` | 400 | Date cannot be in the future. | भविष्यातील दिनांक स्वीकारला जाणार नाही. | `{field}` |
| 11 | `VAL_PAST_DATE_NOT_ALLOWED` | 400 | Date cannot be in the past. | भूतकाळातील दिनांक स्वीकारला जाणार नाही. | `{field}` |
| 12 | `VAL_DATE_RANGE_INVALID` | 400 | End date must be after start date. | शेवटचा दिनांक सुरुवातीच्या दिनांकानंतर असावा. | `to_date` |
| 13 | `VAL_NUMBER_NEGATIVE` | 400 | Value cannot be negative. | मूल्य ऋण असू शकत नाही. | `{field}` |
| 14 | `VAL_NUMBER_RANGE` | 400 | Value must be between {{min}} and {{max}}. | मूल्य {{min}} आणि {{max}} दरम्यान असावे. | `{field}` |
| 15 | `VAL_INVALID_ENUM` | 400 | Invalid value selected. Please choose from the available options. | अमान्य मूल्य निवडले. कृपया उपलब्ध पर्यायांमधून निवडा. | `{field}` |
| 16 | `VAL_INVALID_TRACKING_ID` | 400 | Invalid tracking ID format. Expected: NIV-YYYY-NNNNN. | अमान्य ट्रॅकिंग आयडी स्वरूप. अपेक्षित: NIV-YYYY-NNNNN. | `tracking_id` |

---

### 2.4 Nivedan Business Logic (`NIV_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) |
|:-:|------------|:----:|---------------|----------------|
| 1 | `NIV_INVALID_STATUS_TRANSITION` | 400 | Cannot change status from '{{from}}' to '{{to}}'. | '{{from}}' ते '{{to}}' स्थिती बदल अमान्य आहे. |
| 2 | `NIV_DUPLICATE_WARNING` | 200 | An open complaint with same mobile + category already exists ({{tracking_id}}). | समान मोबाईल + वर्गासह खुली तक्रार आधीच आहे ({{tracking_id}}). |
| 3 | `NIV_ALREADY_RESOLVED` | 400 | Resolved complaints cannot be edited. | निकाली काढलेल्या तक्रारी संपादित करता येत नाहीत. |
| 4 | `NIV_ALREADY_ARCHIVED` | 400 | Archived complaints cannot be modified. | संग्रहित तक्रारी बदलता येत नाहीत. |
| 5 | `NIV_ALREADY_CANCELLED` | 400 | This complaint is already cancelled. | ही तक्रार आधीच रद्द केली आहे. |
| 6 | `NIV_CANNOT_DELETE` | 400 | Complaints cannot be deleted. Use Cancel or Archive instead. | तक्रारी काढून टाकता येत नाहीत. रद्द किंवा संग्रहित करा. |
| 7 | `NIV_REJECTION_REASON_REQUIRED` | 400 | A reason is required when rejecting a complaint. | तक्रार नाकारताना कारण देणे आवश्यक आहे. |
| 8 | `NIV_RESOLUTION_NOTES_REQUIRED` | 400 | Resolution details are required when marking as resolved. | निकाली काढताना निराकरण तपशील आवश्यक आहे. |
| 9 | `NIV_DEPARTMENT_REQUIRED` | 400 | Department must be selected when forwarding a complaint. | तक्रार वर्ग करताना विभाग निवडणे आवश्यक आहे. |
| 10 | `NIV_ESCALATION_LEVEL1` | 200 | ⚠️ This complaint has exceeded its {{days}}-day deadline. Level 1 escalation triggered. | ⚠️ या तक्रारीची {{days}} दिवसांची मुदत उलटली. स्तर १ एस्केलेशन. |
| 11 | `NIV_ESCALATION_LEVEL2` | 200 | 🚨 Critical: Complaint unresolved for {{days}} days. Level 2 escalation — MLA notified. | 🚨 गंभीर: तक्रार {{days}} दिवसांपासून प्रलंबित. स्तर २ — आमदारांना कळवले. |
| 12 | `NIV_TRACKING_ID_NOT_FOUND` | 404 | Complaint with tracking ID '{{id}}' not found. | ट्रॅकिंग आयडी '{{id}}' ची तक्रार सापडली नाही. |
| 13 | `NIV_FREQUENT_COMPLAINANT` | 200 | ⚠️ This citizen has {{count}} active (unresolved) complaints. | ⚠️ या नागरिकाच्या {{count}} सक्रिय (निकाल न लागलेल्या) तक्रारी आहेत. |

---

### 2.5 Inward / Outward Business Logic (`INW_*`, `OUT_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) |
|:-:|------------|:----:|---------------|----------------|
| 1 | `INW_NOT_FOUND` | 404 | Inward entry not found. | आवक नोंद सापडली नाही. |
| 2 | `INW_INVALID_STATUS_TRANSITION` | 400 | Cannot change inward status from '{{from}}' to '{{to}}'. | आवक स्थिती '{{from}}' ते '{{to}}' बदल अमान्य. |
| 3 | `INW_ALREADY_COMPLETED` | 400 | Completed inward entries cannot be edited. | पूर्ण झालेल्या आवक नोंदी संपादित करता येत नाहीत. |
| 4 | `OUT_NOT_FOUND` | 404 | Outward entry not found. | जावक नोंद सापडली नाही. |
| 5 | `OUT_ALREADY_FINALIZED` | 400 | Finalized outward letters cannot be edited. | अंतिम केलेली जावक पत्रे संपादित करता येत नाहीत. |
| 6 | `OUT_INVALID_REF_INWARD` | 400 | Reference inward ID does not exist. | संदर्भ आवक आयडी अस्तित्वात नाही. |
| 7 | `OUT_MLA_APPROVAL_PENDING` | 400 | This letter is pending MLA approval. | हे पत्र आमदारांच्या मंजुरीसाठी प्रलंबित आहे. |
| 8 | `OUT_MLA_REJECTED` | 400 | MLA rejected this letter. Please revise. Reason: {{reason}}. | आमदारांनी हे पत्र नाकारले. कृपया सुधारणा करा. कारण: {{reason}}. |
| 9 | `OUT_SIGNATURE_NOT_UPLOADED` | 400 | MLA signature image must be uploaded before finalizing. | अंतिम करण्यापूर्वी आमदारांची सही अपलोड करणे आवश्यक. |

---

### 2.6 Visitor Book Business Logic (`VIS_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) |
|:-:|------------|:----:|---------------|----------------|
| 1 | `VIS_NOT_FOUND` | 404 | Visitor entry not found. | भेटीदार नोंद सापडली नाही. |
| 2 | `VIS_ALREADY_CHECKED_OUT` | 400 | This visitor has already been checked out. | या भेटीदाराचे निर्गमन आधीच नोंदवले आहे. |
| 3 | `VIS_CHECKOUT_BEFORE_CHECKIN` | 400 | Check-out time cannot be before check-in time. | निर्गमन वेळ आगमन वेळेपूर्वी असू शकत नाही. |
| 4 | `VIS_NIVEDAN_LINK_INVALID` | 400 | Linked nivedan does not exist or belongs to a different citizen. | जोडलेले निवेदन अस्तित्वात नाही किंवा वेगळ्या नागरिकाचे आहे. |
| 5 | `VIS_REPEAT_VISITOR_INFO` | 200 | Repeat visitor — {{count}} previous visits. Last visit: {{date}}. | पुन्हा आलेला भेटीदार — {{count}} पूर्वीच्या भेटी. शेवटची भेट: {{date}}. |

---

### 2.7 Development Works Business Logic (`DEV_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) |
|:-:|------------|:----:|---------------|----------------|
| 1 | `DEV_NOT_FOUND` | 404 | Development work entry not found. | विकासकाम नोंद सापडली नाही. |
| 2 | `DEV_INVALID_STATUS_TRANSITION` | 400 | Cannot change project status from '{{from}}' to '{{to}}'. | प्रकल्प स्थिती '{{from}}' ते '{{to}}' बदल अमान्य. |
| 3 | `DEV_BUDGET_OVERSPEND_WARNING` | 200 | ⚠️ Budget spent (₹{{spent}}) exceeds allocation (₹{{allocated}}). | ⚠️ खर्च (₹{{spent}}) मंजूर अंदाजपत्रक (₹{{allocated}}) पेक्षा जास्त आहे. |
| 4 | `DEV_PROGRESS_INVALID` | 400 | Progress must be between 0 and 100. | प्रगती ० ते १०० दरम्यान असावी. |
| 5 | `DEV_PROGRESS_CANNOT_DECREASE` | 400 | Progress percentage cannot be decreased. | प्रगती टक्केवारी कमी करता येत नाही. |
| 6 | `DEV_COMPLETED_CANNOT_EDIT` | 400 | Completed projects cannot be edited. | पूर्ण झालेले प्रकल्प संपादित करता येत नाहीत. |
| 7 | `DEV_CANCELLED_CANNOT_EDIT` | 400 | Cancelled projects cannot be edited. | रद्द केलेले प्रकल्प संपादित करता येत नाहीत. |
| 8 | `DEV_OVERDUE_WARNING` | 200 | ⚠️ Project overdue by {{days}} days. Expected completion: {{date}}. | ⚠️ प्रकल्प {{days}} दिवसांनी विलंबित. अपेक्षित पूर्णता: {{date}}. |
| 9 | `DEV_PHOTO_NO_GPS` | 400 | Photo must include GPS coordinates for geotagging. | छायाचित्रामध्ये GPS निर्देशांक आवश्यक आहेत. |
| 10 | `DEV_BEFORE_PHOTO_MISSING` | 200 | ⚠️ No 'Before' photo uploaded. Please add at least one site photo before work starts. | ⚠️ 'पूर्वी' छायाचित्र अपलोड नाही. काम सुरू होण्यापूर्वी किमान एक छायाचित्र जोडा. |

---

### 2.8 Karyakarta Business Logic (`KAR_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) |
|:-:|------------|:----:|---------------|----------------|
| 1 | `KAR_NOT_FOUND` | 404 | Karyakarta record not found. | कार्यकर्ता नोंद सापडली नाही. |
| 2 | `KAR_DUPLICATE_MOBILE` | 409 | A karyakarta with this mobile number already exists. | या मोबाईल क्रमांकाचा कार्यकर्ता आधीच अस्तित्वात आहे. |
| 3 | `KAR_INVALID_BOOTH` | 400 | Selected booth does not exist. | निवडलेला बूथ अस्तित्वात नाही. |
| 4 | `KAR_BOOTH_PRAMUKH_EXISTS` | 409 | This booth already has an active Booth Pramukh ({{name}}). Assigning a new one will replace them. | या बूथला आधीच सक्रिय बूथ प्रमुख आहे ({{name}}). नवीन नियुक्त केल्यास बदली होईल. |
| 5 | `KAR_PRAMUKH_WRONG_BOOTH` | 400 | Booth Pramukh must belong to the same booth they lead. | बूथ प्रमुख त्याच बूथचा सदस्य असावा. |
| 6 | `KAR_DEACTIVATED_IS_PRAMUKH` | 200 | ⚠️ This karyakarta is a Booth Pramukh. Deactivating will remove them from that role. | ⚠️ हा कार्यकर्ता बूथ प्रमुख आहे. निष्क्रिय केल्यास ती भूमिका काढली जाईल. |
| 7 | `KAR_ALREADY_INACTIVE` | 400 | This karyakarta is already deactivated. | हा कार्यकर्ता आधीच निष्क्रिय आहे. |

---

### 2.9 Booth Management (`BTH_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) |
|:-:|------------|:----:|---------------|----------------|
| 1 | `BTH_NOT_FOUND` | 404 | Booth not found. | बूथ सापडला नाही. |
| 2 | `BTH_DUPLICATE_NUMBER` | 409 | A booth with this number already exists. | या क्रमांकाचा बूथ आधीच अस्तित्वात आहे. |
| 3 | `BTH_VERIFICATION_INCOMPLETE` | 400 | All checklist items must be filled before submitting verification. | पडताळणी सादर करण्यापूर्वी सर्व तपासणी बाबी भरणे आवश्यक. |
| 4 | `BTH_VERIFICATION_PHOTO_REQUIRED` | 400 | At least one geotagged photo is required for verification. | पडताळणीसाठी किमान एक GPS-टॅग छायाचित्र आवश्यक. |
| 5 | `BTH_NO_PRAMUKH_ASSIGNED` | 200 | ⚠️ No Booth Pramukh assigned to this booth. | ⚠️ या बूथला बूथ प्रमुख नियुक्त नाही. |

---

### 2.10 File Upload (`FILE_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) | Field |
|:-:|------------|:----:|---------------|----------------|-------|
| 1 | `FILE_TOO_LARGE` | 413 | File size exceeds the maximum limit of {{max}}MB. | फाईलचा आकार {{max}}MB मर्यादेपेक्षा जास्त आहे. | `attachment` |
| 2 | `FILE_INVALID_TYPE` | 415 | Only {{types}} files are allowed. | केवळ {{types}} फाईल्सना परवानगी आहे. | `attachment` |
| 3 | `FILE_TOO_MANY` | 400 | Maximum {{max}} files can be uploaded at once. | एकावेळी जास्तीत जास्त {{max}} फाईल्स अपलोड करता येतात. | `attachments` |
| 4 | `FILE_UPLOAD_FAILED` | 500 | Failed to upload file. Please try again. | फाईल अपलोड करण्यात अपयश. पुन्हा प्रयत्न करा. | `attachment` |
| 5 | `FILE_CLOUDINARY_ERROR` | 502 | Cloud storage service is temporarily unavailable. | क्लाउड स्टोरेज सेवा तात्पुरती अनुपलब्ध आहे. | — |
| 6 | `FILE_IMAGE_TOO_LARGE` | 413 | Profile photo must be under 5MB. | छायाचित्र ५MB पेक्षा कमी असावे. | `profile_photo` |
| 7 | `FILE_EMPTY` | 400 | Uploaded file is empty. | अपलोड केलेली फाईल रिकामी आहे. | `attachment` |

---

### 2.11 WhatsApp & Messaging (`WA_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) |
|:-:|------------|:----:|---------------|----------------|
| 1 | `WA_SEND_FAILED` | 502 | WhatsApp message delivery failed. | व्हॉट्सअॅप संदेश पाठवण्यात अपयश. |
| 2 | `WA_RETRY_EXHAUSTED` | 502 | Message delivery failed after 2 retries. SMS fallback attempted. | २ पुन्हा प्रयत्नांनंतरही अपयश. SMS द्वारे पाठवण्याचा प्रयत्न केला. |
| 3 | `WA_SMS_FALLBACK_FAILED` | 502 | SMS fallback also failed. Manual intervention required. | SMS द्वारे पाठवणेही अयशस्वी. स्वहस्ते हाताळणी आवश्यक. |
| 4 | `WA_TEMPLATE_NOT_APPROVED` | 400 | WhatsApp template '{{name}}' is not approved by Meta. | व्हॉट्सअॅप टेम्पलेट '{{name}}' Meta द्वारे मंजूर नाही. |
| 5 | `WA_TEMPLATE_NOT_FOUND` | 404 | WhatsApp template '{{name}}' not found. | व्हॉट्सअॅप टेम्पलेट '{{name}}' सापडले नाही. |
| 6 | `WA_INVALID_MOBILE` | 400 | Recipient mobile number is invalid for WhatsApp delivery. | प्राप्तकर्ता मोबाईल क्रमांक व्हॉट्सअॅपसाठी अमान्य. |
| 7 | `WA_RATE_LIMITED` | 429 | WhatsApp rate limit exceeded. Please wait before sending more messages. | व्हॉट्सअॅप दर मर्यादा ओलांडली. अधिक संदेश पाठवण्यापूर्वी प्रतीक्षा करा. |
| 8 | `WA_BROADCAST_LIMIT` | 429 | Maximum 5 broadcasts per hour. Please wait. | प्रति तास जास्तीत जास्त ५ प्रसारणे. कृपया प्रतीक्षा करा. |
| 9 | `WA_WEBHOOK_SIGNATURE_INVALID` | 401 | Webhook signature verification failed. | Webhook सही पडताळणी अयशस्वी. |
| 10 | `WA_BOT_TRACKING_NOT_FOUND` | 200 | (Bot reply) Tracking ID '{{id}}' not found. Please check and resend. | ट्रॅकिंग आयडी '{{id}}' सापडला नाही. कृपया तपासून पुन्हा पाठवा. |
| 11 | `WA_BOT_INVALID_INPUT` | 200 | (Bot reply) Please send your tracking ID. Example: NIV-2026-00001 | कृपया आपला ट्रॅकिंग आयडी पाठवा. उदा: NIV-2026-00001 |
| 12 | `WA_NO_RECIPIENTS` | 400 | No active recipients found for the selected audience filter. | निवडलेल्या फिल्टरसाठी सक्रिय प्राप्तकर्ते सापडले नाहीत. |

---

### 2.12 AI Letter Drafting (`AI_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) |
|:-:|------------|:----:|---------------|----------------|
| 1 | `AI_GENERATION_FAILED` | 502 | AI failed to generate the letter draft. Please try again. | AI मसुदा तयार करण्यात अपयश. कृपया पुन्हा प्रयत्न करा. |
| 2 | `AI_RATE_LIMITED` | 429 | AI service rate limit reached. Please wait a few minutes and retry. | AI सेवा दर मर्यादा. कृपया काही मिनिटे प्रतीक्षा करून पुन्हा प्रयत्न करा. |
| 3 | `AI_TOKEN_LIMIT_EXCEEDED` | 400 | Input text is too long for AI processing. Please shorten the description. | AI प्रक्रियेसाठी मजकूर खूप मोठा आहे. कृपया वर्णन लहान करा. |
| 4 | `AI_EMPTY_RESPONSE` | 502 | AI returned an empty response. Please try again with more context. | AI ने रिकामा प्रतिसाद दिला. अधिक संदर्भासह पुन्हा प्रयत्न करा. |
| 5 | `AI_API_KEY_INVALID` | 500 | AI service configuration error. Contact system administrator. | AI सेवा कॉन्फिगरेशन त्रुटी. प्रणाली प्रशासकाशी संपर्क साधा. |
| 6 | `AI_SERVICE_UNAVAILABLE` | 503 | Gemini AI service is temporarily unavailable. | Gemini AI सेवा तात्पुरती अनुपलब्ध आहे. |

---

### 2.13 Data Import / Export (`IMP_*`, `EXP_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) |
|:-:|------------|:----:|---------------|----------------|
| 1 | `IMP_INVALID_FILE_FORMAT` | 400 | Invalid file format. Only .xlsx and .csv files are accepted. | अमान्य फाईल स्वरूप. केवळ .xlsx आणि .csv फाईल्स स्वीकारल्या जातात. |
| 2 | `IMP_MISSING_REQUIRED_COLUMNS` | 400 | Required columns missing: {{columns}}. | आवश्यक स्तंभ गहाळ: {{columns}}. |
| 3 | `IMP_EMPTY_FILE` | 400 | Uploaded file contains no data rows. | अपलोड केलेल्या फाईलमध्ये डेटा पंक्ती नाहीत. |
| 4 | `IMP_ROW_ERROR` | 400 | Row {{row}}: {{error}}. | पंक्ती {{row}}: {{error}}. |
| 5 | `IMP_PARTIAL_SUCCESS` | 200 | Import completed with errors. {{imported}} imported, {{skipped}} skipped. | आयात त्रुटींसह पूर्ण. {{imported}} आयात, {{skipped}} वगळले. |
| 6 | `IMP_TOO_MANY_ROWS` | 400 | File contains {{count}} rows. Maximum allowed is {{max}}. | फाईलमध्ये {{count}} पंक्ती आहेत. जास्तीत जास्त {{max}} परवानगी. |
| 7 | `EXP_NO_DATA` | 400 | No data matches the selected filters. Nothing to export. | निवडलेल्या फिल्टरशी कोणताही डेटा जुळत नाही. निर्यात करण्यासारखे नाही. |
| 8 | `EXP_TIMEOUT` | 504 | Export timed out due to large data volume. Try a smaller date range. | मोठ्या डेटामुळे निर्यात कालबाह्य. लहान कालावधी वापरा. |

---

### 2.14 Reports & Analytics (`RPT_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) |
|:-:|------------|:----:|---------------|----------------|
| 1 | `RPT_DATE_RANGE_REQUIRED` | 400 | Please select a date range for the report. | कृपया अहवालासाठी कालावधी निवडा. |
| 2 | `RPT_DATE_RANGE_TOO_WIDE` | 400 | Date range cannot exceed 1 year. | कालावधी १ वर्षापेक्षा जास्त असू शकत नाही. |
| 3 | `RPT_NO_DATA` | 200 | No data available for the selected criteria. | निवडलेल्या निकषांसाठी डेटा उपलब्ध नाही. |
| 4 | `RPT_GENERATION_FAILED` | 500 | Report generation failed. Please try again. | अहवाल तयार करण्यात अपयश. पुन्हा प्रयत्न करा. |

---

### 2.15 System & Database (`SYS_*`)

| # | Error Code | HTTP | English (`en`) | Marathi (`mr`) |
|:-:|------------|:----:|---------------|----------------|
| 1 | `SYS_INTERNAL_ERROR` | 500 | Internal server error. Please try again later. | अंतर्गत सर्व्हर त्रुटी. कृपया नंतर प्रयत्न करा. |
| 2 | `SYS_SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable. Please try again shortly. | सेवा तात्पुरती अनुपलब्ध. कृपया थोड्या वेळाने प्रयत्न करा. |
| 3 | `SYS_DATABASE_ERROR` | 500 | Database operation failed. Please try again. | डेटाबेस ऑपरेशन अयशस्वी. पुन्हा प्रयत्न करा. |
| 4 | `SYS_TIMEOUT` | 504 | Request timed out. Please try again. | विनंती कालबाह्य. पुन्हा प्रयत्न करा. |
| 5 | `SYS_RATE_LIMITED` | 429 | Too many requests. Please slow down. | खूप जास्त विनंत्या. कृपया थोडे थांबा. |
| 6 | `SYS_MAINTENANCE_MODE` | 503 | System is under maintenance. Expected back at {{time}} IST. | प्रणाली देखभालीसाठी बंद आहे. {{time}} IST पर्यंत पुन्हा उपलब्ध. |
| 7 | `SYS_RESOURCE_NOT_FOUND` | 404 | Requested resource not found. | विनंती केलेले संसाधन सापडले नाही. |
| 8 | `SYS_CANNOT_DELETE` | 400 | Records cannot be physically deleted from the system. | प्रणालीमधून नोंदी कायमस्वरूपी काढून टाकता येत नाहीत. |

---

## 3. Error Code Count Summary

| Domain | Prefix | Count |
|--------|--------|:-----:|
| Authentication & Session | `AUTH_*` | 13 |
| RBAC & Permissions | `RBAC_*` | 7 |
| Form Validation | `VAL_*` | 16 |
| Nivedan Business Logic | `NIV_*` | 13 |
| Inward / Outward | `INW_*` / `OUT_*` | 9 |
| Visitor Book | `VIS_*` | 5 |
| Development Works | `DEV_*` | 10 |
| Karyakarta | `KAR_*` | 7 |
| Booth Management | `BTH_*` | 5 |
| File Upload | `FILE_*` | 7 |
| WhatsApp & Messaging | `WA_*` | 12 |
| AI Letter Drafting | `AI_*` | 6 |
| Data Import / Export | `IMP_*` / `EXP_*` | 8 |
| Reports & Analytics | `RPT_*` | 4 |
| System & Database | `SYS_*` | 8 |
| **TOTAL** | — | **~130** |

---

## 4. Express.js Error Handling Middleware

### 4A. Custom AppError Class

```javascript
// src/utils/AppError.js

class AppError extends Error {
  /**
   * @param {string} code    - Error code from error dictionary (e.g., 'AUTH_INVALID_CREDENTIALS')
   * @param {number} httpStatus - HTTP status code
   * @param {object} message - { en: string, mr: string }
   * @param {string|null} field - Form field name (for validation errors)
   * @param {object|null} details - Additional context
   */
  constructor(code, httpStatus, message, field = null, details = null) {
    super(message.en);
    this.code       = code;
    this.httpStatus = httpStatus;
    this.message    = message;
    this.field      = field;
    this.details    = details;
    this.isOperational = true;  // Distinguishes from programmer errors
  }
}

module.exports = AppError;
```

### 4B. Error Dictionary Loader

```javascript
// src/utils/errorCodes.js

const errors = {
  // ── AUTH ────────────────────────────────────────
  AUTH_INVALID_CREDENTIALS: {
    code: 'AUTH_INVALID_CREDENTIALS', httpStatus: 401,
    message: { en: 'Invalid username or password.', mr: 'अमान्य वापरकर्ता नाव किंवा पासवर्ड.' },
  },
  AUTH_ACCOUNT_INACTIVE: {
    code: 'AUTH_ACCOUNT_INACTIVE', httpStatus: 403,
    message: { en: 'Your account has been deactivated. Contact administrator.', mr: 'आपले खाते निष्क्रिय केले आहे. प्रशासकाशी संपर्क साधा.' },
  },
  AUTH_ACCOUNT_LOCKED: {
    code: 'AUTH_ACCOUNT_LOCKED', httpStatus: 423,
    message: { en: 'Account locked due to 5 failed login attempts. Try after 15 minutes.', mr: '५ अयशस्वी प्रयत्नांमुळे खाते बंद आहे. १५ मिनिटांनंतर प्रयत्न करा.' },
  },
  AUTH_TOKEN_EXPIRED: {
    code: 'AUTH_TOKEN_EXPIRED', httpStatus: 401,
    message: { en: 'Session expired. Please log in again.', mr: 'सत्र संपले आहे. कृपया पुन्हा लॉगिन करा.' },
  },
  // ... (all other codes from sections 2.1–2.15 follow the same pattern)

  // ── VAL ────────────────────────────────────────
  VAL_REQUIRED_FIELD: {
    code: 'VAL_REQUIRED_FIELD', httpStatus: 400,
    message: { en: 'This field is required.', mr: 'हे फील्ड आवश्यक आहे.' },
  },
  VAL_MOBILE_INVALID: {
    code: 'VAL_MOBILE_INVALID', httpStatus: 400,
    message: { en: 'Mobile number must be exactly 10 digits.', mr: 'मोबाईल क्रमांक १० अंकी असावा.' },
  },

  // ── NIV ────────────────────────────────────────
  NIV_INVALID_STATUS_TRANSITION: {
    code: 'NIV_INVALID_STATUS_TRANSITION', httpStatus: 400,
    message: { en: "Cannot change status from '{{from}}' to '{{to}}'.", mr: "'{{from}}' ते '{{to}}' स्थिती बदल अमान्य आहे." },
  },

  // ── SYS ────────────────────────────────────────
  SYS_INTERNAL_ERROR: {
    code: 'SYS_INTERNAL_ERROR', httpStatus: 500,
    message: { en: 'Internal server error. Please try again later.', mr: 'अंतर्गत सर्व्हर त्रुटी. कृपया नंतर प्रयत्न करा.' },
  },
  SYS_CANNOT_DELETE: {
    code: 'SYS_CANNOT_DELETE', httpStatus: 400,
    message: { en: 'Records cannot be physically deleted from the system.', mr: 'प्रणालीमधून नोंदी कायमस्वरूपी काढून टाकता येत नाहीत.' },
  },
};

/**
 * Creates an AppError from the error dictionary.
 * Supports template interpolation: {{key}} replaced with values from `params`.
 *
 * @param {string} errorCode - Key from the errors object
 * @param {object} [params]  - Template values (e.g., { from: 'PENDING', to: 'ARCHIVED' })
 * @param {string} [field]   - Form field name
 * @returns {AppError}
 */
function createError(errorCode, params = {}, field = null) {
  const AppError = require('./AppError');
  const errDef   = errors[errorCode] || errors.SYS_INTERNAL_ERROR;

  // Interpolate {{key}} placeholders in messages
  const interpolate = (str) =>
    str.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] ?? key);

  return new AppError(
    errDef.code,
    errDef.httpStatus,
    {
      en: interpolate(errDef.message.en),
      mr: interpolate(errDef.message.mr),
    },
    field,
    Object.keys(params).length > 0 ? params : null
  );
}

module.exports = { errors, createError };
```

### 4C. Global Error Handler Middleware

```javascript
// src/middleware/errorHandler.js

const { errors } = require('../utils/errorCodes');

/**
 * Express global error handler.
 * Catches all errors thrown in routes/controllers and formats
 * them into the standard API error response.
 */
function errorHandler(err, req, res, next) {
  // Default values
  let httpStatus = err.httpStatus || 500;
  let code       = err.code       || 'SYS_INTERNAL_ERROR';
  let message    = err.message    || errors.SYS_INTERNAL_ERROR.message;
  let field      = err.field      || null;
  let details    = err.details    || null;

  // If message is a string (non-AppError), wrap it
  if (typeof message === 'string') {
    message = { en: message, mr: message };
  }

  // Log server errors (5xx) — skip client errors (4xx)
  if (httpStatus >= 500) {
    console.error(`[ERROR] ${code}:`, err.stack || err);
  }

  // Send standardized response
  res.status(httpStatus).json({
    success: false,
    error: {
      code,
      httpStatus,
      message,
      field,
      details,
    },
  });
}

module.exports = errorHandler;
```

### 4D. Usage in Controllers

```javascript
// Example: nivedanController.js
const { createError } = require('../utils/errorCodes');

async function updateNivedanStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const nivedan = await Nivedan.findByPk(id);
    if (!nivedan) {
      throw createError('NIV_TRACKING_ID_NOT_FOUND', { id });
    }

    // Validate status transition
    const validTransitions = {
      PENDING:           ['IN_PROGRESS', 'FORWARDED', 'REJECTED', 'CANCELLED'],
      IN_PROGRESS:       ['FORWARDED', 'RESOLVED', 'CANCELLED'],
      FORWARDED:         ['AWAITING_RESPONSE', 'RESOLVED'],
      AWAITING_RESPONSE: ['IN_PROGRESS', 'RESOLVED'],
      RESOLVED:          ['ARCHIVED'],
      REJECTED:          ['ARCHIVED'],
    };

    const allowed = validTransitions[nivedan.status] || [];
    if (!allowed.includes(newStatus)) {
      throw createError('NIV_INVALID_STATUS_TRANSITION', {
        from: nivedan.status,
        to:   newStatus,
      });
    }

    // Rejection requires a reason
    if (newStatus === 'REJECTED' && !req.body.rejection_reason) {
      throw createError('NIV_REJECTION_REASON_REQUIRED');
    }

    // Resolution requires notes
    if (newStatus === 'RESOLVED' && !req.body.resolution_notes) {
      throw createError('NIV_RESOLUTION_NOTES_REQUIRED');
    }

    // Forwarding requires department
    if (newStatus === 'FORWARDED' && !req.body.department_id) {
      throw createError('NIV_DEPARTMENT_REQUIRED');
    }

    await nivedan.update({ status: newStatus });
    res.json({ success: true, data: nivedan });

  } catch (err) {
    next(err);  // Passes to errorHandler middleware
  }
}
```

### 4E. Frontend Error Display Utility

```javascript
// src/utils/errorDisplay.js
import i18n from '../i18n/config';

/**
 * Extracts the localized error message from an API error response.
 * Falls back to English if current language message is missing.
 */
export function getErrorMessage(apiError) {
  const lang = i18n.language; // 'en' or 'mr'

  if (apiError?.error?.message) {
    return apiError.error.message[lang] || apiError.error.message.en || 'Unknown error';
  }

  return lang === 'mr'
    ? 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.'
    : 'Something went wrong. Please try again.';
}

/**
 * Extracts field-level errors for form display.
 * Returns: { fieldName: localizedErrorMessage }
 */
export function getFieldErrors(apiError) {
  const lang   = i18n.language;
  const errors = apiError?.error?.details?.errors || [];

  return errors.reduce((acc, err) => {
    if (err.field) {
      acc[err.field] = err.message?.[lang] || err.message?.en || 'Invalid value';
    }
    return acc;
  }, {});
}
```

---

## 5. HTTP Status Code Quick Reference

| Status | Meaning | When Used |
|:------:|---------|-----------|
| `200` | OK (with warning) | Informational warnings (`NIV_DUPLICATE_WARNING`, `DEV_BUDGET_OVERSPEND_WARNING`) |
| `400` | Bad Request | Validation errors, invalid transitions, business rule violations |
| `401` | Unauthorized | Invalid/expired tokens, login failures |
| `403` | Forbidden | Inactive account, RBAC denials, office hours restrictions |
| `404` | Not Found | Entity not found (nivedan, inward, karyakarta, booth) |
| `409` | Conflict | Duplicate entries (mobile number, booth number) |
| `413` | Payload Too Large | File size exceeded |
| `415` | Unsupported Media Type | Invalid file type |
| `423` | Locked | Account locked after failed login attempts |
| `429` | Too Many Requests | Rate limiting (API, WhatsApp, AI, broadcasts) |
| `500` | Internal Server Error | Unhandled exceptions, database errors |
| `502` | Bad Gateway | External service failures (WhatsApp API, Gemini AI, Cloudinary) |
| `503` | Service Unavailable | Maintenance mode, dependency outage |
| `504` | Gateway Timeout | Export/report generation timeout |
