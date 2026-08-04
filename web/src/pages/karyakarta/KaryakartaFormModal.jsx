import { useState, useEffect } from 'react';
import { X, UserPlus, AlertTriangle, UserCheck } from 'lucide-react';
import api from '../../services/api.js';

const DESIGNATION_OPTIONS = [
  { value: 'BOOTH_PRAMUKH', labelMr: 'बूथ प्रमुख (Booth Pramukh)' },
  { value: 'WARD_HEAD', labelMr: 'वॉर्ड प्रमुख (Ward Head)' },
  { value: 'SHAKTI_KENDRA', labelMr: 'शक्ती केंद्र प्रमुख (Shakti Kendra Head)' },
  { value: 'KARYAKARTA', labelMr: 'कार्यकर्ता (Karyakarta)' },
  { value: 'VOLUNTEER', labelMr: 'स्वयंसेवक (Volunteer)' },
  { value: 'OTHER', labelMr: 'इतर (Other)' },
];

const KaryakartaFormModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    full_name: '',
    mobile: '',
    alt_mobile: '',
    date_of_birth: '',
    address: '',
    city: 'राहाता',
    booth_id: '101',
    designation: 'KARYAKARTA',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      full_name: '',
      mobile: '',
      alt_mobile: '',
      date_of_birth: '',
      address: '',
      city: 'राहाता',
      booth_id: '101',
      designation: 'KARYAKARTA',
      notes: '',
    });
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setError('');
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      setError('कृपया कार्यकर्त्याचे पूर्ण नाव प्रविष्ट करा (Full name required)');
      return;
    }
    if (!form.mobile.trim() || form.mobile.trim().length !== 10) {
      setError('कृपया १० अंकी वैध मोबाईल क्रमांक प्रविष्ट करा (10-digit mobile required)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/karyakartas', form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Save karyakarta error:', err);
      setError(err?.response?.data?.message || 'कार्यकर्ता नोंदवताना त्रुटी आली.');
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
              <UserPlus size={18} /> नवीन कार्यकर्ता नोंदणी (Add Karyakarta)
            </h3>
            <span className="modal-subtitle-en">Register Party Worker, Booth Assignment & Birth Date</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="inward-form">
          {error && <div className="form-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} /> {error}</div>}

          <div className="form-grid">
            {/* Full Name */}
            <div className="form-group col-span-2">
              <label>कार्यकर्त्याचे पूर्ण नाव (Full Name) <span className="req">*</span></label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="उदा. सचिन नामदेव तांबे"
                required
              />
            </div>

            {/* Mobile */}
            <div className="form-group">
              <label>प्राथमिक मोबाईल नंबर (10-Digit Mobile) <span className="req">*</span></label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="98220XXXXX (युनिक नंबर)"
                maxLength={10}
                required
              />
            </div>

            {/* Alt Mobile */}
            <div className="form-group">
              <label>पर्यायी मोबाईल (Alt Mobile)</label>
              <input
                type="tel"
                name="alt_mobile"
                value={form.alt_mobile}
                onChange={handleChange}
                placeholder="98220XXXXX (ऐच्छिक)"
                maxLength={10}
              />
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label>जन्मतारीख (Date of Birth)</label>
              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
              />
              <small style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block' }}>
                वाढदिवसाच्या शुभेच्छा संदेशासाठी वापरले जाईल.
              </small>
            </div>

            {/* Designation */}
            <div className="form-group">
              <label>पदनाम (Designation) <span className="req">*</span></label>
              <select name="designation" value={form.designation} onChange={handleChange} required>
                {DESIGNATION_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.labelMr}
                  </option>
                ))}
              </select>
            </div>

            {/* Booth Number / ID */}
            <div className="form-group">
              <label>बूथ क्रमांक (Polling Booth No.) <span className="req">*</span></label>
              <select name="booth_id" value={form.booth_id} onChange={handleChange} required>
                <option value="101">बूथ क्र. १०१ - सावळीविहीर बुद्रुक (सा. शाळा)</option>
                <option value="102">बूथ क्र. १०२ - शिर्डी शहर (नगरपंचायत शाळा)</option>
                <option value="103">बूथ क्र. १०३ - अस्तगाव (ग्रामपंचायत कार्यालय)</option>
                <option value="104">बूथ क्र. १०४ - कोल्हार भगवतीपूर</option>
                <option value="105">बूथ क्र. १०५ - राहाता शहर (कन्या शाळा)</option>
              </select>
            </div>

            {/* Address */}
            <div className="form-group col-span-2">
              <label>पत्ता व गाव (Address / Village)</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="उदा. मु.पो. सावळीविहीर बुद्रुक, राहाता"
              />
            </div>

            {/* Internal Notes */}
            <div className="form-group col-span-2">
              <label>कार्यालयीन टीप व नोंद (Internal Notes)</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                placeholder="कार्यकर्त्याबाबत विशेष जबाबदारी किंवा नोंद..."
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              रद्द करा (Cancel)
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={16} /> {submitting ? 'नोंदणी होत आहे...' : 'कार्यकर्ता जतन करा (Save)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KaryakartaFormModal;
