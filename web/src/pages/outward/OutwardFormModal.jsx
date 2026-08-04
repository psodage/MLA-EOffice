// src/pages/outward/OutwardFormModal.jsx
// ============================================================
// Form Modal & Page for Creating Outward Letters
// Redesigned to match WIREFRAMES/outward_form.html
// Features Form on Left + Live Government Letterhead Preview on Right
// Includes Gemini AI Letter Drafting ("✨ Generate AI Draft")
// ============================================================

import { useState, useEffect } from 'react';
import { X, Sparkles, Save, Check, FileText, Printer, FileDown, Building2 } from 'lucide-react';
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
            <h3>{isMr ? 'नवीन जावक पत्र' : 'New Outward Letter'}</h3>
            <span className="modal-subtitle-en">
              {isMr ? 'आमदार कार्यालयाकडून अधिकृत शासकीय पत्र तयार करून पाठवा' : 'Draft and send an official letter from MLA office'}
            </span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {error && <div className="form-error-banner" style={{ marginBottom: '16px' }}>⚠️ {error}</div>}

          <div className="outward-layout">
            {/* ── Left Column: Form Controls ──────────────────── */}
            <div className="form-card" style={{ border: 'none', boxShadow: 'none' }}>
              {/* Section 1: Letter Details */}
              <div className="form-section">
                <div className="section-title">{isMr ? 'पत्र तपशील' : 'Letter Details'}</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      {isMr ? 'जावक क्रमांक' : 'Outward Number'}
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
                      {isMr ? 'दिनांक' : 'Date'}<span className="req">*</span>
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
                      {isMr ? 'संदर्भ आवक' : 'Reference Inward'}
                    </label>
                    <select
                      className="form-input"
                      name="reference_inward_id"
                      value={form.reference_inward_id}
                      onChange={handleInwardChange}
                    >
                      <option value="">{isMr ? '— कोणता नाही (स्वतंत्र पत्र) —' : '— None (independent letter) —'}</option>
                      {inwardOptions.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.inward_number} — {inv.subject || inv.sender_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      {isMr ? 'पत्र नमुना' : 'Letter Template'}
                    </label>
                    <select
                      className="form-input"
                      name="template"
                      value={form.template}
                      onChange={handleChange}
                    >
                      <option value="RECOMMENDATION">{isMr ? 'विभाग प्रमुखास शिफारस पत्र' : 'Recommendation to Dept Head'}</option>
                      <option value="FOLLOW_UP">{isMr ? 'स्मरणपत्र / पाठपुरावा' : 'Follow-up / Reminder'}</option>
                      <option value="INQUIRY">{isMr ? 'चौकशी पत्र' : 'Inquiry Letter'}</option>
                      <option value="APPRECIATION">{isMr ? 'अभिनंदन / सत्कार पत्र' : 'Appreciation Letter'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Recipient Information */}
              <div className="form-section">
                <div className="section-title">{isMr ? 'पत्र मिळणाऱ्याची माहिती' : 'Recipient Information'}</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      {isMr ? 'मिळणाऱ्याचे नाव' : 'Recipient Name'}<span className="req">*</span>
                    </label>
                    <input
                      className="form-input"
                      name="recipient_name"
                      value={form.recipient_name}
                      onChange={handleChange}
                      placeholder={isMr ? 'उदा. श्री. आर. एस. देशमुख' : 'e.g., Shri. R.S. Deshmukh'}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      {isMr ? 'पदनाम' : 'Designation'}
                    </label>
                    <input
                      className="form-input"
                      name="recipient_designation"
                      value={form.recipient_designation}
                      onChange={handleChange}
                      placeholder={isMr ? 'उदा. कार्यकारी अभियंता' : 'e.g., Executive Engineer'}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      {isMr ? 'विभाग / कार्यालय' : 'Department / Office'}<span className="req">*</span>
                    </label>
                    <select
                      className="form-input"
                      name="recipient_department_id"
                      value={form.recipient_department_id}
                      onChange={handleChange}
                    >
                      <option value="">{isMr ? 'विभाग निवडा...' : 'Select Department...'}</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {isMr ? dept.name_mr : (dept.name_en || dept.name_mr)} ({dept.short_code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Letter Content */}
              <div className="form-section">
                <div className="section-title">{isMr ? 'पत्र सामग्री' : 'Letter Content'}</div>

                <button
                  type="button"
                  className="ai-btn"
                  onClick={handleGenerateAiDraft}
                  disabled={draftingAi}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={16} />
                  {draftingAi ? (isMr ? 'AI मसुदा तयार होत आहे...' : 'Generating AI Draft...') : (isMr ? 'Gemini AI मसुदा तयार करा' : 'Generate AI Draft')}
                </button>

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
                      placeholder={isMr ? 'पत्राचा मुख्य विषय...' : 'Subject line of the letter'}
                      required
                    />
                  </div>
                  <div className="form-group form-full">
                    <label className="form-label">
                      {isMr ? 'मुख्य मजकूर' : 'Body'}<span className="req">*</span>
                    </label>
                    <textarea
                      className="form-input"
                      name="body_text"
                      rows={8}
                      style={{ minHeight: '180px', lineHeight: 1.6 }}
                      value={form.body_text}
                      onChange={handleChange}
                      placeholder={isMr ? 'पत्राचा सविस्तर मजकूर...' : 'Letter content in Marathi or English...'}
                      required
                    />
                    {isAiDrafted && (
                      <span className="form-hint" style={{ color: 'var(--inw-pu)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={12} /> {isMr ? 'Gemini AI ने मसुदा तयार केला' : 'AI-drafted using Gemini'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="form-footer">
                <button type="button" className="btn btn-o" onClick={onClose}>
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button type="button" className="btn btn-p" onClick={handleSubmit} disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={16} /> {isMr ? 'मसुदा जतन करा' : 'Save Draft'}
                </button>
                <button type="submit" className="btn btn-ok" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> {isMr ? 'मंजुरीसाठी पाठवा' : 'Submit for Approval'}
                </button>
              </div>
            </div>

            {/* ── Right Column: Live Government Letterhead Preview ── */}
            <div className="preview-panel">
              <div className="preview-header">
                <span className="preview-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} /> {isMr ? 'पत्र पूर्वावलोकन' : 'Letter Preview'}
                </span>
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
