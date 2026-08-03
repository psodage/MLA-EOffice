// src/pages/outward/OutwardFormModal.jsx
// ============================================================
// Form Modal for Creating Outward Letters
// Includes Gemini AI Letter Drafting ("✨ AI ड्राफ्ट करा") &
// Reference Inward linking.
// ============================================================

import { useState, useEffect } from 'react';
import api from '../../services/api.js';

const TONE_OPTIONS = [
  { value: 'FORMAL_REQUEST', labelMr: 'विनंती पत्र (Formal Request)', icon: '📝' },
  { value: 'FOLLOW_UP', labelMr: 'पाठपुरावा पत्र (Follow-Up / Reminder)', icon: '⏰' },
  { value: 'ESCALATION', labelMr: 'तक्रार / वाढवणे (Complaint / Escalation)', icon: '⚠️' },
  { value: 'RECOMMENDATION', labelMr: 'शिफारस पत्र (Recommendation)', icon: '👍' },
  { value: 'INSTRUCTION', labelMr: 'निर्देश / आदेश पत्र (Directive)', icon: '📌' },
  { value: 'INQUIRY', labelMr: 'चौकशी पत्र (Inquiry / Status Request)', icon: '🔍' },
];

const OutwardFormModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    recipient_name: '',
    recipient_designation: '',
    recipient_department_id: '',
    subject: '',
    body_text: '',
    reference_inward_id: '',
    tone: 'FORMAL_REQUEST',
    context: '',
    citizenName: '',
  });

  const [departments, setDepartments] = useState([]);
  const [inwardOptions, setInwardOptions] = useState([]);
  const [draftingAi, setDraftingAi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isAiDrafted, setIsAiDrafted] = useState(false);
  const [error, setError] = useState('');

  // Load departments & inward entries for reference dropdown
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [deptRes, inwardRes] = await Promise.all([
          api.get('/departments'),
          api.get('/inward?limit=50'),
        ]);
        setDepartments(deptRes.data.data || []);
        setInwardOptions(inwardRes.data.data || []);
      } catch (err) {
        console.error('Failed to load form options:', err);
      }
    };

    fetchData();

    // Reset form
    setForm({
      recipient_name: '',
      recipient_designation: '',
      recipient_department_id: '',
      subject: '',
      body_text: '',
      reference_inward_id: '',
      tone: 'FORMAL_REQUEST',
      context: '',
      citizenName: '',
    });
    setIsAiDrafted(false);
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // When reference inward is selected, auto-fill details!
  const handleInwardChange = (e) => {
    const inwardId = e.target.value;
    setForm((prev) => ({ ...prev, reference_inward_id: inwardId }));

    if (inwardId) {
      const selected = inwardOptions.find((i) => String(i.id) === String(inwardId));
      if (selected) {
        setForm((prev) => ({
          ...prev,
          reference_inward_id: inwardId,
          subject: selected.subject || prev.subject,
          recipient_name: selected.sender_name || prev.recipient_name,
          recipient_designation: selected.sender_designation || prev.recipient_designation,
          recipient_department_id: selected.sender_department_id || prev.recipient_department_id,
          context: selected.description || prev.context,
        }));
      }
    }
  };

  // Trigger Gemini AI Letter Drafting
  const handleGenerateAiDraft = async () => {
    if (!form.subject.trim()) {
      setError('AI मसुदा तयार करण्यासाठी पत्राचा विषय आवश्यक आहे (Subject is required)');
      return;
    }

    setDraftingAi(true);
    setError('');

    try {
      const selectedDeptObj = departments.find((d) => String(d.id) === String(form.recipient_department_id));

      const payload = {
        subject: form.subject,
        recipientName: form.recipient_name,
        recipientDesignation: form.recipient_designation,
        recipientDepartment: selectedDeptObj ? selectedDeptObj.name_mr : '',
        context: form.context,
        tone: form.tone,
        citizenName: form.citizenName,
        referenceNumber: form.reference_inward_id
          ? inwardOptions.find((i) => String(i.id) === String(form.reference_inward_id))?.inward_number || ''
          : '',
      };

      const { data } = await api.post('/outward/ai-draft', payload);
      const draftText = data.data?.draftText || '';

      setForm((prev) => ({ ...prev, body_text: draftText }));
      setIsAiDrafted(true);
    } catch (err) {
      console.error('AI drafting error:', err);
      setError(err?.response?.data?.message || 'AI मसुदा तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setDraftingAi(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.recipient_name.trim()) {
      setError('कृपया पत्र मिळणाऱ्याचे नाव प्रविष्ट करा (Recipient name is required)');
      return;
    }
    if (!form.subject.trim()) {
      setError('कृपया विषय प्रविष्ट करा (Subject is required)');
      return;
    }
    if (!form.body_text.trim()) {
      setError('कृपया पत्राचा मसुदा प्रविष्ट करा किंवा AI द्वारे जनरेट करा');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        recipient_name: form.recipient_name,
        recipient_designation: form.recipient_designation || null,
        recipient_department_id: form.recipient_department_id ? parseInt(form.recipient_department_id, 10) : null,
        subject: form.subject,
        body_text: form.body_text,
        reference_inward_id: form.reference_inward_id ? parseInt(form.reference_inward_id, 10) : null,
        is_ai_drafted: isAiDrafted,
      };

      await api.post('/outward', payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Save outward error:', err);
      setError(err?.response?.data?.message || 'जावक पत्र जतन करताना त्रुटी आली.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inward-modal-overlay" onClick={onClose}>
      <div className="inward-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="inward-modal-header">
          <div className="modal-title-group">
            <h3>📤 नवीन जावक पत्र नोंदणी (New Outward Letter)</h3>
            <span className="modal-subtitle-en">Create Government Outward Letter with AI Assistance</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="inward-form">
          {error && <div className="form-error-banner">⚠️ {error}</div>}

          {/* Reference Inward Linking */}
          <div className="form-group col-span-2 reference-link-card">
            <label className="section-label">🔗 संदर्भातील आवक पत्र निवडा (Link to Inward Reply)</label>
            <select
              name="reference_inward_id"
              value={form.reference_inward_id}
              onChange={handleInwardChange}
            >
              <option value="">-- हे स्वतंत्र नवीन पत्र आहे (No Linked Inward) --</option>
              {inwardOptions.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.inward_number} - {inv.sender_name} ({inv.subject})
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid">
            {/* Recipient Name */}
            <div className="form-group">
              <label>पत्र कोणाला पाठवायचे? (Recipient Name) <span className="req">*</span></label>
              <input
                type="text"
                name="recipient_name"
                value={form.recipient_name}
                onChange={handleChange}
                placeholder="उदा. मा. जिल्हाधिकारी / मा. मुख्य कार्यकारी अधिकारी"
                required
              />
            </div>

            {/* Recipient Designation */}
            <div className="form-group">
              <label>पदनाम (Designation)</label>
              <input
                type="text"
                name="recipient_designation"
                value={form.recipient_designation}
                onChange={handleChange}
                placeholder="उदा. कार्यकारी अभियंता / आयुक्त"
              />
            </div>

            {/* Recipient Department */}
            <div className="form-group col-span-2">
              <label>संबंधित शासकीय विभाग (Department)</label>
              <select
                name="recipient_department_id"
                value={form.recipient_department_id}
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

            {/* Subject */}
            <div className="form-group col-span-2">
              <label>पत्राचा विषय (Subject) <span className="req">*</span></label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="उदा. राहाता शहरातील पिण्याच्या पाण्याच्या समस्येबाबत तातडीने बैठक घेणेबाबत"
                required
              />
            </div>

            {/* Citizen Name (for AI Context) */}
            <div className="form-group">
              <label>संबंधित नागरिकाचे नाव (Citizen Name - AI Context)</label>
              <input
                type="text"
                name="citizenName"
                value={form.citizenName}
                onChange={handleChange}
                placeholder="उदा. रमेश पाटील"
              />
            </div>

            {/* Tone Selector for AI */}
            <div className="form-group">
              <label>पत्राचा टोन / स्वरूप (Letter Tone / Type)</label>
              <select name="tone" value={form.tone} onChange={handleChange}>
                {TONE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.icon} {t.labelMr}
                  </option>
                ))}
              </select>
            </div>

            {/* Extra Context */}
            <div className="form-group col-span-2">
              <label>अतिरिक्त मुद्दे व माहिती (Extra Details for AI)</label>
              <textarea
                name="context"
                value={form.context}
                onChange={handleChange}
                rows={2}
                placeholder="पत्रात समाविष्ट करावयाची महत्त्वाची आकडेवारी किंवा स्थानिक परिस्थिती..."
              />
            </div>
          </div>

          {/* AI Generation Trigger Bar */}
          <div className="ai-trigger-banner">
            <div className="ai-trigger-text">
              <strong>🤖 AI सहाय्यक (Gemini AI Drafting)</strong>
              <span>वर दिलेला विषय व टोन वापरून एका क्लिकवर शासकीय मराठी पत्र मसुदा तयार करा</span>
            </div>
            <button
              type="button"
              className="btn-ai-draft"
              onClick={handleGenerateAiDraft}
              disabled={draftingAi}
            >
              {draftingAi ? '✨ AI मसुदा तयार होत आहे...' : '✨ AI ड्राफ्ट करा (Draft with AI)'}
            </button>
          </div>

          {/* Letter Body Textarea (Rich Marathi Letter) */}
          <div className="form-group">
            <label className="body-label">
              <span>पत्राचा अंतिम मसुदा (Letter Body Content) <span className="req">*</span></span>
              {isAiDrafted && <span className="ai-tag-badge">🤖 Gemini AI जनरेटेड</span>}
            </label>
            <textarea
              name="body_text"
              value={form.body_text}
              onChange={handleChange}
              rows={10}
              style={{ fontFamily: "'Noto Sans Devanagari', monospace", fontSize: '0.9rem', lineHeight: 1.6 }}
              placeholder="येथे पत्राचा मजकूर प्रविष्ट करा किंवा वरील 'AI ड्राफ्ट करा' बटणावर क्लिक करा..."
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              रद्द करा (Cancel)
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'जतन होत आहे...' : 'नोंदणी करा (Save Outward)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutwardFormModal;
