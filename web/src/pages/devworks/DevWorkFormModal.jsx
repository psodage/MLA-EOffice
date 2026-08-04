import { useState, useEffect } from 'react';
import { X, HardHat, AlertTriangle, Save } from 'lucide-react';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';

const CATEGORY_OPTIONS = [
  { value: 'ROAD', labelEn: 'Roads & Bridges', labelMr: 'रस्ते व पूल' },
  { value: 'DRAINAGE', labelEn: 'Drainage & Sewage', labelMr: 'गटारे व सांडपाणी' },
  { value: 'WATER_PIPELINE', labelEn: 'Water Supply', labelMr: 'पाणीपुरवठा पाइपलाइन' },
  { value: 'HOSPITAL', labelEn: 'Hospital / Health Center', labelMr: 'रुग्णालय व आरोग्य केंद्र' },
  { value: 'SCHOOL', labelEn: 'School / Digital Classroom', labelMr: 'शाळा व डिजिटल क्लासरूम' },
  { value: 'COMMUNITY_HALL', labelEn: 'Community Hall', labelMr: 'समाजमंदिर व सभागृह' },
  { value: 'STREET_LIGHT', labelEn: 'Street Light', labelMr: 'रस्त्यावरील दिवे' },
  { value: 'ELECTRIFICATION', labelEn: 'Electrification', labelMr: 'विद्युतीकरण' },
  { value: 'GARDEN_PARK', labelEn: 'Garden & Park', labelMr: 'उद्यान व सुशोभीकरण' },
  { value: 'OTHER', labelEn: 'Other Development Work', labelMr: 'इतर विकासकामे' },
];

const FUNDING_OPTIONS = [
  { value: 'MLALAD', labelEn: 'MLALAD Fund', labelMr: 'आमदार निधी' },
  { value: 'ZP_FUND', labelEn: 'ZP Fund', labelMr: 'जिल्हा परिषद निधी' },
  { value: 'STATE_GRANT', labelEn: 'State Grant', labelMr: 'राज्य शासन अनुदान' },
  { value: 'CENTRAL_GRANT', labelEn: 'Central Grant', labelMr: 'केंद्र शासन अनुदान' },
  { value: 'MUNICIPAL_FUND', labelEn: 'Municipal Fund', labelMr: 'नगरपालिका / नगरपंचायत निधी' },
  { value: 'GP_FUND', labelEn: 'GP Fund', labelMr: 'ग्रामपंचायत निधी' },
  { value: 'MPLAD', labelEn: 'MPLAD Fund', labelMr: 'खासदार निधी' },
  { value: 'CSR', labelEn: 'CSR Fund', labelMr: 'सीएसआर निधी' },
  { value: 'OTHER_MIXED', labelEn: 'Other / Mixed Fund', labelMr: 'इतर संयुक्त निधी' },
];

