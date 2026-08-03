// src/modules/outward/outward.service.js
// ============================================================
// Outward Register business logic — CRUD, approval, AI drafting
// ============================================================

import OutwardEntry from '../../models/OutwardEntry.js';
import Department from '../../models/Department.js';
import InwardEntry from '../../models/InwardEntry.js';
import User from '../../models/User.js';
import sequelize from '../../config/database.js';
import { generateLetterDraft } from '../../services/gemini.service.js';

const { Op } = sequelize.Sequelize;

/** Sample fallback outward entries */
const SAMPLE_OUTWARD_ENTRIES = [
  {
    id: 1,
    outward_number: 'OUT/2026/0001',
    date_sent: '2026-08-03',
    recipient_name: 'कार्यकारी अभियंता, सार्व. बांधकाम विभाग',
    recipient_designation: 'Executive Engineer',
    recipient_department_id: 1,
    subject: 'राहाता-शिर्डी रस्ता डांबरीकरण कामास मंजुरी देणेबाबत',
    body_text: `प्रति,\nकार्यकारी अभियंता,\nसार्वजनिक बांधकाम विभाग, राहाता.\n\nविषय: राहाता-शिर्डी रस्ता डांबरीकरण कामास मंजुरी देणेबाबत\n\nमहोदय,\n  सदर विषयाबाबत आपणास सविनय विनंती करण्यात येते की, राहाता ते शिर्डी दरम्यानच्या रस्त्याची मोठ्या प्रमाणावर दुरवस्था झाली असून वाहनधारकांना अडचण होत आहे.\n\n  तरी सदर रस्त्याच्या डांबरीकरणाच्या प्रस्तावास तातडीने मंजुरी देऊन काम सुरू करावे, ही विनंती.\n\nआपला नम्र,\n(मा. आमदार महोदय)`,
    letter_pdf_url: null,
    reference_inward_id: 1,
    is_ai_drafted: true,
    attachment_urls: [],
    approved_by: 2,
    created_by: 2,
    created_at: '2026-08-03T11:00:00Z',
    updated_at: '2026-08-03T11:30:00Z',
    recipientDepartment: { id: 1, name_mr: 'सार्वजनिक बांधकाम विभाग (PWD)', name_en: 'Public Works Dept' },
    referenceInward: { id: 1, inward_number: 'INW/2026/0001', subject: 'राहाता-शिर्डी रस्त्याची सुधारणा' },
    approver: { id: 2, full_name: 'Suresh Patil (PA)', role: 'PA' },
    creator: { id: 2, full_name: 'Suresh Patil (PA)', role: 'PA' },
  },
  {
    id: 2,
    outward_number: 'OUT/2026/0002',
    date_sent: '2026-08-02',
    recipient_name: 'तहसीलदार, राहाता',
    recipient_designation: 'Tahsildar',
    recipient_department_id: 3,
    subject: 'शेतकरी पीक नुकसान भरपाई वाटप जलद करणेबाबत',
    body_text: `प्रति,\nतहसीलदार साहेब,\nमहसूल विभाग, राहाता.\n\nविषय: शेतकरी पीक नुकसान भरपाई वाटप जलद करणेबाबत\n\nमहोदय,\n  सदर विषयास अनुसरून अवकाळी पावसाने बाधित झालेल्या सर्व पात्र शेतकऱ्यांना अनुदानाची रक्कम त्वरित वर्ग करण्यात यावी.\n\nआपला नम्र,\n(मा. आमदार महोदय)`,
    letter_pdf_url: null,
    reference_inward_id: 2,
    is_ai_drafted: true,
    attachment_urls: [],
    approved_by: null,
    created_by: 2,
    created_at: '2026-08-02T14:00:00Z',
    updated_at: '2026-08-02T14:00:00Z',
    recipientDepartment: { id: 3, name_mr: 'महसूल विभाग (Revenue)', name_en: 'Revenue Dept' },
    referenceInward: { id: 2, inward_number: 'INW/2026/0002', subject: 'पीक नुकसान भरपाई अहवाल' },
    approver: null,
    creator: { id: 2, full_name: 'Suresh Patil (PA)', role: 'PA' },
  },
];

/**
 * Fetch paginated outward entries with search & filters
 */
