# MLA E-Office — Internationalization & Translation Specification (i18n)

> **Complete Bilingual (English ↔ Marathi) UI Dictionary — Every String Across All 13 Modules**
>
> This document is the single source of truth for all user-facing text in the application. It uses `react-i18next` with namespaced JSON keys. Developers use the English key; the system renders `en` or `mr` values based on the user's language toggle.
>
> *Related Documents:* [GLOSSARY.md](file:///s:/MLA%20E%20-%20Office/GLOSSARY.md) | [ERROR_MESSAGES.md](file:///s:/MLA%20E%20-%20Office/ERROR_MESSAGES.md) | [COMPONENT_LIBRARY.md](file:///s:/MLA%20E%20-%20Office/COMPONENT_LIBRARY.md) | [TECH_STACK.md](file:///s:/MLA%20E%20-%20Office/TECH_STACK.md)

---

## 1. i18n Architecture & Setup

```javascript
// src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import mrTranslation from './locales/mr.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    mr: { translation: mrTranslation },
  },
  lng: localStorage.getItem('app_language') || 'mr', // Marathi default
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
```

**Usage in components:**
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <button>{t('common.save')}</button>;
}
```

**Language toggle handler:**
```javascript
const toggleLanguage = () => {
  const newLang = i18n.language === 'en' ? 'mr' : 'en';
  i18n.changeLanguage(newLang);
  localStorage.setItem('app_language', newLang);
};
```

---

## 2. Translation Matrix — All Sections

---

### 2.1 Common Actions & Buttons (`common.*`)

| i18n Key | English (`en`) | Marathi (`mr`) |
|----------|---------------|----------------|
| `common.save` | Save | जतन करा |
| `common.cancel` | Cancel | रद्द करा |
| `common.submit` | Submit | सादर करा |
| `common.edit` | Edit | संपादित करा |
| `common.delete` | Delete | काढून टाका |
| `common.view` | View | पहा |
| `common.view_details` | View Details | तपशील पहा |
| `common.print` | Print | छापा |
| `common.export` | Export | निर्यात करा |
| `common.export_pdf` | Export as PDF | PDF निर्यात करा |
| `common.export_excel` | Export as Excel | Excel निर्यात करा |
| `common.download` | Download | डाउनलोड करा |
| `common.upload` | Upload | अपलोड करा |
| `common.search` | Search... | शोधा... |
| `common.filter` | Filter | फिल्टर |
| `common.clear_all` | Clear All | सर्व साफ करा |
| `common.apply_filters` | Apply Filters | फिल्टर लागू करा |
| `common.confirm` | Confirm | निश्चित करा |
| `common.back` | Back | मागे जा |
| `common.next` | Next | पुढे चला |
| `common.close` | Close | बंद करा |
| `common.refresh` | Refresh | रीफ्रेश करा |
| `common.loading` | Loading... | लोड होत आहे... |
| `common.actions` | Actions | कृती |
| `common.status` | Status | स्थिती |
| `common.date` | Date | दिनांक |
| `common.details` | Details | तपशील |
| `common.add_new` | Add New | नवीन जोडा |
| `common.create` | Create | तयार करा |
| `common.update` | Update | अद्यतन करा |
| `common.yes` | Yes | होय |
| `common.no` | No | नाही |
| `common.select` | Select | निवडा |
| `common.select_all` | Select All | सर्व निवडा |
| `common.required` | Required | आवश्यक |
| `common.optional` | Optional | ऐच्छिक |
| `common.from_date` | From Date | सुरुवात दिनांक |
| `common.to_date` | To Date | शेवट दिनांक |
| `common.today` | Today | आज |
| `common.this_week` | This Week | या आठवड्यात |
| `common.this_month` | This Month | या महिन्यात |
| `common.draft_ai` | ✨ Draft with AI | ✨ AI मसुदा तयार करा |
| `common.finalize` | Finalize | अंतिम करा |
| `common.approve` | Approve | मंजूर करा |
| `common.assign` | Assign | नियुक्त करा |
| `common.forward` | Forward | वर्ग करा |
| `common.retry` | Retry | पुन्हा प्रयत्न करा |
| `common.send` | Send | पाठवा |
| `common.preview` | Preview | पूर्वावलोकन |
| `common.reset` | Reset | रीसेट करा |
| `common.active` | Active | सक्रिय |
| `common.inactive` | Inactive | निष्क्रिय |
| `common.sort_by` | Sort By | क्रमवारी |
| `common.ascending` | Ascending | चढता क्रम |
| `common.descending` | Descending | उतरता क्रम |

---

### 2.2 Navigation & Sidebar (`nav.*`)

| i18n Key | English (`en`) | Marathi (`mr`) |
|----------|---------------|----------------|
| `nav.dashboard` | Dashboard | डॅशबोर्ड |
| `nav.nivedan` | Citizen Grievances (Nivedan) | नागरिक तक्रारी (निवेदन) |
| `nav.inward` | Inward Register | आवक नोंदवही |
| `nav.outward` | Outward Register | जावक नोंदवही |
| `nav.visitor` | Visitor Book | व्हिजिटर बुक |
| `nav.devworks` | Development Works | विकासकामे |
| `nav.karyakarta` | Karyakarta Master | कार्यकर्ता मास्टर |
| `nav.geography` | Constituency Geography | मतदारसंघ रचना |
| `nav.booth` | Booth Architecture | बूथ रचना |
| `nav.calendar` | Calendar & Events | कॅलेंडर व कार्यक्रम |
| `nav.whatsapp` | WhatsApp Engine | व्हॉट्सअॅप इंजिन |
| `nav.reports` | Reports & Analytics | अहवाल व विश्लेषण |
| `nav.users` | User Management | वापरकर्ता व्यवस्थापन |
| `nav.settings` | Settings | सेटिंग्ज |
| `nav.logout` | Logout | बाहेर पडा |
| `nav.pillar_office` | Office Administration | कार्यालयीन कामकाज |
| `nav.pillar_grievance` | Public Grievances | जनतक्रार व विकासकामे |
| `nav.pillar_cadre` | Cadre Network | पक्षीय संघटन |
| `nav.pillar_intelligence` | Intelligence & Automation | डॅशबोर्ड व तंत्र |
| `nav.global_search` | Search across all modules... | सर्व मॉड्यूलमध्ये शोधा... |

---

### 2.3 Statuses (`status.*`)

#### Nivedan Statuses

| i18n Key | English | Marathi | Color |
|----------|---------|---------|-------|
| `status.pending` | Pending | प्रलंबित | 🟡 Yellow |
| `status.in_progress` | In Progress | कार्यवाही सुरू | 🔵 Blue |
| `status.forwarded` | Forwarded to Dept | विभागाकडे वर्ग | 🟠 Orange |
| `status.awaiting_response` | Awaiting Response | प्रतिसाद प्रतीक्षा | 🟣 Purple |
| `status.resolved` | Resolved | निकाली | 🟢 Green |
| `status.rejected` | Rejected | नाकारले | 🔴 Red |
| `status.cancelled` | Cancelled | रद्द | ⚪ Gray |
| `status.archived` | Archived | संग्रहित | ⚫ Dark Gray |

#### Inward Statuses

| i18n Key | English | Marathi |
|----------|---------|---------|
| `status.inward_pending` | Pending | प्रलंबित |
| `status.inward_assigned` | Assigned | नियुक्त |
| `status.inward_in_progress` | In Progress | कार्यवाही सुरू |
| `status.inward_completed` | Completed | पूर्ण |

#### Development Works Statuses

| i18n Key | English | Marathi | Color |
|----------|---------|---------|-------|
| `status.sanctioned` | Sanctioned | मंजूर | 🔵 Blue |
| `status.work_in_progress` | In Progress | प्रगतीपथावर | 🟡 Yellow |
| `status.completed` | Completed | पूर्ण | 🟢 Green |
| `status.delayed` | Delayed | विलंबित | 🔴 Red |

---

### 2.4 Priorities (`priority.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `priority.high` | High Priority | उच्च प्राधान्य |
| `priority.medium` | Medium Priority | मध्यम प्राधान्य |
| `priority.low` | Low Priority | कमी प्राधान्य |

---

### 2.5 Nivedan Module (`nivedan.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `nivedan.title` | Citizen Complaints & Petitions | नागरिक तक्रारी व निवेदने |
| `nivedan.new_entry` | New Nivedan | नवीन निवेदन |
| `nivedan.tracking_id` | Tracking ID | ट्रॅकिंग आयडी |
| `nivedan.citizen_name` | Complainant Name | तक्रारदाराचे नाव |
| `nivedan.mobile` | Mobile Number | मोबाईल क्रमांक |
| `nivedan.address` | Address | पत्ता |
| `nivedan.village_ward` | Village / Ward | गाव / वॉर्ड |
| `nivedan.taluka` | Taluka | तालुका |
| `nivedan.category` | Category | वर्ग / प्रकार |
| `nivedan.sub_category` | Sub-Category | उपवर्ग |
| `nivedan.subject` | Subject | विषय |
| `nivedan.description` | Description | तपशील / वर्णन |
| `nivedan.attachments` | Attachments | संलग्नक |
| `nivedan.assigned_dept` | Forwarded Department | वर्ग केलेला विभाग |
| `nivedan.assigned_staff` | Assigned Staff | नियुक्त कर्मचारी |
| `nivedan.priority` | Priority | प्राधान्य |
| `nivedan.auto_routed` | Auto-Routed | स्वयं-मार्गदर्शित |
| `nivedan.manually_set` | Manually Set | स्वहस्ते नियुक्त |
| `nivedan.print_receipt` | Print Acknowledgment Slip | पावती छापा |
| `nivedan.print_slip` | Print Quick Slip | छोटी पावती छापा |
| `nivedan.timeline` | Status History | स्थिती इतिहास |
| `nivedan.resolution_notes` | Resolution Details | निराकरण तपशील |
| `nivedan.internal_note` | Internal Note | अंतर्गत नोंद |
| `nivedan.add_note` | Add Note | नोंद जोडा |
| `nivedan.citizen_history` | Citizen Complaint History | नागरिक तक्रार इतिहास |
| `nivedan.repeat_citizen` | Repeat Citizen — {{count}} previous complaints | पुन्हा आलेला नागरिक — {{count}} पूर्वीच्या तक्रारी |
| `nivedan.first_complaint` | First Complaint | पहिली तक्रार |
| `nivedan.escalated` | Escalated | वाढवलेले |
| `nivedan.escalation_level1` | Level 1 Escalation — Overdue | स्तर १ — मुदत उलटली |
| `nivedan.escalation_level2` | Level 2 Escalation — Critical | स्तर २ — गंभीर विलंब |
| `nivedan.whatsapp_history` | WhatsApp Message History | व्हॉट्सअॅप संदेश इतिहास |
| `nivedan.tab_all` | All | सर्व |
| `nivedan.tab_pending` | Pending | प्रलंबित |
| `nivedan.tab_in_progress` | In Progress | कार्यवाही सुरू |
| `nivedan.tab_forwarded` | Forwarded | वर्ग केलेले |
| `nivedan.tab_resolved` | Resolved | निकाली |
| `nivedan.tab_escalated` | Escalated | वाढवलेले |

