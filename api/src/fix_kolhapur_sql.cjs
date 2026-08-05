// fix_kolhapur_sql.cjs
// Fixes column mismatches in KOLHAPUR SQL files to match actual DB schema
const fs = require('fs');
const path = require('path');

const DIR = path.resolve(__dirname, '../../SAMPLE_DATA/KOLHAPUR');

// ── Fix 03_nivedans.sql ───────────────────────────────────────────────────────
// Need: add linked_visitor_id (NULL) before resolved_at
//       add updated_by after created_by
// Pattern each row trailing: whatsapp_notified, resolved_at,\n  3, '...', '...')
// Replace: add NULL (linked_visitor_id) before resolved_at, add 2 for updated_by

let nivedans = fs.readFileSync(path.join(DIR, '03_nivedans.sql'), 'utf8');

// Fix column list: add linked_visitor_id, updated_by
nivedans = nivedans.replace(
  'whatsapp_notified, resolved_at,\n   created_by, created_at, updated_at)',
  'whatsapp_notified, linked_visitor_id, resolved_at,\n   created_by, updated_by, created_at, updated_at)'
);

// Fix each row: "FALSE, NULL,\n 3, " → "FALSE, NULL, NULL,\n 3, 2, "  (PENDING rows)
// and "TRUE, NULL,\n 3, "  → "TRUE, NULL, NULL,\n 3, 2, "
// and "FALSE, '...date...',\n 3," for RESOLVED rows
// Pattern: (TRUE|FALSE), (NULL|'date'),\n  3, '

nivedans = nivedans.replace(
  /( FALSE, NULL,\n )( 3, ')('2026-)/g,
  ' FALSE, NULL, NULL,\n $2$3'
);
nivedans = nivedans.replace(
  /( TRUE, NULL,\n )( 3, ')('2026-)/g,
  ' TRUE, NULL, NULL,\n $2$3'
);
nivedans = nivedans.replace(
  /( FALSE, '2026-\d{2}-\d{2} \d{2}:\d{2}:\d{2}',\n )( 3, ')('2026-)/g,
  (m, a, b, c) => a.replace(/(\n )/, ', NULL,\n ') + b + c
);
nivedans = nivedans.replace(
  /( TRUE, '2026-\d{2}-\d{2} \d{2}:\d{2}:\d{2}',\n )( 3, ')('2026-)/g,
  (m, a, b, c) => a.replace(/(\n )/, ', NULL,\n ') + b + c
);

// Add updated_by=2 after created_by=3: "  3, '2026-...', '2026-" → "  3, 2, '2026-...', '2026-"
nivedans = nivedans.replace(/ 3, ('2026-[^']+', '2026-)/g, " 3, 2, $1");

fs.writeFileSync(path.join(DIR, '03_nivedans.sql'), nivedans);
console.log('Checking result of 03_nivedans.sql replacement...');

// Verify fix by counting columns in column header
const colLine = nivedans.match(/INSERT INTO nivedans\s*\(([\s\S]*?)\)\s*VALUES/);
if (colLine) {
  const cols = colLine[1].split(',').map(c => c.trim().replace(/\n/g,''));
  console.log('  nivedans columns:', cols.length, '→', cols.join(', '));
}

// ── Fix 02_inward_entries.sql ─────────────────────────────────────────────────
// Schema has updated_by — need to add it after created_by in column list and rows
let inward = fs.readFileSync(path.join(DIR, '02_inward_entries.sql'), 'utf8');

if (!inward.includes('updated_by')) {
  inward = inward.replace(
    'created_by, created_at, updated_at)',
    'created_by, updated_by, created_at, updated_at)'
  );
  // Each row ends with:  3, '2026-...', '2026-...')
  inward = inward.replace(/ 3, ('2026-[^']+', '2026-[^']+'\))/g, " 3, 2, $1");
  fs.writeFileSync(path.join(DIR, '02_inward_entries.sql'), inward);
  console.log('✅ Fixed 02_inward_entries.sql (added updated_by)');
} else {
  console.log('   02_inward_entries.sql already has updated_by');
}

