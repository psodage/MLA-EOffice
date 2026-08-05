# MLA E-Office — AI Letter Drafting Specification

> **Complete AI Outward Letter Generation Spec — Input Schema, Tone Variants, Letter Format, Gemini Prompt Engineering, and 8 Full Input→Output Examples**
> 
> This document defines how the Gemini AI generates formal government outward letters on behalf of the MLA. The PA selects input parameters and the AI produces a ready-to-review letter draft.
> 
> *Related Documents:* [PROJECT_SECTIONS_BREAKDOWN.md](file:///s:/MLA%20E%20-%20Office/PROJECT_SECTIONS_BREAKDOWN.md) | [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md) | [GLOSSARY.md](file:///s:/MLA%20E%20-%20Office/GLOSSARY.md) | [TECH_STACK.md](file:///s:/MLA%20E%20-%20Office/TECH_STACK.md) | [API_SPEC.md](file:///s:/MLA%20E%20-%20Office/API_SPEC.md)

---

## 1. Feature Overview

| Property | Value |
|----------|-------|
| **Feature Name** | AI-Assisted Outward Letter Drafting |
| **AI Engine** | Google Gemini API (per `TECH_STACK.md`) |
| **Model** | `gemini-2.0-flash` (production), `gemini-2.5-flash-preview` (fallback) |
| **Who Uses It** | PA (primary), MLA (secondary — review only) |
| **Access Point** | "✨ Draft with AI" button on the Outward Letter form (`/outward/new`) |
| **Output** | Formal government-style letter in Marathi or English |
| **Human Review** | **Always required** — AI generates a draft, PA reviews and edits before finalizing |
| **Linked Inward** | Optionally references an inward entry for context |
| **Output Destination** | Populates the rich text editor on the Outward form |
| **Saved As** | PDF (for printing) + stored in `outward_letters` table |

---

## 2. AI Input Form (PA's Interface)

When PA clicks "✨ Draft with AI" on the outward form, a modal opens with these input fields:

### Input Fields

| Field | Type | Required | Source | Description |
|-------|------|:---:|--------|-------------|
| Reference Inward | Linked Select | ❌ | `inward` table | Select an inward entry this letter responds to. Auto-fills subject, sender details |
| Recipient Department | Select | ✅ | `departments` master | Target government department (20 options from `MASTER_DATA.md` Section 2) |
| Recipient Name | Text | ❌ | Auto-filled or typed | Officer name. Auto-fills from department's `default_officer_designation` |
| Recipient Designation | Text | ❌ | Auto-filled or typed | Officer title (e.g., "जिल्हाधिकारी") |
| Subject / Context | Textarea | ✅ | Typed or from inward | What the letter is about. PA can type freely or it pre-fills from linked inward subject |
| Additional Context | Textarea | ❌ | Typed | Extra details PA wants in the letter (citizen details, complaint specifics, urgency) |
| Tone / Type | Select | ✅ | Enum (8 types) | See Section 3 below |
| Language | Select | ✅ | `MARATHI` / `ENGLISH` | PA chooses output language. Default: `MARATHI` |
| Previous Letters | Auto | ❌ | System lookup | If there are prior outward letters to this department on the same subject, they are auto-included as context |
| Citizen Name | Text | ❌ | From linked nivedan | Name of the citizen on whose behalf the letter is written |
| Citizen Tracking ID | Text | ❌ | From linked nivedan | Nivedan tracking ID (e.g., NIV-2026-01247) |

### Auto-Fill Behavior

When PA selects a **Reference Inward**:
- `Subject` ← Inward's subject field
- `Recipient Department` ← Inward's sender department (reverse correspondence)
- `Recipient Name` ← Inward's sender name
- `Additional Context` ← Inward's description

When PA selects from a **linked Nivedan** (via inward → nivedan association):
- `Citizen Name` ← Nivedan's citizen name
- `Citizen Tracking ID` ← Nivedan's tracking ID
- `Subject` ← Nivedan's subject + category

---

## 3. Letter Tone / Type Variants (8 Types)

Each tone produces a letter with a distinctly different structure, vocabulary, and assertiveness level.

| # | Tone Code | English | Marathi | Assertiveness | Use Case |
|---|-----------|---------|---------|:---:|----------|
| 1 | `FORMAL_REQUEST` | Formal Request | विनंती | ★★☆☆ | Requesting action on a citizen issue — polite but clear expectation |
| 2 | `FOLLOW_UP` | Follow-Up / Reminder | पाठपुरावा | ★★★☆ | Following up on a previously sent letter that got no response |
| 3 | `ESCALATION` | Complaint / Escalation | तक्रार / वाढवणे | ★★★★ | Escalating an unresolved issue — firm, references deadlines |
| 4 | `RECOMMENDATION` | Recommendation Letter | शिफारसपत्र | ★★☆☆ | Recommending a citizen for a government scheme or benefit |
| 5 | `ACKNOWLEDGMENT` | Acknowledgment | पोहोचपावती | ★☆☆☆ | Acknowledging receipt of a letter or document |
| 6 | `INQUIRY` | Inquiry / Status Request | चौकशी | ★★☆☆ | Requesting information or status update from a department |
| 7 | `INSTRUCTION` | Instruction / Directive | सूचना / आदेश | ★★★★ | Directing a department to take specific action — authoritative |
| 8 | `APPRECIATION` | Thank You / Appreciation | आभार / कौतुक | ★☆☆☆ | Thanking a department for resolving an issue |

### Tone-Specific Language Guidelines

| Tone | Opening Phrase (Marathi) | Key Vocabulary | Closing Style |
|------|------------------------|----------------|---------------|
| `FORMAL_REQUEST` | "सदर विषयाबाबत आपणास विनंती करण्यात येत आहे की..." | विनंती, कृपया, आपल्या विभागाकडून, कार्यवाही | "तरी सदर प्रकरणी योग्य ती कार्यवाही करावी ही विनंती." |
| `FOLLOW_UP` | "दि. {prev_date} रोजीच्या पत्र क्र. {prev_ref} अन्वये..." | पाठपुरावा, अद्याप, प्रलंबित, त्वरित | "तरी सदर प्रकरणी त्वरित कार्यवाही करावी ही विनंती." |
| `ESCALATION` | "उपरोक्त विषयाबाबत यापूर्वी अनेकदा पत्रव्यवहार करण्यात आला आहे..." | गंभीर, दुर्लक्ष, तातडीने, अत्यंत | "तरी तातडीने कार्यवाही न केल्यास वरिष्ठ पातळीवर..." |
| `RECOMMENDATION` | "श्री./श्रीमती {citizen_name} यांच्या बाबतीत शिफारस..." | शिफारस, पात्र, लाभ, योजना | "तरी वरील नागरिकास योजनेचा लाभ मिळवून द्यावा." |
| `ACKNOWLEDGMENT` | "आपले दि. {date} चे पत्र क्र. {ref} प्राप्त झाले आहे..." | पोहोचपावती, प्राप्त, नोंद, धन्यवाद | "सदर पत्राची नोंद घेण्यात आली आहे." |
| `INQUIRY` | "सदर विषयाबाबत माहिती मिळावी म्हणून..." | माहिती, स्थिती, कळवावे, सद्यस्थिती | "तरी सदर प्रकरणाची सद्यस्थिती कळवावी." |
| `INSTRUCTION` | "सदर विषयाबाबत खालीलप्रमाणे कार्यवाही करावी..." | आदेश, निर्देश, तात्काळ, कार्यवाही | "वरीलप्रमाणे कार्यवाही करून अहवाल सादर करावा." |
| `APPRECIATION` | "आपल्या विभागाने केलेल्या कार्यवाहीबद्दल आभार..." | आभार, कौतुक, कार्यतत्परता, उत्तम | "आपल्या कार्यतत्परतेबद्दल पुन्हा एकदा धन्यवाद." |

---

## 4. Output Letter Format

### 4A. Letterhead (Dynamic — from Constituency Profile)

The letterhead is populated from the `constituency_profile` settings table (to be created in `CONSTITUENCY_PROFILE.md`):

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  {party_logo}    {mla_name} ({party_abbreviation})                  │
│                  आमदार, {constituency_name} विधानसभा मतदारसंघ        │
│                  {MLA_name_en}, MLA — {constituency_name_en}         │
│                                                                     │
│  कार्यालय:  {office_address_mr}                                     │
│  Office:   {office_address_en}                                      │
│  दूरध्वनी: {office_phone} | ई-मेल: {office_email}                   │
│                                                                     │
│  ───────────────────────────────────────────────────────────────     │
└─────────────────────────────────────────────────────────────────────┘
```

**Placeholder Variables:**

| Variable | Source | Example |
|----------|--------|---------|
| `{mla_name}` | `constituency_profile.mla_name_mr` | श्री. राजेश शर्मा |
| `{mla_name_en}` | `constituency_profile.mla_name_en` | Hon. Rajesh Sharma |
| `{party_abbreviation}` | `constituency_profile.party_short` | BJP / NCP / SS etc. |
| `{party_logo}` | `constituency_profile.party_logo_url` | Cloudinary URL |
| `{constituency_name}` | `constituency_profile.constituency_name_mr` | कोल्हापूर दक्षिण |
| `{constituency_name_en}` | `constituency_profile.constituency_name_en` | Kolhapur South |
| `{office_address_mr}` | `constituency_profile.office_address_mr` | प्लॉट नं. ४५, राजारामपुरी, कोल्हापूर - ४१६००८ |
| `{office_address_en}` | `constituency_profile.office_address_en` | Plot No. 45, Rajarampuri, Kolhapur - 416008 |
| `{office_phone}` | `constituency_profile.phone` | 020-25512345 |
| `{office_email}` | `constituency_profile.email` | mla.kolhapursouth@gov.in |

### 4B. Letter Body Structure

Every AI-generated letter must follow this exact structure:

```
────────────────────────────────────────────────────────────────
                    [ LETTERHEAD ]
────────────────────────────────────────────────────────────────

जावक क्र.: {outward_number}                  दिनांक: {date}
Outward No.: {outward_number}                 Date: {date}

संदर्भ / Ref: {reference_line}               (if applicable)

प्रति / To:
{recipient_designation}
{recipient_name}
{recipient_department}
{recipient_address}

विषय / Subject: {subject_line}

महोदय / Sir,

    {body_paragraph_1}

    {body_paragraph_2}

    {body_paragraph_3_if_needed}

    {closing_line}

                                              आपला विश्वासू,
                                              
                                              {mla_signature}
                                              {mla_name}
                                              आमदार, {constituency}

प्रत / CC:
{cc_list_if_any}

────────────────────────────────────────────────────────────────
```

### 4C. Mandatory Sections

| Section | Required | Description |
|---------|:---:|-------------|
| Outward Number | ✅ | Auto-generated: `OUT/YYYY/NNNN` |
| Date | ✅ | Current date in `DD/MM/YYYY` format |
| Reference Line | ❌ | Links to inward number, previous outward, or nivedan tracking ID |
| Recipient Block | ✅ | Designation, name, department, address |
| Subject Line | ✅ | Clear, concise topic (max 2 lines) |
| Salutation | ✅ | "महोदय" (Marathi) / "Sir" or "Madam" (English) |
| Body | ✅ | 2-4 paragraphs with proper structure |
| Closing Line | ✅ | Tone-specific closing (see Section 3) |
| Signature Block | ✅ | MLA name, designation, constituency |
| CC (Copy To) | ❌ | Optional list of other recipients |

### 4D. Body Paragraph Rules

| Paragraph | Content | Purpose |
|-----------|---------|---------|
| **Para 1 — Context** | Reference previous correspondence, state the reason for writing | Establishes background |
| **Para 2 — Details** | Describe the specific issue, citizen details, affected area, dates | Provides actionable details |
| **Para 3 — Impact** | Explain public impact, number of affected citizens, urgency | Builds case for action |
| **Para 4 — Request** | State the specific action requested, include deadline if applicable | Clear call to action |
| **Closing Line** | Tone-specific closing phrase (from Section 3 table) | Formal sign-off |

---

## 5. Gemini API Integration

### 5A. API Configuration

```javascript
// config/ai.config.js
module.exports = {
  gemini: {
    model: 'gemini-2.0-flash',
    fallbackModel: 'gemini-2.5-flash-preview',
    maxOutputTokens: 2048,
    temperature: 0.3,         // Low temperature = formal, consistent output
    topP: 0.8,
    topK: 40,
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
    ],
    timeout: 30000,            // 30s timeout
    retries: 2                 // Retry on failure
  }
};
```

### 5B. System Prompt (Exact Text)

This is the system instruction sent with every AI letter request:

```
You are a formal government letter drafting assistant for an MLA (Member of Legislative Assembly) office in Maharashtra, India.

