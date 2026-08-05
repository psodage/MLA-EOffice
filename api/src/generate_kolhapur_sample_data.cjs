/**
 * generate_kolhapur_sample_data.js
 * Generates all SAMPLE_DATA SQL files for Kolhapur Division
 * Uses data from: docs/New Booth Pramukh Yadi.xlsx
 *
 * Run: node src/generate_kolhapur_sample_data.js
 */

const XLSX = require('xlsx');
const fs   = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '../../SAMPLE_DATA/KOLHAPUR');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── helpers ──────────────────────────────────────────────────────────────────
const clean = (s) => String(s || '').replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
const cleanMobile = (s) => String(s || '').replace(/\D/g, '').substring(0, 10);
const esc  = (s) => String(s || '').replace(/'/g, "''");
const now  = (offset = 0) => {
  const d = new Date('2026-01-15T09:00:00');
  d.setMinutes(d.getMinutes() + offset);
  return d.toISOString().replace('T', ' ').substring(0, 19);
};

// ── Load Excel ────────────────────────────────────────────────────────────────
const wb = XLSX.readFile(path.resolve(__dirname, '../../docs/New Booth Pramukh Yadi.xlsx'));

// --- Parse SHAHAR sheet (urban booths 1-186) ----------------------------------
const shaharWs   = wb.Sheets['shahar'];
const shaharRows = XLSX.utils.sheet_to_json(shaharWs, { header: 1, defval: '' });

// --- Parse GRAMIN sheet (rural booths 187-354) --------------------------------
const graminWs   = wb.Sheets['Gramin'];
const graminRows = XLSX.utils.sheet_to_json(graminWs, { header: 1, defval: '' });

// Build booth lists
// Shahar columns: [boothNo, wardName, totalVoters, shaktiKendra, boothPramukh, mobile]
const shaharBooths = shaharRows
  .slice(4)
  .filter(r => r[0] && typeof r[0] === 'number')
  .map(r => ({
    booth_no:      r[0],
    ward_name:     clean(r[1]),
    total_voters:  r[2] || 0,
    shakti_kendra: clean(r[3]),
    pramukh_name:  clean(r[4]),
    mobile:        cleanMobile(r[5]),
    type:          'URBAN',
  }));

// Gramin columns: [srNo, villageName, boothPramukhName, mobile, newBoothNo, totalVoters, shaktiKendra, warriors]
const graminBooths = graminRows
  .slice(4)
  .filter(r => r[0] && typeof r[0] === 'number')
  .map(r => ({
    booth_no:      r[4] || 0,
    village_name:  clean(r[1]),
    pramukh_name:  clean(r[2]),
    mobile:        cleanMobile(r[3]),
    total_voters:  r[5] || 0,
    shakti_kendra: clean(r[6]),
    warriors:      clean(r[7]),
    type:          'RURAL',
  }));

console.log(`✅ Shahar booths: ${shaharBooths.length}`);
console.log(`✅ Gramin booths: ${graminBooths.length}`);

// ── Get unique areas for geography ────────────────────────────────────────────
const urbanWards    = [...new Set(shaharBooths.map(b => b.ward_name))].filter(Boolean);
const ruralVillages = [...new Set(graminBooths.map(b => b.village_name))].filter(Boolean);

console.log(`  Urban wards: ${urbanWards.length}`);
console.log(`  Rural villages: ${ruralVillages.length}`);

// ── FILE 1: 01_users.sql ──────────────────────────────────────────────────────
const users_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 01_users.sql
-- 7 System User Accounts (all 7 roles covered)
-- Fictional constituency: Kolhapur South (Kolhapur District)
--
-- ⚠️  Passwords are bcrypt hashes (12 salt rounds)
--     Plain-text → bcrypt hash mapping:
--       Mla@2026#Kolhapur  → hash below (mla_rajesh)
--       Pa@2026#Kolhapur   → hash below (pa_sunita)
--       Clerk@2026#Kolh    → hash below (clerk_suresh)
--       Audit@2026#Kolh    → hash below (auditor_meera)
--       Booth@2026#Kolh    → hash below (bp_ganpat)
--       Citizen@2026       → same as Pune set
--       Admin@MLA2026      → same as Pune set
-- ============================================================

-- Clear existing (dev only)
-- TRUNCATE TABLE users;  -- Uncomment only if safe to wipe

INSERT INTO users
  (full_name, username, password_hash, role, mobile, email, accessible_modules, is_active, password_changed_at, created_at, updated_at)
VALUES

-- 1. MLA — Full access (Kolhapur South)
(
  'आ. राजेश नाईक',
  'mla_rajesh',
  '$2a$12$mprpqKSuufy9Ovt5P57w6Oc9N14VB16tB5Sc3dxW1mdX4AnivVQEi',
  'MLA',
  '9700000001',
  'rajesh.naik.mla@example.com',
  '["inward","outward","nivedan","visitor","devworks","karyakarta","booth","geography","calendar","whatsapp","dashboard","reports","notifications","users"]',
  TRUE,
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00'
),

-- 2. PA (Personal Assistant)
(
  'सुनीता शिंदे',
  'pa_sunita',
  '$2a$12$kJHiroLqLAYN5/iLT1qvSuPmRe7mbIsBz9HUnt5v1rIISzygK91Re',
  'PA',
  '9700000002',
  'sunita.shinde.pa@example.com',
  '["inward","outward","nivedan","visitor","devworks","karyakarta","booth","geography","calendar","whatsapp","dashboard","reports","notifications"]',
  TRUE,
  '2026-01-10 09:05:00',
  '2026-01-10 09:05:00',
  '2026-01-10 09:05:00'
),

-- 3. Receptionist / Front Desk Clerk
(
  'सुरेश कांबळे',
  'clerk_suresh',
  '$2a$12$RBAxDdSfHoDY/Yvfx//Rv.iR6f4bBobdmZG6ZlngYH2ZzsbKhgZTS',
  'RECEPTIONIST',
  '9700000003',
  'suresh.kamble.clerk@example.com',
  '["visitor","nivedan","inward","dashboard","notifications"]',
  TRUE,
  '2026-01-10 09:10:00',
  '2026-01-10 09:10:00',
  '2026-01-10 09:10:00'
),

-- 4. Field Auditor / Assessor
(
  'मीरा पाटील',
  'auditor_meera',
  '$2a$12$dGUgFfZ/UhndwFcIAIpS4OUxkkgO36/nPEFVxu49MfLywZ561yzca',
  'AUDITOR',
  '9700000004',
  'meera.patil.auditor@example.com',
  '["devworks","booth","geography","dashboard","notifications"]',
  TRUE,
  '2026-01-10 09:15:00',
  '2026-01-10 09:15:00',
  '2026-01-10 09:15:00'
),

-- 5. Booth Pramukh — Ground-level (from actual Excel data)
(
  'गणपत चौगले',
  'bp_ganpat',
  '$2a$12$mrc3QWXFnJ04Y90qvWqrO.9GNlQXv/IAlh5ek1h3rgwxwTBeWQAdq',
  'BOOTH_PRAMUKH',
  '9700000005',
  NULL,
  '["karyakarta","booth","geography","notifications"]',
  TRUE,
  '2026-01-10 09:20:00',
  '2026-01-10 09:20:00',
  '2026-01-10 09:20:00'
),

-- 6. Citizen — Public tracking portal only
(
  'विकास पाटील (Test Citizen)',
  'citizen_kolhapur',
  '$2a$12$Q3m2relpGhQrte6Bl0DGoeDckzAcGc01BiyvFpUxoQvYqMQacJoDG',
  'CITIZEN',
  '9700000006',
  NULL,
  '[]',
  TRUE,
  '2026-01-10 09:25:00',
  '2026-01-10 09:25:00',
  '2026-01-10 09:25:00'
),

-- 7. System Administrator (shared)
(
  'System Admin',
  'admin_kolhapur',
  '$2a$12$g8MCfkuzOcNbB2foJ0iXYe/R2nt7pjFAYWkeUZZpkLVvutcmIOnUi',
  'ADMIN',
  '9700000007',
  'admin.kolhapur@mlaeoffice.local',
  '["inward","outward","nivedan","visitor","devworks","karyakarta","booth","geography","calendar","whatsapp","dashboard","reports","notifications","users","settings","audit"]',
  TRUE,
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00'
);
`;

fs.writeFileSync(path.join(OUT_DIR, '01_users.sql'), users_sql);
console.log('✅ Written: 01_users.sql');

// ── FILE 2: 07_karyakartas.sql (booth pramukhs from Excel) ───────────────────
// Build karyakarta rows from both sheets
// We'll assign sequential IDs and use ward_id/village_id references
// Urban: ward_id based on urbanWards index, village_id = NULL
// Rural: village_id based on ruralVillages index, ward_id = NULL
// booth_id uses booth_no directly as sequential reference
// created_by = 2 (PA user, id=2 in this dataset)

let karyaRows = [];
let offset = 0;

// --- Urban booths (shahar) ---
const urbanWardMap = {};
urbanWards.forEach((w, i) => { urbanWardMap[w] = i + 1; });

for (const b of shaharBooths) {
  const wardIdx  = urbanWardMap[b.ward_name] || 1;
  const mobile   = b.mobile || '9000000000';
  const pramukhName = b.pramukh_name || 'अज्ञात';
  const addr     = `${b.ward_name}, कोल्हापूर शहर`;

  // Generate a fake DOB (range 1975–1995)
  const year = 1975 + (b.booth_no % 20);
  const month = String((b.booth_no % 12) + 1).padStart(2, '0');
  const day   = String((b.booth_no % 28) + 1).padStart(2, '0');
  const dob   = `${year}-${month}-${day}`;

  karyaRows.push({
    full_name:   pramukhName,
    mobile:      mobile,
    alt_mobile:  'NULL',
    dob:         dob,
    address:     addr,
    village_id:  'NULL',
    ward_id:     wardIdx,
    gp_id:       'NULL',
    taluka_id:   1,  // Kolhapur City taluka
    booth_id:    b.booth_no,
    designation: 'BOOTH_PRAMUKH',
    is_active:   'TRUE',
    joined_date: '2024-01-15',
    created_at:  now(offset++),
  });

  // Add shakti kendra pramukh as SHAKTI_KENDRA if present
  if (b.shakti_kendra) {
    const skName = b.shakti_kendra.split(/[\r\n]/)[0].replace(/\d{10}.*/, '').trim();
    if (skName.length > 3) {
      const year2 = 1970 + (b.booth_no % 25);
      karyaRows.push({
        full_name:   skName,
        mobile:      '9000000000',
        alt_mobile:  'NULL',
        dob:         `${year2}-06-15`,
        address:     addr,
        village_id:  'NULL',
        ward_id:     wardIdx,
        gp_id:       'NULL',
        taluka_id:   1,
        booth_id:    b.booth_no,
        designation: 'SHAKTI_KENDRA',
        is_active:   'TRUE',
        joined_date: '2023-06-01',
        created_at:  now(offset++),
      });
    }
  }
}

// --- Rural booths (gramin) ---
const ruralVillageMap = {};
ruralVillages.forEach((v, i) => { ruralVillageMap[v] = i + 1; });

for (const b of graminBooths) {
  const villageIdx = ruralVillageMap[b.village_name] || 1;
  const mobile     = b.mobile || '9000000000';
  const pramukhName = b.pramukh_name || 'अज्ञात';
  const addr       = `${b.village_name}, ता. करवीर, जि. कोल्हापूर`;

  const year = 1972 + (b.booth_no % 22);
  const month = String((b.booth_no % 12) + 1).padStart(2, '0');
  const day   = String((b.booth_no % 27) + 1).padStart(2, '0');
  const dob   = `${year}-${month}-${day}`;

  karyaRows.push({
    full_name:   pramukhName,
    mobile:      mobile,
    alt_mobile:  'NULL',
    dob:         dob,
    address:     addr,
    village_id:  villageIdx,
    ward_id:     'NULL',
    gp_id:       villageIdx,  // use village index as GP proxy
    taluka_id:   2,           // Karveer / rural Kolhapur
    booth_id:    b.booth_no,
    designation: 'BOOTH_PRAMUKH',
    is_active:   'TRUE',
    joined_date: '2024-01-15',
    created_at:  now(offset++),
  });

  // Shakti kendra entries
  if (b.shakti_kendra) {
    const skLines = b.shakti_kendra.split(/[\r\n]/).map(l => l.replace(/\d{10}.*/, '').replace(/-$/, '').trim()).filter(l => l.length > 3);
    for (const skName of skLines.slice(0, 2)) {
      karyaRows.push({
        full_name:   skName,
        mobile:      '9000000000',
        alt_mobile:  'NULL',
        dob:         `${1968 + (b.booth_no % 20)}-04-10`,
        address:     addr,
        village_id:  villageIdx,
        ward_id:     'NULL',
        gp_id:       villageIdx,
        taluka_id:   2,
        booth_id:    b.booth_no,
        designation: 'SHAKTI_KENDRA',
        is_active:   'TRUE',
        joined_date: '2023-06-01',
        created_at:  now(offset++),
      });
    }
  }
}

// Build SQL
let karya_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 07_karyakartas.sql
-- ${karyaRows.length} Party Workers from New Booth Pramukh Yadi.xlsx
-- Kolhapur District — Shahar (Urban) + Gramin (Rural)
--
-- Source: docs/New Booth Pramukh Yadi.xlsx
--   Sheet 'shahar'  : Urban booths 1–186  (Kolhapur City)
--   Sheet 'Gramin'  : Rural booths 187–354 (Kolhapur Rural)
--
-- FK assumptions:
--   taluka_id  1 = Kolhapur City (Urban)
--   taluka_id  2 = Karveer / Rural Kolhapur
--   ward_id    → sequential IDs of unique ward names (urban)
--   village_id → sequential IDs of unique village names (rural)
--   booth_id   → uses booth_no directly
--   created_by → 2 (PA user)
-- ============================================================

INSERT INTO karyakartas
  (full_name, mobile, alt_mobile, date_of_birth,
   address, village_id, ward_id, gram_panchayat_id, taluka_id,
   booth_id, designation, is_active, joined_date, created_by, created_at)
VALUES
`;

const karya_values = karyaRows.map((r, i) => {
  const comma = i < karyaRows.length - 1 ? ',' : ';';
  return `('${esc(r.full_name)}', '${r.mobile}', ${r.alt_mobile}, '${r.dob}',
   '${esc(r.address)}', ${r.village_id}, ${r.ward_id}, ${r.gp_id}, ${r.taluka_id},
   ${r.booth_id}, '${r.designation}', ${r.is_active}, '${r.joined_date}', 2, '${r.created_at}')${comma}`;
});

karya_sql += '\n' + karya_values.join('\n\n');

fs.writeFileSync(path.join(OUT_DIR, '07_karyakartas.sql'), karya_sql);
console.log(`✅ Written: 07_karyakartas.sql (${karyaRows.length} records)`);

// ── FILE 3: 02_inward_entries.sql ────────────────────────────────────────────
const inward_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 02_inward_entries.sql
-- 20 Incoming Letters / Documents
-- Kolhapur South Constituency
--
-- FK assumptions:
--   sender_department_id: 1=COLLECTOR, 2=TAHSILDAR, 3=ZP,
--     9=PWD, 10=WATER_DEPT, 11=MSEDCL, 13=EDUCATION_DEPT, 14=HEALTH_DEPT
--   assigned_to_user_id: 2=PA (pa_sunita), 3=Clerk (clerk_suresh)
--   created_by: 3=Clerk (clerk_suresh)
-- ============================================================

INSERT INTO inward_entries
  (inward_number, date_received, sender_name, sender_designation,
   sender_department_id, subject, description, tags, priority,
   attachment_urls, assigned_to_user_id, status,
   created_by, created_at, updated_at)
VALUES

-- HIGH PRIORITY
('KLH/INW/2026/0001', '2026-01-16',
 'कार्यकारी अभियंता, सार्वजनिक बांधकाम विभाग, कोल्हापूर',
 'कार्यकारी अभियंता', 9,
 'राजारामपुरी ते शाहूनगर रस्त्यावरील खड्डे दुरुस्तीबाबत',
 'राजारामपुरी ते शाहूनगर दरम्यानच्या मुख्य रस्त्यावर अनेक ठिकाणी मोठे खड्डे पडलेले आहेत. पावसाळ्यात अपघातांची शक्यता असल्याने तातडीने दुरुस्ती करण्याची विनंती.',
 '["रस्ते","तातडी","खड्डे"]', 'HIGH',
 NULL, 2, 'IN_PROGRESS', 3, '2026-01-16 10:30:00', '2026-01-18 14:00:00'),

('KLH/INW/2026/0002', '2026-01-20',
 'जिल्हाधिकारी, कोल्हापूर',
 'जिल्हाधिकारी', 1,
 'पंचायत समिती कर्मचारी भरतीबाबत आमदार कार्यालयाचे पत्र',
 'कोल्हापूर ग्रामीण पंचायत समिती अंतर्गत रिक्त पदे भरण्यासाठी राज्य शासनाच्या परवानगीची प्रतीक्षा. आमदार महोदय यांनी सादर केलेल्या पत्राची दखल घेण्याची विनंती.',
 '["भरती","पंचायत","ग्रामीण"]', 'HIGH',
 NULL, 2, 'ASSIGNED', 3, '2026-01-20 11:00:00', '2026-01-21 09:30:00'),

('KLH/INW/2026/0003', '2026-01-22',
 'अधीक्षक अभियंता, जलसंपदा विभाग',
 'अधीक्षक अभियंता', 10,
 'राधानगरी धरणातून पाणीपुरवठा वाटपाबाबत',
 'राधानगरी धरणातून कोल्हापूर दक्षिण मतदारसंघातील गावांना पाणी वाटपाचे प्रमाण वाढविण्याबाबत आमदार महोदय यांनी केलेल्या मागणीवर तातडीने कार्यवाही करण्याची विनंती.',
 '["पाणी","धरण","राधानगरी"]', 'HIGH',
 NULL, 2, 'PENDING', 3, '2026-01-22 14:00:00', '2026-01-22 14:00:00'),

('KLH/INW/2026/0004', '2026-02-01',
 'महाराष्ट्र राज्य विद्युत वितरण कंपनी, कोल्हापूर',
 'कार्यकारी अभियंता', 11,
 'करवीर तालुक्यातील वीज खंडन समस्येबाबत',
 'करवीर तालुक्यातील अनेक गावांमध्ये वारंवार वीज खंडन होत आहे. शेतकऱ्यांना सिंचनासाठी वीज पुरवठा विस्कळीत होत असून तातडीने दुरुस्तीची मागणी.',
 '["वीज","करवीर","सिंचन"]', 'HIGH',
 NULL, 2, 'IN_PROGRESS', 3, '2026-02-01 09:00:00', '2026-02-03 11:00:00'),

('KLH/INW/2026/0005', '2026-02-05',
 'जिल्हा आरोग्य अधिकारी, कोल्हापूर',
 'जिल्हा आरोग्य अधिकारी', 14,
 'हागवण-उलटी साथीबाबत प्राथमिक आरोग्य केंद्र अहवाल',
 'कोल्हापूर दक्षिण भागातील काही वस्त्यांमध्ये हागवण-उलटीच्या रुग्णांची संख्या वाढत आहे. तातडीने वैद्यकीय पथक पाठवण्याची विनंती.',
 '["आरोग्य","साथ","आपत्कालीन"]', 'HIGH',
 NULL, 2, 'COMPLETED', 3, '2026-02-05 08:00:00', '2026-02-07 16:00:00'),

-- MEDIUM PRIORITY
('KLH/INW/2026/0006', '2026-02-08',
 'मुख्य कार्यकारी अधिकारी, जि.प. कोल्हापूर',
 'मुख्य कार्यकारी अधिकारी', 3,
 'शाळा इमारत दुरुस्तीसाठी निधी मंजुरीबाबत',
 'कोल्हापूर दक्षिण भागातील जिल्हा परिषद शाळांच्या इमारतींची दुरुस्ती व पुनर्बांधणीसाठी विशेष निधी मंजुरीची मागणी.',
 '["शाळा","इमारत","दुरुस्ती"]', 'MEDIUM',
 NULL, 2, 'ASSIGNED', 3, '2026-02-08 10:00:00', '2026-02-09 11:00:00'),

('KLH/INW/2026/0007', '2026-02-10',
 'तहसीलदार, करवीर',
 'तहसीलदार', 2,
 'कृषी पंप वीज जोडणी प्रलंबित प्रकरणांबाबत',
 'करवीर तालुक्यातील ५२ शेतकऱ्यांचे कृषी पंप वीज जोडणीचे अर्ज गेल्या सहा महिन्यांपासून प्रलंबित आहेत. तातडीने निर्गत करण्याची विनंती.',
 '["कृषी","वीज","शेतकरी"]', 'MEDIUM',
 NULL, 3, 'IN_PROGRESS', 3, '2026-02-10 09:30:00', '2026-02-12 14:00:00'),

('KLH/INW/2026/0008', '2026-02-14',
 'जिल्हा समाजकल्याण अधिकारी',
 'जिल्हा समाजकल्याण अधिकारी', 15,
 'मागासवर्गीय विद्यार्थी शिष्यवृत्ती वाटपाबाबत',
 'कोल्हापूर जिल्ह्यातील मागासवर्गीय विद्यार्थ्यांना शिष्यवृत्ती वाटपात विलंब होत असल्याने शैक्षणिक नुकसान होत आहे. तातडीने कार्यवाही करणे आवश्यक.',
 '["शिष्यवृत्ती","शिक्षण","मागासवर्गीय"]', 'MEDIUM',
 NULL, 2, 'COMPLETED', 3, '2026-02-14 11:00:00', '2026-02-18 15:00:00'),

('KLH/INW/2026/0009', '2026-02-18',
 'कार्यकारी अभियंता, पाणी पुरवठा विभाग',
 'कार्यकारी अभियंता', 10,
 'सांगवडे गावाच्या पिण्याच्या पाण्याच्या टाकीबाबत',
 'सांगवडे गावातील जुनी पाण्याची टाकी गळती लागल्याने पिण्याच्या पाण्याची टंचाई निर्माण झाली आहे. तातडीने नवीन टाकी बांधण्याचे काम हाती घेण्याची विनंती.',
 '["पाणी","टाकी","सांगवडे"]', 'MEDIUM',
 NULL, 2, 'PENDING', 3, '2026-02-18 09:00:00', '2026-02-18 09:00:00'),

('KLH/INW/2026/0010', '2026-02-20',
 'पोलीस अधीक्षक, कोल्हापूर',
 'पोलीस अधीक्षक', 16,
 'वाढत्या वाहन चोरीबाबत पोलीस कारवाई',
 'कोल्हापूर दक्षिण भागात वाहन चोरीच्या घटना वाढल्या आहेत. रात्रपाळी वाढवून विशेष पथक तैनात करण्याची विनंती.',
 '["पोलीस","सुरक्षा","वाहन"]', 'MEDIUM',
 NULL, 3, 'ASSIGNED', 3, '2026-02-20 10:00:00', '2026-02-21 11:00:00'),

('KLH/INW/2026/0011', '2026-03-01',
 'गट विकास अधिकारी, करवीर',
 'गट विकास अधिकारी', 4,
 'ग्रामपंचायत निधी वितरणाबाबत',
 'करवीर तालुक्यातील ग्रामपंचायतींना १४ व्या वित्त आयोगाचा निधी अद्याप वितरित झालेला नाही. तातडीने निधी वितरण करण्याची विनंती.',
 '["ग्रामपंचायत","निधी","विकास"]', 'MEDIUM',
 NULL, 2, 'IN_PROGRESS', 3, '2026-03-01 09:00:00', '2026-03-02 11:00:00'),

('KLH/INW/2026/0012', '2026-03-05',
 'जिल्हा कृषी अधिकारी, कोल्हापूर',
 'जिल्हा कृषी अधिकारी', 12,
 'खरीप हंगाम बियाणे वाटपाबाबत',
 'खरीप हंगामासाठी सुधारित वाणाच्या बियाण्यांचे वाटप करण्यासाठी जिल्हा कृषी विभागाकडून योग्य नियोजन करण्याची विनंती.',
 '["कृषी","बियाणे","खरीप"]', 'MEDIUM',
 NULL, 3, 'PENDING', 3, '2026-03-05 10:30:00', '2026-03-05 10:30:00'),

('KLH/INW/2026/0013', '2026-03-08',
 'शिक्षणाधिकारी (माध्यमिक), कोल्हापूर',
 'शिक्षणाधिकारी', 13,
 'माध्यमिक शाळांमधील शिक्षक रिक्त पदे भरण्याबाबत',
 'कोल्हापूर दक्षिण भागातील माध्यमिक शाळांमध्ये विज्ञान व गणित विषयाचे शिक्षक नसल्याने विद्यार्थ्यांचे नुकसान होत आहे.',
 '["शिक्षण","शिक्षक","रिक्तपदे"]', 'MEDIUM',
 NULL, 2, 'COMPLETED', 3, '2026-03-08 11:00:00', '2026-03-15 14:00:00'),

-- LOW PRIORITY
('KLH/INW/2026/0014', '2026-03-10',
 'कार्यकारी अभियंता, बांधकाम विभाग',
 'कार्यकारी अभियंता', 9,
 'ग्रामीण भागातील पूल दुरुस्तीबाबत',
 'करवीर तालुक्यातील काही छोट्या पुलांना पावसाळ्यापूर्वी दुरुस्तीची गरज आहे.',
 '["पूल","दुरुस्ती","करवीर"]', 'LOW',
 NULL, 3, 'PENDING', 3, '2026-03-10 09:00:00', '2026-03-10 09:00:00'),

('KLH/INW/2026/0015', '2026-03-12',
 'तहसीलदार, कागल',
 'तहसीलदार', 2,
 'जात प्रमाणपत्र वितरणाबाबत',
 'कागल परिसरातील जात प्रमाणपत्रांचे वितरण तातडीने करण्याची विनंती.',
 '["जात","प्रमाणपत्र","कागल"]', 'LOW',
 NULL, 3, 'COMPLETED', 3, '2026-03-12 10:00:00', '2026-03-20 16:00:00'),

('KLH/INW/2026/0016', '2026-03-15',
 'जिल्हा नियोजन समिती, कोल्हापूर',
 'सदस्य सचिव', 1,
 'वार्षिक योजना आराखडा सादरीकरण',
 '२०२६-२७ वार्षिक जिल्हा योजनेत कोल्हापूर दक्षिण मतदारसंघाच्या प्रस्तावित कामांचा समावेश करण्याबाबत.',
 '["योजना","नियोजन","२०२६-२७"]', 'LOW',
 NULL, 2, 'IN_PROGRESS', 3, '2026-03-15 10:00:00', '2026-03-16 11:00:00'),

('KLH/INW/2026/0017', '2026-03-18',
 'उप सचिव, महसूल विभाग',
 'उप सचिव', 1,
 'जमीन मोजणी तक्रारींबाबत',
 'कोल्हापूर दक्षिण भागात जमीन मोजणीसंदर्भातील तक्रारी वाढल्या आहेत. भूमी अभिलेख विभागाने तातडीने सुनावणी घेण्याची विनंती.',
 '["जमीन","मोजणी","महसूल"]', 'LOW',
 NULL, 2, 'CANCELLED', 3, '2026-03-18 09:30:00', '2026-03-25 10:00:00'),

('KLH/INW/2026/0018', '2026-03-20',
 'कार्यकारी संचालक, महाराष्ट्र ग्रामीण पाणी पुरवठा',
 'कार्यकारी संचालक', 10,
 'जलजीवन मिशन प्रगती अहवाल',
 'कोल्हापूर जिल्ह्यातील जलजीवन मिशन कामांची प्रगती अहवाल सादर करण्याची विनंती.',
 '["जलजीवन","मिशन","पाणी"]', 'LOW',
 NULL, 3, 'COMPLETED', 3, '2026-03-20 11:00:00', '2026-04-01 15:00:00'),

('KLH/INW/2026/0019', '2026-03-25',
 'जिल्हा पशुसंवर्धन अधिकारी',
 'जिल्हा पशुसंवर्धन अधिकारी', 17,
 'जनावरांच्या आजाराबाबत पशुवैद्यकीय शिबीर',
 'कोल्हापूर दक्षिण भागातील दुग्धव्यवसाय करणाऱ्या शेतकऱ्यांसाठी विशेष पशुवैद्यकीय शिबीर आयोजित करण्याची विनंती.',
 '["पशुसंवर्धन","दुग्धव्यवसाय","शिबीर"]', 'LOW',
 NULL, 3, 'PENDING', 3, '2026-03-25 09:00:00', '2026-03-25 09:00:00'),

('KLH/INW/2026/0020', '2026-03-28',
 'उपाध्यक्ष, कोल्हापूर जिल्हा मध्यवर्ती बँक',
 'उपाध्यक्ष', 3,
 'किसान क्रेडिट कार्ड नूतनीकरणाबाबत',
 'कोल्हापूर दक्षिण भागातील शेतकऱ्यांचे किसान क्रेडिट कार्ड नूतनीकरण तातडीने करण्याची विनंती.',
 '["किसान","क्रेडिट","बँक"]', 'LOW',
 NULL, 2, 'ASSIGNED', 3, '2026-03-28 10:00:00', '2026-03-29 11:00:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '02_inward_entries.sql'), inward_sql);
console.log('✅ Written: 02_inward_entries.sql (20 records)');

// ── FILE 4: 03_nivedans.sql ───────────────────────────────────────────────────
const nivedans_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 03_nivedans.sql
-- 20 Citizen Complaints (Nivedans)
-- Kolhapur South Constituency
--
-- All 8 statuses, all 14 categories, 3 priorities
-- Uses real ward/village names from Booth Pramukh Yadi
-- ============================================================

INSERT INTO nivedans
  (tracking_id, citizen_name, citizen_mobile, citizen_address_line,
   citizen_city, citizen_pincode, citizen_state, citizen_dob,
   village_id, ward_id, taluka_id,
   category_id, sub_category_id,
   subject, description,
   attachment_urls, status, priority,
   assigned_to_user_id, department_forwarded_to_id,
   resolution_notes, escalation_level, escalated_at,
   whatsapp_notified, resolved_at,
   created_by, created_at, updated_at)
VALUES

-- 1. Water – HIGH – PENDING (राजारामपुरी)
('KLH-NIV-2026-00001',
 'प्रकाश विठ्ठल पाटील', '9823100001',
 'प्लॉट क्र. ५, राजारामपुरी, कोल्हापूर', 'कोल्हापूर', '416008', 'Maharashtra', '1985-06-20',
 NULL, 1, 1,
 1, NULL,
 'राजारामपुरी भागात ४ दिवसांपासून पाणीपुरवठा बंद',
 'राजारामपुरी परिसरात गेल्या ४ दिवसांपासून पाण्याचा थेंबही येत नाही. घरात लहान मुले व वृद्ध असल्याने खूप अडचण होत आहे. तातडीने व्यवस्था व्हावी.',
 NULL, 'PENDING', 'HIGH',
 NULL, NULL, NULL, 'NONE', NULL, FALSE, NULL,
 3, '2026-07-20 09:15:00', '2026-07-20 09:15:00'),

-- 2. Health – MEDIUM – PENDING (अवचीतनगर)
('KLH-NIV-2026-00002',
 'सुमन रमेश जाधव', '9823100002',
 'गाळा क्र. १२, अवचीतनगर, कोल्हापूर', 'कोल्हापूर', '416012', 'Maharashtra', '1992-03-10',
 NULL, 2, 1,
 6, NULL,
 'प्राथमिक आरोग्य केंद्रात डॉक्टर उपलब्ध नाहीत',
 'अवचीतनगर भागातील प्राथमिक आरोग्य केंद्रात गेल्या दोन आठवड्यांपासून डॉक्टर नियमितपणे येत नाहीत. रुग्णांना खूप त्रास होत आहे.',
 NULL, 'PENDING', 'MEDIUM',
 NULL, NULL, NULL, 'NONE', NULL, FALSE, NULL,
 3, '2026-07-22 10:30:00', '2026-07-22 10:30:00'),

-- 3. Road – LOW – PENDING (शाहूनगर)
('KLH-NIV-2026-00003',
 'अजित बाळू चव्हाण', '9823100003',
 'शाहूनगर, कोल्हापूर', 'कोल्हापूर', '416001', 'Maharashtra', '1979-11-05',
 NULL, 3, 1,
 2, NULL,
 'शाहूनगरातील अंतर्गत रस्त्यावर खड्डे',
 'शाहूनगर परिसरातील अंतर्गत रस्त्यांवर मोठे खड्डे पडले आहेत. दुचाकी व चारचाकी वाहनांना त्रास होतो.',
 NULL, 'PENDING', 'LOW',
 NULL, NULL, NULL, 'NONE', NULL, FALSE, NULL,
 3, '2026-07-25 11:00:00', '2026-07-25 11:00:00'),

-- 4. Electricity – HIGH – IN_PROGRESS (सांगवडे ग्रामीण)
('KLH-NIV-2026-00004',
 'मारुती रामचंद्र पाटील', '9823100004',
 'सांगवडे, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416209', 'Maharashtra', '1975-08-15',
 1, NULL, 2,
 3, NULL,
 'सांगवडे गावात वारंवार वीज खंडन होते',
 'सांगवडे गावात दररोज ४-५ वेळा वीज जाते. विशेषतः रात्री शेतीपंपासाठी वीज नसल्याने उसाच्या बागा वाळत आहेत.',
 NULL, 'IN_PROGRESS', 'HIGH',
 2, 11, NULL, 'NONE', NULL, TRUE, NULL,
 3, '2026-07-15 08:00:00', '2026-07-18 10:00:00'),

-- 5. Land Revenue – MEDIUM – IN_PROGRESS (नेर्ली)
('KLH-NIV-2026-00005',
 'संतोष दादा पाटील', '9823100005',
 'नेर्ली, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416215', 'Maharashtra', '1980-04-22',
 2, NULL, 2,
 4, NULL,
 'जमिनीचा सातबारा उतारा मिळत नाही',
 'नेर्ली येथील आमच्या शेतजमिनीचा सातबारा उतारा गेल्या ३ महिन्यांपासून मिळत नाही. तलाठी कार्यालयात अनेक वेळा चकरा मारूनही काम होत नाही.',
 NULL, 'IN_PROGRESS', 'MEDIUM',
 2, 2, NULL, 'LEVEL_1', '2026-07-10 09:00:00', FALSE, NULL,
 3, '2026-07-10 09:00:00', '2026-07-16 12:00:00'),

-- 6. Education – MEDIUM – IN_PROGRESS (पाचगाव)
('KLH-NIV-2026-00006',
 'रेखा विनायक माने', '9823100006',
 'पाचगाव, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416210', 'Maharashtra', '1988-09-12',
 3, NULL, 2,
 5, NULL,
 'पाचगाव जिल्हा परिषद शाळेत शिक्षक नाहीत',
 'पाचगाव जि.प. शाळेत वर्ग ५ ते ७ साठी शिक्षक नसल्याने मुलांचे शैक्षणिक नुकसान होत आहे.',
 NULL, 'IN_PROGRESS', 'MEDIUM',
 2, 13, NULL, 'NONE', NULL, FALSE, NULL,
 3, '2026-07-12 10:00:00', '2026-07-14 11:00:00'),

-- 7. Pension – HIGH – FORWARDED (कोल्हापूर शहर)
('KLH-NIV-2026-00007',
 'द्रौपदाबाई बाळासाहेब कदम', '9823100007',
 'राजेंद्रनगर, कोल्हापूर', 'कोल्हापूर', '416008', 'Maharashtra', '1952-01-30',
 NULL, 4, 1,
 7, NULL,
 'वृद्धापकाळ निवृत्तीवेतन बंद झाले',
 'गेल्या ४ महिन्यांपासून माझे वृद्धापकाळ निवृत्तीवेतन बँकेत जमा होणे बंद झाले आहे. समाजकल्याण कार्यालयात चकरा मारूनही काम होत नाही.',
 NULL, 'FORWARDED', 'HIGH',
 2, 15, NULL, 'LEVEL_1', '2026-07-05 09:00:00', TRUE, NULL,
 3, '2026-07-05 09:00:00', '2026-07-08 14:00:00'),

-- 8. Ration Card – MEDIUM – FORWARDED (वसगडे)
('KLH-NIV-2026-00008',
 'गोपाळ शंकर कांबळे', '9823100008',
 'वसगडे, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416220', 'Maharashtra', '1970-07-18',
 4, NULL, 2,
 8, NULL,
 'नवीन रेशनकार्डसाठी अर्ज प्रलंबित',
 'गेल्या ६ महिन्यांपासून नवीन रेशनकार्डसाठी केलेला अर्ज प्रलंबित आहे. कुटुंबातील ५ सदस्यांना रेशनचे धान्य मिळत नाही.',
 NULL, 'FORWARDED', 'MEDIUM',
 2, 15, NULL, 'NONE', NULL, FALSE, NULL,
 3, '2026-07-02 10:00:00', '2026-07-04 11:00:00'),

-- 9. Certificate – LOW – AWAITING_RESPONSE (नागाव)
('KLH-NIV-2026-00009',
 'विशाल प्रभाकर देसाई', '9823100009',
 'नागाव, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416207', 'Maharashtra', '1995-12-25',
 5, NULL, 2,
 9, NULL,
 'उत्पन्न प्रमाणपत्र मिळत नाही',
 'नोकरीसाठी उत्पन्न प्रमाणपत्र आवश्यक आहे पण तहसील कार्यालयात महिनाभर चकरा मारूनही मिळत नाही.',
 NULL, 'AWAITING_RESPONSE', 'LOW',
 3, 2, NULL, 'NONE', NULL, FALSE, NULL,
 3, '2026-06-28 09:30:00', '2026-07-01 10:00:00'),

-- 10. Housing – HIGH – AWAITING_RESPONSE (नंदगाव)
('KLH-NIV-2026-00010',
 'शांताबाई युवराज माने', '9823100010',
 'नंदगाव, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416208', 'Maharashtra', '1960-05-03',
 6, NULL, 2,
 10, NULL,
 'प्रधानमंत्री आवास योजनेचे घर अपूर्ण',
 'पीएम आवास योजनेतून मंजूर झालेले घर अर्धवट बांधले गेले आहे. पुढील हप्ता न मिळाल्याने काम थांबले आहे. कुटुंबाला उघड्यावर राहावे लागत आहे.',
 NULL, 'AWAITING_RESPONSE', 'HIGH',
 2, 3, NULL, 'LEVEL_1', '2026-06-20 09:00:00', TRUE, NULL,
 3, '2026-06-20 09:00:00', '2026-06-25 14:00:00'),

-- 11. Agriculture – MEDIUM – RESOLVED (कावणे)
('KLH-NIV-2026-00011',
 'तानाजी बाबुराव पाटील', '9823100011',
 'कावणे, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416212', 'Maharashtra', '1968-02-14',
 7, NULL, 2,
 11, NULL,
 'कृषी पंप वीज जोडणीसाठी मागणी',
 'आमच्या शेतातील कृषी पंपाला वीज जोडणी अर्ज सादर करून ६ महिने झाले पण अद्याप जोडणी मिळाली नाही.',
 NULL, 'RESOLVED', 'MEDIUM',
 2, 11, 'MSEDCL ने वीज जोडणी दिली. दिनांक ०५/०७/२०२६ रोजी शेतात विद्युत जोडणी पूर्ण.', 'NONE', NULL, TRUE, '2026-07-05 11:00:00',
 3, '2026-06-15 09:00:00', '2026-07-05 11:00:00'),

-- 12. Employment – LOW – RESOLVED (निगवे खालसा)
('KLH-NIV-2026-00012',
 'रोहन दत्ता जगताप', '9823100012',
 'निगवे खालसा, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416219', 'Maharashtra', '1997-08-08',
 8, NULL, 2,
 12, NULL,
 'रोजगार हमी योजनेत नावनोंदणी',
 'रोजगार हमी योजनेत नाव नोंदणीसाठी ग्रामपंचायतीत अर्ज केला पण जॉब कार्ड मिळाले नाही.',
 NULL, 'RESOLVED', 'LOW',
 3, 15, 'ग्रामपंचायतीने जॉब कार्ड वितरित केले. दिनांक २०/०६/२०२६.', 'NONE', NULL, FALSE, '2026-06-20 12:00:00',
 3, '2026-06-10 10:00:00', '2026-06-20 12:00:00'),

-- 13. Police – MEDIUM – RESOLVED (लक्षतीर्थ वसाहत)
('KLH-NIV-2026-00013',
 'किरण संजय देशमुख', '9823100013',
 'लक्षतीर्थ वसाहत, कोल्हापूर', 'कोल्हापूर', '416010', 'Maharashtra', '1990-04-17',
 NULL, 5, 1,
 13, NULL,
 'परिसरात उघड्यावर दारूविक्री होते',
 'लक्षतीर्थ वसाहतीत उघड्यावर दारूविक्री होत असल्याने महिला व मुलांना असुरक्षित वाटत आहे. पोलीस कारवाई व्हावी.',
 NULL, 'RESOLVED', 'MEDIUM',
 2, 16, 'पोलिसांनी कारवाई केली. अवैध दारू जप्त. दिनांक १५/०६/२०२६.', 'NONE', NULL, TRUE, '2026-06-15 16:00:00',
 3, '2026-06-10 10:00:00', '2026-06-15 16:00:00'),

-- 14. General – HIGH – RESOLVED (तामगाव)
('KLH-NIV-2026-00014',
 'प्रभाकर नामदेव गायकवाड', '9823100014',
 'तामगाव, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416217', 'Maharashtra', '1972-10-20',
 9, NULL, 2,
 14, NULL,
 'गावातील सामुदायिक शौचालय बंद',
 'तामगाव येथील सामुदायिक शौचालय गेल्या ३ महिन्यांपासून बंद आहे. उघड्यावर शौचास जावे लागते. आरोग्याची समस्या निर्माण होत आहे.',
 NULL, 'RESOLVED', 'HIGH',
 2, 4, 'ग्रामपंचायतीने शौचालय दुरुस्त केले. दिनांक ०१/०७/२०२६.', 'LEVEL_1', '2026-06-10 09:00:00', TRUE, '2026-07-01 14:00:00',
 3, '2026-06-08 09:00:00', '2026-07-01 14:00:00'),

-- 15. Water – MEDIUM – REJECTED (खेबवडे)
('KLH-NIV-2026-00015',
 'उमेश बाळकृष्ण पाटोळे', '9823100015',
 'खेबवडे, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416218', 'Maharashtra', '1983-07-14',
 10, NULL, 2,
 1, NULL,
 'खाजगी विहीर सरकारी जमिनीवर आहे असे सांगतात',
 'माझी खाजगी विहीर सरकारी जमिनीवर आहे असे म्हणून बुजवण्याची नोटीस आली आहे. चुकीचा सर्व्हे असल्याने दाद मागणे आवश्यक आहे.',
 NULL, 'REJECTED', 'MEDIUM',
 2, 2, 'भूमी अभिलेख विभागाने सर्व्हे केल्यावर खाजगी जमिनीवरच विहीर असल्याचे निश्चित झाले. निवेदन अपात्र ठरवले.', 'NONE', NULL, TRUE, NULL,
 3, '2026-06-01 10:00:00', '2026-06-15 12:00:00'),

-- 16. Road – LOW – REJECTED (दिंडनेर्ली)
('KLH-NIV-2026-00016',
 'अभिजित अशोक चौगुले', '9823100016',
 'दिंडनेर्ली, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416214', 'Maharashtra', '1993-11-22',
 11, NULL, 2,
 2, NULL,
 'रस्त्याच्या दुतर्फा झाडे लावण्याची मागणी',
 'दिंडनेर्ली-कोल्हापूर रस्त्याच्या दुतर्फा सावलीसाठी झाडे लावावीत अशी मागणी आहे.',
 NULL, 'REJECTED', 'LOW',
 3, 9, 'वन विभागाने सांगितले की या रस्त्यावर आधीच वृक्षारोपण योजना सुरू आहे. स्वतंत्र निवेदनाची गरज नाही.', 'NONE', NULL, FALSE, NULL,
 3, '2026-05-28 11:00:00', '2026-06-02 10:00:00'),

-- 17. Health – HIGH – CANCELLED (इस्पुर्ली)
('KLH-NIV-2026-00017',
 'सरिता विश्वनाथ माळकर', '9823100017',
 'इस्पुर्ली, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416216', 'Maharashtra', '1965-03-08',
 12, NULL, 2,
 6, NULL,
 'रुग्णवाहिका सेवा वेळेवर मिळत नाही',
 'इस्पुर्ली परिसरात रुग्णवाहिका बोलावल्यास येण्यास खूप वेळ लागतो. गंभीर रुग्णांना वेळेवर उपचार मिळत नाहीत.',
 NULL, 'CANCELLED', 'HIGH',
 2, 14, NULL, 'NONE', NULL, FALSE, NULL,
 3, '2026-05-20 09:00:00', '2026-05-25 11:00:00'),

-- 18. Education – MEDIUM – CANCELLED (वडकशिवाले)
('KLH-NIV-2026-00018',
 'कांचन महेश सुतार', '9823100018',
 'वडकशिवाले, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416213', 'Maharashtra', '1988-01-30',
 13, NULL, 2,
 5, NULL,
 'शाळेत संगणक प्रयोगशाळा उभारण्याची मागणी',
 'वडकशिवाले जि.प. शाळेत संगणक प्रयोगशाळा नाही. मुलांचे डिजिटल शिक्षण होत नाही.',
 NULL, 'CANCELLED', 'MEDIUM',
 3, 13, NULL, 'NONE', NULL, FALSE, NULL,
 3, '2026-05-15 10:00:00', '2026-05-22 12:00:00'),

-- 19. Land Revenue – HIGH – ARCHIVED (चुये)
('KLH-NIV-2026-00019',
 'विजय बाळासाहेब पाटील', '9823100019',
 'चुये, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416211', 'Maharashtra', '1962-09-16',
 14, NULL, 2,
 4, NULL,
 'जुन्या शेतजमिनीच्या नोंदींत दुरुस्ती',
 'आमच्या वडिलोपार्जित शेताच्या ७/१२ उताऱ्यात चुकीचे नाव आहे. दुरुस्ती करण्यासाठी तहसील कार्यालयात वारंवार अर्ज केले पण काम झाले नाही.',
 NULL, 'ARCHIVED', 'HIGH',
 2, 2, 'जुन्या नोंदी सापडल्या नाहीत. न्यायालयात दाद मागण्याचा सल्ला दिला. निवेदन संग्रहित.', 'LEVEL_2', '2026-03-01 09:00:00', TRUE, NULL,
 3, '2026-01-15 09:00:00', '2026-05-01 12:00:00'),

-- 20. Housing – LOW – ARCHIVED (कळंबे तर्फे ठाणे)
('KLH-NIV-2026-00020',
 'भिमराव तुकाराम कांबळे', '9823100020',
 'कळंबे तर्फे ठाणे, जि. कोल्हापूर', 'कोल्हापूर', '416201', 'Maharashtra', '1955-12-05',
 15, NULL, 2,
 10, NULL,
 'इंदिरा आवास योजनेचे घर मिळाले नाही',
 'जुन्या इंदिरा आवास योजनेत नाव होते पण घर मिळाले नाही. आता PMAY मध्येही नाव नाही. राहण्यासाठी हक्काचे घर मिळावे.',
 NULL, 'ARCHIVED', 'LOW',
 3, 3, 'जुनी योजना बंद झाली. PMAY अंतर्गत नव्याने अर्ज करण्यास सांगितले. निवेदन संग्रहित.', 'NONE', NULL, FALSE, NULL,
 3, '2026-01-20 10:00:00', '2026-04-15 12:00:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '03_nivedans.sql'), nivedans_sql);
console.log('✅ Written: 03_nivedans.sql (20 records)');

// ── FILE 5: 04_nivedan_timeline.sql ──────────────────────────────────────────
const timeline_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 04_nivedan_timeline.sql
-- Activity history for Kolhapur nivedans
-- ============================================================

INSERT INTO nivedan_timeline
  (nivedan_id, action, performed_by_user_id, notes, created_at)
VALUES

-- NIV 1 (PENDING)
(1, 'CREATED',   3, 'नागरिकाने निवेदन नोंदवले.', '2026-07-20 09:15:00'),
(1, 'VIEWED',    2, 'PA ने निवेदन पाहिले.', '2026-07-20 11:00:00'),

-- NIV 2 (PENDING)
(2, 'CREATED',   3, 'नागरिकाने निवेदन नोंदवले.', '2026-07-22 10:30:00'),

-- NIV 3 (PENDING)
(3, 'CREATED',   3, 'नागरिकाने निवेदन नोंदवले.', '2026-07-25 11:00:00'),

-- NIV 4 (IN_PROGRESS)
(4, 'CREATED',   3, 'नागरिकाने निवेदन नोंदवले.', '2026-07-15 08:00:00'),
(4, 'ASSIGNED',  2, 'MSEDCL ला अग्रेषित केले.', '2026-07-15 14:00:00'),
(4, 'STATUS_CHANGE', 2, 'IN_PROGRESS — MSEDCL तपासणी सुरू.', '2026-07-18 10:00:00'),

-- NIV 5 (IN_PROGRESS)
(5, 'CREATED',   3, 'नागरिकाने निवेदन नोंदवले.', '2026-07-10 09:00:00'),
(5, 'ESCALATED', 2, 'LEVEL_1 — तहसीलदारांकडे पाठवले.', '2026-07-10 09:00:00'),
(5, 'STATUS_CHANGE', 2, 'IN_PROGRESS — तहसीलदार कार्यालयात कारवाई सुरू.', '2026-07-16 12:00:00'),

-- NIV 6 (IN_PROGRESS)
(6, 'CREATED',   3, 'नागरिकाने निवेदन नोंदवले.', '2026-07-12 10:00:00'),
(6, 'ASSIGNED',  2, 'शिक्षणाधिकारी कार्यालयास पाठवले.', '2026-07-14 11:00:00'),

-- NIV 7 (FORWARDED)
(7, 'CREATED',   3, 'नागरिकाने निवेदन नोंदवले.', '2026-07-05 09:00:00'),
(7, 'ESCALATED', 2, 'LEVEL_1 — समाजकल्याण विभागास कळवले.', '2026-07-05 09:00:00'),
(7, 'FORWARDED', 2, 'समाजकल्याण विभागास अधिकृत पत्र पाठवले.', '2026-07-08 14:00:00'),

-- NIV 8 (FORWARDED)
(8, 'CREATED',   3, 'नागरिकाने निवेदन नोंदवले.', '2026-07-02 10:00:00'),
(8, 'FORWARDED', 2, 'पुरवठा विभागास अग्रेषित केले.', '2026-07-04 11:00:00'),

-- NIV 9 (AWAITING_RESPONSE)
(9, 'CREATED',   3, 'नागरिकाने निवेदन नोंदवले.', '2026-06-28 09:30:00'),
(9, 'ASSIGNED',  3, 'तहसील कार्यालयास पाठवले.', '2026-07-01 10:00:00'),

-- NIV 10 (AWAITING_RESPONSE)
(10, 'CREATED',  3, 'नागरिकाने निवेदन नोंदवले.', '2026-06-20 09:00:00'),
(10, 'ESCALATED',2, 'LEVEL_1 — PMAY नोडल अधिकाऱ्यांना कळवले.', '2026-06-20 09:00:00'),
(10, 'FORWARDED',2, 'जिल्हाधिकारी कार्यालयास पत्र पाठवले.', '2026-06-25 14:00:00'),

-- NIV 11 (RESOLVED)
(11, 'CREATED',  3, 'नागरिकाने निवेदन नोंदवले.', '2026-06-15 09:00:00'),
(11, 'ASSIGNED', 2, 'MSEDCL ला कळवले.', '2026-06-17 10:00:00'),
(11, 'RESOLVED', 2, 'MSEDCL ने वीज जोडणी दिली.', '2026-07-05 11:00:00'),

-- NIV 12 (RESOLVED)
(12, 'CREATED',  3, 'नागरिकाने निवेदन नोंदवले.', '2026-06-10 10:00:00'),
(12, 'ASSIGNED', 3, 'ग्रामपंचायतीस कळवले.', '2026-06-12 11:00:00'),
(12, 'RESOLVED', 3, 'जॉब कार्ड वितरित झाले.', '2026-06-20 12:00:00'),

-- NIV 13 (RESOLVED)
(13, 'CREATED',  3, 'नागरिकाने निवेदन नोंदवले.', '2026-06-10 10:00:00'),
(13, 'ASSIGNED', 2, 'पोलीस ठाण्यास पत्र पाठवले.', '2026-06-12 14:00:00'),
(13, 'RESOLVED', 2, 'पोलिसांनी कारवाई केली व अवैध दारू जप्त केली.', '2026-06-15 16:00:00'),

-- NIV 14 (RESOLVED)
(14, 'CREATED',  3, 'नागरिकाने निवेदन नोंदवले.', '2026-06-08 09:00:00'),
(14, 'ESCALATED',2, 'LEVEL_1 — ग्रामपंचायतीस तातडीने कळवले.', '2026-06-10 09:00:00'),
(14, 'RESOLVED', 2, 'शौचालय दुरुस्त झाले.', '2026-07-01 14:00:00'),

-- NIV 15 (REJECTED)
(15, 'CREATED',  3, 'नागरिकाने निवेदन नोंदवले.', '2026-06-01 10:00:00'),
(15, 'ASSIGNED', 2, 'भूमी अभिलेख विभागास सर्व्हेसाठी पाठवले.', '2026-06-03 11:00:00'),
(15, 'REJECTED', 2, 'सर्व्हेनुसार खाजगी जमिनीवर विहीर. निवेदन अपात्र.', '2026-06-15 12:00:00'),

-- NIV 16 (REJECTED)
(16, 'CREATED',  3, 'नागरिकाने निवेदन नोंदवले.', '2026-05-28 11:00:00'),
(16, 'REJECTED', 3, 'वन विभागाने आधीच योजना सुरू असल्याचे कळवले.', '2026-06-02 10:00:00'),

-- NIV 17 (CANCELLED)
(17, 'CREATED',  3, 'नागरिकाने निवेदन नोंदवले.', '2026-05-20 09:00:00'),
(17, 'CANCELLED',2, 'नागरिकाने स्वतः रद्द करण्याची विनंती केली.', '2026-05-25 11:00:00'),

-- NIV 18 (CANCELLED)
(18, 'CREATED',  3, 'नागरिकाने निवेदन नोंदवले.', '2026-05-15 10:00:00'),
(18, 'CANCELLED',3, 'नागरिकाने स्वतः रद्द करण्याची विनंती केली.', '2026-05-22 12:00:00'),

-- NIV 19 (ARCHIVED)
(19, 'CREATED',  3, 'नागरिकाने निवेदन नोंदवले.', '2026-01-15 09:00:00'),
(19, 'ASSIGNED', 2, 'तहसीलदार कार्यालयास पाठवले.', '2026-01-18 10:00:00'),
(19, 'ESCALATED',2, 'LEVEL_1 — जिल्हाधिकाऱ्यांना कळवले.', '2026-03-01 09:00:00'),
(19, 'ESCALATED',2, 'LEVEL_2 — राज्य शासनास पत्र.', '2026-03-15 09:00:00'),
(19, 'ARCHIVED', 2, 'नोंदी न मिळाल्याने संग्रहित. न्यायालयाचा मार्ग सुचवला.', '2026-05-01 12:00:00'),

-- NIV 20 (ARCHIVED)
(20, 'CREATED',  3, 'नागरिकाने निवेदन नोंदवले.', '2026-01-20 10:00:00'),
(20, 'ASSIGNED', 3, 'जिल्हा PMAY नोडल अधिकाऱ्यांना पत्र.', '2026-02-01 11:00:00'),
(20, 'ARCHIVED', 2, 'जुनी योजना बंद. PMAY नव्याने अर्जाचा सल्ला. संग्रहित.', '2026-04-15 12:00:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '04_nivedan_timeline.sql'), timeline_sql);
console.log('✅ Written: 04_nivedan_timeline.sql (40 records)');

// ── FILE 6: 05_development_works.sql ─────────────────────────────────────────
const devworks_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 05_development_works.sql
-- 10 Infrastructure Projects in Kolhapur South Constituency
-- Covers all statuses and funding sources
-- ============================================================

INSERT INTO development_works
  (project_name, category, location, village_id, ward_id, taluka_id,
   geo_latitude, geo_longitude,
   funding_source, budget_allocated, budget_spent,
   contractor_name, contractor_contact,
   start_date, expected_completion_date, actual_completion_date,
   status, progress_percentage, description,
   created_by, updated_by, created_at, updated_at)
VALUES

-- 1. Road – MLALAD – SANCTIONED (राजारामपुरी)
(
  'राजारामपुरी अंतर्गत रस्ता — डांबरीकरण',
  'ROAD',
  'राजारामपुरी, कोल्हापूर शहर, वार्ड क्र. ८',
  NULL, 1, 1,
  16.7050, 74.2433,
  'MLALAD', 2200000.00, 0.00,
  NULL, NULL,
  '2026-09-01', '2026-11-30', NULL,
  'SANCTIONED', 0,
  'MLALAD निधीतून राजारामपुरी भागातील अंतर्गत रस्त्याचे डांबरीकरण. एकूण लांबी १.२ किमी.',
  1, 2, '2026-06-15 10:00:00', '2026-07-20 11:00:00'
),

-- 2. Community Hall – STATE_GRANT – SANCTIONED (सांगवडे)
(
  'सांगवडे ग्रामपंचायत — बहुउद्देशीय सभागृह',
  'COMMUNITY_HALL',
  'सांगवडे गाव, ग्रामपंचायत परिसर, करवीर तालुका',
  1, NULL, 2,
  16.6520, 74.2100,
  'STATE_GRANT', 4000000.00, 0.00,
  NULL, NULL,
  '2026-10-01', '2027-03-31', NULL,
  'SANCTIONED', 0,
  'राज्य शासन अनुदानातून सांगवडे येथे बहुउद्देशीय सभागृह बांधकाम. क्षमता ३०० व्यक्ती.',
  1, 2, '2026-07-01 10:00:00', '2026-07-25 11:00:00'
),

-- 3. Water Pipeline – ZP_FUND – IN_PROGRESS (नेर्ली)
(
  'नेर्ली गाव — पिण्याच्या पाण्याची नळ योजना विस्तार',
  'WATER_PIPELINE',
  'नेर्ली गाव, करवीर तालुका, कोल्हापूर',
  2, NULL, 2,
  16.6380, 74.1950,
  'ZP_FUND', 3200000.00, 1800000.00,
  'श्री. संपत कन्स्ट्रक्शन, कोल्हापूर', '9823456789',
  '2026-04-01', '2026-08-31', NULL,
  'IN_PROGRESS', 55,
  'नेर्ली गावातील जुनी नळ योजना विस्तारित करून नवीन वस्त्यांना पाणी पुरवठा. लोकसंख्या लाभ: २५०० व्यक्ती.',
  1, 2, '2026-03-15 10:00:00', '2026-07-20 14:00:00'
),

-- 4. School Building – CENTRAL_GRANT – IN_PROGRESS (पाचगाव)
(
  'पाचगाव जि.प. शाळा — नवीन वर्गखोल्या बांधकाम',
  'SCHOOL',
  'पाचगाव, करवीर तालुका, कोल्हापूर',
  3, NULL, 2,
  16.6720, 74.2050,
  'CENTRAL_GRANT', 2800000.00, 1200000.00,
  'महाराष्ट्र बांधकाम कॉर्पोरेशन', '9876500001',
  '2026-03-15', '2026-09-30', NULL,
  'IN_PROGRESS', 42,
  'केंद्र शासनाच्या समग्र शिक्षा अभियानांतर्गत पाचगाव जि.प. शाळेत ४ नवीन वर्गखोल्या बांधणे.',
  1, 4, '2026-02-20 10:00:00', '2026-07-18 11:00:00'
),

-- 5. Street Light – MLALAD – IN_PROGRESS (शाहूनगर)
(
  'शाहूनगर — सौर पथदिवे बसवणे',
  'STREET_LIGHT',
  'शाहूनगर, कोल्हापूर शहर',
  NULL, 3, 1,
  16.7100, 74.2380,
  'MLALAD', 1500000.00, 900000.00,
  'सनराईझ सोलर, पुणे', '9765432100',
  '2026-05-01', '2026-07-31', NULL,
  'IN_PROGRESS', 60,
  'शाहूनगर परिसरात ५० सौर पथदिवे बसवणे. वीज बिल बचत व सुरक्षितता वाढण्यासाठी.',
  1, 2, '2026-04-10 09:00:00', '2026-07-22 10:00:00'
),

-- 6. Road – ZP_FUND – COMPLETED (वसगडे)
(
  'वसगडे-सांगवडे जोड रस्ता — डांबरीकरण',
  'ROAD',
  'वसगडे ते सांगवडे, करवीर तालुका',
  4, NULL, 2,
  16.6440, 74.2020,
  'ZP_FUND', 1800000.00, 1780000.00,
  'पाटील कन्स्ट्रक्शन, कोल्हापूर', '9823500011',
  '2025-12-01', '2026-03-31', '2026-03-28',
  'COMPLETED', 100,
  'वसगडे ते सांगवडे दरम्यान ०.९ किमी डांबरी रस्ता. शेतकऱ्यांना माल वाहतुकीसाठी सोयीचा झाला.',
  1, 4, '2025-11-15 10:00:00', '2026-04-02 11:00:00'
),

-- 7. Hospital – STATE_GRANT – COMPLETED (कळंबे तर्फे ठाणे)
(
  'कळंबे तर्फे ठाणे — प्राथमिक आरोग्य उपकेंद्र दुरुस्ती',
  'HOSPITAL',
  'कळंबे तर्फे ठाणे, करवीर तालुका',
  15, NULL, 2,
  16.6880, 74.1820,
  'STATE_GRANT', 1200000.00, 1195000.00,
  'गायकवाड बांधकाम व्यवसाय', '9860012345',
  '2025-11-01', '2026-02-28', '2026-02-25',
  'COMPLETED', 100,
  'कळंबे तर्फे ठाणे येथील प्राथमिक आरोग्य उपकेंद्राच्या इमारतीचे संपूर्ण नूतनीकरण व आवश्यक साधनसामग्री खरेदी.',
  1, 4, '2025-10-10 09:00:00', '2026-03-01 11:00:00'
),

-- 8. Drainage – GP_FUND – COMPLETED (लक्षतीर्थ वसाहत)
(
  'लक्षतीर्थ वसाहत — मलनिःसारण व्यवस्था सुधारणा',
  'DRAINAGE',
  'लक्षतीर्थ वसाहत, कोल्हापूर शहर',
  NULL, 5, 1,
  16.7200, 74.2290,
  'GP_FUND', 950000.00, 948000.00,
  'कोल्हापूर महानगरपालिका विभाग', NULL,
  '2025-10-15', '2026-01-31', '2026-01-28',
  'COMPLETED', 100,
  'लक्षतीर्थ वसाहतीतील जुन्या मलनिःसारण नळ्यांची बदली व नवीन व्यवस्था. पावसाळ्यात साठणाऱ्या पाण्याचा प्रश्न सुटला.',
  1, 2, '2025-09-25 10:00:00', '2026-02-01 11:00:00'
),

-- 9. Bridge – STATE_GRANT – DELAYED (निगवे खालसा)
(
  'निगवे खालसा — पंचगंगा नदीवरील छोटा पूल बांधकाम',
  'BRIDGE',
  'निगवे खालसा, करवीर तालुका, कोल्हापूर',
  8, NULL, 2,
  16.6200, 74.1780,
  'STATE_GRANT', 8500000.00, 2100000.00,
  'मेगा इन्फ्रा, कोल्हापूर', '9876599999',
  '2026-01-01', '2026-07-31', NULL,
  'DELAYED', 25,
  'निगवे खालसा येथे पंचगंगा नदीवर ३० मीटर लांबीचा पूल बांधकाम. पूर परिस्थितीमुळे काम लांबले.',
  1, 4, '2025-12-01 10:00:00', '2026-07-20 14:00:00'
),

-- 10. Toilet – CENTRAL_GRANT – CANCELLED (नागाव)
(
  'नागाव — सामुदायिक शौचालय बांधकाम (CANCELLED)',
  'TOILET',
  'नागाव, करवीर तालुका, कोल्हापूर',
  5, NULL, 2,
  16.6310, 74.2260,
  'CENTRAL_GRANT', 650000.00, 0.00,
  NULL, NULL,
  '2026-06-01', '2026-08-31', NULL,
  'CANCELLED', 0,
  'ग्रामपंचायतीने स्वतःच्या निधीतून आधीच शौचालय बांधल्याने केंद्र शासनाचे हे काम रद्द करण्यात आले.',
  1, 2, '2026-05-20 10:00:00', '2026-06-10 11:00:00'
);
`;

fs.writeFileSync(path.join(OUT_DIR, '05_development_works.sql'), devworks_sql);
console.log('✅ Written: 05_development_works.sql (10 records)');

// ── FILE 7: 06_visitors.sql ───────────────────────────────────────────────────
const visitors_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 06_visitors.sql
-- 50 Office Visitor Records
-- Kolhapur South MLA Office
-- ============================================================

INSERT INTO visitors
  (visitor_name, mobile, address, purpose, purpose_other,
   whom_to_meet_user_id, village_id, ward_id,
   visit_date, visit_time_in, visit_time_out,
   token_number, status, notes, created_by, created_at, updated_at)
VALUES

('प्रकाश विठ्ठल पाटील','9823200001','राजारामपुरी, कोल्हापूर','NIVEDAN',NULL,1,NULL,1,'2026-07-01','09:30:00','10:15:00','KLH-V-001','COMPLETED','पाणी समस्येबाबत निवेदन दिले.',3,'2026-07-01 09:30:00','2026-07-01 10:15:00'),
('सुनीता रमेश माने','9823200002','शाहूनगर, कोल्हापूर','GRIEVANCE',NULL,2,NULL,3,'2026-07-01','10:00:00','10:45:00','KLH-V-002','COMPLETED','रेशन कार्ड तक्रार.',3,'2026-07-01 10:00:00','2026-07-01 10:45:00'),
('बाळासाहेब गणपत चव्हाण','9823200003','सांगवडे, करवीर','RECOMMENDATION',NULL,1,1,NULL,'2026-07-01','11:00:00','11:30:00','KLH-V-003','COMPLETED','नोकरी शिफारस पत्र.',3,'2026-07-01 11:00:00','2026-07-01 11:30:00'),
('रेखा विनायक कदम','9823200004','नेर्ली, करवीर','CERTIFICATE_HELP',NULL,2,2,NULL,'2026-07-01','11:30:00','12:00:00','KLH-V-004','COMPLETED','उत्पन्न प्रमाणपत्र मदत.',3,'2026-07-01 11:30:00','2026-07-01 12:00:00'),
('संतोष भास्कर पाटील','9823200005','पाचगाव, करवीर','FUND_REQUEST',NULL,1,3,NULL,'2026-07-01','14:00:00','14:45:00','KLH-V-005','COMPLETED','शाळा दुरुस्ती निधी मागणी.',3,'2026-07-01 14:00:00','2026-07-01 14:45:00'),
('अनिता सुभाष माळकर','9823200006','अवचीतनगर, कोल्हापूर','NIVEDAN',NULL,2,NULL,2,'2026-07-02','09:15:00','10:00:00','KLH-V-006','COMPLETED','आरोग्य केंद्र डॉक्टर नाहीत.',3,'2026-07-02 09:15:00','2026-07-02 10:00:00'),
('युवराज तानाजी शिंदे','9823200007','वसगडे, करवीर','GRIEVANCE',NULL,1,4,NULL,'2026-07-02','09:30:00','10:15:00','KLH-V-007','COMPLETED','पिण्याच्या पाण्याची समस्या.',3,'2026-07-02 09:30:00','2026-07-02 10:15:00'),
('प्रिया अजित जगताप','9823200008','लक्षतीर्थ वसाहत, कोल्हापूर','INFORMATION',NULL,3,NULL,5,'2026-07-02','10:00:00','10:30:00','KLH-V-008','COMPLETED','PMAY अर्जाची माहिती.',3,'2026-07-02 10:00:00','2026-07-02 10:30:00'),
('दत्तात्रय रमेश पाटील','9823200009','निगवे खालसा, करवीर','RECOMMENDATION',NULL,1,8,NULL,'2026-07-02','10:30:00','11:15:00','KLH-V-009','COMPLETED','सरकारी नोकरी शिफारस.',3,'2026-07-02 10:30:00','2026-07-02 11:15:00'),
('सावित्री बाबुराव कांबळे','9823200010','नागाव, करवीर','PENSION_HELP',NULL,2,5,NULL,'2026-07-02','11:00:00','11:45:00','KLH-V-010','COMPLETED','वृद्धापकाळ पेन्शन बंद झाले.',3,'2026-07-02 11:00:00','2026-07-02 11:45:00'),
('महेश संतोष गायकवाड','9823200011','कावणे, करवीर','AGRICULTURE_HELP',NULL,1,7,NULL,'2026-07-03','09:00:00','09:45:00','KLH-V-011','COMPLETED','कृषी पंप वीज मागणी.',3,'2026-07-03 09:00:00','2026-07-03 09:45:00'),
('विद्या प्रभाकर माने','9823200012','तामगाव, करवीर','NIVEDAN',NULL,2,9,NULL,'2026-07-03','09:30:00','10:00:00','KLH-V-012','COMPLETED','ग्रामीण रस्ता खड्डे तक्रार.',3,'2026-07-03 09:30:00','2026-07-03 10:00:00'),
('ओंकार विठ्ठल चौगुले','9823200013','खेबवडे, करवीर','FUND_REQUEST',NULL,1,10,NULL,'2026-07-03','10:00:00','10:45:00','KLH-V-013','COMPLETED','ग्रामपंचायत निधी मागणी.',3,'2026-07-03 10:00:00','2026-07-03 10:45:00'),
('शोभा रामचंद्र देसाई','9823200014','राजेंद्रनगर, कोल्हापूर','CERTIFICATE_HELP',NULL,2,NULL,4,'2026-07-03','10:30:00','11:00:00','KLH-V-014','COMPLETED','जात प्रमाणपत्र मदत.',3,'2026-07-03 10:30:00','2026-07-03 11:00:00'),
('किरण भास्कर पाटील','9823200015','कळंबे तर्फे ठाणे','VISIT',NULL,1,15,NULL,'2026-07-03','11:00:00','11:30:00','KLH-V-015','COMPLETED','पूल बांधकामाबाबत भेट.',3,'2026-07-03 11:00:00','2026-07-03 11:30:00'),
('अर्जुन विष्णू पाटील','9823200016','सांगवडेवाडी, करवीर','NIVEDAN',NULL,2,NULL,NULL,'2026-07-04','09:00:00','09:45:00','KLH-V-016','COMPLETED','शेततळे योजनेसाठी मागणी.',3,'2026-07-04 09:00:00','2026-07-04 09:45:00'),
('मनीषा सुरेश जाधव','9823200017','दिंडनेर्ली, करवीर','GRIEVANCE',NULL,1,11,NULL,'2026-07-04','09:30:00','10:15:00','KLH-V-017','COMPLETED','नळ योजना बंद पडली.',3,'2026-07-04 09:30:00','2026-07-04 10:15:00'),
('गोपाळ दिनकर गुरव','9823200018','इस्पुर्ली, करवीर','PENSION_HELP',NULL,2,12,NULL,'2026-07-04','10:00:00','10:45:00','KLH-V-018','COMPLETED','अपंग पेन्शन अर्ज मदत.',3,'2026-07-04 10:00:00','2026-07-04 10:45:00'),
('रत्नाबाई महादेव पाटील','9823200019','वडकशिवाले, करवीर','RECOMMENDATION',NULL,1,13,NULL,'2026-07-04','11:00:00','11:30:00','KLH-V-019','COMPLETED','मुलाच्या नोकरीसाठी शिफारस.',3,'2026-07-04 11:00:00','2026-07-04 11:30:00'),
('सुनील बाळकृष्ण कदम','9823200020','चुये, करवीर','INFORMATION',NULL,2,14,NULL,'2026-07-04','11:30:00','12:00:00','KLH-V-020','COMPLETED','MGNREGA माहिती.',3,'2026-07-04 11:30:00','2026-07-04 12:00:00'),
('प्रमोद शंकर माने','9823200021','शाहूनगर, कोल्हापूर','NIVEDAN',NULL,1,NULL,3,'2026-07-07','09:15:00','09:55:00','KLH-V-021','COMPLETED','वीज बिलाची तक्रार.',3,'2026-07-07 09:15:00','2026-07-07 09:55:00'),
('आशा विनायक पाटील','9823200022','राजारामपुरी, कोल्हापूर','CERTIFICATE_HELP',NULL,2,NULL,1,'2026-07-07','10:00:00','10:35:00','KLH-V-022','COMPLETED','विधवा प्रमाणपत्र मदत.',3,'2026-07-07 10:00:00','2026-07-07 10:35:00'),
('उमेश बाळकृष्ण पाटोळे','9823200023','खेबवडे, करवीर','GRIEVANCE',NULL,1,10,NULL,'2026-07-07','10:30:00','11:15:00','KLH-V-023','COMPLETED','जमीन मोजणी तक्रार.',3,'2026-07-07 10:30:00','2026-07-07 11:15:00'),
('स्वाती अजित चव्हाण','9823200024','नेर्ली, करवीर','FUND_REQUEST',NULL,2,2,NULL,'2026-07-07','11:00:00','11:45:00','KLH-V-024','COMPLETED','बचत गटाचे कर्ज मागणी.',3,'2026-07-07 11:00:00','2026-07-07 11:45:00'),
('भिमराव तुकाराम कांबळे','9823200025','कळंबे तर्फे ठाणे','PENSION_HELP',NULL,1,15,NULL,'2026-07-07','14:00:00','14:45:00','KLH-V-025','COMPLETED','संजय गांधी निराधार पेन्शन.',3,'2026-07-07 14:00:00','2026-07-07 14:45:00'),
('विकास प्रभाकर देसाई','9823200026','नागाव, करवीर','INFORMATION',NULL,2,5,NULL,'2026-07-08','09:00:00','09:30:00','KLH-V-026','COMPLETED','रोजगार हमी योजना माहिती.',3,'2026-07-08 09:00:00','2026-07-08 09:30:00'),
('सरला संतोष गावडे','9823200027','पाचगाव, करवीर','NIVEDAN',NULL,1,3,NULL,'2026-07-08','09:30:00','10:15:00','KLH-V-027','COMPLETED','शाळा इमारत धोकादायक.',3,'2026-07-08 09:30:00','2026-07-08 10:15:00'),
('बाळासाहेब पांडुरंग पाटील','9823200028','सांगवडे, करवीर','RECOMMENDATION',NULL,2,1,NULL,'2026-07-08','10:00:00','10:45:00','KLH-V-028','COMPLETED','सरकारी रुग्णालय भरती शिफारस.',3,'2026-07-08 10:00:00','2026-07-08 10:45:00'),
('नलिनी महेश सुतार','9823200029','वडकशिवाले, करवीर','GRIEVANCE',NULL,1,13,NULL,'2026-07-08','11:00:00','11:30:00','KLH-V-029','COMPLETED','रस्त्यावर अतिक्रमण तक्रार.',3,'2026-07-08 11:00:00','2026-07-08 11:30:00'),
('अभिजित तानाजी चव्हाण','9823200030','दिंडनेर्ली, करवीर','AGRICULTURE_HELP',NULL,2,11,NULL,'2026-07-08','11:30:00','12:00:00','KLH-V-030','COMPLETED','पीक विमा अर्ज मदत.',3,'2026-07-08 11:30:00','2026-07-08 12:00:00'),
('ज्योती रामचंद्र पाटील','9823200031','निगवे खालसा, करवीर','NIVEDAN',NULL,1,8,NULL,'2026-07-09','09:15:00','10:00:00','KLH-V-031','COMPLETED','पूल नाही नदी ओलांडता येत नाही.',3,'2026-07-09 09:15:00','2026-07-09 10:00:00'),
('संजय श्रीकांत माळकर','9823200032','इस्पुर्ली, करवीर','FUND_REQUEST',NULL,2,12,NULL,'2026-07-09','09:30:00','10:15:00','KLH-V-032','COMPLETED','सामुदायिक शौचालय दुरुस्ती निधी.',3,'2026-07-09 09:30:00','2026-07-09 10:15:00'),
('रोहिणी बाळासाहेब गायकवाड','9823200033','कावणे, करवीर','CERTIFICATE_HELP',NULL,1,7,NULL,'2026-07-09','10:00:00','10:35:00','KLH-V-033','COMPLETED','अधिवास प्रमाणपत्र मदत.',3,'2026-07-09 10:00:00','2026-07-09 10:35:00'),
('विजय मारुती पाटोळे','9823200034','नंदगाव, करवीर','INFORMATION',NULL,2,6,NULL,'2026-07-09','10:30:00','11:00:00','KLH-V-034','COMPLETED','जलजीवन मिशन अर्ज माहिती.',3,'2026-07-09 10:30:00','2026-07-09 11:00:00'),
('कमल विठ्ठल जाधव','9823200035','तामगाव, करवीर','NIVEDAN',NULL,1,9,NULL,'2026-07-09','11:00:00','11:45:00','KLH-V-035','COMPLETED','रस्त्यावर पाणी साठते.',3,'2026-07-09 11:00:00','2026-07-09 11:45:00'),
('प्रशांत दिनकर आतिग्रे','9823200036','नागाव, करवीर','RECOMMENDATION',NULL,2,5,NULL,'2026-07-10','09:00:00','09:45:00','KLH-V-036','COMPLETED','महावितरण नोकरीसाठी शिफारस.',3,'2026-07-10 09:00:00','2026-07-10 09:45:00'),
('मालती अर्जुन शिंदे','9823200037','राजेंद्रनगर, कोल्हापूर','GRIEVANCE',NULL,1,NULL,4,'2026-07-10','09:30:00','10:00:00','KLH-V-037','COMPLETED','पथदिवे बंद आहेत.',3,'2026-07-10 09:30:00','2026-07-10 10:00:00'),
('सुधाकर बाळकृष्ण माने','9823200038','वसगडे, करवीर','AGRICULTURE_HELP',NULL,2,4,NULL,'2026-07-10','10:00:00','10:45:00','KLH-V-038','COMPLETED','पीक कर्ज माफी माहिती.',3,'2026-07-10 10:00:00','2026-07-10 10:45:00'),
('प्रतिभा संजय पाटील','9823200039','सांगवडेवाडी, करवीर','PENSION_HELP',NULL,1,NULL,NULL,'2026-07-10','11:00:00','11:30:00','KLH-V-039','COMPLETED','विधवा पेन्शन अर्ज मदत.',3,'2026-07-10 11:00:00','2026-07-10 11:30:00'),
('नंदकुमार गणपत जगताप','9823200040','लक्षतीर्थ वसाहत, कोल्हापूर','FUND_REQUEST',NULL,2,NULL,5,'2026-07-10','11:30:00','12:00:00','KLH-V-040','COMPLETED','क्रीडा मैदान निधी मागणी.',3,'2026-07-10 11:30:00','2026-07-10 12:00:00'),
('विमल सदाशिव चव्हाण','9823200041','चुये, करवीर','NIVEDAN',NULL,1,14,NULL,'2026-07-11','09:00:00',NULL,'KLH-V-041','WAITING','वाट पाहत आहे.',3,'2026-07-11 09:00:00','2026-07-11 09:00:00'),
('रतन प्रभाकर कांबळे','9823200042','अवचीतनगर, कोल्हापूर','GRIEVANCE',NULL,2,NULL,2,'2026-07-11','09:15:00',NULL,'KLH-V-042','IN_MEETING','MLA साहेबांशी चर्चा सुरू.',3,'2026-07-11 09:15:00','2026-07-11 09:15:00'),
('हेमंत बाळासाहेब देसाई','9823200043','नेर्ली, करवीर','INFORMATION',NULL,1,2,NULL,'2026-07-11','09:30:00',NULL,'KLH-V-043','SCHEDULED','पुढील भेट ठरली.',3,'2026-07-11 09:30:00','2026-07-11 09:30:00'),
('पूजा विनायक पाटील','9823200044','पाचगाव, करवीर','RECOMMENDATION',NULL,2,3,NULL,'2026-07-14','09:00:00',NULL,'KLH-V-044','SCHEDULED','उद्या भेटण्याची वेळ.',3,'2026-07-14 09:00:00','2026-07-14 09:00:00'),
('प्रदीप शंकर गावडे','9823200045','कावणे, करवीर','CERTIFICATE_HELP',NULL,1,7,NULL,'2026-07-14','09:30:00',NULL,'KLH-V-045','WAITING','वाट पाहत आहे.',3,'2026-07-14 09:30:00','2026-07-14 09:30:00'),
('मेघा संतोष पाटील','9823200046','तामगाव, करवीर','NIVEDAN',NULL,2,9,NULL,'2026-07-14','10:00:00',NULL,'KLH-V-046','NO_SHOW','भेटीस आले नाहीत.',3,'2026-07-14 10:00:00','2026-07-14 10:00:00'),
('दीपक रामराव सावंत','9823200047','खेबवडे, करवीर','GRIEVANCE',NULL,1,10,NULL,'2026-07-14','10:30:00',NULL,'KLH-V-047','NO_SHOW','भेटीस आले नाहीत.',3,'2026-07-14 10:30:00','2026-07-14 10:30:00'),
('सुमन विजय कदम','9823200048','वसगडे, करवीर','FUND_REQUEST',NULL,2,4,NULL,'2026-07-14','11:00:00',NULL,'KLH-V-048','CANCELLED','नागरिकाने स्वतः रद्द केले.',3,'2026-07-14 11:00:00','2026-07-14 11:00:00'),
('रमेश नामदेव सुतार','9823200049','दिंडनेर्ली, करवीर','AGRICULTURE_HELP',NULL,1,11,NULL,'2026-07-15','09:00:00',NULL,'KLH-V-049','SCHEDULED','उद्याची वेळ ठरली.',3,'2026-07-15 09:00:00','2026-07-15 09:00:00'),
('गीता बाळकृष्ण माळकर','9823200050','निगवे खालसा, करवीर','INFORMATION',NULL,2,8,NULL,'2026-07-15','09:30:00',NULL,'KLH-V-050','WAITING','वाट पाहत आहे.',3,'2026-07-15 09:30:00','2026-07-15 09:30:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '06_visitors.sql'), visitors_sql);
console.log('✅ Written: 06_visitors.sql (50 records)');

// ── FILE 8: 08_calendar_events.sql ───────────────────────────────────────────
const calendar_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 08_calendar_events.sql
-- 5 Office Calendar Events
-- Kolhapur South MLA Office
-- ============================================================

INSERT INTO calendar_events
  (title, description, event_type, event_date, start_time, end_time,
   location, village_id, ward_id, created_by, created_at, updated_at)
VALUES

('राधानगरी धरण पाहणी दौरा',
 'पाणी वाटप आणि जलसाठा आढाव्यासाठी राधानगरी धरण भेट. जलसंपदा विभागाचे अधिकारी सोबत.',
 'FIELD_VISIT',
 '2026-08-10', '08:00:00', '13:00:00',
 'राधानगरी धरण, कोल्हापूर', NULL, NULL,
 1, '2026-07-25 10:00:00', '2026-07-25 10:00:00'),

('करवीर तालुका कार्यकर्ता मेळावा',
 'करवीर तालुक्यातील बूथ प्रमुख, शक्तीकेंद्र प्रमुख आणि कार्यकर्त्यांचा मासिक मेळावा.',
 'PARTY_PROGRAM',
 '2026-08-15', '14:00:00', '17:00:00',
 'करवीर पंचायत समिती सभागृह, कोल्हापूर', NULL, NULL,
 1, '2026-07-28 11:00:00', '2026-07-28 11:00:00'),

('जिल्हा नियोजन समिती बैठक',
 '२०२६-२७ वार्षिक योजना आराखड्यावर जिल्हा नियोजन समिती बैठक. कोल्हापूर दक्षिण मतदारसंघाचे प्रस्ताव सादर करायचे आहेत.',
 'MEETING',
 '2026-08-20', '10:00:00', '13:00:00',
 'जिल्हाधिकारी कार्यालय, कोल्हापूर', NULL, NULL,
 2, '2026-07-30 09:00:00', '2026-07-30 09:00:00'),

('लक्षतीर्थ वसाहत — जनसंपर्क दिवस',
 'लक्षतीर्थ वसाहत परिसरात जनसंपर्क कार्यक्रम. नागरिकांच्या तक्रारी ऐकणे व मदत करणे.',
 'JANSUNWAI',
 '2026-08-25', '09:00:00', '12:00:00',
 'लक्षतीर्थ वसाहत सामुदायिक सभागृह, कोल्हापूर', NULL, 5,
 1, '2026-08-01 10:00:00', '2026-08-01 10:00:00'),

('स्वातंत्र्य दिन ध्वजारोहण कार्यक्रम',
 '१५ ऑगस्ट स्वातंत्र्य दिन निमित्त ध्वजारोहण व सांस्कृतिक कार्यक्रम. शाळा विद्यार्थी व नागरिकांचा सहभाग.',
 'PROGRAM',
 '2026-08-15', '07:30:00', '09:30:00',
 'शाहूनगर मैदान, कोल्हापूर', NULL, 3,
 2, '2026-08-01 11:00:00', '2026-08-01 11:00:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '08_calendar_events.sql'), calendar_sql);
console.log('✅ Written: 08_calendar_events.sql (5 records)');

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n════════════════════════════════════════════════════');
console.log('✅ ALL KOLHAPUR SAMPLE DATA GENERATED SUCCESSFULLY!');
console.log(`   Output: ${OUT_DIR}`);
console.log('Files created:');
console.log('  01_users.sql          — 7 users');
console.log(`  07_karyakartas.sql    — ${karyaRows.length} booth workers (from Excel)`);
console.log('  02_inward_entries.sql — 20 inward letters');
console.log('  03_nivedans.sql       — 20 citizen complaints');
console.log('  04_nivedan_timeline.sql — 40 timeline events');
console.log('  05_development_works.sql — 10 projects');
console.log('  06_visitors.sql       — 50 visitor records');
console.log('  08_calendar_events.sql — 5 events');
console.log('');
console.log(`Booth coverage from Excel:`);
console.log(`  Urban (Shahar): ${shaharBooths.length} booths across ${urbanWards.length} wards`);
console.log(`  Rural (Gramin): ${graminBooths.length} booths across ${ruralVillages.length} villages`);
console.log('════════════════════════════════════════════════════');
