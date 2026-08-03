// src/pages/inward/InwardListPage.jsx
// ============================================================
// Inward Register List Page — Module 5
// Filter bar, search, data table, pagination, create/detail modals
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import InwardStatusBadge from '../../components/inward/InwardStatusBadge.jsx';
import PriorityBadge from '../../components/inward/PriorityBadge.jsx';
import InwardFormModal from './InwardFormModal.jsx';
import InwardDetailModal from './InwardDetailModal.jsx';
import './InwardListPage.css';

const InwardListPage = () => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, totalItems: 0, totalPages: 1 });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    priority: 'ALL',
    departmentId: 'ALL',
    startDate: '',
    endDate: '',
    page: 1,
  });

  // Modals State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedForDetail, setSelectedForDetail] = useState(null);

  // Fetch departments list
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

  // Fetch inward list
  const fetchInwardList = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 20,
      };
      if (filters.search) params.search = filters.search;
      if (filters.status !== 'ALL') params.status = filters.status;
      if (filters.priority !== 'ALL') params.priority = filters.priority;
      if (filters.departmentId !== 'ALL') params.departmentId = filters.departmentId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const { data } = await api.get('/inward', { params });
      setItems(data.data || []);
      setMeta(data.meta || { page: 1, limit: 20, totalItems: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch inward list:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInwardList();
  }, [fetchInwardList]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'ALL',
      priority: 'ALL',
      departmentId: 'ALL',
      startDate: '',
      endDate: '',
      page: 1,
    });
  };

  const openCreateModal = () => {
    setSelectedForEdit(null);
    setIsFormOpen(true);
  };

  const openEditModal = (entry, e) => {
    e.stopPropagation();
    setSelectedForEdit(entry);
    setIsFormOpen(true);
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
          <h1 className="page-title-mr">📥 आवक नोंदवही (Inward Register)</h1>
          <p className="page-subtitle">
            कार्यालयात प्राप्त होणाऱ्या सर्व शासकीय पत्रांची नोंदणी, पाठपुरावा व वर्गीकरण
          </p>
        </div>

        <button className="create-inward-btn" onClick={openCreateModal}>
          <span>➕</span>
          <span>नवीन आवक नोंद (Log Inward)</span>
        </button>
      </div>

      {/* ── Filter Bar Section ──────────────────────────────── */}
      <div className="inward-filter-bar">
        <div className="filter-group search-group">
          <label>शोध (Search)</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="पाठवणारा, विषय किंवा आवक क्र. द्वारे शोधा..."
          />
        </div>

        <div className="filter-group">
          <label>कार्यस्थिती (Status)</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="ALL">सर्व स्थिती (All Status)</option>
            <option value="PENDING">🟡 प्रलंबित (Pending)</option>
            <option value="ASSIGNED">🟣 नियुक्त (Assigned)</option>
            <option value="IN_PROGRESS">🔵 प्रगतीपथावर (In Progress)</option>
            <option value="COMPLETED">🟢 पूर्ण (Completed)</option>
            <option value="CANCELLED">⚪ रद्द (Cancelled)</option>
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

        <div className="filter-group date-group">
          <label>दिनांक (From Date)</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group date-group">
          <label>पर्यंत (To Date)</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-actions">
          <button className="reset-filter-btn" onClick={handleResetFilters} title="फिल्टर रिसेट करा">
            🔄 रिसेट
          </button>
        </div>
      </div>

      {/* ── Inward Data Table ───────────────────────────────── */}
      <div className="inward-table-card">
        {loading ? (
          <div className="table-loading-box">
            <div className="mini-spinner"></div>
            <p>आवक पत्रे लोड होत आहेत...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="table-empty-box">
            <div className="empty-icon">📂</div>
            <h3>कोणतेही आवक पत्र सापडले नाही</h3>
            <p>कृपया शोध किंवा फिल्टर निकष बदलून पुन्हा प्रयत्न करा.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="inward-table">
              <thead>
                <tr>
                  <th>आवक क्र. (Inward No)</th>
                  <th>प्राप्त दिनांक (Date)</th>
                  <th>पाठवणारा व विभाग (Sender / Dept)</th>
                  <th>विषय (Subject)</th>
                  <th>प्राधान्य (Priority)</th>
                  <th>स्थिती (Status)</th>
                  <th>नियुक्त व्यक्ती (Assigned)</th>
                  <th style={{ textAlign: 'right' }}>कृती (Action)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} onClick={() => openDetailModal(item)} className="table-row-interactive">
                    <td className="col-inward-no">{item.inward_number}</td>
                    <td className="col-date">{item.date_received}</td>
                    <td className="col-sender">
                      <div className="sender-name-primary">{item.sender_name}</div>
                      {item.department && (
                        <span className="dept-tag">{item.department.name_mr}</span>
                      )}
                    </td>
                    <td className="col-subject">
                      <div className="subject-line">{item.subject}</div>
                      {Array.isArray(item.attachment_urls) && item.attachment_urls.length > 0 && (
                        <span className="attachment-indicator">📎 {item.attachment_urls.length} जोडपत्र</span>
                      )}
                    </td>
                    <td>
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td>
                      <InwardStatusBadge status={item.status} />
                    </td>
                    <td className="col-assigned">
                      {item.assignedTo ? (
                        <span className="assigned-user-pill">👤 {item.assignedTo.full_name}</span>
                      ) : (
                        <span className="unassigned-text">—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons-group">
                        <button
                          className="table-action-btn btn-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailModal(item);
                          }}
                          title="तपशील पहा"
                        >
                          👁️
                        </button>
                        <button
                          className="table-action-btn btn-edit"
                          onClick={(e) => openEditModal(item, e)}
                          title="संपादित करा"
                        >
                          ✏️
                        </button>
                      </div>
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
      <InwardFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchInwardList}
        initialData={selectedForEdit}
      />

      <InwardDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        entry={selectedForDetail}
        onUpdateSuccess={fetchInwardList}
      />
    </div>
  );
};

export default InwardListPage;
