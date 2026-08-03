// src/pages/karyakarta/KaryakartaListPage.jsx
// ============================================================
// Karyakarta Directory List Page — Module 10
// Upcoming birthdays widget, booth-level view (Booth Pramukh top), list view & bulk import
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import KaryakartaFormModal from './KaryakartaFormModal.jsx';
import KaryakartaImportModal from './KaryakartaImportModal.jsx';
import './KaryakartaListPage.css';

const DESIGNATION_CONFIG = {
  BOOTH_PRAMUKH: { mr: '👑 बूथ प्रमुख', bg: 'rgba(234, 179, 8, 0.2)', color: '#facc15', border: '1px solid #eab308' },
  WARD_HEAD: { mr: '🏛️ वॉर्ड प्रमुख', bg: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', border: '1px solid #38bdf8' },
  SHAKTI_KENDRA: { mr: '⚡ शक्ती केंद्र प्रमुख', bg: 'rgba(239, 68, 68, 0.18)', color: '#f87171', border: '1px solid #ef4444' },
  KARYAKARTA: { mr: '🚩 कार्यकर्ता', bg: 'rgba(34, 197, 94, 0.18)', color: '#4ade80', border: '1px solid #22c55e' },
  VOLUNTEER: { mr: '🤝 स्वयंसेवक', bg: 'rgba(168, 85, 247, 0.18)', color: '#c084fc', border: '1px solid #a855f7' },
  OTHER: { mr: '📌 इतर', bg: 'rgba(148, 163, 184, 0.18)', color: '#94a3b8', border: '1px solid #64748b' },
};

const KaryakartaListPage = () => {
  const [items, setItems] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [summary, setSummary] = useState({
    totalKaryakartas: 0,
    boothPramukhsCount: 0,
    shaktiKendraCount: 0,
  });
  const [meta, setMeta] = useState({ page: 1, limit: 20, totalItems: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // View state: 'LIST' or 'BOOTH'
  const [viewMode, setViewMode] = useState('LIST');

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    designation: 'ALL',
    booth_id: 'ALL',
    page: 1,
  });

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Fetch Karyakartas
  const fetchKaryakartas = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 20,
      };
      if (filters.search) params.search = filters.search;
      if (filters.designation !== 'ALL') params.designation = filters.designation;
      if (filters.booth_id !== 'ALL') params.booth_id = filters.booth_id;

      const { data } = await api.get('/karyakartas', { params });
      setItems(data.data || []);
      setSummary(data.summary || { totalKaryakartas: 0, boothPramukhsCount: 0, shaktiKendraCount: 0 });
      setMeta(data.meta || { page: 1, limit: 20, totalItems: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch karyakartas:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch Upcoming Birthdays
  const fetchBirthdays = useCallback(async () => {
    try {
      const { data } = await api.get('/karyakartas/birthdays');
      setBirthdays(data.data || []);
    } catch (err) {
      console.error('Failed to fetch upcoming birthdays:', err);
    }
  }, []);

  useEffect(() => {
    fetchKaryakartas();
    fetchBirthdays();
  }, [fetchKaryakartas, fetchBirthdays]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  // WhatsApp Birthday wish generator
  const sendWhatsAppWish = (karyakarta) => {
    const text = encodeURIComponent(
      `सस्नेह नमस्कार ${karyakarta.full_name}जी,\n\nआमदार कार्यालयाच्या वतीने आपणास वाढदिवसाच्या हार्दिक हार्दिक शुभेच्छा! 💐🎂\nआपणास उदंड आयुष्य व उत्तम आरोग्य लाभो हीच ईश्वरचरणी प्रार्थना!`
    );
    window.open(`https://wa.me/91${karyakarta.mobile}?text=${text}`, '_blank');
  };

  return (
    <div className="inward-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="inward-page-header">
        <div className="title-group">
          <h1 className="page-title-mr">🚩 कार्यकर्ता नोंदवही (Karyakarta Directory)</h1>
          <p className="page-subtitle">
            मतदारसंघातील सर्व ५,०००+ कार्यकर्ते, बूथ प्रमुख, शक्ती केंद्र प्रमुख व वाढदिवस ट्रॅकिंग
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={() => setIsImportOpen(true)} style={{ padding: '0.65rem 1.1rem' }}>
            📥 बल्क इन्पोर्ट Excel
          </button>
          <button className="create-inward-btn" onClick={() => setIsFormOpen(true)}>
            <span>➕</span>
            <span>नवीन कार्यकर्ता (Add Worker)</span>
          </button>
        </div>
      </div>

      {/* ── 🎂 Upcoming Birthdays Widget (Next 7 Days) ────────── */}
      {birthdays.length > 0 && (
        <div className="birthday-widget-banner">
          <div className="birthday-widget-header">
            <span className="birthday-icon">🎂</span>
            <div>
              <h3>या सप्ताहातील कार्यकर्त्यांचे वाढदिवस (Upcoming Birthdays - Next 7 Days)</h3>
              <p>वाढदिवस असलेल्या कार्यकर्त्यांना थेट WhatsApp वर शुभेच्छा पाठवा</p>
            </div>
          </div>

          <div className="birthday-cards-scroll">
            {birthdays.map((b) => {
              const desigCfg = DESIGNATION_CONFIG[b.designation] || DESIGNATION_CONFIG.KARYAKARTA;
              return (
                <div key={b.id} className="birthday-card">
                  <div className="birthday-avatar">👤</div>
                  <div className="birthday-info">
                    <span className="birthday-name">{b.full_name}</span>
                    <span className="birthday-sub">
                      {desigCfg.mr} | बूथ क्र. {b.booth_id || 101}
                    </span>
                    <span className="birthday-dob">📅 {b.date_of_birth}</span>
                  </div>

                  <button className="btn-whatsapp-wish" onClick={() => sendWhatsAppWish(b)}>
                    💬 WhatsApp शुभेच्छा
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Summary Stat Cards ─────────────────────────────── */}
      <div className="karyakarta-summary-grid">
        <div className="karyakarta-stat-card">
          <div className="stat-icon-box">👥</div>
          <div className="stat-info">
            <span className="stat-val">{summary.totalKaryakartas}</span>
            <span className="stat-lbl">एकूण नोंदणीकृत कार्यकर्ते (Total Karyakartas)</span>
          </div>
        </div>

        <div className="karyakarta-stat-card booth-pramukh-card">
          <div className="stat-icon-box">👑</div>
          <div className="stat-info">
            <span className="stat-val" style={{ color: '#facc15' }}>{summary.boothPramukhsCount}</span>
            <span className="stat-lbl">बूथ प्रमुख संख्या (Booth Pramukhs)</span>
          </div>
        </div>

        <div className="karyakarta-stat-card shakti-kendra-card">
          <div className="stat-icon-box">⚡</div>
          <div className="stat-info">
            <span className="stat-val" style={{ color: '#f87171' }}>{summary.shaktiKendraCount}</span>
            <span className="stat-lbl">शक्ती केंद्र प्रमुख (Shakti Kendra)</span>
          </div>
        </div>

        <div className="karyakarta-stat-card bday-card">
          <div className="stat-icon-box">🎂</div>
          <div className="stat-info">
            <span className="stat-val" style={{ color: '#c084fc' }}>{birthdays.length}</span>
            <span className="stat-lbl">या सप्ताहातील वाढदिवस (Birthdays)</span>
          </div>
        </div>
      </div>

      {/* ── View Switcher & Filter Bar ──────────────────────── */}
      <div className="inward-filter-bar karyakarta-filter-bar">
        <div className="filter-group search-group">
          <label>शोध (Search)</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="कार्यकर्त्याचे नाव, मोबाईल किंवा पत्ता शोधा..."
          />
        </div>

        <div className="filter-group">
          <label>पदनाम (Designation)</label>
          <select name="designation" value={filters.designation} onChange={handleFilterChange}>
            <option value="ALL">सर्व पदनामे (All Designations)</option>
            {Object.keys(DESIGNATION_CONFIG).map((k) => (
              <option key={k} value={k}>
                {DESIGNATION_CONFIG[k].mr}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>बूथ (Polling Booth)</label>
          <select name="booth_id" value={filters.booth_id} onChange={handleFilterChange}>
            <option value="ALL">सर्व बूथ (All Booths)</option>
            <option value="101">बूथ क्र. १०१ - सावळीविहीर बुद्रुक</option>
            <option value="102">बूथ क्र. १०२ - शिर्डी शहर</option>
            <option value="103">बूथ क्र. १०३ - अस्तगाव</option>
          </select>
        </div>

        <div className="view-mode-tabs">
          <button
            className={`view-tab-btn ${viewMode === 'LIST' ? 'active' : ''}`}
            onClick={() => setViewMode('LIST')}
          >
            📋 यादी दृष्टिक्षेप
          </button>
          <button
            className={`view-tab-btn ${viewMode === 'BOOTH' ? 'active' : ''}`}
            onClick={() => setViewMode('BOOTH')}
          >
            🗳️ बूथ प्रमुख दृष्टिक्षेप
          </button>
        </div>
      </div>

      {/* ── Data Table / Booth View ──────────────────────────── */}
      <div className="inward-table-card">
        {loading ? (
          <div className="table-loading-box">
            <div className="mini-spinner"></div>
            <p>कार्यकर्ते लोड होत आहेत...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="table-empty-box">
            <div className="empty-icon">🚩</div>
            <h3>कोणताही कार्यकर्ता सापडला नाही</h3>
            <p>कृपया शोध किंवा पदनाम बदलून पुन्हा प्रयत्न करा.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="inward-table">
              <thead>
                <tr>
                  <th>कार्यकर्त्याचे नाव (Karyakarta Name)</th>
                  <th>मोबाईल क्रमांक (Mobile)</th>
                  <th>पदनाम (Designation)</th>
                  <th>बूथ क्र. (Booth No.)</th>
                  <th>जन्मतारीख (Date of Birth)</th>
                  <th>पत्ता (Address)</th>
                  <th style={{ textAlign: 'right' }}>संपर्क (Action)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const desigCfg = DESIGNATION_CONFIG[item.designation] || DESIGNATION_CONFIG.KARYAKARTA;
                  const isBoothPramukh = item.designation === 'BOOTH_PRAMUKH';

                  return (
                    <tr
                      key={item.id}
                      className={isBoothPramukh ? 'row-booth-pramukh-highlight' : ''}
                    >
                      <td className="col-sender">
                        <div className="sender-name-primary">
                          {isBoothPramukh && <span style={{ marginRight: '0.35rem' }}>👑</span>}
                          {item.full_name}
                        </div>
                      </td>
                      <td className="col-inward-no">📱 {item.mobile}</td>
                      <td>
                        <span
                          className="designation-badge-pill"
                          style={{
                            backgroundColor: desigCfg.bg,
                            color: desigCfg.color,
                            border: desigCfg.border,
                          }}
                        >
                          {desigCfg.mr}
                        </span>
                      </td>
                      <td>
                        <span className="booth-tag-pill">🗳️ बूथ {item.booth_id || 101}</span>
                      </td>
                      <td>{item.date_of_birth ? `📅 ${item.date_of_birth}` : '—'}</td>
                      <td className="col-sender">{item.address || 'राहाता'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-whatsapp-wish"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={() => sendWhatsAppWish(item)}
                        >
                          💬 WhatsApp
                        </button>
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
      <KaryakartaFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchKaryakartas}
      />

      <KaryakartaImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={() => {
          fetchKaryakartas();
          fetchBirthdays();
        }}
      />
    </div>
  );
};

export default KaryakartaListPage;
