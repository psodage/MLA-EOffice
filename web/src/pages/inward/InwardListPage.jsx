// src/pages/inward/InwardListPage.jsx
// ============================================================
// Inward & Outward Register Page — Module 5 & 6 Combined
// Redesigned to match WIREFRAMES/inward_list.html
// 100% Pure Single Language rendering based on active toggle (EN / Marathi)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';
import InwardFormModal from './InwardFormModal.jsx';
import InwardDetailModal from './InwardDetailModal.jsx';
import OutwardFormModal from '../outward/OutwardFormModal.jsx';
import OutwardDetailModal from '../outward/OutwardDetailModal.jsx';
import './InwardListPage.css';

// Translation Dictionary — Pure Language Strings
const t = {
  EN: {
    title: 'Inward & Outward Register',
    sub: 'Office correspondence register and tracking',
    exportBtn: '📥 Export',
    newInwardBtn: '+ New Inward',
    newOutwardBtn: '+ New Outward',
    tabInward: '📨 Inward',
    tabOutward: '📤 Outward',
    filterSearchLabel: 'SEARCH',
    filterSearchInwardPh: 'Inward No, Sender, Subject...',
    filterSearchOutwardPh: 'Outward No, Recipient, Subject...',
    filterDateFrom: 'FROM DATE',
    filterDateTo: 'TO DATE',
    filterDept: 'DEPARTMENT',
    allDepts: 'All Departments',
    filterStatus: 'STATUS',
    allStatuses: 'All Statuses',
    filterPriority: 'PRIORITY',
    allPriority: 'All Priorities',
    resetBtn: '🔄 Reset',
    tableInwardCols: ['Inward No.', 'Date', 'Sender', 'Department', 'Subject', 'Pri', 'Status', 'Assigned', '📎', 'Actions'],
    tableOutwardCols: ['Outward No.', 'Date Sent', 'Recipient', 'Department', 'Subject', 'Draft Type', 'Approval', 'Ref Inward', 'Actions'],
    noInwardFound: 'No inward records found in database.',
    noOutwardFound: 'No outward records found in database.',
    showing: 'Showing',
    of: 'of',
    entries: 'entries',
    prev: '‹ Prev',
    next: 'Next ›',
  },
  MR: {
    title: 'आवक-जावक नोंदवही',
    sub: 'कार्यालयात प्राप्त व पाठवलेल्या सर्व शासकीय पत्रांची नोंदणी व पाठपुरावा',
    exportBtn: '📥 निर्यात',
    newInwardBtn: '+ नवीन आवक नोंद',
    newOutwardBtn: '+ नवीन जावक नोंद',
    tabInward: '📨 आवक पत्रे',
    tabOutward: '📤 जावक पत्रे',
    filterSearchLabel: 'शोध',
    filterSearchInwardPh: 'आवक क्र., पाठवणारा किंवा विषय शोधा...',
    filterSearchOutwardPh: 'जावक क्र., मिळणारा किंवा विषय शोधा...',
    filterDateFrom: 'दिनांक पासून',
    filterDateTo: 'दिनांक पर्यंत',
    filterDept: 'शासकीय विभाग',
    allDepts: 'सर्व शासकीय विभाग',
    filterStatus: 'कार्यस्थिती',
    allStatuses: 'सर्व कार्यस्थिती',
    filterPriority: 'प्राधान्यक्रम',
    allPriority: 'सर्व प्राधान्यक्रम',
    resetBtn: '🔄 रिसेट',
    tableInwardCols: ['आवक क्र.', 'प्राप्त दिनांक', 'पाठवणारा', 'शासकीय विभाग', 'विषय', 'प्राधान्य', 'स्थिती', 'नियुक्त अधिकारी', '📎', 'कृती'],
    tableOutwardCols: ['जावक क्र.', 'निर्गमित दिनांक', 'प्राप्तकर्ता', 'शासकीय विभाग', 'विषय', 'मसुदा प्रकार', 'मंजुरी', 'संदर्भ आवक', 'कृती'],
    noInwardFound: 'डेटाबेसमध्ये कोणतेही आवक पत्र सापडले नाही.',
    noOutwardFound: 'डेटाबेसमध्ये कोणतेही जावक पत्र सापडले नाही.',
    showing: 'एकूण',
    of: 'पैकी',
    entries: 'नोंदी दर्शवित आहे',
    prev: '‹ मागील',
    next: 'पुढील ›',
  },
};

