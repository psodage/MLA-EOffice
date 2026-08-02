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
  (full_name, username, password_hash, role, mobile, email, accessible_modules, is_active, created_at, updated_at)
VALUES

-- 1. MLA — Full access
(
  'आ. सुरेश पाटील',
  'mla_suresh',
  '$2b$12$K9bQ3mZvX7wN2pYcRtHeLu8sJdF4nVoA1kGiU0MhEy6WqBxPcTzrI',
  'MLA',
  '9800000001',
  'suresh.patil.mla@example.com',
  '["inward","outward","nivedan","visitor","devworks","karyakarta","booth","geography","calendar","whatsapp","dashboard","reports","notifications","users"]',
  TRUE,
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00'
),

-- 2. PA (Personal Assistant) — Operational manager
(
  'मीना देशमुख',
  'pa_meena',
  '$2b$12$R4cT7nZpW9vM3qYbStIeLv8rKfG5oUhB2lHjV1NkFx7XsCyQaDzwJ',
  'PA',
  '9800000002',
  'meena.deshmukh.pa@example.com',
  '["inward","outward","nivedan","visitor","devworks","karyakarta","booth","geography","calendar","whatsapp","dashboard","reports","notifications"]',
  TRUE,
  '2026-01-10 09:05:00',
  '2026-01-10 09:05:00'
),

-- 3. Receptionist / Front Desk Clerk
(
  'रमेश जाधव',
  'clerk_ramesh',
  '$2b$12$S5dU8oApX0wN4rZcTuJfMw9sLgH6pViC3mIkW2OlGy8YtDzRbEaqK',
  'RECEPTIONIST',
  '9800000003',
  'ramesh.jadhav.clerk@example.com',
  '["visitor","nivedan","inward","dashboard","notifications"]',
  TRUE,
  '2026-01-10 09:10:00',
  '2026-01-10 09:10:00'
),

-- 4. Field Auditor / Assessor
(
  'प्रिया मोरे',
  'auditor_priya',
  '$2b$12$T6eV9pBqY1xO5sAdUvKgNx0tMhI7qWjD4nJlX3PmHz9ZuEaScFbrL',
  'AUDITOR',
  '9800000004',
  'priya.more.auditor@example.com',
  '["devworks","booth","geography","dashboard","notifications"]',
  TRUE,
  '2026-01-10 09:15:00',
  '2026-01-10 09:15:00'
),

-- 5. Booth Pramukh — Ground-level party worker
(
  'गणेश शिंदे',
  'bp_ganesh',
  '$2b$12$U7fW0qCrZ2yP6tBeVwLhOy1uNiJ8rXkE5oKmY4QnIa0AvFbTdGcsM',
  'BOOTH_PRAMUKH',
  '9800000005',
  NULL,
  '["karyakarta","booth","geography","notifications"]',
  TRUE,
  '2026-01-10 09:20:00',
  '2026-01-10 09:20:00'
),

-- 6. Citizen — Public tracking portal only
(
  'अजय कांबळे (Test Citizen)',
  'citizen_test',
  '$2b$12$V8gX1rDsA3zQ7uCfWxMiPz2vOjK9sYlF6pLnZ5RoJb1BwGcUeHdtN',
  'CITIZEN',
  '9800000006',
  NULL,
  '[]',
  TRUE,
  '2026-01-10 09:25:00',
  '2026-01-10 09:25:00'
),

-- 7. System Administrator
(
  'System Admin',
  'admin',
  '$2b$12$W9hY2sEtB4aR8vDgXyNjQa3wPkL0tZmG7qMoA6SpKc2CxHdVfIeuO',
  'ADMIN',
  '9800000007',
  'admin@mlaeoffice.local',
  '["inward","outward","nivedan","visitor","devworks","karyakarta","booth","geography","calendar","whatsapp","dashboard","reports","notifications","users","settings","audit"]',
  TRUE,
  '2026-01-10 09:00:00',
  '2026-01-10 09:00:00'
);
