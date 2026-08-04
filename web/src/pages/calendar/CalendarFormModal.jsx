import { useState, useEffect } from 'react';
import { Calendar, X, AlertTriangle, Save } from 'lucide-react';
import api from '../../services/api.js';

const EVENT_TYPES = [
  { value: 'MEETING', labelMr: 'बैठक / मीटिंग (Meeting)', color: '#38bdf8' },
  { value: 'PUBLIC_PROGRAM', labelMr: 'सार्वजनिक कार्यक्रम (Public Program)', color: '#c084fc' },
  { value: 'GOVT_DEADLINE', labelMr: 'शासकीय मुदत / डेडलाइन (Govt Deadline)', color: '#f87171' },
  { value: 'ASSEMBLY_SESSION', labelMr: 'विधानसभा अधिवेशन (Assembly Session)', color: '#fb923c' },
  { value: 'CONSTITUENCY_VISIT', labelMr: 'मतदारसंघ दौरा (Constituency Visit)', color: '#4ade80' },
  { value: 'PERSONAL', labelMr: 'वैयक्तिक / इतर (Personal)', color: '#94a3b8' },
];

const CalendarFormModal = ({ isOpen, onClose, onSuccess, initialDate }) => {
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
      setError('कृपया कार्यक्रमाचे शीर्षक प्रविष्ट करा (Title is required)');
      return;
    }
    if (!form.event_date) {
      setError('कृपया तारीख निवडा (Date is required)');
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
      setError(err?.response?.data?.message || 'कार्यक्रम जतन करताना त्रुटी आली.');
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
              <Calendar size={18} /> नवीन कार्यक्रम / बैठक नोंदवा (Schedule Event)
            </h3>
            <span className="modal-subtitle-en">Add Meeting, Assembly Session, Public Visit or Govt Deadline</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="inward-form">
          {error && <div className="form-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} /> {error}</div>}

          <div className="form-grid">
            {/* Event Title */}
            <div className="form-group col-span-2">
              <label>कार्यक्रमाचे नाव / विषय (Event Title) <span className="req">*</span></label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="उदा. जिल्हा नियोजन समिती (DPDC) आढावा बैठक"
                required
              />
            </div>

            {/* Event Type */}
            <div className="form-group">
              <label>कार्यक्रमाचा प्रकार (Event Type) <span className="req">*</span></label>
              <select name="event_type" value={form.event_type} onChange={handleChange} required>
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.labelMr}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Date */}
            <div className="form-group">
              <label>तारीख (Event Date) <span className="req">*</span></label>
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
              <label>सुरुवातीची वेळ (Start Time)</label>
              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
              />
            </div>

            {/* End Time */}
            <div className="form-group">
              <label>शेवटची वेळ (End Time)</label>
              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
              />
            </div>

            {/* Location */}
            <div className="form-group col-span-2">
              <label>ठिकाण व पत्ता (Location / Venue)</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="उदा. जिल्हाधिकारी कार्यालय, अहमदनगर / आमदार कार्यालय"
              />
            </div>

            {/* Description */}
            <div className="form-group col-span-2">
              <label>सविस्तर मजकूर / टीप (Description)</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="बैठकीचे विषय, अजेंडा किंवा उपस्थित राहाणाऱ्या अधिकाऱ्यांची माहिती..."
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              रद्द करा (Cancel)
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Save size={16} /> {submitting ? 'जतन होत आहे...' : 'कार्यक्रम जतन करा (Save Event)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarFormModal;