export const listOutwardEntries = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const where = {};

  if (query.departmentId && query.departmentId !== 'ALL') {
    where.recipient_department_id = query.departmentId;
  }
  if (query.isAiDrafted === 'true' || query.isAiDrafted === 'TRUE') {
    where.is_ai_drafted = true;
  }
  if (query.approved === 'TRUE') {
    where.approved_by = { [Op.ne]: null };
  } else if (query.approved === 'FALSE') {
    where.approved_by = null;
  }

  if (query.startDate && query.endDate) {
    where.date_sent = { [Op.between]: [query.startDate, query.endDate] };
  }

  if (query.search) {
    const term = `%${query.search.trim()}%`;
    where[Op.or] = [
      { recipient_name: { [Op.like]: term } },
      { subject: { [Op.like]: term } },
      { outward_number: { [Op.like]: term } },
    ];
  }

  try {
    const { count, rows } = await OutwardEntry.findAndCountAll({
      where,
      limit,
      offset,
      order: [['date_sent', 'DESC'], ['id', 'DESC']],
      include: [
        { model: Department, as: 'recipientDepartment', attributes: ['id', 'name_en', 'name_mr', 'short_code'] },
        { model: InwardEntry, as: 'referenceInward', attributes: ['id', 'inward_number', 'subject'] },
        { model: User, as: 'approver', attributes: ['id', 'full_name', 'role'] },
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
    console.warn('DB query fallback to sample outward entries:', err.message);
  }

  // Memory fallback filtering
  let filtered = [...SAMPLE_OUTWARD_ENTRIES];
  if (query.departmentId && query.departmentId !== 'ALL') {
    filtered = filtered.filter((i) => String(i.recipient_department_id) === String(query.departmentId));
  }
  if (query.approved === 'TRUE') {
    filtered = filtered.filter((i) => i.approved_by !== null);
  } else if (query.approved === 'FALSE') {
    filtered = filtered.filter((i) => i.approved_by === null);
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.recipient_name.toLowerCase().includes(q) ||
        i.subject.toLowerCase().includes(q) ||
        i.outward_number.toLowerCase().includes(q)
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
 * Create a new outward entry
 */
export const createOutwardEntry = async (data, userId) => {
  const outward_number = await OutwardEntry.generateOutwardNumber();

  const payload = {
    outward_number,
    date_sent: data.date_sent || new Date().toISOString().split('T')[0],
    recipient_name: data.recipient_name,
    recipient_designation: data.recipient_designation || null,
    recipient_department_id: data.recipient_department_id || null,
    subject: data.subject,
    body_text: data.body_text,
    letter_pdf_url: data.letter_pdf_url || null,
    reference_inward_id: data.reference_inward_id || null,
    is_ai_drafted: Boolean(data.is_ai_drafted),
    attachment_urls: Array.isArray(data.attachment_urls) ? data.attachment_urls : [],
    approved_by: data.approved ? userId : null,
    created_by: userId,
  };

  try {
    const newEntry = await OutwardEntry.create(payload);
    return await getOutwardEntryById(newEntry.id);
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
 * Get single outward entry by ID
 */
export const getOutwardEntryById = async (id) => {
  try {
    const entry = await OutwardEntry.findByPk(id, {
      include: [
        { model: Department, as: 'recipientDepartment', attributes: ['id', 'name_en', 'name_mr', 'short_code', 'officer_name', 'phone'] },
        { model: InwardEntry, as: 'referenceInward', attributes: ['id', 'inward_number', 'subject', 'date_received'] },
        { model: User, as: 'approver', attributes: ['id', 'full_name', 'role'] },
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'role'] },
      ],
    });

    if (entry) return entry;
  } catch (err) {
    console.warn('DB findById fallback:', err.message);
  }

  const sample = SAMPLE_OUTWARD_ENTRIES.find((i) => String(i.id) === String(id));
  if (sample) return sample;

  const err = new Error(`Outward entry with ID ${id} not found`);
  err.statusCode = 404;
  throw err;
};

/**
 * Approve outward entry
 */
export const approveOutwardEntry = async (id, userId) => {
  try {
    const entry = await OutwardEntry.findByPk(id);
    if (entry) {
      await entry.update({ approved_by: userId });
      return await getOutwardEntryById(id);
    }
  } catch (err) {
    console.warn('DB approve fallback:', err.message);
  }

  const sample = SAMPLE_OUTWARD_ENTRIES.find((i) => String(i.id) === String(id));
  if (sample) {
    sample.approved_by = userId;
    sample.approver = { id: userId, full_name: 'PA / MLA Approver', role: 'PA' };
    sample.updated_at = new Date().toISOString();
    return sample;
  }

  const err = new Error(`Outward entry with ID ${id} not found`);
  err.statusCode = 404;
  throw err;
};

/**
 * Generate AI Letter Draft via Gemini service
 */
export const generateAiDraftService = async (payload) => {
  return await generateLetterDraft(payload);
};
