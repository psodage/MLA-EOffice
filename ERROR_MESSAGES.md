# MLA E-Office — System Error & Validation Messages Specification

> **Comprehensive Bilingual (English & Marathi) Error Code & Message Dictionary**
>
> This document defines all system error codes, HTTP status codes, form validation failures, business logic errors, and integration failure messages used across the web and mobile applications.
>
> *Related Documents:* [GLOSSARY.md](file:///s:/MLA%20E%20-%20Office/GLOSSARY.md) | [TRANSLATIONS.md](file:///s:/MLA%20E%20-%20Office/TRANSLATIONS.md) | [BUSINESS_RULES.md](file:///s:/MLA%20E%20-%20Office/BUSINESS_RULES.md) | [AUTH_SPEC.md](file:///s:/MLA%20E%20-%20Office/AUTH_SPEC.md)

---

## 1. Overview & Standard API Error Response Format

All backend API errors follow a standardized JSON payload structure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "httpStatus": 400,
    "message": {
      "en": "Mobile number must be exactly 10 digits.",
      "mr": "मोबाईल क्रमांक १० अंकी असावा."
    },
    "field": "mobile",
    "details": null
  }
}
```

---

## 2. Error Message Dictionary by Domain

### 2.1 Authentication & Security (`AUTH_*`)

| Error Code | HTTP | English Message (`en`) | Marathi Message (`mr`) |
|------------|:----:|-----------------------|------------------------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Invalid username or password. | अमान्य वापरकर्ता नाव किंवा पासवर्ड. |
| `AUTH_ACCOUNT_DISABLED` | 403 | Your account has been disabled. Contact admin. | आपले खाते निष्क्रिय केले आहे. प्रशासकाशी संपर्क साधा. |
| `AUTH_TOKEN_EXPIRED` | 401 | Session expired. Please log in again. | सत्र संपले आहे. कृपया पुन्हा लॉगिन करा. |
| `AUTH_TOKEN_INVALID` | 401 | Invalid authentication token. | अमान्य प्रमाणीकरण टोकन. |
| `AUTH_UNAUTHORIZED` | 401 | Authentication required to access this resource. | या संसाधनासाठी प्रमाणीकरण आवश्यक आहे. |
| `AUTH_FORBIDDEN` | 403 | You do not have permission to perform this action. | ही कृती करण्याची आपल्याला परवानगी नाही. |
| `AUTH_PASSWORD_MISMATCH` | 400 | New password and confirm password do not match. | नवीन पासवर्ड आणि पुष्टीकरण पासवर्ड जुळत नाहीत. |

---

### 2.2 Form Validation Errors (`VAL_*`)

| Error Code | HTTP | English Message (`en`) | Marathi Message (`mr`) |
|------------|:----:|-----------------------|------------------------|
| `VAL_REQUIRED_FIELD` | 400 | This field is required. | हे फील्ड आवश्यक आहे. |
| `VAL_MOBILE_INVALID` | 400 | Mobile number must be exactly 10 digits. | मोबाईल क्रमांक १० अंकी असावा. |
| `VAL_EMAIL_INVALID` | 400 | Please enter a valid email address. | कृपया वैध ई-मेल पत्ता प्रविष्ट करा. |
| `VAL_PINCODE_INVALID` | 400 | Pincode must be 6 digits. | पिनकोड ६ अंकी असावा. |
| `VAL_MIN_LENGTH` | 400 | Text must be at least {min} characters. | मजकूर किमान {min} अक्षरांचा असावा. |
| `VAL_MAX_LENGTH` | 400 | Text cannot exceed {max} characters. | मजकूर {max} अक्षरांपेक्षा जास्त नसावा. |
| `VAL_INVALID_DATE` | 400 | Please select a valid date. | कृपया वैध दिनांक निवडा. |
| `VAL_FUTURE_DATE_NOT_ALLOWED` | 400 | Date cannot be in the future. | भविष्यातील दिनांक स्वीकारला जाणार नाही. |

---

### 2.3 Business Logic Errors (`BIZ_*`)

| Error Code | HTTP | English Message (`en`) | Marathi Message (`mr`) |
|------------|:----:|-----------------------|------------------------|
| `BIZ_INVALID_STATUS_TRANSITION` | 400 | Invalid status transition for this complaint. | या तक्रारीसाठी अमान्य स्थिती बदल. |
| `BIZ_DUPLICATE_NIVEDAN` | 409 | A complaint with similar details already exists. | समान तपशीलासह तक्रार आधीच अस्तित्त्वात आहे. |
| `BIZ_ALREADY_RESOLVED` | 400 | Resolved complaints cannot be edited. | निकाली काढलेल्या तक्रारी संपादित करता येत नाहीत. |
| `BIZ_CANNOT_DELETE` | 400 | Records cannot be deleted from the system. | प्रणालीमधून नोंदी काढून टाकता येत नाहीत. |
| `BIZ_INWARD_ALREADY_LINKED` | 400 | This inward letter is already linked to an outward letter. | हे आवक पत्र आधीच जावक पत्राशी जोडलेले आहे. |

---

### 2.4 File Upload Errors (`FILE_*`)

| Error Code | HTTP | English Message (`en`) | Marathi Message (`mr`) |
|------------|:----:|-----------------------|------------------------|
| `FILE_TOO_LARGE` | 413 | File size exceeds the maximum limit of 10MB. | फाईलचा आकार १०MB मर्यादेपेक्षा जास्त आहे. |
| `FILE_INVALID_TYPE` | 415 | Only PDF, JPG, and PNG files are allowed. | केवळ PDF, JPG आणि PNG फाईल्सना परवानगी आहे. |
| `FILE_UPLOAD_FAILED` | 500 | Failed to upload file. Please try again. | फाईल अपलोड करण्यात अपयश आले. पुन्हा प्रयत्न करा. |

---

### 2.5 System & Integration Errors (`SYS_*`, `AI_*`, `WA_*`)

| Error Code | HTTP | English Message (`en`) | Marathi Message (`mr`) |
|------------|:----:|-----------------------|------------------------|
| `SYS_INTERNAL_ERROR` | 500 | Internal server error. Please try again later. | अंतर्गत सर्व्हर त्रुटी. कृपया नंतर प्रयत्न करा. |
| `SYS_SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable. | सेवा तात्पुरती अनुपलब्ध आहे. |
| `AI_GENERATION_FAILED` | 502 | Gemini AI failed to draft letter. Please try again. | AI मसुदा तयार करण्यात अपयश. पुन्हा प्रयत्न करा. |
| `WA_SEND_FAILED` | 502 | WhatsApp message delivery failed. | व्हॉट्सअॅप संदेश पाठवण्यात अपयश आले. |
| `WA_TEMPLATE_REJECTED` | 400 | WhatsApp template is not approved by Meta. | व्हॉट्सअॅप टेम्पलेट Meta द्वारे मंजूर नाही. |