---

### 2.6 Inward & Outward Module (`letter.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `letter.inward_title` | Inward Register | आवक नोंदवही |
| `letter.outward_title` | Outward Register | जावक नोंदवही |
| `letter.new_inward` | New Inward Entry | नवीन आवक नोंद |
| `letter.new_outward` | New Outward Entry | नवीन जावक नोंद |
| `letter.inward_no` | Inward No. | आवक क्र. |
| `letter.outward_no` | Outward No. | जावक क्र. |
| `letter.date_received` | Date Received | प्राप्त दिनांक |
| `letter.date_sent` | Date Sent | पाठवल्याचा दिनांक |
| `letter.sender_name` | Sender Name | प्रेषकाचे नाव |
| `letter.sender_designation` | Sender Designation | प्रेषकाचे पद |
| `letter.sender_dept` | Sender Department | प्रेषक विभाग |
| `letter.recipient_name` | Recipient Name | प्राप्तकर्त्याचे नाव |
| `letter.recipient_designation` | Recipient Designation | प्राप्तकर्त्याचे पद |
| `letter.recipient_dept` | Recipient Department | प्राप्तकर्ता विभाग |
| `letter.subject` | Subject | विषय |
| `letter.description` | Description / Notes | तपशील / टिपणी |
| `letter.ref_inward` | Reference Inward | संदर्भ आवक |
| `letter.scanned_copy` | Scanned Document | स्कॅन प्रत |
| `letter.letter_body` | Letter Body | पत्र मजकूर |
| `letter.ai_drafted` | AI Drafted | AI मसुदा |
| `letter.manual` | Manually Typed | स्वहस्ते टाइप |
| `letter.generate_pdf` | Generate Letter PDF | पत्र PDF तयार करा |
| `letter.finalize_letter` | Finalize Letter | पत्र अंतिम करा |
| `letter.tags` | Tags / Categories | टॅग / वर्ग |
| `letter.assigned_to` | Assigned To | नियुक्त |

---

### 2.7 Visitor Book Module (`visitor.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `visitor.title` | Visitor Book | व्हिजिटर बुक |
| `visitor.new_entry` | New Visitor | नवीन भेटी |
| `visitor.visitor_name` | Visitor Name | भेटीदाराचे नाव |
| `visitor.mobile` | Mobile Number | मोबाईल क्रमांक |
| `visitor.address` | Address | पत्ता |
| `visitor.village_ward` | Village / Ward | गाव / वॉर्ड |
| `visitor.purpose` | Purpose of Visit | भेटीचे कारण |
| `visitor.purpose_desc` | Purpose Description | कारण तपशील |
| `visitor.checkin_time` | Check-In Time | आगमन वेळ |
| `visitor.checkout_time` | Check-Out Time | निर्गमन वेळ |
| `visitor.checkout` | Mark Check-Out | निर्गमन नोंदवा |
| `visitor.repeat_visitor` | Repeat Visitor | पुन्हा आलेला भेटीदार |
| `visitor.first_visit` | First Visit | पहिली भेट |
| `visitor.prev_visits` | {{count}} previous visits | {{count}} पूर्वीच्या भेटी |
| `visitor.last_visit` | Last Visit: {{date}} | शेवटची भेट: {{date}} |
| `visitor.linked_nivedan` | Linked Complaint | जोडलेले निवेदन |
| `visitor.today_count` | Today: {{count}} visitors | आज: {{count}} भेटीदार |
| `visitor.week_count` | This Week: {{count}} | या आठवड्यात: {{count}} |
| `visitor.month_count` | This Month: {{count}} | या महिन्यात: {{count}} |
| `visitor.print_register` | Print Daily Register | दैनिक नोंदवही छापा |

---

### 2.8 Development Works Module (`devworks.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `devworks.title` | Development Works | विकासकामे |
| `devworks.new_work` | New Development Work | नवीन विकासकाम |
| `devworks.project_name` | Project Name | कामाचे नाव |
| `devworks.category` | Category | वर्ग |
| `devworks.location` | Location | ठिकाण |
| `devworks.village_ward` | Village / Ward | गाव / वॉर्ड |
| `devworks.taluka` | Taluka | तालुका |
| `devworks.funding_source` | Funding Source | अनुदान स्रोत |
| `devworks.budget_allocated` | Budget Allocated (₹) | मंजूर अंदाजपत्रक (₹) |
| `devworks.budget_spent` | Budget Spent (₹) | खर्च झालेली रक्कम (₹) |
| `devworks.budget_remaining` | Remaining Budget | शिल्लक रक्कम |
| `devworks.contractor_name` | Contractor Name | ठेकेदाराचे नाव |
| `devworks.contractor_contact` | Contractor Contact | ठेकेदार संपर्क |
| `devworks.start_date` | Start Date | कामाची सुरुवात |
| `devworks.expected_completion` | Expected Completion | अपेक्षित पूर्णता |
| `devworks.actual_completion` | Actual Completion Date | प्रत्यक्ष पूर्णता दिनांक |
| `devworks.progress` | Progress (%) | प्रगती (%) |
| `devworks.delayed_by` | Delayed by {{days}} days | {{days}} दिवसांनी विलंबित |
| `devworks.site_photos` | Site Photos | स्थळ छायाचित्रे |
| `devworks.photo_before` | Before | पूर्वी |
| `devworks.photo_during` | During | काम सुरू असताना |
| `devworks.photo_after` | After | काम पूर्ण झाल्यावर |
| `devworks.geo_coordinates` | GPS Location | GPS स्थान |
| `devworks.description` | Notes / Description | टिपणी / तपशील |
| `devworks.notify_workers` | Notify Workers | कार्यकर्त्यांना कळवा |

---

### 2.9 Karyakarta Master Module (`karyakarta.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `karyakarta.title` | Karyakarta Master (Party Workers) | कार्यकर्ता मास्टर |
| `karyakarta.new_entry` | Add New Karyakarta | नवीन कार्यकर्ता जोडा |
| `karyakarta.full_name` | Full Name | पूर्ण नाव |
| `karyakarta.mobile` | Mobile Number | मोबाईल क्रमांक |
| `karyakarta.alt_mobile` | Alternate Mobile | पर्यायी मोबाईल |
| `karyakarta.dob` | Date of Birth | जन्मतारीख |
| `karyakarta.address` | Address | पत्ता |
| `karyakarta.village_ward` | Village / Ward | गाव / वॉर्ड |
| `karyakarta.gram_panchayat` | Gram Panchayat | ग्रामपंचायत |
| `karyakarta.taluka` | Taluka | तालुका |
| `karyakarta.booth_number` | Booth Number | बूथ क्रमांक |
| `karyakarta.designation` | Designation | पदनाम |
| `karyakarta.profile_photo` | Profile Photo | छायाचित्र |
| `karyakarta.is_active` | Active Status | सक्रिय स्थिती |
| `karyakarta.joined_date` | Joined Date | सामील दिनांक |
| `karyakarta.notes` | Notes | टिपणी |
| `karyakarta.bulk_import` | Bulk Import from Excel | Excel मधून आयात करा |
| `karyakarta.import_preview` | Preview Import Data | आयात डेटा पूर्वावलोकन |
| `karyakarta.import_errors` | Import Errors | आयात त्रुटी |
| `karyakarta.duplicate_found` | Duplicate mobile number found | मोबाईल क्रमांक आधीच अस्तित्त्वात |
| `karyakarta.total_workers` | Total Workers: {{count}} | एकूण कार्यकर्ते: {{count}} |

---

### 2.10 Booth Architecture & Geography (`booth.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `booth.title` | Booth Architecture | बूथ रचना |
| `booth.constituency` | Constituency | मतदारसंघ |
| `booth.district` | District | जिल्हा |
| `booth.taluka` | Taluka | तालुका |
| `booth.gram_panchayat` | Gram Panchayat | ग्रामपंचायत |
| `booth.village` | Village | गाव |
| `booth.city` | City | शहर |
| `booth.ward` | Ward | प्रभाग / वॉर्ड |
| `booth.booth_number` | Booth Number | बूथ क्रमांक |
| `booth.polling_booth` | Polling Booth | मतदान केंद्र |
| `booth.total_voters` | Total Voters | एकूण मतदार |
| `booth.booth_pramukh` | Booth Pramukh | बूथ प्रमुख |
| `booth.workers_assigned` | Workers Assigned | नियुक्त कार्यकर्ते |
| `booth.verification_status` | Verification Status | पडताळणी स्थिती |
| `booth.verified` | Verified | पडताळणी पूर्ण |
| `booth.not_verified` | Not Verified | पडताळणी बाकी |
| `booth.area` | Area | परिसर / क्षेत्र |
| `booth.locality` | Locality | वस्ती |

---

### 2.11 Calendar & Events Module (`calendar.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `calendar.title` | Calendar & Events | कॅलेंडर व कार्यक्रम |
| `calendar.new_event` | New Event | नवीन कार्यक्रम |
| `calendar.event_title` | Title | शीर्षक |
| `calendar.event_description` | Description | तपशील |
| `calendar.event_type` | Event Type | कार्यक्रम प्रकार |
| `calendar.event_date` | Date | दिनांक |
| `calendar.start_time` | Start Time | सुरुवातीची वेळ |
| `calendar.end_time` | End Time | शेवटची वेळ |
| `calendar.location` | Location | ठिकाण |
| `calendar.attendees` | Attendees | सहभागी |
| `calendar.is_recurring` | Recurring Event | पुनरावृत्ती कार्यक्रम |
| `calendar.reminder` | Reminder | स्मरणपत्र |
| `calendar.view_monthly` | Monthly View | मासिक दृश्य |
| `calendar.view_weekly` | Weekly View | साप्ताहिक दृश्य |
| `calendar.view_daily` | Daily Agenda | दैनिक कार्यसूची |
| `calendar.type_meeting` | Meeting | बैठक |
| `calendar.type_public_program` | Public Program | सार्वजनिक कार्यक्रम |
| `calendar.type_govt_deadline` | Government Deadline | शासकीय मुदत |
| `calendar.type_assembly` | Assembly Session | विधानसभा अधिवेशन |
| `calendar.type_constituency_visit` | Constituency Visit | मतदारसंघ दौरा |
| `calendar.type_personal` | Personal | वैयक्तिक |
| `calendar.recurring_daily` | Daily | दररोज |
| `calendar.recurring_weekly` | Weekly | दर आठवड्याला |
| `calendar.recurring_monthly` | Monthly | दर महिन्याला |
| `calendar.reminder_15` | 15 minutes before | १५ मिनिटे आधी |
| `calendar.reminder_30` | 30 minutes before | ३० मिनिटे आधी |
| `calendar.reminder_60` | 1 hour before | १ तास आधी |
| `calendar.reminder_1d` | 1 day before | १ दिवस आधी |

