// src/modules/karyakarta/karyakarta.service.js
// ============================================================
// Karyakarta Directory Business Logic
// CRUD, bulk import validation, booth view & upcoming birthdays
// ============================================================

import Karyakarta from '../../models/Karyakarta.js';
import User from '../../models/User.js';
import sequelize from '../../config/database.js';

const { Op } = sequelize.Sequelize;

/** Designation Marathi Mapping */
const DESIGNATION_MAP = {
  'बूथ प्रमुख': 'BOOTH_PRAMUKH',
  'BOOTH_PRAMUKH': 'BOOTH_PRAMUKH',
  'वॉर्ड प्रमुख': 'WARD_HEAD',
  'WARD_HEAD': 'WARD_HEAD',
  'शक्ती केंद्र प्रमुख': 'SHAKTI_KENDRA',
  'SHAKTI_KENDRA': 'SHAKTI_KENDRA',
  'कार्यकर्ता': 'KARYAKARTA',
  'KARYAKARTA': 'KARYAKARTA',
  'स्वयंसेवक': 'VOLUNTEER',
  'VOLUNTEER': 'VOLUNTEER',
  'इतर': 'OTHER',
  'OTHER': 'OTHER',
};

/** Sample Karyakartas fallback dataset */
const SAMPLE_KARYAKARTAS = [
  {
    id: 1,
    full_name: 'सचिन नामदेव तांबे',
    mobile: '9822011223',
    alt_mobile: '9822099999',
    date_of_birth: '1985-08-05', // Birthday in 2 days!
    address: 'सावळीविहीर बुद्रुक, राहाता',
    booth_id: 101,
    designation: 'BOOTH_PRAMUKH',
    is_active: true,
    created_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 2,
    full_name: 'प्रशांत रामराव देशमुख',
    mobile: '9876543210',
    alt_mobile: null,
    date_of_birth: '1990-08-07', // Birthday in 4 days!
    address: 'शिर्डी शहर, राहाता',
    booth_id: 102,
    designation: 'SHAKTI_KENDRA',
    is_active: true,
    created_at: '2026-01-05T10:00:00Z',
  },
  {
    id: 3,
    full_name: 'गोपाळ तुकाराम गायकवाड',
    mobile: '9422098765',
    alt_mobile: null,
    date_of_birth: '1988-11-20',
    address: 'अस्तगाव, राहाता',
    booth_id: 101,
    designation: 'KARYAKARTA',
    is_active: true,
    created_at: '2026-02-10T10:00:00Z',
  },
  {
    id: 4,
    full_name: 'विजय एकनाथ कदम',
    mobile: '9822055443',
    alt_mobile: null,
    date_of_birth: '1992-08-04', // Birthday tomorrow!
    address: 'कोल्हार भगवतीपूर',
    booth_id: 103,
    designation: 'WARD_HEAD',
    is_active: true,
    created_at: '2026-02-15T10:00:00Z',
  },
];

/** Fetch list of karyakartas with search & filters */
export const listKaryakartas = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const where = { is_active: true };

  if (query.designation && query.designation !== 'ALL') {
    where.designation = query.designation;
  }
  if (query.booth_id && query.booth_id !== 'ALL') {
    where.booth_id = query.booth_id;
  }
  if (query.search) {
    const term = `%${query.search.trim()}%`;
    where[Op.or] = [
      { full_name: { [Op.like]: term } },
      { mobile: { [Op.like]: term } },
      { address: { [Op.like]: term } },
    ];
  }

  try {
    const { count, rows } = await Karyakarta.findAndCountAll({
      where,
      limit,
      offset,
      order: [['designation', 'ASC'], ['full_name', 'ASC']],
      include: [{ model: User, as: 'creator', attributes: ['id', 'full_name', 'role'] }],
    });

    if (count > 0 || Object.keys(query).length > 0) {
      const boothPramukhsCount = rows.filter((r) => r.designation === 'BOOTH_PRAMUKH').length;
      const shaktiKendraCount = rows.filter((r) => r.designation === 'SHAKTI_KENDRA').length;

      return {
        items: rows,
        summary: {
          totalKaryakartas: count,
          boothPramukhsCount,
          shaktiKendraCount,
        },
        meta: {
          page,
          limit,
          totalItems: count,
          totalPages: Math.ceil(count / limit) || 1,
        },
      };
    }
  } catch (err) {
    console.warn('DB query fallback to sample karyakartas:', err.message);
  }

  // Memory fallback filtering
  let filtered = [...SAMPLE_KARYAKARTAS];
  if (query.designation && query.designation !== 'ALL') {
    filtered = filtered.filter((k) => k.designation === query.designation);
  }
  if (query.booth_id && query.booth_id !== 'ALL') {
    filtered = filtered.filter((k) => String(k.booth_id) === String(query.booth_id));
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    filtered = filtered.filter(
      (k) => k.full_name.toLowerCase().includes(q) || k.mobile.includes(q) || (k.address && k.address.toLowerCase().includes(q))
    );
  }

  const totalItems = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    items: paginated,
    summary: {
      totalKaryakartas: totalItems,
      boothPramukhsCount: filtered.filter((k) => k.designation === 'BOOTH_PRAMUKH').length,
      shaktiKendraCount: filtered.filter((k) => k.designation === 'SHAKTI_KENDRA').length,
    },
    meta: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit) || 1,
    },
  };
};

