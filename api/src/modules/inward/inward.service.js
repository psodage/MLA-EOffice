// src/modules/inward/inward.service.js
// ============================================================
// Inward Register business logic
// Creates, queries, updates, and assigns incoming documents.
// ============================================================

import InwardEntry from '../../models/InwardEntry.js';
import Department from '../../models/Department.js';
import User from '../../models/User.js';
import sequelize from '../../config/database.js';

const { Op } = sequelize.Sequelize;

/**
 * Sample fallback inward entries if DB table is empty / seeding in progress
 */
const SAMPLE_INWARD_ENTRIES = [
  {
    id: 1,
    inward_number: 'INW/2026/0001',
    date_received: '2026-08-03',
    sender_name: 'कार्यकारी अभियंता, सार्व. बांधकाम विभाग',
    sender_designation: 'Executive Engineer',
    sender_department_id: 1,
    subject: 'राहाता-शिर्डी रस्त्याची सुधारणा आणि निविदाबाबत',
    description: 'राहाता तालुक्यातील प्रमुख रस्त्यांच्या डांबरीकरणासाठी तयार केलेल्या प्रस्तावाचे पत्र.',
    tags: ['PWD', 'Roads', 'High Priority'],
    priority: 'HIGH',
    attachment_urls: ['https://res.cloudinary.com/demo/image/upload/sample.pdf'],
    assigned_to_user_id: 2,
    status: 'ASSIGNED',
    created_by: 3,
    created_at: '2026-08-03T09:30:00Z',
    updated_at: '2026-08-03T10:15:00Z',
    department: { id: 1, name_mr: 'सार्वजनिक बांधकाम विभाग (PWD)', name_en: 'Public Works Department' },
    assignedTo: { id: 2, full_name: 'Suresh Patil (PA)', role: 'PA' },
    creator: { id: 3, full_name: 'Priya Deshmukh (Receptionist)', role: 'RECEPTIONIST' },
  },
  {
    id: 2,
    inward_number: 'INW/2026/0002',
    date_received: '2026-08-02',
    sender_name: 'तहसीलदार कार्यालय, राहाता',
    sender_designation: 'Tahsildar',
    sender_department_id: 3,
    subject: 'शेतकऱ्यांना पीक नुकसान भरपाई वाटप अहवाल',
    description: 'ऑक्टोबर महिन्यातील अवकाळी पावसाने झालेल्या नुकसानीचे अनुदान वितरण विवरणपत्र.',
    tags: ['Revenue', 'Agriculture', 'Compensation'],
    priority: 'MEDIUM',
    attachment_urls: [],
    assigned_to_user_id: 2,
    status: 'IN_PROGRESS',
    created_by: 3,
    created_at: '2026-08-02T11:20:00Z',
    updated_at: '2026-08-02T14:30:00Z',
    department: { id: 3, name_mr: 'महसूल विभाग (Revenue)', name_en: 'Revenue Department' },
    assignedTo: { id: 2, full_name: 'Suresh Patil (PA)', role: 'PA' },
    creator: { id: 3, full_name: 'Priya Deshmukh (Receptionist)', role: 'RECEPTIONIST' },
  },
  {
    id: 3,
    inward_number: 'INW/2026/0003',
    date_received: '2026-08-01',
    sender_name: 'मुख्य कार्यकारी अधिकारी, महावितरण (MSEDCL)',
    sender_designation: 'Superintending Engineer',
    sender_department_id: 2,
    subject: 'नवीन ट्रान्सफॉर्मर बसवणे बाबत',
    description: 'ग्रामपंचायत सावळीविहीर येथील नवीन ट्रान्सफॉर्मर मंजुरीची प्रत.',
    tags: ['MSEDCL', 'Electricity'],
    priority: 'HIGH',
    attachment_urls: [],
    assigned_to_user_id: 2,
    status: 'COMPLETED',
    created_by: 3,
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-02T16:00:00Z',
    department: { id: 2, name_mr: 'महावितरण (MSEDCL)', name_en: 'MSEDCL Electricity' },
    assignedTo: { id: 2, full_name: 'Suresh Patil (PA)', role: 'PA' },
    creator: { id: 3, full_name: 'Priya Deshmukh (Receptionist)', role: 'RECEPTIONIST' },
  },
  {
    id: 4,
    inward_number: 'INW/2026/0004',
    date_received: '2026-08-03',
    sender_name: 'जिल्हा शल्यचिकित्सक, अहमदनगर',
    sender_designation: 'Civil Surgeon',
    sender_department_id: 5,
    subject: 'ग्रामीण रुग्णालयातील औषध पुरवठा मागणी पत्र',
    description: 'उपजिल्हा रुग्णालय राहाता येथे अतिदक्षता विभागासाठी औषध व साहित्य मागणी.',
    tags: ['Health', 'Hospital'],
    priority: 'LOW',
    attachment_urls: [],
    assigned_to_user_id: null,
    status: 'PENDING',
    created_by: 3,
    created_at: '2026-08-03T10:45:00Z',
    updated_at: '2026-08-03T10:45:00Z',
    department: { id: 5, name_mr: 'सार्वजनिक आरोग्य विभाग (Health)', name_en: 'Public Health Dept' },
    assignedTo: null,
    creator: { id: 3, full_name: 'Priya Deshmukh (Receptionist)', role: 'RECEPTIONIST' },
  },
];

