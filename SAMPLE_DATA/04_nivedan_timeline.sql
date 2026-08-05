-- ============================================================
-- SAMPLE DATA — 04_nivedan_timeline.sql
-- 40 Timeline entries for NIV-2026-00001 to NIV-2026-00020
-- Covers all action types from the ENUM
--
-- Action types used:
--   CREATED, STATUS_CHANGE, ASSIGNED, FORWARDED,
--   NOTE_ADDED, WHATSAPP_SENT, ESCALATED, RESOLVED,
--   REJECTED, CANCELLED, ARCHIVED
--
-- FK assumptions:
--   nivedan_id          → nivedans.id (1–20 from 03_nivedans.sql)
--   performed_by        → users.id (1=MLA, 2=PA, 3=Clerk)
--   assigned_to_user_id → users.id
--   department_id       → departments.id
-- ============================================================

INSERT INTO nivedan_timeline
  (nivedan_id, action_type, old_status, new_status,
   assigned_to_user_id, department_id,
   note, is_internal, performed_by, created_at)
VALUES

-- ────────────────────────────────────────────────────────────
-- NIV-2026-00001: PENDING (Water Supply – HIGH)
-- ────────────────────────────────────────────────────────────
(1, 'CREATED',       NULL,          'PENDING',    NULL, NULL,
 'निवेदन नोंद केले — नागरिक संगीता विठ्ठल पवार यांनी कार्यालयात येऊन सांगितले.',
 FALSE, 3, '2026-07-28 09:15:00'),

(1, 'WHATSAPP_SENT', 'PENDING',     'PENDING',    NULL, NULL,
 'WhatsApp पोच पावती पाठवण्यात आली: "आपले निवेदन NIV-2026-00001 नोंद झाले."',
 FALSE, 3, '2026-07-28 09:16:00'),

-- ────────────────────────────────────────────────────────────
-- NIV-2026-00004: IN_PROGRESS → FORWARDED (Road – HIGH)
-- ────────────────────────────────────────────────────────────
(4, 'CREATED',       NULL,          'PENDING',    NULL, NULL,
 'निवेदन नोंद केले — अर्चना देशपांडे यांनी कार्यालयात येऊन दिले.',
 FALSE, 3, '2026-07-15 09:00:00'),

(4, 'WHATSAPP_SENT', 'PENDING',     'PENDING',    NULL, NULL,
 'WhatsApp पोच पावती पाठवण्यात आली.',
 FALSE, 3, '2026-07-15 09:01:00'),

(4, 'ASSIGNED',      'PENDING',     'PENDING',    2,    NULL,
 'PA मीना देशमुख यांना हे प्रकरण हाताळण्यासाठी सांगण्यात आले.',
 TRUE, 3, '2026-07-15 10:00:00'),

(4, 'STATUS_CHANGE', 'PENDING',     'IN_PROGRESS', 2,   NULL,
 'PA ने प्रकरण स्वीकारले. PWD कार्यालयाशी संपर्क साधण्यात आला.',
 TRUE, 2, '2026-07-18 11:00:00'),

(4, 'FORWARDED',     'IN_PROGRESS', 'IN_PROGRESS', NULL, 9,
 'सार्वजनिक बांधकाम विभागाला (PWD) पत्र पाठवण्यात आले. खड्डे दुरुस्तीसाठी विनंती.',
 FALSE, 2, '2026-07-18 14:00:00'),

(4, 'WHATSAPP_SENT', 'IN_PROGRESS', 'IN_PROGRESS', NULL, NULL,
 'WhatsApp अपडेट: "आपले निवेदन PWD कार्यालयाकडे पाठवले आहे."',
 FALSE, 2, '2026-07-18 14:05:00'),

-- ────────────────────────────────────────────────────────────
-- NIV-2026-00006: PENDING → IN_PROGRESS (Escalated Level 1)
-- ────────────────────────────────────────────────────────────
(6, 'CREATED',       NULL,          'PENDING',    NULL, NULL,
 'निवेदन नोंद — रेखा निकम.',
 FALSE, 3, '2026-06-20 11:00:00'),

(6, 'WHATSAPP_SENT', 'PENDING',     'PENDING',    NULL, NULL,
 'WhatsApp पोच पावती.',
 FALSE, 3, '2026-06-20 11:01:00'),

(6, 'STATUS_CHANGE', 'PENDING',     'IN_PROGRESS', 2,   NULL,
 'PA ने प्रकरण घेतले. अन्न व नागरी पुरवठा कार्यालयाशी संपर्क साधला.',
 TRUE, 2, '2026-06-25 10:00:00'),

