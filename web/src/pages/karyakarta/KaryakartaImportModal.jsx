import { useState } from 'react';
import { Upload, X, AlertTriangle, FileText, BarChart2 } from 'lucide-react';
import api from '../../services/api.js';

const SAMPLE_IMPORT_JSON = [
  {
    "full_name": "संतोष एकनाथ शिंदे",
    "mobile": "9822088771",
    "booth_id": 101,
    "designation": "बूथ प्रमुख",
    "date_of_birth": "1987-08-08",
    "address": "सावळीविहीर बुद्रुक, राहाता"
  },
  {
    "full_name": "रामदास मारुती पवार",
    "mobile": "9822088772",
    "booth_id": 102,
    "designation": "शक्ती केंद्र प्रमुख",
    "date_of_birth": "1991-05-12",
    "address": "शिर्डी शहर, राहाता"
  },
  {
    "full_name": "दत्तात्रय ज्ञानदेव कदम",
    "mobile": "9822088773",
    "booth_id": 101,
    "designation": "कार्यकर्ता",
    "date_of_birth": "1994-09-18",
    "address": "सावळीविहीर बुद्रुक"
  }
];

const KaryakartaImportModal = ({ isOpen, onClose, onSuccess }) => {
  const [jsonText, setJsonText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFillSample = () => {
    setJsonText(JSON.stringify(SAMPLE_IMPORT_JSON, null, 2));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');

    let parsedRows = [];
    try {
      parsedRows = JSON.parse(jsonText);
      if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
        setError('कृपया वैध JSON ॲरे प्रविष्ट करा (Valid JSON array of rows is required)');
        return;
      }
    } catch (err) {
      setError('अवैध JSON फॉरमॅट! कृपया डेटा पुन्हा तपासा. (Invalid JSON format)');
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await api.post('/karyakartas/import', { rows: parsedRows });
      const importStats = data.data || {};
      setResult(importStats);
      if (importStats.importedCount > 0) {
        onSuccess();
      }
    } catch (err) {
      console.error('Bulk import error:', err);
      setError(err?.response?.data?.message || 'बल्क इन्पोर्ट करताना त्रुटी आली.');
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
              <Upload size={18} /> बल्क कार्यकर्ता इन्पोर्ट (Bulk Import Excel / JSON)
            </h3>
            <span className="modal-subtitle-en">Import hundreds of karyakartas with mobile & booth validation</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="inward-form">
          {error && <div className="form-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16} /> {error}</div>}

          <div style={{ marginBottom: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Excel किंवा JSON मधील कार्यकर्त्यांची माहिती खालील बाक्समध्ये पेस्ट करा:
            </span>
            <button type="button" className="btn-secondary" onClick={handleFillSample} style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <FileText size={13} /> सॅम्पल डेटा भरा (Fill Sample)
            </button>
          </div>

          <div className="form-group col-span-2">
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={8}
              style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.5, background: '#0f172a', border: '1px solid #334155', color: '#38bdf8' }}
              placeholder="पेस्ट करा JSON ॲरे डेटा... [{ full_name: '...', mobile: '98220XXXXX', booth_id: 101, designation: 'बूथ प्रमुख' }]"
              required
            />
          </div>

          {/* Import Execution Result */}
          {result && (
            <div className="import-result-summary-box" style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '1rem', borderRadius: '10px', border: '1px solid #ff9933', marginTop: '1rem' }}>
              <h4 style={{ color: '#ff9933', margin: '0 0 0.5rem 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BarChart2 size={16} /> इन्पोर्ट रिपोर्ट (Import Results):
              </h4>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                <span style={{ color: '#f8fafc' }}>एकूण ओळी: <strong>{result.totalRows}</strong></span>
                <span style={{ color: '#4ade80' }}>यशस्वी जोडलेले: <strong>{result.importedCount}</strong></span>
                <span style={{ color: '#f87171' }}>वगळलेले/त्रुटी: <strong>{result.skippedCount}</strong></span>
              </div>

              {result.errors && result.errors.length > 0 && (
                <div style={{ marginTop: '0.75rem', maxHeight: '120px', overflowY: 'auto', background: '#0f172a', padding: '0.5rem', borderRadius: '6px', fontSize: '0.78rem', color: '#f87171' }}>
                  <strong>वगळलेल्या ओळींचे स्पष्टीकरण:</strong>
                  <ul>
                    {result.errors.map((err, idx) => (
                      <li key={idx}>ओळ {err.row} (मोबाईल: {err.mobile}): {err.error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              बंद करा (Close)
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Upload size={16} /> {submitting ? 'इन्पोर्ट होत आहे...' : 'बल्क इन्पोर्ट सुरू करा (Import)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KaryakartaImportModal;