---

### 2.12 WhatsApp Engine Module (`whatsapp.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `whatsapp.title` | WhatsApp Engine | व्हॉट्सअॅप इंजिन |
| `whatsapp.compose` | Compose Broadcast | संदेश तयार करा |
| `whatsapp.select_template` | Select Template | टेम्पलेट निवडा |
| `whatsapp.custom_message` | Custom Message | सानुकूल संदेश |
| `whatsapp.audience` | Audience | प्राप्तकर्ते |
| `whatsapp.all_workers` | All Workers | सर्व कार्यकर्ते |
| `whatsapp.by_booth` | By Booth | बूथनुसार |
| `whatsapp.by_village` | By Village/Ward | गाव/वॉर्डनुसार |
| `whatsapp.by_designation` | By Designation | पदनामानुसार |
| `whatsapp.custom_list` | Custom List | सानुकूल यादी |
| `whatsapp.recipient_count` | Recipients: {{count}} | प्राप्तकर्ते: {{count}} |
| `whatsapp.send_now` | Send Now | आता पाठवा |
| `whatsapp.schedule_send` | Schedule for Later | नंतर पाठवण्यासाठी नियोजन |
| `whatsapp.delivery_total` | Total | एकूण |
| `whatsapp.delivery_sent` | Sent | पाठवले |
| `whatsapp.delivery_delivered` | Delivered | वितरित |
| `whatsapp.delivery_read` | Read | वाचले |
| `whatsapp.delivery_failed` | Failed | अयशस्वी |
| `whatsapp.retry_failed` | Retry Failed Messages | अयशस्वी पुन्हा पाठवा |
| `whatsapp.sms_fallback` | SMS Fallback Sent | SMS द्वारे पाठवले |
| `whatsapp.message_log` | Message Log | संदेश नोंदवही |
| `whatsapp.bot_reply` | Bot Auto-Reply | बॉट स्वयं-उत्तर |

---

### 2.13 Reports & Analytics Module (`reports.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `reports.title` | Reports & Analytics | अहवाल व विश्लेषण |
| `reports.generate` | Generate Report | अहवाल तयार करा |
| `reports.nivedan_summary` | Nivedan Summary | निवेदन सारांश |
| `reports.nivedan_deptwise` | Nivedan Department-wise | निवेदन विभागनिहाय |
| `reports.inward_outward` | Inward/Outward Register | आवक-जावक नोंदवही |
| `reports.visitor_footfall` | Visitor Footfall | भेटीदार संख्या |
| `reports.devworks_progress` | Development Works Progress | विकासकामे प्रगती |
| `reports.budget_expenditure` | Budget vs Expenditure | अंदाजपत्रक विरुद्ध खर्च |
| `reports.karyakarta_directory` | Karyakarta Directory | कार्यकर्ता निर्देशिका |
| `reports.booth_verification` | Booth Verification | बूथ पडताळणी |
| `reports.area_analysis` | Area-wise Analysis | क्षेत्रनिहाय विश्लेषण |
| `reports.monthly_performance` | Monthly Office Performance | मासिक कार्यालय कामगिरी |
| `reports.escalation_report` | Escalation Report | एस्केलेशन अहवाल |
| `reports.select_date_range` | Select Date Range | कालावधी निवडा |
| `reports.chart_label` | Chart | आलेख |
| `reports.table_label` | Table | सारणी |

---

### 2.14 User Management & Security (`users.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `users.title` | User Management | वापरकर्ता व्यवस्थापन |
| `users.new_user` | Create New User | नवीन वापरकर्ता तयार करा |
| `users.full_name` | Full Name | पूर्ण नाव |
| `users.username` | Username | वापरकर्ता नाव |
| `users.password` | Password | पासवर्ड |
| `users.confirm_password` | Confirm Password | पासवर्ड पुष्टी करा |
| `users.role` | Role | भूमिका |
| `users.mobile` | Mobile | मोबाईल |
| `users.email` | Email | ई-मेल |
| `users.last_login` | Last Login | शेवटचे लॉगिन |
| `users.deactivate` | Deactivate User | वापरकर्ता निष्क्रिय करा |
| `users.reset_password` | Reset Password | पासवर्ड रीसेट करा |
| `users.role_mla` | MLA | आमदार |
| `users.role_pa` | Personal Assistant (PA) | वैयक्तिक सहाय्यक (PA) |
| `users.role_receptionist` | Receptionist | स्वागतिका / फ्रंट डेस्क |
| `users.role_staff` | Office Staff | कार्यालयीन कर्मचारी |
| `users.role_auditor` | Field Auditor | क्षेत्रीय पडताळणी अधिकारी |
| `users.role_booth_pramukh` | Booth Pramukh | बूथ प्रमुख |
| `users.role_admin` | System Administrator | प्रणाली प्रशासक |
| `users.audit_log` | Audit Log | ऑडिट लॉग |
| `users.audit_timestamp` | Timestamp | वेळ |
| `users.audit_user` | User | वापरकर्ता |
| `users.audit_action` | Action | कृती |
| `users.audit_module` | Module | मॉड्यूल |
| `users.audit_ip` | IP Address | IP पत्ता |

---

### 2.15 Dashboard Module (`dashboard.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `dashboard.title` | Dashboard | डॅशबोर्ड |
| `dashboard.welcome` | Welcome, {{name}} | स्वागत आहे, {{name}} |
| `dashboard.kpi_total_nivedans` | Total Nivedans | एकूण निवेदने |
| `dashboard.kpi_pending` | Pending Complaints | प्रलंबित तक्रारी |
| `dashboard.kpi_resolved` | Resolved This Month | या महिन्यात निकाली |
| `dashboard.kpi_escalated` | Escalated (Overdue) | वाढवलेले (मुदत उलटली) |
| `dashboard.kpi_visitors_today` | Visitors Today | आजचे भेटीदार |
| `dashboard.kpi_inward_pending` | Inward Letters Pending | आवक पत्रे प्रलंबित |
| `dashboard.kpi_devworks_active` | Active Dev Works | सक्रिय विकासकामे |
| `dashboard.kpi_total_workers` | Total Karyakartas | एकूण कार्यकर्ते |
| `dashboard.chart_nivedan_trend` | Nivedan Trend (Monthly) | निवेदन कल (मासिक) |
| `dashboard.chart_category_dist` | Category Distribution | वर्गनिहाय वितरण |
| `dashboard.chart_status_dist` | Status Distribution | स्थितीनिहाय वितरण |
| `dashboard.chart_area_heatmap` | Area-wise Heatmap | क्षेत्रनिहाय उष्णता नकाशा |
| `dashboard.activity_feed` | Recent Activity | अलीकडील कार्यवाही |
| `dashboard.resolution_rate` | Resolution Rate | निराकरण दर |

---

### 2.16 Modal & Dialog Labels (`modal.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `modal.confirm_title` | Confirm Action | कृती निश्चित करा |
| `modal.are_you_sure` | Are you sure you want to proceed? | आपण पुढे जाऊ इच्छिता? |
| `modal.confirm_cancel_nivedan` | Cancel this complaint? This cannot be undone. | ही तक्रार रद्द करायची? हे पूर्ववत होणार नाही. |
| `modal.confirm_reject_nivedan` | Reject this complaint? Please provide a reason. | ही तक्रार नाकारायची? कृपया कारण द्या. |
| `modal.confirm_resolve` | Mark as resolved? | निकाली म्हणून नोंदवायचे? |
| `modal.confirm_deactivate` | Deactivate this user? They will lose access. | हा वापरकर्ता निष्क्रिय करायचा? त्यांचा प्रवेश बंद होईल. |
| `modal.session_expired` | Session Expired | सत्र संपले |
| `modal.session_expired_msg` | Your session has expired. Please log in again. | आपले सत्र संपले आहे. कृपया पुन्हा लॉगिन करा. |
| `modal.login_again` | Log In Again | पुन्हा लॉगिन करा |
| `modal.unsaved_changes` | You have unsaved changes. Discard? | जतन न केलेले बदल आहेत. टाकून द्यायचे? |
| `modal.discard` | Discard | टाकून द्या |
| `modal.stay` | Stay on Page | या पृष्ठावर राहा |

---

### 2.17 Toast Notification Messages (`toast.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `toast.success_saved` | Saved successfully! | यशस्वीरित्या जतन केले! |
| `toast.success_created` | Created successfully! | यशस्वीरित्या तयार केले! |
| `toast.success_updated` | Updated successfully! | यशस्वीरित्या अद्यतन केले! |
| `toast.success_deleted` | Removed successfully! | यशस्वीरित्या काढून टाकले! |
| `toast.success_sent` | Message sent successfully! | संदेश यशस्वीरित्या पाठवला! |
| `toast.success_exported` | Export completed! | निर्यात पूर्ण! |
| `toast.success_imported` | Import completed — {{count}} records added! | आयात पूर्ण — {{count}} नोंदी जोडल्या! |
| `toast.info_no_changes` | No changes to save. | जतन करण्यासारखे बदल नाहीत. |
| `toast.info_already_sent` | Message already sent for today. | आजचा संदेश आधीच पाठवला आहे. |
| `toast.warning_large_file` | File is large. Upload may take time. | फाईल मोठी आहे. अपलोडला वेळ लागेल. |
| `toast.warning_unsaved` | You have unsaved changes! | जतन न केलेले बदल आहेत! |
| `toast.error_generic` | Something went wrong. Please try again. | काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा. |
| `toast.error_network` | Network error. Check your connection. | नेटवर्क त्रुटी. कनेक्शन तपासा. |
| `toast.error_upload` | File upload failed. | फाईल अपलोड अयशस्वी. |

---

### 2.18 Table Column Headers (`table.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `table.sr_no` | Sr. No. | अ.क्र. |
| `table.name` | Name | नाव |
| `table.date` | Date | दिनांक |
| `table.subject` | Subject | विषय |
| `table.category` | Category | वर्ग |
| `table.status` | Status | स्थिती |
| `table.priority` | Priority | प्राधान्य |
| `table.assigned_to` | Assigned To | नियुक्त |
| `table.department` | Department | विभाग |
| `table.mobile` | Mobile | मोबाईल |
| `table.actions` | Actions | कृती |
| `table.village_ward` | Village/Ward | गाव/वॉर्ड |
| `table.created_by` | Created By | तयार करणारा |
| `table.created_at` | Created At | तयार दिनांक |
| `table.last_updated` | Last Updated | शेवटचे अद्यतन |
| `table.designation` | Designation | पदनाम |
| `table.booth` | Booth | बूथ |
| `table.budget` | Budget (₹) | अंदाजपत्रक (₹) |
| `table.progress` | Progress | प्रगती |
| `table.purpose` | Purpose | कारण |
| `table.time` | Time | वेळ |
| `table.delivery_status` | Delivery Status | वितरण स्थिती |

