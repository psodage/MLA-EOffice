// src/pages/visitors/VisitorListPage.jsx
// ============================================================
// Visitor Book List Page — Module 8
// Daily visitor summary widgets, repeat visitor badges, check-out action & Nivedan conversion
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import VisitorCheckInModal from './VisitorCheckInModal.jsx';
import ConvertToNivedanModal from './ConvertToNivedanModal.jsx';
import './VisitorListPage.css';

const PURPOSE_LABELS = {
  GRIEVANCE: { mr: 'तक्रार / निवेदन', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  COURTESY_CALL: { mr: 'शुभेच्छा भेट', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
  PARTY_WORK: { mr: 'पक्ष कार्य', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  INVITATION: { mr: 'निमंत्रण', color: '#c084fc', bg: 'rgba(168, 85, 247, 0.15)' },
  PERSONAL_MEETING: { mr: 'वैयक्तिक भेट', color: '#4ade80', bg: 'rgba(34, 197, 94, 0.15)' },
  DOCUMENT_SUBMISSION: { mr: 'कागदपत्रे सादर', color: '#fb923c', bg: 'rgba(249, 115, 22, 0.15)' },
  FOLLOWUP: { mr: 'पाठपुरावा', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.15)' },
  RECOMMENDATION: { mr: 'शिफारस', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
  GENERAL_INQUIRY: { mr: 'सामान्य चौकशी', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
  OTHER: { mr: 'इतर', color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.15)' },
};

const VisitorListPage = () => {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    totalVisitorsToday: 0,
    currentlyInOffice: 0,
    repeatVisitorsCount: 0,
    convertedCount: 0,
  });
  const [meta, setMeta] = useState({ page: 1, limit: 20, totalItems: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [checkingOutId, setCheckingOutId] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    purpose: 'ALL',
    date: new Date().toISOString().split('T')[0],
    page: 1,
  });

  // Modal State
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [selectedForConvert, setSelectedForConvert] = useState(null);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 20,
      };
      if (filters.search) params.search = filters.search;
      if (filters.purpose !== 'ALL') params.purpose = filters.purpose;
      if (filters.date) params.date = filters.date;

      const { data } = await api.get('/visitors', { params });
      setItems(data.data || []);
      setSummary(data.summary || { totalVisitorsToday: 0, currentlyInOffice: 0, repeatVisitorsCount: 0, convertedCount: 0 });
      setMeta(data.meta || { page: 1, limit: 20, totalItems: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch visitors:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleCheckOut = async (visitorId) => {
    setCheckingOutId(visitorId);
    try {
      await api.patch(`/visitors/${visitorId}/checkout`);
      fetchVisitors();
    } catch (err) {
      alert(err?.response?.data?.message || 'चेक-आऊट करताना त्रुटी आली.');
    } finally {
      setCheckingOutId(null);
    }
  };

  const openConvertModal = (visitor) => {
    setSelectedForConvert(visitor);
    setIsConvertOpen(true);
  };

  return (
    <div className="inward-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="inward-page-header">
        <div className="title-group">
          <h1 className="page-title-mr">👥 नागरिक भेट नोंद (Visitor Book)</h1>
          <p className="page-subtitle">
            आमदार कार्यालयात दररोज भेट देणाऱ्या नागरिकांचे डिजिटल रजिस्टर व पुनरावृत्ती भेट ट्रॅकिंग
          </p>
        </div>

        <button className="create-inward-btn" onClick={() => setIsCheckInOpen(true)}>
          <span>🚪</span>
          <span>नवीन भेट नोंद (Check-In Visitor)</span>
        </button>
      </div>

      {/* ── Today Summary Widget Cards ─────────────────────── */}
      <div className="visitor-summary-grid">
        <div className="visitor-stat-card">
          <div className="stat-icon-box">👥</div>
          <div className="stat-info">
            <span className="stat-val">{summary.totalVisitorsToday}</span>
            <span className="stat-lbl">आजचे एकूण नागरिक भेट (Total Visitors)</span>
          </div>
        </div>

        <div className="visitor-stat-card active-in-office">
          <div className="stat-icon-box">🏢</div>
          <div className="stat-info">
            <span className="stat-val">{summary.currentlyInOffice}</span>
            <span className="stat-lbl">सध्या कार्यालयात उपस्थित (In Office)</span>
          </div>
        </div>

        <div className="visitor-stat-card repeat-visitors">
          <div className="stat-icon-box">🔁</div>
          <div className="stat-info">
            <span className="stat-val">{summary.repeatVisitorsCount}</span>
            <span className="stat-lbl">पुनरावृत्ती भेट देणारे (Repeat Visitors)</span>
          </div>
        </div>

        <div className="visitor-stat-card converted-nivedan">
          <div className="stat-icon-box">📋</div>
          <div className="stat-info">
            <span className="stat-val">{summary.convertedCount}</span>
            <span className="stat-lbl">निवेदनात रूपांतरित (Converted)</span>
          </div>
        </div>
      </div>

      {/* ── Search & Date Filter Bar ────────────────────────── */}
      <div className="inward-filter-bar visitor-filter-bar">
        <div className="filter-group search-group">
          <label>शोध (Search)</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="नागरिकाचे नाव, मोबाईल किंवा भेटण्याचे कारण शोधा..."
          />
        </div>

        <div className="filter-group">
          <label>भेटण्याचे कारण (Purpose)</label>
          <select name="purpose" value={filters.purpose} onChange={handleFilterChange}>
            <option value="ALL">सर्व कारणे (All Purposes)</option>
            {Object.keys(PURPOSE_LABELS).map((key) => (
              <option key={key} value={key}>
                {PURPOSE_LABELS[key].mr}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>दिनांक (Date)</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-actions">
          <button
            className="reset-filter-btn"
            onClick={() => setFilters({ search: '', purpose: 'ALL', date: new Date().toISOString().split('T')[0], page: 1 })}
          >
            🔄 आजची नोंद (Today)
          </button>
        </div>
      </div>

      {/* ── Data Table ─────────────────────────────────────── */}
      <div className="inward-table-card">
        {loading ? (
          <div className="table-loading-box">
            <div className="mini-spinner"></div>
            <p>भेट नोंद लोड होत आहे...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="table-empty-box">
            <div className="empty-icon">👥</div>
            <h3>या दिवशी कोणतीही भेट नोंद सापडली नाही</h3>
            <p>कृपया तारीख किंवा शोध पर्याय बदलून पहा.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="inward-table">
              <thead>
                <tr>
                  <th>वेळ (Check-In Time)</th>
                  <th>भेट देणारे नागरिक व मोबाईल (Visitor)</th>
                  <th>पुनरावृत्ती भेट (Visits)</th>
                  <th>पत्ता (Address)</th>
                  <th>भेटण्याचे कारण (Purpose)</th>
                  <th>चेक-आऊट (Check-Out)</th>
                  <th style={{ textAlign: 'right' }}>कृती (Action)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const purposeCfg = PURPOSE_LABELS[item.purpose] || PURPOSE_LABELS.OTHER;
                  const inTimeStr = new Date(item.check_in_time).toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' });
                  const outTimeStr = item.check_out_time
                    ? new Date(item.check_out_time).toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })
                    : null;

                  return (
                    <tr key={item.id}>
                      <td className="col-inward-no">⏱️ {inTimeStr}</td>
                      <td className="col-sender">
                        <div className="sender-name-primary">{item.visitor_name}</div>
                        <span className="mobile-sub">📱 {item.mobile}</span>
                      </td>
                      <td>
                        {item.is_repeat_visitor ? (
                          <span className="repeat-badge-pill" title={`यापूर्वी ${item.previous_visit_count} वेळा भेट`}>
                            🔁 {item.previous_visit_count}री वेळ
                          </span>
                        ) : (
                          <span className="new-visitor-pill">✨ पहिली भेट</span>
                        )}
                      </td>
                      <td className="col-sender">{item.address_line || 'राहाता'}</td>
                      <td className="col-subject">
                        <span className="purpose-pill" style={{ backgroundColor: purposeCfg.bg, color: purposeCfg.color }}>
                          {purposeCfg.mr}
                        </span>
                        {item.purpose_description && (
                          <div className="purpose-desc-line">{item.purpose_description}</div>
                        )}
                      </td>
                      <td>
                        {outTimeStr ? (
                          <span className="checked-out-time-tag">🚪 बाहेर: {outTimeStr}</span>
                        ) : (
                          <button
                            className="btn-checkout-action"
                            onClick={() => handleCheckOut(item.id)}
                            disabled={checkingOutId === item.id}
                          >
                            {checkingOutId === item.id ? 'नोंद होत आहे...' : '🚪 चेक-आऊट करा'}
                          </button>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {item.linked_nivedan_id ? (
                          <span className="linked-nivedan-tag">✓ निवेदनात नोंदवलेले</span>
                        ) : item.purpose === 'GRIEVANCE' ? (
                          <button
                            className="table-action-btn btn-view"
                            onClick={() => openConvertModal(item)}
                          >
                            📋 निवेदनात रूपांतर करा
                          </button>
                        ) : (
                          <span className="unassigned-text">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && meta.totalPages > 1 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              एकूण {meta.totalItems} पैकी पान {meta.page}
            </span>

            <div className="pagination-controls">
              <button
                className="page-btn"
                disabled={meta.page <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
              >
                ← मागील
              </button>
              <span className="current-page-num">{meta.page}</span>
              <button
                className="page-btn"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
              >
                पुढील →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ─────────────────────────────────────────── */}
      <VisitorCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSuccess={fetchVisitors}
      />

      <ConvertToNivedanModal
        isOpen={isConvertOpen}
        onClose={() => setIsConvertOpen(false)}
        visitor={selectedForConvert}
        onSuccess={fetchVisitors}
      />
    </div>
  );
};

export default VisitorListPage;
