// src/pages/devworks/DevWorksListPage.jsx
// ============================================================
// Development Works List Page — Module 9
// Financial summary cards, category/funding filters, progress gauges & photo gallery
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import DevWorkFormModal from './DevWorkFormModal.jsx';
import DevWorkDetailModal from './DevWorkDetailModal.jsx';
import './DevWorksListPage.css';

const CATEGORY_LABELS = {
  ROAD: 'रस्ते / पूल',
  DRAINAGE: 'गटारे / सांडपाणी',
  WATER_PIPELINE: 'पाणीपुरवठा',
  HOSPITAL: 'रुग्णालय / आरोग्य',
  SCHOOL: 'शाळा / शिक्षण',
  COMMUNITY_HALL: 'समाजमंदिर',
  STREET_LIGHT: 'रस्त्यावरील दिवे',
  ELECTRIFICATION: 'विद्युतीकरण',
  GARDEN_PARK: 'उद्यान / पार्क',
  OTHER: 'इतर',
};

const STATUS_CONFIG = {
  SANCTIONED: { mr: 'मंजूर (Sanctioned)', bg: 'rgba(245, 158, 11, 0.18)', color: '#fbbf24' },
  IN_PROGRESS: { mr: 'प्रगतीपथावर', bg: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8' },
  COMPLETED: { mr: 'पूर्ण (Completed)', bg: 'rgba(34, 197, 94, 0.18)', color: '#4ade80' },
  DELAYED: { mr: 'विलंबित (Delayed)', bg: 'rgba(239, 68, 68, 0.18)', color: '#f87171' },
  CANCELLED: { mr: 'रद्द (Cancelled)', bg: 'rgba(148, 163, 184, 0.18)', color: '#94a3b8' },
};

const DevWorksListPage = () => {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    totalProjects: 0,
    completedCount: 0,
    inProgressCount: 0,
    totalBudgetAllocated: 0,
    totalBudgetSpent: 0,
  });
  const [meta, setMeta] = useState({ page: 1, limit: 20, totalItems: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filter State
  const [filters, setFilters] = useState({
    search: '',
    category: 'ALL',
    status: 'ALL',
    funding_source: 'ALL',
    page: 1,
  });

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedForDetail, setSelectedForDetail] = useState(null);

  const fetchDevWorks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 20,
      };
      if (filters.search) params.search = filters.search;
      if (filters.category !== 'ALL') params.category = filters.category;
      if (filters.status !== 'ALL') params.status = filters.status;
      if (filters.funding_source !== 'ALL') params.funding_source = filters.funding_source;

      const { data } = await api.get('/devworks', { params });
      setItems(data.data || []);
      setSummary(data.summary || { totalProjects: 0, completedCount: 0, inProgressCount: 0, totalBudgetAllocated: 0, totalBudgetSpent: 0 });
      setMeta(data.meta || { page: 1, limit: 20, totalItems: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch devworks list:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDevWorks();
  }, [fetchDevWorks]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'ALL',
      status: 'ALL',
      funding_source: 'ALL',
      page: 1,
    });
  };

  const openDetailModal = (item) => {
    setSelectedForDetail(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="inward-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="inward-page-header">
        <div className="title-group">
          <h1 className="page-title-mr">🏗️ विकासकामे व पायाभूत सुविधा (Development Works)</h1>
          <p className="page-subtitle">
            मतदारसंघातील विकासकामे, अर्थसंकल्प ट्रॅकिंग, प्रगती टक्केवारी व जिओटॅग फोटो गॅलरी
          </p>
        </div>

        <button className="create-inward-btn" onClick={() => setIsFormOpen(true)}>
          <span>➕</span>
          <span>नवीन विकासकाम नोंदवा (Add Project)</span>
        </button>
      </div>

      {/* ── Financial Summary Stat Cards ───────────────────── */}
      <div className="devworks-summary-grid">
        <div className="devworks-stat-card">
          <div className="stat-icon-box">💰</div>
          <div className="stat-info">
            <span className="stat-val" style={{ color: '#4ade80' }}>
              ₹ {(summary.totalBudgetAllocated / 100000).toFixed(2)} लाख
            </span>
            <span className="stat-lbl">एकूण मंजूर अर्थसंकल्प (Sanctioned Budget)</span>
          </div>
        </div>

        <div className="devworks-stat-card spent-card">
          <div className="stat-icon-box">💸</div>
          <div className="stat-info">
            <span className="stat-val" style={{ color: '#fb923c' }}>
              ₹ {(summary.totalBudgetSpent / 100000).toFixed(2)} लाख
            </span>
            <span className="stat-lbl">एकूण खर्च झालेली रक्कम (Spent Budget)</span>
          </div>
        </div>

        <div className="devworks-stat-card ongoing-card">
          <div className="stat-icon-box">🏗️</div>
          <div className="stat-info">
            <span className="stat-val" style={{ color: '#38bdf8' }}>
              {summary.inProgressCount}
            </span>
            <span className="stat-lbl">प्रगतीपथावरील प्रकल्प (In Progress)</span>
          </div>
        </div>

        <div className="devworks-stat-card completed-card">
          <div className="stat-icon-box">✅</div>
          <div className="stat-info">
            <span className="stat-val" style={{ color: '#a855f7' }}>
              {summary.completedCount}
            </span>
            <span className="stat-lbl">पूर्ण झालेले प्रकल्प (Completed)</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Bar ─────────────────────────────── */}
      <div className="inward-filter-bar devworks-filter-bar">
        <div className="filter-group search-group">
          <label>शोध (Search)</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="प्रकल्पाचे नाव, ठिकाण किंवा ठेकेदार शोधा..."
          />
        </div>

        <div className="filter-group">
          <label>प्रकार (Category)</label>
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="ALL">सर्व प्रकार (All Categories)</option>
            {Object.keys(CATEGORY_LABELS).map((k) => (
              <option key={k} value={k}>
                {CATEGORY_LABELS[k]}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>निधीचा स्रोत (Funding)</label>
          <select name="funding_source" value={filters.funding_source} onChange={handleFilterChange}>
            <option value="ALL">सर्व निधी (All Funding)</option>
            <option value="MLALAD">आमदार निधी (MLALAD)</option>
            <option value="ZP_FUND">जिल्हा परिषद निधी (ZP)</option>
            <option value="STATE_GRANT">राज्य शासन अनुदान</option>
            <option value="CENTRAL_GRANT">केंद्र शासन अनुदान</option>
          </select>
        </div>

        <div className="filter-group">
          <label>स्थिती (Status)</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="ALL">सर्व स्थिती (All Status)</option>
            <option value="SANCTIONED">SANCTIONED (मंजूर)</option>
            <option value="IN_PROGRESS">IN_PROGRESS (प्रगतीपथावर)</option>
            <option value="COMPLETED">COMPLETED (पूर्ण)</option>
            <option value="DELAYED">DELAYED (विलंबित)</option>
          </select>
        </div>

        <div className="filter-actions">
          <button className="reset-filter-btn" onClick={handleResetFilters}>
            🔄 रिसेट
          </button>
        </div>
      </div>

      {/* ── Data Table ─────────────────────────────────────── */}
      <div className="inward-table-card">
        {loading ? (
          <div className="table-loading-box">
            <div className="mini-spinner"></div>
            <p>विकासकामे लोड होत आहेत...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="table-empty-box">
            <div className="empty-icon">🏗️</div>
            <h3>कोणतेही विकासकाम सापडले नाही</h3>
            <p>कृपया शोध किंवा फिल्टर बदलून पुन्हा प्रयत्न करा.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="inward-table">
              <thead>
                <tr>
                  <th>प्रकल्पाचे नाव व ठिकाण (Project & Location)</th>
                  <th>प्रकार (Category)</th>
                  <th>निधी स्रोत (Funding)</th>
                  <th>अर्थसंकल्प खर्च / मंजूर (Budget Spent)</th>
                  <th>प्रगती % (Progress)</th>
                  <th>स्थिती (Status)</th>
                  <th style={{ textAlign: 'right' }}>कृती (Action)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const allocLakhs = (Number(item.budget_allocated) / 100000).toFixed(2);
                  const spentLakhs = (Number(item.budget_spent) / 100000).toFixed(2);
                  const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.SANCTIONED;
                  const catLabel = CATEGORY_LABELS[item.category] || item.category;

                  return (
                    <tr key={item.id} onClick={() => openDetailModal(item)} className="table-row-interactive">
                      <td className="col-subject">
                        <div className="sender-name-primary">{item.project_name}</div>
                        <div className="mobile-sub">📍 {item.location}</div>
                      </td>
                      <td>
                        <span className="category-pill">{catLabel}</span>
                      </td>
                      <td>
                        <span className="funding-pill">🏛️ {item.funding_source}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                          ₹ {spentLakhs} L / ₹ {allocLakhs} L
                        </div>
                      </td>
                      <td style={{ width: '140px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="table-progress-bar-bg">
                            <div
                              className="table-progress-bar-fill"
                              style={{ width: `${Math.min(item.progress_percentage || 0, 100)}%` }}
                            />
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ff9933' }}>
                            {item.progress_percentage || 0}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className="devwork-status-badge"
                          style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                        >
                          {statusCfg.mr}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="table-action-btn btn-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailModal(item);
                          }}
                        >
                          📊 प्रगती व फोटो
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
      <DevWorkFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchDevWorks}
      />

      <DevWorkDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        entry={selectedForDetail}
        onUpdateSuccess={fetchDevWorks}
      />
    </div>
  );
};

export default DevWorksListPage;
