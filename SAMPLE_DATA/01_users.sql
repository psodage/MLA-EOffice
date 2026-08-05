-- ============================================================
-- SAMPLE DATA — 01_users.sql
-- 7 System User Accounts (all 7 roles covered)
-- Fictional constituency: Pune Cantonment (Pune District)
--
-- ⚠️  Passwords are bcrypt hashes (12 salt rounds)
--     Plain-text → bcrypt hash mapping:
--       Mla@2026#Pune    → hash below
--       Pa@2026#Pune     → hash below
--       Clerk@2026#Pune  → hash below
--       Audit@2026#Pune  → hash below
--       Booth@2026#Pune  → hash below
--       Citizen@2026     → hash below
--       Admin@MLA2026    → hash below
--
--     To regenerate: node -e "const b=require('bcryptjs'); console.log(b.hashSync('Pa@2026#Pune',12))"
-- ============================================================

-- Clear existing (dev only)
-- TRUNCATE TABLE users;  -- Uncomment only if safe to wipe

INSERT INTO users
  (full_name, username, password_hash, role, mobile, email, accessible_modules, is_active, password_changed_at, created_at, updated_at)
VALUES


-- 1. MLA — Full access
(
  'आ. सुरेश पाटील',
  'mla_suresh',
  '$2a$12$mprpqKSuufy9Ovt5P57w6Oc9N14VB16tB5Sc3dxW1mdX4AnivVQEi',
  'MLA',
  '9800000001',
  'suresh.patil.mla@example.com',
  '["inward","outward","nivedan","visitor","devworks","karyakarta","booth","geography","calendar","whatsapp","dashboard","reports","notifications","users"]',
  TRUE,
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00'
),

-- 2. PA (Personal Assistant) — Operational manager
(
  'मीना देशमुख',
  'pa_meena',
  '$2a$12$kJHiroLqLAYN5/iLT1qvSuPmRe7mbIsBz9HUnt5v1rIISzygK91Re',
  'PA',
  '9800000002',
  'meena.deshmukh.pa@example.com',
  '["inward","outward","nivedan","visitor","devworks","karyakarta","booth","geography","calendar","whatsapp","dashboard","reports","notifications"]',
  TRUE,
  '2026-01-10 09:05:00',
  '2026-01-10 09:05:00',
  '2026-01-10 09:05:00'
),

-- 3. Receptionist / Front Desk Clerk
(
  'रमेश जाधव',
  'clerk_ramesh',
  '$2a$12$RBAxDdSfHoDY/Yvfx//Rv.iR6f4bBobdmZG6ZlngYH2ZzsbKhgZTS',
  'RECEPTIONIST',
  '9800000003',
  'ramesh.jadhav.clerk@example.com',
  '["visitor","nivedan","inward","dashboard","notifications"]',
  TRUE,
  '2026-01-10 09:10:00',
  '2026-01-10 09:10:00',
  '2026-01-10 09:10:00'
),

-- 4. Field Auditor / Assessor
(
  'प्रिया मोरे',
  'auditor_priya',
  '$2a$12$dGUgFfZ/UhndwFcIAIpS4OUxkkgO36/nPEFVxu49MfLywZ561yzca',
  'AUDITOR',
  '9800000004',
  'priya.more.auditor@example.com',
  '["devworks","booth","geography","dashboard","notifications"]',
  TRUE,
  '2026-01-10 09:15:00',
  '2026-01-10 09:15:00',
  '2026-01-10 09:15:00'
),

-- 5. Booth Pramukh — Ground-level party worker
(
  'गणेश शिंदे',
  'bp_ganesh',
  '$2a$12$mrc3QWXFnJ04Y90qvWqrO.9GNlQXv/IAlh5ek1h3rgwxwTBeWQAdq',
  'BOOTH_PRAMUKH',
  '9800000005',
  NULL,
  '["karyakarta","booth","geography","notifications"]',
  TRUE,
  '2026-01-10 09:20:00',
  '2026-01-10 09:20:00',
  '2026-01-10 09:20:00'
),

-- 6. Citizen — Public tracking portal only
(
  'अजय कांबळे (Test Citizen)',
  'citizen_test',
  '$2a$12$Q3m2relpGhQrte6Bl0DGoeDckzAcGc01BiyvFpUxoQvYqMQacJoDG',
  'CITIZEN',
  '9800000006',
  NULL,
  '[]',
  TRUE,
  '2026-01-10 09:25:00',
  '2026-01-10 09:25:00',
  '2026-01-10 09:25:00'
),

-- 7. System Administrator
(
  'System Admin',
  'admin',
  '$2a$12$g8MCfkuzOcNbB2foJ0iXYe/R2nt7pjFAYWkeUZZpkLVvutcmIOnUi',
  'ADMIN',

  '9800000007',
  'admin@mlaeoffice.local',
  '["inward","outward","nivedan","visitor","devworks","karyakarta","booth","geography","calendar","whatsapp","dashboard","reports","notifications","users","settings","audit"]',
  TRUE,
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00'
);