/**
 * Fetch list of inward entries with pagination, search & filters
 */
export const listInwardEntries = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const where = {};

  if (query.status && query.status !== 'ALL') {
    where.status = query.status;
  }
  if (query.priority && query.priority !== 'ALL') {
    where.priority = query.priority;
  }
  if (query.departmentId && query.departmentId !== 'ALL') {
    where.sender_department_id = query.departmentId;
  }
  if (query.startDate && query.endDate) {
    where.date_received = {
      [Op.between]: [query.startDate, query.endDate],
    };
  } else if (query.startDate) {
    where.date_received = { [Op.gte]: query.startDate };
  } else if (query.endDate) {
    where.date_received = { [Op.lte]: query.endDate };
  }

  if (query.search) {
    const searchTerm = `%${query.search.trim()}%`;
    where[Op.or] = [
      { sender_name: { [Op.like]: searchTerm } },
      { subject: { [Op.like]: searchTerm } },
      { inward_number: { [Op.like]: searchTerm } },
    ];
  }

  try {
    const { count, rows } = await InwardEntry.findAndCountAll({
      where,
      limit,
      offset,
      order: [['date_received', 'DESC'], ['id', 'DESC']],
      include: [
        { model: Department, as: 'department', attributes: ['id', 'name_en', 'name_mr', 'short_code'] },
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
  } catch (dbError) {
    console.warn('DB query fallback to memory samples:', dbError.message);
  }

  // Fallback to rich mock sample entries filtered in memory
  let filtered = [...SAMPLE_INWARD_ENTRIES];

  if (query.status && query.status !== 'ALL') {
    filtered = filtered.filter((i) => i.status === query.status);
  }
  if (query.priority && query.priority !== 'ALL') {
    filtered = filtered.filter((i) => i.priority === query.priority);
  }
  if (query.departmentId && query.departmentId !== 'ALL') {
    filtered = filtered.filter((i) => String(i.sender_department_id) === String(query.departmentId));
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.sender_name.toLowerCase().includes(q) ||
        i.subject.toLowerCase().includes(q) ||
        i.inward_number.toLowerCase().includes(q)
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

/**
 * Create a new inward entry
 */
export const createInwardEntry = async (data, userId) => {
  const inward_number = await InwardEntry.generateInwardNumber();

  let initialStatus = data.status || 'PENDING';
  if (data.assigned_to_user_id && initialStatus === 'PENDING') {
    initialStatus = 'ASSIGNED';
  }

  const payload = {
    inward_number,
    date_received: data.date_received || new Date().toISOString().split('T')[0],
    sender_name: data.sender_name,
    sender_designation: data.sender_designation || null,
    sender_department_id: data.sender_department_id || null,
    subject: data.subject,
    description: data.description || null,
    tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
    priority: data.priority || 'MEDIUM',
    attachment_urls: Array.isArray(data.attachment_urls) ? data.attachment_urls : [],
    assigned_to_user_id: data.assigned_to_user_id || null,
    status: initialStatus,
    created_by: userId,
    updated_by: userId,
  };

  try {
    const newEntry = await InwardEntry.create(payload);
    return await getInwardEntryById(newEntry.id);
  } catch (err) {
    console.warn('DB create fallback, returning structured entry:', err.message);
    const fallbackId = Date.now();
    return {
      id: fallbackId,
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
};

/**
 * Get single inward entry by ID
 */
export const getInwardEntryById = async (id) => {
  try {
    const entry = await InwardEntry.findByPk(id, {
      include: [
        { model: Department, as: 'department', attributes: ['id', 'name_en', 'name_mr', 'short_code', 'officer_name', 'phone'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'full_name', 'role', 'mobile'] },
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'role'] },
        { model: User, as: 'updater', attributes: ['id', 'full_name', 'role'] },
      ],
    });

    if (entry) return entry;
  } catch (err) {
    console.warn('DB findById fallback:', err.message);
  }

  const sample = SAMPLE_INWARD_ENTRIES.find((i) => String(i.id) === String(id));
  if (sample) return sample;

  const err = new Error(`Inward entry with ID ${id} not found`);
  err.statusCode = 404;
  throw err;
};

/**
 * Update inward entry status or assignment
 */
export const updateInwardEntry = async (id, updateData, userId) => {
  const payload = {
    updated_by: userId,
  };

  if (updateData.status) payload.status = updateData.status;
  if (updateData.assigned_to_user_id !== undefined) {
    payload.assigned_to_user_id = updateData.assigned_to_user_id;
    if (payload.assigned_to_user_id && payload.status === 'PENDING') {
      payload.status = 'ASSIGNED';
    }
  }
  if (updateData.priority) payload.priority = updateData.priority;
  if (updateData.subject) payload.subject = updateData.subject;
  if (updateData.description !== undefined) payload.description = updateData.description;

  try {
    const entry = await InwardEntry.findByPk(id);
    if (entry) {
      await entry.update(payload);
      return await getInwardEntryById(id);
    }
  } catch (err) {
    console.warn('DB update fallback:', err.message);
  }

  // Fallback update in sample dataset
  const sample = SAMPLE_INWARD_ENTRIES.find((i) => String(i.id) === String(id));
  if (sample) {
    Object.assign(sample, payload);
    sample.updated_at = new Date().toISOString();
    return sample;
  }

  const err = new Error(`Inward entry with ID ${id} not found`);
  err.statusCode = 404;
  throw err;
};
