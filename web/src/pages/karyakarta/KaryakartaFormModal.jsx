import { useState, useEffect } from 'react';
import { X, UserPlus, AlertTriangle, UserCheck } from 'lucide-react';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';

const DESIGNATION_OPTIONS = [
  { value: 'BOOTH_PRAMUKH', labelEn: 'Booth Pramukh', labelMr: 'बूथ प्रमुख' },
  { value: 'WARD_HEAD', labelEn: 'Ward Head', labelMr: 'वॉर्ड प्रमुख' },
  { value: 'SHAKTI_KENDRA', labelEn: 'Shakti Kendra Head', labelMr: 'शक्ती केंद्र प्रमुख' },
  { value: 'KARYAKARTA', labelEn: 'Karyakarta', labelMr: 'कार्यकर्ता' },
  { value: 'VOLUNTEER', labelEn: 'Volunteer', labelMr: 'स्वयंसेवक' },
  { value: 'OTHER', labelEn: 'Other', labelMr: 'इतर' },
];

const KaryakartaFormModal = ({ isOpen, onClose, onSuccess }) => {
  const { lang } = useLangStore();
  const isMr = lang === 'MR';

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
      setError(isMr ? 'कृपया कार्यकर्त्याचे पूर्ण नाव प्रविष्ट करा.' : 'Full name is required.');
      return;
    }
    if (!form.mobile.trim() || form.mobile.trim().length !== 10) {
      setError(isMr ? 'कृपया १० अंकी वैध मोबाईल क्रमांक प्रविष्ट करा.' : 'Valid 10-digit mobile number required.');
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
      setError(err?.response?.data?.message || (isMr ? 'कार्यकर्ता नोंदवताना त्रुटी आली.' : 'Error saving worker.'));
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
              <UserPlus size={18} /> {isMr ? 'नवीन कार्यकर्ता नोंदणी' : 'Add Karyakarta'}
            </h3>
            <span className="modal-subtitle-en">
              {isMr ? 'कार्यकर्ता, बूथ जबाबदारी व जन्मतारीख नोंदवा' : 'Register Party Worker, Booth Assignment & Birth Date'}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="inward-form">
          {error && <div className="form-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} /> {error}</div>}

          <div className="form-grid">
            {/* Full Name */}
            <div className="form-group col-span-2">
              <label>{isMr ? 'कार्यकर्त्याचे पूर्ण नाव' : 'Full Name'} <span className="req">*</span></label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder={isMr ? 'उदा. सचिन नामदेव तांबे' : 'e.g. Sachin Namdeo Tambe'}
                required
              />
            </div>

            {/* Mobile */}
            <div className="form-group">
              <label>{isMr ? 'प्राथमिक मोबाईल नंबर' : 'Primary Mobile'} <span className="req">*</span></label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="98220XXXXX"
                maxLength={10}
                required
              />
            </div>

            {/* Alt Mobile */}
            <div className="form-group">
              <label>{isMr ? 'पर्यायी मोबाईल' : 'Alt Mobile'}</label>
              <input
                type="tel"
                name="alt_mobile"
                value={form.alt_mobile}
                onChange={handleChange}
                placeholder="98220XXXXX"
                maxLength={10}
              />
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label>{isMr ? 'जन्मतारीख' : 'Date of Birth'}</label>
              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
              />
              <small style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block' }}>
                {isMr ? 'वाढदिवसाच्या शुभेच्छा संदेशासाठी वापरले जाईल.' : 'Used for automated birthday greeting messages.'}
              </small>
            </div>

            {/* Designation */}
            <div className="form-group">
              <label>{isMr ? 'पदनाम / जबाबदारी' : 'Designation'} <span className="req">*</span></label>
              <select name="designation" value={form.designation} onChange={handleChange} required>
                {DESIGNATION_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {isMr ? d.labelMr : d.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Booth Number / ID */}
            <div className="form-group">
              <label>{isMr ? 'बूथ क्रमांक' : 'Polling Booth'} <span className="req">*</span></label>
              <select name="booth_id" value={form.booth_id} onChange={handleChange} required>
                <option value="101">{isMr ? 'बूथ क्र. १०१ - सावळीविहीर बुद्रुक (सा. शाळा)' : 'Booth No. 101 - Sawalivihir Bk (Govt School)'}</option>
                <option value="102">{isMr ? 'बूथ क्र. १०२ - शिर्डी शहर (नगरपंचायत शाळा)' : 'Booth No. 102 - Shirdi Town (Nagar Panchayat School)'}</option>
                <option value="103">{isMr ? 'बूथ क्र. १०३ - अस्तगाव (ग्रामपंचायत कार्यालय)' : 'Booth No. 103 - Astagaon (GP Office)'}</option>
                <option value="104">{isMr ? 'बूथ क्र. १०४ - कोल्हार भगवतीपूर' : 'Booth No. 104 - Kolhar Bhagwatipur'}</option>
                <option value="105">{isMr ? 'बूथ क्र. १०५ - राहाता शहर (कन्या शाळा)' : 'Booth No. 105 - Rahata Town (Girls School)'}</option>
              </select>
            </div>

            {/* Address */}
            <div className="form-group col-span-2">
              <label>{isMr ? 'पत्ता व गाव' : 'Address / Village'}</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder={isMr ? 'उदा. मु.पो. सावळीविहीर बुद्रुक, राहाता' : 'e.g. Sawalivihir Bk, Rahata'}
              />
            </div>

            {/* Internal Notes */}
            <div className="form-group col-span-2">
              <label>{isMr ? 'कार्यालयीन टीप व नोंद' : 'Internal Notes'}</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                placeholder={isMr ? 'कार्यकर्त्याबाबत विशेष जबाबदारी किंवा नोंद...' : 'Special notes or area assignments...'}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {isMr ? 'रद्द करा' : 'Cancel'}
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={16} /> {submitting ? (isMr ? 'नोंदणी होत आहे...' : 'Saving...') : (isMr ? 'कार्यकर्ता जतन करा' : 'Save Worker')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KaryakartaFormModal;
