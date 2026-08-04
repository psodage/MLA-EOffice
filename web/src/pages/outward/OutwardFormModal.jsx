// src/pages/outward/OutwardFormModal.jsx
// ============================================================
// Form Modal & Page for Creating Outward Letters
// Redesigned to match WIREFRAMES/outward_form.html
// Features Form on Left + Live Government Letterhead Preview on Right
// Includes Gemini AI Letter Drafting ("✨ Generate AI Draft")
// ============================================================

import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';

const OutwardFormModal = ({ isOpen, onClose, onSuccess, initialInwardData = null }) => {
  const { lang } = useLangStore();
  const isMr = lang === 'MR';

  const [form, setForm] = useState({
    outward_number: '',
    date_sent: new Date().toISOString().split('T')[0],
    reference_inward_id: '',
    template: 'RECOMMENDATION',
    recipient_name: '',
    recipient_designation: '',
    recipient_department_id: '',
    subject: '',
    body_text: '',
    tone: 'FORMAL_REQUEST',
    context: '',
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

    const randomOutwardNo = `OUT/2026/${String(Math.floor(Math.random() * 500) + 150).padStart(4, '0')}`;

    if (initialInwardData) {
      setForm({
        outward_number: randomOutwardNo,
        date_sent: new Date().toISOString().split('T')[0],
        reference_inward_id: String(initialInwardData.id || ''),
        template: 'RECOMMENDATION',
        recipient_name: initialInwardData.sender_name || 'Shri. R.S. Deshmukh',
        recipient_designation: initialInwardData.sender_designation || 'Executive Engineer',
        recipient_department_id: String(initialInwardData.sender_department_id || ''),
        subject: `Regarding ${initialInwardData.subject || 'project proposal'} — request for priority action`,
        body_text: `महोदय,\n\nविषय: ${initialInwardData.subject || 'प्रकल्प प्रस्ताव'}\n\nसंदर्भ: आपले आवक पत्र क्र. ${initialInwardData.inward_number || 'INW/2026/0385'}\n\nउपरोक्त संदर्भाच्या अनुषंगाने, सदर विषयावर तातडीने कार्यवाही करून अहवाल सादर करावा.\n\nआपला विश्वासू,`,
        tone: 'FORMAL_REQUEST',
        context: initialInwardData.description || '',
      });
    } else {
      setForm({
        outward_number: randomOutwardNo,
        date_sent: new Date().toISOString().split('T')[0],
        reference_inward_id: '',
        template: 'RECOMMENDATION',
        recipient_name: 'Shri. R.S. Deshmukh',
        recipient_designation: 'Executive Engineer',
        recipient_department_id: '',
        subject: 'Regarding expediting road widening project at NH-4 junction — request for priority action',
        body_text: `महोदय,\n\nविषय: एनएच-4 जंक्शन येथील रस्ता रुंदीकरण प्रकल्प — प्राधान्य कार्यवाहीची विनंती\n\nसंदर्भ: आपले पत्र क्र. PWD/CE/HQ/2026/1234, दि. 01/08/2026\n\nउपरोक्त संदर्भाच्या अनुषंगाने, एनएच-4 जंक्शन येथील रस्ता रुंदीकरण प्रकल्पाचा सुधारित खर्चाचा अंदाज (₹2.45 कोटी) प्राप्त झाला आहे. या प्रकल्पामुळे दररोज अंदाजे 15,000 वाहने आणि हजारो नागरिकांना फायदा होणार आहे.\n\nNHAI मंजुरी प्रक्रिया लवकरात लवकर पूर्ण करण्याची विनंती करण्यात येते. या प्रकल्पास प्राधान्य देऊन पुढील कार्यवाही करावी.\n\nआपल्या सहकार्याची अपेक्षा.\n\nआपला विश्वासू,`,
        tone: 'FORMAL_REQUEST',
        context: '',
      });
    }
    setIsAiDrafted(false);
    setError('');
  }, [isOpen, initialInwardData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // When reference inward is selected, auto-fill recipient and subject
  const handleInwardChange = (e) => {
    const inwardId = e.target.value;
    setForm((prev) => ({ ...prev, reference_inward_id: inwardId }));

    if (inwardId) {
      const selected = inwardOptions.find((i) => String(i.id) === String(inwardId));
      if (selected) {
        setForm((prev) => ({
          ...prev,
          reference_inward_id: inwardId,
          subject: selected.subject ? `Regarding ${selected.subject}` : prev.subject,
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
        recipientDepartment: selectedDeptObj ? (selectedDeptObj.name_mr || selectedDeptObj.name_en) : '',
        context: form.context,
        tone: form.tone,
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
      // Fallback AI draft if server offline
      const fallbackDraft = `महोदय,\n\nविषय: ${form.subject}\n\nसंदर्भ: कार्यालयीन टिपणी व नागरिक निवेदन\n\nउपरोक्त विषयान्वये, ${form.recipient_name || 'विभागीय अधिकारी'} यांना नम्रपणे कळविण्यात येते की, सदर बाबीवर तातडीने योग्य ती कार्यवाही करण्यात यावी व केलेल्या कार्यवाहीचा अहवाल या कार्यालयास सत्वर सादर करावा.\n\nआपला विश्वासू,\nआमदार, हवेली मतदारसंघ`;
      setForm((prev) => ({ ...prev, body_text: fallbackDraft }));
      setIsAiDrafted(true);
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
        date_sent: form.date_sent,
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

  const selectedDeptName = departments.find((d) => String(d.id) === String(form.recipient_department_id))?.name_mr || 'सार्वजनिक बांधकाम विभाग';

  return (
    <div className="inward-modal-overlay" onClick={onClose}>
      <div className="inward-modal-container outward-modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="inward-modal-header">
          <div className="modal-title-group">
            <h3>📤 New Outward Letter · <span className="mr">नवीन जावक पत्र</span></h3>
            <span className="modal-subtitle-en">Draft and send an official letter from MLA office</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {error && <div className="form-error-banner" style={{ marginBottom: '16px' }}>⚠️ {error}</div>}

          <div className="outward-layout">
            {/* ── Left Column: Form Controls ──────────────────── */}
            <div className="form-card" style={{ border: 'none', boxShadow: 'none' }}>
              {/* Section 1: Letter Details */}
              <div className="form-section">
                <div className="section-title">📤 Letter Details · <span className="mr">पत्र तपशील</span></div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Outward Number <span className="mr-sub">जावक क्रमांक</span>
                    </label>
                    <input
                      className="form-input mono"
                      value={form.outward_number}
                      readOnly
                      style={{ background: 'var(--inw-bg)', color: 'var(--inw-t3)', fontWeight: 600 }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Date<span className="req">*</span>
                    </label>
                    <input
                      className="form-input"
                      type="date"
                      name="date_sent"
                      value={form.date_sent}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Reference Inward <span className="mr-sub">संदर्भ आवक</span>
                    </label>
                    <select
                      className="form-input"
                      name="reference_inward_id"
                      value={form.reference_inward_id}
                      onChange={handleInwardChange}
                    >
                      <option value="">— None (independent letter) —</option>
                      {inwardOptions.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.inward_number} — {inv.subject || inv.sender_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Letter Template <span className="mr-sub">पत्र नमुना</span>
                    </label>
                    <select
                      className="form-input"
                      name="template"
                      value={form.template}
                      onChange={handleChange}
                    >
                      <option value="RECOMMENDATION">Recommendation to Dept Head</option>
                      <option value="FOLLOW_UP">Follow-up / Reminder</option>
                      <option value="INQUIRY">Inquiry Letter</option>
                      <option value="APPRECIATION">Appreciation Letter</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Recipient */}
              <div className="form-section">
                <div className="section-title">👤 Recipient · <span className="mr">प्राप्तकर्ता</span></div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Recipient Name<span className="req">*</span> <span className="mr-sub">प्राप्तकर्ता नाव</span>
                    </label>
                    <input
                      className="form-input"
                      name="recipient_name"
                      value={form.recipient_name}
                      onChange={handleChange}
                      placeholder="e.g., Shri. R.S. Deshmukh"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Designation <span className="mr-sub">पद</span>
                    </label>
                    <input
                      className="form-input"
                      name="recipient_designation"
                      value={form.recipient_designation}
                      onChange={handleChange}
                      placeholder="e.g., Executive Engineer"
                    />
                  </div>
                  <div className="form-group form-full">
                    <label className="form-label">
                      Department<span className="req">*</span> <span className="mr-sub">विभाग</span>
                    </label>
                    <select
                      className="form-input"
                      name="recipient_department_id"
                      value={form.recipient_department_id}
                      onChange={handleChange}
                    >
                      <option value="">Select Department...</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name_en || dept.name_mr} · {dept.name_mr} ({dept.short_code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Letter Content */}
              <div className="form-section">
                <div className="section-title">📝 Letter Content · <span className="mr">पत्र सामग्री</span></div>

                <button
                  type="button"
                  className="ai-btn"
                  onClick={handleGenerateAiDraft}
                  disabled={draftingAi}
                >
                  <span className="sparkle">✨</span>
                  {draftingAi ? 'AI मसुदा तयार होत आहे...' : 'Generate AI Draft · AI मसुदा तयार करा'}
                </button>

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
                      placeholder="Subject line of the letter"
                      required
                    />
                  </div>
                  <div className="form-group form-full">
                    <label className="form-label">
                      Body<span className="req">*</span> <span className="mr-sub">मुख्य भाग</span>
                    </label>
                    <textarea
                      className="form-input"
                      name="body_text"
                      rows={8}
                      style={{ minHeight: '180px', lineHeight: 1.6 }}
                      value={form.body_text}
                      onChange={handleChange}
                      placeholder="Letter content in Marathi or English..."
                      required
                    />
                    {isAiDrafted && (
                      <span className="form-hint" style={{ color: 'var(--inw-pu)', fontWeight: 600 }}>
                        ✨ AI-drafted in Marathi · AI ने मराठीत मसुदा तयार केला
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="form-footer">
                <button type="button" className="btn btn-o" onClick={onClose}>
                  Cancel
                </button>
                <button type="button" className="btn btn-p" onClick={handleSubmit} disabled={submitting}>
                  💾 Save Draft
                </button>
                <button type="submit" className="btn btn-ok" disabled={submitting}>
                  ✓ Submit for Approval
                </button>
              </div>
            </div>

            {/* ── Right Column: Live Government Letterhead Preview ── */}
            <div className="preview-panel">
              <div className="preview-header">
                <span className="preview-title">📋 Letter Preview</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid var(--inw-b)',
                      borderRadius: 'var(--inw-r)',
                      background: 'var(--inw-c)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      color: 'var(--inw-t3)',
                    }}
                  >
                    🖨️ Print
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '4px 8px',
                      border: '1px solid var(--inw-b)',
                      borderRadius: 'var(--inw-r)',
                      background: 'var(--inw-c)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      color: 'var(--inw-t3)',
                    }}
                  >
                    📄 PDF
                  </button>
                </div>
              </div>

              <div className="preview-body">
                <div className="letter-header">
                  <div className="office">🏛️ कार्यालय — आमदार, हवेली मतदारसंघ</div>
                  <div className="mla">Office of MLA, Haveli Constituency</div>
                  <div style={{ fontSize: '10px', color: 'var(--inw-t4)', marginTop: '4px' }}>
                    Vidhan Bhavan, Constituency Office, Maharashtra — 411001
                  </div>
                </div>

                <div className="letter-ref">
                  <span>Ref: {form.outward_number}</span>
                  <span>Date: {form.date_sent}</span>
                </div>

                <div className="letter-to">
                  <strong>To,</strong><br />
                  {form.recipient_name || 'Shri. R.S. Deshmukh'}<br />
                  {form.recipient_designation || 'Executive Engineer'}<br />
                  {selectedDeptName}
                </div>

                <div className="letter-subject">
                  <strong>Subject:</strong> {form.subject || 'Letter subject line...'}
                </div>

                <div className="letter-body">
                  {form.body_text || 'Letter body content will appear here...'}
                </div>

                <div className="letter-sign">
                  <div className="name">आमदार, हवेली मतदारसंघ</div>
                  <div className="desg">MLA, Haveli Constituency</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="wfb">WIREFRAME · OUTWARD FORM</div>
    </div>
  );
};

export default OutwardFormModal;
