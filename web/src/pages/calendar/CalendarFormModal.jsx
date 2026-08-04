import { useState, useEffect } from 'react';
import { Calendar, X, AlertTriangle, Save } from 'lucide-react';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';

const EVENT_TYPES = [
  { value: 'MEETING', labelEn: 'Meeting', labelMr: 'बैठक', color: '#38bdf8' },
  { value: 'PUBLIC_PROGRAM', labelEn: 'Public Program', labelMr: 'सार्वजनिक कार्यक्रम', color: '#c084fc' },
  { value: 'GOVT_DEADLINE', labelEn: 'Govt Deadline', labelMr: 'शासकीय मुदत', color: '#f87171' },
  { value: 'ASSEMBLY_SESSION', labelEn: 'Assembly Session', labelMr: 'विधानसभा अधिवेशन', color: '#fb923c' },
  { value: 'CONSTITUENCY_VISIT', labelEn: 'Constituency Visit', labelMr: 'मतदारसंघ दौरा', color: '#4ade80' },
  { value: 'PERSONAL', labelEn: 'Personal / Other', labelMr: 'वैयक्तिक / इतर', color: '#94a3b8' },
];

const CalendarFormModal = ({ isOpen, onClose, onSuccess, initialDate }) => {
  const { lang } = useLangStore();
  const isMr = lang === 'MR';

  const [form, setForm] = useState({
    title: '',
    description: '',
    event_type: 'MEETING',
    event_date: initialDate || new Date().toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '12:00',
    location: '',
    reminder_minutes: '30',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      title: '',
      description: '',
      event_type: 'MEETING',
      event_date: initialDate || new Date().toISOString().split('T')[0],
      start_time: '10:00',
      end_time: '12:00',
      location: '',
      reminder_minutes: '30',
    });
    setError('');
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setError('');
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError(isMr ? 'कृपया कार्यक्रमाचे शीर्षक प्रविष्ट करा.' : 'Event title is required.');
      return;
    }
    if (!form.event_date) {
      setError(isMr ? 'कृपया तारीख निवडा.' : 'Date is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/calendar', form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Save calendar event error:', err);
      setError(err?.response?.data?.message || (isMr ? 'कार्यक्रम जतन करताना त्रुटी आली.' : 'Error saving event.'));
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
              <Calendar size={18} /> {isMr ? 'नवीन कार्यक्रम नोंदवा' : 'Schedule New Event'}
            </h3>
            <span className="modal-subtitle-en">
              {isMr ? 'बैठक, अधिवेशन, दौरा किंवा शासकीय मुदत जोडा' : 'Add Meeting, Assembly Session, Public Visit or Govt Deadline'}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="inward-form">
          {error && <div className="form-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} /> {error}</div>}

          <div className="form-grid">
            {/* Event Title */}
            <div className="form-group col-span-2">
              <label>{isMr ? 'कार्यक्रमाचे नाव / विषय' : 'Event Title'} <span className="req">*</span></label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder={isMr ? 'उदा. जिल्हा नियोजन समिती (DPDC) आढावा बैठक' : 'e.g. DPDC Review Meeting'}
                required
              />
            </div>

            {/* Event Type */}
            <div className="form-group">
              <label>{isMr ? 'कार्यक्रमाचा प्रकार' : 'Event Type'} <span className="req">*</span></label>
              <select name="event_type" value={form.event_type} onChange={handleChange} required>
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {isMr ? t.labelMr : t.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Date */}
            <div className="form-group">
              <label>{isMr ? 'तारीख' : 'Event Date'} <span className="req">*</span></label>
              <input
                type="date"
                name="event_date"
                value={form.event_date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Start Time */}
            <div className="form-group">
              <label>{isMr ? 'सुरुवातीची वेळ' : 'Start Time'}</label>
              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
              />
            </div>

            {/* End Time */}
            <div className="form-group">
              <label>{isMr ? 'शेवटची वेळ' : 'End Time'}</label>
              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
              />
            </div>

            {/* Location */}
            <div className="form-group col-span-2">
              <label>{isMr ? 'ठिकाण व पत्ता' : 'Location / Venue'}</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder={isMr ? 'उदा. जिल्हाधिकारी कार्यालय, अहमदनगर / आमदार कार्यालय' : 'e.g. Collector Office, Ahmednagar / MLA Office'}
              />
            </div>

            {/* Description */}
            <div className="form-group col-span-2">
              <label>{isMr ? 'सविस्तर मजकूर / टीप' : 'Description'}</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder={isMr ? 'बैठकीचे विषय, अजेंडा किंवा उपस्थित राहाणाऱ्या अधिकाऱ्यांची माहिती...' : 'Event details, agenda, or attendees...'}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {isMr ? 'रद्द करा' : 'Cancel'}
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Save size={16} /> {submitting ? (isMr ? 'जतन होत आहे...' : 'Saving...') : (isMr ? 'कार्यक्रम जतन करा' : 'Save Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarFormModal;
