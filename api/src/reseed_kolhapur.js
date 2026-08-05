// src/reseed_kolhapur.js
// ============================================================
// Clears ALL existing sample data from Railway DB
// then seeds Kolhapur division data from SAMPLE_DATA/KOLHAPUR/
//
// Run: node src/reseed_kolhapur.js
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const KOLHAPUR_DIR = path.join(__dirname, '../../SAMPLE_DATA/KOLHAPUR');

// Seed files in execution order
const SQL_FILES = [
  '01_users.sql',
  '02_inward_entries.sql',
  '03_nivedans.sql',
  '04_nivedan_timeline.sql',
  '05_development_works.sql',
  '06_visitors.sql',
  '07_karyakartas.sql',
  '08_calendar_events.sql',
];

// Tables to truncate — ORDER matters (child → parent to avoid FK errors)
const TABLES_TO_CLEAR = [
  'nivedan_timeline',
  'calendar_events',
  'visitors',
  'karyakartas',
  'development_works',
  'nivedans',
  'inward_entries',
  'refresh_tokens',
  'users',
];

// ── Execute a single SQL string (handles large multi-statement files) ─────────
async function execSQL(label, sql) {
  // Strip full-line comments
  const clean = sql
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n')
    .trim();

  if (!clean) {
    console.log(`   ⚠️  Skipped (empty): ${label}`);
    return;
  }

  try {
    await sequelize.query(clean);
    console.log(`   ✅ ${label}`);
  } catch (err) {
    if (err.original?.code === 'ER_DUP_ENTRY') {
      console.warn(`   ⚠️  Duplicate entries in ${label}, continuing...`);
    } else {
      console.error(`   ❌ Error in ${label}:`, err.message);
      throw err;
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
const run = async () => {
  try {
    await sequelize.authenticate();
    console.log(`\n✅ Connected to: ${sequelize.config.host}:${sequelize.config.port} / ${sequelize.config.database}`);

    // ── STEP 1: Clear existing data ──────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🗑️  STEP 1: Clearing existing data...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Disable FK checks to allow truncation in any order
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    for (const table of TABLES_TO_CLEAR) {
      try {
        const [result] = await sequelize.query(`SELECT COUNT(*) AS cnt FROM \`${table}\``);
        const count = result[0].cnt;
        await sequelize.query(`DELETE FROM \`${table}\``);
        // Reset auto-increment
        await sequelize.query(`ALTER TABLE \`${table}\` AUTO_INCREMENT = 1`);
        console.log(`   🗑️  Cleared ${table} (${count} rows removed)`);
      } catch (e) {
        console.warn(`   ⚠️  Could not clear ${table}: ${e.message}`);
      }
    }

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('\n   ✅ All tables cleared.\n');

    // ── STEP 2: Fix karyakartas updated_at if needed ─────────────────────────
    try {
      await sequelize.query(
        'ALTER TABLE karyakartas MODIFY updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;'
      );
    } catch (_) { /* ignore */ }

    // ── STEP 3: Seed Kolhapur data ───────────────────────────────────────────
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌱 STEP 2: Seeding Kolhapur division data...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    for (const file of SQL_FILES) {
      const filePath = path.join(KOLHAPUR_DIR, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`   ⚠️  File not found: ${file}`);
        continue;
      }

      console.log(`\n🌱 Seeding ${file}...`);
      const sql = fs.readFileSync(filePath, 'utf8');
      await execSQL(file, sql);
    }

    // ── STEP 4: Verify counts ────────────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 STEP 3: Verification — Row Counts');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const verifyTables = [
      'users', 'inward_entries', 'nivedans', 'nivedan_timeline',
      'development_works', 'visitors', 'karyakartas', 'calendar_events',
    ];

    for (const table of verifyTables) {
      try {
        const [rows] = await sequelize.query(`SELECT COUNT(*) AS cnt FROM \`${table}\``);
        console.log(`   📋 ${table.padEnd(25)} ${rows[0].cnt} rows`);
      } catch (e) {
        console.warn(`   ⚠️  Could not count ${table}`);
      }
    }

    // Print sample users
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Kolhapur User Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const [users] = await sequelize.query(
      'SELECT id, username, role, full_name FROM users ORDER BY id'
    );
    users.forEach(u => {
      console.log(`   👤 [${u.id}] ${u.username.padEnd(20)} ${u.role.padEnd(15)} ${u.full_name}`);
    });

    console.log('\n🎉 Kolhapur data seeded successfully!');
    console.log('\n🔑 Login credentials:');
    console.log('   mla_rajesh        → Mla@2026#Kolhapur');
    console.log('   pa_sunita         → Pa@2026#Kolhapur');
    console.log('   clerk_suresh      → Clerk@2026#Kolhapur');
    console.log('   auditor_meera     → Audit@2026#Kolhapur');
    console.log('   bp_ganpat         → Booth@2026#Kolhapur');
    console.log('   citizen_kolhapur  → Citizen@2026');
    console.log('   admin_kolhapur    → Admin@MLA2026');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
};

run();
