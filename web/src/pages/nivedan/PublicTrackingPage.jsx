import { useState, useEffect } from 'react';
import { Sun, Moon, Globe, Flag, Landmark, Search, FileText, Scroll, Phone, AlertCircle } from 'lucide-react';
import useLangStore from '../../store/langStore.js';
import NivedanStatusBadge from '../../components/nivedan/NivedanStatusBadge.jsx';
import api from '../../services/api.js';
import './PublicTrackingPage.css';

const t = {
  EN: {
    title: 'MLA Office Rahata • Public Complaint Tracking',
    subtitle: 'Enter your 10-digit mobile number to view the status and progress of your petitions',
    mobilePlaceholder: 'Enter your 10-digit mobile number...',
    mobilePrefix: '+91',
    searchBtn: 'Track Status',
    searching: 'Searching...',
    errInvalidMobile: 'Please enter a valid 10-digit mobile number',
    errFetch: 'Failed to fetch information. Please try again.',
    resultsHeading: (count) => `Petitions registered with your mobile number (${count})`,
    category: 'Category',
    department: 'Department',
    date: 'Date',
    timelineHeader: 'Progress Updates',
    noRecordsTitle: 'No Records Found',
    noRecordsText: 'No pending or completed petitions were found for this mobile number.',
    footerHelp: 'For assistance or queries contact: MLA Office, Rahata • Mob. +91 98220 XXXXX',
  },
  MR: {
    title: 'आमदार कार्यालय राहाता • नागरिक तक्रार ट्रॅकिंग',
    subtitle: 'तुमच्या अर्जाची सद्यस्थिती व प्रगती पाहण्यासाठी तुमचा १० अंकी मोबाईल नंबर टाका',
    mobilePlaceholder: 'तुमचा मोबाईल नंबर प्रविष्ट करा...',
    mobilePrefix: '+91',
    searchBtn: 'स्थिती पहा',
    searching: 'शोधत आहे...',
    errInvalidMobile: 'कृपया १० अंकी वैध मोबाईल क्रमांक प्रविष्ट करा',
    errFetch: 'माहिती मिळवताना त्रुटी आली.',
    resultsHeading: (count) => `आपल्या मोबाईलवर नोंदवलेली निवेदने (${count})`,
    category: 'वर्गवारी',
    department: 'संबंधित विभाग',
    date: 'दिनांक',
    timelineHeader: 'प्रगती अहवाल',
    noRecordsTitle: 'कोणतीही नोंद सापडली नाही',
    noRecordsText: 'या मोबाईल नंबरवर कोणतेही प्रलंबित किंवा पूर्ण झालेले निवेदन नोंदवलेले नाही.',
    footerHelp: 'मदत किंवा अडचणीसाठी संपर्क: आमदार कार्यालय, राहाता • मो. ९८२२० XXXXX',
  },
};

const PublicTrackingPage = () => {
  const [mobile, setMobile] = useState('');
  const [petitions, setPetitions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('mla_theme') || 'light');
  const { lang, setLang } = useLangStore();

  const text = t[lang] || t.EN;

  // Sync theme attribute on documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mla_theme', theme);
  }, [theme]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!mobile.trim() || mobile.trim().length < 10) {
      setError(text.errInvalidMobile);
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
      setError(err?.response?.data?.message || text.errFetch);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-tracking-container">
      {/* ── Segmented Controls Header ── */}
      <div className="public-header-toggles">
        <div className="segmented-switch">
          <button
            type="button"
            className={theme === 'light' ? 'active' : ''}
            onClick={() => setTheme('light')}
            aria-label="Light Theme"
          >
            <Sun size={14} /> Light
          </button>
          <button
            type="button"
            className={theme === 'dark' ? 'active' : ''}
            onClick={() => setTheme('dark')}
            aria-label="Dark Theme"
          >
            <Moon size={14} /> Dark
          </button>
        </div>

        <div className="segmented-switch" title="भाषा बदला / Change Language">
          <button
            type="button"
            className={lang === 'EN' ? 'active' : ''}
            onClick={() => setLang('EN')}
            aria-label="English Language"
            title="English"
          >
            <Globe size={14} /> EN
          </button>
          <button
            type="button"
            className={lang === 'MR' ? 'active' : ''}
            onClick={() => setLang('MR')}
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            aria-label="Marathi Language"
            title="मराठी (Marathi)"
          >
            <Flag size={14} /> मराठी
          </button>
        </div>
      </div>

      <div className="public-tracking-card">
        {/* Header */}
        <div className="portal-header">
          <div className="header-emblem"><Landmark size={32} /></div>
          <h2>{text.title}</h2>
          <p>{text.subtitle}</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mobile-search-form">
          <div className="search-input-wrapper">
            <span className="input-prefix" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={14} /> {text.mobilePrefix}
            </span>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder={text.mobilePlaceholder}
              maxLength={10}
              required
            />
            <button type="submit" className="btn-track-submit" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Search size={16} /> {loading ? text.searching : text.searchBtn}
            </button>
          </div>
          {error && <div className="tracking-error" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={16} /> {error}</div>}
        </form>

        {/* Results View */}
        {searched && (
          <div className="tracking-results-area">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={18} /> {text.resultsHeading(petitions?.length || 0)}
            </h3>

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
                      <div>
                        <strong>{text.category}:</strong>{' '}
                        {lang === 'MR'
                          ? item.category?.name_mr || item.category?.name_en || '—'
                          : item.category?.name_en || item.category?.name_mr || '—'}
                      </div>
                      <div>
                        <strong>{text.department}:</strong>{' '}
                        {lang === 'MR'
                          ? item.forwardedDepartment?.name_mr || item.forwardedDepartment?.name_en || '—'
                          : item.forwardedDepartment?.name_en || item.forwardedDepartment?.name_mr || '—'}
                      </div>
                      <div>
                        <strong>{text.date}:</strong>{' '}
                        {new Date(item.created_at).toLocaleDateString(lang === 'MR' ? 'mr-IN' : 'en-US')}
                      </div>
                    </div>

                    {/* Timeline Log View */}
                    {item.timeline && item.timeline.length > 0 && (
                      <div className="citizen-timeline-box">
                        <h5 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Scroll size={14} /> {text.timelineHeader}:
                        </h5>
                        <ul>
                          {item.timeline.map((tm) => (
                            <li key={tm.id}>
                              <span className="t-date">
                                {new Date(tm.created_at).toLocaleDateString(lang === 'MR' ? 'mr-IN' : 'en-US')}
                              </span>
                              <span className="t-note">{tm.note}</span>
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
                <div className="no-records-icon"><Search size={32} /></div>
                <h4>{text.noRecordsTitle}</h4>
                <p>{text.noRecordsText}</p>
              </div>
            )}
          </div>
        )}

        <div className="portal-footer">
          <p>{text.footerHelp}</p>
        </div>
      </div>
    </div>
  );
};

export default PublicTrackingPage;
