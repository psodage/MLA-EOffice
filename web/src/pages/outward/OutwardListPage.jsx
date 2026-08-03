// src/pages/outward/OutwardListPage.jsx
// ============================================================
// Outward Register List Page — Module 6
// Lists outgoing letters, AI draft badge, approval flow & letterhead preview
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import OutwardFormModal from './OutwardFormModal.jsx';
import OutwardDetailModal from './OutwardDetailModal.jsx';
import './OutwardListPage.css';

const OutwardListPage = () => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, totalItems: 0, totalPages: 1 });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    departmentId: 'ALL',
    approved: 'ALL',
    isAiDrafted: 'ALL',
    startDate: '',
    endDate: '',
    page: 1,
  });

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedForDetail, setSelectedForDetail] = useState(null);

  // Fetch departments dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get('/departments');
        setDepartments(data.data || []);
      } catch (err) {
        console.error('Failed to load departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch outward list
  const fetchOutwardList = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 20,
      };
      if (filters.search) params.search = filters.search;
      if (filters.departmentId !== 'ALL') params.departmentId = filters.departmentId;
      if (filters.approved === 'APPROVED') params.approved = 'TRUE';
      if (filters.approved === 'DRAFT') params.approved = 'FALSE';
      if (filters.isAiDrafted === 'AI_ONLY') params.isAiDrafted = 'true';
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const { data } = await api.get('/outward', { params });
      setItems(data.data || []);
      setMeta(data.meta || { page: 1, limit: 20, totalItems: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch outward list:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOutwardList();
  }, [fetchOutwardList]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      departmentId: 'ALL',
      approved: 'ALL',
      isAiDrafted: 'ALL',
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
          <h1 className="page-title-mr">📤 जावक नोंदवही (Outward Register)</h1>
          <p className="page-subtitle">
            आमदार कार्यालयातून शासकीय विभागांना पाठवलेली पत्रे, AI मसुदा व मंजुरी प्रक्रिया
          </p>
        </div>

        <button className="create-inward-btn" onClick={() => setIsFormOpen(true)}>
          <span>✨</span>
          <span>नवीन जावक पत्र नोंद (New Outward)</span>
        </button>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="inward-filter-bar outward-filter-bar">
        <div className="filter-group search-group">
          <label>शोध (Search)</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="मिळणारा अधिकारी, विषय किंवा जावक क्र. शोधा..."
          />
        </div>

        <div className="filter-group">
          <label>मंजुरी स्थिती (Approval)</label>
          <select name="approved" value={filters.approved} onChange={handleFilterChange}>
            <option value="ALL">सर्व पत्रे (All Status)</option>
            <option value="APPROVED">🟢 मंजूर पत्रे (Approved)</option>
            <option value="DRAFT">🟡 मसुदा (Draft / Pending)</option>
          </select>
        </div>

        <div className="filter-group">
          <label>मसुदा प्रकार (Draft Type)</label>
          <select name="isAiDrafted" value={filters.isAiDrafted} onChange={handleFilterChange}>
            <option value="ALL">सर्व (All)</option>
            <option value="AI_ONLY">🤖 Gemini AI मसुदा</option>
          </select>
        </div>

        <div className="filter-group">
          <label>शासकीय विभाग (Department)</label>
          <select name="departmentId" value={filters.departmentId} onChange={handleFilterChange}>
            <option value="ALL">सर्व विभाग (All Depts)</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name_mr} ({d.short_code})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <button className="reset-filter-btn" onClick={handleResetFilters} title="फिल्टर रिसेट करा">
            🔄 रिसेट
          </button>
        </div>
      </div>

      {/* ── Outward Data Table ──────────────────────────────── */}
      <div className="inward-table-card">
        {loading ? (
          <div className="table-loading-box">
            <div className="mini-spinner"></div>
            <p>जावक पत्रे लोड होत आहेत...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="table-empty-box">
            <div className="empty-icon">📤</div>
            <h3>कोणतेही जावक पत्र सापडले नाही</h3>
            <p>कृपया शोध किंवा फिल्टर बदलून पुन्हा प्रयत्न करा.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="inward-table">
              <thead>
                <tr>
                  <th>जावक क्र. (Outward No)</th>
                  <th>निर्गमित दिनांक (Date)</th>
                  <th>पत्र मिळणारा व विभाग (Recipient & Dept)</th>
                  <th>विषय (Subject)</th>
                  <th>AI मसुदा (Type)</th>
                  <th>मंजुरी (Approval)</th>
                  <th style={{ textAlign: 'right' }}>कृती (Action)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} onClick={() => openDetailModal(item)} className="table-row-interactive">
                    <td className="col-inward-no">{item.outward_number}</td>
                    <td className="col-date">{item.date_sent}</td>
                    <td className="col-sender">
                      <div className="sender-name-primary">{item.recipient_name}</div>
                      {item.recipientDepartment && (
                        <span className="dept-tag">{item.recipientDepartment.name_mr}</span>
                      )}
                    </td>
                    <td className="col-subject">
                      <div className="subject-line">{item.subject}</div>
                      {item.referenceInward && (
                        <span className="ref-inward-tag">🔗 संदर्भ आवक: {item.referenceInward.inward_number}</span>
                      )}
                    </td>
                    <td>
                      {item.is_ai_drafted ? (
                        <span className="ai-draft-badge">🤖 Gemini AI</span>
                      ) : (
                        <span className="manual-draft-badge">✍️ मॅन्युअल</span>
                      )}
                    </td>
                    <td>
                      {item.approved_by ? (
                        <span className="approved-status-badge">🟢 मंजूर (Approved)</span>
                      ) : (
                        <span className="draft-status-badge">🟡 मसुदा (Draft)</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="table-action-btn btn-view"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailModal(item);
                        }}
                        title="पत्र व मुद्रण पहा"
                      >
                        📄 पत्र पहा (View)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
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
      <OutwardFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchOutwardList}
      />

      <OutwardDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        entry={selectedForDetail}
        onUpdateSuccess={fetchOutwardList}
      />
    </div>
  );
};

export default OutwardListPage;
