// src/pages/visitors/VisitorListPage.jsx
// ============================================================
// Visitor Book List Page — Redesigned Module with Clean Language Toggle
// Daily visitor summary widgets, repeat visitor badges, check-out action,
// gate pass preview & Nivedan petition conversion
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { Download, Printer, Plus, Users, CheckCircle2, Clock, RotateCcw, FileText, Zap, Phone, Sparkles, LogOut, Eye, ChevronLeft, ChevronRight, X, Landmark } from 'lucide-react';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';
import getLangText from '../../utils/langHelper.js';
import VisitorCheckInModal from './VisitorCheckInModal.jsx';
import ConvertToNivedanModal from './ConvertToNivedanModal.jsx';
import LucideIcon from '../../components/common/LucideIcon.jsx';
import './VisitorListPage.css';

const PURPOSE_LABELS = {
  GRIEVANCE: { en: 'Grievance / Petition', mr: 'तक्रार / निवेदन', color: '#1B3A5C', bg: 'rgba(27, 58, 92, 0.12)' },
  COURTESY_CALL: { en: 'Courtesy Call', mr: 'शुभेच्छा भेट', color: '#2563EB', bg: 'rgba(37, 99, 235, 0.12)' },
  PARTY_WORK: { en: 'Party Work', mr: 'पक्ष कार्य', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.12)' },
  INVITATION: { en: 'Invitation', mr: 'निमंत्रण पत्रिका', color: '#C084FC', bg: 'rgba(192, 132, 252, 0.12)' },
  PERSONAL_MEETING: { en: 'Personal Meeting', mr: 'वैयक्तिक भेट', color: '#16A34A', bg: 'rgba(22, 163, 74, 0.12)' },
  DOCUMENT_SUBMISSION: { en: 'Document Submission', mr: 'कागदपत्रे सादर', color: '#EA580C', bg: 'rgba(234, 88, 12, 0.12)' },
  FOLLOWUP: { en: 'Follow-up', mr: 'पाठपुरावा', color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.12)' },
  RECOMMENDATION: { en: 'Recommendation', mr: 'शिफारस', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.12)' },
  GENERAL_INQUIRY: { en: 'General Inquiry', mr: 'सामान्य चौकशी', color: '#64748B', bg: 'rgba(100, 116, 139, 0.12)' },
  OTHER: { en: 'Other', mr: 'इतर', color: '#475569', bg: 'rgba(71, 85, 105, 0.12)' },
};

