// src/pages/nivedan/NivedanFormModal.jsx
// ============================================================
// Form Modal for Registering Citizen Petitions (Nivedans)
// Auto-suggests department based on selected Category!
// ============================================================

import { useState, useEffect } from 'react';
import api from '../../services/api.js';

const NivedanFormModal = ({ isOpen, onClose, onSuccess }) => {
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

  // When Category changes, auto-suggest default department!
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
          setAutoDeptName(deptObj.name_mr);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.citizen_name.trim()) {
      setError('कृपया नागरिकाचे नाव प्रविष्ट करा (Citizen name is required)');
      return;
    }
    if (!form.citizen_mobile.trim() || form.citizen_mobile.trim().length < 10) {
      setError('कृपया १० अंकी वैध मोबाईल क्रमांक प्रविष्ट करा');
      return;
    }
    if (!form.category_id) {
      setError('कृपया तक्रार वर्गवारी निवडा (Category is required)');
      return;
    }
    if (!form.subject.trim()) {
      setError('कृपया तक्रारीचा विषय प्रविष्ट करा (Subject is required)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        citizen_name: form.citizen_name,
        citizen_mobile: form.citizen_mobile,
        citizen_address_line: form.citizen_address_line,
        citizen_city: form.citizen_city,
        category_id: parseInt(form.category_id, 10),
        department_forwarded_to_id: form.department_forwarded_to_id ? parseInt(form.department_forwarded_to_id, 10) : null,
        subject: form.subject,
        description: form.description,
        priority: form.priority,
        assigned_to_user_id: form.assigned_to_user_id ? parseInt(form.assigned_to_user_id, 10) : null,
        attachment_urls: form.attachment_urls ? form.attachment_urls.split('\n').map((u) => u.trim()).filter(Boolean) : [],
      };

      await api.post('/nivedans', payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Save nivedan error:', err);
      setError(err?.response?.data?.message || 'निवेदन नोंदवताना त्रुटी आली.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inward-modal-overlay" onClick={onClose}>
      <div className="inward-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="inward-modal-header">
          <div className="modal-title-group">
            <h3>📋 नवीन नागरिक निवेदन नोंदणी</h3>
            <span className="modal-subtitle-en">Register Citizen Grievance & Auto-Route to Department</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="inward-form">
          {error && <div className="form-error-banner">⚠️ {error}</div>}

          <div className="form-grid">
            {/* Citizen Name */}
            <div className="form-group">
              <label>नागरिकाचे नाव (Citizen Name) <span className="req">*</span></label>
              <input
                type="text"
                name="citizen_name"
                value={form.citizen_name}
                onChange={handleChange}
                placeholder="उदा. श्री. नामदेव तुकाराम पाटील"
                required
              />
            </div>

            {/* Citizen Mobile */}
            <div className="form-group">
              <label>मोबाईल क्रमांक (10-Digit Mobile) <span className="req">*</span></label>
              <input
                type="tel"
                name="citizen_mobile"
                value={form.citizen_mobile}
                onChange={handleChange}
                placeholder="98220XXXXX (व्हॉट्सॲप अपडेटसाठी)"
                maxLength={10}
                required
              />
            </div>

            {/* Address & Cascading Location */}
            <div className="form-group col-span-2">
              <label>पत्ता (Address Line)</label>
              <input
                type="text"
                name="citizen_address_line"
                value={form.citizen_address_line}
                onChange={handleChange}
                placeholder="उदा. घर क्र. १२४, मुख्य रस्ता"
              />
            </div>

            {/* Cascading Location: Taluka -> Gram Panchayat -> Village */}
            <div className="form-group">
              <label>तालुका (Taluka)</label>
              <select name="taluka" defaultValue="राहाता">
                <option value="राहाता">राहाता (Rahata)</option>
                <option value="कोपरगाव">कोपरगाव (Kopargaon)</option>
                <option value="संगमनेर">संगमनेर (Sangamner)</option>
              </select>
            </div>

            <div className="form-group">
              <label>ग्रामपंचायत / शहर (Gram Panchayat)</label>
              <select name="gram_panchayat" defaultValue="सावळीविहीर बुद्रुक">
                <option value="सावळीविहीर बुद्रुक">सावळीविहीर बुद्रुक</option>
                <option value="शिर्डी">शिर्डी (नगर पंचायत)</option>
                <option value="अस्तगाव">अस्तगाव</option>
                <option value="कोल्हार">कोल्हार भगवतीपूर</option>
                <option value="राहाता">राहाता (नगरपालिका)</option>
              </select>
            </div>

            {/* Category Select (Auto-Routing) */}
            <div className="form-group col-span-2">
              <label>तक्रार / निवेदन वर्गवारी (Category) <span className="req">*</span></label>
              <select name="category_id" value={form.category_id} onChange={handleCategoryChange} required>
                <option value="">-- वर्गवारी निवडा (Select Category) --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_mr} ({c.name_en})
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-suggested Department Notification */}
            {autoDeptName && (
              <div className="col-span-2 auto-dept-banner">
                🎯 <strong>ऑटो-रूट विभाग:</strong> निवडलेल्या वर्गवारीनुसार हे निवेदन <strong>{autoDeptName}</strong> कडे स्वयंचलितरित्या प्रस्तावित केले जाईल.
              </div>
            )}

            {/* Department Override Select */}
            <div className="form-group col-span-2">
              <label>पाठवावयाचा शासकीय विभाग (Department)</label>
              <select
                name="department_forwarded_to_id"
                value={form.department_forwarded_to_id}
                onChange={handleChange}
              >
                <option value="">-- विभाग निवडा (Choose Department) --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name_mr} ({dept.short_code})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="form-group">
              <label>प्राधान्यक्रम (Priority)</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="HIGH">🔴 उच्च (High Priority)</option>
                <option value="MEDIUM">🟡 मध्यम (Medium Priority)</option>
                <option value="LOW">🔵 सामान्य (Low Priority)</option>
              </select>
            </div>

            {/* Assign to PA */}
            <div className="form-group">
              <label>जबाबदार अधिकारी (Assign Staff)</label>
              <select name="assigned_to_user_id" value={form.assigned_to_user_id} onChange={handleChange}>
                <option value="">-- अनियुक्त (Unassigned) --</option>
                <option value="2">👨‍💼 सुरेश पाटील (PA)</option>
              </select>
            </div>

            {/* Subject */}
            <div className="form-group col-span-2">
              <label>निवेदनाचा विषय (Subject) <span className="req">*</span></label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="उदा. पिण्याच्या पाण्याच्या नवीन पाइपलाइनला मंजुरी मिळणेबाबत"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group col-span-2">
              <label>निवेदनाचा सविस्तर मजकूर (Grievance Description) <span className="req">*</span></label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="नागरिकाच्या तक्रारीचा सविस्तर तपशील प्रविष्ट करा..."
                required
              />
            </div>

            {/* Attachments */}
            <div className="form-group col-span-2">
              <label>जोडपत्र / कागदपत्र लिंक्स (Attachment URLs)</label>
              <textarea
                name="attachment_urls"
                value={form.attachment_urls}
                onChange={handleChange}
                rows={2}
                placeholder="प्रत्येक ओळीवर एक इमेज/PDF फाईल लिंक प्रविष्ट करा..."
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              रद्द करा (Cancel)
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'नोंदणी होत आहे...' : 'निवेदन जतन करा (Save Petition)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NivedanFormModal;
