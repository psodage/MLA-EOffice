/**
 * generate_kolhapur_sample_data.cjs
 * Generates all SAMPLE_DATA SQL files for Kolhapur Division
 * Uses data from: docs/New Booth Pramukh Yadi.xlsx
 *
 * Run: node src/generate_kolhapur_sample_data.cjs
 */

const XLSX = require('xlsx');
const fs   = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '../../SAMPLE_DATA/KOLHAPUR');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── helpers ──────────────────────────────────────────────────────────────────
const clean = (s) => String(s || '').replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
const esc   = (s) => String(s || '').replace(/'/g, "''");
const now   = (offset = 0) => {
  const d = new Date('2026-01-15T09:00:00');
  d.setMinutes(d.getMinutes() + offset);
  return d.toISOString().replace('T', ' ').substring(0, 19);
};

// ── Load Excel ────────────────────────────────────────────────────────────────
const wb = XLSX.readFile(path.resolve(__dirname, '../../docs/New Booth Pramukh Yadi.xlsx'));

const shaharWs   = wb.Sheets['shahar'];
const shaharRows = XLSX.utils.sheet_to_json(shaharWs, { header: 1, defval: '' });

const graminWs   = wb.Sheets['Gramin'];
const graminRows = XLSX.utils.sheet_to_json(graminWs, { header: 1, defval: '' });

const shaharBooths = shaharRows
  .slice(4)
  .filter(r => r[0] && typeof r[0] === 'number')
  .map(r => ({
    booth_no:      r[0],
    ward_name:     clean(r[1]),
    total_voters:  r[2] || 0,
    shakti_kendra: clean(r[3]),
    pramukh_name:  clean(r[4]),
    mobile:        clean(r[5]),
    type:          'URBAN',
  }));

const graminBooths = graminRows
  .slice(4)
  .filter(r => r[0] && typeof r[0] === 'number')
  .map(r => ({
    booth_no:      r[4] || 0,
    village_name:  clean(r[1]),
    pramukh_name:  clean(r[2]),
    mobile:        clean(r[3]),
    total_voters:  r[5] || 0,
    shakti_kendra: clean(r[6]),
    warriors:      clean(r[7]),
    type:          'RURAL',
  }));

console.log(`✅ Shahar booths: ${shaharBooths.length}`);
console.log(`✅ Gramin booths: ${graminBooths.length}`);

const urbanWards    = [...new Set(shaharBooths.map(b => b.ward_name))].filter(Boolean);
const ruralVillages = [...new Set(graminBooths.map(b => b.village_name))].filter(Boolean);

// ── FILE 1: 01_users.sql ──────────────────────────────────────────────────────
const users_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 01_users.sql
-- 7 System User Accounts
-- ============================================================

INSERT INTO users
  (full_name, username, password_hash, role, mobile, email, accessible_modules, is_active, password_changed_at, created_at, updated_at)
VALUES
(
  'आ. राजेश नाईक',
  'mla_rajesh',
  '$2a$12$mprpqKSuufy9Ovt5P57w6Oc9N14VB16tB5Sc3dxW1mdX4AnivVQEi',
  'MLA',
  '9700000001',
  'rajesh.naik.mla@example.com',
  '["inward","outward","nivedan","visitor","devworks","karyakarta","booth","geography","calendar","whatsapp","dashboard","reports","notifications"]',
  TRUE,
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00'
),
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

// ── FILE 2: 07_karyakartas.sql ───────────────────────────────────────────────
const usedMobiles = new Set();
let mockMobileSeq = 9833000001;

function getUniqueMobile(providedMobile) {
  let mob = String(providedMobile || '').replace(/\D/g, '');
  if (mob.length === 10 && !usedMobiles.has(mob)) {
    usedMobiles.add(mob);
    return mob;
  }
  while (usedMobiles.has(String(mockMobileSeq))) {
    mockMobileSeq++;
  }
  const generated = String(mockMobileSeq++);
  usedMobiles.add(generated);
  return generated;
}

let karyaRows = [];
let offset = 0;

const urbanWardMap = {};
urbanWards.forEach((w, i) => { urbanWardMap[w] = i + 1; });

for (const b of shaharBooths) {
  const wardIdx  = urbanWardMap[b.ward_name] || 1;
  const mobile   = getUniqueMobile(b.mobile);
  const pramukhName = b.pramukh_name || 'अज्ञात';
  const addr     = `${b.ward_name}, कोल्हापूर शहर`;

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
    taluka_id:   1,
    booth_id:    b.booth_no,
    designation: 'BOOTH_PRAMUKH',
    is_active:   'TRUE',
    joined_date: '2024-01-15',
    created_at:  now(offset++),
  });

  if (b.shakti_kendra) {
    const skName = b.shakti_kendra.split(/[\r\n]/)[0].replace(/\d{10}.*/, '').trim();
    if (skName.length > 3) {
      const year2 = 1970 + (b.booth_no % 25);
      karyaRows.push({
        full_name:   skName,
        mobile:      getUniqueMobile(null),
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

const ruralVillageMap = {};
ruralVillages.forEach((v, i) => { ruralVillageMap[v] = i + 1; });

for (const b of graminBooths) {
  const villageIdx = ruralVillageMap[b.village_name] || 1;
  const mobile     = getUniqueMobile(b.mobile);
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
    gp_id:       villageIdx,
    taluka_id:   2,
    booth_id:    b.booth_no,
    designation: 'BOOTH_PRAMUKH',
    is_active:   'TRUE',
    joined_date: '2024-01-15',
    created_at:  now(offset++),
  });

  if (b.shakti_kendra) {
    const skLines = b.shakti_kendra.split(/[\r\n]/).map(l => l.replace(/\d{10}.*/, '').replace(/-$/, '').trim()).filter(l => l.length > 3);
    for (const skName of skLines.slice(0, 2)) {
      karyaRows.push({
        full_name:   skName,
        mobile:      getUniqueMobile(null),
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

let karya_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 07_karyakartas.sql
-- ${karyaRows.length} Party Workers
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
-- 20 Incoming Letters
-- ============================================================

INSERT INTO inward_entries
  (inward_number, date_received, sender_name, sender_designation,
   sender_department_id, subject, description, tags, priority,
   attachment_urls, assigned_to_user_id, status,
   created_by, updated_by, created_at, updated_at)
VALUES

('KLH/INW/2026/0001', '2026-01-16', 'कार्यकारी अभियंता, सार्वजनिक बांधकाम विभाग, कोल्हापूर', 'कार्यकारी अभियंता', 9, 'राजारामपुरी ते शाहूनगर रस्त्यावरील खड्डे दुरुस्तीबाबत', 'राजारामपुरी ते शाहूनगर दरम्यानच्या मुख्य रस्त्यावर अनेक ठिकाणी मोठे खड्डे पडलेले आहेत.', '["रस्ते","तातडी","खड्डे"]', 'HIGH', NULL, 2, 'IN_PROGRESS', 3, 2, '2026-01-16 10:30:00', '2026-01-18 14:00:00'),
('KLH/INW/2026/0002', '2026-01-20', 'जिल्हाधिकारी, कोल्हापूर', 'जिल्हाधिकारी', 1, 'पंचायत समिती कर्मचारी भरतीबाबत आमदार कार्यालयाचे पत्र', 'कोल्हापूर ग्रामीण पंचायत समिती अंतर्गत रिक्त पदे भरण्यासाठी राज्य शासनाच्या परवानगीची प्रतीक्षा.', '["भरती","पंचायत","ग्रामीण"]', 'HIGH', NULL, 2, 'ASSIGNED', 3, 2, '2026-01-20 11:00:00', '2026-01-21 09:30:00'),
('KLH/INW/2026/0003', '2026-01-22', 'अधीक्षक अभियंता, जलसंपदा विभाग', 'अधीक्षक अभियंता', 10, 'राधानगरी धरणातून पाणीपुरवठा वाटपाबाबत', 'राधानगरी धरणातून कोल्हापूर दक्षिण मतदारसंघातील गावांना पाणी वाटपाचे प्रमाण वाढविण्याबाबत.', '["पाणी","धरण","राधानगरी"]', 'HIGH', NULL, 2, 'PENDING', 3, 2, '2026-01-22 14:00:00', '2026-01-22 14:00:00'),
('KLH/INW/2026/0004', '2026-02-01', 'महाराष्ट्र राज्य विद्युत वितरण कंपनी, कोल्हापूर', 'कार्यकारी अभियंता', 11, 'करवीर तालुक्यातील वीज खंडन समस्येबाबत', 'करवीर तालुक्यातील अनेक गावांमध्ये वारंवार वीज खंडन होत आहे.', '["वीज","करवीर","सिंचन"]', 'HIGH', NULL, 2, 'IN_PROGRESS', 3, 2, '2026-02-01 09:00:00', '2026-02-03 11:00:00'),
('KLH/INW/2026/0005', '2026-02-05', 'जिल्हा आरोग्य अधिकारी, कोल्हापूर', 'जिल्हा आरोग्य अधिकारी', 14, 'हागवण-उलटी साथीबाबत प्राथमिक आरोग्य केंद्र अहवाल', 'कोल्हापूर दक्षिण भागातील काही वस्त्यांमध्ये हागवण-उलटीच्या रुग्णांची संख्या वाढत आहे.', '["आरोग्य","साथ","आपत्कालीन"]', 'HIGH', NULL, 2, 'COMPLETED', 3, 2, '2026-02-05 08:00:00', '2026-02-07 16:00:00'),
('KLH/INW/2026/0006', '2026-02-08', 'मुख्य कार्यकारी अधिकारी, जि.प. कोल्हापूर', 'मुख्य कार्यकारी अधिकारी', 3, 'शाळा इमारत दुरुस्तीसाठी निधी मंजुरीबाबत', 'कोल्हापूर दक्षिण भागातील जिल्हा परिषद शाळांच्या इमारतींची दुरुस्ती.', '["शाळा","इमारत","दुरुस्ती"]', 'MEDIUM', NULL, 2, 'ASSIGNED', 3, 2, '2026-02-08 10:00:00', '2026-02-09 11:00:00'),
('KLH/INW/2026/0007', '2026-02-10', 'तहसीलदार, करवीर', 'तहसीलदार', 2, 'कृषी पंप वीज जोडणी प्रलंबित प्रकरणांबाबत', 'करवीर तालुक्यातील ५२ शेतकऱ्यांचे कृषी पंप वीज जोडणीचे अर्ज प्रलंबित आहेत.', '["कृषी","वीज","शेतकरी"]', 'MEDIUM', NULL, 3, 'IN_PROGRESS', 3, 2, '2026-02-10 09:30:00', '2026-02-12 14:00:00'),
('KLH/INW/2026/0008', '2026-02-14', 'जिल्हा समाजकल्याण अधिकारी', 'जिल्हा समाजकल्याण अधिकारी', 15, 'मागासवर्गीय विद्यार्थी शिष्यवृत्ती वाटपाबाबत', 'कोल्हापूर जिल्ह्यातील मागासवर्गीय विद्यार्थ्यांना शिष्यवृत्ती वाटपात विलंब.', '["शिष्यवृत्ती","शिक्षण","मागासवर्गीय"]', 'MEDIUM', NULL, 2, 'COMPLETED', 3, 2, '2026-02-14 11:00:00', '2026-02-18 15:00:00'),
('KLH/INW/2026/0009', '2026-02-18', 'कार्यकारी अभियंता, पाणी पुरवठा विभाग', 'कार्यकारी अभियंता', 10, 'सांगवडे गावाच्या पिण्याच्या पाण्याच्या टाकीबाबत', 'सांगवडे गावातील जुनी पाण्याची टाकी गळती लागल्याने पिण्याच्या पाण्याची टंचाई.', '["पाणी","टाकी","सांगवडे"]', 'MEDIUM', NULL, 2, 'PENDING', 3, 2, '2026-02-18 09:00:00', '2026-02-18 09:00:00'),
('KLH/INW/2026/0010', '2026-02-20', 'पोलीस अधीक्षक, कोल्हापूर', 'पोलीस अधीक्षक', 16, 'वाढत्या वाहन चोरीबाबत पोलीस कारवाई', 'कोल्हापूर दक्षिण भागात वाहन चोरीच्या घटना वाढल्या आहेत.', '["पोलीस","सुरक्षा","वाहन"]', 'MEDIUM', NULL, 3, 'ASSIGNED', 3, 2, '2026-02-20 10:00:00', '2026-02-21 11:00:00'),
('KLH/INW/2026/0011', '2026-03-01', 'गट विकास अधिकारी, करवीर', 'गट विकास अधिकारी', 4, 'ग्रामपंचायत निधी वितरणाबाबत', 'करवीर तालुक्यातील ग्रामपंचायतींना १४ व्या वित्त आयोगाचा निधी वितरण.', '["ग्रामपंचायत","निधी","विकास"]', 'MEDIUM', NULL, 2, 'IN_PROGRESS', 3, 2, '2026-03-01 09:00:00', '2026-03-02 11:00:00'),
('KLH/INW/2026/0012', '2026-03-05', 'जिल्हा कृषी अधिकारी, कोल्हापूर', 'जिल्हा कृषी अधिकारी', 12, 'खरीप हंगाम बियाणे वाटपाबाबत', 'खरीप हंगामासाठी सुधारित वाणाच्या बियाण्यांचे वाटप नियोजन.', '["कृषी","बियाणे","खरीप"]', 'MEDIUM', NULL, 3, 'PENDING', 3, 2, '2026-03-05 10:30:00', '2026-03-05 10:30:00'),
('KLH/INW/2026/0013', '2026-03-08', 'शिक्षणाधिकारी (माध्यमिक), कोल्हापूर', 'शिक्षणाधिकारी', 13, 'माध्यमिक शाळांमधील शिक्षक रिक्त पदे भरण्याबाबत', 'माध्यमिक शाळांमध्ये विज्ञान व गणित विषयाचे शिक्षक नसल्याने शैक्षणिक नुकसान.', '["शिक्षण","शिक्षक","रिक्तपदे"]', 'MEDIUM', NULL, 2, 'COMPLETED', 3, 2, '2026-03-08 11:00:00', '2026-03-15 14:00:00'),
('KLH/INW/2026/0014', '2026-03-10', 'कार्यकारी अभियंता, बांधकाम विभाग', 'कार्यकारी अभियंता', 9, 'ग्रामीण भागातील पूल दुरुस्तीबाबत', 'करवीर तालुक्यातील काही छोट्या पुलांना पावसाळ्यापूर्वी दुरुस्तीची गरज.', '["पूल","दुरुस्ती","करवीर"]', 'LOW', NULL, 3, 'PENDING', 3, 2, '2026-03-10 09:00:00', '2026-03-10 09:00:00'),
('KLH/INW/2026/0015', '2026-03-12', 'तहसीलदार, कागल', 'तहसीलदार', 2, 'जात प्रमाणपत्र वितरणाबाबत', 'कागल परिसरातील जात प्रमाणपत्रांचे वितरण तातडीने करण्याची विनंती.', '["जात","प्रमाणपत्र","कागल"]', 'LOW', NULL, 3, 'COMPLETED', 3, 2, '2026-03-12 10:00:00', '2026-03-20 16:00:00'),
('KLH/INW/2026/0016', '2026-03-15', 'जिल्हा नियोजन समिती, कोल्हापूर', 'सदस्य सचिव', 1, 'वार्षिक योजना आराखडा सादरीकरण', '२०२६-२७ वार्षिक जिल्हा योजनेत कोल्हापूर दक्षिण मतदारसंघाच्या कामांचा समावेश.', '["योजना","नियोजन","२०२६-२७"]', 'LOW', NULL, 2, 'IN_PROGRESS', 3, 2, '2026-03-15 10:00:00', '2026-03-16 11:00:00'),
('KLH/INW/2026/0017', '2026-03-18', 'उप सचिव, महसूल विभाग', 'उप सचिव', 1, 'जमीन मोजणी तक्रारींबाबत', 'कोल्हापूर दक्षिण भागात जमीन मोजणीसंदर्भातील तक्रारी वाढल्या आहेत.', '["जमीन","मोजणी","महसूल"]', 'LOW', NULL, 2, 'CANCELLED', 3, 2, '2026-03-18 09:30:00', '2026-03-25 10:00:00'),
('KLH/INW/2026/0018', '2026-03-20', 'कार्यकारी संचालक, महाराष्ट्र ग्रामीण पाणी पुरवठा', 'कार्यकारी संचालक', 10, 'जलजीवन मिशन प्रगती अहवाल', 'कोल्हापूर जिल्ह्यातील जलजीवन मिशन कामांची प्रगती अहवाल सादर.', '["जलजीवन","मिशन","पाणी"]', 'LOW', NULL, 3, 'COMPLETED', 3, 2, '2026-03-20 11:00:00', '2026-04-01 15:00:00'),
('KLH/INW/2026/0019', '2026-03-25', 'जिल्हा पशुसंवर्धन अधिकारी', 'जिल्हा पशुसंवर्धन अधिकारी', 17, 'जनावरांच्या आजाराबाबत पशुवैद्यकीय शिबीर', 'कोल्हापूर दक्षिण भागातील दुग्धव्यवसाय करणाऱ्या शेतकऱ्यांसाठी विशेष शिबीर.', '["पशुसंवर्धन","दुग्धव्यवसाय","शिबीर"]', 'LOW', NULL, 3, 'PENDING', 3, 2, '2026-03-25 09:00:00', '2026-03-25 09:00:00'),
('KLH/INW/2026/0020', '2026-03-28', 'उपाध्यक्ष, कोल्हापूर जिल्हा मध्यवर्ती बँक', 'उपाध्यक्ष', 3, 'किसान क्रेडिट कार्ड नूतनीकरणाबाबत', 'कोल्हापूर दक्षिण भागातील शेतकऱ्यांचे किसान क्रेडिट कार्ड नूतनीकरण.', '["किसान","क्रेडिट","बँक"]', 'LOW', NULL, 2, 'ASSIGNED', 3, 2, '2026-03-28 10:00:00', '2026-03-29 11:00:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '02_inward_entries.sql'), inward_sql);
console.log('✅ Written: 02_inward_entries.sql (20 records)');

// ── FILE 4: 03_nivedans.sql ───────────────────────────────────────────────────
const nivedans_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 03_nivedans.sql
-- 20 Citizen Complaints
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
   whatsapp_notified, linked_visitor_id, resolved_at,
   created_by, updated_by, created_at, updated_at)
VALUES

('KLH-NIV-2026-00001', 'प्रकाश विठ्ठल पाटील', '9823100001', 'प्लॉट क्र. ५, राजारामपुरी, कोल्हापूर', 'कोल्हापूर', '416008', 'Maharashtra', '1985-06-20', NULL, 1, 1, 1, NULL, 'राजारामपुरी भागात ४ दिवसांपासून पाणीपुरवठा बंद', 'राजारामपुरी परिसरात गेल्या ४ दिवसांपासून पाण्याचा थेंबही येत नाही.', NULL, 'PENDING', 'HIGH', NULL, NULL, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-07-20 09:15:00', '2026-07-20 09:15:00'),
('KLH-NIV-2026-00002', 'सुमन रमेश जाधव', '9823100002', 'गाळा क्र. १२, अवचीतनगर, कोल्हापूर', 'कोल्हापूर', '416012', 'Maharashtra', '1992-03-10', NULL, 2, 1, 6, NULL, 'प्राथमिक आरोग्य केंद्रात डॉक्टर उपलब्ध नाहीत', 'अवचीतनगर भागातील प्राथमिक आरोग्य केंद्रात डॉक्टर नियमितपणे येत नाहीत.', NULL, 'PENDING', 'MEDIUM', NULL, NULL, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-07-22 10:30:00', '2026-07-22 10:30:00'),
('KLH-NIV-2026-00003', 'अजित बाळू चव्हाण', '9823100003', 'शाहूनगर, कोल्हापूर', 'कोल्हापूर', '416001', 'Maharashtra', '1979-11-05', NULL, 3, 1, 2, NULL, 'शाहूनगरातील अंतर्गत रस्त्यावर खड्डे', 'शाहूनगर परिसरातील अंतर्गत रस्त्यांवर मोठे खड्डे पडले आहेत.', NULL, 'PENDING', 'LOW', NULL, NULL, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-07-25 11:00:00', '2026-07-25 11:00:00'),
('KLH-NIV-2026-00004', 'मारुती रामचंद्र पाटील', '9823100004', 'सांगवडे, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416209', 'Maharashtra', '1975-08-15', 1, NULL, 2, 3, NULL, 'सांगवडे गावात वारंवार वीज खंडन होते', 'सांगवडे गावात दररोज ४-५ वेळा वीज जाते.', NULL, 'IN_PROGRESS', 'HIGH', 2, 11, NULL, 'NONE', NULL, TRUE, NULL, NULL, 3, 2, '2026-07-15 08:00:00', '2026-07-18 10:00:00'),
('KLH-NIV-2026-00005', 'संतोष दादा पाटील', '9823100005', 'नेर्ली, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416215', 'Maharashtra', '1980-04-22', 2, NULL, 2, 4, NULL, 'जमिनीचा सातबारा उतारा मिळत नाही', 'नेर्ली येथील आमच्या शेतजमिनीचा सातबारा उतारा गेल्या ३ महिन्यांपासून मिळत नाही.', NULL, 'IN_PROGRESS', 'MEDIUM', 2, 2, NULL, 'LEVEL_1', '2026-07-10 09:00:00', FALSE, NULL, NULL, 3, 2, '2026-07-10 09:00:00', '2026-07-16 12:00:00'),
('KLH-NIV-2026-00006', 'रेखा विनायक माने', '9823100006', 'पाचगाव, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416210', 'Maharashtra', '1988-09-12', 3, NULL, 2, 5, NULL, 'पाचगाव जिल्हा परिषद शाळेत शिक्षक नाहीत', 'पाचगाव जि.प. शाळेत शिक्षक नसल्याने मुलांचे शैक्षणिक नुकसान होत आहे.', NULL, 'IN_PROGRESS', 'MEDIUM', 2, 13, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 2, '2026-07-12 10:00:00', '2026-07-14 11:00:00'),
('KLH-NIV-2026-00007', 'द्रौपदाबाई बाळासाहेब कदम', '9823100007', 'राजेंद्रनगर, कोल्हापूर', 'कोल्हापूर', '416008', 'Maharashtra', '1952-01-30', NULL, 4, 1, 7, NULL, 'वृद्धापकाळ निवृत्तीवेतन बंद झाले', 'गेल्या ४ महिन्यांपासून माझे वृद्धापकाळ निवृत्तीवेतन बँकेत जमा होणे बंद झाले आहे.', NULL, 'FORWARDED', 'HIGH', 2, 15, NULL, 'LEVEL_1', '2026-07-05 09:00:00', TRUE, NULL, NULL, 3, 2, '2026-07-05 09:00:00', '2026-07-08 14:00:00'),
('KLH-NIV-2026-00008', 'गोपाळ शंकर कांबळे', '9823100008', 'वसगडे, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416220', 'Maharashtra', '1970-07-18', 4, NULL, 2, 8, NULL, 'नवीन रेशनकार्डसाठी अर्ज प्रलंबित', 'गेल्या ६ महिन्यांपासून नवीन रेशनकार्डसाठी केलेला अर्ज प्रलंबित आहे.', NULL, 'FORWARDED', 'MEDIUM', 2, 15, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 2, '2026-07-02 10:00:00', '2026-07-04 11:00:00'),
('KLH-NIV-2026-00009', 'विशाल प्रभाकर देसाई', '9823100009', 'नागाव, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416207', 'Maharashtra', '1995-12-25', 5, NULL, 2, 9, NULL, 'उत्पन्न प्रमाणपत्र मिळत नाही', 'नोकरीसाठी उत्पन्न प्रमाणपत्र आवश्यक आहे पण तहसील कार्यालयात महिनाभर चकरा मारूनही मिळत नाही.', NULL, 'AWAITING_RESPONSE', 'LOW', 3, 2, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-06-28 09:30:00', '2026-07-01 10:00:00'),
('KLH-NIV-2026-00010', 'शांताबाई युवराज माने', '9823100010', 'नंदगाव, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416208', 'Maharashtra', '1960-05-03', 6, NULL, 2, 10, NULL, 'प्रधानमंत्री आवास योजनेचे घर अपूर्ण', 'पीएम आवास योजनेतून मंजूर झालेले घर अर्धवट बांधले गेले आहे.', NULL, 'AWAITING_RESPONSE', 'HIGH', 2, 3, NULL, 'LEVEL_1', '2026-06-20 09:00:00', TRUE, NULL, NULL, 3, 2, '2026-06-20 09:00:00', '2026-06-25 14:00:00'),
('KLH-NIV-2026-00011', 'तानाजी बाबुराव पाटील', '9823100011', 'कावणे, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416212', 'Maharashtra', '1968-02-14', 7, NULL, 2, 11, NULL, 'कृषी पंप वीज जोडणीसाठी मागणी', 'आमच्या शेतातील कृषी पंपाला वीज जोडणी अर्ज सादर करून ६ महिने झाले.', NULL, 'RESOLVED', 'MEDIUM', 2, 11, 'MSEDCL ने वीज जोडणी दिली. दिनांक ०५/०७/२०२६ रोजी शेतात विद्युत जोडणी पूर्ण.', 'NONE', NULL, TRUE, NULL, '2026-07-05 11:00:00', 3, 2, '2026-06-15 09:00:00', '2026-07-05 11:00:00'),
('KLH-NIV-2026-00012', 'रोहन दत्ता जगताप', '9823100012', 'निगवे खालसा, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416219', 'Maharashtra', '1997-08-08', 8, NULL, 2, 12, NULL, 'रोजगार हमी योजनेत नावनोंदणी', 'रोजगार हमी योजनेत नाव नोंदणीसाठी ग्रामपंचायतीत अर्ज केला.', NULL, 'RESOLVED', 'LOW', 3, 15, 'ग्रामपंचायतीने जॉब कार्ड वितरित केले. दिनांक २०/०६/२०२६.', 'NONE', NULL, FALSE, NULL, '2026-06-20 12:00:00', 3, 3, '2026-06-10 10:00:00', '2026-06-20 12:00:00'),
('KLH-NIV-2026-00013', 'किरण संजय देशमुख', '9823100013', 'लक्षतीर्थ वसाहत, कोल्हापूर', 'कोल्हापूर', '416010', 'Maharashtra', '1990-04-17', NULL, 5, 1, 13, NULL, 'परिसरात उघड्यावर दारूविक्री होते', 'लक्षतीर्थ वसाहतीत उघड्यावर दारूविक्री होत असल्याने महिला व मुलांना असुरक्षित वाटत आहे.', NULL, 'RESOLVED', 'MEDIUM', 2, 16, 'पोलिसांनी कारवाई केली. अवैध दारू जप्त. दिनांक १५/०६/२०२६.', 'NONE', NULL, TRUE, NULL, '2026-06-15 16:00:00', 3, 2, '2026-06-10 10:00:00', '2026-06-15 16:00:00'),
('KLH-NIV-2026-00014', 'प्रभाकर नामदेव गायकवाड', '9823100014', 'तामगाव, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416217', 'Maharashtra', '1972-10-20', 9, NULL, 2, 14, NULL, 'गावातील सामुदायिक शौचालय बंद', 'तामगाव येथील सामुदायिक शौचालय गेल्या ३ महिन्यांपासून बंद आहे.', NULL, 'RESOLVED', 'HIGH', 2, 4, 'ग्रामपंचायतीने शौचालय दुरुस्त केले. दिनांक ०१/०७/२०२६.', 'LEVEL_1', '2026-06-10 09:00:00', TRUE, NULL, '2026-07-01 14:00:00', 3, 2, '2026-06-08 09:00:00', '2026-07-01 14:00:00'),
('KLH-NIV-2026-00015', 'उमेश बाळकृष्ण पाटोळे', '9823100015', 'खेबवडे, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416218', 'Maharashtra', '1983-07-14', 10, NULL, 2, 1, NULL, 'खाजगी विहीर सरकारी जमिनीवर आहे असे सांगतात', 'माझी खाजगी विहीर सरकारी जमिनीवर आहे असे म्हणून बुजवण्याची नोटीस आली आहे.', NULL, 'REJECTED', 'MEDIUM', 2, 2, 'भूमी अभिलेख विभागाने सर्व्हे केल्यावर खाजगी जमिनीवरच विहीर असल्याचे निश्चित झाले.', 'NONE', NULL, TRUE, NULL, NULL, 3, 2, '2026-06-01 10:00:00', '2026-06-15 12:00:00'),
('KLH-NIV-2026-00016', 'अभिजित अशोक चौगुले', '9823100016', 'दिंडनेर्ली, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416214', 'Maharashtra', '1993-11-22', 11, NULL, 2, 2, NULL, 'रस्त्याच्या दुतर्फा झाडे लावण्याची मागणी', 'दिंडनेर्ली-कोल्हापूर रस्त्याच्या दुतर्फा सावलीसाठी झाडे लावावीत अशी मागणी आहे.', NULL, 'REJECTED', 'LOW', 3, 9, 'वन विभागाने सांगितले की या रस्त्यावर आधीच वृक्षारोपण योजना सुरू आहे.', 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-05-28 11:00:00', '2026-06-02 10:00:00'),
('KLH-NIV-2026-00017', 'सरिता विश्वनाथ माळकर', '9823100017', 'इस्पुर्ली, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416216', 'Maharashtra', '1965-03-08', 12, NULL, 2, 6, NULL, 'रुग्णवाहिका सेवा वेळेवर मिळत नाही', 'इस्पुर्ली परिसरात रुग्णवाहिका बोलावल्यास येण्यास खूप वेळ लागतो.', NULL, 'CANCELLED', 'HIGH', 2, 14, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 2, '2026-05-20 09:00:00', '2026-05-25 11:00:00'),
('KLH-NIV-2026-00018', 'कांचन महेश सुतार', '9823100018', 'वडकशिवाले, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416213', 'Maharashtra', '1988-01-30', 13, NULL, 2, 5, NULL, 'शाळेत संगणक प्रयोगशाळा उभारण्याची मागणी', 'वडकशिवाले जि.प. शाळेत संगणक प्रयोगशाळा नाही.', NULL, 'CANCELLED', 'MEDIUM', 3, 13, NULL, 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-05-15 10:00:00', '2026-05-22 12:00:00'),
('KLH-NIV-2026-00019', 'विजय बाळासाहेब पाटील', '9823100019', 'चुये, ता. करवीर, जि. कोल्हापूर', 'कोल्हापूर', '416211', 'Maharashtra', '1962-09-16', 14, NULL, 2, 4, NULL, 'जुन्या शेतजमिनीच्या नोंदींत दुरुस्ती', 'आमच्या वडिलोपार्जित शेताच्या ७/१२ उताऱ्यात चुकीचे नाव आहे.', NULL, 'ARCHIVED', 'HIGH', 2, 2, 'जुन्या नोंदी सापडल्या नाहीत. न्यायालयात दाद मागण्याचा सल्ला दिला.', 'LEVEL_2', '2026-03-01 09:00:00', TRUE, NULL, NULL, 3, 2, '2026-01-15 09:00:00', '2026-05-01 12:00:00'),
('KLH-NIV-2026-00020', 'भिमराव तुकाराम कांबळे', '9823100020', 'कळंबे तर्फे ठाणे, जि. कोल्हापूर', 'कोल्हापूर', '416201', 'Maharashtra', '1955-12-05', 15, NULL, 2, 10, NULL, 'इंदिरा आवास योजनेचे घर मिळाले नाही', 'जुन्या इंदिरा आवास योजनेत नाव होते पण घर मिळाले नाही.', NULL, 'ARCHIVED', 'LOW', 3, 3, 'जुनी योजना बंद झाली. PMAY अंतर्गत नव्याने अर्ज करण्यास सांगितले.', 'NONE', NULL, FALSE, NULL, NULL, 3, 3, '2026-01-20 10:00:00', '2026-04-15 12:00:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '03_nivedans.sql'), nivedans_sql);
console.log('✅ Written: 03_nivedans.sql (20 records)');

// ── FILE 5: 04_nivedan_timeline.sql ──────────────────────────────────────────
const timeline_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 04_nivedan_timeline.sql
-- Activity history for Kolhapur nivedans
-- Column list matching schema:
-- nivedan_id, action_type, old_status, new_status, assigned_to_user_id, department_id, note, is_internal, performed_by, created_at
-- ============================================================

INSERT INTO nivedan_timeline
  (nivedan_id, action_type, old_status, new_status, assigned_to_user_id, department_id, note, is_internal, performed_by, created_at)
VALUES

(1, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-07-20 09:15:00'),
(1, 'NOTE_ADDED', 'PENDING', 'PENDING', NULL, NULL, 'PA ने निवेदन पाहिले.', 1, 2, '2026-07-20 11:00:00'),
(2, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-07-22 10:30:00'),
(3, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-07-25 11:00:00'),
(4, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-07-15 08:00:00'),
(4, 'ASSIGNED', 'PENDING', 'PENDING', 2, 11, 'MSEDCL ला अग्रेषित केले.', 1, 2, '2026-07-15 14:00:00'),
(4, 'STATUS_CHANGE', 'PENDING', 'IN_PROGRESS', NULL, NULL, 'MSEDCL तपासणी सुरू.', 1, 2, '2026-07-18 10:00:00'),
(5, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-07-10 09:00:00'),
(5, 'ESCALATED', 'PENDING', 'PENDING', NULL, 2, 'LEVEL_1 — तहसीलदारांकडे पाठवले.', 1, 2, '2026-07-10 09:00:00'),
(5, 'STATUS_CHANGE', 'PENDING', 'IN_PROGRESS', NULL, NULL, 'तहसीलदार कार्यालयात कारवाई सुरू.', 1, 2, '2026-07-16 12:00:00'),
(6, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-07-12 10:00:00'),
(6, 'ASSIGNED', 'PENDING', 'PENDING', 2, 13, 'शिक्षणाधिकारी कार्यालयास पाठवले.', 1, 2, '2026-07-14 11:00:00'),
(7, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-07-05 09:00:00'),
(7, 'ESCALATED', 'PENDING', 'PENDING', NULL, 15, 'LEVEL_1 — समाजकल्याण विभागास कळवले.', 1, 2, '2026-07-05 09:00:00'),
(7, 'FORWARDED', 'PENDING', 'FORWARDED', NULL, 15, 'समाजकल्याण विभागास अधिकृत पत्र पाठवले.', 1, 2, '2026-07-08 14:00:00'),
(8, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-07-02 10:00:00'),
(8, 'FORWARDED', 'PENDING', 'FORWARDED', NULL, 15, 'पुरवठा विभागास अग्रेषित केले.', 1, 2, '2026-07-04 11:00:00'),
(9, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-06-28 09:30:00'),
(9, 'ASSIGNED', 'PENDING', 'PENDING', 3, 2, 'तहसील कार्यालयास पाठवले.', 1, 3, '2026-07-01 10:00:00'),
(10, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-06-20 09:00:00'),
(10, 'ESCALATED', 'PENDING', 'PENDING', NULL, 3, 'LEVEL_1 — PMAY नोडल अधिकाऱ्यांना कळवले.', 1, 2, '2026-06-20 09:00:00'),
(10, 'FORWARDED', 'PENDING', 'AWAITING_RESPONSE', NULL, 3, 'जिल्हाधिकारी कार्यालयास पत्र पाठवले.', 1, 2, '2026-06-25 14:00:00'),
(11, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-06-15 09:00:00'),
(11, 'ASSIGNED', 'PENDING', 'PENDING', 2, 11, 'MSEDCL ला कळवले.', 1, 2, '2026-06-17 10:00:00'),
(11, 'RESOLVED', 'IN_PROGRESS', 'RESOLVED', NULL, NULL, 'MSEDCL ने वीज जोडणी दिली.', 1, 2, '2026-07-05 11:00:00'),
(12, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-06-10 10:00:00'),
(12, 'ASSIGNED', 'PENDING', 'PENDING', 3, NULL, 'ग्रामपंचायतीस कळवले.', 1, 3, '2026-06-12 11:00:00'),
(12, 'RESOLVED', 'IN_PROGRESS', 'RESOLVED', NULL, NULL, 'जॉब कार्ड वितरित झाले.', 1, 3, '2026-06-20 12:00:00'),
(13, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-06-10 10:00:00'),
(13, 'ASSIGNED', 'PENDING', 'PENDING', 2, 16, 'पोलीस ठाण्यास पत्र पाठवले.', 1, 2, '2026-06-12 14:00:00'),
(13, 'RESOLVED', 'IN_PROGRESS', 'RESOLVED', NULL, NULL, 'पोलिसांनी कारवाई केली व अवैध दारू जप्त केली.', 1, 2, '2026-06-15 16:00:00'),
(14, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-06-08 09:00:00'),
(14, 'ESCALATED', 'PENDING', 'PENDING', NULL, 4, 'LEVEL_1 — ग्रामपंचायतीस तातडीने कळवले.', 1, 2, '2026-06-10 09:00:00'),
(14, 'RESOLVED', 'IN_PROGRESS', 'RESOLVED', NULL, NULL, 'शौचालय दुरुस्त झाले.', 1, 2, '2026-07-01 14:00:00'),
(15, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-06-01 10:00:00'),
(15, 'ASSIGNED', 'PENDING', 'PENDING', 2, 2, 'भूमी अभिलेख विभागास सर्व्हेसाठी पाठवले.', 1, 2, '2026-06-03 11:00:00'),
(15, 'REJECTED', 'PENDING', 'REJECTED', NULL, NULL, 'सर्व्हेनुसार खाजगी जमिनीवर विहीर. अपात्र.', 1, 2, '2026-06-15 12:00:00'),
(16, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-05-28 11:00:00'),
(16, 'REJECTED', 'PENDING', 'REJECTED', NULL, 9, 'वन विभागाने आधीच योजना सुरू असल्याचे कळवले.', 1, 3, '2026-06-02 10:00:00'),
(17, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-05-20 09:00:00'),
(17, 'CANCELLED', 'PENDING', 'CANCELLED', NULL, NULL, 'नागरिकाने स्वतः रद्द करण्याची विनंती केली.', 1, 2, '2026-05-25 11:00:00'),
(18, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-05-15 10:00:00'),
(18, 'CANCELLED', 'PENDING', 'CANCELLED', NULL, NULL, 'नागरिकाने स्वतः रद्द करण्याची विनंती केली.', 1, 3, '2026-05-22 12:00:00'),
(19, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-01-15 09:00:00'),
(19, 'ASSIGNED', 'PENDING', 'PENDING', 2, 2, 'तहसीलदार कार्यालयास पाठवले.', 1, 2, '2026-01-18 10:00:00'),
(19, 'ESCALATED', 'PENDING', 'PENDING', NULL, 1, 'LEVEL_1 — जिल्हाधिकाऱ्यांना कळवले.', 1, 2, '2026-03-01 09:00:00'),
(19, 'ESCALATED', 'PENDING', 'PENDING', NULL, 1, 'LEVEL_2 — राज्य शासनास पत्र.', 1, 2, '2026-03-15 09:00:00'),
(19, 'ARCHIVED', 'PENDING', 'ARCHIVED', NULL, NULL, 'नोंदी न मिळाल्याने संग्रहित. न्यायालयाचा मार्ग सुचवला.', 1, 2, '2026-05-01 12:00:00'),
(20, 'CREATED', NULL, 'PENDING', NULL, NULL, 'नागरिकाने निवेदन नोंदवले.', 0, 3, '2026-01-20 10:00:00'),
(20, 'ASSIGNED', 'PENDING', 'PENDING', 3, 3, 'जिल्हा PMAY नोडल अधिकाऱ्यांना पत्र.', 1, 3, '2026-02-01 11:00:00'),
(20, 'ARCHIVED', 'PENDING', 'ARCHIVED', NULL, NULL, 'जुनी योजना बंद. PMAY नव्याने अर्जाचा सल्ला. संग्रहित.', 1, 2, '2026-04-15 12:00:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '04_nivedan_timeline.sql'), timeline_sql);
console.log('✅ Written: 04_nivedan_timeline.sql (40 records)');

// ── FILE 6: 05_development_works.sql ─────────────────────────────────────────
const devworks_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 05_development_works.sql
-- 10 Infrastructure Projects
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

('राजारामपुरी अंतर्गत रस्ता — डांबरीकरण', 'ROAD', 'राजारामपुरी, कोल्हापूर शहर, वार्ड क्र. ८', NULL, 1, 1, 16.7050, 74.2433, 'MLALAD', 2200000.00, 0.00, NULL, NULL, '2026-09-01', '2026-11-30', NULL, 'SANCTIONED', 0, 'MLALAD निधीतून राजारामपुरी भागातील अंतर्गत रस्त्याचे डांबरीकरण.', 1, 2, '2026-06-15 10:00:00', '2026-07-20 11:00:00'),
('सांगवडे ग्रामपंचायत — बहुउद्देशीय सभागृह', 'COMMUNITY_HALL', 'सांगवडे गाव, ग्रामपंचायत परिसर, करवीर तालुका', 1, NULL, 2, 16.6520, 74.2100, 'STATE_GRANT', 4000000.00, 0.00, NULL, NULL, '2026-10-01', '2027-03-31', NULL, 'SANCTIONED', 0, 'राज्य शासन अनुदानातून सांगवडे येथे बहुउद्देशीय सभागृह बांधकाम.', 1, 2, '2026-07-01 10:00:00', '2026-07-25 11:00:00'),
('नेर्ली गाव — पिण्याच्या पाण्याची नळ योजना विस्तार', 'WATER_PIPELINE', 'नेर्ली गाव, करवीर तालुका, कोल्हापूर', 2, NULL, 2, 16.6380, 74.1950, 'ZP_FUND', 3200000.00, 1800000.00, 'श्री. संपत कन्स्ट्रक्शन, कोल्हापूर', '9823456789', '2026-04-01', '2026-08-31', NULL, 'IN_PROGRESS', 55, 'नेर्ली गावातील जुनी नळ योजना विस्तारित करून नवीन वस्त्यांना पाणी पुरवठा.', 1, 2, '2026-03-15 10:00:00', '2026-07-20 14:00:00'),
('पाचगाव जि.प. शाळा — नवीन वर्गखोल्या बांधकाम', 'SCHOOL', 'पाचगाव, करवीर तालुका, कोल्हापूर', 3, NULL, 2, 16.6720, 74.2050, 'CENTRAL_GRANT', 2800000.00, 1200000.00, 'महाराष्ट्र बांधकाम कॉर्पोरेशन', '9876500001', '2026-03-15', '2026-09-30', NULL, 'IN_PROGRESS', 42, 'केंद्र शासनाच्या समग्र शिक्षा अभियानांतर्गत पाचगाव जि.प. शाळेत ४ नवीन वर्गखोल्या बांधणे.', 1, 4, '2026-02-20 10:00:00', '2026-07-18 11:00:00'),
('शाहूनगर — सौर पथदिवे बसवणे', 'STREET_LIGHT', 'शाहूनगर, कोल्हापूर शहर', NULL, 3, 1, 16.7100, 74.2380, 'MLALAD', 1500000.00, 900000.00, 'सनराईझ सोलर, पुणे', '9765432100', '2026-05-01', '2026-07-31', NULL, 'IN_PROGRESS', 60, 'शाहूनगर परिसरात ५० सौर पथदिवे बसवणे.', 1, 2, '2026-04-10 09:00:00', '2026-07-22 10:00:00'),
('वसगडे-सांगवडे जोड रस्ता — डांबरीकरण', 'ROAD', 'वसगडे ते सांगवडे, करवीर तालुका', 4, NULL, 2, 16.6440, 74.2020, 'ZP_FUND', 1800000.00, 1780000.00, 'पाटील कन्स्ट्रक्शन, कोल्हापूर', '9823500011', '2025-12-01', '2026-03-31', '2026-03-28', 'COMPLETED', 100, 'वसगडे ते सांगवडे दरम्यान ०.९ किमी डांबरी रस्ता.', 1, 4, '2025-11-15 10:00:00', '2026-04-02 11:00:00'),
('कळंबे तर्फे ठाणे — प्राथमिक आरोग्य उपकेंद्र दुरुस्ती', 'HOSPITAL', 'कळंबे तर्फे ठाणे, करवीर तालुका', 15, NULL, 2, 16.6880, 74.1820, 'STATE_GRANT', 1200000.00, 1195000.00, 'गायकवाड बांधकाम व्यवसाय', '9860012345', '2025-11-01', '2026-02-28', '2026-02-25', 'COMPLETED', 100, 'कळंबे तर्फे ठाणे येथील प्राथमिक आरोग्य उपकेंद्राच्या इमारतीचे संपूर्ण नूतनीकरण.', 1, 4, '2025-10-10 09:00:00', '2026-03-01 11:00:00'),
('लक्षतीर्थ वसाहत — मलनिःसारण व्यवस्था सुधारणा', 'DRAINAGE', 'लक्षतीर्थ वसाहत, कोल्हापूर शहर', NULL, 5, 1, 16.7200, 74.2290, 'GP_FUND', 950000.00, 948000.00, 'कोल्हापूर महानगरपालिका विभाग', NULL, '2025-10-15', '2026-01-31', '2026-01-28', 'COMPLETED', 100, 'लक्षतीर्थ वसाहतीतील जुन्या मलनिःसारण नळ्यांची बदली.', 1, 2, '2025-09-25 10:00:00', '2026-02-01 11:00:00'),
('निगवे खालसा — पंचगंगा नदीवरील छोटा पूल बांधकाम', 'BRIDGE', 'निगवे खालसा, करवीर तालुका, कोल्हापूर', 8, NULL, 2, 16.6200, 74.1780, 'STATE_GRANT', 8500000.00, 2100000.00, 'मेगा इन्फ्रा, कोल्हापूर', '9876599999', '2026-01-01', '2026-07-31', NULL, 'DELAYED', 25, 'निगवे खालसा येथे पंचगंगा नदीवर ३० मीटर लांबीचा पूल बांधकाम.', 1, 4, '2025-12-01 10:00:00', '2026-07-20 14:00:00'),
('नागाव — सामुदायिक शौचालय बांधकाम (CANCELLED)', 'TOILET', 'नागाव, करवीर तालुका, कोल्हापूर', 5, NULL, 2, 16.6310, 74.2260, 'CENTRAL_GRANT', 650000.00, 0.00, NULL, NULL, '2026-06-01', '2026-08-31', NULL, 'CANCELLED', 0, 'ग्रामपंचायतीने स्वतःच्या निधीतून आधीच शौचालय बांधल्याने हे काम रद्द.', 1, 2, '2026-05-20 10:00:00', '2026-06-10 11:00:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '05_development_works.sql'), devworks_sql);
console.log('✅ Written: 05_development_works.sql (10 records)');

// ── FILE 7: 06_visitors.sql ───────────────────────────────────────────────────
const visitors_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 06_visitors.sql
-- 50 Office Visitor Records
-- Valid purpose enum values: GRIEVANCE, COURTESY_CALL, PARTY_WORK, INVITATION, PERSONAL_MEETING, DOCUMENT_SUBMISSION, FOLLOWUP, RECOMMENDATION, GENERAL_INQUIRY, OTHER
-- ============================================================

INSERT INTO visitors
  (visitor_name, mobile, address_line, city, pincode,
   village_id, ward_id, purpose, purpose_description,
   check_in_time, check_out_time,
   is_repeat_visitor, previous_visit_count, linked_nivedan_id,
   created_by, created_at)
VALUES

('प्रकाश विठ्ठल पाटील','9823200001','राजारामपुरी, कोल्हापूर','कोल्हापूर','416008',NULL,1,'GRIEVANCE','पाणी समस्येबाबत निवेदन देण्यासाठी आले.','2026-07-01 09:30:00','2026-07-01 10:15:00',FALSE,0,1,3,'2026-07-01 09:30:00'),
('सुनीता रमेश माने','9823200002','शाहूनगर, कोल्हापूर','कोल्हापूर','416001',NULL,3,'GRIEVANCE','रेशन कार्ड तक्रार घेऊन आल्या.','2026-07-01 10:00:00','2026-07-01 10:45:00',FALSE,0,NULL,3,'2026-07-01 10:00:00'),
('बाळासाहेब गणपत चव्हाण','9823200003','सांगवडे, करवीर','कोल्हापूर','416209',1,NULL,'RECOMMENDATION','नोकरी शिफारस पत्रासाठी आले.','2026-07-01 11:00:00','2026-07-01 11:30:00',FALSE,0,NULL,3,'2026-07-01 11:00:00'),
('रेखा विनायक कदम','9823200004','नेर्ली, करवीर','कोल्हापूर','416215',2,NULL,'DOCUMENT_SUBMISSION','उत्पन्न प्रमाणपत्र मदतीसाठी आल्या.','2026-07-01 11:30:00','2026-07-01 12:00:00',FALSE,0,NULL,3,'2026-07-01 11:30:00'),
('संतोष भास्कर पाटील','9823200005','पाचगाव, करवीर','कोल्हापूर','416210',3,NULL,'PERSONAL_MEETING','शाळा दुरुस्ती निधी मागणीसाठी आले.','2026-07-01 14:00:00','2026-07-01 14:45:00',FALSE,0,NULL,3,'2026-07-01 14:00:00'),
('अनिता सुभाष माळकर','9823200006','अवचीतनगर, कोल्हापूर','कोल्हापूर','416012',NULL,2,'GRIEVANCE','आरोग्य केंद्रात डॉक्टर नाहीत, निवेदन दिले.','2026-07-02 09:15:00','2026-07-02 10:00:00',FALSE,0,2,3,'2026-07-02 09:15:00'),
('युवराज तानाजी शिंदे','9823200007','वसगडे, करवीर','कोल्हापूर','416220',4,NULL,'GRIEVANCE','पिण्याच्या पाण्याची समस्या.','2026-07-02 09:30:00','2026-07-02 10:15:00',FALSE,0,NULL,3,'2026-07-02 09:30:00'),
('प्रिया अजित जगताप','9823200008','लक्षतीर्थ वसाहत, कोल्हापूर','कोल्हापूर','416010',NULL,5,'GENERAL_INQUIRY','PMAY अर्जाची माहिती घेण्यासाठी आल्या.','2026-07-02 10:00:00','2026-07-02 10:30:00',FALSE,0,NULL,3,'2026-07-02 10:00:00'),
('दत्तात्रय रमेश पाटील','9823200009','निगवे खालसा, करवीर','कोल्हापूर','416219',8,NULL,'RECOMMENDATION','सरकारी नोकरी शिफारस पत्रासाठी आले.','2026-07-02 10:30:00','2026-07-02 11:15:00',FALSE,0,NULL,3,'2026-07-02 10:30:00'),
('सावित्री बाबुराव कांबळे','9823200010','नागाव, करवीर','कोल्हापूर','416207',5,NULL,'PERSONAL_MEETING','वृद्धापकाळ पेन्शन बंद झाल्याने मदतीसाठी आल्या.','2026-07-02 11:00:00','2026-07-02 11:45:00',FALSE,0,7,3,'2026-07-02 11:00:00'),
('महेश संतोष गायकवाड','9823200011','कावणे, करवीर','कोल्हापूर','416212',7,NULL,'PARTY_WORK','कृषी पंप वीज मागणीसाठी आले.','2026-07-03 09:00:00','2026-07-03 09:45:00',FALSE,0,NULL,3,'2026-07-03 09:00:00'),
('विद्या प्रभाकर माने','9823200012','तामगाव, करवीर','कोल्हापूर','416217',9,NULL,'GRIEVANCE','ग्रामीण रस्ता खड्डे तक्रार.','2026-07-03 09:30:00','2026-07-03 10:00:00',FALSE,0,NULL,3,'2026-07-03 09:30:00'),
('ओंकार विठ्ठल चौगुले','9823200013','खेबवडे, करवीर','कोल्हापूर','416218',10,NULL,'PERSONAL_MEETING','ग्रामपंचायत निधी मागणीसाठी आले.','2026-07-03 10:00:00','2026-07-03 10:45:00',FALSE,0,NULL,3,'2026-07-03 10:00:00'),
('शोभा रामचंद्र देसाई','9823200014','राजेंद्रनगर, कोल्हापूर','कोल्हापूर','416008',NULL,4,'DOCUMENT_SUBMISSION','जात प्रमाणपत्र मदतीसाठी आल्या.','2026-07-03 10:30:00','2026-07-03 11:00:00',FALSE,0,NULL,3,'2026-07-03 10:30:00'),
('किरण भास्कर पाटील','9823200015','कळंबे तर्फे ठाणे','कोल्हापूर','416201',15,NULL,'OTHER','पूल बांधकामाबाबत भेट.','2026-07-03 11:00:00','2026-07-03 11:30:00',FALSE,0,NULL,3,'2026-07-03 11:00:00'),
('अर्जुन विष्णू पाटील','9823200016','सांगवडेवाडी, करवीर','कोल्हापूर','416209',NULL,NULL,'GRIEVANCE','शेततळे योजनेसाठी निवेदन.','2026-07-04 09:00:00','2026-07-04 09:45:00',FALSE,0,NULL,3,'2026-07-04 09:00:00'),
('मनीषा सुरेश जाधव','9823200017','दिंडनेर्ली, करवीर','कोल्हापूर','416214',11,NULL,'GRIEVANCE','नळ योजना बंद पडली, तक्रार.','2026-07-04 09:30:00','2026-07-04 10:15:00',FALSE,0,NULL,3,'2026-07-04 09:30:00'),
('गोपाळ दिनकर गुरव','9823200018','इस्पुर्ली, करवीर','कोल्हापूर','416216',12,NULL,'PERSONAL_MEETING','अपंग पेन्शन अर्ज मदतीसाठी आले.','2026-07-04 10:00:00','2026-07-04 10:45:00',FALSE,0,NULL,3,'2026-07-04 10:00:00'),
('रत्नाबाई महादेव पाटील','9823200019','वडकशिवाले, करवीर','कोल्हापूर','416213',13,NULL,'RECOMMENDATION','मुलाच्या नोकरीसाठी शिफारस.','2026-07-04 11:00:00','2026-07-04 11:30:00',FALSE,0,NULL,3,'2026-07-04 11:00:00'),
('सुनील बाळकृष्ण कदम','9823200020','चुये, करवीर','कोल्हापूर','416211',14,NULL,'GENERAL_INQUIRY','MGNREGA माहिती घेण्यासाठी आले.','2026-07-04 11:30:00','2026-07-04 12:00:00',FALSE,0,NULL,3,'2026-07-04 11:30:00'),
('प्रमोद शंकर माने','9823200021','शाहूनगर, कोल्हापूर','कोल्हापूर','416001',NULL,3,'GRIEVANCE','वीज बिलाची तक्रार.','2026-07-07 09:15:00','2026-07-07 09:55:00',TRUE,1,NULL,3,'2026-07-07 09:15:00'),
('आशा विनायक पाटील','9823200022','राजारामपुरी, कोल्हापूर','कोल्हापूर','416008',NULL,1,'DOCUMENT_SUBMISSION','विधवा प्रमाणपत्र मदतीसाठी आल्या.','2026-07-07 10:00:00','2026-07-07 10:35:00',FALSE,0,NULL,3,'2026-07-07 10:00:00'),
('उमेश बाळकृष्ण पाटोळे','9823200023','खेबवडे, करवीर','कोल्हापूर','416218',10,NULL,'GRIEVANCE','जमीन मोजणी तक्रार.','2026-07-07 10:30:00','2026-07-07 11:15:00',FALSE,0,15,3,'2026-07-07 10:30:00'),
('स्वाती अजित चव्हाण','9823200024','नेर्ली, करवीर','कोल्हापूर','416215',2,NULL,'PERSONAL_MEETING','बचत गटाचे कर्ज मागणीसाठी आल्या.','2026-07-07 11:00:00','2026-07-07 11:45:00',FALSE,0,NULL,3,'2026-07-07 11:00:00'),
('भिमराव तुकाराम कांबळे','9823200025','कळंबे तर्फे ठाणे','कोल्हापूर','416201',15,NULL,'PERSONAL_MEETING','संजय गांधी निराधार पेन्शनसाठी मदत.','2026-07-07 14:00:00','2026-07-07 14:45:00',FALSE,0,20,3,'2026-07-07 14:00:00'),
('विकास प्रभाकर देसाई','9823200026','नागाव, करवीर','कोल्हापूर','416207',5,NULL,'GENERAL_INQUIRY','रोजगार हमी योजना माहिती.','2026-07-08 09:00:00','2026-07-08 09:30:00',FALSE,0,NULL,3,'2026-07-08 09:00:00'),
('सरला संतोष गावडे','9823200027','पाचगाव, करवीर','कोल्हापूर','416210',3,NULL,'GRIEVANCE','शाळा इमारत धोकादायक, निवेदन.','2026-07-08 09:30:00','2026-07-08 10:15:00',FALSE,0,NULL,3,'2026-07-08 09:30:00'),
('बाळासाहेब पांडुरंग पाटील','9823200028','सांगवडे, करवीर','कोल्हापूर','416209',1,NULL,'RECOMMENDATION','सरकारी रुग्णालय भरती शिफारस.','2026-07-08 10:00:00','2026-07-08 10:45:00',FALSE,0,NULL,3,'2026-07-08 10:00:00'),
('नलिनी महेश सुतार','9823200029','वडकशिवाले, करवीर','कोल्हापूर','416213',13,NULL,'GRIEVANCE','रस्त्यावर अतिक्रमण तक्रार.','2026-07-08 11:00:00','2026-07-08 11:30:00',FALSE,0,NULL,3,'2026-07-08 11:00:00'),
('अभिजित तानाजी चव्हाण','9823200030','दिंडनेर्ली, करवीर','कोल्हापूर','416214',11,NULL,'PARTY_WORK','पीक विमा अर्ज मदतीसाठी आले.','2026-07-08 11:30:00','2026-07-08 12:00:00',FALSE,0,NULL,3,'2026-07-08 11:30:00'),
('ज्योती रामचंद्र पाटील','9823200031','निगवे खालसा, करवीर','कोल्हापूर','416219',8,NULL,'GRIEVANCE','पूल नाही, नदी ओलांडता येत नाही.','2026-07-09 09:15:00','2026-07-09 10:00:00',FALSE,0,NULL,3,'2026-07-09 09:15:00'),
('संजय श्रीकांत माळकर','9823200032','इस्पुर्ली, करवीर','कोल्हापूर','416216',12,NULL,'PERSONAL_MEETING','सामुदायिक शौचालय दुरुस्ती निधी.','2026-07-09 09:30:00','2026-07-09 10:15:00',FALSE,0,NULL,3,'2026-07-09 09:30:00'),
('रोहिणी बाळासाहेब गायकवाड','9823200033','कावणे, करवीर','कोल्हापूर','416212',7,NULL,'DOCUMENT_SUBMISSION','अधिवास प्रमाणपत्र मदतीसाठी आल्या.','2026-07-09 10:00:00','2026-07-09 10:35:00',FALSE,0,NULL,3,'2026-07-09 10:00:00'),
('विजय मारुती पाटोळे','9823200034','नंदगाव, करवीर','कोल्हापूर','416208',6,NULL,'GENERAL_INQUIRY','जलजीवन मिशन अर्ज माहिती.','2026-07-09 10:30:00','2026-07-09 11:00:00',FALSE,0,NULL,3,'2026-07-09 10:30:00'),
('कमल विठ्ठल जाधव','9823200035','तामगाव, करवीर','कोल्हापूर','416217',9,NULL,'GRIEVANCE','रस्त्यावर पाणी साठते, तक्रार.','2026-07-09 11:00:00','2026-07-09 11:45:00',FALSE,0,NULL,3,'2026-07-09 11:00:00'),
('प्रशांत दिनकर आतिग्रे','9823200036','नागाव, करवीर','कोल्हापूर','416207',5,NULL,'RECOMMENDATION','महावितरण नोकरीसाठी शिफारस.','2026-07-10 09:00:00','2026-07-10 09:45:00',TRUE,2,NULL,3,'2026-07-10 09:00:00'),
('मालती अर्जुन शिंदे','9823200037','राजेंद्रनगर, कोल्हापूर','कोल्हापूर','416008',NULL,4,'GRIEVANCE','पथदिवे बंद आहेत, तक्रार.','2026-07-10 09:30:00','2026-07-10 10:00:00',FALSE,0,NULL,3,'2026-07-10 09:30:00'),
('सुधाकर बाळकृष्ण माने','9823200038','वसगडे, करवीर','कोल्हापूर','416220',4,NULL,'PARTY_WORK','पीक कर्ज माफी माहितीसाठी आले.','2026-07-10 10:00:00','2026-07-10 10:45:00',FALSE,0,NULL,3,'2026-07-10 10:00:00'),
('प्रतिभा संजय पाटील','9823200039','सांगवडेवाडी, करवीर','कोल्हापूर','416209',NULL,NULL,'PERSONAL_MEETING','विधवा पेन्शन अर्ज मदत.','2026-07-10 11:00:00','2026-07-10 11:30:00',FALSE,0,NULL,3,'2026-07-10 11:00:00'),
('नंदकुमार गणपत जगताप','9823200040','लक्षतीर्थ वसाहत, कोल्हापूर','कोल्हापूर','416010',NULL,5,'PERSONAL_MEETING','क्रीडा मैदान निधी मागणी.','2026-07-10 11:30:00','2026-07-10 12:00:00',FALSE,0,NULL,3,'2026-07-10 11:30:00'),
('विमल सदाशिव चव्हाण','9823200041','चुये, करवीर','कोल्हापूर','416211',14,NULL,'GRIEVANCE','पाणीपुरवठा तक्रार घेऊन आले.','2026-07-11 09:00:00',NULL,FALSE,0,NULL,3,'2026-07-11 09:00:00'),
('रतन प्रभाकर कांबळे','9823200042','अवचीतनगर, कोल्हापूर','कोल्हापूर','416012',NULL,2,'GRIEVANCE','वीज खंडन तक्रार.','2026-07-11 09:15:00',NULL,FALSE,0,NULL,3,'2026-07-11 09:15:00'),
('हेमंत बाळासाहेब देसाई','9823200043','नेर्ली, करवीर','कोल्हापूर','416215',2,NULL,'GENERAL_INQUIRY','सरकारी योजनांची माहिती.','2026-07-11 09:30:00',NULL,FALSE,0,NULL,3,'2026-07-11 09:30:00'),
('पूजा विनायक पाटील','9823200044','पाचगाव, करवीर','कोल्हापूर','416210',3,NULL,'RECOMMENDATION','शासकीय नोकरी शिफारस.','2026-07-14 09:00:00',NULL,FALSE,0,NULL,3,'2026-07-14 09:00:00'),
('प्रदीप शंकर गावडे','9823200045','कावणे, करवीर','कोल्हापूर','416212',7,NULL,'DOCUMENT_SUBMISSION','जन्म दाखला मदत.','2026-07-14 09:30:00',NULL,FALSE,0,NULL,3,'2026-07-14 09:30:00'),
('मेघा संतोष पाटील','9823200046','तामगाव, करवीर','कोल्हापूर','416217',9,NULL,'GRIEVANCE','रस्त्यावर खड्डे तक्रार.','2026-07-14 10:00:00',NULL,FALSE,0,NULL,3,'2026-07-14 10:00:00'),
('दीपक रामराव सावंत','9823200047','खेबवडे, करवीर','कोल्हापूर','416218',10,NULL,'GRIEVANCE','जमीन वाद तक्रार.','2026-07-14 10:30:00',NULL,FALSE,0,NULL,3,'2026-07-14 10:30:00'),
('सुमन विजय कदम','9823200048','वसगडे, करवीर','कोल्हापूर','416220',4,NULL,'PERSONAL_MEETING','ग्रामपंचायत निधी मागणी.','2026-07-14 11:00:00',NULL,FALSE,0,NULL,3,'2026-07-14 11:00:00'),
('रमेश नामदेव सुतार','9823200049','दिंडनेर्ली, करवीर','कोल्हापूर','416214',11,NULL,'PARTY_WORK','शेती कर्ज माफीची माहिती.','2026-07-15 09:00:00',NULL,FALSE,0,NULL,3,'2026-07-15 09:00:00'),
('गीता बाळकृष्ण माळकर','9823200050','निगवे खालसा, करवीर','कोल्हापूर','416219',8,NULL,'GENERAL_INQUIRY','सरकारी योजनांची माहिती घेण्यासाठी आल्या.','2026-07-15 09:30:00',NULL,FALSE,0,NULL,3,'2026-07-15 09:30:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '06_visitors.sql'), visitors_sql);
console.log('✅ Written: 06_visitors.sql (50 records)');

// ── FILE 8: 08_calendar_events.sql ───────────────────────────────────────────
const calendar_sql = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 08_calendar_events.sql
-- 5 Office Calendar Events
-- Valid event_type: MEETING, PUBLIC_PROGRAM, GOVT_DEADLINE, ASSEMBLY_SESSION, CONSTITUENCY_VISIT, PERSONAL
-- ============================================================

INSERT INTO calendar_events
  (title, description, event_type, event_date, start_time, end_time,
   location, attendees, is_recurring, recurrence_rule, reminder_minutes,
   is_cancelled, created_by, created_at, updated_at)
VALUES

('राधानगरी धरण पाहणी दौरा', 'पाणी वाटप आणि जलसाठा आढाव्यासाठी राधानगरी धरण भेट. जलसंपदा विभागाचे अधिकारी सोबत.', 'CONSTITUENCY_VISIT', '2026-08-10', '08:00:00', '13:00:00', 'राधानगरी धरण, कोल्हापूर', NULL, FALSE, NULL, 60, FALSE, 1, '2026-07-25 10:00:00', '2026-07-25 10:00:00'),
('करवीर तालुका कार्यकर्ता मेळावा', 'करवीर तालुक्यातील बूथ प्रमुख, शक्तीकेंद्र प्रमुख आणि कार्यकर्त्यांचा मासिक मेळावा.', 'PUBLIC_PROGRAM', '2026-08-15', '14:00:00', '17:00:00', 'करवीर पंचायत समिती सभागृह, कोल्हापूर', NULL, FALSE, NULL, 60, FALSE, 1, '2026-07-28 11:00:00', '2026-07-28 11:00:00'),
('जिल्हा नियोजन समिती बैठक', '२०२६-२७ वार्षिक योजना आराखड्यावर जिल्हा नियोजन समिती बैठक. कोल्हापूर दक्षिण मतदारसंघाचे प्रस्ताव सादर करायचे आहेत.', 'MEETING', '2026-08-20', '10:00:00', '13:00:00', 'जिल्हाधिकारी कार्यालय, कोल्हापूर', NULL, FALSE, NULL, 120, FALSE, 2, '2026-07-30 09:00:00', '2026-07-30 09:00:00'),
('लक्षतीर्थ वसाहत — जनसंपर्क दिवस', 'लक्षतीर्थ वसाहत परिसरात जनसंपर्क कार्यक्रम. नागरिकांच्या तक्रारी ऐकणे व मदत करणे.', 'PUBLIC_PROGRAM', '2026-08-25', '09:00:00', '12:00:00', 'लक्षतीर्थ वसाहत सामुदायिक सभागृह, कोल्हापूर', NULL, FALSE, NULL, 30, FALSE, 1, '2026-08-01 10:00:00', '2026-08-01 10:00:00'),
('स्वातंत्र्य दिन ध्वजारोहण कार्यक्रम', '१५ ऑगस्ट स्वातंत्र्य दिन निमित्त ध्वजारोहण व सांस्कृतिक कार्यक्रम. शाळा विद्यार्थी व नागरिकांचा सहभाग.', 'PUBLIC_PROGRAM', '2026-08-15', '07:30:00', '09:30:00', 'शाहूनगर मैदान, कोल्हापूर', NULL, FALSE, NULL, 30, FALSE, 2, '2026-08-01 11:00:00', '2026-08-01 11:00:00');
`;

fs.writeFileSync(path.join(OUT_DIR, '08_calendar_events.sql'), calendar_sql);
console.log('✅ Written: 08_calendar_events.sql (5 records)');

console.log('\n════════════════════════════════════════════════════');
console.log('✅ ALL KOLHAPUR SAMPLE DATA GENERATED SUCCESSFULLY WITH 100% MATCHING SCHEMA!');
console.log('════════════════════════════════════════════════════');
