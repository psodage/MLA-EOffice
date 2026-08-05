import { useState, useEffect } from 'react';
import { Vote, X, Save } from 'lucide-react';
import useLangStore from '../../store/langStore.js';

const BoothFormModal = ({ isOpen, onClose, onSuccess, initialArea }) => {
  const { lang } = useLangStore();
  const isMr = lang === 'MR';

  const [form, setForm] = useState({
    booth_number: '',
    booth_name: '',
    location: '',
    taluka: 'Karveer Taluka',
    area_name: 'Uchgaon (Gram Panchayat)',
    pramukh_name: '',
    pramukh_mobile: '',
    total_voters: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialArea) {
      setForm((prev) => ({
        ...prev,
        area_name: initialArea,
      }));
    }
  }, [initialArea]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      onSuccess(form);
      onClose();
    }, 400);
  };

  return (
    <div className="nivedan-modal-overlay" onClick={onClose}>
      <div className="nivedan-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Vote size={18} /> {isMr ? 'नवीन मतदान केंद्र (बूथ) नोंदवा' : 'Add New Polling Booth'}
          </h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="nivedan-form-grid">
              <div className="nivedan-form-group">
                <label className="nivedan-form-label">
                  {isMr ? 'बूथ क्रमांक' : 'Booth Number'} <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="booth_number"
                  className="nivedan-form-input"
                  style={{ fontFamily: 'JetBrains Mono' }}
                  value={form.booth_number}
                  onChange={handleChange}
                  placeholder={isMr ? 'उदा. १४९' : 'e.g. 149'}
                  required
                />
              </div>

              <div className="nivedan-form-group">
                <label className="nivedan-form-label">
                  {isMr ? 'तालुका' : 'Taluka'}
                </label>
                <select
                  name="taluka"
                  className="nivedan-form-input"
                  value={form.taluka}
                  onChange={handleChange}
                >
                  <option value="Karveer Taluka">{isMr ? 'करवीर तालुका' : 'Karveer Taluka'}</option>
                  <option value="Kagal Taluka">{isMr ? 'कागल तालुका' : 'Kagal Taluka'}</option>
                  <option value="Radhanagari Taluka">{isMr ? 'राधानगरी तालुका' : 'Radhanagari Taluka'}</option>
                  <option value="Hatkanangale Taluka">{isMr ? 'हातकणंगले तालुका' : 'Hatkanangale Taluka'}</option>
                </select>
              </div>

              <div className="nivedan-form-group full">
                <label className="nivedan-form-label">
                  {isMr ? 'बूथचे नाव / केंद्र' : 'Booth Name / Location'} <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="booth_name"
                  className="nivedan-form-input"
                  value={form.booth_name}
                  onChange={handleChange}
                  placeholder={isMr ? 'उदा. जिल्हा परिषद प्राथमिक शाळा, उचगाव' : 'e.g. ZP Primary School, Uchgaon'}
                  required
                />
              </div>

              <div className="nivedan-form-group">
                <label className="nivedan-form-label">
                  {isMr ? 'बूथ प्रमुख नाव' : 'Booth Pramukh Name'}
                </label>
                <input
                  type="text"
                  name="pramukh_name"
                  className="nivedan-form-input"
                  value={form.pramukh_name}
                  onChange={handleChange}
                  placeholder={isMr ? 'उदा. आनंदा पाटील' : 'e.g. Ananda Patil'}
                />
              </div>

              <div className="nivedan-form-group">
                <label className="nivedan-form-label">
                  {isMr ? 'बूथ प्रमुख मोबाईल' : 'Pramukh Mobile'}
                </label>
                <input
                  type="text"
                  name="pramukh_mobile"
                  className="nivedan-form-input"
                  style={{ fontFamily: 'JetBrains Mono' }}
                  value={form.pramukh_mobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>

              <div className="nivedan-form-group">
                <label className="nivedan-form-label">
                  {isMr ? 'एकूण मतदार संख्या' : 'Total Voters'}
                </label>
                <input
                  type="number"
                  name="total_voters"
                  className="nivedan-form-input"
                  style={{ fontFamily: 'JetBrains Mono' }}
                  value={form.total_voters}
                  onChange={handleChange}
                  placeholder="उदा. 850"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={submitting}>
              {isMr ? 'रद्द करा' : 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Save size={16} /> {submitting ? (isMr ? 'नोंद होत आहे...' : 'Saving...') : (isMr ? 'बूथ जोडून सेव्ह करा' : 'Save Booth')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoothFormModal;
