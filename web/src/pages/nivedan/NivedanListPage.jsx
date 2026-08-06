// src/pages/nivedan/NivedanListPage.jsx
// ============================================================
// Nivedan List Page — Petitions & Grievances Core Module
// Status filter tabs, multi-field filters, dynamic language toggle,
// page navigation to /nivedan/:id
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Printer, Plus, Folder, Clock, CheckCircle2, AlertTriangle, Send, FileText, Phone, RotateCcw, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';
import getLangText from '../../utils/langHelper.js';
import NivedanFormModal from './NivedanFormModal.jsx';

const STATUS_TABS = [
  { id: 'ALL', labelEn: 'All Petitions', labelMr: 'सर्व निवेदने', Icon: Folder, tabClass: 'tab-all' },
  { id: 'PENDING', labelEn: 'Pending', labelMr: 'प्रलंबित', Icon: Clock, tabClass: 'tab-pending' },
  { id: 'IN_PROGRESS', labelEn: 'In Progress', labelMr: 'प्रगतीपथावर', Icon: Clock, tabClass: 'tab-progress' },
  { id: 'FORWARDED', labelEn: 'Forwarded', labelMr: 'पाठवलेले', Icon: Send, tabClass: 'tab-forwarded' },
  { id: 'ESCALATED', labelEn: 'Escalated', labelMr: 'कालावधी उलटलेले', Icon: AlertTriangle, tabClass: 'tab-escalated' },
  { id: 'RESOLVED', labelEn: 'Resolved', labelMr: 'मार्गी लागलेले', Icon: CheckCircle2, tabClass: 'tab-resolved' },
];