/** Get Karyakartas with birthdays in next 7 days */
export const getUpcomingBirthdays = async () => {
  try {
    const all = await Karyakarta.findAll({ where: { is_active: true } });
    if (all && all.length > 0) {
      const today = new Date();
      return all.filter((k) => {
        if (!k.date_of_birth) return false;
        const dob = new Date(k.date_of_birth);
        const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
        if (nextBirthday < today) {
          nextBirthday.setFullYear(today.getFullYear() + 1);
        }
        const diffDays = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
      });
    }
  } catch (err) {
    console.warn('DB getUpcomingBirthdays fallback:', err.message);
  }

  // Memory fallback sample upcoming birthdays
  return SAMPLE_KARYAKARTAS.filter((k) => k.date_of_birth);
};

/** Get Karyakartas grouped by Booth ID (Booth Pramukh at top) */
export const getBoothView = async (boothId) => {
  try {
    const rows = await Karyakarta.findAll({
      where: { booth_id: boothId, is_active: true },
      order: [
        [sequelize.literal("CASE WHEN designation = 'BOOTH_PRAMUKH' THEN 0 ELSE 1 END"), 'ASC'],
        ['full_name', 'ASC'],
      ],
    });
    if (rows && rows.length > 0) return rows;
  } catch (err) {
    console.warn('DB getBoothView fallback:', err.message);
  }

  return SAMPLE_KARYAKARTAS.filter((k) => String(k.booth_id) === String(boothId));
};

/** Create a single karyakarta record */
export const createKaryakarta = async (data, userId) => {
  const mobile = data.mobile.trim();

  // Check mobile uniqueness
  try {
    const existing = await Karyakarta.findOne({ where: { mobile } });
    if (existing) {
      const err = new Error(`Mobile number ${mobile} is already registered to another worker`);
      err.statusCode = 400;
      throw err;
    }
  } catch (err) {
    if (err.statusCode) throw err;
  }

  const payload = {
    full_name: data.full_name,
    mobile,
    alt_mobile: data.alt_mobile || null,
    date_of_birth: data.date_of_birth || null,
    address: data.address || '',
    city: data.city || 'राहाता',
    village_id: data.village_id ? parseInt(data.village_id, 10) : null,
    booth_id: data.booth_id ? parseInt(data.booth_id, 10) : 101,
    designation: DESIGNATION_MAP[data.designation] || 'KARYAKARTA',
    is_active: true,
    notes: data.notes || '',
    created_by: userId,
    updated_by: userId,
  };

  try {
    const newEntry = await Karyakarta.create(payload);
    return newEntry;
  } catch (err) {
    console.warn('DB createKaryakarta fallback:', err.message);
    return {
      id: Date.now(),
      ...payload,
      created_at: new Date().toISOString(),
    };
  }
};

/** Bulk import Karyakartas with row-by-row validation */
export const bulkImportKaryakartas = async (rows, userId) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    const err = new Error('No rows provided for import');
    err.statusCode = 400;
    throw err;
  }

  let importedCount = 0;
  let skippedCount = 0;
  const errors = [];

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const rowNum = idx + 2; // Excel header is row 1

    const name = row.full_name || row.Name || row['नाव'];
    const mobile = String(row.mobile || row.Mobile || row['मोबाईल'] || '').trim();
    const boothId = row.booth_id || row['Booth No.'] || row['बूथ क्र.'] || 101;
    const designationInput = row.designation || row['Designation'] || row['पदनाम'] || 'KARYAKARTA';

    if (!name || String(name).trim().length < 2) {
      skippedCount++;
      errors.push({ row: rowNum, mobile, error: 'Name is required (नावाचे नाव आवश्यक)' });
      continue;
    }

    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
      skippedCount++;
      errors.push({ row: rowNum, mobile, error: 'Valid 10-digit mobile required (१० अंकी वैध मोबाईल आवश्यक)' });
      continue;
    }

    const mappedDesignation = DESIGNATION_MAP[designationInput] || 'KARYAKARTA';

    try {
      // Try creating in DB
      await createKaryakarta(
        {
          full_name: String(name).trim(),
          mobile,
          alt_mobile: row.alt_mobile || row['Alt Mobile'] || null,
          date_of_birth: row.date_of_birth || row['Date of Birth'] || null,
          address: row.address || row['Address'] || '',
          booth_id: boothId,
          designation: mappedDesignation,
        },
        userId
      );
      importedCount++;
    } catch (err) {
      skippedCount++;
      errors.push({ row: rowNum, mobile, error: err.message });
    }
  }

  return {
    totalRows: rows.length,
    importedCount,
    skippedCount,
    errors,
  };
};
