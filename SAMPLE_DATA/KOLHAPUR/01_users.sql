-- ============================================================
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
