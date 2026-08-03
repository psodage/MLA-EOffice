// src/modules/visitor/visitor.service.js
// ============================================================
// Visitor Book Business Logic
// Repeat visitor detection, Check-in/Check-out, Convert to Nivedan
// ============================================================

import Visitor from '../../models/Visitor.js';
import User from '../../models/User.js';
import Nivedan from '../../models/Nivedan.js';
import { createNivedan } from '../nivedan/nivedan.service.js';
import sequelize from '../../config/database.js';

const { Op } = sequelize.Sequelize;

/** Sample visitors fallback dataset */
const SAMPLE_VISITORS = [
  {
    id: 1,
    visitor_name: 'अशोक बाबुराव तांबे',
    mobile: '9822011223',
    address_line: 'सावळीविहीर बुद्रुक',
    city: 'राहाता',
    purpose: 'GRIEVANCE',
    purpose_description: 'पिण्याच्या पाण्याच्या समस्येबाबत तातडीने बैठक घेण्याची विनंती',
    check_in_time: new Date().toISOString(),
    check_out_time: null,
    is_repeat_visitor: true,
    previous_visit_count: 2,
    linked_nivedan_id: null,
    created_by: 3,
    creator: { id: 3, full_name: 'Priya Deshmukh (Receptionist)', role: 'RECEPTIONIST' },
  },
  {
    id: 2,
    visitor_name: 'रमेश सखाराम गव्हाणे',
    mobile: '9876543210',
    address_line: 'शिर्डी शहर',
    city: 'राहाता',
    purpose: 'COURTESY_CALL',
    purpose_description: 'शुभेच्छा भेट',
    check_in_time: new Date(Date.now() - 3600000).toISOString(),
    check_out_time: new Date(Date.now() - 1800000).toISOString(),
    is_repeat_visitor: false,
    previous_visit_count: 0,
    linked_nivedan_id: null,
    created_by: 3,
    creator: { id: 3, full_name: 'Priya Deshmukh (Receptionist)', role: 'RECEPTIONIST' },
  },
  {
    id: 3,
    visitor_name: 'ज्ञानदेव मारुती पवार',
    mobile: '9422098765',
    address_line: 'अस्तगाव',
    city: 'राहाता',
    purpose: 'INVITATION',
    purpose_description: 'विवाह सोहळ्याचे निमंत्रण पत्रिका सुपूर्द करणे',
    check_in_time: new Date(Date.now() - 7200000).toISOString(),
    check_out_time: null,
    is_repeat_visitor: true,
    previous_visit_count: 4,
    linked_nivedan_id: null,
    created_by: 3,
    creator: { id: 3, full_name: 'Priya Deshmukh (Receptionist)', role: 'RECEPTIONIST' },
  },
];

/** Lookup visitor by mobile for repeat visitor detection */
export const lookupVisitorByMobile = async (mobile) => {
  const cleanMobile = mobile.trim();
  try {
    const details = await Visitor.getRepeatVisitorDetails(cleanMobile);
    return details;
  } catch (err) {
    console.warn('DB lookupVisitorByMobile fallback:', err.message);
  }

  const existing = SAMPLE_VISITORS.find((v) => v.mobile === cleanMobile);
  if (existing) {
    return {
      isRepeat: true,
      previousCount: existing.previous_visit_count + 1,
      lastVisit: existing,
    };
  }

  return {
    isRepeat: false,
    previousCount: 0,
    lastVisit: null,
  };
};

/** Check in a new visitor */
export const checkInVisitor = async (data, userId) => {
  const mobile = data.mobile.trim();
  const repeatInfo = await lookupVisitorByMobile(mobile);

  const payload = {
    visitor_name: data.visitor_name,
    mobile,
    address_line: data.address_line || '',
    city: data.city || 'राहाता',
    pincode: data.pincode || null,
    village_id: data.village_id ? parseInt(data.village_id, 10) : null,
    purpose: data.purpose || 'GENERAL_INQUIRY',
    purpose_description: data.purpose_description || '',
    check_in_time: new Date(),
    check_out_time: null,
    is_repeat_visitor: repeatInfo.isRepeat,
    previous_visit_count: repeatInfo.previousCount,
    linked_nivedan_id: null,
    created_by: userId,
  };

  try {
    const newVisitor = await Visitor.create(payload);
    return newVisitor;
  } catch (err) {
    console.warn('DB checkInVisitor fallback:', err.message);
    const fallbackId = Date.now();
    return {
      id: fallbackId,
      ...payload,
      check_in_time: new Date().toISOString(),
      creator: { id: userId, full_name: 'Receptionist' },
    };
  }
};

