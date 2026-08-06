-- ============================================================
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
