// src/pages/inward/InwardFormModal.jsx
// ============================================================
// Form Modal for Creating/Editing Inward Register Entries
// Marathi-first form with department selection & attachments
// ============================================================

import { useState, useEffect } from 'react';
import api from '../../services/api.js';

const InwardFormModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [form, setForm] = useState({
    sender_name: '',
    sender_designation: '',
    sender_department_id: '',
    date_received: new Date().toISOString().split('T')[0],
    subject: '',
    description: '',
    priority: 'MEDIUM',
    tags: '',
    attachment_urls: '',
    assigned_to_user_id: '',
  });

  const [departments, setDepartments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load active departments for dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get('/departments');
        setDepartments(data.data || []);
      } catch (err) {
        console.error('Failed to load departments:', err);
      }
    };
    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  // Populate form if editing
  useEffect(() => {
    if (initialData) {
      setForm({
        sender_name: initialData.sender_name || '',
        sender_designation: initialData.sender_designation || '',
        sender_department_id: initialData.sender_department_id || '',
        date_received: initialData.date_received || new Date().toISOString().split('T')[0],
        subject: initialData.subject || '',
        description: initialData.description || '',
        priority: initialData.priority || 'MEDIUM',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
        attachment_urls: Array.isArray(initialData.attachment_urls) ? initialData.attachment_urls.join('\n') : '',
        assigned_to_user_id: initialData.assigned_to_user_id || '',
      });
    } else {
      setForm({
        sender_name: '',
        sender_designation: '',
        sender_department_id: '',
        date_received: new Date().toISOString().split('T')[0],
        subject: '',
        description: '',
        priority: 'MEDIUM',
        tags: '',
        attachment_urls: '',
        assigned_to_user_id: '',
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sender_name.trim()) {
      setError('कृपया पत्र पाठवणाऱ्याचे नाव प्रविष्ट करा (Sender name is required)');
      return;
    }
    if (!form.subject.trim()) {
      setError('कृपया पत्राचा विषय प्रविष्ट करा (Subject is required)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...form,
        sender_department_id: form.sender_department_id ? parseInt(form.sender_department_id, 10) : null,
        assigned_to_user_id: form.assigned_to_user_id ? parseInt(form.assigned_to_user_id, 10) : null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        attachment_urls: form.attachment_urls ? form.attachment_urls.split('\n').map((u) => u.trim()).filter(Boolean) : [],
      };

      if (initialData?.id) {
        await api.patch(`/inward/${initialData.id}`, payload);
      } else {
        await api.post('/inward', payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      setError(err?.response?.data?.message || 'माहिती जतन करताना त्रुटी आली. पुन्हा प्रयत्न करा.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inward-modal-overlay" onClick={onClose}>
      <div className="inward-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="inward-modal-header">
          <div className="modal-title-group">
            <h3>{initialData ? '✏️ आवक पत्र संपादित करा' : '📥 नवीन आवक पत्र नोंदवा'}</h3>
            <span className="modal-subtitle-en">{initialData ? 'Edit Inward Entry' : 'Log New Inward Letter'}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="inward-form">
          {error && <div className="form-error-banner">⚠️ {error}</div>}

          <div className="form-grid">
            {/* Sender Name */}
            <div className="form-group col-span-2">
              <label>पाठवणाऱ्याचे नाव (Sender Name) <span className="req">*</span></label>
              <input
                type="text"
                name="sender_name"
                value={form.sender_name}
                onChange={handleChange}
                placeholder="उदा. श्री. नामदेव पाटील / जिल्हाधिकारी office"
                required
              />
            </div>

            {/* Sender Designation */}
            <div className="form-group">
              <label>पदनाम (Designation)</label>
              <input
                type="text"
                name="sender_designation"
                value={form.sender_designation}
                onChange={handleChange}
                placeholder="उदा. कार्यकारी अभियंता / सरपंच"
              />
            </div>

            {/* Department Dropdown */}
            <div className="form-group">
              <label>संबंधित शासकीय विभाग (Department)</label>
              <select
                name="sender_department_id"
                value={form.sender_department_id}
                onChange={handleChange}
              >
                <option value="">-- विभाग निवडा (Select Department) --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name_mr} ({dept.short_code})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Received */}
            <div className="form-group">
              <label>प्राप्त दिनांक (Date Received)</label>
              <input
                type="date"
                name="date_received"
                value={form.date_received}
                onChange={handleChange}
              />
            </div>

            {/* Priority Selector */}
            <div className="form-group">
              <label>प्राधान्यक्रम (Priority)</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="HIGH">🔴 उच्च (High Priority)</option>
                <option value="MEDIUM">🟡 मध्यम (Medium Priority)</option>
                <option value="LOW">🔵 सामान्य (Low Priority)</option>
              </select>
            </div>

            {/* Subject */}
            <div className="form-group col-span-2">
              <label>पत्राचा विषय (Subject) <span className="req">*</span></label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="उदा. ग्रामपंचायत रस्ता मंजुरीबाबतचे मागणी पत्र"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group col-span-2">
              <label>तपशील / टीप (Description / Details)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="पत्रातील महत्वाचे मुद्दे किंवा तपशील प्रविष्ट करा..."
              />
            </div>

            {/* Assign to User */}
            <div className="form-group col-span-2">
              <label>कोणाकडे नियुक्त करायचे? (Assign to Staff/PA)</label>
              <select
                name="assigned_to_user_id"
                value={form.assigned_to_user_id}
                onChange={handleChange}
              >
                <option value="">-- अनियुक्त (Unassigned) --</option>
                <option value="2">👨‍💼 सुरेश पाटील (PA / Senior Manager)</option>
                <option value="4">🕵️‍♂️ राहुल जाधव (Field Auditor)</option>
              </select>
            </div>

            {/* Tags */}
            <div className="form-group col-span-2">
              <label>टॅग्स (Tags — कॉमाने विभक्त करा)</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="PWD, Road, Urgent, Rahata"
              />
            </div>

            {/* Attachment URLs */}
            <div className="form-group col-span-2">
              <label>स्कॅन जोडपत्रे / Cloudinary PDF लिंक्स (Attachment URLs)</label>
              <textarea
                name="attachment_urls"
                value={form.attachment_urls}
                onChange={handleChange}
                rows={2}
                placeholder="प्रत्येक ओळीवर एक लिंक प्रविष्ट करा (e.g. https://res.cloudinary.com/...)"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              रद्द करा (Cancel)
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'जतन होत आहे...' : initialData ? 'अपडेट करा (Update)' : 'नोंदणी करा (Save Entry)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InwardFormModal;