// ── Fix 05_development_works.sql ─────────────────────────────────────────────
// Schema already has updated_by — check
let devworks = fs.readFileSync(path.join(DIR, '05_development_works.sql'), 'utf8');
console.log('   05_development_works.sql has updated_by:', devworks.includes('updated_by'));

// ── Fix 08_calendar_events.sql ───────────────────────────────────────────────
// DB schema: title, description, event_type, event_date, start_time, end_time,
//   location, attendees, is_recurring, recurrence_rule, reminder_minutes,
//   is_cancelled, created_by, created_at, updated_at
// Our SQL has village_id, ward_id which don't exist

let calendar = fs.readFileSync(path.join(DIR, '08_calendar_events.sql'), 'utf8');

// Rewrite entirely with correct schema
const newCalendar = `-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 08_calendar_events.sql
-- 5 Office Calendar Events — Kolhapur South MLA Office
-- ============================================================

INSERT INTO calendar_events
  (title, description, event_type, event_date, start_time, end_time,
   location, attendees, is_recurring, recurrence_rule, reminder_minutes,
   is_cancelled, created_by, created_at, updated_at)
VALUES

('राधानगरी धरण पाहणी दौरा',
 'पाणी वाटप आणि जलसाठा आढाव्यासाठी राधानगरी धरण भेट. जलसंपदा विभागाचे अधिकारी सोबत.',
 'FIELD_VISIT',
 '2026-08-10', '08:00:00', '13:00:00',
 'राधानगरी धरण, कोल्हापूर',
 NULL, FALSE, NULL, 60, FALSE,
 1, '2026-07-25 10:00:00', '2026-07-25 10:00:00'),

('करवीर तालुका कार्यकर्ता मेळावा',
 'करवीर तालुक्यातील बूथ प्रमुख, शक्तीकेंद्र प्रमुख आणि कार्यकर्त्यांचा मासिक मेळावा.',
 'PARTY_PROGRAM',
 '2026-08-15', '14:00:00', '17:00:00',
 'करवीर पंचायत समिती सभागृह, कोल्हापूर',
 NULL, FALSE, NULL, 60, FALSE,
 1, '2026-07-28 11:00:00', '2026-07-28 11:00:00'),

('जिल्हा नियोजन समिती बैठक',
 '२०२६-२७ वार्षिक योजना आराखड्यावर जिल्हा नियोजन समिती बैठक. कोल्हापूर दक्षिण मतदारसंघाचे प्रस्ताव सादर करायचे आहेत.',
 'MEETING',
 '2026-08-20', '10:00:00', '13:00:00',
 'जिल्हाधिकारी कार्यालय, कोल्हापूर',
 NULL, FALSE, NULL, 120, FALSE,
 2, '2026-07-30 09:00:00', '2026-07-30 09:00:00'),

('लक्षतीर्थ वसाहत — जनसंपर्क दिवस',
 'लक्षतीर्थ वसाहत परिसरात जनसंपर्क कार्यक्रम. नागरिकांच्या तक्रारी ऐकणे व मदत करणे.',
 'JANSUNWAI',
 '2026-08-25', '09:00:00', '12:00:00',
 'लक्षतीर्थ वसाहत सामुदायिक सभागृह, कोल्हापूर',
 NULL, FALSE, NULL, 30, FALSE,
 1, '2026-08-01 10:00:00', '2026-08-01 10:00:00'),

('स्वातंत्र्य दिन ध्वजारोहण कार्यक्रम',
 '१५ ऑगस्ट स्वातंत्र्य दिन निमित्त ध्वजारोहण व सांस्कृतिक कार्यक्रम. शाळा विद्यार्थी व नागरिकांचा सहभाग.',
 'PROGRAM',
 '2026-08-15', '07:30:00', '09:30:00',
 'शाहूनगर मैदान, कोल्हापूर',
 NULL, FALSE, NULL, 30, FALSE,
 2, '2026-08-01 11:00:00', '2026-08-01 11:00:00');
`;

fs.writeFileSync(path.join(DIR, '08_calendar_events.sql'), newCalendar);
console.log('✅ Fixed 08_calendar_events.sql (corrected schema)');

console.log('\n✅ All SQL fixes complete!');