ROLE:
- You draft official correspondence from the MLA to government departments, officers, and public bodies.
- Your letters are used in real governance — they must be professional, precise, and formally structured.

LANGUAGE RULES:
- When language is "MARATHI": Write the entire letter in formal Marathi (शुद्ध मराठी). Use government/administrative Marathi vocabulary — NOT conversational Marathi.
- When language is "ENGLISH": Write in formal Indian government English. Use the formal register used in official government communications.
- Never mix languages within a letter. The entire letter must be in one language.
- Use honorifics: "महोदय/महोदया" (Marathi), "Respected Sir/Madam" (English).

LETTER FORMAT (STRICT):
Always output the letter in this exact structure:
1. REFERENCE LINE: "संदर्भ:" or "Ref:" — citing previous correspondence numbers if provided
2. TO BLOCK: Recipient designation, name, department — each on a new line
3. SUBJECT LINE: "विषय:" or "Subject:" — clear and concise (max 2 lines)
4. SALUTATION: "महोदय," or "Respected Sir/Madam,"
5. BODY: 2-4 paragraphs, properly indented. Each paragraph has a clear purpose.
6. CLOSING LINE: Tone-appropriate closing request or statement
7. SIGNATURE: "आपला विश्वासू," / "Yours faithfully," — then MLA name and designation

