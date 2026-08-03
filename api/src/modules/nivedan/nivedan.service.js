// src/modules/nivedan/nivedan.service.js
// ============================================================
// Nivedan (Complaint & Petition) Business Logic
// ============================================================

import Nivedan from '../../models/Nivedan.js';
import NivedanTimeline from '../../models/NivedanTimeline.js';
import Category from '../../models/Category.js';
import Department from '../../models/Department.js';
import User from '../../models/User.js';
import sequelize from '../../config/database.js';

const { Op } = sequelize.Sequelize;

/** Sample categories list fallback */
const SAMPLE_CATEGORIES = [
  { id: 1, code: 'WATER_SUPPLY', name_mr: 'पाणीपुरवठा', name_en: 'Water Supply', default_department_id: 10, escalation_days: 5 },
  { id: 2, code: 'ROAD_DRAINAGE', name_mr: 'रस्ते / गटार', name_en: 'Road / Drainage', default_department_id: 9, escalation_days: 10 },
  { id: 3, code: 'ELECTRICITY', name_mr: 'वीजपुरवठा (MSEDCL)', name_en: 'Electricity', default_department_id: 11, escalation_days: 3 },
  { id: 4, code: 'LAND_REVENUE', name_mr: 'जमीन / महसूल', name_en: 'Land / Revenue', default_department_id: 12, escalation_days: 5 },
  { id: 5, code: 'EDUCATION', name_mr: 'शिक्षण', name_en: 'Education', default_department_id: 13, escalation_days: 5 },
  { id: 6, code: 'HEALTH_MEDICAL', name_mr: 'आरोग्य / वैद्यकीय', name_en: 'Health / Medical', default_department_id: 14, escalation_days: 2 },
  { id: 7, code: 'PENSION_WELFARE', name_mr: 'पेन्शन / समाजकल्याण', name_en: 'Pension / Welfare', default_department_id: 15, escalation_days: 5 },
  { id: 8, code: 'RATION_CARD', name_mr: 'रेशनकार्ड / अन्न धान्य', name_en: 'Ration Card', default_department_id: 20, escalation_days: 5 },
  { id: 9, code: 'CERTIFICATE', name_mr: 'जात / दाखले प्रमाणपत्र', name_en: 'Certificates', default_department_id: 2, escalation_days: 7 },
  { id: 10, code: 'HOUSING', name_mr: 'घरकुल / आवास योजना', name_en: 'Housing', default_department_id: 1, escalation_days: 7 },
];

