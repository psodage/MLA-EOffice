// src/pages/nivedan/NivedanListPage.jsx
// ============================================================
// Nivedan List Page — Module 7 (⭐ Core Module)
// Tabbed status navigation, multi-field filters, table view
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import NivedanStatusBadge from '../../components/nivedan/NivedanStatusBadge.jsx';
import PriorityBadge from '../../components/inward/PriorityBadge.jsx';
import NivedanFormModal from './NivedanFormModal.jsx';
import NivedanDetailModal from './NivedanDetailModal.jsx';
import './NivedanListPage.css';

const STATUS_TABS = [
  { id: 'ALL', labelMr: 'सर्व निवेदने', labelEn: 'All Petitions', icon: '📁' },
  { id: 'PENDING', labelMr: 'प्रलंबित', labelEn: 'Pending', icon: '🟡' },
  { id: 'IN_PROGRESS', labelMr: 'प्रगतीपथावर', labelEn: 'In Progress', icon: '🔵' },
  { id: 'FORWARDED', labelMr: 'पाठवलेले', labelEn: 'Forwarded', icon: '🟠' },
  { id: 'ESCALATED', labelMr: 'कालावधी उलटलेले', labelEn: 'Escalated', icon: '⚠️' },
  { id: 'RESOLVED', labelMr: 'पूर्ण / मार्गस्थ', labelEn: 'Resolved', icon: '🟢' },
];

const NivedanListPage = () => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, totalItems: 0, totalPages: 1 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    status: 'ALL',
    search: '',
    categoryId: 'ALL',
    priority: 'ALL',
    startDate: '',
    endDate: '',
    page: 1,
  });

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedForDetail, setSelectedForDetail] = useState(null);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/nivedans/categories');
        setCategories(data.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Nivedan List
  const fetchNivedans = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 20,
      };
      if (filters.status !== 'ALL') params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.categoryId !== 'ALL') params.categoryId = filters.categoryId;
      if (filters.priority !== 'ALL') params.priority = filters.priority;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const { data } = await api.get('/nivedans', { params });
      setItems(data.data || []);
      setMeta(data.meta || { page: 1, limit: 20, totalItems: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch nivedans:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchNivedans();
  }, [fetchNivedans]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleTabChange = (statusId) => {
    setFilters((prev) => ({ ...prev, status: statusId, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'ALL',
      search: '',
      categoryId: 'ALL',
      priority: 'ALL',
      startDate: '',
      endDate: '',
      page: 1,
    });
  };

  const openDetailModal = (entry) => {
    setSelectedForDetail(entry);
    setIsDetailOpen(true);
  };

  return (
    <div className="inward-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="inward-page-header">
        <div className="title-group">
          <h1 className="page-title-mr">📋 निवेदने व तक्रारी (Petitions & Grievances)</h1>
          <p className="page-subtitle">
            आमदार कार्यालयातील सर्व नागरिक अर्ज, तक्रारी, पाठपुरावा व ऑटो-रूटिंग प्रणाली
          </p>
        </div>

        <button className="create-inward-btn" onClick={() => setIsFormOpen(true)}>
          <span>➕</span>
          <span>नवीन निवेदन नोंदवा (Register Petition)</span>
        </button>
      </div>

      {/* ── Status Tabbed Navigation ────────────────────────── */}
      <div className="status-tabs-container">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`status-tab-btn ${filters.status === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label-mr">{tab.labelMr}</span>
            <span className="tab-label-en">({tab.labelEn})</span>
          </button>
        ))}
      </div>

      {/* ── Search & Filter Bar ─────────────────────────────── */}
      <div className="inward-filter-bar nivedan-filter-bar">
        <div className="filter-group search-group">
          <label>शोध (Search)</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="ट्रॅकिंग आयडी (NIV-...), नाव, मोबाईल किंवा विषय शोधा..."
          />
        </div>

        <div className="filter-group">
          <label>तक्रार वर्गवारी (Category)</label>
          <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
            <option value="ALL">सर्व वर्गवारी (All Categories)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_mr} ({c.name_en})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>प्राधान्यक्रम (Priority)</label>
          <select name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="ALL">सर्व (All)</option>
            <option value="HIGH">🔴 उच्च (High)</option>
            <option value="MEDIUM">🟡 मध्यम (Medium)</option>
            <option value="LOW">🔵 सामान्य (Low)</option>
          </select>
        </div>

        <div className="filter-actions">
          <button className="reset-filter-btn" onClick={handleResetFilters} title="फिल्टर रिसेट करा">
            🔄 रिसेट
          </button>
        </div>
      </div>

      {/* ── Data Table ─────────────────────────────────────── */}
      <div className="inward-table-card">
        {loading ? (
          <div className="table-loading-box">
            <div className="mini-spinner"></div>
            <p>निवेदने लोड होत आहेत...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="table-empty-box">
            <div className="empty-icon">📋</div>
            <h3>कोणतेही निवेदन सापडले नाही</h3>
            <p>कृपया शोध किंवा फिल्टर बदलून पुन्हा प्रयत्न करा.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="inward-table">
              <thead>
                <tr>
                  <th>ट्रॅकिंग क्र. (Tracking ID)</th>
                  <th>नागरिकाचे नाव व मोबाईल (Citizen)</th>
                  <th>विषय व वर्गवारी (Subject & Category)</th>
                  <th>प्राधान्य (Priority)</th>
                  <th>स्थिती (Status)</th>
                  <th>नियुक्त / विभाग (Assigned / Dept)</th>
                  <th style={{ textAlign: 'right' }}>कृती (Action)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} onClick={() => openDetailModal(item)} className="table-row-interactive">
                    <td className="col-inward-no">
                      {item.tracking_id}
                      {item.escalation_level && item.escalation_level !== 'NONE' && (
                        <span className="escalation-alert-badge">⚠️ {item.escalation_level}</span>
                      )}
                    </td>
                    <td className="col-sender">
                      <div className="sender-name-primary">{item.citizen_name}</div>
                      <span className="mobile-sub">📱 {item.citizen_mobile}</span>
                    </td>
                    <td className="col-subject">
                      <div className="subject-line">{item.subject}</div>
                      {item.category && (
                        <span className="category-pill">{item.category.name_mr}</span>
                      )}
                    </td>
                    <td>
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td>
                      <NivedanStatusBadge status={item.status} />
                    </td>
                    <td className="col-assigned">
                      {item.forwardedDepartment ? (
                        <span className="dept-tag">{item.forwardedDepartment.name_mr}</span>
                      ) : item.assignedTo ? (
                        <span className="assigned-user-pill">👤 {item.assignedTo.full_name}</span>
                      ) : (
                        <span className="unassigned-text">—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="table-action-btn btn-view"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailModal(item);
                        }}
                        title="तपशील व टाइमलाईन पहा"
                      >
                        📜 पहा (View)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && meta.totalPages > 1 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              एकूण {meta.totalItems} पैकी पान {meta.page} (Total Pages: {meta.totalPages})
            </span>

            <div className="pagination-controls">
              <button
                className="page-btn"
                disabled={meta.page <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
              >
                ← मागील (Prev)
              </button>

              <span className="current-page-num">{meta.page}</span>

              <button
                className="page-btn"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
              >
                पुढील (Next) →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ─────────────────────────────────────────── */}
      <NivedanFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchNivedans}
      />

      <NivedanDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        entry={selectedForDetail}
        onUpdateSuccess={fetchNivedans}
      />
    </div>
  );
};

export default NivedanListPage;