TONE GUIDELINES:
- FORMAL_REQUEST: Polite but assertive. Use "विनंती" language. Clear expectation of action.
- FOLLOW_UP: Reference previous letter date and number. Express concern over delay. More urgent than request.
- ESCALATION: Firm. Reference multiple previous attempts. Mention consequences of inaction. Use "तातडीने" / "urgently".
- RECOMMENDATION: Supportive. Highlight the citizen's eligibility and need. Use "शिफारस" language.
- ACKNOWLEDGMENT: Brief and courteous. Confirm receipt and note any next steps.
- INQUIRY: Neutral. Request specific information or status update. Use "कळवावे" / "kindly inform".
- INSTRUCTION: Authoritative. Direct a department to take specific action. Use "कार्यवाही करावी" / "take action".
- APPRECIATION: Warm but formal. Thank the officer/department for their work.

CRITICAL RULES:
- Do NOT include the letterhead — it is handled separately by the application.
- Do NOT include the outward number or date — they are auto-generated.
- Do NOT fabricate facts. Only use information provided in the input context.
- Do NOT use casual language, slang, or informal tone.
- Keep the letter concise — maximum 400 words for the body.
- If citizen details are provided, mention them in the body.
- If a tracking ID is provided, reference it.
- Always end with a clear, actionable request or statement.
```

### 5C. User Prompt Template

This is the dynamic prompt constructed from the PA's input:

```
Draft a formal {tone_type} letter with the following details:

LANGUAGE: {language}

RECIPIENT:
- Department: {recipient_department} ({recipient_department_mr})
- Officer: {recipient_designation}
- Name: {recipient_name}

SUBJECT: {subject}

CONTEXT:
{additional_context}

{IF reference_inward}
REFERENCE INWARD:
- Inward Number: {inward_number}
- Date Received: {inward_date}
- Sender: {inward_sender_name}, {inward_sender_designation}
- Subject: {inward_subject}
{END IF}

