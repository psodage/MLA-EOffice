const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '../../SAMPLE_DATA/KOLHAPUR/06_visitors.sql');
let sql = fs.readFileSync(file, 'utf8');

sql = sql.replace(/'NIVEDAN'/g, "'GRIEVANCE'");
sql = sql.replace(/'CERTIFICATE_HELP'/g, "'DOCUMENT_SUBMISSION'");
sql = sql.replace(/'FUND_REQUEST'/g, "'PERSONAL_MEETING'");
sql = sql.replace(/'INFORMATION'/g, "'GENERAL_INQUIRY'");
sql = sql.replace(/'PENSION_HELP'/g, "'PERSONAL_MEETING'");
sql = sql.replace(/'AGRICULTURE_HELP'/g, "'PARTY_WORK'");

fs.writeFileSync(file, sql);
console.log('✅ Fixed 06_visitors.sql purpose enum values successfully');
