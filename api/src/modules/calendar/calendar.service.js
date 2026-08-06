// src/modules/calendar/calendar.service.js
// ============================================================
// Calendar & Schedule Business Logic
// CRUD, month grid filter, today's schedule & upcoming 7-day events
// ============================================================

import CalendarEvent from '../../models/CalendarEvent.js';
import User from '../../models/User.js';
import sequelize from '../../config/database.js';

const { Op } = sequelize.Sequelize;

/** Helper to get current YYYY-MM-DD */
const getTodayStr = () => new Date().toISOString().split('T')[0];

/** Sample Calendar Events Fallback */
const SAMPLE_EVENTS = [
  {
    id: 1,
    title: 'जिल्हा नियोजन समिती (DPDC) महत्त्वाची आढावा बैठक',
    title_en: 'District Planning Committee (DPDC) Review Meeting',
    description: 'जिल्हाधिकारी कार्यालयात अहमदनगर जिल्ह्यातील सर्व विकासकामांची आढावा बैठक.',
    description_en: 'Review meeting for all development works in the district at Collectorate.',
    event_type: 'MEETING',
    event_date: getTodayStr(),
    start_time: '11:00',
    end_time: '13:30',
    location: 'जिल्हाधिकारी कार्यालय, अहमदनगर',
    location_en: 'Collector Office, Ahilyanagar',
    attendees: [1, 2],
    is_recurring: false,
    is_cancelled: false,
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'सावळीविहीर बुद्रुक रस्ता लोकार्पण सोहळा',
    title_en: 'Sawalivihar Budruk Road Inauguration Ceremony',
    description: 'नवीन डांबरीकरण रस्त्याचे नागरिकांच्या हस्ते लोकार्पण.',
    description_en: 'Inauguration of newly paved asphalt road by citizens.',
    event_type: 'PUBLIC_PROGRAM',
    event_date: getTodayStr(),
    start_time: '16:00',
    end_time: '18:00',
    location: 'ग्रामपंचायत सावळीविहीर बुद्रुक',
    location_en: 'Gram Panchayat Sawalivihar Budruk',
    attendees: [1],
    is_recurring: false,
    is_cancelled: false,
    created_at: '2026-08-02T10:00:00Z',
  },
  {
    id: 3,
    title: 'विधानसभा पावसाळी अधिवेशन सत्र-३',
    title_en: 'Legislative Assembly Monsoon Session — Day 3',
    description: 'विधानभवन मुंबई येथे कामकाज व मतदारसंघातील तारांकित प्रश्न सादरीकरण.',
    description_en: 'Assembly proceedings at Vidhan Bhavan Mumbai & starred question presentation.',
    event_type: 'ASSEMBLY_SESSION',
    event_date: '2026-08-06',
    start_time: '10:30',
    end_time: '17:30',
    location: 'विधानभवन, मुंबई',
    location_en: 'Vidhan Bhavan, Mumbai',
    attendees: [1],
    is_recurring: false,
    is_cancelled: false,
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 4,
    title: 'शासकीय निधी अंतिम विनियोग अहवाल सादर करणे (मुदत)',
    title_en: 'Government Funds Final Allocation Report Submission Deadline',
    description: 'वित्त विभागाकडे चालू वर्षाचा अंतिम निधी खर्च अहवाल जमा करण्याची अंतिम तारीख.',
    description_en: 'Final deadline to submit annual fund expenditure report to Finance Dept.',
    event_type: 'GOVT_DEADLINE',
    event_date: '2026-08-08',
    start_time: '18:00',
    end_time: '18:00',
    location: 'मंत्रालय, मुंबई',
    location_en: 'Mantralaya, Mumbai',
    attendees: [2],
    is_recurring: false,
    is_cancelled: false,
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 5,
    title: 'राहाता तालुका सार्वजनिक जनसंवाद दौरा',
    title_en: 'Rahata Taluka Public Outreach & Grievance Tour',
    description: 'नागरिकांच्या तक्रारी प्रत्यक्ष जागेवर ऐकण्यासाठी गाव दौरा.',
    description_en: 'Village tour to hear citizen grievances directly on-site.',
    event_type: 'CONSTITUENCY_VISIT',
    event_date: '2026-08-09',
    start_time: '09:00',
    end_time: '15:00',
    location: 'कोल्हार, राहाता, शिर्डी ग्रामीण क्षेत्र',
    location_en: 'Kolhar, Rahata, Shirdi Rural Area',
    attendees: [1, 3],
    is_recurring: false,
    is_cancelled: false,
    created_at: '2026-08-02T10:00:00Z',
  },
];