/** Check out visitor (record departure timestamp) */
export const checkOutVisitor = async (id) => {
  try {
    const visitor = await Visitor.findByPk(id);
    if (visitor) {
      await visitor.update({ check_out_time: new Date() });
      return visitor;
    }
  } catch (err) {
    console.warn('DB checkOutVisitor fallback:', err.message);
  }

  const sample = SAMPLE_VISITORS.find((v) => String(v.id) === String(id));
  if (sample) {
    sample.check_out_time = new Date().toISOString();
    return sample;
  }

  const err = new Error(`Visitor with ID ${id} not found`);
  err.statusCode = 404;
  throw err;
};

/** List visitors with date filter & summary statistics */
export const listVisitors = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const where = {};

  if (query.purpose && query.purpose !== 'ALL') {
    where.purpose = query.purpose;
  }

  if (query.search) {
    const term = `%${query.search.trim()}%`;
    where[Op.or] = [
      { visitor_name: { [Op.like]: term } },
      { mobile: { [Op.like]: term } },
      { purpose_description: { [Op.like]: term } },
    ];
  }

  // Date filter (default to today if specified or return recent)
  if (query.date) {
    const targetDate = query.date;
    where.check_in_time = {
      [Op.between]: [`${targetDate} 00:00:00`, `${targetDate} 23:59:59`],
    };
  }

  try {
    const { count, rows } = await Visitor.findAndCountAll({
      where,
      limit,
      offset,
      order: [['check_in_time', 'DESC']],
      include: [
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'role'] },
        { model: Nivedan, as: 'linkedNivedan', attributes: ['id', 'tracking_id', 'status', 'subject'] },
      ],
    });

    if (count > 0 || Object.keys(query).length > 0) {
      const currentlyInOffice = rows.filter((r) => !r.check_out_time).length;
      const repeatVisitorsCount = rows.filter((r) => r.is_repeat_visitor).length;
      const convertedCount = rows.filter((r) => r.linked_nivedan_id).length;

      return {
        items: rows,
        summary: {
          totalVisitorsToday: count,
          currentlyInOffice,
          repeatVisitorsCount,
          convertedCount,
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
    console.warn('DB query fallback to sample visitors:', err.message);
  }

  // Memory fallback filtering
  let filtered = [...SAMPLE_VISITORS];
  if (query.purpose && query.purpose !== 'ALL') {
    filtered = filtered.filter((v) => v.purpose === query.purpose);
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.visitor_name.toLowerCase().includes(q) ||
        v.mobile.includes(q) ||
        (v.purpose_description && v.purpose_description.toLowerCase().includes(q))
    );
  }

  const totalItems = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    items: paginated,
    summary: {
      totalVisitorsToday: totalItems,
      currentlyInOffice: filtered.filter((v) => !v.check_out_time).length,
      repeatVisitorsCount: filtered.filter((v) => v.is_repeat_visitor).length,
      convertedCount: filtered.filter((v) => v.linked_nivedan_id).length,
    },
    meta: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit) || 1,
    },
  };
};

/** Convert Visitor Grievance to Official Nivedan Petition */
export const convertVisitorToNivedan = async (visitorId, nivedanData, userId) => {
  let visitor;
  try {
    visitor = await Visitor.findByPk(visitorId);
  } catch (err) {
    console.warn('DB find visitor fallback:', err.message);
  }

  if (!visitor) {
    visitor = SAMPLE_VISITORS.find((v) => String(v.id) === String(visitorId));
  }

  if (!visitor) {
    const err = new Error(`Visitor with ID ${visitorId} not found`);
    err.statusCode = 404;
    throw err;
  }

  // Prepare Nivedan payload
  const nivedanPayload = {
    citizen_name: nivedanData.citizen_name || visitor.visitor_name,
    citizen_mobile: nivedanData.citizen_mobile || visitor.mobile,
    citizen_address_line: nivedanData.citizen_address_line || visitor.address_line || '',
    citizen_city: visitor.city || 'राहाता',
    category_id: nivedanData.category_id || 1,
    subject: nivedanData.subject || visitor.purpose_description || 'नागरिक भेट तक्रार',
    description: nivedanData.description || visitor.purpose_description || 'नागरिक भेट प्रसंगी सुपूर्द केलेली तक्रार.',
    priority: nivedanData.priority || 'MEDIUM',
    linked_visitor_id: visitor.id,
  };

  const newNivedan = await createNivedan(nivedanPayload, userId);

  try {
    if (typeof visitor.update === 'function') {
      await visitor.update({ linked_nivedan_id: newNivedan.id });
    } else {
      visitor.linked_nivedan_id = newNivedan.id;
    }
  } catch (err) {
    console.warn('DB update visitor link fallback:', err.message);
  }

  return {
    visitor,
    newNivedan,
  };
};
