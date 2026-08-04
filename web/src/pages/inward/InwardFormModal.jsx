// src/pages/inward/InwardFormModal.jsx
// ============================================================
// Form Modal for Creating/Editing Inward Register Entries
// Redesigned to match WIREFRAMES/inward_form.html
// Multi-language (EN / Marathi) + Light/Dark mode ready
// ============================================================

import { useState, useEffect } from 'react';
import { X, UploadCloud, Paperclip, FileText, Save, Check, Inbox, AlertTriangle } from 'lucide-react';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';

const InwardFormModal = ({ isOpen, onClose, onSuccess, initialData = null, onSaveAndCreateOutward = null }) => {
  const { lang } = useLangStore();
  const isMr = lang === 'MR';

  const [form, setForm] = useState({
    inward_number: '',
    sender_name: '',
    sender_designation: '',
    sender_department_id: '',
    reference_number: '',
    date_received: new Date().toISOString().split('T')[0],
    subject: '',
    description: '',
    priority: 'MEDIUM',
    tags: ['Road', 'PWD', 'Budget'],
    tagInput: '',
    attachment_urls: '',
    assigned_to_user_id: '',
    requires_reply: 'NO',
    files: [
      { name: 'PWD_Road_Widening_Proposal.pdf', size: '4.2 MB' },
      { name: 'Revised_Cost_Estimate_Annexure.pdf', size: '1.8 MB' },
    ],
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

  // Populate form if editing or initialize auto Inward No
  useEffect(() => {
    if (initialData) {
      setForm({
        inward_number: initialData.inward_number || `INW/2026/${String(Math.floor(Math.random() * 900) + 100).padStart(4, '0')}`,
        sender_name: initialData.sender_name || '',
        sender_designation: initialData.sender_designation || '',
        sender_department_id: initialData.sender_department_id || '',
        reference_number: initialData.reference_number || '',
        date_received: initialData.date_received || new Date().toISOString().split('T')[0],
        subject: initialData.subject || '',
        description: initialData.description || '',
        priority: initialData.priority || 'MEDIUM',
        tags: Array.isArray(initialData.tags) ? initialData.tags : ['PWD', 'Budget'],
        tagInput: '',
        attachment_urls: Array.isArray(initialData.attachment_urls) ? initialData.attachment_urls.join('\n') : '',
        assigned_to_user_id: initialData.assigned_to_user_id || '',
        requires_reply: initialData.requires_reply || 'NO',
        files: [
          { name: 'Letter_Scan_Doc.pdf', size: '2.4 MB' },
        ],
      });
    } else {
      const randomNo = `INW/2026/${String(Math.floor(Math.random() * 500) + 390).padStart(4, '0')}`;
      setForm({
        inward_number: randomNo,
        sender_name: 'Shri. A.B. Kulkarni',
        sender_designation: 'Executive Engineer',
        sender_department_id: '',
        reference_number: 'PWD/CE/HQ/2026/1234',
        date_received: new Date().toISOString().split('T')[0],
        subject: '',
        description: '',
        priority: 'MEDIUM',
        tags: ['Road', 'PWD', 'NH-4', 'Budget'],
        tagInput: '',
        attachment_urls: '',
        assigned_to_user_id: '',
        requires_reply: 'NO',
        files: [
          { name: 'PWD_Road_Widening_Proposal_NH4.pdf', size: '4.2 MB' },
          { name: 'Revised_Cost_Estimate_Annexure.pdf', size: '1.8 MB' },
        ],
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Add Tag
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && form.tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(form.tagInput.trim())) {
        setForm((prev) => ({
          ...prev,
          tags: [...prev.tags, prev.tagInput.trim()],
          tagInput: '',
        }));
      }
    }
  };

  // Remove Tag
  const handleRemoveTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // Remove File
  const handleRemoveFile = (index) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e, createOutward = false) => {
    if (e) e.preventDefault();
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
        sender_name: form.sender_name,
        sender_designation: form.sender_designation,
        sender_department_id: form.sender_department_id ? parseInt(form.sender_department_id, 10) : null,
        date_received: form.date_received,
        subject: form.subject,
        description: form.description,
        priority: form.priority,
        assigned_to_user_id: form.assigned_to_user_id ? parseInt(form.assigned_to_user_id, 10) : null,
        tags: form.tags,
        attachment_urls: form.files.map((f) => f.name),
      };

      let res;
      if (initialData?.id) {
        res = await api.patch(`/inward/${initialData.id}`, payload);
      } else {
        res = await api.post('/inward', payload);
      }

      const savedEntry = res.data?.data || initialData;

      onSuccess();
      onClose();

      if (createOutward && onSaveAndCreateOutward) {
        onSaveAndCreateOutward(savedEntry);
      }
    } catch (err) {
      console.error('Save inward error:', err);
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
            <h3>{initialData ? 'Inward Details · आवक तपशील' : 'New Inward Entry · नवीन आवक नोंद'}</h3>
            <span className="modal-subtitle-en">Register a received letter, document, or correspondence</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)}>
          <div className="form-card" style={{ border: 'none', boxShadow: 'none' }}>
            {error && <div className="form-error-banner" style={{ margin: '16px 24px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} /> {error}</div>}

            {/* Section 1: Inward Details */}
            <div className="form-section">
              <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Inbox size={16} /> Inward Details · <span className="mr">आवक तपशील</span></div>
              <div className="section-desc">Letter/document received at MLA office</div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Inward Number <span className="mr-sub">आवक क्रमांक</span>
                  </label>
                  <input
                    className="form-input mono"
                    value={form.inward_number}
                    readOnly
                    style={{ background: 'var(--inw-bg)', color: 'var(--inw-t3)', fontWeight: 600 }}
                  />
                  <span className="form-hint">Auto-generated · स्वयं-निर्मित</span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Date Received<span className="req">*</span> <span className="mr-sub">प्राप्त तारीख</span>
                  </label>
                  <input
                    className="form-input"
                    type="date"
                    name="date_received"
                    value={form.date_received}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Sender Details */}
            <div className="form-section">
              <div className="section-title">Sender Information · <span className="mr">पाठवणाऱ्याची माहिती</span></div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Sender Name<span className="req">*</span> <span className="mr-sub">पाठवणाऱ्याचे नाव</span>
                  </label>
                  <input
                    className="form-input"
                    name="sender_name"
                    value={form.sender_name}
                    onChange={handleChange}
                    placeholder="e.g., Shri. A.B. Kulkarni"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Sender Designation <span className="mr-sub">पद</span>
                  </label>
                  <input
                    className="form-input"
                    name="sender_designation"
                    value={form.sender_designation}
                    onChange={handleChange}
                    placeholder="e.g., Executive Engineer"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Department / Office<span className="req">*</span> <span className="mr-sub">विभाग / कार्यालय</span>
                  </label>
                  <select
                    className="form-input"
                    name="sender_department_id"
                    value={form.sender_department_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Department...</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {isMr ? d.name_mr : (d.name_en || d.name_mr)} ({d.short_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Reference / Letter Number <span className="mr-sub">संदर्भ पत्र क्र.</span>
                  </label>
                  <input
                    className="form-input"
                    name="reference_number"
                    value={form.reference_number}
                    onChange={handleChange}
                    placeholder="e.g., PWD/CE/2026/123"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Subject & Priority */}
            <div className="form-section">
              <div className="section-title">Subject & Category · <span className="mr">विषय व प्राधान्य</span></div>
              <div className="form-grid">
                <div className="form-group form-full">
                  <label className="form-label">
                    Subject<span className="req">*</span> <span className="mr-sub">विषय</span>
                  </label>
                  <input
                    className="form-input"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Brief description of the letter subject..."
                    required
                  />
                </div>

                <div className="form-group form-full">
                  <label className="form-label">
                    Description / Notes <span className="mr-sub">वर्णन / टिपा</span>
                  </label>
                  <textarea
                    className="form-input"
                    name="description"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Brief summary of the content..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Tags <span className="mr-sub">टॅग्ज (Enter दाबून जोडा)</span>
                  </label>
                  <input
                    className="form-input"
                    name="tagInput"
                    value={form.tagInput}
                    onChange={handleChange}
                    onKeyDown={handleAddTag}
                    placeholder="Add tag and press enter..."
                  />
                  <div className="tag-list">
                    {form.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag} <span className="x" onClick={() => handleRemoveTag(tag)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}><X size={12} /></span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Priority<span className="req">*</span> <span className="mr-sub">प्राधान्य</span>
                  </label>
                  <select className="form-input" name="priority" value={form.priority} onChange={handleChange}>
                    <option value="LOW">Low · कमी</option>
                    <option value="MEDIUM">Medium · मध्यम</option>
                    <option value="HIGH">High · उच्च</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Assigned To <span className="mr-sub">नियुक्त करा</span>
                  </label>
                  <select className="form-input" name="assigned_to_user_id" value={form.assigned_to_user_id} onChange={handleChange}>
                    <option value="">— Assign later —</option>
                    <option value="2">Suresh Patil (PA / Staff)</option>
                    <option value="4">Rahul Jadhav (Staff)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Requires Outward Reply? <span className="mr-sub">जवाबी पत्र आवश्यक?</span>
                  </label>
                  <select className="form-input" name="requires_reply" value={form.requires_reply} onChange={handleChange}>
                    <option value="NO">No</option>
                    <option value="YES_LATER">Yes — draft outward later</option>
                    <option value="YES_AI">Yes — AI draft immediately</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Attachments */}
            <div className="form-section">
              <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Paperclip size={16} /> Scan / Upload Document · <span className="mr">दस्तऐवज अपलोड</span></div>
              <div className="section-desc">Upload the scanned PDF or photo of the received letter</div>
              <div className="file-drop">
                <span className="ico"><UploadCloud size={24} /></span>
                <div className="text">
                  Drag & drop scanned document, or <strong style={{ color: 'var(--inw-p)' }}>click to browse</strong>
                </div>
                <div className="hint">PDF, JPG, PNG — Max 10MB per file</div>
              </div>

              {form.files.length > 0 && (
                <div className="file-list">
                  {form.files.map((file, idx) => (
                    <div key={idx} className="file-item">
                      <FileText size={16} />
                      <span className="fname">{file.name}</span>
                      <span className="fsize">{file.size}</span>
                      <span className="fremove" onClick={() => handleRemoveFile(idx)} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}><X size={14} /></span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="form-footer">
              <div style={{ fontSize: '12px', color: 'var(--inw-t3)' }}>
                Inward No: <strong className="mono" style={{ color: 'var(--inw-p)' }}>{form.inward_number}</strong>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-o" onClick={onClose}>
                  Cancel · रद्द करा
                </button>
                <button type="submit" className="btn btn-p" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={16} /> {submitting ? 'Saving...' : 'Save · जतन करा'}
                </button>
                <button type="button" className="btn btn-ok" onClick={(e) => handleSubmit(e, true)} disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> Save & Create Outward · जतन आणि जावक तयार करा
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="wfb">WIREFRAME · INWARD FORM</div>
    </div>
  );
};

export default InwardFormModal;
