-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 06_visitors.sql
-- 20 Dual-Language Visitor Log Entries (Marathi + English)
-- Supports today visitors, active in-office status & linked Nivedan IDs
-- ============================================================

INSERT INTO visitors
  (visitor_name, visitor_name_en, mobile, address_line, village_id, ward_id,
   purpose, purpose_description, purpose_description_en, check_in_time, check_out_time,
   linked_nivedan_id, created_by, created_at)
VALUES

('प्रकाश विठ्ठल पाटील', 'Prakash Vithal Patil', '9823100001', 'प्लॉट क्र. ५, राजारामपुरी, कोल्हापूर', NULL, 1, 'GRIEVANCE', 'पाणीपुरवठा खंडित झाल्याबाबत निवेदन दिले.', 'Water supply disruption grievance petition submitted.', '2026-08-06 09:00:00', '2026-08-06 09:30:00', 1, 3, '2026-08-06 09:00:00'),
('सुमन रमेश जाधव', 'Suman Ramesh Jadhav', '9823100002', 'गाळा क्र. १२, अवचीतनगर, कोल्हापूर', NULL, 2, 'GRIEVANCE', 'प्राथमिक आरोग्य केंद्र समस्या मांडली.', 'Primary Health Centre doctor availability issue raised.', '2026-08-06 10:15:00', '2026-08-06 10:45:00', 2, 3, '2026-08-06 10:15:00'),
('अजित बाळू चव्हाण', 'Ajit Balu Chavan', '9823100003', 'शाहूनगर, कोल्हापूर', NULL, 3, 'GRIEVANCE', 'रस्त्यावरील खड्ड्यांबाबत आमदारांची भेट घेतली.', 'Met MLA regarding internal road potholes in Shahunagar.', '2026-08-06 10:45:00', '2026-08-06 11:20:00', 3, 3, '2026-08-06 10:45:00'),
('मारुती रामचंद्र पाटील', 'Maruti Ramchandra Patil', '9823100004', 'सांगवडे, करवीर', 1, NULL, 'PERSONAL_MEETING', 'वीज खंडन समस्येबाबत आमदारांना निवेदन सुपूर्द केले.', 'Handed over petition to MLA regarding electricity cuts in Sangavde.', '2026-08-06 11:00:00', '2026-08-06 11:40:00', 4, 3, '2026-08-06 11:00:00'),
('संतोष दादा पाटील', 'Santosh Dada Patil', '9823100005', 'नेर्ली, करवीर', 2, NULL, 'FOLLOWUP', '७/१२ उतारा मिळावा म्हणून पाठपुरावा केला.', 'Followed up on pending 7/12 land extract issuance.', '2026-08-06 11:30:00', '2026-08-06 12:10:00', 5, 3, '2026-08-06 11:30:00'),
('गीता बाळकृष्ण माळकर', 'Geeta Balakrishna Malkar', '9823100017', 'इस्पुर्ली, करवीर', 12, NULL, 'GENERAL_INQUIRY', 'सामान्य चौकशी व आमदारांची सदिच्छा भेट.', 'General Inquiry & courtesy visit to meet MLA.', '2026-08-06 12:00:00', '2026-08-06 12:30:00', NULL, 3, '2026-08-06 12:00:00'),
('विनोद रामचंद्र शेळके', 'Vinod Ramchandra Shelke', '9823100021', 'वडगाव, करवीर', 1, NULL, 'RECOMMENDATION', 'वडगाव गावात नवीन समाजमंदिर बांधण्याबाबत मागणी.', 'Development work request for new community hall in Wadgaon.', '2026-08-06 12:15:00', '2026-08-06 12:55:00', NULL, 3, '2026-08-06 12:15:00'),
('प्रमोद गजानन जोशी', 'Pramod Gajanan Joshi', '9823100022', 'राजारामपुरी, कोल्हापूर', NULL, 1, 'INVITATION', 'वार्षिक गणेशोत्सव कार्यक्रमाचे निमंत्रण पत्र सुपूर्द केले.', 'Handed over invitation letter for annual Ganeshotsav event.', '2026-08-06 13:00:00', '2026-08-06 13:25:00', NULL, 3, '2026-08-06 13:00:00'),
('सुरेश गणपत पवार', 'Suresh Ganpat Pawar', '9823100023', 'उचगाव, करवीर', 3, NULL, 'COURTESY_CALL', 'शाळा दुरुस्ती निधी मंजूर झाल्याबद्दल आमदारांचे आभार मानले.', 'Courtesy visit to thank MLA for sanctioning school repair funds.', '2026-08-06 13:30:00', '2026-08-06 14:00:00', NULL, 3, '2026-08-06 13:30:00'),
('रेखा विनायक माने', 'Rekha Vinayak Mane', '9823100006', 'पाचगाव, करवीर', 3, NULL, 'GRIEVANCE', 'शाळेतील शिक्षकांची कमतरता दूर करण्यासाठी भेट.', 'Visited regarding shortage of school teachers.', '2026-08-06 13:45:00', NULL, 6, 3, '2026-08-06 13:45:00'),
('द्रौपदाबाई बाळासाहेब कदम', 'Draupadabai Balasaheb Kadam', '9823100007', 'राजेंद्रनगर, कोल्हापूर', NULL, 4, 'FOLLOWUP', 'निवृत्तीवेतन मिळण्याबाबत पाठपुरावा भेट.', 'Follow-up visit regarding old age pension arrears.', '2026-08-06 14:00:00', NULL, 7, 3, '2026-08-06 14:00:00'),
('गोपाळ शंकर कांबळे', 'Gopal Shankar Kamble', '9823100008', 'वसगडे, करवीर', 4, NULL, 'DOCUMENT_SUBMISSION', 'नवीन रेशनकार्ड अर्जाची कागदपत्रे जमा केली.', 'Submitted supporting documents for ration card.', '2026-08-06 14:10:00', NULL, 8, 3, '2026-08-06 14:10:00'),
('विशाल प्रभाकर देसाई', 'Vishal Prabhakar Desai', '9823100009', 'नागाव, करवीर', 5, NULL, 'DOCUMENT_SUBMISSION', 'उत्पन्न दाखल्याचा अर्ज दाखल केला.', 'Submitted application for income certificate.', '2026-08-06 10:00:00', '2026-08-06 10:30:00', 9, 3, '2026-08-06 10:00:00'),
('शांताबाई युवराज माने', 'Shantabai Yuvraj Mane', '9823100010', 'नंदगाव, करवीर', 6, NULL, 'FOLLOWUP', 'घरकुल योजनेच्या पुढील हप्त्यासाठी पाठपुरावा.', 'Follow-up for next PMAY housing instalment.', '2026-08-06 10:30:00', '2026-08-06 11:15:00', 10, 3, '2026-08-06 10:30:00'),
('तानाजी बाबुराव पाटील', 'Tanaji Baburao Patil', '9823100011', 'कावणे, करवीर', 7, NULL, 'PERSONAL_MEETING', 'कृषी पंपाला वीज जोडणी मिळाल्याबद्दल भेट.', 'Visit after receiving agricultural pump electricity connection.', '2026-08-06 11:15:00', '2026-08-06 11:50:00', 11, 3, '2026-08-06 11:15:00'),
('रोहन दत्ता जगताप', 'Rohan Datta Jagtap', '9823100012', 'निगवे खालसा, करवीर', 8, NULL, 'DOCUMENT_SUBMISSION', 'मनरेगा जॉब कार्ड नोंदणीसाठी अर्ज दिला.', 'Submitted application for MGNREGA Job Card.', '2026-08-06 11:40:00', '2026-08-06 12:20:00', 12, 3, '2026-08-06 11:40:00'),
('किरण संजय देशमुख', 'Kiran Sanjay Deshmukh', '9823100013', 'लक्षतीर्थ वसाहत, कोल्हापूर', NULL, 5, 'GRIEVANCE', 'अवैध दारूविक्रीविरोधात तक्रार देण्यासाठी भेट.', 'Met to complain against illegal liquor sales.', '2026-08-06 12:10:00', '2026-08-06 12:45:00', 13, 3, '2026-08-06 12:10:00'),
('प्रभाकर नामदेव गायकवाड', 'Prabhakar Namdeo Gaikwad', '9823100014', 'तामगाव, करवीर', 9, NULL, 'GRIEVANCE', 'सार्वजनिक शौचालय दुरुस्तीबाबत निवेदन दिले.', 'Submitted petition for public toilet repairs.', '2026-08-06 12:30:00', '2026-08-06 13:00:00', 14, 3, '2026-08-06 12:30:00'),
('महेश रामचंद्र शेटे', 'Mahesh Ramchandra Shete', '9823100024', 'कसबा बावडा, कोल्हापूर', NULL, 6, 'PARTY_WORK', 'पक्ष संघटनात्मक बैठकीसाठी भेट दिली.', 'Visited for party organizational strategy meeting.', '2026-08-06 13:15:00', '2026-08-06 13:50:00', NULL, 3, '2026-08-06 13:15:00'),
('सुप्रिया गजानन साळोखे', 'Supriya Gajanan Salokhe', '9823100025', 'तपोवन, कोल्हापूर', NULL, 7, 'INVITATION', 'शासकीय कन्या शाळा स्नेहमेलन निमंत्रण पत्र दिले.', 'Handed over invitation for ZP Girls School annual function.', '2026-08-06 13:30:00', '2026-08-06 13:55:00', NULL, 3, '2026-08-06 13:30:00');