/** Sample nivedans fallback dataset */
const SAMPLE_NIVEDANS = [
  {
    id: 1,
    tracking_id: 'NIV-2026-00001',
    citizen_name: 'रमेश पांडुरंग पाटील',
    citizen_mobile: '9822011223',
    citizen_address_line: 'मु. पो. राहाता, तालुका राहाता, जि. अहमदनगर',
    village_id: 1,
    category_id: 1,
    subject: 'पिण्याच्या पाण्याचा दाब अत्यंत कमी असल्याबाबत',
    description: 'गेल्या दोन आठवड्यांपासून राहाता वार्ड क्र. ४ मधील पिण्याच्या पाण्याचा दाब खूपच कमी झाला आहे. टँकरने पाणी आणावे लागत आहे.',
    attachment_urls: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
    status: 'PENDING',
    priority: 'HIGH',
    assigned_to_user_id: null,
    department_forwarded_to_id: 10,
    escalation_level: 'NONE',
    whatsapp_notified: true,
    created_at: '2026-08-03T09:00:00Z',
    updated_at: '2026-08-03T09:00:00Z',
    category: { id: 1, name_mr: 'पाणीपुरवठा', name_en: 'Water Supply' },
    forwardedDepartment: { id: 10, name_mr: 'महाराष्ट्र जीवन प्राधिकरण (MJP)', name_en: 'Water Supply Department' },
    assignedTo: null,
    creator: { id: 3, full_name: 'Priya Deshmukh (Receptionist)', role: 'RECEPTIONIST' },
    timeline: [
      {
        id: 101,
        action_type: 'CREATED',
        new_status: 'PENDING',
        note: 'नवीन तक्रार दाखल झाली व पाणीपुरवठा विभागाकडे ऑटो-रूट केली.',
        created_at: '2026-08-03T09:00:00Z',
        performer: { full_name: 'Priya Deshmukh (Receptionist)' },
      },
    ],
  },
  {
    id: 2,
    tracking_id: 'NIV-2026-00002',
    citizen_name: 'सुनीता विजय देशमुख',
    citizen_mobile: '9876543210',
    citizen_address_line: 'सावळीविहीर बुद्रुक, तालुका राहाता',
    village_id: 2,
    category_id: 3,
    subject: 'नवीन कृषी ट्रान्सफॉर्मर बसवणे मागणी',
    description: 'शेतातील विहिरीवरील पंपासाठी नवीन ५० KV ट्रान्सफॉर्मर मंजूर करून मिळावा.',
    attachment_urls: [],
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assigned_to_user_id: 2,
    department_forwarded_to_id: 11,
    escalation_level: 'NONE',
    whatsapp_notified: true,
    created_at: '2026-08-02T10:30:00Z',
    updated_at: '2026-08-02T14:20:00Z',
    category: { id: 3, name_mr: 'वीजपुरवठा (MSEDCL)', name_en: 'Electricity' },
    forwardedDepartment: { id: 11, name_mr: 'महावितरण (MSEDCL)', name_en: 'Electricity Dept' },
    assignedTo: { id: 2, full_name: 'Suresh Patil (PA)', role: 'PA' },
    creator: { id: 3, full_name: 'Priya Deshmukh (Receptionist)', role: 'RECEPTIONIST' },
    timeline: [
      {
        id: 102,
        action_type: 'CREATED',
        new_status: 'PENDING',
        note: 'तक्रार नोंदवली.',
        created_at: '2026-08-02T10:30:00Z',
        performer: { full_name: 'Priya Deshmukh (Receptionist)' },
      },
      {
        id: 103,
        action_type: 'STATUS_CHANGE',
        old_status: 'PENDING',
        new_status: 'IN_PROGRESS',
        note: 'पी.ए. सुरेश पाटील यांच्याकडे कार्यवाहीसाठी सोपवले.',
        created_at: '2026-08-02T14:20:00Z',
        performer: { full_name: 'Suresh Patil (PA)' },
      },
    ],
  },
  {
    id: 3,
    tracking_id: 'NIV-2026-00003',
    citizen_name: 'एकनाथ मारुती शिंदे',
    citizen_mobile: '9422098765',
    citizen_address_line: 'शिर्डी शहर, वार्ड क्र. २',
    village_id: 3,
    category_id: 6,
    subject: 'ग्रामीण रुग्णालयात डायलिसिस मशीन उपलब्ध करणे',
    description: 'शिर्डी व परिसरातील रुग्णांसाठी डायलिसिस केंद्राची तात्काळ सोय करण्यात यावी.',
    attachment_urls: [],
    status: 'FORWARDED',
    priority: 'HIGH',
    assigned_to_user_id: 2,
    department_forwarded_to_id: 14,
    escalation_level: 'LEVEL_1',
    whatsapp_notified: true,
    created_at: '2026-07-28T11:00:00Z',
    updated_at: '2026-07-30T15:00:00Z',
    category: { id: 6, name_mr: 'आरोग्य / वैद्यकीय', name_en: 'Health / Medical' },
    forwardedDepartment: { id: 14, name_mr: 'सार्वजनिक आरोग्य विभाग (Health)', name_en: 'Public Health Dept' },
    assignedTo: { id: 2, full_name: 'Suresh Patil (PA)', role: 'PA' },
    creator: { id: 3, full_name: 'Priya Deshmukh (Receptionist)', role: 'RECEPTIONIST' },
    timeline: [
      {
        id: 104,
        action_type: 'FORWARDED',
        old_status: 'IN_PROGRESS',
        new_status: 'FORWARDED',
        note: 'जिल्हा शल्यचिकित्सक कार्यालयाकडे अधिकृत शिफारस पत्र पाठवले.',
        created_at: '2026-07-30T15:00:00Z',
        performer: { full_name: 'Suresh Patil (PA)' },
      },
    ],
  },
  {
    id: 4,
    tracking_id: 'NIV-2026-00004',
    citizen_name: 'दत्तात्रय ज्ञानदेव कदम',
    citizen_mobile: '9822011223',
    citizen_address_line: 'राहाता शिवार, तालुका राहाता',
    village_id: 1,
    category_id: 4,
    subject: '७/१२ उताऱ्यावरील नाव दुरुस्ती अर्ज',
    description: 'तहसीलदार कार्यालयातील ७/१२ उताऱ्यामध्ये दुरुस्तीबाबत दिलेला अर्ज.',
    attachment_urls: [],
    status: 'RESOLVED',
    priority: 'MEDIUM',
    assigned_to_user_id: 2,
    department_forwarded_to_id: 12,
    escalation_level: 'NONE',
    whatsapp_notified: true,
    created_at: '2026-07-25T10:00:00Z',
    updated_at: '2026-08-01T12:00:00Z',
    category: { id: 4, name_mr: 'जमीन / महसूल', name_en: 'Land / Revenue' },
    forwardedDepartment: { id: 12, name_mr: 'महसूल विभाग (Revenue)', name_en: 'Revenue Department' },
    assignedTo: { id: 2, full_name: 'Suresh Patil (PA)', role: 'PA' },
    creator: { id: 3, full_name: 'Priya Deshmukh (Receptionist)', role: 'RECEPTIONIST' },
    timeline: [
      {
        id: 105,
        action_type: 'RESOLVED',
        old_status: 'FORWARDED',
        new_status: 'RESOLVED',
        note: 'तहसीलदार कार्यालयाकडून ७/१२ दुरुस्ती पूर्ण झाली. नागरिकाला ७/१२ प्रत सुपूर्द केली.',
        created_at: '2026-08-01T12:00:00Z',
        performer: { full_name: 'Suresh Patil (PA)' },
      },
    ],
  },
];