(6, 'ESCALATED',     'IN_PROGRESS', 'IN_PROGRESS', NULL, NULL,
 '⚠️ Level 1 Escalation: ३५ दिवस झाले — प्रकरण अजून प्रलंबित. PA ला सूचना दिली.',
 TRUE, 2, '2026-07-25 09:00:00'),

-- ────────────────────────────────────────────────────────────
-- NIV-2026-00007: FORWARDED + Escalated Level 1 (Land – HIGH)
-- ────────────────────────────────────────────────────────────
(7, 'CREATED',       NULL,          'PENDING',    NULL, NULL,
 'निवेदन नोंद — विजय भोसले.',
 FALSE, 3, '2026-01-20 09:00:00'),

(7, 'WHATSAPP_SENT', 'PENDING',     'PENDING',    NULL, NULL,
 'WhatsApp पोच पावती.',
 FALSE, 3, '2026-01-20 09:02:00'),

(7, 'ASSIGNED',      'PENDING',     'PENDING',    2,    NULL,
 'PA ला assign केले.',
 TRUE, 3, '2026-01-20 10:00:00'),

(7, 'STATUS_CHANGE', 'PENDING',     'IN_PROGRESS', 2,   NULL,
 'PA ने तहसीलदार कार्यालयाशी दूरध्वनीवर बोलणे केले.',
 TRUE, 2, '2026-01-25 11:00:00'),

(7, 'FORWARDED',     'IN_PROGRESS', 'FORWARDED',  NULL, 2,
 'तहसीलदार, करवीर यांना पत्र पाठवण्यात आले. ७/१२ फेरफार तातडीने करण्याची विनंती.',
 FALSE, 2, '2026-02-01 14:00:00'),

(7, 'ESCALATED',     'FORWARDED',   'FORWARDED',  NULL, NULL,
 '⚠️ Level 1 Escalation: ५ महिने झाले — तहसीलदार कार्यालयाकडून उत्तर नाही. PA ला पुन्हा पाठपुरावा करण्यास सांगितले.',
 TRUE, 2, '2026-07-01 09:00:00'),

(7, 'NOTE_ADDED',    NULL,          NULL,         NULL, NULL,
 'तहसीलदार कार्यालयाने फाईल 'विचाराधीन' असल्याचे सांगितले. पुढील आठवड्यात उत्तर अपेक्षित.',
 TRUE, 2, '2026-07-15 10:00:00'),

-- ────────────────────────────────────────────────────────────
-- NIV-2026-00010: AWAITING_RESPONSE + Level 2 Escalation (Housing – HIGH)
-- ────────────────────────────────────────────────────────────
(10, 'CREATED',       NULL,         'PENDING',    NULL, NULL,
 'निवेदन नोंद — दिनकर गोखले.',
 FALSE, 3, '2026-04-15 10:00:00'),

(10, 'STATUS_CHANGE', 'PENDING',    'IN_PROGRESS', 2,   NULL,
 'PA ने जिल्हाधिकारी कार्यालयाशी संपर्क साधला.',
 TRUE, 2, '2026-04-20 11:00:00'),

(10, 'FORWARDED',     'IN_PROGRESS','FORWARDED',  NULL, 1,
 'जिल्हाधिकारी, कोल्हापूर यांना पत्र — PM आवास योजनेतील लाभार्थीला घर मिळवून देण्याची विनंती.',
 FALSE, 2, '2026-05-01 14:00:00'),

(10, 'STATUS_CHANGE', 'FORWARDED',  'AWAITING_RESPONSE', NULL, NULL,
 'जिल्हाधिकारी कार्यालयाने उत्तर देण्यास वेळ मागितला.',
 TRUE, 2, '2026-05-15 10:00:00'),

(10, 'ESCALATED',     'AWAITING_RESPONSE','AWAITING_RESPONSE', NULL, NULL,
 '⚠️ Level 1 Escalation: ४५ दिवस झाले.',
 TRUE, 2, '2026-06-15 09:00:00'),

(10, 'ESCALATED',     'AWAITING_RESPONSE','AWAITING_RESPONSE', NULL, NULL,
 '🚨 Level 2 Escalation: आमदार महोदय यांना माहिती दिली. MLA ने जिल्हाधिकाऱ्यांशी थेट बोलणे केले.',
 TRUE, 1, '2026-07-10 09:00:00'),

-- ────────────────────────────────────────────────────────────
-- NIV-2026-00011: RESOLVED (Water Supply)
-- ────────────────────────────────────────────────────────────
(11, 'CREATED',       NULL,         'PENDING',    NULL, NULL,
 'निवेदन नोंद — सुमन देसाई.',
 FALSE, 3, '2026-06-12 09:00:00'),