{IF citizen_details}
CITIZEN DETAILS:
- Name: {citizen_name}
- Tracking ID: {citizen_tracking_id}
- Category: {nivedan_category}
- Description: {nivedan_description}
{END IF}

{IF previous_letters}
PREVIOUS CORRESPONDENCE:
{for each letter in previous_letters}
- Outward No.: {letter.outward_number}, Date: {letter.date}, Subject: {letter.subject}
{end for}
{END IF}

MLA DETAILS (for signature):
- Name (Marathi): {mla_name_mr}
- Constituency: {constituency_name_mr}
- Designation: आमदार, {constituency_name_mr} विधानसभा मतदारसंघ

Generate only the letter body starting from the reference line. Do not include letterhead, outward number, or date.
```

### 5D. API Request/Response Flow

```
┌──────────────┐     ┌──────────────────────┐     ┌────────────────────┐
│  PA fills     │     │  Backend constructs  │     │  Gemini API        │
│  AI input     │────▶│  system + user       │────▶│  generates         │
│  form         │     │  prompt              │     │  letter draft      │
└──────────────┘     └──────────────────────┘     └────────┬───────────┘
                                                           │
┌──────────────┐     ┌──────────────────────┐              │
│  PA reviews   │◀───│  Frontend renders    │◀─────────────┘
│  edits,       │     │  draft in rich       │
│  finalizes    │     │  text editor         │
└──────┬───────┘     └──────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  System creates:                          │
│  • Outward entry with auto-number        │
│  • Letter saved as PDF (Cloudinary)      │
│  • Linked to reference inward/nivedan    │
│  • ai_drafted = true                     │
│  • Audit log entry                       │
└──────────────────────────────────────────┘
```

### 5E. API Endpoint

```
POST /api/ai/draft-letter

Request Body:
{
  "referenceInwardId": 42,              // optional
  "recipientDepartmentId": "COLLECTOR",
  "recipientName": "श्री. अमित कुलकर्णी",
  "recipientDesignation": "जिल्हाधिकारी",
  "subject": "मौजे वडगाव येथील पाणीपुरवठा समस्या",
  "additionalContext": "गेल्या ३ महिन्यांपासून वडगाव गावात पाणीपुरवठा अनियमित. 200 कुटुंबे प्रभावित.",
  "toneType": "FORMAL_REQUEST",
  "language": "MARATHI",
  "citizenName": "श्री. सुरेश जाधव",
  "citizenTrackingId": "NIV-2026-01247"
}

Response Body:
{
  "success": true,
  "draft": {
    "referenceLine": "संदर्भ: आवक क्र. INW/2026/0042, दि. 15/07/2026",
    "toBlock": "माननीय जिल्हाधिकारी,\nश्री. अमित कुलकर्णी,\nजिल्हाधिकारी कार्यालय, कोल्हापूर.",
    "subjectLine": "विषय: मौजे वडगाव येथील पाणीपुरवठा समस्या — तक्रार क्र. NIV-2026-01247",
    "salutation": "महोदय,",
    "body": "... (full letter body) ...",
    "closingLine": "तरी सदर प्रकरणी योग्य ती कार्यवाही करावी ही विनंती.",
    "signature": "आपला विश्वासू,\n\nश्री. राजेश शर्मा\nआमदार, कोल्हापूर दक्षिण विधानसभा मतदारसंघ",
    "fullText": "... (complete letter as single string) ..."
  },
  "metadata": {
    "model": "gemini-2.0-flash",
    "tokensUsed": 847,
    "generationTimeMs": 2340,
    "language": "MARATHI",
    "toneType": "FORMAL_REQUEST"
  }
}
```

### 5F. Error Handling

| Error | Response | UI Behavior |
|-------|----------|-------------|
| Gemini API timeout (30s) | `503 AI_SERVICE_TIMEOUT` | Toast: "AI service is slow. Please try again." + Retry button |
| Gemini content blocked | `422 AI_CONTENT_BLOCKED` | Toast: "Letter could not be generated. Please rephrase the subject." |
| Rate limit exceeded | `429 AI_RATE_LIMITED` | Toast: "Too many requests. Please wait 60 seconds." |
| Invalid input | `400 INVALID_INPUT` | Form validation errors highlighted |
| Gemini API key missing | `500 AI_NOT_CONFIGURED` | Toast: "AI service not configured. Contact admin." |
| Fallback model used | Success (with warning) | Toast: "Generated using fallback model." (info type) |

---

## 6. Letter Formatting Rules

### 6A. Date Formats in Letters

| Language | Format | Example |
|----------|--------|---------|
| Marathi | `दिनांक: DD/MM/YYYY` | दिनांक: ०२/०८/२०२६ |
| English | `Date: DD/MM/YYYY` | Date: 02/08/2026 |

### 6B. Salutation Rules

| Recipient | Marathi | English |
|-----------|---------|---------|
| Male officer | महोदय, | Respected Sir, |
| Female officer | महोदया, | Respected Madam, |
| Unknown / Generic | महोदय/महोदया, | Respected Sir/Madam, |
| Committee / Board | अध्यक्ष महोदय, | Respected Chairperson, |

### 6C. Reference Number Format

```
संदर्भ: १) आवक क्र. INW/2026/0042, दि. 15/07/2026
       २) जावक क्र. OUT/2026/0031, दि. 20/07/2026
       ३) तक्रार क्र. NIV-2026-01247