---

### 2.19 Nivedan Categories — All 14 (`categories.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `categories.WATER_SUPPLY` | Water Supply | पाणीपुरवठा |
| `categories.ROAD_DRAINAGE` | Road / Drainage | रस्ते / गटार |
| `categories.ELECTRICITY` | Electricity | वीजपुरवठा |
| `categories.LAND_REVENUE` | Land / Revenue | जमीन / महसूल |
| `categories.EDUCATION` | Education | शिक्षण |
| `categories.HEALTH_MEDICAL` | Health / Medical | आरोग्य |
| `categories.PENSION_WELFARE` | Pension / Social Welfare | पेन्शन / समाजकल्याण |
| `categories.RATION_CARD` | Ration Card / PDS | रेशनकार्ड |
| `categories.CERTIFICATE` | Caste / Income Certificate | जात / उत्पन्न प्रमाणपत्र |
| `categories.HOUSING` | Housing / Awas Yojana | घरकुल / आवास योजना |
| `categories.AGRICULTURE` | Agriculture | शेती |
| `categories.EMPLOYMENT` | Employment / Rojgar | रोजगार |
| `categories.POLICE` | Police / Law & Order | पोलीस |
| `categories.GENERAL_OTHER` | General / Other | इतर |

---

### 2.20 Government Departments — All 20 (`departments.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `departments.COLLECTOR` | District Collector Office | जिल्हाधिकारी कार्यालय |
| `departments.TAHSILDAR` | Tahsildar Office | तहसीलदार कार्यालय |
| `departments.ZP` | Zilla Parishad | जिल्हा परिषद |
| `departments.PANCHAYAT_SAMITI` | Panchayat Samiti | पंचायत समिती |
| `departments.GRAM_PANCHAYAT` | Gram Panchayat | ग्रामपंचायत |
| `departments.MUNICIPAL_CORP` | Municipal Corporation | महानगरपालिका |
| `departments.MUNICIPAL_COUNCIL` | Municipal Council | नगरपरिषद |
| `departments.NAGAR_PANCHAYAT` | Nagar Panchayat | नगरपंचायत |
| `departments.PWD` | Public Works Dept (PWD) | सार्वजनिक बांधकाम विभाग |
| `departments.WATER_DEPT` | Water Supply Department | पाणीपुरवठा विभाग |
| `departments.MSEDCL` | MSEDCL / Electricity Board | महावितरण |
| `departments.REVENUE` | Revenue Department | महसूल विभाग |
| `departments.EDUCATION_DEPT` | Education Department | शिक्षण विभाग |
| `departments.HEALTH_DEPT` | Health Department | आरोग्य विभाग |
| `departments.SOCIAL_WELFARE` | Social Welfare Department | समाजकल्याण विभाग |
| `departments.AGRICULTURE_DEPT` | Agriculture Department | कृषी विभाग |
| `departments.POLICE_DEPT` | Police Department | पोलीस विभाग |
| `departments.TRIBAL_DEPT` | Tribal Development Dept | आदिवासी विकास विभाग |
| `departments.WOMEN_CHILD` | Women & Child Development | महिला व बालविकास |
| `departments.FOOD_SUPPLY` | Food & Civil Supplies | अन्न व नागरी पुरवठा |

---

### 2.21 Visitor Purpose Categories — All 10 (`visitor_purpose.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `visitor_purpose.GRIEVANCE` | Grievance / Complaint | तक्रार |
| `visitor_purpose.COURTESY_CALL` | Courtesy Call / VIP Visit | सद्भेट |
| `visitor_purpose.PARTY_WORK` | Party Work | पक्ष काम |
| `visitor_purpose.INVITATION` | Invitation | निमंत्रण |
| `visitor_purpose.PERSONAL_MEETING` | Personal Meeting | वैयक्तिक भेट |
| `visitor_purpose.DOCUMENT_SUBMISSION` | Document Submission | कागदपत्रे जमा |
| `visitor_purpose.FOLLOWUP` | Follow-up | पाठपुरावा |
| `visitor_purpose.RECOMMENDATION` | Recommendation Request | शिफारसपत्र |
| `visitor_purpose.GENERAL_INQUIRY` | General Inquiry | सामान्य चौकशी |
| `visitor_purpose.OTHER` | Other | इतर |

---

### 2.22 DevWorks Categories — All 13 (`work_categories.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `work_categories.ROAD` | Road Construction | रस्ते बांधकाम |
| `work_categories.DRAINAGE` | Drainage / Sewage | गटार / नाले |
| `work_categories.WATER_PIPELINE` | Water Supply Pipeline | पाणीपुरवठा |
| `work_categories.HOSPITAL` | Hospital / Health Center | रुग्णालय |
| `work_categories.SCHOOL` | School Building | शाळा बांधकाम |
| `work_categories.COMMUNITY_HALL` | Community Hall | समाजमंदिर |
| `work_categories.STREET_LIGHT` | Street Lighting | रस्ता दिवे |
| `work_categories.BRIDGE` | Bridge / Culvert | पूल / मोरी |
| `work_categories.ELECTRIFICATION` | Electrification | विद्युतीकरण |
| `work_categories.GARDEN_PARK` | Garden / Park | उद्यान / बगीचा |
| `work_categories.TOILET` | Toilet / Sanitation | शौचालय |
| `work_categories.CREMATORIUM` | Crematorium / Burial Ground | स्मशानभूमी |
| `work_categories.OTHER` | Other | इतर |

---

### 2.23 Karyakarta Designations — All 6 (`designations.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `designations.BOOTH_PRAMUKH` | Booth Pramukh | बूथ प्रमुख |
| `designations.WARD_HEAD` | Ward Head | वॉर्ड प्रमुख |
| `designations.SHAKTI_KENDRA` | Shakti Kendra Pramukh | शक्ती केंद्र प्रमुख |
| `designations.KARYAKARTA` | Karyakarta | कार्यकर्ता |
| `designations.VOLUNTEER` | Volunteer | स्वयंसेवक |
| `designations.OTHER` | Other | इतर |

---

### 2.24 Funding Sources — All 9 (`funding.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `funding.MLALAD` | MLALAD (MLA Fund) | आमदार निधी |
| `funding.ZP_FUND` | Zilla Parishad Fund | जिल्हा परिषद निधी |
| `funding.STATE_GRANT` | State Government Grant | राज्य शासन अनुदान |
| `funding.CENTRAL_GRANT` | Central Government Grant | केंद्र शासन अनुदान |
| `funding.MUNICIPAL_FUND` | Municipal Corporation Fund | महानगरपालिका निधी |
| `funding.GP_FUND` | Gram Panchayat Fund | ग्रामपंचायत निधी |
| `funding.MPLAD` | MPLAD (MP Fund) | खासदार निधी |
| `funding.CSR` | CSR (Corporate) | सीएसआर |
| `funding.OTHER_MIXED` | Other / Mixed | इतर / मिश्र |

---

### 2.25 Pagination & Empty States (`pagination.*`)

| i18n Key | English | Marathi |
|----------|---------|---------|
| `pagination.showing` | Showing {{from}}-{{to}} of {{total}} | {{total}} पैकी {{from}}-{{to}} दर्शवत आहे |
| `pagination.per_page` | Per Page | प्रत्येक पृष्ठावर |
| `pagination.first` | First | पहिले |
| `pagination.last` | Last | शेवटचे |
| `pagination.previous` | Previous | मागील |
| `pagination.next` | Next | पुढील |
| `pagination.no_data` | No data found. | डेटा आढळला नाही. |
| `pagination.no_results` | No results match your search. | आपल्या शोधाशी जुळणारे परिणाम नाहीत. |
| `pagination.empty_table` | No records to display. | दर्शविण्यासाठी नोंदी नाहीत. |
| `pagination.loading_data` | Loading data... | डेटा लोड होत आहे... |

---

## 3. JSON Locale Files

> **Note:** The complete JSON locale files below contain every key from the 25 sections above. Copy these directly into your project at `src/i18n/locales/`.