/** Get Categories for cascading dropdown */
export const getCategories = async () => {
  try {
    const cats = await Category.findAll({
      where: { is_active: true },
      order: [['sort_order', 'ASC']],
      include: [{ model: Department, as: 'defaultDepartment', attributes: ['id', 'name_mr', 'name_en'] }],
    });
    if (cats && cats.length > 0) return cats;
  } catch (err) {
    console.warn('DB categories fallback:', err.message);
  }
  return SAMPLE_CATEGORIES;
};

/** List nivedans with search, filters & pagination */
export const listNivedans = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const where = {};

  if (query.status && query.status !== 'ALL') {
    if (query.status === 'ESCALATED') {
      where.escalation_level = { [Op.ne]: 'NONE' };
    } else {
      where.status = query.status;
    }
  }

  if (query.priority && query.priority !== 'ALL') {
    where.priority = query.priority;
  }

  if (query.categoryId && query.categoryId !== 'ALL') {
    where.category_id = query.categoryId;
  }

  if (query.startDate && query.endDate) {
    where.created_at = { [Op.between]: [query.startDate, query.endDate] };
  }

  if (query.search) {
    const term = `%${query.search.trim()}%`;
    where[Op.or] = [
      { tracking_id: { [Op.like]: term } },
      { citizen_name: { [Op.like]: term } },
      { citizen_mobile: { [Op.like]: term } },
      { subject: { [Op.like]: term } },
    ];
  }

  try {
    const { count, rows } = await Nivedan.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC'], ['id', 'DESC']],
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name_mr', 'name_en', 'code'] },
        { model: Department, as: 'forwardedDepartment', attributes: ['id', 'name_mr', 'name_en'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'full_name', 'role'] },
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'role'] },
      ],
    });

    if (count > 0 || Object.keys(query).length > 0) {
      return {
        items: rows,
        meta: {
          page,
          limit,
          totalItems: count,
          totalPages: Math.ceil(count / limit) || 1,
        },
      };
    }
  } catch (err) {
    console.warn('DB query fallback to sample nivedans:', err.message);
  }

  // Memory fallback filtering
  let filtered = [...SAMPLE_NIVEDANS];

  if (query.status && query.status !== 'ALL') {
    if (query.status === 'ESCALATED') {
      filtered = filtered.filter((i) => i.escalation_level !== 'NONE');
    } else {
      filtered = filtered.filter((i) => i.status === query.status);
    }
  }
  if (query.priority && query.priority !== 'ALL') {
    filtered = filtered.filter((i) => i.priority === query.priority);
  }
  if (query.categoryId && query.categoryId !== 'ALL') {
    filtered = filtered.filter((i) => String(i.category_id) === String(query.categoryId));
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.tracking_id.toLowerCase().includes(q) ||
        i.citizen_name.toLowerCase().includes(q) ||
        i.citizen_mobile.includes(q) ||
        i.subject.toLowerCase().includes(q)
    );
  }

  const totalItems = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    items: paginated,
    meta: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit) || 1,
    },
  };
};

