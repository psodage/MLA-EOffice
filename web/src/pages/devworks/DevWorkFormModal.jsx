// src/pages/devworks/DevWorkFormModal.jsx
// ============================================================
// Form Modal for Creating & Editing Development Works Projects
// Inputs: Name, Category, Funding Source, Budget, GPS Lat/Lng, Contractor
// ============================================================

import { useState, useEffect } from 'react';
import api from '../../services/api.js';

const CATEGORY_OPTIONS = [
  { value: 'ROAD', labelMr: 'रस्ते / पूल (Roads & Bridges)' },
  { value: 'DRAINAGE', labelMr: 'गटारे / सांडपाणी (Drainage)' },
  { value: 'WATER_PIPELINE', labelMr: 'पाणीपुरवठा पाइपलाइन (Water Supply)' },
  { value: 'HOSPITAL', labelMr: 'रुग्णालय / आरोग्य केंद्र (Hospital)' },
  { value: 'SCHOOL', labelMr: 'शाळा / डिजिटल क्लासरूम (School)' },
  { value: 'COMMUNITY_HALL', labelMr: 'समाजमंदिर / सभागृह (Community Hall)' },
  { value: 'STREET_LIGHT', labelMr: 'रस्त्यावरील दिवे (Street Light)' },
  { value: 'ELECTRIFICATION', labelMr: 'विद्युतीकरण (Electrification)' },
  { value: 'GARDEN_PARK', labelMr: 'उद्यान / सुशोभीकरण (Garden & Park)' },
  { value: 'OTHER', labelMr: 'इतर (Other Development Work)' },
];

const FUNDING_OPTIONS = [
  { value: 'MLALAD', labelMr: 'आमदार निधी (MLALAD Fund)' },
  { value: 'ZP_FUND', labelMr: 'जिल्हा परिषद निधी (ZP Fund)' },
  { value: 'STATE_GRANT', labelMr: 'राज्य शासन अनुदान (State Grant)' },
  { value: 'CENTRAL_GRANT', labelMr: 'केंद्र शासन अनुदान (Central Grant)' },
  { value: 'MUNICIPAL_FUND', labelMr: 'नगरपालिका / नगरपंचायत निधी' },
  { value: 'GP_FUND', labelMr: 'ग्रामपंचायत निधी (GP Fund)' },
  { value: 'MPLAD', labelMr: 'खासदार निधी (MPLAD Fund)' },
  { value: 'CSR', labelMr: 'सीएसआर निधी (CSR Fund)' },
  { value: 'OTHER_MIXED', labelMr: 'इतर संयुक्त निधी' },
];

const DevWorkFormModal = ({ isOpen, onClose, onSuccess }) => {
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
      setError('कृपया कामाचे नाव प्रविष्ट करा (Project name is required)');
      return;
    }
    if (!form.location.trim()) {
      setError('कृपया ठिकाण प्रविष्ट करा (Location is required)');
      return;
    }
    if (!form.budget_allocated || parseFloat(form.budget_allocated) <= 0) {
      setError('कृपया मंजूर अर्थसंकल्प (रक्कम ₹) प्रविष्ट करा');
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
      setError(err?.response?.data?.message || 'विकासकाम जतन करताना त्रुटी आली.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inward-modal-overlay" onClick={onClose}>
      <div className="inward-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="inward-modal-header">
          <div className="modal-title-group">
            <h3>🏗️ नवीन विकासकाम प्रकल्प नोंदणी (Add Infrastructure Project)</h3>
            <span className="modal-subtitle-en">Register Project, Funding, GPS Location & Budget</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="inward-form">
          {error && <div className="form-error-banner">⚠️ {error}</div>}

          <div className="form-grid">
            {/* Project Name */}
            <div className="form-group col-span-2">
              <label>विकासकामाचे नाव (Project Name) <span className="req">*</span></label>
              <input
                type="text"
                name="project_name"
                value={form.project_name}
                onChange={handleChange}
                placeholder="उदा. सावळीविहीर ते शिर्डी मुख्य रस्ता रुंदीकरण व डांबरीकरण काम"
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>कामाचा प्रकार (Category) <span className="req">*</span></label>
              <select name="category" value={form.category} onChange={handleChange} required>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.labelMr}
                  </option>
                ))}
              </select>
            </div>

            {/* Funding Source */}
            <div className="form-group">
              <label>निधीचा स्रोत (Funding Source) <span className="req">*</span></label>
              <select name="funding_source" value={form.funding_source} onChange={handleChange} required>
                {FUNDING_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.labelMr}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="form-group col-span-2">
              <label>कामाचे ठिकाण व पत्ता (Location) <span className="req">*</span></label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="उदा. सावळीविहीर बुद्रुक, तालुका राहाता, जि. अहमदनगर"
                required
              />
            </div>

            {/* GPS Latitude */}
            <div className="form-group">
              <label>GPS अक्षवृत्त (Latitude)</label>
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
              <label>GPS रेखावृत्त (Longitude)</label>
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
              <label>मंजूर अर्थसंकल्प रक्कम ₹ (Allocated Budget) <span className="req">*</span></label>
              <input
                type="number"
                name="budget_allocated"
                value={form.budget_allocated}
                onChange={handleChange}
                placeholder="उदा. 5000000 (₹ ५० लाख)"
                required
              />
            </div>

            {/* Budget Spent */}
            <div className="form-group">
              <label>आत्तापर्यंत खर्च झालेली रक्कम ₹ (Spent Budget)</label>
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
              <label>ठेकेदाराचे / एजन्सीचे नाव (Contractor Name)</label>
              <input
                type="text"
                name="contractor_name"
                value={form.contractor_name}
                onChange={handleChange}
                placeholder="उदा. पटेल कन्स्ट्रक्शन्स"
              />
            </div>

            {/* Contractor Contact */}
            <div className="form-group">
              <label>ठेकेदार मोबाईल (Contractor Contact)</label>
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
              <label>काम सुरू झाल्याची तारीख (Start Date)</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
              />
            </div>

            {/* Expected Completion Date */}
            <div className="form-group">
              <label>अपेक्षित पूर्णता तारीख (Expected Completion)</label>
              <input
                type="date"
                name="expected_completion_date"
                value={form.expected_completion_date}
                onChange={handleChange}
              />
            </div>

            {/* Progress Percentage */}
            <div className="form-group col-span-2">
              <label>प्रगती टक्केवारी: <strong>{form.progress_percentage}%</strong> (Completion Progress)</label>
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
              <label>प्रकल्पाचा सविस्तर तपशील (Project Description)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="विकासकामाबाबत महत्त्वाची माहिती व अटी प्रविष्ट करा..."
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              रद्द करा (Cancel)
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'नोंदणी होत आहे...' : '🏗️ प्रकल्प जतन करा (Save Project)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DevWorkFormModal;
