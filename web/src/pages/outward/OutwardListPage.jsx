// src/pages/outward/OutwardListPage.jsx
// ============================================================
// Outward Register List Page — Module 6
// Lists outgoing letters, AI draft badge, approval flow & letterhead preview
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { Send, Plus, Sparkles, Edit, CheckCircle2, Clock, FileText, Link as LinkIcon, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import useLangStore from '../../store/langStore.js';
import getLangText from '../../utils/langHelper.js';
import api from '../../services/api.js';
import OutwardFormModal from './OutwardFormModal.jsx';
import OutwardDetailModal from './OutwardDetailModal.jsx';
import './OutwardListPage.css';

const t = {
  EN: {
    title: 'Outward Register',
    subtitle: 'Manage outgoing letters, AI drafting, and approval workflows sent to government departments',
    newOutward: 'New Outward Letter',
    searchLabel: 'Search',
    searchPlaceholder: 'Search recipient, subject, or outward number...',
    approvalLabel: 'Approval Status',
    allStatus: 'All Status',
    approved: 'Approved Letters',
    draft: 'Draft / Pending',
    draftTypeLabel: 'Draft Type',
    allDrafts: 'All Types',
    aiDraftOnly: 'Gemini AI Drafts',
    departmentLabel: 'Department',
    allDepts: 'All Departments',
    reset: 'Reset',
    colOutwardNo: 'Outward No.',
    colDate: 'Date Sent',
    colRecipient: 'Recipient & Dept',
    colSubject: 'Subject',
    colType: 'Draft Type',
    colApproval: 'Approval',
    colAction: 'Action',
    aiBadge: 'Gemini AI',
    manualBadge: 'Manual',
    approvedBadge: 'Approved',
    draftBadge: 'Draft',
    viewLetter: 'View Letter',
    refInward: 'Ref Inward:',
    loading: 'Loading outward letters...',
    emptyTitle: 'No Outward Letters Found',
    emptyText: 'Try adjusting your search query or filter options.',
    pageInfo: (totalItems, page, totalPages) => `Showing page ${page} of ${totalPages} (Total ${totalItems} records)`,
    prev: 'Previous',
    next: 'Next',
  },
  MR: {
    title: 'जावक नोंदवही',
    subtitle: 'आमदार कार्यालयातून शासकीय विभागांना पाठवलेली पत्रे, AI मसुदा व मंजुरी प्रक्रिया',
    newOutward: 'नवीन जावक पत्र नोंद',
    searchLabel: 'शोध',
    searchPlaceholder: 'मिळणारा अधिकारी, विषय किंवा जावक क्र. शोधा...',
    approvalLabel: 'मंजुरी स्थिती',
    allStatus: 'सर्व पत्रे',
    approved: 'मंजूर पत्रे',
    draft: 'मसुदा / प्रलंबित',
    draftTypeLabel: 'मसुदा प्रकार',
    allDrafts: 'सर्व प्रकार',
    aiDraftOnly: 'Gemini AI मसुदा',
    departmentLabel: 'शासकीय विभाग',
    allDepts: 'सर्व विभाग',
    reset: 'रिसेट',
    colOutwardNo: 'जावक क्र.',
    colDate: 'निर्गमित दिनांक',
    colRecipient: 'पत्र मिळणारा व विभाग',
    colSubject: 'विषय',
    colType: 'मसुदा प्रकार',
    colApproval: 'मंजुरी',
    colAction: 'कृती',
    aiBadge: 'Gemini AI',
    manualBadge: 'मॅन्युअल',
    approvedBadge: 'मंजूर',
    draftBadge: 'मसुदा',
    viewLetter: 'पत्र पहा',
    refInward: 'संदर्भ आवक:',
    loading: 'जावक पत्रे लोड होत आहेत...',
    emptyTitle: 'कोणतेही जावक पत्र सापडले नाही',
    emptyText: 'कृपया शोध किंवा फिल्टर बदलून पुन्हा प्रयत्न करा.',
    pageInfo: (totalItems, page, totalPages) => `एकूण ${totalItems} पैकी पान ${page} (एकूण पाने: ${totalPages})`,
    prev: 'मागील',
    next: 'पुढील',
  },
};

const OutwardListPage = () => {
  const { lang } = useLangStore();
  const text = t[lang] || t.EN;

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, totalItems: 0, totalPages: 1 });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    approved: 'ALL',
    isAiDrafted: 'ALL',
    departmentId: 'ALL',
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
      if (filters.approved !== 'ALL') params.approved = filters.approved;
      if (filters.isAiDrafted !== 'ALL') params.isAiDrafted = filters.isAiDrafted;
      if (filters.departmentId !== 'ALL') params.departmentId = filters.departmentId;

      const { data } = await api.get('/outward', { params });
      setItems(data.data || []);
      setMeta(data.meta || { page: 1, limit: 20, totalItems: data.data?.length || 0, totalPages: 1 });
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
      approved: 'ALL',
      isAiDrafted: 'ALL',
      departmentId: 'ALL',
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
          <h1 className="page-title-mr" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Send size={20} /> {text.title}
          </h1>
          <p className="page-subtitle">{text.subtitle}</p>
        </div>

        <button className="create-inward-btn" onClick={() => setIsFormOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} />
          <span>{text.newOutward}</span>
        </button>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="inward-filter-bar outward-filter-bar">
        <div className="filter-group search-group">
          <label>{text.searchLabel}</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder={text.searchPlaceholder}
          />
        </div>

        <div className="filter-group">
          <label>{text.approvalLabel}</label>
          <select name="approved" value={filters.approved} onChange={handleFilterChange}>
            <option value="ALL">{text.allStatus}</option>
            <option value="APPROVED">{text.approved}</option>
            <option value="DRAFT">{text.draft}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{text.draftTypeLabel}</label>
          <select name="isAiDrafted" value={filters.isAiDrafted} onChange={handleFilterChange}>
            <option value="ALL">{text.allDrafts}</option>
            <option value="AI_ONLY">{text.aiDraftOnly}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{text.departmentLabel}</label>
          <select name="departmentId" value={filters.departmentId} onChange={handleFilterChange}>
            <option value="ALL">{text.allDepts}</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {lang === 'MR' ? d.name_mr : d.name_en || d.name_mr} ({d.short_code})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <button className="reset-filter-btn" onClick={handleResetFilters} title={text.reset} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <RotateCcw size={14} /> {text.reset}
          </button>
        </div>
      </div>

      {/* ── Outward Data Table ──────────────────────────────── */}
      <div className="inward-table-card">
        {loading ? (
          <div className="table-loading-box">
            <div className="mini-spinner"></div>
            <p>{text.loading}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="table-empty-box">
            <div className="empty-icon"><Send size={32} /></div>
            <h3>{text.emptyTitle}</h3>
            <p>{text.emptyText}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="inward-table">
              <thead>
                <tr>
                  <th>{text.colOutwardNo}</th>
                  <th>{text.colDate}</th>
                  <th>{text.colRecipient}</th>
                  <th>{text.colSubject}</th>
                  <th>{text.colType}</th>
                  <th>{text.colApproval}</th>
                  <th style={{ textAlign: 'right' }}>{text.colAction}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} onClick={() => openDetailModal(item)} className="table-row-interactive">
                    <td className="col-inward-no">{item.outward_number}</td>
                    <td className="col-date">{item.date_sent}</td>
                    <td className="col-sender">
                      <div className="sender-name-primary">{getLangText(item, 'recipient_name', lang)}</div>
                      {item.recipientDepartment && (
                        <span className="dept-tag">
                          {lang === 'MR'
                            ? item.recipientDepartment.name_mr
                            : item.recipientDepartment.name_en || item.recipientDepartment.name_mr}
                        </span>
                      )}
                    </td>
                    <td className="col-subject">
                      <div className="subject-line">{getLangText(item, 'subject', lang)}</div>
                      {item.referenceInward && (
                        <span className="ref-inward-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <LinkIcon size={12} /> {text.refInward} {item.referenceInward.inward_number}
                        </span>
                      )}
                    </td>
                    <td>
                      {item.is_ai_drafted ? (
                        <span className="ai-draft-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Sparkles size={12} /> {text.aiBadge}</span>
                      ) : (
                        <span className="manual-draft-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Edit size={12} /> {text.manualBadge}</span>
                      )}
                    </td>
                    <td>
                      {item.approved_by ? (
                        <span className="approved-status-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> {text.approvedBadge}</span>
                      ) : (
                        <span className="draft-status-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {text.draftBadge}</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="table-action-btn btn-view"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailModal(item);
                        }}
                        title={text.viewLetter}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <FileText size={14} /> {text.viewLetter}
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
              {text.pageInfo(meta.totalItems, meta.page, meta.totalPages)}
            </span>

            <div className="pagination-controls">
              <button
                className="page-btn"
                disabled={meta.page <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ChevronLeft size={14} /> {text.prev}
              </button>

              <span className="current-page-num">{meta.page}</span>

              <button
                className="page-btn"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
              >
                {text.next}
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