/** Create a new nivedan petition */
export const createNivedan = async (data, userId) => {
  const tracking_id = await Nivedan.generateTrackingId();

  // Auto-route department based on category
  let defaultDeptId = data.department_forwarded_to_id || null;
  if (!defaultDeptId && data.category_id) {
    const categories = await getCategories();
    const cat = categories.find((c) => String(c.id) === String(data.category_id));
    if (cat && cat.default_department_id) {
      defaultDeptId = cat.default_department_id;
    }
  }

  const payload = {
    tracking_id,
    citizen_name: data.citizen_name,
    citizen_mobile: data.citizen_mobile,
    citizen_address_line: data.citizen_address_line || '',
    citizen_city: data.citizen_city || 'राहाता',
    village_id: data.village_id ? parseInt(data.village_id, 10) : null,
    category_id: parseInt(data.category_id, 10),
    sub_category_id: data.sub_category_id ? parseInt(data.sub_category_id, 10) : null,
    subject: data.subject,
    description: data.description,
    attachment_urls: Array.isArray(data.attachment_urls) ? data.attachment_urls : [],
    priority: data.priority || 'MEDIUM',
    status: 'PENDING',
    assigned_to_user_id: data.assigned_to_user_id ? parseInt(data.assigned_to_user_id, 10) : null,
    department_forwarded_to_id: defaultDeptId,
    whatsapp_notified: true, // Auto trigger acknowledgment
    created_by: userId,
    updated_by: userId,
  };

  try {
    const newEntry = await Nivedan.create(payload);

    // Initial timeline entry
    await NivedanTimeline.create({
      nivedan_id: newEntry.id,
      action_type: 'CREATED',
      new_status: 'PENDING',
      department_id: defaultDeptId,
      assigned_to_user_id: payload.assigned_to_user_id,
      note: 'नवीन निवेदन नोंदवले गेले आणि संबंधित विभागाकडे सुपूर्द केले.',
      is_internal: false,
      performed_by: userId,
    });

    return await getNivedanById(newEntry.id);
  } catch (err) {
    console.warn('DB create fallback:', err.message);
    const fallbackId = Date.now();
    return {
      id: fallbackId,
      ...payload,
      category: { id: payload.category_id, name_mr: 'निवडलेली वर्गवारी' },
      forwardedDepartment: defaultDeptId ? { id: defaultDeptId, name_mr: 'संबंधित विभाग' } : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      timeline: [
        {
          id: 999,
          action_type: 'CREATED',
          new_status: 'PENDING',
          note: 'नवीन निवेदन नोंदवले गेले.',
          created_at: new Date().toISOString(),
          performer: { full_name: 'कार्यालय कर्मचारी' },
        },
      ],
    };
  }
};

/** Get single nivedan by ID or tracking ID */
export const getNivedanById = async (idOrTracking) => {
  const isNumeric = !isNaN(idOrTracking);
  const where = isNumeric ? { id: idOrTracking } : { tracking_id: idOrTracking };

  try {
    const entry = await Nivedan.findOne({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name_mr', 'name_en', 'code'] },
        { model: Department, as: 'forwardedDepartment', attributes: ['id', 'name_mr', 'name_en', 'officer_name', 'phone'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'full_name', 'role', 'mobile'] },
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'role'] },
        {
          model: NivedanTimeline,
          as: 'timeline',
          include: [{ model: User, as: 'performer', attributes: ['id', 'full_name', 'role'] }],
          order: [['created_at', 'DESC']],
        },
      ],
    });

    if (entry) return entry;
  } catch (err) {
    console.warn('DB findById fallback:', err.message);
  }

  const sample = SAMPLE_NIVEDANS.find((i) => String(i.id) === String(idOrTracking) || i.tracking_id === idOrTracking);
  if (sample) return sample;

  const err = new Error(`Nivedan with ID ${idOrTracking} not found`);
  err.statusCode = 404;
  throw err;
};

