// src/pages/visitors/ConvertToNivedanModal.jsx
// ============================================================
// Modal to Convert Visitor Grievance into an Official Nivedan Petition
// ============================================================

import { useState, useEffect } from 'react';
import api from '../../services/api.js';

const ConvertToNivedanModal = ({ isOpen, onClose, visitor, onSuccess }) => {
  const [form, setForm] = useState({
    citizen_name: '',
    citizen_mobile: '',
    citizen_address_line: '',
    category_id: '',
    subject: '',
    description: '',
    priority: 'MEDIUM',
  });

  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !visitor) return;

    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/nivedans/categories');
        setCategories(data.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();

    setForm({
      citizen_name: visitor.visitor_name || '',
      citizen_mobile: visitor.mobile || '',
      citizen_address_line: visitor.address_line || '',
      category_id: '',
      subject: visitor.purpose_description || 'नागरिक भेट प्रसंगी सुपूर्द केलेली तक्रार',
      description: visitor.purpose_description || 'नागरिक भेट प्रसंगी मांडलेली तक्रार.',
      priority: 'MEDIUM',
    });
    setError('');
  }, [isOpen, visitor]);

  if (!isOpen || !visitor) return null;

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category_id) {
      setError('कृपया तक्रार वर्गवारी निवडा (Category is required)');
      return;
    }
    if (!form.subject.trim()) {
      setError('कृपया विषय प्रविष्ट करा (Subject is required)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post(`/visitors/${visitor.id}/convert-nivedan`, form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Convert to Nivedan error:', err);
      setError(err?.response?.data?.message || 'निवेदनात रूपांतर करताना त्रुटी आली.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inward-modal-overlay" onClick={onClose}>
      <div className="inward-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="inward-modal-header">
          <div className="modal-title-group">
            <h3>📋 निवेदनात रूपांतर करा (Convert Visitor to Nivedan)</h3>
            <span className="modal-subtitle-en">Create Official Petition from Visitor Grievance</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="inward-form">
          {error && <div className="form-error-banner">⚠️ {error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label>नागरिकाचे नाव (Citizen Name)</label>
              <input type="text" value={form.citizen_name} disabled style={{ opacity: 0.8 }} />
            </div>

            <div className="form-group">
              <label>मोबाईल क्रमांक (Mobile)</label>
              <input type="text" value={form.citizen_mobile} disabled style={{ opacity: 0.8 }} />
            </div>

            <div className="form-group col-span-2">
              <label>तक्रार वर्गवारी (Category) <span className="req">*</span></label>
              <select name="category_id" value={form.category_id} onChange={handleChange} required>
                <option value="">-- वर्गवारी निवडा (Select Category) --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_mr} ({c.name_en})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group col-span-2">
              <label>निवेदनाचा विषय (Subject) <span className="req">*</span></label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group col-span-2">
              <label>तक्रारीचा सविस्तर मजकूर (Description)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              रद्द करा (Cancel)
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'रुपांतर होत आहे...' : '📋 अधिकृत निवेदनात रूपांतर करा'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConvertToNivedanModal;
