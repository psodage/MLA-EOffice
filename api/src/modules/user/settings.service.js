// src/modules/user/settings.service.js
// ============================================================
// Office Settings Service
// Department directory, WhatsApp festival calendar & Nivedan categories
// ============================================================

import Department from '../../models/Department.js';
import Category from '../../models/Category.js';

/** Sample Festival Calendar Fallback */
const SAMPLE_GREETINGS = [
  { id: 1, event_name: 'गुढीपाडवा (Gudi Padwa)', event_date: '2026-03-19', template_name: 'gudi_padwa_wish', is_active: true },
  { id: 2, event_name: 'डॉ. बाबासाहेब आंबेडकर जयंती', event_date: '2026-04-14', template_name: 'ambedkar_jayanti_wish', is_active: true },
  { id: 3, event_name: 'महाराष्ट्र दिन (Maharashtra Day)', event_date: '2026-05-01', template_name: 'maharashtra_day_wish', is_active: true },
  { id: 4, event_name: 'गणेशोत्सव (Ganesh Chaturthi)', event_date: '2026-09-14', template_name: 'ganesh_chaturthi_wish', is_active: true },
  { id: 5, event_name: 'दिवाळी (Diwali Laxmi Pujan)', event_date: '2026-11-08', template_name: 'diwali_wish', is_active: true },
];

/** Get Department Directory Settings */
export const getDepartmentSettings = async () => {
  try {
    const rows = await Department.findAll({ order: [['name_mr', 'ASC']] });
    if (rows && rows.length > 0) return rows;
  } catch (err) {
    console.warn('DB getDepartmentSettings fallback:', err.message);
  }

  return [
    { id: 1, name_mr: 'पाणीपुरवठा विभाग', head_officer_name: 'अविनाश पाटील (कार्यकारी अभियंता)', contact_number: '9822010001', email: 'water@rahati.gov.in' },
    { id: 2, name_mr: 'सार्वजनिक बांधकाम विभाग (PWD)', head_officer_name: 'संतोष देशपांडे (उपअभियंता)', contact_number: '9822010002', email: 'pwd@rahati.gov.in' },
    { id: 3, name_mr: 'महावितरण (वीज कंपनी)', head_officer_name: 'सुरेश शहा (सहाय्यक अभियंता)', contact_number: '9822010003', email: 'mseb@rahati.gov.in' },
    { id: 4, name_mr: 'आरोग्य विभाग', head_officer_name: 'डॉ. संजय गायकवाड (तालुका वैद्यकीय अधिकारी)', contact_number: '9822010004', email: 'health@rahati.gov.in' },
  ];
};

/** Get Festival Calendar Greetings Settings */
export const getGreetingSettings = async () => {
  return SAMPLE_GREETINGS;
};

/** Add Festival Greeting Event */
export const addGreetingSetting = async (data) => {
  const newEntry = {
    id: Date.now(),
    event_name: data.event_name,
    event_date: data.event_date,
    template_name: data.template_name || 'festival_greeting',
    is_active: true,
  };
  SAMPLE_GREETINGS.push(newEntry);
  return newEntry;
};

/** Get Nivedan Categories Settings */
export const getCategorySettings = async () => {
  try {
    const rows = await Category.findAll({ order: [['name_mr', 'ASC']] });
    if (rows && rows.length > 0) return rows;
  } catch (err) {
    console.warn('DB getCategorySettings fallback:', err.message);
  }

  return [
    { id: 1, name_mr: 'पिण्याचे पाणी व विहीर मंजुरी', name_en: 'Drinking Water & Borewell', default_department_id: 1, is_active: true },
    { id: 2, name_mr: 'रस्ता डांबरीकरण व दुरुस्ती', name_en: 'Road Construction & Repair', default_department_id: 2, is_active: true },
    { id: 3, name_mr: 'नवीन ट्रान्सफॉर्मर व वीज पुरवठा', name_en: 'New Transformer & Power Supply', default_department_id: 3, is_active: true },
    { id: 4, name_mr: 'वैद्यकीय उपचारासाठी आर्थिक मदत', name_en: 'Medical Assistance Aid', default_department_id: 4, is_active: true },
  ];
};