```

### 6D. CC (Copy To) Format

```
प्रत / CC:
१) विभागीय आयुक्त, कोल्हापूर विभाग
२) जिल्हा परिषद, मुख्य कार्यकारी अधिकारी
३) तक्रारदार: श्री. सुरेश जाधव (प्रत)
```

---

## 7. Sample Input → Output Pairs (8 Examples)

> **Note:** All examples use a fictional MLA — **श्री. राजेश शर्मा, आमदार, कोल्हापूर दक्षिण विधानसभा मतदारसंघ** — for illustration. In production, these values come from `constituency_profile`.

---

### Example 1: Formal Request — Water Supply (Marathi)

**Input:**

| Field | Value |
|-------|-------|
| Tone | `FORMAL_REQUEST` |
| Language | `MARATHI` |
| Department | Water Supply Department (पाणीपुरवठा विभाग) |
| Recipient | कार्यकारी अभियंता |
| Subject | मौजे वडगाव येथील पाणीपुरवठा समस्या |
| Context | गेल्या ३ महिन्यांपासून वडगाव गावात पाणीपुरवठा अनियमित आहे. दररोज फक्त अर्धा तास पाणी येते. सुमारे २०० कुटुंबे प्रभावित आहेत. |
| Citizen | श्री. सुरेश जाधव |
| Tracking ID | NIV-2026-01247 |

**Output:**

```
संदर्भ: तक्रार क्र. NIV-2026-01247

प्रति,
कार्यकारी अभियंता,
पाणीपुरवठा विभाग,
जिल्हा परिषद, कोल्हापूर.

विषय: मौजे वडगाव (ता. करवीर) येथील अनियमित पाणीपुरवठा समस्या — तक्रार क्र. NIV-2026-01247

महोदय,

    सदर विषयाबाबत आपणास विनंती करण्यात येत आहे की, करवीर तालुक्यातील मौजे वडगाव 
    येथील नागरिकांकडून पाणीपुरवठ्याबाबत तक्रार प्राप्त झाली आहे. श्री. सुरेश जाधव 
    यांनी सदर तक्रार या कार्यालयाकडे नोंदवली आहे (तक्रार क्र. NIV-2026-01247).

    तक्रारदारानुसार, गेल्या ३ महिन्यांपासून सदर गावात पाणीपुरवठा अत्यंत अनियमित 
    आहे. दररोज फक्त अर्धा तास पाणी पुरवले जात आहे, ज्यामुळे सुमारे २०० कुटुंबांना 
    पिण्याच्या पाण्यासाठी अडचणी येत आहेत. उन्हाळ्याच्या दिवसांत ही परिस्थिती 
    आणखी गंभीर होण्याची शक्यता आहे.

    तरी सदर गावातील पाणीपुरवठा योजनेची तपासणी करून, अनियमित पुरवठ्याचे कारण 
    शोधून, लवकरात लवकर नियमित पाणीपुरवठा सुरू करण्यासाठी योग्य ती कार्यवाही 
    करावी ही विनंती.

                                              आपला विश्वासू,

                                              श्री. राजेश शर्मा
                                              आमदार, कोल्हापूर दक्षिण विधानसभा मतदारसंघ
```

---

### Example 2: Follow-Up — Road to PWD (Marathi)

**Input:**

| Field | Value |
|-------|-------|
| Tone | `FOLLOW_UP` |
| Language | `MARATHI` |
| Department | PWD (सार्वजनिक बांधकाम विभाग) |
| Recipient | कार्यकारी अभियंता |
| Subject | वडगाव-आंबेगाव रस्ता दुरुस्ती — पाठपुरावा |
| Previous Letters | OUT/2026/0031 (20/06/2026), OUT/2026/0048 (10/07/2026) |
| Context | रस्त्यावर मोठे खड्डे पडले आहेत. अपघातांची शक्यता. दोन पूर्वीची पत्रे पाठवली, प्रतिसाद नाही. |

**Output:**

```
संदर्भ: १) जावक क्र. OUT/2026/0031, दि. 20/06/2026
       २) जावक क्र. OUT/2026/0048, दि. 10/07/2026

प्रति,
कार्यकारी अभियंता,
सार्वजनिक बांधकाम विभाग,
कोल्हापूर विभाग.

विषय: वडगाव-आंबेगाव रस्ता दुरुस्ती — तिसरा पाठपुरावा

महोदय,

    उपरोक्त विषयाबाबत या कार्यालयाकडून दि. 20/06/2026 (जावक क्र. OUT/2026/0031) 
    आणि दि. 10/07/2026 (जावक क्र. OUT/2026/0048) रोजी दोन पत्रे पाठवण्यात आली 
    होती. मात्र, आजपर्यंत आपल्या विभागाकडून कोणताही प्रतिसाद किंवा कार्यवाही 
    झालेली दिसून येत नाही.

    वडगाव-आंबेगाव रस्त्यावर मोठे खड्डे पडले असून, वाहतुकीस अडथळा होत आहे. 
    अनेक वाहनधारक व पादचाऱ्यांना अपघाताचा धोका निर्माण झाला आहे. स्थानिक 
    नागरिकांकडून सातत्याने तक्रारी प्राप्त होत आहेत.

    तरी सदर रस्त्याची तातडीने तपासणी करून, खड्डे बुजवण्यासह आवश्यक दुरुस्ती 
    कामे त्वरित सुरू करावीत ही विनंती. कृपया केलेल्या कार्यवाहीचा अहवाल 
    १५ दिवसांत या कार्यालयास कळवावा.

                                              आपला विश्वासू,

                                              श्री. राजेश शर्मा
                                              आमदार, कोल्हापूर दक्षिण विधानसभा मतदारसंघ
