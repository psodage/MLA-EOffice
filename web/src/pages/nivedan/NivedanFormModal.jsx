// src/pages/nivedan/NivedanFormModal.jsx
// ============================================================
// Form Modal for Registering Citizen Petitions (Nivedans)
// Clean Language Toggle (EN / MR) support & Auto Department Routing
// ============================================================

import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';

const NivedanFormModal = ({ isOpen, onClose, onSuccess }) => {
  const { lang } = useLangStore();
  const isMr = lang === 'MR';

  const [form, setForm] = useState({
    citizen_name: '',
    citizen_mobile: '',
    citizen_address_line: '',
    citizen_city: 'राहाता',
    category_id: '',
    department_forwarded_to_id: '',
    subject: '',
    description: '',
    priority: 'MEDIUM',
    attachment_urls: '',
    assigned_to_user_id: '',
  });

  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [autoDeptName, setAutoDeptName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [catRes, deptRes] = await Promise.all([
          api.get('/nivedans/categories'),
          api.get('/departments'),
        ]);
        setCategories(catRes.data.data || []);
        setDepartments(deptRes.data.data || []);
      } catch (err) {
        console.error('Failed to load categories/departments:', err);
      }
    };

    fetchData();

    setForm({
      citizen_name: '',
      citizen_mobile: '',
      citizen_address_line: '',
      citizen_city: 'राहाता',
      category_id: '',
      department_forwarded_to_id: '',
      subject: '',
      description: '',
      priority: 'MEDIUM',
      attachment_urls: '',
      assigned_to_user_id: '',
    });
    setAutoDeptName('');
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setError('');
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setForm((prev) => ({ ...prev, category_id: catId }));
    setAutoDeptName('');

    if (catId) {
      const selectedCat = categories.find((c) => String(c.id) === String(catId));
      if (selectedCat && selectedCat.default_department_id) {
        setForm((prev) => ({ ...prev, department_forwarded_to_id: String(selectedCat.default_department_id) }));
        const deptObj = departments.find((d) => String(d.id) === String(selectedCat.default_department_id));
        if (deptObj) {
          setAutoDeptName(isMr ? deptObj.name_mr : deptObj.name_en || deptObj.name_mr);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.citizen_name.trim()) {
      setError(isMr ? 'कृपया नागरिकाचे नाव प्रविष्ट करा' : 'Please enter citizen name');
      return;
    }
    if (!form.citizen_mobile.trim() || form.citizen_mobile.trim().length < 10) {
      setError(isMr ? 'कृपया १० अंकी वैध मोबाईल क्रमांक प्रविष्ट करा' : 'Please enter valid 10-digit mobile number');
      return;
    }
    if (!form.category_id) {
      setError(isMr ? 'कृपया निवेदनाची वर्गवारी निवडा' : 'Please select petition category');
      return;
    }
    if (!form.subject.trim()) {
      setError(isMr ? 'कृपया निवेदनाचा विषय लिहा' : 'Please enter petition subject');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        category_id: parseInt(form.category_id, 10),
        department_forwarded_to_id: form.department_forwarded_to_id ? parseInt(form.department_forwarded_to_id, 10) : null,
      };

      await api.post('/nivedans', payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error submitting nivedan:', err);
      setError(err?.response?.data?.message || (isMr ? 'निवेदन नोंदवताना त्रुटी आली.' : 'Error registering petition.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="nivedan-modal-overlay" onClick={onClose}>
      <div className="nivedan-modal-card wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            ➕ {isMr ? 'नवीन निवेदन व अर्ज नोंदणी' : 'New Petition Registration'}
          </h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ background: 'var(--error-bg, #FEF2F2)', color: 'var(--error, #DC2626)', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', marginBottom: '14px' }}>
                ⚠️ {error}
              </div>
            )}

            <div className="nivedan-form-grid">
              <div className="nivedan-form-group">
                <label className="nivedan-form-label">
                  {isMr ? 'नागरिकाचे पूर्ण नाव' : 'Citizen Full Name'} <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="citizen_name"
                  className="nivedan-form-input"
                  value={form.citizen_name}
                  onChange={handleChange}
                  placeholder={isMr ? 'उदा. सुरेश बबन जाधव' : 'e.g. Suresh Jadhav'}
                  required
                />
              </div>

              <div className="nivedan-form-group">
                <label className="nivedan-form-label">
                  {isMr ? 'मोबाईल क्रमांक' : 'Mobile Number'} <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="citizen_mobile"
                  className="nivedan-form-input"
                  style={{ fontFamily: 'JetBrains Mono' }}
                  value={form.citizen_mobile}
                  onChange={handleChange}
                  placeholder={isMr ? '१० अंकी मोबाईल क्रमांक' : '10-digit mobile number'}
                  maxLength={10}
                  required
                />
              </div>

              <div className="nivedan-form-group">
                <label className="nivedan-form-label">
                  {isMr ? 'पत्ता / गाव / वॉर्ड' : 'Address / Village / Ward'}
                </label>
                <input
                  type="text"
                  name="citizen_address_line"
                  className="nivedan-form-input"
                  value={form.citizen_address_line}
                  onChange={handleChange}
                  placeholder={isMr ? 'उदा. वाडगाव, वॉर्ड नं. ४' : 'e.g. Wadgaon, Ward No 4'}
                />
              </div>

              <div className="nivedan-form-group">
                <label className="nivedan-form-label">
                  {isMr ? 'तालुका / शहर' : 'City / Taluka'}
                </label>
                <input
                  type="text"
                  name="citizen_city"
                  className="nivedan-form-input"
                  value={form.citizen_city}
                  onChange={handleChange}
                />
              </div>

              <div className="nivedan-form-group">
                <label className="nivedan-form-label">
                  {isMr ? 'निवेदन वर्गवारी' : 'Petition Category'} <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  name="category_id"
                  className="nivedan-form-input"
                  value={form.category_id}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">{isMr ? 'वर्गवारी निवडा...' : 'Select Category...'}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {isMr ? cat.name_mr : cat.name_en || cat.name_mr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="nivedan-form-group">
                <label className="nivedan-form-label">
                  {isMr ? 'संबंधित शासकीय विभाग' : 'Forward to Department'}
                </label>
                <select
                  name="department_forwarded_to_id"
                  className="nivedan-form-input"
                  value={form.department_forwarded_to_id}
                  onChange={handleChange}
                >
                  <option value="">{isMr ? 'विभाग निवडा...' : 'Select Department...'}</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {isMr ? dept.name_mr : dept.name_en || dept.name_mr}
                    </option>
                  ))}
                </select>
                {autoDeptName && (
                  <span style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '2px' }}>
                    💡 {isMr ? `वर्गवारीनुसार सुचवलेला विभाग: ${autoDeptName}` : `Suggested Department: ${autoDeptName}`}
                  </span>
                )}
              </div>

              <div className="nivedan-form-group full">
                <label className="nivedan-form-label">
                  {isMr ? 'निवेदनाचा विषय' : 'Petition Subject'} <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  className="nivedan-form-input"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder={isMr ? 'उदा. वाडगाव येथील पिण्याच्या पाण्याच्या पाईपलाईनबाबत' : 'e.g. Complaint regarding water pipeline in Wadgaon'}
                  required
                />
              </div>

              <div className="nivedan-form-group full">
                <label className="nivedan-form-label">
                  {isMr ? 'सविस्तर माहिती / तपशील' : 'Detailed Description'}
                </label>
                <textarea
                  name="description"
                  className="nivedan-form-input"
                  value={form.description}
                  onChange={handleChange}
                  placeholder={isMr ? 'नागरिकाने मांडलेली समस्या सविस्तर लिहा...' : 'Enter details regarding citizen petition...'}
                />
              </div>

              <div className="nivedan-form-group">
                <label className="nivedan-form-label">
                  {isMr ? 'प्राधान्यक्रम' : 'Priority Level'}
                </label>
                <select
                  name="priority"
                  className="nivedan-form-input"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="LOW">{isMr ? '🔵 सामान्य (Low)' : 'Low'}</option>
                  <option value="MEDIUM">{isMr ? '🟡 मध्यम (Medium)' : 'Medium'}</option>
                  <option value="HIGH">{isMr ? '🔴 उच्च (High)' : 'High'}</option>
                  <option value="URGENT">{isMr ? '🔥 अतिअत्यंत (Urgent)' : 'Urgent'}</option>
                </select>
              </div>

              <div className="nivedan-form-group">
                <label className="nivedan-form-label">
                  {isMr ? 'कागदपत्रे / फोटो लिंक' : 'Attachment URL / Documents'}
                </label>
                <input
                  type="text"
                  name="attachment_urls"
                  className="nivedan-form-input"
                  value={form.attachment_urls}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
              {isMr ? 'रद्द करा' : 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (isMr ? 'नोंद होत आहे...' : 'Submitting...') : (isMr ? 'निवेदन नोंदवा & ट्रॅकिंग ID द्या' : 'Submit Petition & Generate ID')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NivedanFormModal;