### 3.1 `src/i18n/locales/en.json`

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "submit": "Submit",
    "edit": "Edit",
    "delete": "Delete",
    "view": "View",
    "view_details": "View Details",
    "print": "Print",
    "export": "Export",
    "export_pdf": "Export as PDF",
    "export_excel": "Export as Excel",
    "download": "Download",
    "upload": "Upload",
    "search": "Search...",
    "filter": "Filter",
    "clear_all": "Clear All",
    "apply_filters": "Apply Filters",
    "confirm": "Confirm",
    "back": "Back",
    "next": "Next",
    "close": "Close",
    "refresh": "Refresh",
    "loading": "Loading...",
    "actions": "Actions",
    "status": "Status",
    "date": "Date",
    "details": "Details",
    "add_new": "Add New",
    "create": "Create",
    "update": "Update",
    "yes": "Yes",
    "no": "No",
    "select": "Select",
    "select_all": "Select All",
    "required": "Required",
    "optional": "Optional",
    "from_date": "From Date",
    "to_date": "To Date",
    "today": "Today",
    "this_week": "This Week",
    "this_month": "This Month",
    "draft_ai": "✨ Draft with AI",
    "finalize": "Finalize",
    "approve": "Approve",
    "assign": "Assign",
    "forward": "Forward",
    "retry": "Retry",
    "send": "Send",
    "preview": "Preview",
    "reset": "Reset",
    "active": "Active",
    "inactive": "Inactive",
    "sort_by": "Sort By",
    "ascending": "Ascending",
    "descending": "Descending"
  },
  "nav": {
    "dashboard": "Dashboard",
    "nivedan": "Citizen Grievances (Nivedan)",
    "inward": "Inward Register",
    "outward": "Outward Register",
    "visitor": "Visitor Book",
    "devworks": "Development Works",
    "karyakarta": "Karyakarta Master",
    "geography": "Constituency Geography",
    "booth": "Booth Architecture",
    "calendar": "Calendar & Events",
    "whatsapp": "WhatsApp Engine",
    "reports": "Reports & Analytics",
    "users": "User Management",
    "settings": "Settings",
    "logout": "Logout",
    "pillar_office": "Office Administration",
    "pillar_grievance": "Public Grievances",
    "pillar_cadre": "Cadre Network",
    "pillar_intelligence": "Intelligence & Automation",
    "global_search": "Search across all modules..."
  },
  "status": {
    "pending": "Pending",
    "in_progress": "In Progress",
    "forwarded": "Forwarded to Dept",
    "awaiting_response": "Awaiting Response",
    "resolved": "Resolved",
    "rejected": "Rejected",
    "cancelled": "Cancelled",
    "archived": "Archived",
    "inward_pending": "Pending",
    "inward_assigned": "Assigned",
    "inward_in_progress": "In Progress",
    "inward_completed": "Completed",
    "sanctioned": "Sanctioned",
    "work_in_progress": "In Progress",
    "completed": "Completed",
    "delayed": "Delayed"
  },
  "priority": {
    "high": "High Priority",
    "medium": "Medium Priority",
    "low": "Low Priority"
  },
  "nivedan": {
    "title": "Citizen Complaints & Petitions",
    "new_entry": "New Nivedan",
    "tracking_id": "Tracking ID",
    "citizen_name": "Complainant Name",
    "mobile": "Mobile Number",
    "address": "Address",
    "village_ward": "Village / Ward",
    "taluka": "Taluka",
    "category": "Category",
    "sub_category": "Sub-Category",
    "subject": "Subject",
    "description": "Description",
    "attachments": "Attachments",
    "assigned_dept": "Forwarded Department",
    "assigned_staff": "Assigned Staff",
    "priority": "Priority",
    "auto_routed": "Auto-Routed",
    "manually_set": "Manually Set",
    "print_receipt": "Print Acknowledgment Slip",
    "print_slip": "Print Quick Slip",
    "timeline": "Status History",
    "resolution_notes": "Resolution Details",
    "internal_note": "Internal Note",
    "add_note": "Add Note",
    "citizen_history": "Citizen Complaint History",
    "repeat_citizen": "Repeat Citizen — {{count}} previous complaints",
    "first_complaint": "First Complaint",
    "escalated": "Escalated",
    "escalation_level1": "Level 1 Escalation — Overdue",
    "escalation_level2": "Level 2 Escalation — Critical",
    "whatsapp_history": "WhatsApp Message History",
    "tab_all": "All",
    "tab_pending": "Pending",
    "tab_in_progress": "In Progress",
    "tab_forwarded": "Forwarded",
    "tab_resolved": "Resolved",
    "tab_escalated": "Escalated"
  },
  "letter": {
    "inward_title": "Inward Register",
    "outward_title": "Outward Register",
    "new_inward": "New Inward Entry",
    "new_outward": "New Outward Entry",
    "inward_no": "Inward No.",
    "outward_no": "Outward No.",
    "date_received": "Date Received",
    "date_sent": "Date Sent",
    "sender_name": "Sender Name",
    "sender_designation": "Sender Designation",
    "sender_dept": "Sender Department",
    "recipient_name": "Recipient Name",
    "recipient_designation": "Recipient Designation",
    "recipient_dept": "Recipient Department",
    "subject": "Subject",
    "description": "Description / Notes",
    "ref_inward": "Reference Inward",
    "scanned_copy": "Scanned Document",
    "letter_body": "Letter Body",
    "ai_drafted": "AI Drafted",
    "manual": "Manually Typed",
    "generate_pdf": "Generate Letter PDF",
    "finalize_letter": "Finalize Letter",
    "tags": "Tags / Categories",
    "assigned_to": "Assigned To"
  },
  "visitor": {
    "title": "Visitor Book",
    "new_entry": "New Visitor",
    "visitor_name": "Visitor Name",
    "mobile": "Mobile Number",
    "address": "Address",
    "village_ward": "Village / Ward",
    "purpose": "Purpose of Visit",
    "purpose_desc": "Purpose Description",
    "checkin_time": "Check-In Time",
    "checkout_time": "Check-Out Time",
    "checkout": "Mark Check-Out",
    "repeat_visitor": "Repeat Visitor",
    "first_visit": "First Visit",
    "prev_visits": "{{count}} previous visits",
    "last_visit": "Last Visit: {{date}}",
    "linked_nivedan": "Linked Complaint",
    "today_count": "Today: {{count}} visitors",
    "week_count": "This Week: {{count}}",
    "month_count": "This Month: {{count}}",
    "print_register": "Print Daily Register"
  },
  "devworks": {
    "title": "Development Works",
    "new_work": "New Development Work",
    "project_name": "Project Name",
    "category": "Category",
    "location": "Location",
    "village_ward": "Village / Ward",
    "taluka": "Taluka",
    "funding_source": "Funding Source",
    "budget_allocated": "Budget Allocated (₹)",
    "budget_spent": "Budget Spent (₹)",
    "budget_remaining": "Remaining Budget",
    "contractor_name": "Contractor Name",
    "contractor_contact": "Contractor Contact",
    "start_date": "Start Date",
    "expected_completion": "Expected Completion",
    "actual_completion": "Actual Completion Date",
    "progress": "Progress (%)",
    "delayed_by": "Delayed by {{days}} days",
    "site_photos": "Site Photos",
    "photo_before": "Before",
    "photo_during": "During",
    "photo_after": "After",
    "geo_coordinates": "GPS Location",
    "description": "Notes / Description",
    "notify_workers": "Notify Workers"
  },
  "karyakarta": {
    "title": "Karyakarta Master (Party Workers)",
    "new_entry": "Add New Karyakarta",
    "full_name": "Full Name",
    "mobile": "Mobile Number",
    "alt_mobile": "Alternate Mobile",
    "dob": "Date of Birth",
    "address": "Address",
    "village_ward": "Village / Ward",
    "gram_panchayat": "Gram Panchayat",
    "taluka": "Taluka",
    "booth_number": "Booth Number",
    "designation": "Designation",
    "profile_photo": "Profile Photo",
    "is_active": "Active Status",
    "joined_date": "Joined Date",
    "notes": "Notes",
    "bulk_import": "Bulk Import from Excel",
    "import_preview": "Preview Import Data",
    "import_errors": "Import Errors",
    "duplicate_found": "Duplicate mobile number found",
    "total_workers": "Total Workers: {{count}}"
  },
  "booth": {
    "title": "Booth Architecture",
    "constituency": "Constituency",
    "district": "District",
    "taluka": "Taluka",
    "gram_panchayat": "Gram Panchayat",
    "village": "Village",
    "city": "City",
    "ward": "Ward",
    "booth_number": "Booth Number",
    "polling_booth": "Polling Booth",
    "total_voters": "Total Voters",
    "booth_pramukh": "Booth Pramukh",
    "workers_assigned": "Workers Assigned",
    "verification_status": "Verification Status",
    "verified": "Verified",
    "not_verified": "Not Verified",
    "area": "Area",
    "locality": "Locality"
  },
  "calendar": {
    "title": "Calendar & Events",
    "new_event": "New Event",
    "event_title": "Title",
    "event_description": "Description",
    "event_type": "Event Type",
    "event_date": "Date",
    "start_time": "Start Time",
    "end_time": "End Time",
    "location": "Location",
    "attendees": "Attendees",
    "is_recurring": "Recurring Event",
    "reminder": "Reminder",
    "view_monthly": "Monthly View",
    "view_weekly": "Weekly View",
    "view_daily": "Daily Agenda",
    "type_meeting": "Meeting",
    "type_public_program": "Public Program",
    "type_govt_deadline": "Government Deadline",
    "type_assembly": "Assembly Session",
    "type_constituency_visit": "Constituency Visit",
    "type_personal": "Personal",
    "recurring_daily": "Daily",
    "recurring_weekly": "Weekly",
    "recurring_monthly": "Monthly",
    "reminder_15": "15 minutes before",
    "reminder_30": "30 minutes before",
    "reminder_60": "1 hour before",
    "reminder_1d": "1 day before"
  },
  "whatsapp": {
    "title": "WhatsApp Engine",
    "compose": "Compose Broadcast",
    "select_template": "Select Template",
    "custom_message": "Custom Message",
    "audience": "Audience",
    "all_workers": "All Workers",
    "by_booth": "By Booth",
    "by_village": "By Village/Ward",
    "by_designation": "By Designation",
    "custom_list": "Custom List",
    "recipient_count": "Recipients: {{count}}",
    "send_now": "Send Now",
    "schedule_send": "Schedule for Later",
    "delivery_total": "Total",
    "delivery_sent": "Sent",
    "delivery_delivered": "Delivered",
    "delivery_read": "Read",
    "delivery_failed": "Failed",
    "retry_failed": "Retry Failed Messages",
    "sms_fallback": "SMS Fallback Sent",
    "message_log": "Message Log",
    "bot_reply": "Bot Auto-Reply"
  },
  "reports": {
    "title": "Reports & Analytics",
    "generate": "Generate Report",
    "nivedan_summary": "Nivedan Summary",
    "nivedan_deptwise": "Nivedan Department-wise",
    "inward_outward": "Inward/Outward Register",
    "visitor_footfall": "Visitor Footfall",
    "devworks_progress": "Development Works Progress",
    "budget_expenditure": "Budget vs Expenditure",
    "karyakarta_directory": "Karyakarta Directory",
    "booth_verification": "Booth Verification",
    "area_analysis": "Area-wise Analysis",
    "monthly_performance": "Monthly Office Performance",
    "escalation_report": "Escalation Report",
    "select_date_range": "Select Date Range",
    "chart_label": "Chart",
    "table_label": "Table"
  },
  "users": {
    "title": "User Management",
    "new_user": "Create New User",
    "full_name": "Full Name",
    "username": "Username",
    "password": "Password",
    "confirm_password": "Confirm Password",
    "role": "Role",
    "mobile": "Mobile",
    "email": "Email",
    "last_login": "Last Login",
    "deactivate": "Deactivate User",
    "reset_password": "Reset Password",
    "role_mla": "MLA",
    "role_pa": "Personal Assistant (PA)",
    "role_receptionist": "Receptionist",
    "role_staff": "Office Staff",
    "role_auditor": "Field Auditor",
    "role_booth_pramukh": "Booth Pramukh",
    "role_admin": "System Administrator",
    "audit_log": "Audit Log",
    "audit_timestamp": "Timestamp",
    "audit_user": "User",
    "audit_action": "Action",
    "audit_module": "Module",
    "audit_ip": "IP Address"
  },
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome, {{name}}",
    "kpi_total_nivedans": "Total Nivedans",
    "kpi_pending": "Pending Complaints",
    "kpi_resolved": "Resolved This Month",
    "kpi_escalated": "Escalated (Overdue)",
    "kpi_visitors_today": "Visitors Today",
    "kpi_inward_pending": "Inward Letters Pending",
    "kpi_devworks_active": "Active Dev Works",
    "kpi_total_workers": "Total Karyakartas",
    "chart_nivedan_trend": "Nivedan Trend (Monthly)",
    "chart_category_dist": "Category Distribution",
    "chart_status_dist": "Status Distribution",
    "chart_area_heatmap": "Area-wise Heatmap",
    "activity_feed": "Recent Activity",
    "resolution_rate": "Resolution Rate"
  },
  "modal": {
    "confirm_title": "Confirm Action",
    "are_you_sure": "Are you sure you want to proceed?",
    "confirm_cancel_nivedan": "Cancel this complaint? This cannot be undone.",
    "confirm_reject_nivedan": "Reject this complaint? Please provide a reason.",
    "confirm_resolve": "Mark as resolved?",
    "confirm_deactivate": "Deactivate this user? They will lose access.",
    "session_expired": "Session Expired",
    "session_expired_msg": "Your session has expired. Please log in again.",
    "login_again": "Log In Again",
    "unsaved_changes": "You have unsaved changes. Discard?",
    "discard": "Discard",
    "stay": "Stay on Page"
  },
  "toast": {
    "success_saved": "Saved successfully!",
    "success_created": "Created successfully!",
    "success_updated": "Updated successfully!",
    "success_deleted": "Removed successfully!",
    "success_sent": "Message sent successfully!",
    "success_exported": "Export completed!",
    "success_imported": "Import completed — {{count}} records added!",
    "info_no_changes": "No changes to save.",
    "info_already_sent": "Message already sent for today.",
    "warning_large_file": "File is large. Upload may take time.",
    "warning_unsaved": "You have unsaved changes!",
    "error_generic": "Something went wrong. Please try again.",
    "error_network": "Network error. Check your connection.",
    "error_upload": "File upload failed."
  },
  "table": {
    "sr_no": "Sr. No.",
    "name": "Name",
    "date": "Date",
    "subject": "Subject",
    "category": "Category",
    "status": "Status",
    "priority": "Priority",
    "assigned_to": "Assigned To",
    "department": "Department",
    "mobile": "Mobile",
    "actions": "Actions",
    "village_ward": "Village/Ward",
    "created_by": "Created By",
    "created_at": "Created At",
    "last_updated": "Last Updated",
    "designation": "Designation",
    "booth": "Booth",
    "budget": "Budget (₹)",
    "progress": "Progress",
    "purpose": "Purpose",
    "time": "Time",
    "delivery_status": "Delivery Status"
  },
  "categories": {
    "WATER_SUPPLY": "Water Supply",
    "ROAD_DRAINAGE": "Road / Drainage",
    "ELECTRICITY": "Electricity",
    "LAND_REVENUE": "Land / Revenue",
    "EDUCATION": "Education",
    "HEALTH_MEDICAL": "Health / Medical",
    "PENSION_WELFARE": "Pension / Social Welfare",
    "RATION_CARD": "Ration Card / PDS",
    "CERTIFICATE": "Caste / Income Certificate",
    "HOUSING": "Housing / Awas Yojana",
    "AGRICULTURE": "Agriculture",
    "EMPLOYMENT": "Employment / Rojgar",
    "POLICE": "Police / Law & Order",
    "GENERAL_OTHER": "General / Other"
  },
  "departments": {
    "COLLECTOR": "District Collector Office",
    "TAHSILDAR": "Tahsildar Office",
    "ZP": "Zilla Parishad",
    "PANCHAYAT_SAMITI": "Panchayat Samiti",
    "GRAM_PANCHAYAT": "Gram Panchayat",
    "MUNICIPAL_CORP": "Municipal Corporation",
    "MUNICIPAL_COUNCIL": "Municipal Council",
    "NAGAR_PANCHAYAT": "Nagar Panchayat",
    "PWD": "Public Works Dept (PWD)",
    "WATER_DEPT": "Water Supply Department",
    "MSEDCL": "MSEDCL / Electricity Board",
    "REVENUE": "Revenue Department",
    "EDUCATION_DEPT": "Education Department",
    "HEALTH_DEPT": "Health Department",
    "SOCIAL_WELFARE": "Social Welfare Department",
    "AGRICULTURE_DEPT": "Agriculture Department",
    "POLICE_DEPT": "Police Department",
    "TRIBAL_DEPT": "Tribal Development Dept",
    "WOMEN_CHILD": "Women & Child Development",
    "FOOD_SUPPLY": "Food & Civil Supplies"
  },
  "visitor_purpose": {
    "GRIEVANCE": "Grievance / Complaint",
    "COURTESY_CALL": "Courtesy Call / VIP Visit",
    "PARTY_WORK": "Party Work",
    "INVITATION": "Invitation",
    "PERSONAL_MEETING": "Personal Meeting",
    "DOCUMENT_SUBMISSION": "Document Submission",
    "FOLLOWUP": "Follow-up",
    "RECOMMENDATION": "Recommendation Request",
    "GENERAL_INQUIRY": "General Inquiry",
    "OTHER": "Other"
  },
  "work_categories": {
    "ROAD": "Road Construction",
    "DRAINAGE": "Drainage / Sewage",
    "WATER_PIPELINE": "Water Supply Pipeline",
    "HOSPITAL": "Hospital / Health Center",
    "SCHOOL": "School Building",
    "COMMUNITY_HALL": "Community Hall",
    "STREET_LIGHT": "Street Lighting",
    "BRIDGE": "Bridge / Culvert",
    "ELECTRIFICATION": "Electrification",
    "GARDEN_PARK": "Garden / Park",
    "TOILET": "Toilet / Sanitation",
    "CREMATORIUM": "Crematorium / Burial Ground",
    "OTHER": "Other"
  },
  "designations": {
    "BOOTH_PRAMUKH": "Booth Pramukh",
    "WARD_HEAD": "Ward Head",
    "SHAKTI_KENDRA": "Shakti Kendra Pramukh",
    "KARYAKARTA": "Karyakarta",
    "VOLUNTEER": "Volunteer",
    "OTHER": "Other"
  },
  "funding": {
    "MLALAD": "MLALAD (MLA Fund)",
    "ZP_FUND": "Zilla Parishad Fund",
    "STATE_GRANT": "State Government Grant",
    "CENTRAL_GRANT": "Central Government Grant",
    "MUNICIPAL_FUND": "Municipal Corporation Fund",
    "GP_FUND": "Gram Panchayat Fund",
    "MPLAD": "MPLAD (MP Fund)",
    "CSR": "CSR (Corporate)",
    "OTHER_MIXED": "Other / Mixed"
  },
  "pagination": {
    "showing": "Showing {{from}}-{{to}} of {{total}}",
    "per_page": "Per Page",
    "first": "First",
    "last": "Last",
    "previous": "Previous",
    "next": "Next",
    "no_data": "No data found.",
    "no_results": "No results match your search.",
    "empty_table": "No records to display.",
    "loading_data": "Loading data..."
  }
}
```

---

### 3.2 `src/i18n/locales/mr.json`

```json
{
  "common": {
    "save": "जतन करा",
    "cancel": "रद्द करा",
    "submit": "सादर करा",
    "edit": "संपादित करा",
    "delete": "काढून टाका",
    "view": "पहा",
    "view_details": "तपशील पहा",
    "print": "छापा",
    "export": "निर्यात करा",
    "export_pdf": "PDF निर्यात करा",
    "export_excel": "Excel निर्यात करा",
    "download": "डाउनलोड करा",
    "upload": "अपलोड करा",
    "search": "शोधा...",
    "filter": "फिल्टर",
    "clear_all": "सर्व साफ करा",
    "apply_filters": "फिल्टर लागू करा",
    "confirm": "निश्चित करा",
    "back": "मागे जा",
    "next": "पुढे चला",
    "close": "बंद करा",
    "refresh": "रीफ्रेश करा",
    "loading": "लोड होत आहे...",
    "actions": "कृती",
    "status": "स्थिती",
    "date": "दिनांक",
    "details": "तपशील",
    "add_new": "नवीन जोडा",
    "create": "तयार करा",
    "update": "अद्यतन करा",
    "yes": "होय",
    "no": "नाही",
    "select": "निवडा",
    "select_all": "सर्व निवडा",
    "required": "आवश्यक",
    "optional": "ऐच्छिक",
    "from_date": "सुरुवात दिनांक",
    "to_date": "शेवट दिनांक",
    "today": "आज",
    "this_week": "या आठवड्यात",
    "this_month": "या महिन्यात",
    "draft_ai": "✨ AI मसुदा तयार करा",
    "finalize": "अंतिम करा",
    "approve": "मंजूर करा",
    "assign": "नियुक्त करा",
    "forward": "वर्ग करा",
    "retry": "पुन्हा प्रयत्न करा",
    "send": "पाठवा",
    "preview": "पूर्वावलोकन",
    "reset": "रीसेट करा",
    "active": "सक्रिय",
    "inactive": "निष्क्रिय",
    "sort_by": "क्रमवारी",
    "ascending": "चढता क्रम",
    "descending": "उतरता क्रम"
  },
  "nav": {
    "dashboard": "डॅशबोर्ड",
    "nivedan": "नागरिक तक्रारी (निवेदन)",
    "inward": "आवक नोंदवही",
    "outward": "जावक नोंदवही",
    "visitor": "व्हिजिटर बुक",
    "devworks": "विकासकामे",
    "karyakarta": "कार्यकर्ता मास्टर",
    "geography": "मतदारसंघ रचना",
    "booth": "बूथ रचना",
    "calendar": "कॅलेंडर व कार्यक्रम",
    "whatsapp": "व्हॉट्सअॅप इंजिन",
    "reports": "अहवाल व विश्लेषण",
    "users": "वापरकर्ता व्यवस्थापन",
    "settings": "सेटिंग्ज",
    "logout": "बाहेर पडा",
    "pillar_office": "कार्यालयीन कामकाज",
    "pillar_grievance": "जनतक्रार व विकासकामे",
    "pillar_cadre": "पक्षीय संघटन",
    "pillar_intelligence": "डॅशबोर्ड व तंत्र",
    "global_search": "सर्व मॉड्यूलमध्ये शोधा..."
  },
  "status": {
    "pending": "प्रलंबित",
    "in_progress": "कार्यवाही सुरू",
    "forwarded": "विभागाकडे वर्ग",
    "awaiting_response": "प्रतिसाद प्रतीक्षा",
    "resolved": "निकाली",
    "rejected": "नाकारले",
    "cancelled": "रद्द",
    "archived": "संग्रहित",
    "inward_pending": "प्रलंबित",
    "inward_assigned": "नियुक्त",
    "inward_in_progress": "कार्यवाही सुरू",
    "inward_completed": "पूर्ण",
    "sanctioned": "मंजूर",
    "work_in_progress": "प्रगतीपथावर",
    "completed": "पूर्ण",
    "delayed": "विलंबित"
  },
  "priority": {
    "high": "उच्च प्राधान्य",
    "medium": "मध्यम प्राधान्य",
    "low": "कमी प्राधान्य"
  },
  "nivedan": {
    "title": "नागरिक तक्रारी व निवेदने",
    "new_entry": "नवीन निवेदन",
    "tracking_id": "ट्रॅकिंग आयडी",
    "citizen_name": "तक्रारदाराचे नाव",
    "mobile": "मोबाईल क्रमांक",
    "address": "पत्ता",
    "village_ward": "गाव / वॉर्ड",
    "taluka": "तालुका",
    "category": "वर्ग / प्रकार",
    "sub_category": "उपवर्ग",
    "subject": "विषय",
    "description": "तपशील / वर्णन",
    "attachments": "संलग्नक",
    "assigned_dept": "वर्ग केलेला विभाग",
    "assigned_staff": "नियुक्त कर्मचारी",
    "priority": "प्राधान्य",
    "auto_routed": "स्वयं-मार्गदर्शित",
    "manually_set": "स्वहस्ते नियुक्त",
    "print_receipt": "पावती छापा",
    "print_slip": "छोटी पावती छापा",
    "timeline": "स्थिती इतिहास",
    "resolution_notes": "निराकरण तपशील",
    "internal_note": "अंतर्गत नोंद",
    "add_note": "नोंद जोडा",
    "citizen_history": "नागरिक तक्रार इतिहास",
    "repeat_citizen": "पुन्हा आलेला नागरिक — {{count}} पूर्वीच्या तक्रारी",
    "first_complaint": "पहिली तक्रार",
    "escalated": "वाढवलेले",
    "escalation_level1": "स्तर १ — मुदत उलटली",
    "escalation_level2": "स्तर २ — गंभीर विलंब",
    "whatsapp_history": "व्हॉट्सअॅप संदेश इतिहास",
    "tab_all": "सर्व",
    "tab_pending": "प्रलंबित",
    "tab_in_progress": "कार्यवाही सुरू",
    "tab_forwarded": "वर्ग केलेले",
    "tab_resolved": "निकाली",
    "tab_escalated": "वाढवलेले"
  },
  "letter": {
    "inward_title": "आवक नोंदवही",
    "outward_title": "जावक नोंदवही",
    "new_inward": "नवीन आवक नोंद",
    "new_outward": "नवीन जावक नोंद",
    "inward_no": "आवक क्र.",
    "outward_no": "जावक क्र.",
    "date_received": "प्राप्त दिनांक",
    "date_sent": "पाठवल्याचा दिनांक",
    "sender_name": "प्रेषकाचे नाव",
    "sender_designation": "प्रेषकाचे पद",
    "sender_dept": "प्रेषक विभाग",
    "recipient_name": "प्राप्तकर्त्याचे नाव",
    "recipient_designation": "प्राप्तकर्त्याचे पद",
    "recipient_dept": "प्राप्तकर्ता विभाग",
    "subject": "विषय",
    "description": "तपशील / टिपणी",
    "ref_inward": "संदर्भ आवक",
    "scanned_copy": "स्कॅन प्रत",
    "letter_body": "पत्र मजकूर",
    "ai_drafted": "AI मसुदा",
    "manual": "स्वहस्ते टाइप",
    "generate_pdf": "पत्र PDF तयार करा",
    "finalize_letter": "पत्र अंतिम करा",
    "tags": "टॅग / वर्ग",
    "assigned_to": "नियुक्त"
  },
  "visitor": {
    "title": "व्हिजिटर बुक",
    "new_entry": "नवीन भेटी",
    "visitor_name": "भेटीदाराचे नाव",
    "mobile": "मोबाईल क्रमांक",
    "address": "पत्ता",
    "village_ward": "गाव / वॉर्ड",
    "purpose": "भेटीचे कारण",
    "purpose_desc": "कारण तपशील",
    "checkin_time": "आगमन वेळ",
    "checkout_time": "निर्गमन वेळ",
    "checkout": "निर्गमन नोंदवा",
    "repeat_visitor": "पुन्हा आलेला भेटीदार",
    "first_visit": "पहिली भेट",
    "prev_visits": "{{count}} पूर्वीच्या भेटी",
    "last_visit": "शेवटची भेट: {{date}}",
    "linked_nivedan": "जोडलेले निवेदन",
    "today_count": "आज: {{count}} भेटीदार",
    "week_count": "या आठवड्यात: {{count}}",
    "month_count": "या महिन्यात: {{count}}",
    "print_register": "दैनिक नोंदवही छापा"
  },
  "devworks": {
    "title": "विकासकामे",
    "new_work": "नवीन विकासकाम",
    "project_name": "कामाचे नाव",
    "category": "वर्ग",
    "location": "ठिकाण",
    "village_ward": "गाव / वॉर्ड",
    "taluka": "तालुका",
    "funding_source": "अनुदान स्रोत",
    "budget_allocated": "मंजूर अंदाजपत्रक (₹)",
    "budget_spent": "खर्च झालेली रक्कम (₹)",
    "budget_remaining": "शिल्लक रक्कम",
    "contractor_name": "ठेकेदाराचे नाव",
    "contractor_contact": "ठेकेदार संपर्क",
    "start_date": "कामाची सुरुवात",
    "expected_completion": "अपेक्षित पूर्णता",
    "actual_completion": "प्रत्यक्ष पूर्णता दिनांक",
    "progress": "प्रगती (%)",
    "delayed_by": "{{days}} दिवसांनी विलंबित",
    "site_photos": "स्थळ छायाचित्रे",
    "photo_before": "पूर्वी",
    "photo_during": "काम सुरू असताना",
    "photo_after": "काम पूर्ण झाल्यावर",
    "geo_coordinates": "GPS स्थान",
    "description": "टिपणी / तपशील",
    "notify_workers": "कार्यकर्त्यांना कळवा"
  },
  "karyakarta": {
    "title": "कार्यकर्ता मास्टर",
    "new_entry": "नवीन कार्यकर्ता जोडा",
    "full_name": "पूर्ण नाव",
    "mobile": "मोबाईल क्रमांक",
    "alt_mobile": "पर्यायी मोबाईल",
    "dob": "जन्मतारीख",
    "address": "पत्ता",
    "village_ward": "गाव / वॉर्ड",
    "gram_panchayat": "ग्रामपंचायत",
    "taluka": "तालुका",
    "booth_number": "बूथ क्रमांक",
    "designation": "पदनाम",
    "profile_photo": "छायाचित्र",
    "is_active": "सक्रिय स्थिती",
    "joined_date": "सामील दिनांक",
    "notes": "टिपणी",
    "bulk_import": "Excel मधून आयात करा",
    "import_preview": "आयात डेटा पूर्वावलोकन",
    "import_errors": "आयात त्रुटी",
    "duplicate_found": "मोबाईल क्रमांक आधीच अस्तित्त्वात",
    "total_workers": "एकूण कार्यकर्ते: {{count}}"
  },
  "booth": {
    "title": "बूथ रचना",
    "constituency": "मतदारसंघ",
    "district": "जिल्हा",
    "taluka": "तालुका",
    "gram_panchayat": "ग्रामपंचायत",
    "village": "गाव",
    "city": "शहर",
    "ward": "प्रभाग / वॉर्ड",
    "booth_number": "बूथ क्रमांक",
    "polling_booth": "मतदान केंद्र",
    "total_voters": "एकूण मतदार",
    "booth_pramukh": "बूथ प्रमुख",
    "workers_assigned": "नियुक्त कार्यकर्ते",
    "verification_status": "पडताळणी स्थिती",
    "verified": "पडताळणी पूर्ण",
    "not_verified": "पडताळणी बाकी",
    "area": "परिसर / क्षेत्र",
    "locality": "वस्ती"
  },
  "calendar": {
    "title": "कॅलेंडर व कार्यक्रम",
    "new_event": "नवीन कार्यक्रम",
    "event_title": "शीर्षक",
    "event_description": "तपशील",
    "event_type": "कार्यक्रम प्रकार",
    "event_date": "दिनांक",
    "start_time": "सुरुवातीची वेळ",
    "end_time": "शेवटची वेळ",
    "location": "ठिकाण",
    "attendees": "सहभागी",
    "is_recurring": "पुनरावृत्ती कार्यक्रम",
    "reminder": "स्मरणपत्र",
    "view_monthly": "मासिक दृश्य",
    "view_weekly": "साप्ताहिक दृश्य",
    "view_daily": "दैनिक कार्यसूची",
    "type_meeting": "बैठक",
    "type_public_program": "सार्वजनिक कार्यक्रम",
    "type_govt_deadline": "शासकीय मुदत",
    "type_assembly": "विधानसभा अधिवेशन",
    "type_constituency_visit": "मतदारसंघ दौरा",
    "type_personal": "वैयक्तिक",
    "recurring_daily": "दररोज",
    "recurring_weekly": "दर आठवड्याला",
    "recurring_monthly": "दर महिन्याला",
    "reminder_15": "१५ मिनिटे आधी",
    "reminder_30": "३० मिनिटे आधी",
    "reminder_60": "१ तास आधी",
    "reminder_1d": "१ दिवस आधी"
  },
  "whatsapp": {
    "title": "व्हॉट्सअॅप इंजिन",
    "compose": "संदेश तयार करा",
    "select_template": "टेम्पलेट निवडा",
    "custom_message": "सानुकूल संदेश",
    "audience": "प्राप्तकर्ते",
    "all_workers": "सर्व कार्यकर्ते",
    "by_booth": "बूथनुसार",
    "by_village": "गाव/वॉर्डनुसार",
    "by_designation": "पदनामानुसार",
    "custom_list": "सानुकूल यादी",
    "recipient_count": "प्राप्तकर्ते: {{count}}",
    "send_now": "आता पाठवा",
    "schedule_send": "नंतर पाठवण्यासाठी नियोजन",
    "delivery_total": "एकूण",
    "delivery_sent": "पाठवले",
    "delivery_delivered": "वितरित",
    "delivery_read": "वाचले",
    "delivery_failed": "अयशस्वी",
    "retry_failed": "अयशस्वी पुन्हा पाठवा",
    "sms_fallback": "SMS द्वारे पाठवले",
    "message_log": "संदेश नोंदवही",
    "bot_reply": "बॉट स्वयं-उत्तर"
  },
  "reports": {
    "title": "अहवाल व विश्लेषण",
    "generate": "अहवाल तयार करा",
    "nivedan_summary": "निवेदन सारांश",
    "nivedan_deptwise": "निवेदन विभागनिहाय",
    "inward_outward": "आवक-जावक नोंदवही",
    "visitor_footfall": "भेटीदार संख्या",
    "devworks_progress": "विकासकामे प्रगती",
    "budget_expenditure": "अंदाजपत्रक विरुद्ध खर्च",
    "karyakarta_directory": "कार्यकर्ता निर्देशिका",
    "booth_verification": "बूथ पडताळणी",
    "area_analysis": "क्षेत्रनिहाय विश्लेषण",
    "monthly_performance": "मासिक कार्यालय कामगिरी",
    "escalation_report": "एस्केलेशन अहवाल",
    "select_date_range": "कालावधी निवडा",
    "chart_label": "आलेख",
    "table_label": "सारणी"
  },
  "users": {
    "title": "वापरकर्ता व्यवस्थापन",
    "new_user": "नवीन वापरकर्ता तयार करा",
    "full_name": "पूर्ण नाव",
    "username": "वापरकर्ता नाव",
    "password": "पासवर्ड",
    "confirm_password": "पासवर्ड पुष्टी करा",
    "role": "भूमिका",
    "mobile": "मोबाईल",
    "email": "ई-मेल",
    "last_login": "शेवटचे लॉगिन",
    "deactivate": "वापरकर्ता निष्क्रिय करा",
    "reset_password": "पासवर्ड रीसेट करा",
    "role_mla": "आमदार",
    "role_pa": "वैयक्तिक सहाय्यक (PA)",
    "role_receptionist": "स्वागतिका / फ्रंट डेस्क",
    "role_staff": "कार्यालयीन कर्मचारी",
    "role_auditor": "क्षेत्रीय पडताळणी अधिकारी",
    "role_booth_pramukh": "बूथ प्रमुख",
    "role_admin": "प्रणाली प्रशासक",
    "audit_log": "ऑडिट लॉग",
    "audit_timestamp": "वेळ",
    "audit_user": "वापरकर्ता",
    "audit_action": "कृती",
    "audit_module": "मॉड्यूल",
    "audit_ip": "IP पत्ता"
  },
  "dashboard": {
    "title": "डॅशबोर्ड",
    "welcome": "स्वागत आहे, {{name}}",
    "kpi_total_nivedans": "एकूण निवेदने",
    "kpi_pending": "प्रलंबित तक्रारी",
    "kpi_resolved": "या महिन्यात निकाली",
    "kpi_escalated": "वाढवलेले (मुदत उलटली)",
    "kpi_visitors_today": "आजचे भेटीदार",
    "kpi_inward_pending": "आवक पत्रे प्रलंबित",
    "kpi_devworks_active": "सक्रिय विकासकामे",
    "kpi_total_workers": "एकूण कार्यकर्ते",
    "chart_nivedan_trend": "निवेदन कल (मासिक)",
    "chart_category_dist": "वर्गनिहाय वितरण",
    "chart_status_dist": "स्थितीनिहाय वितरण",
    "chart_area_heatmap": "क्षेत्रनिहाय उष्णता नकाशा",
    "activity_feed": "अलीकडील कार्यवाही",
    "resolution_rate": "निराकरण दर"
  },
  "modal": {
    "confirm_title": "कृती निश्चित करा",
    "are_you_sure": "आपण पुढे जाऊ इच्छिता?",
    "confirm_cancel_nivedan": "ही तक्रार रद्द करायची? हे पूर्ववत होणार नाही.",
    "confirm_reject_nivedan": "ही तक्रार नाकारायची? कृपया कारण द्या.",
    "confirm_resolve": "निकाली म्हणून नोंदवायचे?",
    "confirm_deactivate": "हा वापरकर्ता निष्क्रिय करायचा? त्यांचा प्रवेश बंद होईल.",
    "session_expired": "सत्र संपले",
    "session_expired_msg": "आपले सत्र संपले आहे. कृपया पुन्हा लॉगिन करा.",
    "login_again": "पुन्हा लॉगिन करा",
    "unsaved_changes": "जतन न केलेले बदल आहेत. टाकून द्यायचे?",
    "discard": "टाकून द्या",
    "stay": "या पृष्ठावर राहा"
  },
  "toast": {
    "success_saved": "यशस्वीरित्या जतन केले!",
    "success_created": "यशस्वीरित्या तयार केले!",
    "success_updated": "यशस्वीरित्या अद्यतन केले!",
    "success_deleted": "यशस्वीरित्या काढून टाकले!",
    "success_sent": "संदेश यशस्वीरित्या पाठवला!",
    "success_exported": "निर्यात पूर्ण!",
    "success_imported": "आयात पूर्ण — {{count}} नोंदी जोडल्या!",
    "info_no_changes": "जतन करण्यासारखे बदल नाहीत.",
    "info_already_sent": "आजचा संदेश आधीच पाठवला आहे.",
    "warning_large_file": "फाईल मोठी आहे. अपलोडला वेळ लागेल.",
    "warning_unsaved": "जतन न केलेले बदल आहेत!",
    "error_generic": "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
    "error_network": "नेटवर्क त्रुटी. कनेक्शन तपासा.",
    "error_upload": "फाईल अपलोड अयशस्वी."
  },
  "table": {
    "sr_no": "अ.क्र.",
    "name": "नाव",
    "date": "दिनांक",
    "subject": "विषय",
    "category": "वर्ग",
    "status": "स्थिती",
    "priority": "प्राधान्य",
    "assigned_to": "नियुक्त",
    "department": "विभाग",
    "mobile": "मोबाईल",
    "actions": "कृती",
    "village_ward": "गाव/वॉर्ड",
    "created_by": "तयार करणारा",
    "created_at": "तयार दिनांक",
    "last_updated": "शेवटचे अद्यतन",
    "designation": "पदनाम",
    "booth": "बूथ",
    "budget": "अंदाजपत्रक (₹)",
    "progress": "प्रगती",
    "purpose": "कारण",
    "time": "वेळ",
    "delivery_status": "वितरण स्थिती"
  },
  "categories": {
    "WATER_SUPPLY": "पाणीपुरवठा",
    "ROAD_DRAINAGE": "रस्ते / गटार",
    "ELECTRICITY": "वीजपुरवठा",
    "LAND_REVENUE": "जमीन / महसूल",
    "EDUCATION": "शिक्षण",
    "HEALTH_MEDICAL": "आरोग्य",
    "PENSION_WELFARE": "पेन्शन / समाजकल्याण",
    "RATION_CARD": "रेशनकार्ड",
    "CERTIFICATE": "जात / उत्पन्न प्रमाणपत्र",
    "HOUSING": "घरकुल / आवास योजना",
    "AGRICULTURE": "शेती",
    "EMPLOYMENT": "रोजगार",
    "POLICE": "पोलीस",
    "GENERAL_OTHER": "इतर"
  },
  "departments": {
    "COLLECTOR": "जिल्हाधिकारी कार्यालय",
    "TAHSILDAR": "तहसीलदार कार्यालय",
    "ZP": "जिल्हा परिषद",
    "PANCHAYAT_SAMITI": "पंचायत समिती",
    "GRAM_PANCHAYAT": "ग्रामपंचायत",
    "MUNICIPAL_CORP": "महानगरपालिका",
    "MUNICIPAL_COUNCIL": "नगरपरिषद",
    "NAGAR_PANCHAYAT": "नगरपंचायत",
    "PWD": "सार्वजनिक बांधकाम विभाग",
    "WATER_DEPT": "पाणीपुरवठा विभाग",
    "MSEDCL": "महावितरण",
    "REVENUE": "महसूल विभाग",
    "EDUCATION_DEPT": "शिक्षण विभाग",
    "HEALTH_DEPT": "आरोग्य विभाग",
    "SOCIAL_WELFARE": "समाजकल्याण विभाग",
    "AGRICULTURE_DEPT": "कृषी विभाग",
    "POLICE_DEPT": "पोलीस विभाग",
    "TRIBAL_DEPT": "आदिवासी विकास विभाग",
    "WOMEN_CHILD": "महिला व बालविकास",
    "FOOD_SUPPLY": "अन्न व नागरी पुरवठा"
  },
  "visitor_purpose": {
    "GRIEVANCE": "तक्रार",
    "COURTESY_CALL": "सद्भेट",
    "PARTY_WORK": "पक्ष काम",
    "INVITATION": "निमंत्रण",
    "PERSONAL_MEETING": "वैयक्तिक भेट",
    "DOCUMENT_SUBMISSION": "कागदपत्रे जमा",
    "FOLLOWUP": "पाठपुरावा",
    "RECOMMENDATION": "शिफारसपत्र",
    "GENERAL_INQUIRY": "सामान्य चौकशी",
    "OTHER": "इतर"
  },
  "work_categories": {
    "ROAD": "रस्ते बांधकाम",
    "DRAINAGE": "गटार / नाले",
    "WATER_PIPELINE": "पाणीपुरवठा",
    "HOSPITAL": "रुग्णालय",
    "SCHOOL": "शाळा बांधकाम",
    "COMMUNITY_HALL": "समाजमंदिर",
    "STREET_LIGHT": "रस्ता दिवे",
    "BRIDGE": "पूल / मोरी",
    "ELECTRIFICATION": "विद्युतीकरण",
    "GARDEN_PARK": "उद्यान / बगीचा",
    "TOILET": "शौचालय",
    "CREMATORIUM": "स्मशानभूमी",
    "OTHER": "इतर"
  },
  "designations": {
    "BOOTH_PRAMUKH": "बूथ प्रमुख",
    "WARD_HEAD": "वॉर्ड प्रमुख",
    "SHAKTI_KENDRA": "शक्ती केंद्र प्रमुख",
    "KARYAKARTA": "कार्यकर्ता",
    "VOLUNTEER": "स्वयंसेवक",
    "OTHER": "इतर"
  },
  "funding": {
    "MLALAD": "आमदार निधी",
    "ZP_FUND": "जिल्हा परिषद निधी",
    "STATE_GRANT": "राज्य शासन अनुदान",
    "CENTRAL_GRANT": "केंद्र शासन अनुदान",
    "MUNICIPAL_FUND": "महानगरपालिका निधी",
    "GP_FUND": "ग्रामपंचायत निधी",
    "MPLAD": "खासदार निधी",
    "CSR": "सीएसआर",
    "OTHER_MIXED": "इतर / मिश्र"
  },
  "pagination": {
    "showing": "{{total}} पैकी {{from}}-{{to}} दर्शवत आहे",
    "per_page": "प्रत्येक पृष्ठावर",
    "first": "पहिले",
    "last": "शेवटचे",
    "previous": "मागील",
    "next": "पुढील",
    "no_data": "डेटा आढळला नाही.",
    "no_results": "आपल्या शोधाशी जुळणारे परिणाम नाहीत.",
    "empty_table": "दर्शविण्यासाठी नोंदी नाहीत.",
    "loading_data": "डेटा लोड होत आहे..."
  }
}
```

---

## 4. Key Count Summary

| Section | Keys |
|---------|:----:|
| `common.*` | 55 |
| `nav.*` | 20 |
| `status.*` | 16 |
| `priority.*` | 3 |
| `nivedan.*` | 36 |
| `letter.*` | 25 |
| `visitor.*` | 20 |
| `devworks.*` | 25 |
| `karyakarta.*` | 21 |
| `booth.*` | 18 |
| `calendar.*` | 28 |
| `whatsapp.*` | 22 |
| `reports.*` | 16 |
| `users.*` | 25 |
| `dashboard.*` | 16 |
| `modal.*` | 12 |
| `toast.*` | 14 |
| `table.*` | 22 |
| `categories.*` | 14 |
| `departments.*` | 20 |
| `visitor_purpose.*` | 10 |
| `work_categories.*` | 13 |
| `designations.*` | 6 |
| `funding.*` | 9 |
| `pagination.*` | 10 |
| **TOTAL** | **~496** |