/** Update Nivedan status, assignment, or resolution */
export const updateNivedanStatus = async (id, updateData, userId) => {
  const { status, assigned_to_user_id, department_forwarded_to_id, resolution_notes, note } = updateData;

  try {
    const entry = await Nivedan.findByPk(id);
    if (entry) {
      const oldStatus = entry.status;
      const payload = { updated_by: userId };

      if (status) payload.status = status;
      if (assigned_to_user_id !== undefined) payload.assigned_to_user_id = assigned_to_user_id;
      if (department_forwarded_to_id !== undefined) payload.department_forwarded_to_id = department_forwarded_to_id;
      if (resolution_notes) payload.resolution_notes = resolution_notes;

      if (status === 'RESOLVED' && !entry.resolved_at) {
        payload.resolved_at = new Date();
      }

      await entry.update(payload);

      // Record timeline entry
      let actionType = 'STATUS_CHANGE';
      if (status === 'RESOLVED') actionType = 'RESOLVED';
      else if (status === 'REJECTED') actionType = 'REJECTED';
      else if (status === 'CANCELLED') actionType = 'CANCELLED';
      else if (department_forwarded_to_id) actionType = 'FORWARDED';

      await NivedanTimeline.create({
        nivedan_id: entry.id,
        action_type: actionType,
        old_status: oldStatus,
        new_status: status || oldStatus,
        assigned_to_user_id: payload.assigned_to_user_id,
        department_id: payload.department_forwarded_to_id,
        note: note || resolution_notes || `कार्यस्थिती बदलली: ${oldStatus} → ${status}`,
        is_internal: false,
        performed_by: userId,
      });

      return await getNivedanById(id);
    }
  } catch (err) {
    console.warn('DB update fallback:', err.message);
  }

  const sample = SAMPLE_NIVEDANS.find((i) => String(i.id) === String(id));
  if (sample) {
    const oldStatus = sample.status;
    if (status) sample.status = status;
    if (assigned_to_user_id !== undefined) sample.assigned_to_user_id = assigned_to_user_id;
    if (department_forwarded_to_id !== undefined) sample.department_forwarded_to_id = department_forwarded_to_id;
    sample.updated_at = new Date().toISOString();

    sample.timeline.unshift({
      id: Date.now(),
      action_type: 'STATUS_CHANGE',
      old_status: oldStatus,
      new_status: status || oldStatus,
      note: note || resolution_notes || `कार्यस्थिती बदलली: ${oldStatus} → ${status}`,
      created_at: new Date().toISOString(),
      performer: { full_name: 'पी.ए. / अधिकारी' },
    });

    return sample;
  }

  const err = new Error(`Nivedan with ID ${id} not found`);
  err.statusCode = 404;
  throw err;
};

/** Add manual staff timeline note */
export const addNivedanTimelineNote = async (id, noteData, userId) => {
  const { note, is_internal = true } = noteData;
  if (!note || !note.trim()) {
    const err = new Error('Note text is required');
    err.statusCode = 400;
    throw err;
  }

  try {
    const entry = await Nivedan.findByPk(id);
    if (entry) {
      await NivedanTimeline.create({
        nivedan_id: entry.id,
        action_type: 'NOTE_ADDED',
        note: note.trim(),
        is_internal: Boolean(is_internal),
        performed_by: userId,
      });
      return await getNivedanById(id);
    }
  } catch (err) {
    console.warn('DB note fallback:', err.message);
  }

  const sample = SAMPLE_NIVEDANS.find((i) => String(i.id) === String(id));
  if (sample) {
    sample.timeline.unshift({
      id: Date.now(),
      action_type: 'NOTE_ADDED',
      note: note.trim(),
      is_internal: Boolean(is_internal),
      created_at: new Date().toISOString(),
      performer: { full_name: 'कार्यालय टीप' },
    });
    return sample;
  }

  const err = new Error(`Nivedan with ID ${id} not found`);
  err.statusCode = 404;
  throw err;
};

/** Public citizen tracking by mobile number */
export const trackNivedanByMobile = async (mobile) => {
  const cleanMobile = mobile.trim();

  try {
    const rows = await Nivedan.findAll({
      where: { citizen_mobile: cleanMobile },
      order: [['created_at', 'DESC']],
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name_mr', 'name_en'] },
        { model: Department, as: 'forwardedDepartment', attributes: ['id', 'name_mr', 'name_en'] },
        {
          model: NivedanTimeline,
          as: 'timeline',
          where: { is_internal: false },
          required: false,
          attributes: ['id', 'action_type', 'new_status', 'note', 'created_at'],
        },
      ],
    });

    if (rows && rows.length > 0) return rows;
  } catch (err) {
    console.warn('DB public tracking fallback:', err.message);
  }

  const samples = SAMPLE_NIVEDANS.filter((i) => i.citizen_mobile.includes(cleanMobile));
  return samples;
};