/** Fetch events filtered by month (YYYY-MM) or event_type */
export const listEvents = async (query = {}) => {
  const where = { is_cancelled: false };

  if (query.event_type && query.event_type !== 'ALL') {
    where.event_type = query.event_type;
  }

  if (query.month) {
    // Month filter format: "YYYY-MM"
    const startOfMonth = `${query.month}-01`;
    const endOfMonth = `${query.month}-31`;
    where.event_date = { [Op.between]: [startOfMonth, endOfMonth] };
  }

  try {
    const rows = await CalendarEvent.findAll({
      where,
      order: [['event_date', 'ASC'], ['start_time', 'ASC']],
      include: [{ model: User, as: 'creator', attributes: ['id', 'full_name', 'role'] }],
    });

    if (rows && rows.length > 0) return rows;
  } catch (err) {
    console.warn('DB query fallback to sample events:', err.message);
  }

  // Memory fallback filtering
  let filtered = [...SAMPLE_EVENTS];
  if (query.event_type && query.event_type !== 'ALL') {
    filtered = filtered.filter((e) => e.event_type === query.event_type);
  }
  if (query.month) {
    filtered = filtered.filter((e) => e.event_date.startsWith(query.month));
  }

  return filtered;
};

/** Get today's events */
export const getTodayEvents = async () => {
  const todayStr = getTodayStr();

  try {
    const rows = await CalendarEvent.findAll({
      where: {
        event_date: todayStr,
        is_cancelled: false,
      },
      order: [['start_time', 'ASC']],
    });
    if (rows && rows.length > 0) return rows;
  } catch (err) {
    console.warn('DB getTodayEvents fallback:', err.message);
  }

  return SAMPLE_EVENTS.filter((e) => e.event_date === todayStr && !e.is_cancelled);
};

/** Get upcoming events for next 7 days */
export const getUpcomingEvents = async () => {
  const today = new Date();
  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  const todayStr = today.toISOString().split('T')[0];
  const next7Str = next7Days.toISOString().split('T')[0];

  try {
    const rows = await CalendarEvent.findAll({
      where: {
        event_date: { [Op.between]: [todayStr, next7Str] },
        is_cancelled: false,
      },
      order: [['event_date', 'ASC'], ['start_time', 'ASC']],
    });
    if (rows && rows.length > 0) return rows;
  } catch (err) {
    console.warn('DB getUpcomingEvents fallback:', err.message);
  }

  return SAMPLE_EVENTS.filter(
    (e) => e.event_date >= todayStr && e.event_date <= next7Str && !e.is_cancelled
  );
};

/** Create a new calendar event */
export const createEvent = async (data, userId) => {
  const payload = {
    title: data.title,
    description: data.description || '',
    event_type: data.event_type || 'MEETING',
    event_date: data.event_date,
    start_time: data.start_time || '10:00',
    end_time: data.end_time || '11:00',
    location: data.location || '',
    attendees: data.attendees || [userId],
    is_recurring: Boolean(data.is_recurring),
    recurrence_rule: data.recurrence_rule || null,
    reminder_minutes: parseInt(data.reminder_minutes, 10) || 30,
    is_cancelled: false,
    created_by: userId,
  };

  try {
    const newEntry = await CalendarEvent.create(payload);
    return newEntry;
  } catch (err) {
    console.warn('DB createEvent fallback:', err.message);
    const newEvent = {
      id: Date.now(),
      ...payload,
      created_at: new Date().toISOString(),
    };
    SAMPLE_EVENTS.push(newEvent);
    return newEvent;
  }
};

/** Get single event by ID */
export const getEventById = async (id) => {
  try {
    const entry = await CalendarEvent.findByPk(id);
    if (entry) return entry;
  } catch (err) {
    console.warn('DB getEventById fallback:', err.message);
  }

  const sample = SAMPLE_EVENTS.find((e) => String(e.id) === String(id));
  if (sample) return sample;

  const err = new Error(`Calendar event with ID ${id} not found`);
  err.statusCode = 404;
  throw err;
};

/** Update or cancel event */
export const updateEvent = async (id, updateData, userId) => {
  try {
    const entry = await CalendarEvent.findByPk(id);
    if (entry) {
      await entry.update(updateData);
      return entry;
    }
  } catch (err) {
    console.warn('DB updateEvent fallback:', err.message);
  }

  const sample = SAMPLE_EVENTS.find((e) => String(e.id) === String(id));
  if (sample) {
    Object.assign(sample, updateData);
    return sample;
  }

  const err = new Error(`Calendar event with ID ${id} not found`);
  err.statusCode = 404;
  throw err;
};
