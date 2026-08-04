import { useState, useEffect } from 'react';
import { X, FileText, AlertTriangle } from 'lucide-react';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';

const ConvertToNivedanModal = ({ isOpen, onClose, visitor, onSuccess }) => {
  const { lang } = useLangStore();
  const isMr = lang === 'MR';

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
      subject: visitor.purpose_description || (isMr ? 'नागरिक भेट प्रसंगी सुपूर्द केलेली तक्रार' : 'Petition submitted during visitor meeting'),
      description: visitor.purpose_description || (isMr ? 'नागरिक भेट प्रसंगी मांडलेली तक्रार.' : 'Grievance submitted during visitor meeting.'),
      priority: 'MEDIUM',
    });
    setError('');
  }, [isOpen, visitor, isMr]);

  if (!isOpen || !visitor) return null;

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category_id) {
      setError(isMr ? 'कृपया तक्रार वर्गवारी निवडा.' : 'Category is required.');
      return;
    }
    if (!form.subject.trim()) {
      setError(isMr ? 'कृपया विषय प्रविष्ट करा.' : 'Subject is required.');
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
      setError(err?.response?.data?.message || (isMr ? 'निवेदनात रूपांतर करताना त्रुटी आली.' : 'Error converting to petition.'));
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
              <FileText size={18} /> {isMr ? 'निवेदनात रूपांतर करा' : 'Convert Visitor to Nivedan'}
            </h3>
            <span className="modal-subtitle-en">
              {isMr ? 'अभ्यागत तक्रारीचे अधिकृत निवेदनात रूपांतर करा' : 'Create Official Petition from Visitor Grievance'}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="inward-form">
          {error && <div className="form-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} /> {error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label>{isMr ? 'नागरिकाचे नाव' : 'Citizen Name'}</label>
              <input type="text" value={form.citizen_name} disabled style={{ opacity: 0.8 }} />
            </div>

            <div className="form-group">
              <label>{isMr ? 'मोबाईल क्रमांक' : 'Mobile Number'}</label>
              <input type="text" value={form.citizen_mobile} disabled style={{ opacity: 0.8 }} />
            </div>

            <div className="form-group col-span-2">
              <label>{isMr ? 'तक्रार वर्गवारी' : 'Category'} <span className="req">*</span></label>
              <select name="category_id" value={form.category_id} onChange={handleChange} required>
                <option value="">{isMr ? '-- वर्गवारी निवडा --' : '-- Select Category --'}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isMr ? c.name_mr : (c.name_en || c.name_mr)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group col-span-2">
              <label>{isMr ? 'निवेदनाचा विषय' : 'Subject'} <span className="req">*</span></label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group col-span-2">
              <label>{isMr ? 'तक्रारीचा सविस्तर मजकूर' : 'Description'}</label>
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
              {isMr ? 'रद्द करा' : 'Cancel'}
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} /> {submitting ? (isMr ? 'रुपांतर होत आहे...' : 'Converting...') : (isMr ? 'अधिकृत निवेदनात रूपांतर करा' : 'Convert to Petition')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConvertToNivedanModal;
