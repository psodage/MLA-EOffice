/**
 * generate_dual_language_sample_data.cjs
 * Generates sample SQL data for both SAMPLE_DATA/ and SAMPLE_DATA/KOLHAPUR/
 * containing BOTH Marathi (MR) and English (EN) fields populated for all records!
 *
 * Run: node src/generate_dual_language_sample_data.cjs
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const OUT_DIR = path.resolve(__dirname, '../../SAMPLE_DATA/KOLHAPUR');
const ROOT_DIR = path.resolve(__dirname, '../../SAMPLE_DATA');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const clean = (s) => String(s || '').replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
const esc   = (s) => String(s || '').replace(/'/g, "''");
const now   = (offset = 0) => {
  const d = new Date('2026-01-15T09:00:00');
  d.setMinutes(d.getMinutes() + offset);
  return d.toISOString().replace('T', ' ').substring(0, 19);
};

// ── Transliteration / Translation Dictionary ─────────────────────────────────
const TRANSLITERATIONS = {
  // Users
  'आ. राजेश नाईक': 'Hon. Rajesh Naik',
  'सुनीता शिंदे': 'Sunita Shinde',
  'सुरेश कांबळे': 'Suresh Kamble',
  'मीरा पाटील': 'Meera Patil',
  'गणपत चौगले': 'Ganpat Chaugule',
  'विकास पाटील (Test Citizen)': 'Vikas Patil (Test Citizen)',
  'System Admin': 'System Admin',

  // Common Marathi -> English names
  'अजित बाळू चव्हाण': 'Ajit Balu Chavan',
  'सुमना रमेश जाधव': 'Suman Ramesh Jadhav',
  'प्रकाश विठ्ठल पाटील': 'Prakash Vithal Patil',
  'मारुती रामचंद्र पाटील': 'Maruti Ramchandra Patil',
  'रेखा विनायक माने': 'Rekha Vinayak Mane',
  'संतोष दादा पाटील': 'Santosh Dada Patil',
  'द्रौपदाबाई बाळासाहेब कदम': 'Draupadabai Balasaheb Kadam',
  'गोपाळ शंकर कांबळे': 'Gopal Shankar Kamble',
  'विशाल प्रभाकर देसाई': 'Vishal Prabhakar Desai',
  'शांताबाई युवराज माने': 'Shantabai Yuvraj Mane',
  'तानाजी बाबुराव पाटील': 'Tanaji Baburao Patil',
  'रोहन दत्ता जगताप': 'Rohan Datta Jagtap',
  'किरण संजय देशमुख': 'Kiran Sanjay Deshmukh',
  'प्रभाकर नामदेव गायकवाड': 'Prabhakar Namdeo Gaikwad',
  'उमेश बाळकृष्ण पाटोळे': 'Umesh Balakrishna Patole',
  'अभिजित अशोक चौगुले': 'Abhijit Ashok Chougule',
  'सरिता विश्वनाथ माळकर': 'Sarita Vishwanath Malkar',
  'कांचन महेश सुतार': 'Kanchan Mahesh Sutar',
  'विजय बाळासाहेब पाटील': 'Vijay Balasaheb Patil',
  'भिमराव तुकाराम कांबळे': 'Bhimrao Tukaram Kamble',

  // Addresses
  'प्लॉट क्र. ५, राजारामपुरी, कोल्हापूर': 'Plot No. 5, Rajarampuri, Kolhapur',
  'गाळा क्र. १२, अवचीतनगर, कोल्हापूर': 'Shop No. 12, Avachitnagar, Kolhapur',
  'शाहूनगर, कोल्हापूर': 'Shahunagar, Kolhapur',
  'सांगवडे, ता. करवीर, जि. कोल्हापूर': 'Sangavde, Karveer Taluka, Kolhapur',
  'नेर्ली, ता. करवीर, जि. कोल्हापूर': 'Nerli, Karveer Taluka, Kolhapur',
  'पाचगाव, ता. करवीर, जि. कोल्हापूर': 'Pachgaon, Karveer Taluka, Kolhapur',
  'राजेंद्रनगर, कोल्हापूर': 'Rajendranagar, Kolhapur',
  'वसगडे, ता. करवीर, जि. कोल्हापूर': 'Vasagade, Karveer Taluka, Kolhapur',
  'नागाव, ता. करवीर, जि. कोल्हापूर': 'Nagao, Karveer Taluka, Kolhapur',
  'नंदगाव, ता. करवीर, जि. कोल्हापूर': 'Nandgaon, Karveer Taluka, Kolhapur',
  'कावणे, ता. करवीर, जि. कोल्हापूर': 'Kavane, Karveer Taluka, Kolhapur',
  'निगवे खालसा, ता. करवीर, जि. कोल्हापूर': 'Nigave Khalsa, Karveer Taluka, Kolhapur',
  'लक्षतीर्थ वसाहत, कोल्हापूर': 'Lakshatirth Colony, Kolhapur',
  'तामगाव, ता. करवीर, जि. कोल्हापूर': 'Tamgaon, Karveer Taluka, Kolhapur',
  'खेबवडे, ता. करवीर, जि. कोल्हापूर': 'Khebavde, Karveer Taluka, Kolhapur',
  'दिंडनेर्ली, ता. करवीर, जि. कोल्हापूर': 'Dindnerli, Karveer Taluka, Kolhapur',
  'इस्पुर्ली, ता. करवीर, जि. कोल्हापूर': 'Ispurli, Karveer Taluka, Kolhapur',
  'वडकशिवाले, ता. करवीर, जि. कोल्हापूर': 'Vadakshivale, Karveer Taluka, Kolhapur',
  'चुये, ता. करवीर, जि. कोल्हापूर': 'Chuye, Karveer Taluka, Kolhapur',
  'कळंबे तर्फे ठाणे, जि. कोल्हापूर': 'Kalambe Tarf Thane, Kolhapur',
};

function getEn(text) {
  if (!text) return '';
  if (TRANSLITERATIONS[text]) return TRANSLITERATIONS[text];
  return text;
}

// ── FILE 1: 01_users.sql ──────────────────────────────────────────────────────
const users_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 01_users.sql
-- 7 System User Accounts (Supports Marathi & English)
-- ============================================================

INSERT INTO users
  (full_name, username, password_hash, role, mobile, email, accessible_modules, is_active, password_changed_at, created_at, updated_at)
VALUES
(
  'आ. राजेश नाईक',
  'mla_rajesh',
  '$2a$12$ntOn3s63UZdRBsNU4hAtjepnOMP.90bGvclDZGQSr78xgsuFbWoki',
  'MLA',
  '9700000001',
  'rajesh.naik.mla@example.com',
  '["inward","outward","nivedan","visitor","devworks","karyakarta","booth","geography","calendar","whatsapp","dashboard","reports","notifications"]',
  TRUE,
  '2026-07-01 09:00:00',
  '2026-07-01 09:00:00',
  '2026-01-10 09:00:00'
),
(
  'सुनीता शिंदे',
  'pa_sunita',
  '$2a$12$ck3o4Z50HXYS9l5UydhjhO2u7ouTKW7DkOwerjU1qDIEw.aJLtwu.',
  'PA',
  '9700000002',
  'sunita.shinde.pa@example.com',
  '["inward","outward","nivedan","visitor","devworks","karyakarta","booth","geography","calendar","whatsapp","dashboard","reports","notifications"]',
  TRUE,
  '2026-07-01 09:00:00',
  '2026-01-10 09:05:00',
  '2026-01-10 09:05:00'
),
(
  'सुरेश कांबळे',
  'clerk_suresh',
  '$2a$12$awUt/fdpIaeYFs/zHXVwa.iv4q750oQkm8tO.F7vRV8d.XJeDSFpa',
  'RECEPTIONIST',
  '9700000003',
  'suresh.kamble.clerk@example.com',
  '["visitor","nivedan","inward","dashboard","notifications"]',
  TRUE,
  '2026-07-01 09:00:00',
  '2026-01-10 09:10:00',
  '2026-01-10 09:10:00'
),
(
  'मीरा पाटील',
  'auditor_meera',
  '$2a$12$u3P7o5CTBefBRKmx9XuV1OJdc7N33C7LSjjI67wtjkEB3gpV14ZQC',
  'AUDITOR',
  '9700000004',
  'meera.patil.auditor@example.com',
  '["devworks","booth","geography","dashboard","notifications"]',
  TRUE,
  '2026-07-01 09:00:00',
  '2026-01-10 09:15:00',
  '2026-01-10 09:15:00'
),
(
  'गणपत चौगले',
  'bp_ganpat',
  '$2a$12$vGj.BfvtXjecprxSo8I8Ou2kvi132mJu5mY/3ZPnmbh2WBpAuWsV6',
  'BOOTH_PRAMUKH',
  '9700000005',
  NULL,
  '["karyakarta","booth","geography","notifications"]',
  TRUE,
  '2026-07-01 09:00:00',
  '2026-01-10 09:20:00',
  '2026-01-10 09:20:00'
),
(
  'विकास पाटील (Test Citizen)',
  'citizen_kolhapur',
  '$2a$12$S2OBpPFQNXrv0WnZnoln/e2mJFDr8we22HxdJ55dMUy7TzvoRkjDC',
  'CITIZEN',
  '9700000006',
  NULL,
  '[]',
  TRUE,
  '2026-07-01 09:00:00',
  '2026-01-10 09:25:00',
  '2026-01-10 09:25:00'
),
(
  'System Admin',
  'admin_kolhapur',
  '$2a$12$hxLyogSXdwuy07.WYfeuRuCL8QPkwezfsUG6uA6kr4xyGipyv35FC',
  'ADMIN',
  '9700000007',
  'admin.kolhapur@mlaeoffice.local',
  '["inward","outward","nivedan","visitor","devworks","karyakarta","booth","geography","calendar","whatsapp","dashboard","reports","notifications","users","settings","audit"]',
  TRUE,
  '2026-07-01 09:00:00',
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00'
);
`;

fs.writeFileSync(path.join(OUT_DIR, '01_users.sql'), users_sql);
fs.writeFileSync(path.join(ROOT_DIR, '01_users.sql'), users_sql);

// ── FILE 3: 03_nivedans.sql (Dual-Language: MR + EN) ──────────────────────────
const nivedans_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 03_nivedans.sql
-- 20 Dual-Language Petitions (Marathi + English)
-- ============================================================

INSERT INTO nivedans
  (tracking_id, citizen_name, citizen_name_en, citizen_mobile, citizen_address_line,
   citizen_city, citizen_pincode, citizen_state, citizen_dob,
   village_id, ward_id, taluka_id,
   category_id, sub_category_id,
   subject, subject_en, description, description_en,
   attachment_urls, status, priority,
   assigned_to_user_id, department_forwarded_to_id,
   resolution_notes, escalation_level, escalated_at,
   whatsapp_notified, linked_visitor_id, resolved_at,
   created_by, updated_by, created_at, updated_at)
VALUES

('KLH-NIV-2026-00001', 'प्रकाश विठ्ठल पाटील', 'Prakash Vithal Patil', '9823100001', 'प्लॉट क्र. ५, राजारामपुरी, कोल्हापूर', 'कोल्हापूर', '416008', 'Maharashtra', '1985-06-20', NULL, 1, 1, 1, NULL, 'राजारामपुरी भागात ४ दिवसांपासून पाणीपुरवठा बंद', 'Water supply disruption in Rajarampuri ward for 4 days', 'राजारामपुरी परिसरात गेल्या ४ दिवसांपासून पाण्याचा थेंबही येत नाही. नळ पूर्णपणे कोरडे आहेत.', 'Water supply disruption in Rajarampuri ward for 4 days. Taps have been dry causing hardship.', NULL, 'PENDING', 'HIGH', NULL, NULL, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-07-20 09:15:00', '2026-07-20 09:15:00'),
('KLH-NIV-2026-00002', 'सुमन रमेश जाधव', 'Suman Ramesh Jadhav', '9823100002', 'गाळा क्र. १२, अवचीतनगर, कोल्हापूर', 'कोल्हापूर', '416012', 'Maharashtra', '1992-03-10', NULL, 2, 1, 6, NULL, 'प्राथमिक आरोग्य केंद्रात डॉक्टर उपलब्ध नाहीत', 'Doctor unavailable at Primary Health Centre', 'अवचीतनगर भागातील प्राथमिक आरोग्य केंद्रात डॉक्टर नियमितपणे येत नाहीत.', 'Doctor unavailable at Primary Health Centre in Avachitnagar area.', NULL, 'PENDING', 'MEDIUM', NULL, NULL, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-07-22 10:30:00', '2026-07-22 10:30:00'),
('KLH-NIV-2026-00003', 'अजित बाळू चव्हाण', 'Ajit Balu Chavan', '9823100003', 'शाहूनगर, कोल्हापूर', 'कोल्हापूर', '416001', 'Maharashtra', '1979-11-05', NULL, 3, 1, 2, NULL, 'शाहूनगरातील अंतर्गत रस्त्यावर खड्डे', 'Potholes on internal roads in Shahunagar', 'शाहूनगर परिसरातील अंतर्गत रस्त्यांवर मोठे खड्डे पडले आहेत. डांबरीकरण करावे.', 'Potholes on internal roads in Shahunagar causing accidents. Road repair needed.', NULL, 'PENDING', 'LOW', NULL, NULL, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-07-25 11:00:00', '2026-07-25 11:00:00'),
('KLH-NIV-2026-00004', 'मारुती रामचंद्र पाटील', 'Maruti Ramchandra Patil', '9823100004', 'सांगवडे, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416209', 'Maharashtra', '1975-08-15', 1, NULL, 2, 3, NULL, 'सांगवडे गावात वारंवार वीज खंडन होते', 'Frequent power outages in Sangavde village', 'सांगवडे गावात दररोज ४-५ वेळा वीज जाते. शेतीपंपासाठी त्रास होत आहे.', 'Frequent power outages in Sangavde village. 4-5 power cuts daily.', NULL, 'IN_PROGRESS', 'HIGH', 2, 11, NULL, 'NONE', NULL, TRUE, NULL, NULL, 3, 2, '2026-07-15 08:00:00', '2026-07-18 10:00:00'),
('KLH-NIV-2026-00005', 'संतोष दादा पाटील', 'Santosh Dada Patil', '9823100005', 'नेर्ली, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416215', 'Maharashtra', '1980-04-22', 2, NULL, 2, 4, NULL, 'जमिनीचा सातबारा उतारा मिळत नाही', 'Delay in issuing 7/12 land extract document', 'नेर्ली येथील आमच्या शेतजमिनीचा सातबारा उतारा गेल्या ३ महिन्यांपासून प्रलंबित आहे.', 'Delay in issuing 7/12 land extract document for farmland in Nerli village.', NULL, 'IN_PROGRESS', 'MEDIUM', 2, 2, NULL, 'LEVEL_1', '2026-07-10 09:00:00', FALSE, NULL, NULL, 3, 2, '2026-07-10 09:00:00', '2026-07-16 12:00:00'),
('KLH-NIV-2026-00006', 'रेखा विनायक माने', 'Rekha Vinayak Mane', '9823100006', 'पाचगाव, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416210', 'Maharashtra', '1988-09-12', 3, NULL, 2, 5, NULL, 'पाचगाव जिल्हा परिषद शाळेत शिक्षक नाहीत', 'Lack of teachers in Pachgaon ZP Primary School', 'पाचगाव जि.प. शाळेत गणित व विज्ञान शिक्षक नसल्याने मुलांचे शैक्षणिक नुकसान होत आहे.', 'Lack of teachers in Pachgaon ZP Primary School for Math & Science.', NULL, 'IN_PROGRESS', 'MEDIUM', 2, 13, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 2, '2026-07-12 10:00:00', '2026-07-14 11:00:00'),
('KLH-NIV-2026-00007', 'द्रौपदाबाई बाळासाहेब कदम', 'Draupadabai Balasaheb Kadam', '9823100007', 'राजेंद्रनगर, कोल्हापूर', 'कोल्हापूर', '416008', 'Maharashtra', '1952-01-30', NULL, 4, 1, 7, NULL, 'वृद्धापकाळ निवृत्तीवेतन बंद झाले', 'Old age pension payout halted', 'गेल्या ४ महिन्यांपासून माझे वृद्धापकाळ निवृत्तीवेतन बँकेत जमा होणे बंद झाले आहे.', 'Old age pension payout halted for past 4 months causing financial distress.', NULL, 'FORWARDED', 'HIGH', 2, 15, NULL, 'LEVEL_1', '2026-07-05 09:00:00', TRUE, NULL, NULL, 3, 2, '2026-07-05 09:00:00', '2026-07-08 14:00:00'),
('KLH-NIV-2026-00008', 'गोपाळ शंकर कांबळे', 'Gopal Shankar Kamble', '9823100008', 'वसगडे, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416220', 'Maharashtra', '1970-07-18', 4, NULL, 2, 8, NULL, 'नवीन रेशनकार्डसाठी अर्ज प्रलंबित', 'Pending application for new Ration Card', 'गेल्या ६ महिन्यांपासून नवीन रेशनकार्डसाठी केलेला अर्ज तहसील कार्यालयात प्रलंबित आहे.', 'Pending application for new Ration Card at Tehsildar office for 6 months.', NULL, 'FORWARDED', 'MEDIUM', 2, 15, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 2, '2026-07-02 10:00:00', '2026-07-04 11:00:00'),
('KLH-NIV-2026-00009', 'विशाल प्रभाकर देसाई', 'Vishal Prabhakar Desai', '9823100009', 'नागाव, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416207', 'Maharashtra', '1995-12-25', 5, NULL, 2, 9, NULL, 'उत्पन्न प्रमाणपत्र मिळत नाही', 'Delay in receiving income certificate from Tehsil', 'नोकरीसाठी उत्पन्न प्रमाणपत्र आवश्यक आहे पण तहसील कार्यालयातून मिळत नाही.', 'Delay in receiving income certificate required for job application.', NULL, 'AWAITING_RESPONSE', 'LOW', 3, 2, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-06-28 09:30:00', '2026-07-01 10:00:00'),
('KLH-NIV-2026-00010', 'शांताबाई युवराज माने', 'Shantabai Yuvraj Mane', '9823100010', 'नंदगाव, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416208', 'Maharashtra', '1960-05-03', 6, NULL, 2, 10, NULL, 'प्रधानमंत्री आवास योजनेचे घर अपूर्ण', 'Incomplete construction under PMAY Housing Scheme', 'पीएम आवास योजनेतून मंजूर झालेले घर अर्धवट बांधले गेले असून पुढील हप्ता जमा करावा.', 'Incomplete construction under PMAY Housing Scheme. Requesting next instalment.', NULL, 'AWAITING_RESPONSE', 'HIGH', 2, 3, NULL, 'LEVEL_1', '2026-06-20 09:00:00', TRUE, NULL, NULL, 3, 2, '2026-06-20 09:00:00', '2026-06-25 14:00:00'),
('KLH-NIV-2026-00011', 'तानाजी बाबुराव पाटील', 'Tanaji Baburao Patil', '9823100011', 'कावणे, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416212', 'Maharashtra', '1968-02-14', 7, NULL, 2, 11, NULL, 'कृषी पंप वीज जोडणीसाठी मागणी', 'Request for agricultural pump electricity connection', 'आमच्या शेतातील कृषी पंपाला वीज जोडणी अर्ज सादर करून ६ महिने झाले.', 'Request for agricultural pump electricity connection for farm land.', NULL, 'RESOLVED', 'MEDIUM', 2, 11, 'MSEDCL ने वीज जोडणी दिली. दिनांक ०५/०७/२०२६ रोजी शेतात विद्युत जोडणी पूर्ण.', 'NONE', NULL, TRUE, NULL, '2026-07-05 11:00:00', 3, 2, '2026-06-15 09:00:00', '2026-07-05 11:00:00'),
('KLH-NIV-2026-00012', 'रोहन दत्ता जगताप', 'Rohan Datta Jagtap', '9823100012', 'निगवे खालसा, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416219', 'Maharashtra', '1997-08-08', 8, NULL, 2, 12, NULL, 'रोजगार हमी योजनेत नावनोंदणी', 'MGNREGA Job Card enrolment request', 'रोजगार हमी योजनेत नाव नोंदणीसाठी ग्रामपंचायतीत अर्ज केला.', 'MGNREGA Job Card enrolment request at Gram Panchayat office.', NULL, 'RESOLVED', 'LOW', 3, 15, 'ग्रामपंचायतीने जॉब कार्ड वितरित केले. दिनांक २०/०६/२०२६.', 'NONE', NULL, FALSE, NULL, '2026-06-20 12:00:00', 3, 3, '2026-06-10 10:00:00', '2026-06-20 12:00:00'),
('KLH-NIV-2026-00013', 'किरण संजय देशमुख', 'Kiran Sanjay Deshmukh', '9823100013', 'लक्षतीर्थ वसाहत, कोल्हापूर', 'कोल्हापूर', '416010', 'Maharashtra', '1990-04-17', NULL, 5, 1, 13, NULL, 'परिसरात उघड्यावर दारूविक्री होते', 'Illegal liquor sale in Lakshatirth settlement', 'लक्षतीर्थ वसाहतीत उघड्यावर दारूविक्री होत असल्याने महिला व मुलांना असुरक्षित वाटत आहे.', 'Illegal liquor sale in Lakshatirth settlement causing safety concerns.', NULL, 'RESOLVED', 'MEDIUM', 2, 16, 'पोलिसांनी कारवाई केली. अवैध दारू जप्त. दिनांक १५/०६/२०२६.', 'NONE', NULL, TRUE, NULL, '2026-06-15 16:00:00', 3, 2, '2026-06-10 10:00:00', '2026-06-15 16:00:00'),
('KLH-NIV-2026-00014', 'प्रभाकर नामदेव गायकवाड', 'Prabhakar Namdeo Gaikwad', '9823100014', 'तामगाव, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416217', 'Maharashtra', '1972-10-20', 9, NULL, 2, 14, NULL, 'गावातील सामुदायिक शौचालय बंद', 'Repair request for public community toilet in Tamgaon', 'तामगाव येथील सामुदायिक शौचालय गेल्या ३ महिन्यांपासून बंद आहे. दुरुस्ती करावी.', 'Repair request for public community toilet in Tamgaon village.', NULL, 'RESOLVED', 'HIGH', 2, 4, 'ग्रामपंचायतीने शौचालय दुरुस्त केले. दिनांक ०१/०७/२०२६.', 'LEVEL_1', '2026-06-10 09:00:00', TRUE, NULL, '2026-07-01 14:00:00', 3, 2, '2026-06-08 09:00:00', '2026-07-01 14:00:00'),
('KLH-NIV-2026-00015', 'उमेश बाळकृष्ण पाटोळे', 'Umesh Balakrishna Patole', '9823100015', 'खेबवडे, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416218', 'Maharashtra', '1983-07-14', 10, NULL, 2, 1, NULL, 'खाजगी विहीर सरकारी जमिनीवर आहे असे सांगतात', 'Dispute over private water well land ownership notice', 'माझी खाजगी विहीर सरकारी जमिनीवर आहे असे म्हणून बुजवण्याची नोटीस आली आहे.', 'Dispute over private water well land ownership notice from Gram Panchayat.', NULL, 'REJECTED', 'MEDIUM', 2, 2, 'भूमी अभिलेख विभागाने सर्व्हे केल्यावर खाजगी जमिनीवरच विहीर असल्याचे निश्चित झाले.', 'NONE', NULL, TRUE, NULL, NULL, 3, 2, '2026-06-01 10:00:00', '2026-06-15 12:00:00'),
('KLH-NIV-2026-00016', 'अभिजित अशोक चौगुले', 'Abhijit Ashok Chougule', '9823100016', 'दिंडनेर्ली, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416214', 'Maharashtra', '1993-11-22', 11, NULL, 2, 2, NULL, 'रस्त्याच्या दुतर्फा झाडे लावण्याची मागणी', 'Roadside tree plantation drive request', 'दिंडनेर्ली-कोल्हापूर रस्त्याच्या दुतर्फा सावलीसाठी झाडे लावावीत अशी मागणी आहे.', 'Roadside tree plantation drive request along Dindnerli to Kolhapur road.', NULL, 'REJECTED', 'LOW', 3, 9, 'वन विभागाने सांगितले की या रस्त्यावर आधीच वृक्षारोपण योजना सुरू आहे.', 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-05-28 11:00:00', '2026-06-02 10:00:00'),
('KLH-NIV-2026-00017', 'सरिता विश्वनाथ माळकर', 'Sarita Vishwanath Malkar', '9823100017', 'इस्पुर्ली, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416216', 'Maharashtra', '1965-03-08', 12, NULL, 2, 6, NULL, 'रुग्णवाहिका सेवा वेळेवर मिळत नाही', 'Ambulance service delay in Ispurli village', 'इस्पुर्ली परिसरात रुग्णवाहिका बोलावल्यास येण्यास खूप वेळ लागतो.', 'Ambulance service delay in Ispurli village during medical emergencies.', NULL, 'CANCELLED', 'HIGH', 2, 14, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 2, '2026-05-20 09:00:00', '2026-05-25 11:00:00'),
('KLH-NIV-2026-00018', 'कांचन महेश सुतार', 'Kanchan Mahesh Sutar', '9823100018', 'वडकशिवाले, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416213', 'Maharashtra', '1988-01-30', 13, NULL, 2, 5, NULL, 'शाळेत संगणक प्रयोगशाळा उभारण्याची मागणी', 'Digital Computer Lab setup request in school', 'वडकशिवाले जि.प. शाळेत संगणक प्रयोगशाळा उभारण्यासाठी निधी मिळावा.', 'Digital Computer Lab setup request in Vadakshivale ZP school.', NULL, 'CANCELLED', 'MEDIUM', 3, 13, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-05-15 10:00:00', '2026-05-22 12:00:00'),
('KLH-NIV-2026-00019', 'विजय बाळासाहेब पाटील', 'Vijay Balasaheb Patil', '9823100019', 'चुये, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416211', 'Maharashtra', '1962-09-16', 14, NULL, 2, 4, NULL, 'जुन्या शेतजमिनीच्या नोंदींत दुरुस्ती', 'Correction in ancestral land 7/12 record name', 'आमच्या वडिलोपार्जित शेताच्या ७/१२ उताऱ्यात चुकीचे नाव आहे.', 'Correction in ancestral land 7/12 record name at Talathi office.', NULL, 'ARCHIVED', 'HIGH', 2, 2, 'जुन्या नोंदी सापडल्या नाहीत. न्यायालयात दाद मागण्याचा सल्ला दिला.', 'LEVEL_2', '2026-03-01 09:00:00', TRUE, NULL, NULL, 3, 2, '2026-01-15 09:00:00', '2026-05-01 12:00:00'),
('KLH-NIV-2026-00020', 'भिमराव तुकाराम कांबळे', 'Bhimrao Tukaram Kamble', '9823100020', 'कळंबे तर्फे ठाणे, जि. कोल्हापूर', 'कोल्हापूर', '416201', 'Maharashtra', '1955-12-05', 15, NULL, 2, 10, NULL, 'इंदिरा आवास योजनेचे घर मिळाले नाही', 'Inquiry regarding Indira Awas Housing Scheme allocation', 'जुन्या इंदिरा आवास योजनेत नाव होते पण घर मिळाले नाही.', 'Inquiry regarding Indira Awas Housing Scheme allocation at BDO office.', NULL, 'ARCHIVED', 'LOW', 3, 3, 'जुनी योजना बंद झाली. PMAY अंतर्गत नव्याने अर्ज करण्यास सांगितले.', 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-01-20 10:00:00', '2026-04-15 12:00:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '03_nivedans.sql'), nivedans_sql);
fs.writeFileSync(path.join(ROOT_DIR, '03_nivedans.sql'), nivedans_sql);

// ── FILE 6: 06_visitors.sql (Dual-Language: MR + EN) ─────────────────────────
const visitors_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 06_visitors.sql
-- 50 Dual-Language Visitor Log Entries (Marathi + English)
-- ============================================================

INSERT INTO visitors
  (visitor_name, visitor_name_en, mobile, address_line, village_id, ward_id,
   purpose, purpose_description, purpose_description_en, check_in_time, check_out_time,
   linked_nivedan_id, created_by, created_at)
VALUES

('प्रकाश विठ्ठल पाटील', 'Prakash Vithal Patil', '9823100001', 'राजारामपुरी, कोल्हापूर', NULL, 1, 'GRIEVANCE', 'पाणीपुरवठा खंडित झाल्याबाबत निवेदन दिले.', 'Water supply disruption grievance petition submitted.', '2026-07-20 09:00:00', '2026-07-20 09:30:00', 1, 3, '2026-07-20 09:00:00'),
('सुमन रमेश जाधव', 'Suman Ramesh Jadhav', '9823100002', 'अवचीतनगर, कोल्हापूर', NULL, 2, 'GRIEVANCE', 'प्राथमिक आरोग्य केंद्र समस्या मांडली.', 'Primary Health Centre doctor availability issue raised.', '2026-07-22 10:15:00', '2026-07-22 10:45:00', 2, 3, '2026-07-22 10:15:00'),
('अजित बाळू चव्हाण', 'Ajit Balu Chavan', '9823100003', 'शाहूनगर, कोल्हापूर', NULL, 3, 'GRIEVANCE', 'रस्त्यावरील खड्ड्यांबाबत आमदारांची भेट घेतली.', 'Met MLA regarding internal road potholes in Shahunagar.', '2026-07-25 10:45:00', '2026-07-25 11:20:00', 3, 3, '2026-07-25 10:45:00'),
('मारुती रामचंद्र पाटील', 'Maruti Ramchandra Patil', '9823100004', 'सांगवडे, करवीर', 1, NULL, 'PERSONAL_MEETING', 'वीज खंडन समस्येबाबत आमदारांना निवेदन सुपूर्द केले.', 'Handed over petition to MLA regarding electricity cuts in Sangavde.', '2026-07-15 07:45:00', '2026-07-15 08:30:00', 4, 3, '2026-07-15 07:45:00'),
('संतोष दादा पाटील', 'Santosh Dada Patil', '9823100005', 'नेर्ली, करवीर', 2, NULL, 'FOLLOWUP', '७/१२ उतारा मिळावा म्हणून पाठपुरावा केला.', 'Followed up on pending 7/12 land extract issuance.', '2026-07-10 08:45:00', '2026-07-10 09:20:00', 5, 3, '2026-07-10 08:45:00'),
('गीता बाळकृष्ण माळकर', 'Geeta Balakrishna Malkar', '9823100017', 'इस्पुर्ली, करवीर', 12, NULL, 'GENERAL_INQUIRY', 'सामान्य चौकशी व आमदारांची सदिच्छा भेट.', 'General Inquiry & courtesy visit to meet MLA.', '2026-07-26 11:00:00', '2026-07-26 11:30:00', NULL, 3, '2026-07-26 11:00:00'),
('विनोद रामचंद्र शेळके', 'Vinod Ramchandra Shelke', '9823100021', 'वडगाव, करवीर', 1, NULL, 'RECOMMENDATION', 'वडगाव गावात नवीन समाजमंदिर बांधण्याबाबत मागणी.', 'Development work request for new community hall in Wadgaon.', '2026-07-27 10:00:00', '2026-07-27 10:40:00', NULL, 3, '2026-07-27 10:00:00'),
('प्रमोद गजानन जोशी', 'Pramod Gajanan Joshi', '9823100022', 'राजारामपुरी, कोल्हापूर', NULL, 1, 'INVITATION', 'वार्षिक गणेशोत्सव कार्यक्रमाचे निमंत्रण पत्र सुपूर्द केले.', 'Handed over invitation letter for annual Ganeshotsav event.', '2026-07-28 14:00:00', '2026-07-28 14:25:00', NULL, 3, '2026-07-28 14:00:00'),
('सुरेश गणपत पवार', 'Suresh Ganpat Pawar', '9823100023', 'उचगाव, करवीर', 3, NULL, 'COURTESY_CALL', 'शाळा दुरुस्ती निधी मंजूर झाल्याबद्दल आमदारांचे आभार मानले.', 'Courtesy visit to thank MLA for sanctioning school repair funds.', '2026-07-29 09:30:00', '2026-07-29 10:00:00', NULL, 3, '2026-07-29 09:30:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '06_visitors.sql'), visitors_sql);
fs.writeFileSync(path.join(ROOT_DIR, '06_visitors.sql'), visitors_sql);

// ── FILE 5: 05_development_works.sql (Dual-Language: MR + EN) ────────────────
const devworks_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 05_development_works.sql
-- 10 Dual-Language Projects (Marathi + English)
-- ============================================================

INSERT INTO development_works
  (project_name, work_title_en, category, location, village_id, ward_id, taluka_id,
   geo_latitude, geo_longitude,
   funding_source, budget_allocated, budget_spent,
   contractor_name, contractor_contact,
   start_date, expected_completion_date, actual_completion_date,
   status, progress_percentage, description, description_en,
   created_by, updated_by, created_at, updated_at)
VALUES

('राजारामपुरी अंतर्गत रस्ता — डांबरीकरण', 'Rajarampuri Internal Road — Asphalt Paving', 'ROAD', 'राजारामपुरी, कोल्हापूर शहर, वार्ड क्र. ८', NULL, 1, 1, 16.7050, 74.2433, 'MLALAD', 2200000.00, 0.00, NULL, NULL, '2026-09-01', '2026-11-30', NULL, 'SANCTIONED', 0, 'MLALAD निधीतून राजारामपुरी भागातील अंतर्गत रस्त्याचे डांबरीकरण.', 'Asphalt paving of internal roads in Rajarampuri ward under MLALAD funds.', 1, 2, '2026-06-15 10:00:00', '2026-07-20 11:00:00'),
('सांगवडे ग्रामपंचायत — बहुउद्देशीय सभागृह', 'Sangavde Village Multipurpose Hall Construction', 'COMMUNITY_HALL', 'सांगवडे गाव, करवीर तालुका', 1, NULL, 2, 16.6520, 74.2100, 'STATE_GRANT', 4000000.00, 0.00, NULL, NULL, '2026-10-01', '2027-03-31', NULL, 'SANCTIONED', 0, 'राज्य शासन अनुदानातून सांगवडे येथे बहुउद्देशीय सभागृह बांधकाम.', 'Construction of multipurpose community hall in Sangavde village under State Grant.', 1, 2, '2026-07-01 10:00:00', '2026-07-25 11:00:00'),
('नेर्ली गाव — पिण्याच्या पाण्याची नळ योजना विस्तार', 'Nerli Village Water Pipeline Extension', 'WATER_PIPELINE', 'नेर्ली गाव, करवीर तालुका, कोल्हापूर', 2, NULL, 2, 16.6380, 74.1950, 'ZP_FUND', 3200000.00, 1800000.00, 'श्री. संपत कन्स्ट्रक्शन, कोल्हापूर', '9823456789', '2026-04-01', '2026-08-31', NULL, 'IN_PROGRESS', 55, 'नेर्ली गावातील जुनी नळ योजना विस्तारित करून नवीन वस्त्यांना पाणी पुरवठा.', 'Extension of drinking water supply pipeline to new settlements in Nerli village.', 1, 2, '2026-03-15 10:00:00', '2026-07-20 14:00:00'),
('पाचगाव जि.प. शाळा — नवीन वर्गखोल्या बांधकाम', 'Pachgaon ZP School New Classrooms Construction', 'SCHOOL', 'पाचगाव, करवीर तालुका, कोल्हापूर', 3, NULL, 2, 16.6720, 74.2050, 'CENTRAL_GRANT', 2800000.00, 1200000.00, 'महाराष्ट्र बांधकाम कॉर्पोरेशन', '9876500001', '2026-03-15', '2026-09-30', NULL, 'IN_PROGRESS', 42, 'केंद्र शासनाच्या समग्र शिक्षा अभियानांतर्गत पाचगाव जि.प. शाळेत ४ नवीन वर्गखोल्या बांधणे.', 'Construction of 4 new classrooms at Pachgaon ZP School under Samagra Shiksha Abhiyan.', 1, 4, '2026-02-20 10:00:00', '2026-07-18 11:00:00'),
('शाहूनगर — सौर पथदिवे बसवणे', 'Shahunagar Solar Street Light Installation', 'STREET_LIGHT', 'शाहूनगर, कोल्हापूर शहर', NULL, 3, 1, 16.7100, 74.2380, 'MLALAD', 1500000.00, 900000.00, 'सनराईझ सोलर, कोल्हापूर', '9765432100', '2026-05-01', '2026-07-31', NULL, 'IN_PROGRESS', 60, 'शाहूनगर परिसरात ५० सौर पथदिवे बसवणे.', 'Installation of 50 solar street lights in Shahunagar colony area under MLALAD funds.', 1, 2, '2026-04-10 09:00:00', '2026-07-22 10:00:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '05_development_works.sql'), devworks_sql);
fs.writeFileSync(path.join(ROOT_DIR, '05_development_works.sql'), devworks_sql);

// ── FILE 8: 08_calendar_events.sql (Dual-Language: MR + EN) ───────────────────
const calendar_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 08_calendar_events.sql
-- 5 Dual-Language Events (Marathi + English)
-- ============================================================

INSERT INTO calendar_events
  (title, title_en, description, description_en, event_type, event_date, start_time, end_time,
   location, attendees, is_recurring, recurrence_rule, reminder_minutes,
   is_cancelled, created_by, created_at, updated_at)
VALUES

('राधानगरी धरण पाहणी दौरा', 'Radhanagari Dam Inspection Tour', 'पाणी वाटप आणि जलसाठा आढाव्यासाठी राधानगरी धरण भेट. जलसंपदा विभागाचे अधिकारी सोबत.', 'Radhanagari Dam visit for water distribution and storage audit with Water Resources Dept officials.', 'CONSTITUENCY_VISIT', '2026-08-10', '08:00:00', '13:00:00', 'राधानगरी धरण, कोल्हापूर', NULL, FALSE, NULL, 60, FALSE, 1, '2026-07-25 10:00:00', '2026-07-25 10:00:00'),
('करवीर तालुका कार्यकर्ता मेळावा', 'Karveer Taluka Karyakarta Convention', 'करवीर तालुक्यातील बूथ प्रमुख, शक्तीकेंद्र प्रमुख आणि कार्यकर्त्यांचा मासिक मेळावा.', 'Monthly convention of booth pramukhs and party workers in Karveer taluka.', 'PUBLIC_PROGRAM', '2026-08-15', '14:00:00', '17:00:00', 'करवीर पंचायत समिती सभागृह, कोल्हापूर', NULL, FALSE, NULL, 60, FALSE, 1, '2026-07-28 11:00:00', '2026-07-28 11:00:00'),
('जिल्हा नियोजन समिती बैठक', 'District Planning Committee Meeting', '२०२६-२७ वार्षिक योजना आराखड्यावर जिल्हा नियोजन समिती बैठक. कोल्हापूर दक्षिण मतदारसंघाचे प्रस्ताव सादर करायचे आहेत.', 'District Planning Committee meeting on 2026-27 annual plan. Proposals for Kolhapur South constituency to be submitted.', 'MEETING', '2026-08-20', '10:00:00', '13:00:00', 'जिल्हाधिकारी कार्यालय, कोल्हापूर', NULL, FALSE, NULL, 120, FALSE, 2, '2026-07-30 09:00:00', '2026-07-30 09:00:00'),
('लक्षतीर्थ वसाहत — जनसंपर्क दिवस', 'Lakshatirth Colony — Public Outreach Day', 'लक्षतीर्थ वसाहत परिसरात जनसंपर्क कार्यक्रम. नागरिकांच्या तक्रारी ऐकणे व मदत करणे.', 'Public outreach program in Lakshatirth Colony area. Listening to citizen grievances and assisting.', 'PUBLIC_PROGRAM', '2026-08-25', '09:00:00', '12:00:00', 'लक्षतीर्थ वसाहत सामुदायिक सभागृह, कोल्हापूर', NULL, FALSE, NULL, 30, FALSE, 1, '2026-08-01 10:00:00', '2026-08-01 10:00:00'),
('स्वातंत्र्य दिन ध्वजारोहण कार्यक्रम', 'Independence Day Flag Hoisting Ceremony', '१५ ऑगस्ट स्वातंत्र्य दिन निमित्त ध्वजारोहण व सांस्कृतिक कार्यक्रम. शाळा विद्यार्थी व नागरिकांचा सहभाग.', 'Flag hoisting and cultural program on 15th August Independence Day. Participation of school students and citizens.', 'PUBLIC_PROGRAM', '2026-08-15', '07:30:00', '09:30:00', 'शाहूनगर मैदान, कोल्हापूर', NULL, FALSE, NULL, 30, FALSE, 2, '2026-08-01 11:00:00', '2026-08-01 11:00:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '08_calendar_events.sql'), calendar_sql);
fs.writeFileSync(path.join(ROOT_DIR, '08_calendar_events.sql'), calendar_sql);

// ── FILE 9: 09_outward_entries.sql (Dual-Language: MR + EN) ───────────────────
const outward_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 09_outward_entries.sql
-- 15 Dual-Language Outward Letters (Marathi + English)
-- ============================================================

INSERT INTO outward_entries
  (outward_number, date_sent, recipient_name, recipient_name_en, recipient_designation,
   recipient_department_id, subject, subject_en, body_text, body_text_en, letter_pdf_url,
   reference_inward_id, is_ai_drafted, attachment_urls,
   approved_by, created_by, created_at, updated_at)
VALUES

('KLH/OUT/2026/0001', '2026-07-16', 'कार्यकारी अभियंता, महावितरण', 'Executive Engineer, MSEDCL', 'कार्यकारी अभियंता', 11, 'सांगवडे गावातील वीज खंडन समस्येबाबत तातडीने उपाययोजना करणेबाबत.', 'Urgent measures for power supply restoration in Sangavde village.', 'महोदय, कोल्हापूर दक्षिण मतदारसंघातील सांगवडे गावातील ग्रामस्थांनी सादर केलेल्या निवेदनानुसार गावात वारंवार वीज पुरवठा खंडित होत आहे. तरी तातडीने योग्य ती दुरुस्ती करून नियमित वीज पुरवठा सुरू करावा.', 'Sir, as per petition received from residents of Sangavde village in Kolhapur South constituency, power outages are frequent. Kindly carry out immediate repairs and ensure continuous electricity.', NULL, 4, 1, NULL, 1, 2, '2026-07-16 10:30:00', '2026-07-16 10:30:00'),
('KLH/OUT/2026/0002', '2026-07-17', 'तहसीलदार, करवीर', 'Tehsildar, Karveer', 'तहसीलदार', 2, 'नेर्ली येथील शेतजमिनीचे ७/१२ उतारे वेळेवर मिळणेबाबत.', 'Timely issuance of 7/12 land extracts in Nerli.', 'महोदय, नेर्ली गावातील शेतकरी श्री. संतोष दादा पाटील यांनी सादर केलेल्या निवेदनानुसार जमिनीचा सातबारा उतारा मिळण्यास विलंब होत आहे. त्वरित कारवाई करून ७/१२ उतारा देण्यात यावा.', 'Sir, as per representation by farmer Mr. Santosh Dada Patil of Nerli village, 7/12 land extract issuance is delayed. Kindly expedite and issue the land document.', NULL, 5, 1, NULL, 1, 2, '2026-07-17 11:00:00', '2026-07-17 11:00:00'),
('KLH/OUT/2026/0003', '2026-07-18', 'शिक्षणाधिकारी (प्राथमिक), जि.प. कोल्हापूर', 'Education Officer (Primary), ZP Kolhapur', 'शिक्षणाधिकारी', 13, 'पाचगाव जिल्हा परिषद शाळेत शिक्षकांची नियुक्ती करणेबाबत.', 'Appointment of teachers in Pachgaon ZP Primary School.', 'महोदय, पाचगाव जि.प. शाळेत वर्ग ५ ते ७ साठी शिक्षक उपलब्ध नसल्यामुळे विद्यार्थ्यांचे शैक्षणिक नुकसान होत आहे. तात्पुरत्या किंवा कायमस्वरूपी शिक्षकांची नियुक्ती करावी.', 'Sir, absence of teachers for classes 5 to 7 at Pachgaon ZP School is hampering education. Kindly appoint permanent or temporary teachers immediately.', NULL, 6, 0, NULL, 1, 2, '2026-07-18 14:00:00', '2026-07-18 14:00:00'),
('KLH/OUT/2026/0004', '2026-07-19', 'जिल्हा समाजकल्याण अधिकारी, कोल्हापूर', 'District Social Welfare Officer, Kolhapur', 'जिल्हा समाजकल्याण अधिकारी', 15, 'वृद्धापकाळ निवृत्तीवेतन थकबाकी जमा करणेबाबत.', 'Disbursement of senior citizen pension arrears.', 'महोदय, राजेंद्रनगर येथील श्रीमती द्रौपदाबाई कदम यांचे मागील ४ महिन्यांचे वृद्धापकाळ निवृत्तीवेतन खात्यात जमा झाले नाही. कृपया सदर रक्कम तात्काळ मंजूर करून वितरित करावी.', 'Sir, senior citizen pension for Mrs. Draupadabai Kadam of Rajendranagar has been delayed for 4 months. Kindly sanction and credit the pension arrears.', NULL, 7, 1, NULL, 1, 2, '2026-07-19 09:30:00', '2026-07-19 09:30:00'),
('KLH/OUT/2026/0005', '2026-07-20', 'जिल्हा पुरवठा अधिकारी, कोल्हापूर', 'District Supply Officer, Kolhapur', 'जिल्हा पुरवठा अधिकारी', 8, 'वसगडे येथील नागरिकांचे नवीन रेशनकार्ड मंजूर करणेबाबत.', 'Approval of new ration cards for citizens in Vasagade.', 'महोदय, वसगडे येथील श्री. गोपाळ शंकर कांबळे यांचा रेशनकार्ड अर्ज प्रलंबित आहे. कुटुंबास धान्याचा लाभ मिळण्यासाठी तातडीने रेशनकार्ड वितरीत करावे.', 'Sir, ration card application of Mr. Gopal Shankar Kamble of Vasagade is pending. Kindly issue ration card so the family gets subsidized food grains.', NULL, 8, 0, NULL, 1, 2, '2026-07-20 10:00:00', '2026-07-20 10:00:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '09_outward_entries.sql'), outward_sql);
fs.writeFileSync(path.join(ROOT_DIR, '09_outward_entries.sql'), outward_sql);

console.log('🎉 Dual-Language Sample SQL Files (Marathi + English) Generated Successfully!');
