import { useState, useEffect } from 'react';
import { X, Users, Search, RotateCcw, LogIn, ArrowLeft, AlertTriangle } from 'lucide-react';
import api from '../../services/api.js';

const PURPOSE_OPTIONS = [
  { value: 'GRIEVANCE', labelMr: 'तक्रार / निवेदने (Grievance / Petition)' },
  { value: 'COURTESY_CALL', labelMr: 'शुभेच्छा भेट (Courtesy Call)' },
  { value: 'PARTY_WORK', labelMr: 'पक्ष कार्य / संघटना (Party Work)' },
  { value: 'INVITATION', labelMr: 'निमंत्रण पत्रिका सुपूर्द (Invitation)' },
  { value: 'PERSONAL_MEETING', labelMr: 'वैयक्तिक भेट (Personal Meeting)' },
  { value: 'DOCUMENT_SUBMISSION', labelMr: 'कागदपत्रे सादर करणे (Document Submission)' },
  { value: 'FOLLOWUP', labelMr: 'काम पाठपुरावा (Followup)' },
  { value: 'RECOMMENDATION', labelMr: 'शिफारस मागणी (Recommendation)' },
  { value: 'GENERAL_INQUIRY', labelMr: 'सामान्य चौकशी (General Inquiry)' },
  { value: 'OTHER', labelMr: 'इतर (Other)' },
];

const VisitorCheckInModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [mobileInput, setMobileInput] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [repeatInfo, setRepeatInfo] = useState(null);

  const [form, setForm] = useState({
    visitor_name: '',
    mobile: '',
    address_line: '',
    city: 'राहाता',
    purpose: 'GRIEVANCE',
    purpose_description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setMobileInput('');
    setRepeatInfo(null);
    setForm({
      visitor_name: '',
      mobile: '',
      address_line: '',
      city: 'राहाता',
      purpose: 'GRIEVANCE',
      purpose_description: '',
    });
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  // Step 1: Lookup Mobile
  const handleMobileLookup = async (e) => {
    e.preventDefault();
    if (!mobileInput.trim() || mobileInput.trim().length < 10) {
      setError('कृपया १० अंकी वैध मोबाईल क्रमांक प्रविष्ट करा');
      return;
    }

    setLookingUp(true);
    setError('');

    try {
      const { data } = await api.get(`/visitors/lookup/${mobileInput.trim()}`);
      const info = data.data || {};
      setRepeatInfo(info);

      setForm((prev) => ({
        ...prev,
        mobile: mobileInput.trim(),
        visitor_name: info.lastVisit?.visitor_name || prev.visitor_name,
        address_line: info.lastVisit?.address_line || prev.address_line,
        city: info.lastVisit?.city || 'राहाता',
      }));

      setStep(2);
    } catch (err) {
      console.error('Mobile lookup error:', err);
      setError('मोबाईल लुकअप करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setLookingUp(false);
    }
  };

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Step 2: Save Check-In
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.visitor_name.trim()) {
      setError('कृपया भेटणाऱ्याचे नाव प्रविष्ट करा (Visitor name is required)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/visitors/checkin', form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Check-in error:', err);
      setError(err?.response?.data?.message || 'भेट नोंदवताना त्रुटी आली.');
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
              <Users size={18} /> नवीन नागरिक भेट नोंद (Visitor Check-In)
            </h3>
            <span className="modal-subtitle-en">Step {step} of 2 — Quick Entry & Repeat Detection</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {step === 1 ? (
          /* Step 1: Mobile Lookup Form */
          <form onSubmit={handleMobileLookup} className="inward-form">
            {error && <div className="form-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} /> {error}</div>}

            <div className="form-group col-span-2">
              <label>भेटणाऱ्याचा १० अंकी मोबाईल नंबर (Mobile Number) <span className="req">*</span></label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="tel"
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                  placeholder="98220XXXXX (पुनरावृत्ती तपासणीसाठी)"
                  maxLength={10}
                  style={{ fontSize: '1.1rem', fontWeight: 700 }}
                  required
                  autoFocus
                />
                <button type="submit" className="btn-primary" disabled={lookingUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Search size={16} /> {lookingUp ? 'तपासत आहे...' : 'शोधा (Lookup)'}
                </button>
              </div>
              <small style={{ color: '#94a3b8', marginTop: '0.35rem', display: 'block' }}>
                मोबाईल नंबर प्रविष्ट केल्यास पूर्वीची भेट व नाव आपोआप दिसेल.
              </small>
            </div>
          </form>
        ) : (
          /* Step 2: Visitor Details & Purpose Form */
          <form onSubmit={handleSubmit} className="inward-form">
            {error && <div className="form-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} /> {error}</div>}

            {/* Repeat Visitor Alert Banner */}
            {repeatInfo && repeatInfo.isRepeat && (
              <div className="repeat-visitor-alert-banner" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RotateCcw size={16} /> <strong>पुनरावृत्ती भेटणारे (Repeat Visitor):</strong> हे नागरिक यापूर्वी <strong>{repeatInfo.previousCount} वेळा</strong> कार्यालयास भेट देऊन गेले आहेत.
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label>मोबाईल क्रमांक (Mobile)</label>
                <input type="text" value={form.mobile} disabled style={{ opacity: 0.7 }} />
              </div>

              <div className="form-group">
                <label>नागरिकाचे नाव (Visitor Name) <span className="req">*</span></label>
                <input
                  type="text"
                  name="visitor_name"
                  value={form.visitor_name}
                  onChange={handleChange}
                  placeholder="उदा. बबनराव पाटील"
                  required
                />
              </div>

              <div className="form-group col-span-2">
                <label>पत्ता व गाव (Address / Village)</label>
                <input
                  type="text"
                  name="address_line"
                  value={form.address_line}
                  onChange={handleChange}
                  placeholder="उदा. मु.पो. राहाता, तालुका राहाता"
                />
              </div>

              <div className="form-group col-span-2">
                <label>भेटण्याचे कारण (Purpose of Visit) <span className="req">*</span></label>
                <select name="purpose" value={form.purpose} onChange={handleChange} required>
                  {PURPOSE_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.labelMr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group col-span-2">
                <label>कारणाचा तपशील व मुद्दे (Purpose Description)</label>
                <textarea
                  name="purpose_description"
                  value={form.purpose_description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="भेटण्यामागचे सविस्तर कारण किंवा महत्त्वाचे मुद्दे प्रविष्ट करा..."
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setStep(1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={16} /> मागे जा (Back)
              </button>
              <button type="submit" className="btn-primary" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <LogIn size={16} /> {submitting ? 'नोंदणी होत आहे...' : 'चेक-इन करा (Check-In)'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VisitorCheckInModal;