```

---

### Example 3: Escalation — Electricity to MSEDCL (Marathi)

**Input:**

| Field | Value |
|-------|-------|
| Tone | `ESCALATION` |
| Language | `MARATHI` |
| Department | MSEDCL (महावितरण) |
| Recipient | अधीक्षक अभियंता |
| Subject | शिरूर तालुक्यातील वारंवार वीज खंडित — गंभीर तक्रार |
| Context | 6 महिन्यांपासून दररोज 4-5 तास वीज खंडित. 15 गावे प्रभावित. 3 पूर्वीची पत्रे पाठवली — कार्यवाही शून्य. शेतकऱ्यांचे पिकांचे नुकसान. |

**Output:**

```
संदर्भ: या कार्यालयाची पूर्वीची पत्रे (३ पत्रे)

प्रति,
अधीक्षक अभियंता,
महावितरण (MSEDCL),
कोल्हापूर परिमंडल.

विषय: शिरूर तालुक्यातील सतत वीज खंडित होण्याबाबत — गंभीर तक्रार व एस्केलेशन

महोदय,

    उपरोक्त विषयाबाबत या कार्यालयाकडून यापूर्वी तीन वेळा पत्रव्यवहार करण्यात 
    आला आहे. मात्र, अत्यंत खेदाने नमूद करावे लागते की, आपल्या विभागाकडून सदर 
    गंभीर समस्येकडे पूर्णपणे दुर्लक्ष करण्यात आले आहे.

    शिरूर तालुक्यातील १५ गावांमध्ये गेल्या ६ महिन्यांपासून दररोज ४ ते ५ तास 
    वीज खंडित होत आहे. यामुळे शेतकऱ्यांच्या सिंचन पंपांना वीज मिळत नसल्याने 
    पिकांचे मोठ्या प्रमाणावर नुकसान होत आहे. तसेच, विद्यार्थ्यांच्या अभ्यासावर, 
    लघुउद्योगांवर आणि दैनंदिन जनजीवनावर गंभीर परिणाम होत आहे.

    तरी तातडीने सदर भागातील विद्युत पुरवठा यंत्रणेची तपासणी करून, वीज खंडित 
    होण्याचे कारण शोधून, कायमस्वरूपी उपाययोजना करावी. सदर प्रकरणी 
    ७ दिवसांत कार्यवाही न केल्यास, विषय वरिष्ठ पातळीवर — ऊर्जा मंत्रालय व 
    महाराष्ट्र वीज नियामक आयोगाकडे — मांडण्यात येईल.

                                              आपला विश्वासू,

                                              श्री. राजेश शर्मा
                                              आमदार, कोल्हापूर दक्षिण विधानसभा मतदारसंघ
```

---

### Example 4: Recommendation — Housing Scheme to Collector (Marathi)

**Input:**

| Field | Value |
|-------|-------|
| Tone | `RECOMMENDATION` |
| Language | `MARATHI` |
| Department | Collector Office (जिल्हाधिकारी कार्यालय) |
| Recipient | जिल्हाधिकारी |
| Subject | प्रधानमंत्री आवास योजना — शिफारसपत्र |
| Citizen | श्रीमती अनिता कांबळे, मौजे आंबेगाव |
| Context | विधवा, BPL कुटुंब, कच्चे घर, ४ मुले. PMAY योजनेसाठी पात्र. अर्ज भरलेला पण मंजूर नाही. |

**Output:**

```
प्रति,
माननीय जिल्हाधिकारी,
जिल्हाधिकारी कार्यालय,
कोल्हापूर.

विषय: प्रधानमंत्री आवास योजना (ग्रामीण) अंतर्गत श्रीमती अनिता कांबळे यांच्यासाठी शिफारसपत्र

महोदय,

    सदर पत्राद्वारे करवीर तालुक्यातील मौजे आंबेगाव येथील रहिवासी श्रीमती अनिता 
    कांबळे यांच्या प्रधानमंत्री आवास योजना (ग्रामीण) अंतर्गत घरकुल मंजुरीसाठी 
    शिफारस करण्यात येत आहे.

    श्रीमती कांबळे या विधवा असून, BPL (दारिद्र्यरेषेखालील) कुटुंबातील आहेत. 
    सध्या त्यांचे कच्चे (मातीचे) घर असून, ४ मुलांसह राहत आहेत. पावसाळ्यात 
    घराची अवस्था अत्यंत बिकट होते. त्यांनी सदर योजनेसाठी अर्ज सादर केला 
    आहे, मात्र अद्याप मंजुरी प्राप्त झालेली नाही.

    तरी श्रीमती अनिता कांबळे यांचा अर्ज प्राधान्याने विचारात घेऊन, त्यांना 
    प्रधानमंत्री आवास योजनेचा लाभ लवकरात लवकर मिळवून द्यावा ही विनंती.

                                              आपला विश्वासू,

                                              श्री. राजेश शर्मा
                                              आमदार, कोल्हापूर दक्षिण विधानसभा मतदारसंघ
