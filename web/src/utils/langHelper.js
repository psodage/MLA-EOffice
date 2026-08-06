// src/utils/langHelper.js
// ============================================================
// Multi-lingual Helper Utility for MLA E-Office
// Seamlessly resolves English (_en) vs Marathi text for DB records
// ============================================================

/**
 * Returns localized text for an entity field based on selected language
 * @param {object} item - Database record (Nivedan, Visitor, Inward, Outward, etc.)
 * @param {string} field - Field key (e.g., 'subject', 'citizen_name', 'purpose_description')
 * @param {string} lang - Active language code ('EN' | 'MR')
 * @returns {string} Localized text
 */
export const getLangText = (item, field, lang = 'EN') => {
  if (!item) return '';

  if (lang === 'EN') {
    if (field === 'subject') return item.subject_en || item.subject || '';
    if (field === 'description') return item.description_en || item.description || '';
    if (field === 'citizen_name') return item.citizen_name_en || item.citizen_name || '';
    if (field === 'visitor_name') return item.visitor_name_en || item.visitor_name || '';
    if (field === 'purpose_description') return item.purpose_description_en || item.purpose_description || '';
    if (field === 'project_name') return item.work_title_en || item.project_name_en || item.project_name || '';
    if (field === 'sender_name') return item.sender_name_en || item.sender_name || '';
    if (field === 'recipient_name') return item.recipient_name_en || item.recipient_name || '';
    if (field === 'title') return item.title_en || item.title || '';
    if (field === 'body_text') return item.body_text_en || item.body_text || '';
    if (field === 'full_name') return item.full_name_en || item.full_name || '';
    if (field === 'location') return item.location_en || item.location || '';

    return item[`${field}_en`] || item[field] || '';
  }

  return item[field] || item[`${field}_en`] || '';
};

export default getLangText;
