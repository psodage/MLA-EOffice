'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // ── 14 Main Categories ──────────────────────────────────────
    // IDs 1-14 are main categories (parent_id = NULL)
    // default_department_id references departments seeded in 01-seed-departments
    const mainCategories = [
      { id: 1,  code: 'WATER_SUPPLY',   name_en: 'Water Supply',              name_mr: 'पाणीपुरवठा',                    default_department_id: 10, escalation_days: 5,  default_priority: 'MEDIUM', sort_order: 1,  parent_id: null, is_active: true },
      { id: 2,  code: 'ROAD_DRAINAGE',  name_en: 'Road / Drainage',           name_mr: 'रस्ते / गटार',                  default_department_id: 9,  escalation_days: 10, default_priority: 'MEDIUM', sort_order: 2,  parent_id: null, is_active: true },
      { id: 3,  code: 'ELECTRICITY',    name_en: 'Electricity',               name_mr: 'वीजपुरवठा',                      default_department_id: 11, escalation_days: 3,  default_priority: 'MEDIUM', sort_order: 3,  parent_id: null, is_active: true },
      { id: 4,  code: 'LAND_REVENUE',   name_en: 'Land / Revenue',            name_mr: 'जमीन / महसूल',                  default_department_id: 12, escalation_days: 5,  default_priority: 'MEDIUM', sort_order: 4,  parent_id: null, is_active: true },
      { id: 5,  code: 'EDUCATION',      name_en: 'Education',                 name_mr: 'शिक्षण',                          default_department_id: 13, escalation_days: 5,  default_priority: 'MEDIUM', sort_order: 5,  parent_id: null, is_active: true },
      { id: 6,  code: 'HEALTH_MEDICAL', name_en: 'Health / Medical',          name_mr: 'आरोग्य',                          default_department_id: 14, escalation_days: 2,  default_priority: 'MEDIUM', sort_order: 6,  parent_id: null, is_active: true },
      { id: 7,  code: 'PENSION_WELFARE',name_en: 'Pension / Social Welfare',  name_mr: 'पेन्शन / समाजकल्याण',            default_department_id: 15, escalation_days: 5,  default_priority: 'MEDIUM', sort_order: 7,  parent_id: null, is_active: true },
      { id: 8,  code: 'RATION_CARD',    name_en: 'Ration Card / PDS',         name_mr: 'रेशनकार्ड',                       default_department_id: 20, escalation_days: 5,  default_priority: 'MEDIUM', sort_order: 8,  parent_id: null, is_active: true },
      { id: 9,  code: 'CERTIFICATE',    name_en: 'Caste / Income Certificate',name_mr: 'जात / उत्पन्न प्रमाणपत्र',       default_department_id: 2,  escalation_days: 7,  default_priority: 'MEDIUM', sort_order: 9,  parent_id: null, is_active: true },
      { id: 10, code: 'HOUSING',        name_en: 'Housing / Awas Yojana',     name_mr: 'घरकुल / आवास योजना',             default_department_id: 1,  escalation_days: 7,  default_priority: 'MEDIUM', sort_order: 10, parent_id: null, is_active: true },
      { id: 11, code: 'AGRICULTURE',    name_en: 'Agriculture',               name_mr: 'शेती',                             default_department_id: 16, escalation_days: 7,  default_priority: 'MEDIUM', sort_order: 11, parent_id: null, is_active: true },
      { id: 12, code: 'EMPLOYMENT',     name_en: 'Employment / Rojgar',       name_mr: 'रोजगार',                           default_department_id: 15, escalation_days: 7,  default_priority: 'MEDIUM', sort_order: 12, parent_id: null, is_active: true },
      { id: 13, code: 'POLICE',         name_en: 'Police / Law & Order',      name_mr: 'पोलीस',                            default_department_id: 17, escalation_days: 5,  default_priority: 'MEDIUM', sort_order: 13, parent_id: null, is_active: true },
      { id: 14, code: 'GENERAL_OTHER',  name_en: 'General / Other',           name_mr: 'इतर',                               default_department_id: null,escalation_days: 7,  default_priority: 'MEDIUM', sort_order: 14, parent_id: null, is_active: true },
    ];

    // ── Sub-Categories ──────────────────────────────────────────
    // IDs start at 100 to avoid conflicts with main categories
    const subCategories = [
      // Water Supply (parent_id: 1)
      { id: 101, code: 'WATER_NO_SUPPLY',     name_en: 'No water supply',           name_mr: 'पाणी येत नाही',             parent_id: 1, default_department_id: 10, escalation_days: 5, default_priority: 'MEDIUM', sort_order: 1, is_active: true },
      { id: 102, code: 'WATER_LOW_PRESSURE',   name_en: 'Low water pressure',        name_mr: 'पाण्याचा दाब कमी',          parent_id: 1, default_department_id: 10, escalation_days: 5, default_priority: 'MEDIUM', sort_order: 2, is_active: true },
      { id: 103, code: 'WATER_CONTAMINATED',   name_en: 'Contaminated / dirty water', name_mr: 'दूषित / गढूळ पाणी',        parent_id: 1, default_department_id: 10, escalation_days: 3, default_priority: 'HIGH',   sort_order: 3, is_active: true },
      { id: 104, code: 'WATER_PIPELINE_LEAK',  name_en: 'Pipeline leak / burst',     name_mr: 'पाइपलाइन गळती / फुटणे',    parent_id: 1, default_department_id: 10, escalation_days: 3, default_priority: 'HIGH',   sort_order: 4, is_active: true },
      { id: 105, code: 'WATER_NEW_CONNECTION', name_en: 'New connection request',    name_mr: 'नवीन जोडणी मागणी',          parent_id: 1, default_department_id: 10, escalation_days: 7, default_priority: 'LOW',    sort_order: 5, is_active: true },
      { id: 106, code: 'WATER_BILL_DISPUTE',   name_en: 'Water bill dispute',        name_mr: 'पाणी बिल वाद',              parent_id: 1, default_department_id: 10, escalation_days: 7, default_priority: 'LOW',    sort_order: 6, is_active: true },
      { id: 107, code: 'WATER_BOREWELL',       name_en: 'Borewell / handpump issue', name_mr: 'बोअरवेल / हातपंप',          parent_id: 1, default_department_id: 10, escalation_days: 5, default_priority: 'MEDIUM', sort_order: 7, is_active: true },
      { id: 108, code: 'WATER_OTHER',          name_en: 'Other water issue',         name_mr: 'इतर पाणी समस्या',           parent_id: 1, default_department_id: 10, escalation_days: 5, default_priority: 'MEDIUM', sort_order: 8, is_active: true },

      // Road / Drainage (parent_id: 2)
      { id: 201, code: 'ROAD_POTHOLE',          name_en: 'Potholes / damaged road',      name_mr: 'खड्डे / खराब रस्ता',       parent_id: 2, default_department_id: 9, escalation_days: 10, default_priority: 'MEDIUM', sort_order: 1, is_active: true },
      { id: 202, code: 'ROAD_NEW_CONSTRUCTION',  name_en: 'New road construction request', name_mr: 'नवीन रस्ता बांधकाम',       parent_id: 2, default_department_id: 9, escalation_days: 10, default_priority: 'LOW',    sort_order: 2, is_active: true },
      { id: 203, code: 'ROAD_WIDENING',          name_en: 'Road widening request',        name_mr: 'रस्ता रुंदीकरण',             parent_id: 2, default_department_id: 9, escalation_days: 10, default_priority: 'LOW',    sort_order: 3, is_active: true },
      { id: 204, code: 'ROAD_DRAINAGE_BLOCK',    name_en: 'Blocked drainage / nala',      name_mr: 'गटार / नाला बंद',            parent_id: 2, default_department_id: 9, escalation_days: 5,  default_priority: 'HIGH',   sort_order: 4, is_active: true },
      { id: 205, code: 'ROAD_DRAINAGE_NEW',      name_en: 'New drainage construction',    name_mr: 'नवीन गटार बांधकाम',         parent_id: 2, default_department_id: 9, escalation_days: 10, default_priority: 'LOW',    sort_order: 5, is_active: true },
      { id: 206, code: 'ROAD_FOOTPATH',          name_en: 'Footpath / sidewalk issue',    name_mr: 'पायवाट / फुटपाथ',            parent_id: 2, default_department_id: 9, escalation_days: 10, default_priority: 'LOW',    sort_order: 6, is_active: true },
      { id: 207, code: 'ROAD_SPEED_BREAKER',     name_en: 'Speed breaker request',        name_mr: 'स्पीडब्रेकर मागणी',          parent_id: 2, default_department_id: 9, escalation_days: 10, default_priority: 'LOW',    sort_order: 7, is_active: true },
      { id: 208, code: 'ROAD_OTHER',             name_en: 'Other road/drainage issue',    name_mr: 'इतर रस्ता/गटार',             parent_id: 2, default_department_id: 9, escalation_days: 10, default_priority: 'MEDIUM', sort_order: 8, is_active: true },

      // Electricity (parent_id: 3)
      { id: 301, code: 'ELEC_NO_SUPPLY',       name_en: 'No electricity supply',        name_mr: 'वीज पुरवठा बंद',            parent_id: 3, default_department_id: 11, escalation_days: 3, default_priority: 'HIGH',   sort_order: 1, is_active: true },
      { id: 302, code: 'ELEC_FREQUENT_OUTAGE', name_en: 'Frequent power cuts',          name_mr: 'वारंवार वीज खंडित',          parent_id: 3, default_department_id: 11, escalation_days: 3, default_priority: 'MEDIUM', sort_order: 2, is_active: true },
      { id: 303, code: 'ELEC_LOW_VOLTAGE',     name_en: 'Low voltage issue',            name_mr: 'कमी व्होल्टेज',               parent_id: 3, default_department_id: 11, escalation_days: 5, default_priority: 'MEDIUM', sort_order: 3, is_active: true },
      { id: 304, code: 'ELEC_TRANSFORMER',     name_en: 'Transformer problem',          name_mr: 'ट्रान्सफॉर्मर समस्या',       parent_id: 3, default_department_id: 11, escalation_days: 3, default_priority: 'HIGH',   sort_order: 4, is_active: true },
      { id: 305, code: 'ELEC_STREETLIGHT',     name_en: 'Street light not working',     name_mr: 'रस्त्यावरील दिवे बंद',       parent_id: 3, default_department_id: 11, escalation_days: 5, default_priority: 'MEDIUM', sort_order: 5, is_active: true },
      { id: 306, code: 'ELEC_NEW_CONNECTION',   name_en: 'New connection request',       name_mr: 'नवीन वीज जोडणी',             parent_id: 3, default_department_id: 11, escalation_days: 7, default_priority: 'LOW',    sort_order: 6, is_active: true },
      { id: 307, code: 'ELEC_BILL_DISPUTE',     name_en: 'Electricity bill dispute',     name_mr: 'वीज बिल वाद',                parent_id: 3, default_department_id: 11, escalation_days: 7, default_priority: 'LOW',    sort_order: 7, is_active: true },
      { id: 308, code: 'ELEC_WIRE_DANGER',      name_en: 'Dangerous hanging wire',       name_mr: 'धोकादायक तार लटकणे',        parent_id: 3, default_department_id: 11, escalation_days: 1, default_priority: 'HIGH',   sort_order: 8, is_active: true },
      { id: 309, code: 'ELEC_OTHER',            name_en: 'Other electricity issue',      name_mr: 'इतर वीज समस्या',             parent_id: 3, default_department_id: 11, escalation_days: 5, default_priority: 'MEDIUM', sort_order: 9, is_active: true },

      // Health / Medical (parent_id: 6)
      { id: 601, code: 'HEALTH_HOSPITAL',    name_en: 'Hospital facility issue',     name_mr: 'रुग्णालय सुविधा समस्या',     parent_id: 6, default_department_id: 14, escalation_days: 2, default_priority: 'HIGH',   sort_order: 1, is_active: true },
      { id: 602, code: 'HEALTH_DOCTOR',      name_en: 'Doctor not available',        name_mr: 'डॉक्टर उपलब्ध नाही',        parent_id: 6, default_department_id: 14, escalation_days: 2, default_priority: 'HIGH',   sort_order: 2, is_active: true },
      { id: 603, code: 'HEALTH_MEDICINE',    name_en: 'Medicine shortage',           name_mr: 'औषध तुटवडा',                 parent_id: 6, default_department_id: 14, escalation_days: 2, default_priority: 'HIGH',   sort_order: 3, is_active: true },
      { id: 604, code: 'HEALTH_AMBULANCE',   name_en: 'Ambulance service issue',    name_mr: 'रुग्णवाहिका सेवा',            parent_id: 6, default_department_id: 14, escalation_days: 1, default_priority: 'HIGH',   sort_order: 4, is_active: true },
      { id: 605, code: 'HEALTH_PHC',         name_en: 'Primary Health Center issue', name_mr: 'प्राथमिक आरोग्य केंद्र',     parent_id: 6, default_department_id: 14, escalation_days: 3, default_priority: 'MEDIUM', sort_order: 5, is_active: true },
      { id: 606, code: 'HEALTH_INSURANCE',   name_en: 'Health insurance claim issue',name_mr: 'आरोग्य विमा दावा',           parent_id: 6, default_department_id: 14, escalation_days: 5, default_priority: 'MEDIUM', sort_order: 6, is_active: true },
      { id: 607, code: 'HEALTH_SANITATION',  name_en: 'Sanitation / cleanliness',   name_mr: 'स्वच्छता / सफाई',             parent_id: 6, default_department_id: 14, escalation_days: 3, default_priority: 'MEDIUM', sort_order: 7, is_active: true },
      { id: 608, code: 'HEALTH_OTHER',       name_en: 'Other health issue',         name_mr: 'इतर आरोग्य',                   parent_id: 6, default_department_id: 14, escalation_days: 3, default_priority: 'MEDIUM', sort_order: 8, is_active: true },

      // Land / Revenue (parent_id: 4)
      { id: 401, code: 'LAND_7_12',           name_en: '7/12 extract issue',         name_mr: '७/१२ उतारा समस्या',           parent_id: 4, default_department_id: 12, escalation_days: 5, default_priority: 'MEDIUM', sort_order: 1, is_active: true },
      { id: 402, code: 'LAND_MUTATION',        name_en: 'Land mutation (ferfar)',     name_mr: 'जमीन फेरफार',                 parent_id: 4, default_department_id: 12, escalation_days: 7, default_priority: 'MEDIUM', sort_order: 2, is_active: true },
      { id: 403, code: 'LAND_ENCROACHMENT',   name_en: 'Encroachment complaint',    name_mr: 'अतिक्रमण तक्रार',             parent_id: 4, default_department_id: 12, escalation_days: 5, default_priority: 'MEDIUM', sort_order: 3, is_active: true },
      { id: 404, code: 'LAND_DISPUTE',        name_en: 'Land dispute / boundary',   name_mr: 'जमीन वाद / हद्द',             parent_id: 4, default_department_id: 12, escalation_days: 7, default_priority: 'MEDIUM', sort_order: 4, is_active: true },
      { id: 405, code: 'LAND_NA_CONVERSION',  name_en: 'NA conversion',             name_mr: 'NA रूपांतर',                   parent_id: 4, default_department_id: 12, escalation_days: 7, default_priority: 'LOW',    sort_order: 5, is_active: true },
      { id: 406, code: 'LAND_SURVEY',         name_en: 'Land survey request',       name_mr: 'जमीन मोजणी',                  parent_id: 4, default_department_id: 12, escalation_days: 7, default_priority: 'LOW',    sort_order: 6, is_active: true },
      { id: 407, code: 'LAND_OTHER',          name_en: 'Other land/revenue issue',  name_mr: 'इतर जमीन/महसूल',              parent_id: 4, default_department_id: 12, escalation_days: 7, default_priority: 'MEDIUM', sort_order: 7, is_active: true },
    ];

    await queryInterface.bulkInsert('categories', mainCategories);
    await queryInterface.bulkInsert('categories', subCategories);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