```

---

### Example 5: Inquiry — Education Department (English)

**Input:**

| Field | Value |
|-------|-------|
| Tone | `INQUIRY` |
| Language | `ENGLISH` |
| Department | Education Department |
| Recipient | District Education Officer |
| Subject | Status of teacher recruitment — ZP Schools in Karveer Taluka |
| Context | 12 ZP schools in Karveer have teacher vacancies for 8+ months. Parents complaining that classes not held. Need status update on recruitment. |

**Output:**

```
To,
The District Education Officer,
Education Department,
Zilla Parishad, Kolhapur.

Subject: Status of Teacher Recruitment for ZP Schools in Karveer Taluka — Request for Information

Respected Sir/Madam,

    This is to inquire about the current status of teacher recruitment for Zilla 
    Parishad schools in Karveer Taluka. It has come to the attention of this office 
    that approximately 12 ZP schools in the taluka have been operating with 
    significant teacher vacancies for over 8 months.

    Parents from multiple villages have approached this office with complaints that 
    regular classes are not being conducted due to insufficient teaching staff. This 
    is directly affecting the quality of education and academic progress of students, 
    particularly those in Classes 5 through 10.

    Kindly provide the following information at the earliest:
    1. Total number of sanctioned vs. filled teaching positions in Karveer Taluka ZP schools
    2. Current status of the recruitment process for vacant positions
    3. Expected timeline for appointment of new teachers
    4. Interim arrangements being made to ensure continuity of education

    Your prompt response will be greatly appreciated.

                                              Yours faithfully,

                                              Hon. Rajesh Sharma
                                              MLA, Kolhapur South Vidhan Sabha Constituency
```

---

### Example 6: Acknowledgment — Revenue Dept (Marathi)

**Input:**

| Field | Value |
|-------|-------|
| Tone | `ACKNOWLEDGMENT` |
| Language | `MARATHI` |
| Department | Revenue Department (महसूल विभाग) |
| Recipient | तहसीलदार |
| Ref Inward | INW/2026/0089 (दि. 28/07/2026) |
| Subject | जमीन फेरफार प्रकरणी अहवाल प्राप्त — पोहोचपावती |

**Output:**

```
संदर्भ: आवक क्र. INW/2026/0089, दि. 28/07/2026

प्रति,
तहसीलदार,
तहसील कार्यालय,
करवीर, कोल्हापूर.

विषय: जमीन फेरफार प्रकरणी अहवाल प्राप्ती — पोहोचपावती

महोदय,

    आपले दि. 28/07/2026 चे पत्र क्र. INW/2026/0089 या कार्यालयास प्राप्त 
    झाले आहे. सदर पत्रासोबत पाठवलेला मौजे वडगाव येथील जमीन फेरफार 
    प्रकरणाचा तपशीलवार अहवाल प्राप्त झाल्याची नोंद घेण्यात आली आहे.

    सदर अहवालाचे अवलोकन करण्यात येत असून, आवश्यकता भासल्यास 
    पुढील पत्रव्यवहार करण्यात येईल.

    आपल्या सहकार्याबद्दल धन्यवाद.

                                              आपला विश्वासू,

                                              श्री. राजेश शर्मा
                                              आमदार, कोल्हापूर दक्षिण विधानसभा मतदारसंघ
```

---

### Example 7: Instruction — Municipal Corporation (Marathi)

**Input:**

| Field | Value |
|-------|-------|
| Tone | `INSTRUCTION` |
| Language | `MARATHI` |
| Department | Municipal Corporation (महानगरपालिका) |
| Recipient | आयुक्त |
| Subject | पिंपरी वॉर्ड ५ — गटार सफाई तात्काळ आदेश |
| Context | वॉर्ड ५ मधील मुख्य गटार तुंबले आहे. सांडपाणी रस्त्यावर वाहत आहे. साथीच्या रोगांचा धोका. तात्काळ सफाई आवश्यक. |

**Output:**

```
प्रति,
आयुक्त,
पिंपरी-चिंचवड महानगरपालिका,
कोल्हापूर शहर, कोल्हापूर.

विषय: पिंपरी वॉर्ड ५ — मुख्य गटार तुंबणे — तात्काळ सफाई कार्यवाही आदेश

महोदय,

    सदर विषयाबाबत खालीलप्रमाणे तात्काळ कार्यवाही करण्याचे निर्देश देण्यात 
    येत आहेत.

    पिंपरी वॉर्ड ५ मधील मुख्य गटार तुंबल्यामुळे सांडपाणी रस्त्यावर वाहत 
    आहे. यामुळे परिसरातील नागरिकांना दुर्गंधी, अस्वच्छता आणि आरोग्याच्या 
    गंभीर समस्यांना तोंड द्यावे लागत आहे. पावसाळ्याच्या दिवसांत साथीच्या 
    रोगांचा (डेंग्यू, मलेरिया, गॅस्ट्रो) धोका वाढलेला आहे.

    खालीलप्रमाणे कार्यवाही करावी:
    १) तात्काळ गटार सफाई पथक वॉर्ड ५ मध्ये पाठवावे (२४ तासांच्या आत)
    २) गटार तुंबण्याचे मूळ कारण शोधून कायमस्वरूपी उपाय करावा
    ३) परिसरात कीटकनाशक फवारणी करावी
    ४) केलेल्या कार्यवाहीचा फोटोसह अहवाल ३ दिवसांत या कार्यालयास सादर करावा

                                              आपला विश्वासू,

                                              श्री. राजेश शर्मा
                                              आमदार, कोल्हापूर दक्षिण विधानसभा मतदारसंघ
