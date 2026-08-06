-- ============================================================
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