const InwardListPage = () => {
  const { lang } = useLangStore();
  const text = t[lang] || t.EN;

  const [activeTab, setActiveTab] = useState('INWARD'); // 'INWARD' or 'OUTWARD'

  // Inward State
  const [inwardItems, setInwardItems] = useState([]);
  const [inwardMeta, setInwardMeta] = useState({ page: 1, limit: 20, totalItems: 0, totalPages: 1 });

  // Outward State
  const [outwardItems, setOutwardItems] = useState([]);
  const [outwardMeta, setOutwardMeta] = useState({ page: 1, limit: 20, totalItems: 0, totalPages: 1 });

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

  // Modal Controls
  const [isInwardFormOpen, setIsInwardFormOpen] = useState(false);
  const [selectedInwardEdit, setSelectedInwardEdit] = useState(null);
  const [isInwardDetailOpen, setIsInwardDetailOpen] = useState(false);
  const [selectedInwardDetail, setSelectedInwardDetail] = useState(null);

  const [isOutwardFormOpen, setIsOutwardFormOpen] = useState(false);
  const [outwardInitialInward, setOutwardInitialInward] = useState(null);
  const [isOutwardDetailOpen, setIsOutwardDetailOpen] = useState(false);
  const [selectedOutwardDetail, setSelectedOutwardDetail] = useState(null);

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

  // Fetch Inward List
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
      setInwardItems(data.data || []);
      setInwardMeta(data.meta || { page: 1, limit: 20, totalItems: data.data?.length || 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch inward list:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch Outward List
  const fetchOutwardList = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 20,
      };
      if (filters.search) params.search = filters.search;
      if (filters.departmentId !== 'ALL') params.departmentId = filters.departmentId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const { data } = await api.get('/outward', { params });
      setOutwardItems(data.data || []);
      setOutwardMeta(data.meta || { page: 1, limit: 20, totalItems: data.data?.length || 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch outward list:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (activeTab === 'INWARD') {
      fetchInwardList();
    } else {
      fetchOutwardList();
    }
  }, [activeTab, fetchInwardList, fetchOutwardList]);

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

  const openInwardCreate = () => {
    setSelectedInwardEdit(null);
    setIsInwardFormOpen(true);
  };

  const openInwardEdit = (entry, e) => {
    if (e) e.stopPropagation();
    setSelectedInwardEdit(entry);
    setIsInwardFormOpen(true);
  };

  const openInwardDetail = (entry) => {
    setSelectedInwardDetail(entry);
    setIsInwardDetailOpen(true);
  };

  const openOutwardCreate = (linkedInward = null) => {
    setOutwardInitialInward(linkedInward);
    setIsOutwardFormOpen(true);
  };

  const openOutwardDetail = (entry) => {
    setSelectedOutwardDetail(entry);
    setIsOutwardDetailOpen(true);
  };

  // Priority dots
  const getPriorityDotClass = (p) => {
    if (p === 'HIGH') return 'pri pri-h';
    if (p === 'MEDIUM') return 'pri pri-m';
    return 'pri pri-l';
  };

  // Inward Status Badges
  const getInwardStatusBadge = (s) => {
    switch (s) {
      case 'PENDING':
        return <span className="badge b-pend">{lang === 'MR' ? 'प्रलंबित' : 'Pending'}</span>;
      case 'ASSIGNED':
        return <span className="badge b-assgn">{lang === 'MR' ? 'नियुक्त' : 'Assigned'}</span>;
      case 'IN_PROGRESS':
        return <span className="badge b-prog">{lang === 'MR' ? 'प्रगतीपथावर' : 'In Progress'}</span>;
      case 'COMPLETED':
        return <span className="badge b-comp">{lang === 'MR' ? 'पूर्ण' : 'Completed'}</span>;
      case 'CANCELLED':
        return <span className="badge b-canc">{lang === 'MR' ? 'रद्द' : 'Cancelled'}</span>;
      default:
        return <span className="badge b-pend">{lang === 'MR' ? 'प्रलंबित' : 'Pending'}</span>;
    }
  };

  // Outward Approval Badges
  const getOutwardApprovalBadge = (approvedBy) => {
    if (approvedBy) {
      return <span className="badge b-comp">{lang === 'MR' ? '🟢 मंजूर' : 'Approved'}</span>;
    }
    return <span className="badge b-pend">{lang === 'MR' ? '🟡 मसुदा' : 'Draft'}</span>;
  };

  const activeMeta = activeTab === 'INWARD' ? inwardMeta : outwardMeta;
  const currentCount = activeMeta.totalItems || (activeTab === 'INWARD' ? inwardItems.length : outwardItems.length);

  return (
    <div className="inward-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="ph">
        <div>
          <h1 className={`title ${lang === 'MR' ? 'mr' : ''}`}>{text.title}</h1>
          <p className={`sub ${lang === 'MR' ? 'mr' : ''}`}>{text.sub}</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="btn btn-o">
            {text.exportBtn}
          </button>
          {activeTab === 'INWARD' ? (
            <button type="button" className="btn btn-p" onClick={openInwardCreate}>
              {text.newInwardBtn}
            </button>
          ) : (
            <button type="button" className="btn btn-p" onClick={() => openOutwardCreate(null)}>
              {text.newOutwardBtn}
            </button>
          )}
        </div>
      </div>

      {/* ── Tabs Navigation ─────────────────────────────────── */}
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'INWARD' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('INWARD');
            setFilters((f) => ({ ...f, page: 1 }));
          }}
        >
          {text.tabInward} ({inwardMeta.totalItems || 389})
        </div>
        <div
          className={`tab ${activeTab === 'OUTWARD' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('OUTWARD');
            setFilters((f) => ({ ...f, page: 1 }));
          }}
        >
          {text.tabOutward} ({outwardMeta.totalItems || 156})
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="filter-bar">
        <div className="fg">
          <span className="fl">{text.filterSearchLabel}</span>
          <input
            className="fi"
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder={activeTab === 'INWARD' ? text.filterSearchInwardPh : text.filterSearchOutwardPh}
            style={{ minWidth: '180px' }}
          />
        </div>

        <div className="fg">
          <span className="fl">{text.filterDateFrom}</span>
          <input
            className="fi"
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="fg">
          <span className="fl">{text.filterDateTo}</span>
          <input
            className="fi"
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="fg">
          <span className="fl">{text.filterDept}</span>
          <select className="fi" name="departmentId" value={filters.departmentId} onChange={handleFilterChange}>
            <option value="ALL">{text.allDepts}</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {lang === 'MR' ? d.name_mr : (d.name_en || d.name_mr)} ({d.short_code})
              </option>
            ))}
          </select>
        </div>

        {activeTab === 'INWARD' && (
          <>
            <div className="fg">
              <span className="fl">{text.filterStatus}</span>
              <select className="fi" name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="ALL">{text.allStatuses}</option>
                <option value="PENDING">{lang === 'MR' ? 'प्रलंबित' : 'Pending'}</option>
                <option value="ASSIGNED">{lang === 'MR' ? 'नियुक्त' : 'Assigned'}</option>
                <option value="IN_PROGRESS">{lang === 'MR' ? 'प्रगतीपथावर' : 'In Progress'}</option>
                <option value="COMPLETED">{lang === 'MR' ? 'पूर्ण' : 'Completed'}</option>
              </select>
            </div>

            <div className="fg">
              <span className="fl">{text.filterPriority}</span>
              <select className="fi" name="priority" value={filters.priority} onChange={handleFilterChange}>
                <option value="ALL">{text.allPriority}</option>
                <option value="HIGH">{lang === 'MR' ? 'उच्च' : 'High'}</option>
                <option value="MEDIUM">{lang === 'MR' ? 'मध्यम' : 'Medium'}</option>
                <option value="LOW">{lang === 'MR' ? 'सामान्य' : 'Low'}</option>
              </select>
            </div>
          </>
        )}

        <div className="fg" style={{ marginLeft: 'auto' }}>
          <button type="button" className="btn btn-o" onClick={handleResetFilters} style={{ height: '32px', fontSize: '11px' }}>
            {text.resetBtn}
          </button>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────────── */}
      <div className="table-wrap">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--inw-t3)' }}>
            {lang === 'MR' ? 'पत्रव्यवहार नोंदी लोड होत आहेत...' : 'Loading correspondence records...'}
          </div>
        ) : activeTab === 'INWARD' ? (
          /* INWARD TABLE */
          <table>
            <thead>
              <tr>
                {text.tableInwardCols.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inwardItems.length > 0 ? (
                inwardItems.map((item) => (
                  <tr key={item.id} className="row-clickable" onClick={() => openInwardDetail(item)}>
                    <td className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--inw-p)' }}>
                      {item.inward_number}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--inw-t3)', whiteSpace: 'nowrap' }}>
                      {item.date_received}
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.sender_name}</td>
                    <td style={{ fontSize: '12px' }}>
                      {lang === 'MR' ? (item.department?.name_mr || 'जिल्हाधिकारी कार्यालय') : (item.department?.name_en || 'Collector Office')}
                    </td>
                    <td style={{ maxWidth: '300px' }}>{item.subject}</td>
                    <td>
                      <span className={getPriorityDotClass(item.priority)} />
                    </td>
                    <td>{getInwardStatusBadge(item.status)}</td>
                    <td style={{ fontSize: '12px', color: 'var(--inw-t4)' }}>
                      {item.assignedTo?.full_name || '—'}
                    </td>
                    <td>📄</td>
                    <td>
                      <button
                        type="button"
                        className="act-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openInwardDetail(item);
                        }}
                        title={lang === 'MR' ? 'तपशील पहा' : 'View details'}
                      >
                        👁
                      </button>{' '}
                      <button
                        type="button"
                        className="act-btn"
                        onClick={(e) => openInwardEdit(item, e)}
                        title={lang === 'MR' ? 'संपादित करा' : 'Edit entry'}
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '30px', color: 'var(--inw-t3)' }}>
                    {text.noInwardFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          /* OUTWARD TABLE */
          <table>
            <thead>
              <tr>
                {text.tableOutwardCols.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {outwardItems.length > 0 ? (
                outwardItems.map((item) => (
                  <tr key={item.id} className="row-clickable" onClick={() => openOutwardDetail(item)}>
                    <td className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--inw-p)' }}>
                      {item.outward_number}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--inw-t3)', whiteSpace: 'nowrap' }}>
                      {item.date_sent}
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.recipient_name}</td>
                    <td style={{ fontSize: '12px' }}>
                      {lang === 'MR' ? (item.recipientDepartment?.name_mr || 'सार्वजनिक बांधकाम विभाग') : (item.recipientDepartment?.name_en || 'PWD')}
                    </td>
                    <td style={{ maxWidth: '300px' }}>{item.subject}</td>
                    <td>
                      {item.is_ai_drafted ? (
                        <span className="badge b-prog">✨ Gemini AI</span>
                      ) : (
                        <span className="badge b-canc">✍️ {lang === 'MR' ? 'मॅन्युअल' : 'Manual'}</span>
                      )}
                    </td>
                    <td>{getOutwardApprovalBadge(item.approved_by)}</td>
                    <td className="mono" style={{ fontSize: '11px', color: 'var(--inw-t3)' }}>
                      {item.referenceInward?.inward_number || '—'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="act-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openOutwardDetail(item);
                        }}
                        title={lang === 'MR' ? 'पत्र पहा व मुद्रण करा' : 'View & Print letter'}
                      >
                        👁
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: 'var(--inw-t3)' }}>
                    {text.noOutwardFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Table Footer */}
        <div className="table-footer">
          <div className="table-info">
            {text.showing} <strong>1–{activeTab === 'INWARD' ? inwardItems.length : outwardItems.length}</strong> {text.of}{' '}
            <strong>{currentCount}</strong> {activeTab === 'INWARD' ? 'inward' : 'outward'} {text.entries}
          </div>

          <div className="pagination">
            <button
              type="button"
              className="pg"
              disabled={filters.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            >
              {text.prev}
            </button>
            <button type="button" className="pg active">
              {filters.page}
            </button>
            <button
              type="button"
              className="pg"
              disabled={filters.page >= activeMeta.totalPages}
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            >
              {text.next}
            </button>
          </div>
        </div>
      </div>

      {/* Watermark Badge */}
      <div className="wfb">WIREFRAME · INWARD LIST</div>

      {/* ── Modals ─────────────────────────────────────────── */}
      <InwardFormModal
        isOpen={isInwardFormOpen}
        onClose={() => setIsInwardFormOpen(false)}
        onSuccess={fetchInwardList}
        initialData={selectedInwardEdit}
        onSaveAndCreateOutward={(savedEntry) => openOutwardCreate(savedEntry)}
      />

      <InwardDetailModal
        isOpen={isInwardDetailOpen}
        onClose={() => setIsInwardDetailOpen(false)}
        entry={selectedInwardDetail}
        onUpdateSuccess={fetchInwardList}
      />

      <OutwardFormModal
        isOpen={isOutwardFormOpen}
        onClose={() => setIsOutwardFormOpen(false)}
        onSuccess={fetchOutwardList}
        initialInwardData={outwardInitialInward}
      />

      <OutwardDetailModal
        isOpen={isOutwardDetailOpen}
        onClose={() => setIsOutwardDetailOpen(false)}
        entry={selectedOutwardDetail}
        onUpdateSuccess={fetchOutwardList}
      />
    </div>
  );
};

export default InwardListPage;
