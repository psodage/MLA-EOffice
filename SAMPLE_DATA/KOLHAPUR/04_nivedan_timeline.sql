-- ============================================================
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