const DevWorkFormModal = ({ isOpen, onClose, onSuccess }) => {
  const { lang } = useLangStore();
  const isMr = lang === 'MR';

  const [form, setForm] = useState({
    project_name: '',
    category: 'ROAD',
    location: '',
    geo_latitude: '19.6917',
    geo_longitude: '74.4842',
    funding_source: 'MLALAD',
    budget_allocated: '',
    budget_spent: '0',
    contractor_name: '',
    contractor_contact: '',
    start_date: '',
    expected_completion_date: '',
    progress_percentage: '0',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      project_name: '',
      category: 'ROAD',
      location: '',
      geo_latitude: '19.6917',
      geo_longitude: '74.4842',
      funding_source: 'MLALAD',
      budget_allocated: '',
      budget_spent: '0',
      contractor_name: '',
      contractor_contact: '',
      start_date: '',
      expected_completion_date: '',
      progress_percentage: '0',
      description: '',
    });
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setError('');
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.project_name.trim()) {
      setError(isMr ? 'कृपया कामाचे नाव प्रविष्ट करा.' : 'Project name is required.');
      return;
    }
    if (!form.location.trim()) {
      setError(isMr ? 'कृपया ठिकाण प्रविष्ट करा.' : 'Location is required.');
      return;
    }
    if (!form.budget_allocated || parseFloat(form.budget_allocated) <= 0) {
      setError(isMr ? 'कृपया मंजूर अर्थसंकल्प रक्कम प्रविष्ट करा.' : 'Please enter valid allocated budget.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/devworks', form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Save project error:', err);
      setError(err?.response?.data?.message || (isMr ? 'विकासकाम जतन करताना त्रुटी आली.' : 'Error saving project.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inward-modal-overlay" onClick={onClose}>
      <div className="inward-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="inward-modal-header">
          <div className="modal-title-group">
            <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <HardHat size={18} /> {isMr ? 'नवीन विकासकाम प्रकल्प नोंदणी' : 'Add Infrastructure Project'}
            </h3>
            <span className="modal-subtitle-en">
              {isMr ? 'विकासप्रकल्प, निधी स्रोत, लोकेशन व बजेट नोंदवा' : 'Register Project, Funding, GPS Location & Budget'}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="inward-form">
          {error && <div className="form-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} /> {error}</div>}

          <div className="form-grid">
            {/* Project Name */}
            <div className="form-group col-span-2">
              <label>{isMr ? 'विकासकामाचे नाव' : 'Project Name'} <span className="req">*</span></label>
              <input
                type="text"
                name="project_name"
                value={form.project_name}
                onChange={handleChange}
                placeholder={isMr ? 'उदा. मुख्य रस्ता रुंदीकरण व डांबरीकरण काम' : 'e.g. Main Road Widening and Asphalt Work'}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>{isMr ? 'कामाचा प्रकार' : 'Category'} <span className="req">*</span></label>
              <select name="category" value={form.category} onChange={handleChange} required>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {isMr ? c.labelMr : c.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Funding Source */}
            <div className="form-group">
              <label>{isMr ? 'निधीचा स्रोत' : 'Funding Source'} <span className="req">*</span></label>
              <select name="funding_source" value={form.funding_source} onChange={handleChange} required>
                {FUNDING_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {isMr ? f.labelMr : f.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="form-group col-span-2">
              <label>{isMr ? 'कामाचे ठिकाण व पत्ता' : 'Location'} <span className="req">*</span></label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder={isMr ? 'उदा. सावळीविहीर बुद्रुक, तालुका राहाता, जि. अहमदनगर' : 'e.g. Sawalivihir Bk, Taluka Rahata'}
                required
              />
            </div>

            {/* GPS Latitude */}
            <div className="form-group">
              <label>{isMr ? 'GPS अक्षवृत्त' : 'GPS Latitude'}</label>
              <input
                type="number"
                step="any"
                name="geo_latitude"
                value={form.geo_latitude}
                onChange={handleChange}
                placeholder="19.6917"
              />
            </div>

            {/* GPS Longitude */}
            <div className="form-group">
              <label>{isMr ? 'GPS रेखावृत्त' : 'GPS Longitude'}</label>
              <input
                type="number"
                step="any"
                name="geo_longitude"
                value={form.geo_longitude}
                onChange={handleChange}
                placeholder="74.4842"
              />
            </div>

            {/* Budget Allocated */}
            <div className="form-group">
              <label>{isMr ? 'मंजूर अर्थसंकल्प (रक्कम ₹)' : 'Allocated Budget (₹)'} <span className="req">*</span></label>
              <input
                type="number"
                name="budget_allocated"
                value={form.budget_allocated}
                onChange={handleChange}
                placeholder={isMr ? 'उदा. ५००००००' : 'e.g. 5000000'}
                required
              />
            </div>

            {/* Budget Spent */}
            <div className="form-group">
              <label>{isMr ? 'खर्च झालेली रक्कम (रक्कम ₹)' : 'Spent Budget (₹)'}</label>
              <input
                type="number"
                name="budget_spent"
                value={form.budget_spent}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            {/* Contractor Name */}
            <div className="form-group">
              <label>{isMr ? 'ठेकेदाराचे / एजन्सीचे नाव' : 'Contractor Name'}</label>
              <input
                type="text"
                name="contractor_name"
                value={form.contractor_name}
                onChange={handleChange}
                placeholder={isMr ? 'उदा. पटेल कन्स्ट्रक्शन्स' : 'e.g. Patel Constructions'}
              />
            </div>

            {/* Contractor Contact */}
            <div className="form-group">
              <label>{isMr ? 'ठेकेदार मोबाईल' : 'Contractor Contact'}</label>
              <input
                type="tel"
                name="contractor_contact"
                value={form.contractor_contact}
                onChange={handleChange}
                placeholder="98220XXXXX"
              />
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label>{isMr ? 'काम सुरू झाल्याची तारीख' : 'Start Date'}</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
              />
            </div>

            {/* Expected Completion Date */}
            <div className="form-group">
              <label>{isMr ? 'अपेक्षित पूर्णता तारीख' : 'Expected Completion'}</label>
              <input
                type="date"
                name="expected_completion_date"
                value={form.expected_completion_date}
                onChange={handleChange}
              />
            </div>

            {/* Progress Percentage */}
            <div className="form-group col-span-2">
              <label>{isMr ? 'प्रगती टक्केवारी' : 'Completion Progress'}: <strong>{form.progress_percentage}%</strong></label>
              <input
                type="range"
                min="0"
                max="100"
                name="progress_percentage"
                value={form.progress_percentage}
                onChange={handleChange}
                style={{ width: '100%', accentColor: '#ff9933', cursor: 'pointer' }}
              />
            </div>

            {/* Description */}
            <div className="form-group col-span-2">
              <label>{isMr ? 'प्रकल्पाचा सविस्तर तपशील' : 'Project Description'}</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder={isMr ? 'विकासकामाबाबत महत्त्वाची माहिती प्रविष्ट करा...' : 'Enter details about project work...'}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {isMr ? 'रद्द करा' : 'Cancel'}
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Save size={16} /> {submitting ? (isMr ? 'नोंदणी होत आहे...' : 'Saving...') : (isMr ? 'प्रकल्प जतन करा' : 'Save Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DevWorkFormModal;
