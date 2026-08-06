-- ============================================================
-- SAMPLE DATA (KOLHAPUR) — 01_users.sql
-- 7 System User Accounts
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
  '2026-01-10 09:05:00',
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
  '2026-01-10 09:10:00',
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
  '2026-01-10 09:15:00',
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
  '2026-01-10 09:20:00',
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
  '2026-01-10 09:25:00',
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
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00'
);