const getInitials = (name) => {
  if (!name) return 'VB';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const VisitorListPage = () => {
  const { lang, setLang } = useLangStore();
  const isMr = lang === 'MR';

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
    status: 'ALL',
    date: new Date().toISOString().split('T')[0],
    page: 1,
  });

  // Modal States
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [selectedForConvert, setSelectedForConvert] = useState(null);
  
  // Gate Pass & Detail Modal State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 20,
      };
      if (filters.search) params.search = filters.search;
      if (filters.purpose !== 'ALL') params.purpose = filters.purpose;
      if (filters.status !== 'ALL') params.status = filters.status;
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

  // Date Navigation Stepper Handlers
  const handleDateShift = (days) => {
    const currentDate = new Date(filters.date || new Date());
    currentDate.setDate(currentDate.getDate() + days);
    const newDateStr = currentDate.toISOString().split('T')[0];
    setFilters((prev) => ({ ...prev, date: newDateStr, page: 1 }));
  };

  const handleTodayClick = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setFilters((prev) => ({ ...prev, date: todayStr, page: 1 }));
  };

  const handleCheckOut = async (visitorId) => {
    setCheckingOutId(visitorId);
    try {
      await api.patch(`/visitors/${visitorId}/checkout`);
      fetchVisitors();
    } catch (err) {
      alert(err?.response?.data?.message || (isMr ? 'चेक-आऊट करताना त्रुटी आली.' : 'Error checking out visitor.'));
    } finally {
      setCheckingOutId(null);
    }
  };

  const openConvertModal = (visitor) => {
    setSelectedForConvert(visitor);
    setIsConvertOpen(true);
  };

  const openDetailModal = (visitor) => {
    setSelectedDetail(visitor);
    setIsDetailOpen(true);
  };

  const checkedOutCount = Math.max(0, summary.totalVisitorsToday - summary.currentlyInOffice);

  return (
    <div className="visitor-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{isMr ? 'नागरिक भेट नोंदवही' : 'Visitor Book'}</h1>
        </div>
        <div className="page-actions">
          <button className="btn-o" onClick={() => alert(isMr ? 'अभ्यागत अहवाल एक्सपोर्ट होत आहे...' : 'Exporting visitor register...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> {isMr ? 'एक्सपोर्ट' : 'Export'}
          </button>
          <button className="btn-o" onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={14} /> {isMr ? 'प्रिंट नोंदवही' : 'Print Log'}
          </button>
          <button className="btn-p" onClick={() => setIsCheckInOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> {isMr ? 'नवीन भेट नोंद' : 'Check In'}
          </button>
        </div>
      </div>

      {/* ── Summary KPI Cards ────────────────────────────────── */}
      <div className="visitor-summary-grid">
        <div className="visitor-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{isMr ? 'आजचे एकूण नागरिक' : "Today's Total"}</span>
            <div className="kpi-icon-box" style={{ background: 'var(--info-bg, #EFF6FF)', color: 'var(--info, #2563EB)' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="kpi-value">{summary.totalVisitorsToday}</div>
          <div className="kpi-subtext">{isMr ? 'आज नोंदवलेली एकूण आवक भेट' : 'Total footfall registered'}</div>
        </div>

        <div className="visitor-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{isMr ? 'बाहेर गेले' : 'Checked Out'}</span>
            <div className="kpi-icon-box" style={{ background: 'var(--success-bg, #F0FDF4)', color: 'var(--success, #16A34A)' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--success, #16A34A)' }}>{checkedOutCount}</div>
          <div className="kpi-subtext">{isMr ? 'पूर्ण झालेली भेट' : 'Completed visit'}</div>
        </div>

        <div className="visitor-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{isMr ? 'कार्यालयात उपस्थित' : 'Still Inside'}</span>
            <div className="kpi-icon-box" style={{ background: 'var(--warning-bg, #FFFBEB)', color: 'var(--warning, #D97706)' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--warning, #D97706)' }}>{summary.currentlyInOffice}</div>
          <div className="kpi-subtext" style={{ color: 'var(--warning, #D97706)' }}>
            {summary.currentlyInOffice > 0 && <span className="pulse-dot"></span>} {isMr ? 'प्रतीक्षालयात उपस्थित' : 'In office / waiting'}
          </div>
        </div>

        <div className="visitor-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{isMr ? 'पुनरावृत्ती भेट देणारे' : 'Repeat Visitors'}</span>
            <div className="kpi-icon-box" style={{ background: 'var(--purple-bg, #F5F3FF)', color: 'var(--purple, #7C3AED)' }}>
              <RotateCcw size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--purple, #7C3AED)' }}>{summary.repeatVisitorsCount}</div>
          <div className="kpi-subtext">{isMr ? 'पुनरागत नागरिक नोंद इतिहास' : 'Repeat visit history'}</div>
        </div>

        <div className="visitor-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{isMr ? 'निवेदनात रूपांतरित' : 'Converted to Nivedan'}</span>
            <div className="kpi-icon-box" style={{ background: 'var(--orange-bg, #FFF7ED)', color: 'var(--orange, #EA580C)' }}>
              <FileText size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--orange, #EA580C)' }}>{summary.convertedCount}</div>
          <div className="kpi-subtext">{isMr ? 'अधिकृत अर्जात नोंदवलेले' : 'Converted to petition'}</div>
        </div>
      </div>

      {/* ── Toolbar Row: Date Stepper & Peak Traffic Banner ──── */}
      <div className="toolbar-row">
        <div className="date-nav">
          <button className="date-btn" title="Previous Day" onClick={() => handleDateShift(-1)}>
            <ChevronLeft size={16} />
          </button>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="date-current-input"
          />
          <button className="date-btn" title="Next Day" onClick={() => handleDateShift(1)}>
            <ChevronRight size={16} />
          </button>
          <button className="date-today-btn" onClick={handleTodayClick}>
            {isMr ? 'आज' : 'Today'}
          </button>
        </div>

        <div className="peak-banner">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="#eab308" /> <strong>{isMr ? 'सर्वाधिक भेट वेळ:' : 'Peak Traffic Hour:'}</strong>{' '}
            {isMr ? 'सकाळी ११:०० ते दुपारी १२:०० (१२ नागरिक)' : '11:00 AM – 12:00 PM (12 visitors)'}
          </span>
        </div>
      </div>

      {/* ── Search & Filter Bar ────────────────────────────── */}
      <div className="visitor-filter-bar">
        <div className="fg fg-search">
          <span className="fl">{isMr ? 'नागरिक शोधा' : 'Search Visitor'}</span>
          <input
            type="text"
            className="fi"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder={isMr ? 'नागरिकाचे नाव, मोबाईल किंवा कारण शोधा...' : 'Search name, mobile, address...'}
          />
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'भेटण्याचे कारण' : 'Purpose'}</span>
          <select className="fi" name="purpose" value={filters.purpose} onChange={handleFilterChange}>
            <option value="ALL">{isMr ? 'सर्व कारणे' : 'All Purposes'}</option>
            {Object.keys(PURPOSE_LABELS).map((key) => (
              <option key={key} value={key}>
                {isMr ? PURPOSE_LABELS[key].mr : PURPOSE_LABELS[key].en}
              </option>
            ))}
          </select>
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'स्थिती' : 'Status'}</span>
          <select className="fi" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="ALL">{isMr ? 'सर्व स्थिती' : 'All Status'}</option>
            <option value="INSIDE">{isMr ? 'कार्यालयात उपस्थित' : 'Inside / Waiting'}</option>
            <option value="CHECKED_OUT">{isMr ? 'बाहेर गेले' : 'Checked Out'}</option>
          </select>
        </div>

        <button
          className="filter-reset"
          onClick={() =>
            setFilters({
              search: '',
              purpose: 'ALL',
              status: 'ALL',
              date: new Date().toISOString().split('T')[0],
              page: 1,
            })
          }
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <RotateCcw size={14} /> {isMr ? 'फिल्टर पूर्ववत करा' : 'Reset Filters'}
        </button>
      </div>

      {/* ── Data Table ─────────────────────────────────────── */}
      <div className="visitor-table-wrap">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>
            <p>{isMr ? 'भेट नोंद लोड होत आहे...' : 'Loading visitor records...'}</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}><Users size={32} /></div>
            <h3>{isMr ? 'या दिवशी कोणतीही भेट नोंद सापडली नाही' : 'No visitor records found for this date'}</h3>
            <p>{isMr ? 'कृपया तारीख किंवा शोध पर्याय बदलून पहा.' : 'Please select another date or change search filter.'}</p>
          </div>
        ) : (
          <table className="visitor-table">
            <thead>
              <tr>
                <th>{isMr ? 'वेळ (Check-In)' : 'Check-In Time'}</th>
                <th>{isMr ? 'नागरिकाचे नाव व संपर्क' : 'Visitor Details'}</th>
                <th>{isMr ? 'भेट इतिहास' : 'Repeat Visit'}</th>
                <th>{isMr ? 'ग्राम / पत्ता' : 'Village / Address'}</th>
                <th>{isMr ? 'भेटण्याचे कारण व जोडणी' : 'Purpose & Link'}</th>
                <th>{isMr ? 'स्थिती' : 'Status'}</th>
                <th style={{ textAlign: 'right' }}>{isMr ? 'कृती' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const purposeCfg = PURPOSE_LABELS[item.purpose] || PURPOSE_LABELS.OTHER;
                const inTimeStr = new Date(item.check_in_time).toLocaleTimeString(isMr ? 'mr-IN' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const outTimeStr = item.check_out_time
                  ? new Date(item.check_out_time).toLocaleTimeString(isMr ? 'mr-IN' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : null;

                return (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 600 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {inTimeStr}</span>
                    </td>

                    <td>
                      <div className="visitor-cell">
                        <div className="visitor-avatar">{getInitials(getLangText(item, 'visitor_name', lang))}</div>
                        <div className="visitor-meta">
                          <span className="visitor-name">{getLangText(item, 'visitor_name', lang)}</span>
                          <span className="visitor-contact">
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={12} /> {item.mobile}
                            </span>
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      {item.is_repeat_visitor ? (
                        <span className="badge-pill badge-repeat" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <RotateCcw size={12} /> {item.previous_visit_count} {isMr ? 'वेळ भेट' : 'rd Visit'}
                        </span>
                      ) : (
                        <span className="badge-pill badge-first" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={12} /> {isMr ? 'पहिली भेट' : 'First Visit'}
                        </span>
                      )}
                    </td>

                    <td>{item.address_line || item.city || (isMr ? 'राहाता' : 'Rahata')}</td>

                    <td>
                      <span className="badge-pill" style={{ backgroundColor: purposeCfg.bg, color: purposeCfg.color }}>
                        {isMr ? purposeCfg.mr : purposeCfg.en}
                      </span>
                      {item.linked_nivedan_id && (
                        <div>
                          <span className="linked-nivedan-badge">NIV-LINKED</span>
                        </div>
                      )}
                    </td>

                    <td>
                      {outTimeStr ? (
                        <span className="badge-pill badge-out" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <LogOut size={12} /> {isMr ? `बाहेर: ${outTimeStr}` : `Checked Out (${outTimeStr})`}
                        </span>
                      ) : (
                        <span className="badge-pill badge-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span className="pulse-dot"></span> {isMr ? 'कार्यालयात उपस्थित' : 'Inside / Waiting'}
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div className="act-group">
                        {!outTimeStr && (
                          <button
                            className="btn-act checkout"
                            title="Mark Check-Out"
                            onClick={() => handleCheckOut(item.id)}
                            disabled={checkingOutId === item.id}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <LogOut size={13} /> {checkingOutId === item.id ? '...' : isMr ? 'चेक-आऊट' : 'Check Out'}
                          </button>
                        )}

                        {!item.linked_nivedan_id && item.purpose === 'GRIEVANCE' && (
                          <button
                            className="btn-act convert"
                            title="Convert to Nivedan"
                            onClick={() => openConvertModal(item)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <FileText size={13} /> {isMr ? 'निवेदनात नोंद' : 'Convert'}
                          </button>
                        )}

                        <button
                          className="btn-act"
                          title="View Gate Pass Details"
                          onClick={() => openDetailModal(item)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={13} /> {isMr ? 'तपशील' : 'Details'}
                        </button>
                      </div>
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
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                {isMr ? 'पुढील' : 'Next'} <ChevronRight size={14} />
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

      {/* ── Visitor Detail & Gate Pass Modal ──────────────── */}
      {isDetailOpen && selectedDetail && (
        <div className="modal-overlay" onClick={() => setIsDetailOpen(false)}>
          <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{isMr ? 'अभ्यागत माहिती व गेट पास' : 'Visitor Details & Gate Pass'}</h3>
              <button className="modal-close-btn" onClick={() => setIsDetailOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="visitor-cell" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                <div className="visitor-avatar" style={{ width: '42px', height: '42px', fontSize: '15px' }}>
                  {getInitials(getLangText(selectedDetail, 'visitor_name', lang))}
                </div>
                <div className="visitor-meta">
                  <span className="visitor-name" style={{ fontSize: '16px' }}>{getLangText(selectedDetail, 'visitor_name', lang)}</span>
                  <span className="visitor-contact" style={{ fontSize: '13px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Phone size={13} /> {selectedDetail.mobile}</span> · {selectedDetail.address_line || 'राहाता'}
                  </span>
                </div>
              </div>

              <div className="gate-pass-ticket">
                <div className="pass-header">
                  <span className="pass-brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Landmark size={16} /> MLA E-OFFICE GATE PASS</span>
                  <span className="pass-tag">ENTRY PERMIT</span>
                </div>
                <div className="pass-grid">
                  <div>
                    <div className="pass-lbl">{isMr ? 'टोकन क्रमांक' : 'Token Reference'}</div>
                    <div className="pass-val" style={{ fontFamily: 'JetBrains Mono', color: 'var(--primary)' }}>
                      #VB-2026-{String(selectedDetail.id).padStart(3, '0')}
                    </div>
                  </div>
                  <div>
                    <div className="pass-lbl">{isMr ? 'आवक वेळ' : 'Check-In Time'}</div>
                    <div className="pass-val" style={{ fontFamily: 'JetBrains Mono' }}>
                      {new Date(selectedDetail.check_in_time).toLocaleTimeString(isMr ? 'mr-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div>
                    <div className="pass-lbl">{isMr ? 'भेटण्याचे कारण' : 'Purpose of Visit'}</div>
                    <div className="pass-val">
                      {isMr
                        ? PURPOSE_LABELS[selectedDetail.purpose]?.mr || selectedDetail.purpose
                        : PURPOSE_LABELS[selectedDetail.purpose]?.en || selectedDetail.purpose}
                    </div>
                  </div>
                  <div>
                    <div className="pass-lbl">{isMr ? 'जोडलेले निवेदन' : 'Linked Petition'}</div>
                    <div className="pass-val" style={{ fontFamily: 'JetBrains Mono' }}>
                      {selectedDetail.linked_nivedan_id ? `NIV-${selectedDetail.linked_nivedan_id}` : (isMr ? 'काहीही नाही' : 'None')}
                    </div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <div className="pass-lbl">{isMr ? 'सध्याची स्थिती' : 'Status'}</div>
                    <div className="pass-val" style={{ color: selectedDetail.check_out_time ? 'var(--info)' : 'var(--warning)' }}>
                      {selectedDetail.check_out_time
                        ? (isMr
                            ? `बाहेर पडण्याची वेळ: ${new Date(selectedDetail.check_out_time).toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })}`
                            : `Checked Out at ${new Date(selectedDetail.check_out_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`)
                        : (isMr ? 'कार्यालयात उपस्थित (प्रतीक्षालयात)' : 'Inside / Waiting in office')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Printer size={14} /> {isMr ? 'पास प्रिंट करा' : 'Print Ticket'}
              </button>
              <button className="btn btn-primary" onClick={() => setIsDetailOpen(false)}>
                {isMr ? 'बंद करा' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorListPage;
