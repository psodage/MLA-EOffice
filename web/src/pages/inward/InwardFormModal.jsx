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
            <h3>{isMr ? (initialData ? 'आवक तपशील' : 'नवीन आवक नोंद') : (initialData ? 'Inward Details' : 'New Inward Entry')}</h3>
            <span className="modal-subtitle-en">
              {isMr ? 'कार्यालयात प्राप्त पत्र, अर्ज किंवा दस्तऐवजाची नोंद करा' : 'Register a received letter, document, or correspondence'}
            </span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)}>
          <div className="form-card" style={{ border: 'none', boxShadow: 'none' }}>
            {error && <div className="form-error-banner" style={{ margin: '16px 24px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} /> {error}</div>}

            {/* Section 1: Inward Details */}
            <div className="form-section">
              <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Inbox size={16} /> {isMr ? 'आवक तपशील' : 'Inward Details'}</div>
              <div className="section-desc">{isMr ? 'आमदार कार्यालयात प्राप्त झालेले पत्र / दस्तऐवज' : 'Letter/document received at MLA office'}</div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    {isMr ? 'आवक क्रमांक' : 'Inward Number'}
                  </label>
                  <input
                    className="form-input mono"
                    value={form.inward_number}
                    readOnly
                    style={{ background: 'var(--inw-bg)', color: 'var(--inw-t3)', fontWeight: 600 }}
                  />
                  <span className="form-hint">{isMr ? 'स्वयं-निर्मित' : 'Auto-generated'}</span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {isMr ? 'प्राप्त तारीख' : 'Date Received'}<span className="req">*</span>
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
              <div className="section-title">{isMr ? 'पाठवणाऱ्याची माहिती' : 'Sender Information'}</div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    {isMr ? 'पाठवणाऱ्याचे नाव' : 'Sender Name'}<span className="req">*</span>
                  </label>
                  <input
                    className="form-input"
                    name="sender_name"
                    value={form.sender_name}
                    onChange={handleChange}
                    placeholder={isMr ? 'उदा. श्री. अ. ब. कुलकर्णी' : 'e.g. Shri. A.B. Kulkarni'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {isMr ? 'पदनाम' : 'Sender Designation'}
                  </label>
                  <input
                    className="form-input"
                    name="sender_designation"
                    value={form.sender_designation}
                    onChange={handleChange}
                    placeholder={isMr ? 'उदा. कार्यकारी अभियंता' : 'e.g. Executive Engineer'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {isMr ? 'विभाग / कार्यालय' : 'Department / Office'}<span className="req">*</span>
                  </label>
                  <select
                    className="form-input"
                    name="sender_department_id"
                    value={form.sender_department_id}
                    onChange={handleChange}
                  >
                    <option value="">{isMr ? 'विभाग निवडा...' : 'Select Department...'}</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {isMr ? d.name_mr : (d.name_en || d.name_mr)} ({d.short_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {isMr ? 'संदर्भ पत्र क्रमांक' : 'Reference / Letter Number'}
                  </label>
                  <input
                    className="form-input"
                    name="reference_number"
                    value={form.reference_number}
                    onChange={handleChange}
                    placeholder={isMr ? 'उदा. सार्वजनिक बांधकाम/अभियंता/२०२६/१२३' : 'e.g., PWD/CE/2026/123'}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Subject & Priority */}
            <div className="form-section">
              <div className="section-title">{isMr ? 'विषय व प्राधान्य' : 'Subject & Category'}</div>
              <div className="form-grid">
                <div className="form-group form-full">
                  <label className="form-label">
                    {isMr ? 'विषय' : 'Subject'}<span className="req">*</span>
                  </label>
                  <input
                    className="form-input"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder={isMr ? 'पत्राचा थोडक्यात विषय...' : 'Brief description of the letter subject...'}
                    required
                  />
                </div>

                <div className="form-group form-full">
                  <label className="form-label">
                    {isMr ? 'वर्णन / टिपा' : 'Description / Notes'}
                  </label>
                  <textarea
                    className="form-input"
                    name="description"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                    placeholder={isMr ? 'पत्रातील मुख्य मुद्द्यांचा सारांश...' : 'Brief summary of the content...'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {isMr ? 'टॅग्ज' : 'Tags'}
                  </label>
                  <input
                    className="form-input"
                    name="tagInput"
                    value={form.tagInput}
                    onChange={handleChange}
                    onKeyDown={handleAddTag}
                    placeholder={isMr ? 'टॅग जोडा आणि एंटर दाबा...' : 'Add tag and press enter...'}
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
                    {isMr ? 'प्राधान्य' : 'Priority'}<span className="req">*</span>
                  </label>
                  <select className="form-input" name="priority" value={form.priority} onChange={handleChange}>
                    <option value="LOW">{isMr ? 'कमी' : 'Low'}</option>
                    <option value="MEDIUM">{isMr ? 'मध्यम' : 'Medium'}</option>
                    <option value="HIGH">{isMr ? 'उच्च' : 'High'}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {isMr ? 'नियुक्त अधिकारी' : 'Assigned To'}
                  </label>
                  <select className="form-input" name="assigned_to_user_id" value={form.assigned_to_user_id} onChange={handleChange}>
                    <option value="">{isMr ? '— नंतर नियुक्त करा —' : '— Assign later —'}</option>
                    <option value="2">Suresh Patil (PA / Staff)</option>
                    <option value="4">Rahul Jadhav (Staff)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {isMr ? 'जवाबी पत्र आवश्यक?' : 'Requires Outward Reply?'}
                  </label>
                  <select className="form-input" name="requires_reply" value={form.requires_reply} onChange={handleChange}>
                    <option value="NO">{isMr ? 'नाही' : 'No'}</option>
                    <option value="YES_LATER">{isMr ? 'होय — नंतर जावक तयार करा' : 'Yes — draft outward later'}</option>
                    <option value="YES_AI">{isMr ? 'होय — त्वरित AI जावक तयार करा' : 'Yes — AI draft immediately'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Attachments */}
            <div className="form-section">
              <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Paperclip size={16} /> {isMr ? 'दस्तऐवज अपलोड' : 'Scan / Upload Document'}</div>
              <div className="section-desc">{isMr ? 'प्राप्त झालेल्या पत्राची स्कॅन प्रत किंवा फोटो अपलोड करा' : 'Upload the scanned PDF or photo of the received letter'}</div>
              <div className="file-drop">
                <span className="ico"><UploadCloud size={24} /></span>
                <div className="text">
                  {isMr ? 'फाईल येथे ड्रॅग करा किंवा ' : 'Drag & drop scanned document, or '}<strong style={{ color: 'var(--inw-p)' }}>{isMr ? 'ब्राउझ करा' : 'click to browse'}</strong>
                </div>
                <div className="hint">PDF, JPG, PNG — Max 10MB</div>
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
                {isMr ? 'आवक क्रमांक:' : 'Inward No:'} <strong className="mono" style={{ color: 'var(--inw-p)' }}>{form.inward_number}</strong>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-o" onClick={onClose}>
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-p" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={16} /> {submitting ? (isMr ? 'जतन होत आहे...' : 'Saving...') : (isMr ? 'जतन करा' : 'Save')}
                </button>
                <button type="button" className="btn btn-ok" onClick={(e) => handleSubmit(e, true)} disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> {isMr ? 'जतन व जावक तयार करा' : 'Save & Create Outward'}
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