const NivedanListPage = () => {
  const navigate = useNavigate();
  const { lang, setLang } = useLangStore();
  const isMr = lang === 'MR';

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

  const openDetailPage = (item) => {
    navigate(`/nivedans/${item.id}`, { state: { nivedan: item } });
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return <span className="badge-pill badge-urgent">{isMr ? 'अतिअत्यंत' : 'Urgent'}</span>;
      case 'HIGH':
        return <span className="badge-pill badge-high">{isMr ? 'उच्च' : 'High'}</span>;
      case 'MEDIUM':
        return <span className="badge-pill badge-medium">{isMr ? 'मध्यम' : 'Medium'}</span>;
      default:
        return <span className="badge-pill badge-low">{isMr ? 'सामान्य' : 'Low'}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="badge-pill status-resolved badge-resolved">
            <CheckCircle2 size={12} /> {isMr ? 'मार्गी लागलेले' : 'Resolved'}
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="badge-pill status-progress badge-progress">
            <Clock size={12} /> {isMr ? 'प्रगतीपथावर' : 'In Progress'}
          </span>
        );
      case 'FORWARDED':
        return (
          <span className="badge-pill status-forwarded badge-forwarded">
            <Send size={12} /> {isMr ? 'पाठवलेले' : 'Forwarded'}
          </span>
        );
      case 'ESCALATED':
        return (
          <span className="badge-pill status-escalated badge-escalated">
            <AlertTriangle size={12} /> {isMr ? 'कालावधी उलटलेले' : 'Escalated'}
          </span>
        );
      default:
        return (
          <span className="badge-pill status-pending badge-pending">
            <Clock size={12} /> {isMr ? 'प्रलंबित' : 'Pending'}
          </span>
        );
    }
  };

  return (
    <div className="nivedan-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isMr ? 'निवेदने व तक्रारी' : 'Petitions & Grievances'}
          </h1>
          <p className="page-subtitle">
            {isMr
              ? 'आमदार कार्यालयातील सर्व नागरिक अर्ज, तक्रारी, पाठपुरावा व ऑटो-रूटिंग प्रणाली'
              : 'Citizen petitions, grievance tracking, and department routing system'}
          </p>
        </div>

        <div className="page-actions">
          <button className="btn-o" onClick={() => alert(isMr ? 'निवेदन अहवाल एक्सपोर्ट होत आहे...' : 'Exporting petitions log...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> {isMr ? 'एक्सपोर्ट' : 'Export'}
          </button>
          <button className="btn-o" onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={14} /> {isMr ? 'प्रिंट नोंदवही' : 'Print Log'}
          </button>
          <button className="btn-p" onClick={() => setIsFormOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> {isMr ? 'नवीन निवेदन नोंदवा' : 'New Petition'}
          </button>
        </div>
      </div>

      {/* ── Status Filter Tabs ──────────────────────────────── */}
      <div className="status-tabs-container">
        {STATUS_TABS.map((tab) => {
          const IconComp = tab.Icon;
          const isActive = filters.status === tab.id;
          return (
            <button
              key={tab.id}
              className={`status-tab-btn ${tab.tabClass} ${isActive ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <IconComp size={15} className="tab-icon" />
              <span>{isMr ? tab.labelMr : tab.labelEn}</span>
              <span className="tab-dot" />
            </button>
          );
        })}
      </div>

      {/* ── Search & Filter Bar ─────────────────────────────── */}
      <div className="nivedan-filter-bar">
        <div className="fg fg-search">
          <span className="fl">{isMr ? 'तक्रार शोधा (Search)' : 'Search Petition'}</span>
          <input
            type="text"
            className="fi"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder={isMr ? 'ट्रॅकिंग ID, नागरिकाचे नाव, विषय शोधा...' : 'Tracking ID, citizen name, subject...'}
          />
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'वर्गवारी (Category)' : 'Category'}</span>
          <select className="fi" name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
            <option value="ALL">{isMr ? 'सर्व वर्गवारी' : 'All Categories'}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {isMr ? cat.name_mr : cat.name_en || cat.name_mr}
              </option>
            ))}
          </select>
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'प्राधान्य (Priority)' : 'Priority'}</span>
          <select className="fi" name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="ALL">{isMr ? 'सर्व प्राधान्य' : 'All Priorities'}</option>
            <option value="URGENT">{isMr ? 'अतिअत्यंत (Urgent)' : 'Urgent'}</option>
            <option value="HIGH">{isMr ? 'उच्च (High)' : 'High'}</option>
            <option value="MEDIUM">{isMr ? 'मध्यम (Medium)' : 'Medium'}</option>
            <option value="LOW">{isMr ? 'सामान्य (Low)' : 'Low'}</option>
          </select>
        </div>

        <button className="filter-reset" onClick={handleResetFilters} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <RotateCcw size={14} /> {isMr ? 'फिल्टर पूर्ववत करा' : 'Reset Filters'}
        </button>
      </div>

      {/* ── Data Table ─────────────────────────────────────── */}
      <div className="nivedan-table-wrap">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>
            <p>{isMr ? 'निवेदन माहिती लोड होत आहे...' : 'Loading petitions records...'}</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}><FileText size={32} /></div>
            <h3>{isMr ? 'कोणतेही निवेदन सापडले नाही' : 'No petitions found matching filters'}</h3>
            <p>{isMr ? 'कृपया शोध किंवा फिल्टर निकष बदलून पहा.' : 'Please change your filter settings.'}</p>
          </div>
        ) : (
          <table className="nivedan-table">
            <thead>
              <tr>
                <th>{isMr ? 'ट्रॅकिंग ID' : 'Tracking ID'}</th>
                <th>{isMr ? 'नागरिकाचे नाव व संपर्क' : 'Citizen Details'}</th>
                <th>{isMr ? 'वर्गवारी' : 'Category'}</th>
                <th>{isMr ? 'विषय' : 'Subject'}</th>
                <th>{isMr ? 'प्राधान्य' : 'Priority'}</th>
                <th>{isMr ? 'दाखल दिनांक' : 'Submission Date'}</th>
                <th>{isMr ? 'स्थिती' : 'Status'}</th>
                <th style={{ textAlign: 'right' }}>{isMr ? 'कृती' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const subDateStr = item.created_at
                  ? new Date(item.created_at).toLocaleDateString(isMr ? 'mr-IN' : 'en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—';

                return (
                  <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => openDetailPage(item)}>
                    <td>
                      <span className="tracking-id">{item.tracking_id}</span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>{getLangText(item, 'citizen_name', lang)}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-3)', fontFamily: 'JetBrains Mono', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={11} /> {item.citizen_mobile}
                      </div>
                    </td>

                    <td>
                      <span className="badge-pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                        {isMr ? item.category?.name_mr : item.category?.name_en || item.category?.name_mr || '—'}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 500, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {getLangText(item, 'subject', lang)}
                      </div>
                    </td>

                    <td>{getPriorityBadge(item.priority)}</td>

                    <td style={{ fontSize: '12px', color: 'var(--text-3)' }}>{subDateStr}</td>

                    <td>{getStatusBadge(item.status)}</td>

                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn btn-outline"
                        style={{ height: '30px', padding: '0 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => openDetailPage(item)}
                      >
                        <Eye size={13} /> {isMr ? 'तपशील' : 'Details'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination Bar */}
        {!loading && meta.totalPages > 1 && (
          <div className="pagination-bar">
            <span>
              {isMr
                ? `एकूण ${meta.totalItems} पैकी पान ${meta.page} (एकूण ${meta.totalPages} पाने)`
                : `Showing Page ${meta.page} of ${meta.totalPages} (${meta.totalItems} total items)`}
            </span>

            <div className="pagination-controls">
              <button
                className="page-btn"
                disabled={meta.page <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ChevronLeft size={14} /> {isMr ? 'मागील' : 'Previous'}
              </button>
              <span style={{ fontWeight: 600, padding: '0 6px' }}>{meta.page}</span>
              <button
                className="page-btn"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
              >
                {isMr ? 'पुढील' : 'Next'} →
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
    </div>
  );
};

export default NivedanListPage;
