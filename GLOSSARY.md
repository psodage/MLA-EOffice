# MLA E-Office — Glossary (शब्दकोश)

> **Complete Marathi ↔ English Term Dictionary for the MLA E-Office System**
> 
> This glossary ensures the AI agent, developers, and translators use **consistent terminology** across all code, UI text, letters, WhatsApp templates, and reports.
> 
> *Related Documents:* [PROJECT_OVERVIEW.md](file:///s:/MLA%20E%20-%20Office/PROJECT_OVERVIEW.md) | [PROJECT_SECTIONS_BREAKDOWN.md](file:///s:/MLA%20E%20-%20Office/PROJECT_SECTIONS_BREAKDOWN.md) | [USER_ROLES.md](file:///s:/MLA%20E%20-%20Office/USER_ROLES.md)

---

## How to Use This Glossary

- **For AI agents:** Always use these exact terms when generating UI labels, letters, WhatsApp templates, or any Marathi/English text.
- **For developers:** Use the English term as the variable/field name, and the Marathi term as the i18n translation value.
- **For translators:** This is the single source of truth for all bilingual text in the system.

---

## 1. System Module Names

| English | Marathi | Variable Name | Description |
|---------|---------|---------------|-------------|
| Dashboard | डॅशबोर्ड | `dashboard` | Executive KPI home screen |
| Inward Register | आवक नोंदवही | `inward` | Incoming letters/documents |
| Outward Register | जावक नोंदवही | `outward` | Outgoing letters/correspondence |
| Inward & Outward | आवक-जावक | `inward_outward` | Combined letter management |
| Nivedan | निवेदन | `nivedan` | Citizen complaints & petitions |
| Visitor Book | व्हिजिटर बुक | `visitor` | Office visitor register |
| Development Works | विकासकामे | `devworks` | Infrastructure projects tracker |
| Karyakarta Master | कार्यकर्ता मास्टर | `karyakarta` | Party worker database |
| Booth Architecture | बूथ रचना | `booth` | Polling booth structure |
| Booth Verification | बूथ पडताळणी | `booth_verification` | Field work verification |
| Gram/Ward Organization | ग्राम/वॉर्ड रचना | `geography` | Geographical hierarchy |
| Calendar | कॅलेंडर | `calendar` | Events & schedule manager |
| WhatsApp Engine | व्हॉट्सअॅप इंजिन | `whatsapp` | Automated messaging system |
| Reports & Analytics | अहवाल व विश्लेषण | `reports` | Report generation module |
| Notification Center | सूचना केंद्र | `notifications` | In-app alerts |
| User Management | वापरकर्ता व्यवस्थापन | `users` | User accounts & roles |
| Security & RBAC | सुरक्षा व अधिकार | `security` | Access control & audit |
| Audit Log | ऑडिट लॉग | `audit` | Activity tracking log |

---

## 2. User Roles

| English | Marathi | Variable Name | Description |
|---------|---------|---------------|-------------|
| MLA | आमदार | `MLA` | Member of Legislative Assembly — system owner |
| Personal Assistant | वैयक्तिक सहाय्यक (PA) | `PA` | Office manager, operational head |
| Receptionist | स्वागतिका / फ्रंट डेस्क | `RECEPTIONIST` | Front desk clerk, citizen liaison |
| Office Staff | कार्यालयीन कर्मचारी | `STAFF` | General office employees |
| Field Auditor | क्षेत्रीय पडताळणी अधिकारी | `AUDITOR` | Ground inspector, verification officer |
| Assessor | मूल्यांकनकार | `ASSESSOR` | Alternate term for Field Auditor |
| Supervisor | पर्यवेक्षक | `SUPERVISOR` | Alternate term for Field Auditor |
| Booth Pramukh | बूथ प्रमुख | `BOOTH_PRAMUKH` | Polling booth head (WhatsApp only) |
| Citizen | नागरिक | `CITIZEN` | Public user, complaint submitter |
| Constituent | मतदार | `CONSTITUENT` | Voter in the constituency |
| System Administrator | प्रणाली प्रशासक | `ADMIN` | IT admin, system maintainer |

---

## 3. Nivedan (Complaint) Terms

| English | Marathi | Variable Name | Usage Context |
|---------|---------|---------------|---------------|
| Complaint | तक्रार | `complaint` | Citizen grievance |
| Petition | निवेदन | `nivedan` | Formal request/petition |
| Grievance | तक्रार / दाद | `grievance` | Public grievance |
| Tracking ID | ट्रॅकिंग आयडी | `tracking_id` | Unique complaint identifier (NIV-2026-00001) |
| Complainant | तक्रारदार | `complainant` | Person filing the complaint |
| Subject | विषय | `subject` | Complaint topic/title |
| Description | तपशील / वर्णन | `description` | Detailed complaint text |
| Category | वर्ग / प्रकार | `category` | Complaint type classification |
| Sub-Category | उपवर्ग | `sub_category` | Detailed classification |
| Priority | प्राधान्य | `priority` | Urgency level |
| Status | स्थिती | `status` | Current lifecycle stage |
| Resolution | निराकरण | `resolution` | Fix/solution applied |
| Escalation | वाढवणे / एस्केलेशन | `escalation` | Auto-escalation to higher authority |
| Auto-Routing | स्वयं-मार्गदर्शन | `auto_routing` | Automatic assignment based on category |
| Forwarded | वर्ग केले | `forwarded` | Sent to another department |
| Receipt | पावती | `receipt` | Printed acknowledgment slip |
| Timeline | कालरेखा | `timeline` | Activity history log |
| Internal Note | अंतर्गत नोंद | `internal_note` | Staff-only comment on complaint |

---

## 4. Nivedan Status Values

| English | Marathi | Variable Name | Color | Description |
|---------|---------|---------------|-------|-------------|
| Pending | प्रलंबित | `PENDING` | 🟡 Yellow | Newly registered, no action yet |
| In Progress | कार्यवाही सुरू | `IN_PROGRESS` | 🔵 Blue | Staff working on it |
| Forwarded to Dept | विभागाकडे वर्ग | `FORWARDED` | 🟠 Orange | Sent to govt department |
| Awaiting Response | प्रतिसाद प्रतीक्षा | `AWAITING_RESPONSE` | 🟣 Purple | Waiting for department reply |
| Resolved | निकाली | `RESOLVED` | 🟢 Green | Issue fixed, citizen informed |
| Rejected | नाकारले | `REJECTED` | 🔴 Red | Invalid or duplicate complaint |
| Cancelled | रद्द | `CANCELLED` | ⚪ Gray | Citizen withdrew complaint |
| Archived | संग्रहित | `ARCHIVED` | ⚫ Dark Gray | Old resolved, moved to archive |

---

## 5. Nivedan Categories

| # | English | Marathi | Variable Name |
|:-:|---------|---------|---------------|
| 1 | Water Supply | पाणीपुरवठा | `WATER_SUPPLY` |
| 2 | Road / Drainage | रस्ते / गटार | `ROAD_DRAINAGE` |
| 3 | Electricity | वीजपुरवठा | `ELECTRICITY` |
| 4 | Land / Revenue | जमीन / महसूल | `LAND_REVENUE` |
| 5 | Education | शिक्षण | `EDUCATION` |
| 6 | Health / Medical | आरोग्य | `HEALTH_MEDICAL` |
| 7 | Pension / Social Welfare | पेन्शन / समाजकल्याण | `PENSION_WELFARE` |
| 8 | Ration Card / PDS | रेशनकार्ड | `RATION_CARD` |
| 9 | Caste / Income Certificate | जात / उत्पन्न प्रमाणपत्र | `CERTIFICATE` |
| 10 | Housing / Awas Yojana | घरकुल / आवास योजना | `HOUSING` |
| 11 | Agriculture | शेती | `AGRICULTURE` |
| 12 | Employment / Rojgar | रोजगार | `EMPLOYMENT` |
| 13 | Police / Law & Order | पोलीस | `POLICE` |
| 14 | General / Other | इतर | `GENERAL_OTHER` |

---

## 6. Visitor Purpose Categories

| # | English | Marathi | Variable Name |
|:-:|---------|---------|---------------|
| 1 | Grievance / Complaint | तक्रार | `GRIEVANCE` |
| 2 | Courtesy Call / VIP Visit | सद्भेट | `COURTESY_CALL` |
| 3 | Party Work | पक्ष काम | `PARTY_WORK` |
| 4 | Invitation | निमंत्रण | `INVITATION` |
| 5 | Personal Meeting | वैयक्तिक भेट | `PERSONAL_MEETING` |
| 6 | Document Submission | कागदपत्रे जमा | `DOCUMENT_SUBMISSION` |
| 7 | Follow-up on Previous Complaint | पाठपुरावा | `FOLLOWUP` |
| 8 | Recommendation Request | शिफारसपत्र | `RECOMMENDATION` |
| 9 | General Inquiry | सामान्य चौकशी | `GENERAL_INQUIRY` |
| 10 | Other | इतर | `OTHER` |

---

## 7. Development Work Categories

| # | English | Marathi | Variable Name |
|:-:|---------|---------|---------------|
| 1 | Road Construction | रस्ते बांधकाम | `ROAD` |
| 2 | Drainage / Sewage | गटार / नाले | `DRAINAGE` |
| 3 | Water Supply Pipeline | पाणीपुरवठा | `WATER_PIPELINE` |
| 4 | Hospital / Health Center | रुग्णालय | `HOSPITAL` |
| 5 | School Building | शाळा बांधकाम | `SCHOOL` |
| 6 | Community Hall | समाजमंदिर | `COMMUNITY_HALL` |
| 7 | Street Lighting | रस्ता दिवे | `STREET_LIGHT` |
| 8 | Bridge / Culvert | पूल / मोरी | `BRIDGE` |
| 9 | Electrification | विद्युतीकरण | `ELECTRIFICATION` |
| 10 | Garden / Park | उद्यान / बगीचा | `GARDEN_PARK` |
| 11 | Toilet / Sanitation | शौचालय | `TOILET` |
| 12 | Crematorium / Burial Ground | स्मशानभूमी | `CREMATORIUM` |
| 13 | Other | इतर | `OTHER` |

---

## 8. Development Work Status Values

| English | Marathi | Variable Name | Color |
|---------|---------|---------------|-------|
| Sanctioned | मंजूर | `SANCTIONED` | 🔵 Blue |
| In Progress | प्रगतीपथावर | `IN_PROGRESS` | 🟡 Yellow |
| Completed | पूर्ण | `COMPLETED` | 🟢 Green |
| Delayed | विलंबित | `DELAYED` | 🔴 Red |

---

## 9. Funding Sources

| # | English | Marathi | Variable Name |
|:-:|---------|---------|---------------|
| 1 | MLALAD (MLA Fund) | आमदार निधी | `MLALAD` |
| 2 | Zilla Parishad Fund | जिल्हा परिषद निधी | `ZP_FUND` |
| 3 | State Government Grant | राज्य शासन अनुदान | `STATE_GRANT` |
| 4 | Central Government Grant | केंद्र शासन अनुदान | `CENTRAL_GRANT` |
| 5 | Municipal Corporation Fund | महानगरपालिका निधी | `MUNICIPAL_FUND` |
| 6 | Gram Panchayat Fund | ग्रामपंचायत निधी | `GP_FUND` |
| 7 | MPLAD (MP Fund) | खासदार निधी | `MPLAD` |
| 8 | CSR (Corporate) | सीएसआर | `CSR` |
| 9 | Other / Mixed | इतर / मिश्र | `OTHER_MIXED` |

---

## 10. Karyakarta Designations

| # | English | Marathi | Variable Name |
|:-:|---------|---------|---------------|
| 1 | Booth Pramukh | बूथ प्रमुख | `BOOTH_PRAMUKH` |
| 2 | Ward Head | वॉर्ड प्रमुख | `WARD_HEAD` |
| 3 | Shakti Kendra Pramukh | शक्ती केंद्र प्रमुख | `SHAKTI_KENDRA` |
| 4 | Karyakarta | कार्यकर्ता | `KARYAKARTA` |
| 5 | Volunteer | स्वयंसेवक | `VOLUNTEER` |
| 6 | Other | इतर | `OTHER` |

---

## 11. Inward/Outward Terms

| English | Marathi | Variable Name | Usage |
|---------|---------|---------------|-------|
| Inward | आवक | `inward` | Incoming letter/document |
| Outward | जावक | `outward` | Outgoing letter/document |
| Inward Number | आवक क्रमांक | `inward_number` | Auto-generated: INW/2026/0001 |
| Outward Number | जावक क्रमांक | `outward_number` | Auto-generated: OUT/2026/0001 |
| Letter | पत्र | `letter` | Official correspondence |
| Application | अर्ज | `application` | Formal application/request |
| Notice | सूचना / नोटीस | `notice` | Official notice |
| Circular | परिपत्रक | `circular` | Government circular |
| Order | आदेश | `order` | Government order (GR) |
| Government Resolution | शासन निर्णय (GR) | `government_resolution` | Official state government decision |
| Sender | प्रेषक / पाठवणारा | `sender` | Person/dept sending letter |
| Recipient | प्राप्तकर्ता | `recipient` | Person/dept receiving letter |
| Date Received | प्राप्त दिनांक | `date_received` | Date letter was received |
| Date Sent | पाठवल्याचा दिनांक | `date_sent` | Date letter was dispatched |
| Scanned Copy | स्कॅन प्रत | `scanned_copy` | Digital copy of physical letter |
| Attachment | संलग्नक / जोडपत्र | `attachment` | Supporting document |
| AI Draft | एआय मसुदा | `ai_draft` | AI-generated letter draft |
| Finalize | अंतिम करा | `finalize` | Approve and complete the letter |

---

## 12. Calendar & Event Terms

| English | Marathi | Variable Name |
|---------|---------|---------------|
| Event | कार्यक्रम | `event` |
| Meeting | बैठक / सभा | `meeting` |
| Public Program | सार्वजनिक कार्यक्रम | `public_program` |
| Government Deadline | शासकीय मुदत | `govt_deadline` |
| Assembly Session | विधानसभा अधिवेशन | `assembly_session` |
| Constituency Visit | मतदारसंघ दौरा | `constituency_visit` |
| Personal | वैयक्तिक | `personal` |
| Reminder | स्मरणपत्र | `reminder` |
| Schedule | वेळापत्रक | `schedule` |
| Agenda | कार्यसूची | `agenda` |

---

## 13. Geographical Terms

| English | Marathi | Variable Name | Description |
|---------|---------|---------------|-------------|
| Constituency | मतदारसंघ | `constituency` | MLA's electoral area |
| District | जिल्हा | `district` | Administrative district |
| Taluka | तालुका | `taluka` | Sub-district division |
| Gram Panchayat | ग्रामपंचायत | `gram_panchayat` | Village-level self-government |
| Village | गाव | `village` | Rural settlement |
| City | शहर | `city` | Urban area |
| Ward | प्रभाग / वॉर्ड | `ward` | Urban division |
| Polling Booth | मतदान केंद्र | `booth` | Voting station |
| Booth Number | बूथ क्रमांक | `booth_number` | Polling booth identifier |
| Area | परिसर / क्षेत्र | `area` | General geographical area |
| Locality | वस्ती | `locality` | Neighborhood |
| Total Voters | एकूण मतदार | `total_voters` | Registered voter count per booth |

---

## 14. Government Departments

| # | English | Marathi | Short Code |
|:-:|---------|---------|-----------|
| 1 | District Collector Office | जिल्हाधिकारी कार्यालय | `COLLECTOR` |
| 2 | Tahsildar Office | तहसीलदार कार्यालय | `TAHSILDAR` |
| 3 | Zilla Parishad (ZP) | जिल्हा परिषद | `ZP` |
| 4 | Panchayat Samiti | पंचायत समिती | `PANCHAYAT_SAMITI` |
| 5 | Gram Panchayat | ग्रामपंचायत | `GRAM_PANCHAYAT` |
| 6 | Municipal Corporation | महानगरपालिका | `MUNICIPAL_CORP` |
| 7 | Municipal Council | नगरपरिषद | `MUNICIPAL_COUNCIL` |
| 8 | Nagar Panchayat | नगरपंचायत | `NAGAR_PANCHAYAT` |
| 9 | Public Works Department (PWD) | सार्वजनिक बांधकाम विभाग | `PWD` |
| 10 | Water Supply Department | पाणीपुरवठा विभाग | `WATER_DEPT` |
| 11 | MSEDCL / Electricity Board | महावितरण | `MSEDCL` |
| 12 | Revenue Department | महसूल विभाग | `REVENUE` |
| 13 | Education Department | शिक्षण विभाग | `EDUCATION_DEPT` |
| 14 | Health Department | आरोग्य विभाग | `HEALTH_DEPT` |
| 15 | Social Welfare Department | समाजकल्याण विभाग | `SOCIAL_WELFARE` |
| 16 | Agriculture Department | कृषी विभाग | `AGRICULTURE_DEPT` |
| 17 | Police Department | पोलीस विभाग | `POLICE_DEPT` |
| 18 | Tribal Development Department | आदिवासी विकास विभाग | `TRIBAL_DEPT` |
| 19 | Women and Child Development | महिला व बालविकास | `WOMEN_CHILD` |
| 20 | Food and Civil Supplies | अन्न व नागरी पुरवठा | `FOOD_SUPPLY` |

---

## 15. Legislative & Political Terms

| English | Marathi | Description |
|---------|---------|-------------|
| Member of Legislative Assembly (MLA) | आमदार / विधानसभा सदस्य | Elected representative at state level |
| Member of Parliament (MP) | खासदार / लोकसभा/राज्यसभा सदस्य | Elected representative at national level |
| Legislative Assembly | विधानसभा | Lower house of state legislature |
| Legislative Council | विधान परिषद | Upper house of state legislature |
| State Secretariat | मंत्रालय | State government headquarters (Mantralaya) |
| Assembly Session | विधानसभा अधिवेशन | Period when legislature meets |
| Session Schedule | अधिवेशन कार्यक्रम | Timetable of legislative sessions |
| Starred Question | तारांकित प्रश्न | Question requiring oral answer in assembly |
| Unstarred Question | अतारांकित प्रश्न | Question requiring written answer |
| Calling Attention Notice | लक्षवेधी सूचना | Notice to draw attention to urgent public matter |
| MLA Fund (MLALAD) | आमदार निधी (आमदार स्थानिक क्षेत्र विकास निधी) | Local area development fund allocated to each MLA |
| Development Fund | विकास निधी | General development fund |
| Party Worker | कार्यकर्ता | Active political party member |
| Party Organization | पक्ष संघटना | Political party structure |
| Booth Committee | बूथ समिती | Polling booth-level party committee |
| Constituency | मतदारसंघ | Electoral area of the MLA |
| Voter | मतदार | Registered voter |
| Rally | सभा / रॅली | Public political gathering |
| Campaign | प्रचार | Election campaign |
| Cadre | संघटनात्मक जाळे | Organized party worker network |

---

## 16. Formal Letter Writing Terms (Government Correspondence)

These terms are used in AI-drafted outward letters and formal templates.

### Letter Structure Terms

| English | Marathi | Usage in Letter |
|---------|---------|----------------|
| To the service of | सेवेशी | Letter opening — "सेवेशी, मा. जिल्हाधिकारी..." |
| Honorable (prefix) | माननीय (मा.) | Before names — "मा. जिल्हाधिकारी" |
| Respected | श्रीमान / श्रीमती | Formal salutation |
| Sir | महोदय | Formal address in letter body |
| Madam | महोदया | Formal address (female) |
| Subject | विषय | Letter subject line — "विषय: पाणीपुरवठा समस्या..." |
| Reference | संदर्भ | Reference to previous letter — "संदर्भ: आपले पत्र क्र..." |
| Attached | सोबत (सो.) | "सो. — तक्रार प्रत" |
| Yours faithfully | आपला विश्वासू | Letter closing |
| Please note | कळवा | "सदर बाब कृपया कळवावी" |
| Regarding | बाबत / संबंधी | "पाणीपुरवठा बाबत" |
| With respect to | संबंधात | "सदर विषयासंबंधात" |
| For your kind attention | कृपया कार्यवाही व्हावी | Request for action |
| Urgently | तातडीने | "तातडीने कार्यवाही करावी" |
| As per rules | नियमानुसार | "नियमानुसार कार्यवाही करावी" |
| Signed / True copy | सही (स.) | Certification mark |
| Copy to | प्रत — | "प्रत — मा. तहसीलदार, पुणे" |
| Enclosure | जोडपत्र | Attached documents list |

### Letter Template Placeholders

| Placeholder | Marathi Label | Description |
|-------------|-------------|-------------|
| `{mla_name}` | आमदार नाव | MLA's full name |
| `{constituency_name}` | मतदारसंघ | Constituency name |
| `{party_name}` | पक्ष नाव | Political party name |
| `{recipient_name}` | प्राप्तकर्ता नाव | Letter recipient's name |
| `{recipient_designation}` | प्राप्तकर्ता पद | Recipient's title |
| `{recipient_department}` | विभाग | Recipient's department |
| `{subject}` | विषय | Letter subject |
| `{reference_number}` | संदर्भ क्रमांक | Reference inward number |
| `{date}` | दिनांक | Letter date |
| `{body_text}` | पत्र मजकूर | Main letter body |
| `{citizen_name}` | नागरिक नाव | Complainant's name |
| `{tracking_id}` | ट्रॅकिंग आयडी | Nivedan tracking ID |

---

## 17. Common Government Schemes (Yojanas)

These are government schemes citizens frequently ask about in nivedans. Used for auto-categorization and reference.

| # | Scheme Name (English) | Scheme Name (Marathi) | Department | Category |
|:-:|----------------------|----------------------|-----------|----------|
| 1 | PM Awas Yojana | प्रधानमंत्री आवास योजना | Housing Dept | Housing |
| 2 | Ladki Bahin Yojana | लाडकी बहिण योजना | Women & Child | Social Welfare |
| 3 | Gharkul Yojana | घरकुल योजना | Rural Development | Housing |
| 4 | Mahatma Phule Jan Arogya Yojana | महात्मा फुले जन आरोग्य योजना | Health Dept | Health |
| 5 | Sanjay Gandhi Niradhar Yojana | संजय गांधी निराधार योजना | Social Welfare | Pension |
| 6 | Shravan Bal Yojana | श्रावण बाळ योजना | Social Welfare | Pension |
| 7 | Ramai Awas Yojana | रमाई आवास योजना | Social Justice | Housing |
| 8 | PM Kisan Samman Nidhi | पीएम किसान सन्मान निधी | Agriculture | Income Support |
| 9 | Jal Jeevan Mission | जल जीवन मिशन | Water Supply | Water |
| 10 | Swachh Bharat Abhiyan | स्वच्छ भारत अभियान | Sanitation | Sanitation |
| 11 | MGNREGA | मनरेगा / रोजगार हमी योजना | Rural Development | Employment |
| 12 | Atal Pension Yojana | अटल पेन्शन योजना | Finance | Pension |
| 13 | Ujjwala Yojana | उज्वला योजना | Petroleum | LPG Gas |
| 14 | Ayushman Bharat | आयुष्मान भारत | Health Dept | Health Insurance |
| 15 | Majhi Vasundhara Abhiyan | माझी वसुंधरा | Environment | Environment |

---

## 18. WhatsApp Message Terms

| English | Marathi | Usage |
|---------|---------|-------|
| Your complaint | आपली तक्रार | "आपली तक्रार क्र. NIV-2026-00001..." |
| Has been registered | नोंदवली गेली आहे | Acknowledgment message |
| Action is in progress | कार्यवाही सुरू आहे | Status update |
| Has been resolved | निकाली काढण्यात आली आहे | Resolution message |
| Currently in status | सध्या ... स्थितीत आहे | Status query reply |
| Department | विभाग | "विभाग: जिल्हाधिकारी कार्यालय" |
| Please send your Tracking ID | कृपया आपला ट्रॅकिंग आयडी पाठवा | Bot help message |
| Example | उदा. | "उदा: NIV-2026-00001" |
| Happy Birthday | वाढदिवसाच्या हार्दिक शुभेच्छा | Birthday greeting |
| Best wishes | शुभेच्छा | General greeting suffix |
| Invitation | निमंत्रण | Event invitation opening |
| Program | कार्यक्रम | "... कार्यक्रमास उपस्थित राहण्याचे निमंत्रण" |
| Date | दिनांक | Date label in messages |
| Time | वेळ | Time label in messages |
| Venue | ठिकाण / स्थळ | Location in event invites |
| From the office of | ... यांच्या कार्यालयातर्फे | Message footer — "मा. आमदार ... यांच्या कार्यालयातर्फे" |

---

## 19. UI Common Terms

| English | Marathi | Variable Name | Usage |
|---------|---------|---------------|-------|
| Search | शोधा | `search` | Search bar placeholder |
| Filter | फिल्टर | `filter` | Filter panel label |
| Sort | क्रमवारी | `sort` | Sort dropdown |
| Export | निर्यात | `export` | Export button |
| Import | आयात | `import` | Import button |
| Print | छापा / प्रिंट | `print` | Print button |
| Download | डाउनलोड | `download` | Download button |
| Upload | अपलोड | `upload` | File upload |
| Save | जतन करा | `save` | Save button |
| Cancel | रद्द करा | `cancel` | Cancel button |
| Submit | सबमिट करा / सादर करा | `submit` | Submit button |
| Edit | संपादन करा | `edit` | Edit button |
| Delete | काढून टाका | `delete` | Not used (no delete in system) |
| Archive | संग्रहित करा | `archive` | Archive button |
| View | पहा | `view` | View detail link |
| Back | मागे | `back` | Back navigation |
| Next | पुढे | `next` | Next page / step |
| Previous | मागील | `previous` | Previous page / step |
| Loading | लोड होत आहे... | `loading` | Loading indicator text |
| No data found | माहिती उपलब्ध नाही | `no_data` | Empty state message |
| Required field | आवश्यक फील्ड | `required` | Form validation |
| Select | निवडा | `select` | Dropdown placeholder |
| All | सर्व | `all` | "All" filter option |
| Today | आज | `today` | Date filter |
| This Week | या आठवड्यात | `this_week` | Date filter |
| This Month | या महिन्यात | `this_month` | Date filter |
| Date Range | तारीख श्रेणी | `date_range` | Date range picker label |
| From | पासून | `from` | Date range start |
| To | पर्यंत | `to` | Date range end |
| Total | एकूण | `total` | Summary count |
| Showing | दर्शवित | `showing` | "Showing 1-25 of 143" |
| Page | पृष्ठ | `page` | Pagination label |
| Rows per page | प्रति पृष्ठ ओळी | `rows_per_page` | Pagination setting |
| Actions | कृती | `actions` | Table actions column |
| Details | तपशील | `details` | Detail view label |
| Created by | तयार केले | `created_by` | Record creator |
| Created at | तयार दिनांक | `created_at` | Record creation date |
| Updated at | अद्ययावत दिनांक | `updated_at` | Last modified date |
| Assigned to | नेमून दिले | `assigned_to` | Assigned staff |
| Status | स्थिती | `status` | Record status |
| Active | सक्रिय | `active` | Active status |
| Inactive | निष्क्रिय | `inactive` | Inactive status |
| Yes | होय | `yes` | Boolean label |
| No | नाही | `no` | Boolean label |
| Confirm | पुष्टी करा | `confirm` | Confirmation dialog |
| Are you sure? | आपल्याला खात्री आहे? | `confirm_message` | Confirmation prompt |
| Success | यशस्वी | `success` | Toast notification |
| Error | त्रुटी | `error` | Error toast |
| Warning | चेतावणी | `warning` | Warning toast |
| Notification | सूचना | `notification` | Notification label |
| Mark as read | वाचले म्हणून चिन्हांकित करा | `mark_read` | Notification action |
| View all | सर्व पहा | `view_all` | View all link |
| Log in | लॉग इन | `login` | Login button |
| Log out | लॉग आउट | `logout` | Logout button |
| Username | वापरकर्ता नाव | `username` | Login field |
| Password | पासवर्ड / संकेतशब्द | `password` | Login field |
| Welcome | स्वागत आहे | `welcome` | Dashboard greeting |
| Profile | प्रोफाइल | `profile` | User profile |
| Settings | सेटिंग्ज | `settings` | App settings |
| Language | भाषा | `language` | Language toggle |
| Dark Mode | डार्क मोड | `dark_mode` | Theme toggle |

---

## 20. Validation Error Messages

| English | Marathi | Context |
|---------|---------|---------|
| This field is required | हे फील्ड आवश्यक आहे | Empty required field |
| Mobile number must be 10 digits | मोबाईल क्रमांक १० अंकी असावा | Invalid mobile |
| Invalid email address | अवैध ईमेल पत्ता | Invalid email |
| File size must be under 10MB | फाईल आकार १०MB पेक्षा कमी असावा | Large file upload |
| Only PDF, JPG, PNG files are allowed | फक्त PDF, JPG, PNG फाईल्स स्वीकारल्या जातात | Wrong file type |
| This mobile number already exists | हा मोबाईल क्रमांक आधीच अस्तित्वात आहे | Duplicate entry |
| Password must be at least 8 characters | पासवर्ड किमान ८ अक्षरांचा असावा | Weak password |
| Session expired. Please log in again | सत्र संपले. कृपया पुन्हा लॉग इन करा | Token expired |
| You do not have permission | आपल्याला परवानगी नाही | RBAC blocked |
| Access restricted to office hours | कार्यालयीन वेळेत प्रवेश करा (सकाळी १०:०० — संध्या. ६:००) | Time restriction |
| Account locked. Try after 15 minutes | खाते लॉक केले. १५ मिनिटांनंतर प्रयत्न करा | Login lockout |
| Invalid username or password | अवैध वापरकर्ता नाव किंवा पासवर्ड | Login failure |
| No records found | कोणतीही नोंद सापडली नाही | Empty search result |
| Something went wrong. Please try again | काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा | Server error |
| Changes saved successfully | बदल यशस्वीरित्या जतन केले | Update success |
| Record created successfully | नोंद यशस्वीरित्या तयार केली | Create success |

---

## 21. Common Abbreviations

| Abbreviation | Full Form (English) | Full Form (Marathi) |
|-------------|--------------------|--------------------|
| MLA | Member of Legislative Assembly | विधानसभा सदस्य / आमदार |
| MP | Member of Parliament | खासदार |
| PA | Personal Assistant | वैयक्तिक सहाय्यक |
| RBAC | Role-Based Access Control | भूमिका-आधारित प्रवेश नियंत्रण |
| MLALAD | MLA Local Area Development Fund | आमदार स्थानिक क्षेत्र विकास निधी |
| MPLAD | MP Local Area Development Fund | खासदार स्थानिक क्षेत्र विकास निधी |
| ZP | Zilla Parishad | जिल्हा परिषद |
| GP | Gram Panchayat | ग्रामपंचायत |
| GR | Government Resolution | शासन निर्णय |
| PWD | Public Works Department | सार्वजनिक बांधकाम विभाग |
| MSEDCL | Maharashtra State Electricity Distribution Co. Ltd. | महावितरण |
| PDS | Public Distribution System | सार्वजनिक वितरण प्रणाली |
| CSR | Corporate Social Responsibility | कॉर्पोरेट सामाजिक उत्तरदायित्व |
| MGNREGA | Mahatma Gandhi National Rural Employment Guarantee Act | मनरेगा |
| JWT | JSON Web Token | — (technical term) |
| API | Application Programming Interface | — (technical term) |
| ORM | Object-Relational Mapping | — (technical term) |
| CDN | Content Delivery Network | — (technical term) |
| IST | Indian Standard Time | भारतीय प्रमाणवेळ |
| KPI | Key Performance Indicator | मुख्य कार्यप्रदर्शन सूचक |

---

## 22. Number & Date Formatting

| Format Type | Indian Style | Example |
|------------|-------------|---------|
| Currency | ₹X,XX,XXX | ₹1,50,000 (not ₹150,000) |
| Large numbers | Indian system | 1 लाख = 1,00,000; 1 कोटी = 1,00,00,000 |
| Date | DD/MM/YYYY | 01/08/2026 |
| Date (display) | DD Month YYYY | 01 ऑगस्ट 2026 |
| Time | 12-hour with AM/PM | 10:30 AM / सकाळी 10:30 |
| Phone | +91 XXXXX XXXXX | +91 98765 43210 |

### Marathi Month Names

| English | Marathi |
|---------|---------|
| January | जानेवारी |
| February | फेब्रुवारी |
| March | मार्च |
| April | एप्रिल |
| May | मे |
| June | जून |
| July | जुलै |
| August | ऑगस्ट |
| September | सप्टेंबर |
| October | ऑक्टोबर |
| November | नोव्हेंबर |
| December | डिसेंबर |

### Marathi Day Names

| English | Marathi |
|---------|---------|
| Monday | सोमवार |
| Tuesday | मंगळवार |
| Wednesday | बुधवार |
| Thursday | गुरुवार |
| Friday | शुक्रवार |
| Saturday | शनिवार |
| Sunday | रविवार |

---