(11, 'STATUS_CHANGE', 'PENDING',    'IN_PROGRESS', 2,   NULL,
 'PA ने पाणीपुरवठा विभागाशी संपर्क साधला.',
 TRUE, 2, '2026-06-14 10:00:00'),

(11, 'FORWARDED',     'IN_PROGRESS','FORWARDED',  NULL, 10,
 'पाणीपुरवठा विभागाला तातडीने दुरुस्तीसाठी पत्र दिले.',
 FALSE, 2, '2026-06-15 14:00:00'),

(11, 'NOTE_ADDED',    NULL,         NULL,         NULL, NULL,
 'पाणीपुरवठा विभागाचे कर्मचारी जागेवर जाऊन तपासणी करणार आहेत. उद्या सकाळी.',
 TRUE, 2, '2026-07-14 16:00:00'),

(11, 'RESOLVED',      'FORWARDED',  'RESOLVED',   NULL, NULL,
 'नळ जोडणी दुरुस्त झाली. नागरिकाशी फोनवर बोललो, ते समाधानी आहेत.',
 FALSE, 2, '2026-07-15 16:00:00'),

(11, 'WHATSAPP_SENT', 'RESOLVED',   'RESOLVED',   NULL, NULL,
 'WhatsApp: "आपले निवेदन NIV-2026-00011 निकाली काढण्यात आले. पाणीपुरवठा सुरळीत झाला."',
 FALSE, 2, '2026-07-15 16:05:00'),

-- ────────────────────────────────────────────────────────────
-- NIV-2026-00013: RESOLVED (Electricity – HIGH)
-- ────────────────────────────────────────────────────────────
(13, 'CREATED',       NULL,         'PENDING',    NULL, NULL,
 'निवेदन नोंद — गीता पाटील.',
 FALSE, 3, '2026-05-02 08:00:00'),

(13, 'STATUS_CHANGE', 'PENDING',    'IN_PROGRESS', 2,   NULL,
 'PA ने महावितरण अधीक्षक अभियंत्याशी तातडीने संपर्क साधला. HIGH priority.',
 TRUE, 2, '2026-05-02 09:00:00'),

(13, 'NOTE_ADDED',    NULL,         NULL,         NULL, NULL,
 'महावितरणाने नवीन ट्रान्सफॉर्मर २-३ दिवसांत बसवण्याचे आश्वासन दिले.',
 TRUE, 2, '2026-05-03 11:00:00'),

(13, 'RESOLVED',      'IN_PROGRESS','RESOLVED',   NULL, NULL,
 'नवीन ट्रान्सफॉर्मर बसवण्यात आला. वीजपुरवठा सुरळीत.',
 FALSE, 2, '2026-05-05 18:00:00'),

(13, 'WHATSAPP_SENT', 'RESOLVED',   'RESOLVED',   NULL, NULL,
 'WhatsApp निराकरण सूचना पाठवली.',
 FALSE, 2, '2026-05-05 18:10:00'),

-- ────────────────────────────────────────────────────────────
-- NIV-2026-00015: REJECTED (Police – out of jurisdiction)
-- ────────────────────────────────────────────────────────────
(15, 'CREATED',       NULL,         'PENDING',    NULL, NULL,
 'निवेदन नोंद — नागेश सावंत.',
 FALSE, 3, '2026-06-05 10:00:00'),

(15, 'REJECTED',      'PENDING',    'REJECTED',   NULL, NULL,
 'हे प्रकरण दिवाणी न्यायालयाच्या अखत्यारीत येते. आमदार कार्यालय हस्तक्षेप करू शकत नाही. नागरिकाला न्यायालयात दावा दाखल करण्यास सांगितले.',
 FALSE, 2, '2026-06-08 14:00:00'),

(15, 'WHATSAPP_SENT', 'REJECTED',   'REJECTED',   NULL, NULL,
 'WhatsApp: "आपले निवेदन NIV-2026-00015 या कार्यालयाच्या अधिकारक्षेत्रात येत नाही. कृपया दिवाणी न्यायालयात दावा दाखल करावा."',
 FALSE, 2, '2026-06-08 14:30:00'),

-- ────────────────────────────────────────────────────────────
-- NIV-2026-00019 & 00020: ARCHIVED
-- ────────────────────────────────────────────────────────────
(19, 'ARCHIVED',      'RESOLVED',   'ARCHIVED',   NULL, NULL,
 '९०+ दिवस झाले. जुने निकाली प्रकरण — Auto-archive.',
 TRUE, 2, '2026-05-01 00:00:00'),

(20, 'ARCHIVED',      'RESOLVED',   'ARCHIVED',   NULL, NULL,
 '९०+ दिवस झाले. जुने निकाली प्रकरण — Auto-archive.',
 TRUE, 2, '2026-04-15 00:00:00');
