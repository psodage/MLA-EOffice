// src/pages/nivedan/PublicTrackingPage.jsx
// ============================================================
// Public Unauthenticated Citizen Petition Tracking Portal
// Citizen enters mobile number -> Views all their petitions & progress
// ============================================================

import { useState } from 'react';
import NivedanStatusBadge from '../../components/nivedan/NivedanStatusBadge.jsx';
import api from '../../services/api.js';
import './PublicTrackingPage.css';

const PublicTrackingPage = () => {
  const [mobile, setMobile] = useState('');
  const [petitions, setPetitions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!mobile.trim() || mobile.trim().length < 10) {
      setError('कृपया १० अंकी वैध मोबाईल क्रमांक प्रविष्ट करा (Valid 10-digit mobile required)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.get(`/nivedans/track/${mobile.trim()}`);
      setPetitions(data.data || []);
      setSearched(true);
    } catch (err) {
      console.error('Public tracking error:', err);
      setError(err?.response?.data?.message || 'माहिती मिळवताना त्रुटी आली.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-tracking-container">
      <div className="public-tracking-card">
        {/* Header */}
        <div className="portal-header">
          <div className="header-emblem">🏛️</div>
          <h2>आमदार कार्यालय राहाता • नागरिक तक्रार ट्रॅकिंग</h2>
          <p>तुमच्या अर्जाची सद्यस्थिती व प्रगती पाहण्यासाठी तुमचा १० अंकी मोबाईल नंबर टाका</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mobile-search-form">
          <div className="search-input-wrapper">
            <span className="input-prefix">📱 +91</span>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="तुमचा मोबाईल नंबर प्रविष्ट करा..."
              maxLength={10}
              required
            />
            <button type="submit" className="btn-track-submit" disabled={loading}>
              {loading ? 'शोधत आहे...' : '🔍 स्थिती पहा (Track)'}
            </button>
          </div>
          {error && <div className="tracking-error">{error}</div>}
        </form>

        {/* Results View */}
        {searched && (
          <div className="tracking-results-area">
            <h3>📋 आपल्या मोबाईलवर नोंदवलेली निवेदने ({petitions?.length || 0})</h3>

            {petitions && petitions.length > 0 ? (
              <div className="petitions-cards-list">
                {petitions.map((item) => (
                  <div key={item.id} className="citizen-petition-card">
                    <div className="card-top-row">
                      <span className="citizen-tracking-id">{item.tracking_id}</span>
                      <NivedanStatusBadge status={item.status} />
                    </div>

                    <h4 className="citizen-subject">{item.subject}</h4>
                    <p className="citizen-desc">{item.description}</p>

                    <div className="citizen-meta-grid">
                      <div><strong>वर्गवारी:</strong> {item.category?.name_mr || '—'}</div>
                      <div><strong>संबंधित विभाग:</strong> {item.forwardedDepartment?.name_mr || '—'}</div>
                      <div><strong>दिनांक:</strong> {new Date(item.created_at).toLocaleDateString('mr-IN')}</div>
                    </div>

                    {/* Timeline Log View */}
                    {item.timeline && item.timeline.length > 0 && (
                      <div className="citizen-timeline-box">
                        <h5>📜 प्रगती अहवाल (Progress Updates):</h5>
                        <ul>
                          {item.timeline.map((t) => (
                            <li key={t.id}>
                              <span className="t-date">{new Date(t.created_at).toLocaleDateString('mr-IN')}</span>
                              <span className="t-note">{t.note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-records-box">
                <div className="no-records-icon">🔍</div>
                <h4>कोणतीही नोंद सापडली नाही</h4>
                <p>या मोबाईल नंबरवर कोणतेही प्रलंबित किंवा पूर्ण झालेले निवेदन नोंदवलेले नाही.</p>
              </div>
            )}
          </div>
        )}

        <div className="portal-footer">
          <p>मदत किंवा अडचणीसाठी संपर्क: आमदार कार्यालय, राहाता • मो. ९८२२० XXXXX</p>
        </div>
      </div>
    </div>
  );
};

export default PublicTrackingPage;