```

---

### Example 8: Appreciation — Health Dept (English)

**Input:**

| Field | Value |
|-------|-------|
| Tone | `APPRECIATION` |
| Language | `ENGLISH` |
| Department | Health Department |
| Recipient | District Health Officer |
| Subject | Appreciation — Successful vaccination drive in Maval Taluka |
| Context | The PHC team conducted a 3-day vaccination camp covering 5,000+ children in 8 villages. Well organized, good turnout. |

**Output:**

```
To,
The District Health Officer,
Health Department,
Zilla Parishad, Kolhapur.

Subject: Appreciation for Successful Vaccination Drive in Maval Taluka

Respected Sir/Madam,

    I am writing to express my sincere appreciation and gratitude to the Health 
    Department and the Primary Health Center teams for the outstanding vaccination 
    drive conducted in Maval Taluka from 25th to 27th July 2026.

    The 3-day camp successfully covered 8 villages and administered vaccinations 
    to over 5,000 children. The meticulous planning, efficient execution, and 
    excellent community outreach ensured a high turnout and smooth operations. The 
    dedication of the medical staff, ASHA workers, and support teams was truly 
    commendable.

    Such initiatives play a vital role in safeguarding public health across the 
    constituency. I kindly request that similar drives be organized periodically, 
    especially in remote and underserved areas.

    Once again, heartfelt thanks to your entire team for their exemplary service.

                                              Yours faithfully,

                                              Hon. Rajesh Sharma
                                              MLA, Kolhapur South Vidhan Sabha Constituency
```

---

## 8. Post-Generation Workflow

After the AI generates a draft, the following steps occur:

### 8A. PA Review Flow

```
┌─────────────────────────────────────────────────────────────┐
│  AI Draft appears in Rich Text Editor                       │
│                                                             │
│  PA can:                                                    │
│  ├── ✏️  Edit any part of the text                          │
│  ├── 🔄  Regenerate (sends same input to AI again)          │
│  ├── 🗣️  Change Tone (re-generate with different tone)      │
│  ├── 🌐  Switch Language (re-generate in other language)     │
│  ├── 📋  Add CC recipients                                  │
│  ├── 📎  Attach supporting documents                        │
│  └── ✅  Finalize & Save                                    │
│                                                             │
│  On "Finalize & Save":                                      │
│  ├── Outward entry created with auto-number                 │
│  ├── Letter saved as PDF to Cloudinary                      │
│  ├── Linked to reference inward (if any)                    │
│  ├── ai_drafted = true                                      │
│  ├── Audit log: "Outward letter created (AI-drafted)"       │
│  └── Toast: "Letter saved. Outward No: OUT/2026/0089"       │
└─────────────────────────────────────────────────────────────┘
```

### 8B. AI Metadata Stored

Every AI-drafted letter stores these metadata fields:

| Field | Type | Description |
|-------|------|-------------|
| `ai_drafted` | Boolean | `true` if AI generated the initial draft |
| `ai_model` | String | Gemini model used (e.g., "gemini-2.0-flash") |
| `ai_tone_type` | Enum | Tone selected (e.g., "FORMAL_REQUEST") |
| `ai_language` | Enum | Language selected ("MARATHI" or "ENGLISH") |
| `ai_tokens_used` | Integer | Tokens consumed in generation |
| `ai_generation_time_ms` | Integer | Time taken in milliseconds |
| `ai_prompt_hash` | String | SHA-256 hash of the input prompt (for debugging) |
| `pa_edited` | Boolean | `true` if PA edited the draft before finalizing |
| `edit_diff` | JSON | Diff between AI draft and final version (for quality tracking) |

### 8C. Quality Tracking

The system tracks AI letter quality over time:

| Metric | Calculation | Purpose |
|--------|-------------|---------|
| **Edit Rate** | % of AI letters edited by PA before finalization | Lower = better AI quality |
| **Edit Volume** | Average character diff between draft and final | Measures how much PA changes |
| **Regeneration Rate** | % of drafts regenerated (PA clicked "Regenerate") | High = poor first drafts |
| **Tone Distribution** | Count of letters by tone type | Shows most-used tones |
| **Language Split** | Marathi vs English ratio | Usage pattern tracking |
| **Avg Generation Time** | Average `ai_generation_time_ms` | Performance monitoring |

These metrics are shown on a "AI Performance" card in the Reports module.

---

## 9. Security & Guardrails

| Rule | Implementation |
|------|---------------|
| **No fabrication** | AI uses ONLY the context provided. It does not invent facts, dates, or names. |
| **No deletion** | AI drafts are stored permanently. Even if PA discards a draft, the generation is logged in audit. |
| **Rate limiting** | Max 50 AI letter requests per day per office. Configurable in settings. |
| **Content moderation** | Gemini safety filters block inappropriate content. Additional regex check for political slurs. |
| **Audit trail** | Every AI generation logged: who requested, input params, output hash, timestamp. |
| **No direct send** | AI letter is NEVER auto-sent. PA must review and finalize every letter. |
| **Token budget** | Max 2048 output tokens per request. Letters exceeding this are truncated with a warning. |
| **Fallback** | If primary model fails, fallback model is used. If both fail, PA types manually. |
| **Cost tracking** | Token usage tracked per month. Admin can view cost estimates in Settings → Integrations. |
