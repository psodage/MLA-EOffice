# MLA E-Office — WhatsApp Message Templates

> **Complete WhatsApp Template Specification — Message Text, Placeholders, Triggers, Recipients, and Meta WhatsApp Business API (WABA) Submission Format**
>
> All templates are in **Marathi** (standard for Maharashtra citizen-facing communication). Templates marked `TRANSACTIONAL` are auto-triggered by system events; templates marked `MARKETING` require explicit PA action.
>
> *Related Documents:* [PROJECT_SECTIONS_BREAKDOWN.md](file:///s:/MLA%20E%20-%20Office/PROJECT_SECTIONS_BREAKDOWN.md) | [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md) | [GLOSSARY.md](file:///s:/MLA%20E%20-%20Office/GLOSSARY.md) | [TECH_STACK.md](file:///s:/MLA%20E%20-%20Office/TECH_STACK.md)

---

## 1. Overview

| Property | Value |
|----------|-------|
| **WhatsApp API** | Meta WhatsApp Business Cloud API |
| **Provider** | Direct Meta API (no third-party reseller) |
| **Language** | Marathi (मराठी) — primary for all citizen/worker messages |
| **Template Approval** | All templates must be submitted to Meta for pre-approval before use |
| **Total Templates** | 11 templates across 5 categories |
| **Inbound Bot** | Webhook-based — listens for citizen messages and auto-replies |
| **Delivery Fallback** | SMS via Twilio if WhatsApp delivery fails after 2 retries |

---

## 2. Placeholder Reference (Common to All Templates)

| Placeholder | Source | Example |
|-------------|--------|---------|
| `{{1}}` — `{citizen_name}` | Nivedan / Visitor form | सुरेश जाधव |
| `{{2}}` — `{tracking_id}` | Nivedan auto-generated | NIV-2026-01247 |
| `{{3}}` — `{status_mr}` | Nivedan status enum (Marathi) | कार्यवाही सुरू |
| `{{4}}` — `{department_mr}` | Department master | पाणीपुरवठा विभाग |
| `{{5}}` — `{date}` | System date | ०२/०८/२०२६ |
| `{{6}}` — `{mla_name_mr}` | Constituency profile | राजेश शर्मा |
| `{{7}}` — `{event_name}` | Calendar event | ग्रामसभा कार्यक्रम |
| `{{8}}` — `{event_date}` | Calendar event | ०५/०८/२०२६ |
| `{{9}}` — `{event_time}` | Calendar event | सकाळी १० वाजता |
| `{{10}}` — `{event_location}` | Calendar event | ग्रामपंचायत सभागृह, वडगाव |
| `{{11}}` — `{karyakarta_name}` | Karyakarta master | प्रकाश मोरे |
| `{{12}}` — `{work_name}` | Dev works | वडगाव-आंबेगाव रस्ता |
| `{{13}}` — `{work_status_mr}` | Dev works status | काम पूर्ण झाले |
| `{{14}}` — `{visitor_name}` | Visitor book | अनिता कांबळे |
| `{{15}}` — `{appointment_time}` | Visitor book | दुपारी ३ वाजता |
| `{{16}}` — `{rejection_reason}` | PA input | अपूर्ण माहिती |

> **Note on Meta API Placeholders:** Meta templates use numbered placeholders `{{1}}`, `{{2}}`, etc. The human-readable names (e.g., `{citizen_name}`) are used in this spec for clarity. The system maps them at runtime.

---

## 3. Template Category Index

| # | Template Name | Code | Meta Category | Trigger |
|---|--------------|------|--------------|---------|
| 1 | Nivedan Acknowledgment | `NIV_ACK` | UTILITY | Automatic — on nivedan creation |
| 2 | Nivedan Status Update | `NIV_STATUS` | UTILITY | Automatic — on status change |
| 3 | Nivedan Resolved | `NIV_RESOLVED` | UTILITY | Automatic — status → RESOLVED |
| 4 | Nivedan Rejected | `NIV_REJECTED` | UTILITY | Automatic — status → REJECTED |
| 5 | Tracking Bot Reply | `BOT_STATUS` | UTILITY | Automatic — inbound citizen message |
| 6 | Tracking Bot Help | `BOT_HELP` | UTILITY | Automatic — unrecognized inbound message |
| 7 | Event Invitation | `EVENT_INVITE` | MARKETING | Manual — PA sends before event |
| 8 | Broadcast Announcement | `BROADCAST` | MARKETING | Manual — PA composes and sends |
| 9 | New Karyakarta Welcome | `KK_WELCOME` | UTILITY | Automatic — new karyakarta added |
| 10 | Development Work Update | `WORK_UPDATE` | UTILITY | Manual/Auto — work status milestone |
| 11 | Visitor Reminder | `VISITOR_REMINDER` | UTILITY | Automatic — 1 hour before appointment |

---

## 4. Templates — Citizen Nivedan (तक्रार) Messages

---

### Template 1: Nivedan Acknowledgment (तक्रार पोहोचपावती)

**Code:** `NIV_ACK`  
**Trigger:** Automatically sent when a new nivedan is registered  
**Recipient:** Citizen whose mobile number is on the nivedan  
**Meta Category:** `UTILITY`

#### Message Text

```
नमस्कार {{1}},

आपली तक्रार यशस्वीरित्या नोंदवली गेली आहे. 🙏

📋 तक्रार क्रमांक: {{2}}
📅 नोंदणी दिनांक: {{3}}

आपल्या तक्रारीवर लवकरात लवकर कार्यवाही केली जाईल. तक्रारीची सद्यस्थिती जाणून घेण्यासाठी या क्रमांकावर आपला तक्रार क्रमांक पाठवा.

— {{4}} कार्यालय
```

**Placeholders:**

| Position | Variable | Example |
|----------|----------|---------|
| `{{1}}` | `citizen_name` | सुरेश जाधव |
| `{{2}}` | `tracking_id` | NIV-2026-01247 |
| `{{3}}` | `date` | ०२/०८/२०२६ |
| `{{4}}` | `mla_name_mr` | राजेश शर्मा |

#### Meta WABA Submission Format

```json
{
  "name": "niv_acknowledgment_mr",
  "language": "mr",
  "category": "UTILITY",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "तक्रार नोंदवली गेली ✅"
    },
    {
      "type": "BODY",
      "text": "नमस्कार {{1}},\n\nआपली तक्रार यशस्वीरित्या नोंदवली गेली आहे. 🙏\n\n📋 तक्रार क्रमांक: {{2}}\n📅 नोंदणी दिनांक: {{3}}\n\nआपल्या तक्रारीवर लवकरात लवकर कार्यवाही केली जाईल. तक्रारीची सद्यस्थिती जाणून घेण्यासाठी या क्रमांकावर आपला तक्रार क्रमांक पाठवा.\n\n— {{4}} कार्यालय",
      "example": {
        "body_text": [["सुरेश जाधव", "NIV-2026-01247", "०२/०८/२०२६", "राजेश शर्मा"]]
      }
    },
    {
      "type": "FOOTER",
      "text": "हे संदेश आमदार कार्यालय प्रणालीद्वारे पाठवले जाते."
    }
  ]
}
```

---

### Template 2: Nivedan Status Update (तक्रार स्थिती बदल)

**Code:** `NIV_STATUS`  
**Trigger:** Automatically sent on every status change (except RESOLVED and REJECTED — they have separate templates)  
**Recipient:** Citizen on the nivedan  
**Meta Category:** `UTILITY`

**Status Changes That Trigger This Template:**

| From Status | To Status | `{status_mr}` value |
|-------------|-----------|---------------------|
| PENDING | IN_PROGRESS | कार्यवाही सुरू आहे |
| IN_PROGRESS | FORWARDED | संबंधित विभागाकडे वर्ग केले |
| FORWARDED | AWAITING_RESPONSE | विभागाच्या प्रतिसादाची प्रतीक्षा |

#### Message Text

```
नमस्कार {{1}},

आपल्या तक्रारीची (क्र. {{2}}) स्थिती अद्यतनित झाली आहे.

📌 नवीन स्थिती: {{3}}
{{4}}
📅 दिनांक: {{5}}

अधिक माहितीसाठी आपला तक्रार क्रमांक या क्रमांकावर पाठवा.

— {{6}} कार्यालय
```

**Placeholders:**

| Position | Variable | Example |
|----------|----------|---------|
| `{{1}}` | `citizen_name` | सुरेश जाधव |
| `{{2}}` | `tracking_id` | NIV-2026-01247 |
| `{{3}}` | `status_mr` | संबंधित विभागाकडे वर्ग केले |
| `{{4}}` | `dept_note` | 🏢 विभाग: पाणीपुरवठा विभाग _(shown only when FORWARDED, else empty)_ |
| `{{5}}` | `date` | ०२/०८/२०२६ |
| `{{6}}` | `mla_name_mr` | राजेश शर्मा |

#### Meta WABA Submission Format

```json
{
  "name": "niv_status_update_mr",
  "language": "mr",
  "category": "UTILITY",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "तक्रार स्थिती अद्यतन 🔄"
    },
    {
      "type": "BODY",
      "text": "नमस्कार {{1}},\n\nआपल्या तक्रारीची (क्र. {{2}}) स्थिती अद्यतनित झाली आहे.\n\n📌 नवीन स्थिती: {{3}}\n{{4}}\n📅 दिनांक: {{5}}\n\nअधिक माहितीसाठी आपला तक्रार क्रमांक या क्रमांकावर पाठवा.\n\n— {{6}} कार्यालय",
      "example": {
        "body_text": [["सुरेश जाधव", "NIV-2026-01247", "संबंधित विभागाकडे वर्ग केले", "🏢 विभाग: पाणीपुरवठा विभाग", "०२/०८/२०२६", "राजेश शर्मा"]]
      }
    },
    {
      "type": "FOOTER",
      "text": "हे संदेश आमदार कार्यालय प्रणालीद्वारे पाठवले जाते."
    }
  ]
}
```

---

### Template 3: Nivedan Resolved (तक्रार निकाली)

**Code:** `NIV_RESOLVED`  
**Trigger:** Automatically sent when nivedan status changes to `RESOLVED`  
**Recipient:** Citizen on the nivedan  
**Meta Category:** `UTILITY`

#### Message Text

```
नमस्कार {{1}},

आपली तक्रार (क्र. {{2}}) यशस्वीरित्या निकाली काढण्यात आली आहे! 🎉

✅ स्थिती: निकाली
📅 निकाल दिनांक: {{3}}
📝 निराकरण: {{4}}

आपण समाधानी असल्यास, भविष्यात देखील आमच्याशी संपर्क साधा. आमदार कार्यालय नेहमी आपल्या सेवेसाठी तत्पर आहे.

— {{5}} कार्यालय
```

**Placeholders:**

| Position | Variable | Example |
|----------|----------|---------|
| `{{1}}` | `citizen_name` | सुरेश जाधव |
| `{{2}}` | `tracking_id` | NIV-2026-01247 |
| `{{3}}` | `resolved_date` | ०२/०८/२०२६ |
| `{{4}}` | `resolution_summary` | पाणीपुरवठा विभागाने पाइपलाइन दुरुस्त केली |
| `{{5}}` | `mla_name_mr` | राजेश शर्मा |

#### Meta WABA Submission Format

```json
{
  "name": "niv_resolved_mr",
  "language": "mr",
  "category": "UTILITY",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "तक्रार निकाली ✅"
    },
    {
      "type": "BODY",
      "text": "नमस्कार {{1}},\n\nआपली तक्रार (क्र. {{2}}) यशस्वीरित्या निकाली काढण्यात आली आहे! 🎉\n\n✅ स्थिती: निकाली\n📅 निकाल दिनांक: {{3}}\n📝 निराकरण: {{4}}\n\nआपण समाधानी असल्यास, भविष्यात देखील आमच्याशी संपर्क साधा. आमदार कार्यालय नेहमी आपल्या सेवेसाठी तत्पर आहे.\n\n— {{5}} कार्यालय",
      "example": {
        "body_text": [["सुरेश जाधव", "NIV-2026-01247", "०२/०८/२०२६", "पाणीपुरवठा विभागाने पाइपलाइन दुरुस्त केली", "राजेश शर्मा"]]
      }
    },
    {
      "type": "FOOTER",
      "text": "हे संदेश आमदार कार्यालय प्रणालीद्वारे पाठवले जाते."
    }
  ]
}
```

---

### Template 4: Nivedan Rejected (तक्रार नाकारली)

**Code:** `NIV_REJECTED`  
**Trigger:** Automatically sent when nivedan status changes to `REJECTED`  
**Recipient:** Citizen on the nivedan  
**Meta Category:** `UTILITY`

#### Message Text

```
नमस्कार {{1}},

आपल्या तक्रारीबाबत (क्र. {{2}}) खालील माहिती आहे.

❌ स्थिती: नाकारली
📋 कारण: {{3}}
📅 दिनांक: {{4}}

जर आपल्याला वाटत असेल की हा निर्णय चुकीचा आहे, तर कृपया अधिक माहितीसह पुन्हा तक्रार नोंदवा किंवा आमदार कार्यालयात प्रत्यक्ष भेट द्या.

— {{5}} कार्यालय
```

**Placeholders:**

| Position | Variable | Example |
|----------|----------|---------|
| `{{1}}` | `citizen_name` | सुरेश जाधव |
| `{{2}}` | `tracking_id` | NIV-2026-01247 |
| `{{3}}` | `rejection_reason` | अपूर्ण माहिती — गट क्रमांक नमूद केला नाही |
| `{{4}}` | `date` | ०२/०८/२०२६ |
| `{{5}}` | `mla_name_mr` | राजेश शर्मा |

#### Meta WABA Submission Format

```json
{
  "name": "niv_rejected_mr",
  "language": "mr",
  "category": "UTILITY",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "तक्रार अद्यतन ℹ️"
    },
    {
      "type": "BODY",
      "text": "नमस्कार {{1}},\n\nआपल्या तक्रारीबाबत (क्र. {{2}}) खालील माहिती आहे.\n\n❌ स्थिती: नाकारली\n📋 कारण: {{3}}\n📅 दिनांक: {{4}}\n\nजर आपल्याला वाटत असेल की हा निर्णय चुकीचा आहे, तर कृपया अधिक माहितीसह पुन्हा तक्रार नोंदवा किंवा आमदार कार्यालयात प्रत्यक्ष भेट द्या.\n\n— {{5}} कार्यालय",
      "example": {
        "body_text": [["सुरेश जाधव", "NIV-2026-01247", "अपूर्ण माहिती — गट क्रमांक नमूद केला नाही", "०२/०८/२०२६", "राजेश शर्मा"]]
      }
    },
    {
      "type": "FOOTER",
      "text": "हे संदेश आमदार कार्यालय प्रणालीद्वारे पाठवले जाते."
    }
  ]
}
```

---

## 5. Templates — Tracking Bot (इनबाउंड बॉट)

---

### Template 5: Tracking Bot Reply (बॉट — तक्रार स्थिती उत्तर)

**Code:** `BOT_STATUS`  
**Trigger:** Citizen sends a valid tracking ID (e.g., `NIV-2026-01247`) to the WhatsApp business number  
**Recipient:** The citizen who sent the message (inbound reply)  
**Meta Category:** `UTILITY`  
**Note:** This is an **outbound reply to an inbound message** — uses session messaging (within 24-hour window), not a pre-approved template. If outside the 24-hour window, the system uses the pre-approved template below.

#### Inbound Detection Logic

```
Citizen sends: "NIV-2026-01247"
   ↓
Webhook receives message
   ↓
Regex match: /^NIV-\d{4}-\d{5}$/
   ↓
Look up nivedan in database by tracking_id
   ↓
If found → send BOT_STATUS reply
If not found → send BOT_NOT_FOUND reply
```

#### Message Text (Bot Reply — Found)

```
नमस्कार! 👋

आपल्या तक्रारीची सद्यस्थिती:

📋 तक्रार क्र.: {{1}}
📌 विषय: {{2}}
🔄 सध्याची स्थिती: {{3}}
🏢 संबंधित विभाग: {{4}}
📅 शेवटची कार्यवाही: {{5}}

{{6}}

— {{7}} कार्यालय, व्हॉट्सअॅप सेवा
```

**Placeholders:**

| Position | Variable | Example |
|----------|----------|---------|
| `{{1}}` | `tracking_id` | NIV-2026-01247 |
| `{{2}}` | `nivedan_subject` | पाणीपुरवठा समस्या, वडगाव |
| `{{3}}` | `status_mr` | संबंधित विभागाकडे वर्ग केले |
| `{{4}}` | `department_mr` | पाणीपुरवठा विभाग _(if not assigned: "अद्याप नियुक्त नाही")_ |
| `{{5}}` | `last_action_date` | ०१/०८/२०२६ |
| `{{6}}` | `resolution_note` | _(if RESOLVED: "✅ आपली तक्रार निकाली झाली आहे." else empty)_ |
| `{{7}}` | `mla_name_mr` | राजेश शर्मा |

#### Message Text (Bot Reply — Not Found)

```
क्षमस्व! 🙏

आपण पाठवलेला तक्रार क्रमांक ({{1}}) आमच्या प्रणालीत आढळला नाही.

कृपया तपासा:
• क्रमांक बरोबर असावा: NIV-XXXX-XXXXX
• उदाहरण: NIV-2026-01247

अन्य सहाय्यासाठी "HELP" किंवा "मदत" पाठवा.

— {{2}} कार्यालय
```

**Placeholders:**

| Position | Variable | Example |
|----------|----------|---------|
| `{{1}}` | `user_sent_text` | NIV-2026-99999 |
| `{{2}}` | `mla_name_mr` | राजेश शर्मा |

#### Meta WABA Submission Format (for out-of-window use)

```json
{
  "name": "bot_status_reply_mr",
  "language": "mr",
  "category": "UTILITY",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "तक्रार स्थिती 📋"
    },
    {
      "type": "BODY",
      "text": "नमस्कार! 👋\n\nआपल्या तक्रारीची सद्यस्थिती:\n\n📋 तक्रार क्र.: {{1}}\n📌 विषय: {{2}}\n🔄 सध्याची स्थिती: {{3}}\n🏢 संबंधित विभाग: {{4}}\n📅 शेवटची कार्यवाही: {{5}}\n\n{{6}}\n\n— {{7}} कार्यालय, व्हॉट्सअॅप सेवा",
      "example": {
        "body_text": [["NIV-2026-01247", "पाणीपुरवठा समस्या, वडगाव", "संबंधित विभागाकडे वर्ग केले", "पाणीपुरवठा विभाग", "०१/०८/२०२६", "", "राजेश शर्मा"]]
      }
    }
  ]
}
```

---

### Template 6: Tracking Bot Help (बॉट — मदत)

**Code:** `BOT_HELP`  
**Trigger:** Citizen sends any unrecognized message, `HELP`, or `मदत` to the WhatsApp number  
**Recipient:** The citizen who sent the message  
**Meta Category:** `UTILITY`  
**Note:** Session message (within 24-hour window)

#### Message Text

```
नमस्कार! 👋 आमदार {{1}} कार्यालयाच्या व्हॉट्सअॅप सेवेत आपले स्वागत आहे.

या सेवेद्वारे आपण आपल्या तक्रारीची स्थिती जाणून घेऊ शकता.

📲 कसे वापरावे:
• आपला तक्रार क्रमांक या क्रमांकावर पाठवा
• उदाहरण: NIV-2026-01247
• तक्रार क्रमांक तक्रार नोंदणी वेळी SMS/WhatsApp द्वारे मिळालेला असेल

🏢 कार्यालय संपर्क:
📞 {{2}}
🕐 सोमवार ते शनिवार, सकाळी १० ते सायं ५

— {{1}} कार्यालय
```

**Placeholders:**

| Position | Variable | Example |
|----------|----------|---------|
| `{{1}}` | `mla_name_mr` | राजेश शर्मा |
| `{{2}}` | `office_phone` | ०२०-२५५१२३४५ |

#### Meta WABA Submission Format

```json
{
  "name": "bot_help_mr",
  "language": "mr",
  "category": "UTILITY",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "आमदार कार्यालय — मदत 🙏"
    },
    {
      "type": "BODY",
      "text": "नमस्कार! 👋 आमदार {{1}} कार्यालयाच्या व्हॉट्सअॅप सेवेत आपले स्वागत आहे.\n\nया सेवेद्वारे आपण आपल्या तक्रारीची स्थिती जाणून घेऊ शकता.\n\n📲 कसे वापरावे:\n• आपला तक्रार क्रमांक या क्रमांकावर पाठवा\n• उदाहरण: NIV-2026-01247\n• तक्रार क्रमांक तक्रार नोंदणी वेळी SMS/WhatsApp द्वारे मिळालेला असेल\n\n🏢 कार्यालय संपर्क:\n📞 {{2}}\n🕐 सोमवार ते शनिवार, सकाळी १० ते सायं ५\n\n— {{1}} कार्यालय",
      "example": {
        "body_text": [["राजेश शर्मा", "०२०-२५५१२३४५"]]
      }
    }
  ]
}
```

---

## 6. Templates — Events & Invitations

---

### Template 7: Event Invitation (कार्यक्रम निमंत्रण)

**Code:** `EVENT_INVITE`  
**Trigger:** Manual — PA selects an event from Calendar and sends invitation to selected karyakarta groups  
**Recipient:** Selected karyakartas / workers (from audience selector)  
**Meta Category:** `MARKETING`

#### Message Text

```
🙏 आदरणीय {{1}},

आपणास {{2}} कार्यक्रमास उपस्थित राहण्याचे निमंत्रण देण्यात येत आहे.

📅 दिनांक: {{3}}
🕐 वेळ: {{4}}
📍 ठिकाण: {{5}}

आपली उपस्थिती अत्यंत महत्त्वाची आहे. कृपया वेळेत उपस्थित राहावे.

— {{6}}
   आमदार, {{7}}
```

**Placeholders:**

| Position | Variable | Example |
|----------|----------|---------|
| `{{1}}` | `karyakarta_name` | प्रकाश मोरे |
| `{{2}}` | `event_name` | ग्रामसभा कार्यक्रम |
| `{{3}}` | `event_date` | ०५/०८/२०२६ |
| `{{4}}` | `event_time` | सकाळी १० वाजता |
| `{{5}}` | `event_location` | ग्रामपंचायत सभागृह, वडगाव |
| `{{6}}` | `mla_name_mr` | राजेश शर्मा |
| `{{7}}` | `constituency_mr` | कोल्हापूर दक्षिण विधानसभा मतदारसंघ |

#### Meta WABA Submission Format

```json
{
  "name": "event_invitation_mr",
  "language": "mr",
  "category": "MARKETING",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "कार्यक्रम निमंत्रण 🎪"
    },
    {
      "type": "BODY",
      "text": "🙏 आदरणीय {{1}},\n\nआपणास {{2}} कार्यक्रमास उपस्थित राहण्याचे निमंत्रण देण्यात येत आहे.\n\n📅 दिनांक: {{3}}\n🕐 वेळ: {{4}}\n📍 ठिकाण: {{5}}\n\nआपली उपस्थिती अत्यंत महत्त्वाची आहे. कृपया वेळेत उपस्थित राहावे.\n\n— {{6}}\n   आमदार, {{7}}",
      "example": {
        "body_text": [["प्रकाश मोरे", "ग्रामसभा कार्यक्रम", "०५/०८/२०२६", "सकाळी १० वाजता", "ग्रामपंचायत सभागृह, वडगाव", "राजेश शर्मा", "कोल्हापूर दक्षिण विधानसभा मतदारसंघ"]]
      }
    },
    {
      "type": "FOOTER",
      "text": "हे निमंत्रण आमदार कार्यालयाकडून पाठवले जात आहे."
    }
  ]
}
```

---

## 7. Templates — Broadcasts & Announcements

---

### Template 8: Broadcast Announcement (सर्वसाधारण घोषणा)

**Code:** `BROADCAST`  
**Trigger:** Manual — PA composes a custom message and selects audience  
**Recipient:** Selected group (all workers / by booth / by village / custom list)  
**Meta Category:** `MARKETING`  
**Note:** Because the body is fully customizable, Meta requires a **generic wrapper template**. The PA's message is injected into `{{2}}`.

#### Message Text

```
🔔 {{1}} कार्यालयाकडून महत्त्वाची सूचना:

{{2}}

📅 दिनांक: {{3}}

— {{1}}
   आमदार, {{4}}
```

**Placeholders:**

| Position | Variable | Example |
|----------|----------|---------|
| `{{1}}` | `mla_name_mr` | राजेश शर्मा |
| `{{2}}` | `custom_message_body` | उद्या दि. ०३/०८/२०२६ रोजी वडगाव येथे रक्तदान शिबिर आयोजित करण्यात आले आहे. सर्व कार्यकर्त्यांनी उपस्थित राहावे. |
| `{{3}}` | `send_date` | ०२/०८/२०२६ |
| `{{4}}` | `constituency_mr` | कोल्हापूर दक्षिण विधानसभा मतदारसंघ |

> **Important:** Meta's `MARKETING` template review is strict. The `{{2}}` (custom body) must remain within limits: no promotional pricing, no spam-like content. PA is shown a warning before sending.

#### Meta WABA Submission Format

```json
{
  "name": "broadcast_announcement_mr",
  "language": "mr",
  "category": "MARKETING",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "{{1}} कार्यालय — सूचना 📢"
    },
    {
      "type": "BODY",
      "text": "🔔 {{1}} कार्यालयाकडून महत्त्वाची सूचना:\n\n{{2}}\n\n📅 दिनांक: {{3}}\n\n— {{1}}\n   आमदार, {{4}}",
      "example": {
        "body_text": [["राजेश शर्मा", "उद्या दि. ०३/०८/२०२६ रोजी वडगाव येथे रक्तदान शिबिर आयोजित करण्यात आले आहे.", "०२/०८/२०२६", "कोल्हापूर दक्षिण विधानसभा मतदारसंघ"]]
      }
    },
    {
      "type": "FOOTER",
      "text": "हे संदेश आमदार कार्यालयाकडून पाठवले जात आहे."
    }
  ]
}
```

---

## 8. Templates — Karyakarta (कार्यकर्ता) Messages

---

### Template 9: New Karyakarta Welcome (नवीन कार्यकर्ता स्वागत)

**Code:** `KK_WELCOME`  
**Trigger:** Automatically sent when a new karyakarta record is created in the Karyakarta Master module  
**Recipient:** Karyakarta's mobile number  
**Meta Category:** `UTILITY`

#### Message Text

```
नमस्कार {{1}}! 🙏

{{2}} विधानसभा मतदारसंघाच्या कार्यकर्ता संघटनेत आपले हार्दिक स्वागत आहे!

👤 नाव: {{1}}
🏠 गाव/वॉर्ड: {{3}}
📋 पदनाम: {{4}}

आपण आता आमदार {{5}} यांच्या टीमचा एक महत्त्वाचा भाग आहात. एकत्रितपणे आपण मतदारसंघाचा विकास करू.

जय महाराष्ट्र! 🙏

— {{5}} कार्यालय
```

**Placeholders:**

| Position | Variable | Example |
|----------|----------|---------|
| `{{1}}` | `karyakarta_name` | प्रकाश मोरे |
| `{{2}}` | `constituency_mr` | करवीर |
| `{{3}}` | `village_or_ward` | मौजे वडगाव |
| `{{4}}` | `designation_mr` | बूथ प्रमुख |
| `{{5}}` | `mla_name_mr` | राजेश शर्मा |

#### Meta WABA Submission Format

```json
{
  "name": "karyakarta_welcome_mr",
  "language": "mr",
  "category": "UTILITY",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "स्वागत आहे! 🎉"
    },
    {
      "type": "BODY",
      "text": "नमस्कार {{1}}! 🙏\n\n{{2}} विधानसभा मतदारसंघाच्या कार्यकर्ता संघटनेत आपले हार्दिक स्वागत आहे!\n\n👤 नाव: {{1}}\n🏠 गाव/वॉर्ड: {{3}}\n📋 पदनाम: {{4}}\n\nआपण आता आमदार {{5}} यांच्या टीमचा एक महत्त्वाचा भाग आहात. एकत्रितपणे आपण मतदारसंघाचा विकास करू.\n\nजय महाराष्ट्र! 🙏\n\n— {{5}} कार्यालय",
      "example": {
        "body_text": [["प्रकाश मोरे", "करवीर", "मौजे वडगाव", "बूथ प्रमुख", "राजेश शर्मा"]]
      }
    },
    {
      "type": "FOOTER",
      "text": "हे संदेश आमदार कार्यालय प्रणालीद्वारे पाठवले जाते."
    }
  ]
}
```

---

## 9. Templates — Development Works (विकासकामे)

---

### Template 10: Development Work Update (विकासकाम अद्यतन)

**Code:** `WORK_UPDATE`  
**Trigger:** Manual (PA clicks "Notify") or Automatic on work status milestone (e.g., Sanctioned → In Progress, In Progress → Completed)  
**Recipient:** Karyakartas of the concerned village/ward  
**Meta Category:** `UTILITY`

#### Message Text

```
🏗️ विकासकाम अद्यतन

{{1}} मतदारसंघातील खालील विकासकामाची स्थिती अद्यतनित झाली आहे:

🔨 काम: {{2}}
📍 ठिकाण: {{3}}
📌 नवीन स्थिती: {{4}}
💰 अनुदान: {{5}}
📅 दिनांक: {{6}}

{{7}}

— आमदार {{8}} कार्यालय
```

**Placeholders:**

| Position | Variable | Example |
|----------|----------|---------|
| `{{1}}` | `constituency_mr` | करवीर |
| `{{2}}` | `work_name` | वडगाव-आंबेगाव रस्ता बांधकाम |
| `{{3}}` | `work_location` | मौजे वडगाव, ता. करवीर |
| `{{4}}` | `work_status_mr` | काम सुरू झाले / काम पूर्ण झाले |
| `{{5}}` | `budget_amount` | ₹२५ लाख (आमदार निधी) |
| `{{6}}` | `update_date` | ०२/०८/२०२६ |
| `{{7}}` | `completion_note` | _(if COMPLETED: "🎉 हे काम यशस्वीरित्या पूर्ण झाले आहे. नागरिकांचे अभिनंदन!" else empty)_ |
| `{{8}}` | `mla_name_mr` | राजेश शर्मा |

**Work Status → Marathi Mapping:**

| Status Code | `{work_status_mr}` value |
|-------------|--------------------------|
| `SANCTIONED` | मंजुरी मिळाली |
| `IN_PROGRESS` | काम सुरू झाले |
| `COMPLETED` | काम पूर्ण झाले |
| `DELAYED` | काम विलंबित आहे |

#### Meta WABA Submission Format

```json
{
  "name": "work_update_mr",
  "language": "mr",
  "category": "UTILITY",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "विकासकाम अद्यतन 🏗️"
    },
    {
      "type": "BODY",
      "text": "🏗️ विकासकाम अद्यतन\n\n{{1}} मतदारसंघातील खालील विकासकामाची स्थिती अद्यतनित झाली आहे:\n\n🔨 काम: {{2}}\n📍 ठिकाण: {{3}}\n📌 नवीन स्थिती: {{4}}\n💰 अनुदान: {{5}}\n📅 दिनांक: {{6}}\n\n{{7}}\n\n— आमदार {{8}} कार्यालय",
      "example": {
        "body_text": [["करवीर", "वडगाव-आंबेगाव रस्ता बांधकाम", "मौजे वडगाव, ता. करवीर", "काम पूर्ण झाले", "₹२५ लाख (आमदार निधी)", "०२/०८/२०२६", "🎉 हे काम यशस्वीरित्या पूर्ण झाले आहे.", "राजेश शर्मा"]]
      }
    },
    {
      "type": "FOOTER",
      "text": "हे संदेश आमदार कार्यालय प्रणालीद्वारे पाठवले जाते."
    }
  ]
}
```

---

## 10. Templates — Visitor Book (व्हिजिटर)

---

### Template 11: Visitor Appointment Reminder (व्हिजिटर स्मरणपत्र)

**Code:** `VISITOR_REMINDER`  
**Trigger:** Automatically sent 1 hour before a visitor's scheduled appointment time  
**Recipient:** Visitor's mobile number (from visitor entry)  
**Meta Category:** `UTILITY`

#### Message Text

```
नमस्कार {{1}},

आपण {{2}} आमदार कार्यालयात भेटीसाठी नोंद केली आहे.

⏰ वेळ: {{3}} (आजच)
📍 ठिकाण: {{4}}
👤 भेटीचे कारण: {{5}}

कृपया ओळखपत्र (आधार कार्ड / मतदार कार्ड) सोबत आणावे.

— {{2}} कार्यालय
```

**Placeholders:**

| Position | Variable | Example |
|----------|----------|---------|
| `{{1}}` | `visitor_name` | अनिता कांबळे |
| `{{2}}` | `mla_name_mr` | राजेश शर्मा |
| `{{3}}` | `appointment_time` | दुपारी ३ वाजता |
| `{{4}}` | `office_address_short` | राजारामपुरी, कोल्हापूर |
| `{{5}}` | `visit_purpose_mr` | तक्रार / शिफारस / सद्भेट |

#### Meta WABA Submission Format

```json
{
  "name": "visitor_reminder_mr",
  "language": "mr",
  "category": "UTILITY",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "भेट स्मरणपत्र ⏰"
    },
    {
      "type": "BODY",
      "text": "नमस्कार {{1}},\n\nआपण {{2}} आमदार कार्यालयात भेटीसाठी नोंद केली आहे.\n\n⏰ वेळ: {{3}} (आजच)\n📍 ठिकाण: {{4}}\n👤 भेटीचे कारण: {{5}}\n\nकृपया ओळखपत्र (आधार कार्ड / मतदार कार्ड) सोबत आणावे.\n\n— {{2}} कार्यालय",
      "example": {
        "body_text": [["अनिता कांबळे", "राजेश शर्मा", "दुपारी ३ वाजता", "राजारामपुरी, कोल्हापूर", "शिफारस"]]
      }
    },
    {
      "type": "FOOTER",
      "text": "हे संदेश आमदार कार्यालय प्रणालीद्वारे पाठवले जाते."
    }
  ]
}
```

---

## 11. Inbound Message Handling Logic

Full webhook flow for inbound citizen messages:

```
Citizen sends WhatsApp message
          │
          ▼
┌─────────────────────────────────┐
│  Webhook receives message       │
│  POST /webhooks/whatsapp        │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Parse message body             │
│  Normalize: trim, uppercase     │
└────────────┬────────────────────┘
             │
     ┌───────┴──────┐
     │              │
     ▼              ▼
Is "HELP"      Regex match
or "मदत"?     NIV-\d{4}-\d{5}
     │              │
     ▼              ▼
Send          Look up in DB
BOT_HELP      by tracking_id
              │
         ┌────┴────┐
         │         │
         ▼         ▼
      Found     Not Found
         │         │
         ▼         ▼
   Send         Send
  BOT_STATUS  BOT_NOT_FOUND
  (status)    message
```

---

## 12. Delivery & Fallback Rules

| Scenario | Behavior |
|----------|----------|
| Message delivered ✅ | Log status as `DELIVERED` |
| Message read ✅ | Log status as `READ` (double blue tick) |
| Delivery fails (1st attempt) | Retry after 5 minutes |
| Delivery fails (2nd attempt) | Retry after 15 minutes |
| Delivery fails (3rd attempt) | Mark as `FAILED`, trigger SMS fallback via Twilio |
| Recipient not on WhatsApp | SMS fallback immediately on 1st failure |
| Rate limit hit | Queue message, retry after 1 hour |
| Template not approved | System error — alert Admin, block send |

---

## 13. Message Log Schema

Every sent message is logged in the `whatsapp_message_log` table:

```javascript
{
  id:               INTEGER AUTO_INCREMENT,
  recipient_mobile: VARCHAR(15),        // Recipient's WhatsApp number
  recipient_name:   VARCHAR(100),       // For display in log
  template_code:    VARCHAR(50),        // e.g., "NIV_ACK"
  template_name:    VARCHAR(100),       // Meta template name
  placeholders:     JSON,              // Values injected into template
  linked_entity:    VARCHAR(20),        // "nivedan" | "visitor" | "event" | "work"
  linked_entity_id: INTEGER,            // FK to the linked record
  status:           ENUM('QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED'),
  sent_at:          DATETIME,
  delivered_at:     DATETIME NULL,
  read_at:          DATETIME NULL,
  failed_reason:    TEXT NULL,
  sms_fallback:     BOOLEAN DEFAULT FALSE,
  sent_by_user_id:  INTEGER NULL,       // NULL = auto-triggered, else PA user ID
  created_at:       DATETIME
}
```

---

## 14. Meta Template Submission Checklist

Before going live, all templates must be submitted and approved via the Meta Business Manager:

| Step | Action |
|------|--------|
| **1** | Register a WhatsApp Business Account (WABA) on Meta Business Manager |
| **2** | Add the WhatsApp Business Number to the WABA |
| **3** | Submit each template JSON (from Sections 4–10 above) via Meta Graph API or Business Manager UI |
| **4** | Wait for Meta approval (typically 24–48 hours; UTILITY templates are faster) |
| **5** | Store approved `template_name` and `template_id` in the app's `.env` / config |
| **6** | Test each template with a real number before enabling in production |

**Template Approval Status Tracking:**

| Template Code | Meta Template Name | Category | Status |
|--------------|-------------------|----------|--------|
| `NIV_ACK` | `niv_acknowledgment_mr` | UTILITY | ⏳ Pending |
| `NIV_STATUS` | `niv_status_update_mr` | UTILITY | ⏳ Pending |
| `NIV_RESOLVED` | `niv_resolved_mr` | UTILITY | ⏳ Pending |
| `NIV_REJECTED` | `niv_rejected_mr` | UTILITY | ⏳ Pending |
| `BOT_STATUS` | `bot_status_reply_mr` | UTILITY | ⏳ Pending |
| `BOT_HELP` | `bot_help_mr` | UTILITY | ⏳ Pending |
| `EVENT_INVITE` | `event_invitation_mr` | MARKETING | ⏳ Pending |
| `BROADCAST` | `broadcast_announcement_mr` | MARKETING | ⏳ Pending |
| `KK_WELCOME` | `karyakarta_welcome_mr` | UTILITY | ⏳ Pending |
| `WORK_UPDATE` | `work_update_mr` | UTILITY | ⏳ Pending |
| `VISITOR_REMINDER` | `visitor_reminder_mr` | UTILITY | ⏳ Pending |
