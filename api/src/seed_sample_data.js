// src/seed_sample_data.js
// ============================================================
// Seeds sample data SQL files from SAMPLE_DATA/ into Railway MySQL
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sampleDataDir = path.join(__dirname, '../../SAMPLE_DATA');

const sqlFiles = [
  '01_users.sql',
  '02_inward_entries.sql',
  '03_nivedans.sql',
  '04_nivedan_timeline.sql',
  '05_development_works.sql',
  '06_visitors.sql',
  '07_karyakartas.sql',
  '08_calendar_events.sql',
];

const seedSampleData = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database:', sequelize.config.host);

    for (const file of sqlFiles) {
      const filePath = path.join(sampleDataDir, file);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File not found: ${file}`);
        continue;
      }

      console.log(`\n🌱 Executing ${file}...`);

      if (file === '07_karyakartas.sql') {
        try {
          await sequelize.query('ALTER TABLE karyakartas MODIFY updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;');
        } catch (e) {
          // Ignore if already set
        }
      }

      const sqlContent = fs.readFileSync(filePath, 'utf8');

      // Strip full-line comments starting with --
      const cleanSql = sqlContent
        .split('\n')
        .filter((line) => !line.trim().startsWith('--'))
        .join('\n')
        .trim();

      if (!cleanSql) {
        console.log(`   Skipped empty file: ${file}`);
        continue;
      }

      // Execute SQL statements
      try {
        await sequelize.query(cleanSql);
        console.log(`✅ Successfully seeded ${file}`);
      } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError' || err.original?.code === 'ER_DUP_ENTRY') {
          console.warn(`⚠️ Duplicate entries in ${file}, continuing...`);
        } else {
          console.error(`❌ Error in ${file}:`, err.message);
        }
      }
    }

    console.log('\n🎉 Sample data seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection or seeding error:', error);
    process.exit(1);
  }
};

seedSampleData();
