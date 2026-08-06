// src/pages/DashboardPage.jsx
// ============================================================
// MLA E-Office — Enterprise Dashboard Page
// 100% Dynamic Backend API integration (/api/v1/dashboard/summary)
// Multi-language (EN / Marathi) + Dark Mode ready
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import api from '../services/api.js';
import useAuthStore from '../store/authStore.js';
import useLangStore from '../store/langStore.js';
import LucideIcon from '../components/common/LucideIcon.jsx';
import './DashboardPage.css';

// Translation Dictionary for English and Marathi
const t = {
  EN: {
    title: 'Dashboard',
    welcomeBack: 'Welcome back',
    lastUpdated: 'Last updated',
    exportBtn: 'Export',
    newNivedanBtn: 'New Nivedan',
    kpis: {
      nivedans: 'Total Nivedans',
      pending: 'Pending',
      visitors: "Today's Visitors",
      devWorks: 'Active Dev Works',
    },
    monthlyTrendTitle: 'Monthly Nivedan Trend',
    monthlyTrendSub: 'Last 6 months — Received vs Resolved',
    donutTitle: 'Nivedans by Status',
    donutSub: 'Current distribution',
    donutLegend: {
      pending: 'Pending',
      inProgress: 'In Progress',
      resolved: 'Resolved',
      rejected: 'Rejected',
    },
    recentActivityTitle: 'Recent Activity',
    viewAll: 'View All →',
    upcomingEventsTitle: 'Upcoming Events',
    calendarLink: 'Calendar →',
    noActivities: 'No recent activities found in database.',
    noEvents: 'No upcoming events scheduled.',
  },
  MR: {
    title: 'डॅशबोर्ड',
    welcomeBack: 'पुन्हा स्वागत आहे',
    lastUpdated: 'अद्ययावत वेळ',
    exportBtn: 'निर्यात करा',
    newNivedanBtn: 'नवीन निवेदन',
    kpis: {
      nivedans: 'एकूण निवेदने',
      pending: 'प्रलंबित',
      visitors: 'आजचे अभ्यागत',
      devWorks: 'सुरू विकासकामे',
    },
    monthlyTrendTitle: 'मासिक निवेदन ट्रेंड',
    monthlyTrendSub: 'मागील ६ महिने — प्राप्त विरुद्ध निकाली',
    donutTitle: 'स्थितीनुसार निवेदने',
    donutSub: 'सध्याचे वितरण',
    donutLegend: {
      pending: 'प्रलंबित',
      inProgress: 'प्रगतीपथावर',
      resolved: 'निकाली',
      rejected: 'नाकारले',
    },
    recentActivityTitle: 'अलीकडील क्रिया',
    viewAll: 'सर्व पहा →',
    upcomingEventsTitle: 'आगामी कार्यक्रम',
    calendarLink: 'दिनदर्शिका →',
    noActivities: 'डेटाबेसमध्ये कोणत्याही अलीकडील क्रिया आढळल्या नाहीत.',
    noEvents: 'कोणतेही आगामी कार्यक्रम नियोजित नाहीत.',
  },
};

const DashboardPage = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { lang } = useLangStore();

  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get('/dashboard/summary');
        setSummaryData(data.data);
      } catch (err) {
        console.error('Failed to load dashboard summary:', err);
        setError('डॅशबोर्ड माहिती लोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const text = t[lang] || t.EN;

  const getFormattedDate = () => {
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return dateStr;
  };

  const username = user?.full_name || user?.username || 'Rajesh Deshmukh';

  // Destructure dynamic backend data
  const dist = summaryData?.statusDistribution || {
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  };

  const nivedanStat = summaryData?.stats?.find((s) => s.key === 'nivedans');
  const pendingStat = summaryData?.stats?.find((s) => s.key === 'pending');
  const visitorStat = summaryData?.stats?.find((s) => s.key === 'visitors');
  const devWorkStat = summaryData?.stats?.find((s) => s.key === 'devWorks');

  const activities = summaryData?.activities || [];
  const events = summaryData?.upcomingEvents || [];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <div className="mini-spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
        <p style={{ fontFamily: 'Noto Sans Devanagari, sans-serif', fontSize: '1rem', color: '#64748b' }}>
          {lang === 'MR' ? 'डॅशबोर्ड माहिती लोड होत आहे...' : 'Loading Dashboard Metrics...'}
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-page-container">
      {/* ── Page Header & Quick Actions ─────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{text.title}</h1>
          <p className="page-subtitle">
            <span className="welcome-text">{text.welcomeBack}, {username}</span>
            <span className="last-updated-sep"> · </span>
            <span className="last-updated-text">{text.lastUpdated}: {getFormattedDate()}</span>
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/reports')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={16} />
            {text.exportBtn}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/nivedan/new')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            {text.newNivedanBtn}
          </button>
        </div>
      </div>

      {/* ── KPI Stat Cards ──────────────────────────────────── */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{text.kpis.nivedans}</span>
            <div className="kpi-icon" style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563EB' }}>
              <LucideIcon name="nivedan" size={22} />
            </div>
          </div>
          <div className="kpi-value">
            {nivedanStat ? nivedanStat.count?.toLocaleString() : dist.total?.toLocaleString() ?? 0}
          </div>
          <div className="kpi-trend up">
            {lang === 'MR'
              ? (nivedanStat?.trend || 'थेट डेटा जोडला')
              : (nivedanStat?.trendEn || `${nivedanStat?.count ?? 0} entries recorded`)}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{text.kpis.pending}</span>
            <div className="kpi-icon" style={{ background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
              <LucideIcon name="clock" size={22} />
            </div>
          </div>
          <div className="kpi-value">
            {pendingStat ? pendingStat.count?.toLocaleString() : dist.pending?.toLocaleString() ?? 0}
          </div>
          <div className="kpi-trend down">
            {lang === 'MR'
              ? (pendingStat?.trend || 'सर्व पूर्ण')
              : (pendingStat?.trendEn || `${pendingStat?.count ?? 0} pending`)}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{text.kpis.visitors}</span>
            <div className="kpi-icon" style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
              <LucideIcon name="visitor" size={22} />
            </div>
          </div>
          <div className="kpi-value">
            {visitorStat ? visitorStat.count?.toLocaleString() : 0}
          </div>
          <div className="kpi-trend up">
            {lang === 'MR'
              ? (visitorStat?.trend || 'नवीन नोंदणी उपलब्ध')
              : (visitorStat?.trendEn || `${visitorStat?.count ?? 0} visits today`)}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{text.kpis.devWorks}</span>
            <div className="kpi-icon" style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
              <LucideIcon name="devworks" size={22} />
            </div>
          </div>
          <div className="kpi-value">
            {devWorkStat ? devWorkStat.count?.toLocaleString() : 0}
          </div>
          <div className="kpi-trend up">
            {lang === 'MR'
              ? (devWorkStat?.trend || 'काम नोंदणी उपलब्ध')
              : (devWorkStat?.trendEn || `${devWorkStat?.count ?? 0} active projects`)}
          </div>
        </div>
      </div>

      {/* ── Charts Grid (Line & Donut SVG) ──────────────────── */}
      <div className="charts-grid">
        {/* Line Chart */}
        <div className="chart-card">
          <div className="chart-title">{text.monthlyTrendTitle}</div>
          <div className="chart-subtitle">{text.monthlyTrendSub}</div>
          <div className="chart-placeholder">
            <svg className="line-chart" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B3A5C" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#1B3A5C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line className="grid-line" x1="0" y1="50" x2="500" y2="50" />
              <line className="grid-line" x1="0" y1="100" x2="500" y2="100" />
              <line className="grid-line" x1="0" y1="150" x2="500" y2="150" />
              <text className="axis-label" x="40" y="195">Mar</text>
              <text className="axis-label" x="130" y="195">Apr</text>
              <text className="axis-label" x="220" y="195">May</text>
              <text className="axis-label" x="310" y="195">Jun</text>
              <text className="axis-label" x="395" y="195">Jul</text>
              <text className="axis-label" x="465" y="195">Aug</text>
              <path className="data-area" d="M40,170 L130,170 L220,170 L310,170 L395,170 L465,130 L465,180 L40,180 Z" />
              <polyline className="data-line-1" points="40,170 130,170 220,170 310,170 395,170 465,130" />
              <polyline className="data-line-2" points="40,175 130,175 220,175 310,175 395,175 465,150" />
              <circle cx="465" cy="130" r="4" fill="#1B3A5C" />
              <circle cx="465" cy="150" r="3" fill="#2563EB" />
            </svg>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="chart-card">
          <div className="chart-title">{text.donutTitle}</div>
          <div className="chart-subtitle">{text.donutSub}</div>
          <div className="chart-placeholder">
            <div className="donut-container">
              <svg className="donut-svg" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="60" fill="none" stroke="var(--border, #DDE3EB)" strokeWidth="20" />
                {dist.total > 0 && (
                  <>
                    <circle
                      cx="80" cy="80" r="60" fill="none" stroke="#D97706" strokeWidth="20"
                      strokeDasharray={`${(dist.pending / dist.total) * 376.99} 376.99`}
                      strokeDashoffset="0" transform="rotate(-90 80 80)"
                    />
                    <circle
                      cx="80" cy="80" r="60" fill="none" stroke="#2563EB" strokeWidth="20"
                      strokeDasharray={`${(dist.inProgress / dist.total) * 376.99} 376.99`}
                      strokeDashoffset={`-${(dist.pending / dist.total) * 376.99}`} transform="rotate(-90 80 80)"
                    />
                    <circle
                      cx="80" cy="80" r="60" fill="none" stroke="#16A34A" strokeWidth="20"
                      strokeDasharray={`${(dist.resolved / dist.total) * 376.99} 376.99`}
                      strokeDashoffset={`-${((dist.pending + dist.inProgress) / dist.total) * 376.99}`} transform="rotate(-90 80 80)"
                    />
                    <circle
                      cx="80" cy="80" r="60" fill="none" stroke="#DC2626" strokeWidth="20"
                      strokeDasharray={`${(dist.rejected / dist.total) * 376.99} 376.99`}
                      strokeDashoffset={`-${((dist.pending + dist.inProgress + dist.resolved) / dist.total) * 376.99}`} transform="rotate(-90 80 80)"
                    />
                  </>
                )}
                <text x="80" y="76" textAnchor="middle" fill="var(--text-1, #0F172A)" fontSize="20" fontWeight="700" fontFamily="Inter">
                  {dist.total?.toLocaleString() ?? 0}
                </text>
                <text x="80" y="93" textAnchor="middle" fill="var(--text-3, #64748B)" fontSize="10" fontFamily="Inter">
                  {lang === 'MR' ? 'एकूण' : 'Total'}
                </text>
              </svg>

              <div className="donut-legend">
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#D97706' }} />
                  {text.donutLegend.pending} <span className="legend-val">{dist.pending || 0}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#2563EB' }} />
                  {text.donutLegend.inProgress} <span className="legend-val">{dist.inProgress || 0}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#16A34A' }} />
                  {text.donutLegend.resolved} <span className="legend-val">{dist.resolved || 0}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#DC2626' }} />
                  {text.donutLegend.rejected} <span className="legend-val">{dist.rejected || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Grid (Recent Activity + Upcoming Events) ──── */}
      <div className="bottom-grid">
        {/* Recent Activity */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">{text.recentActivityTitle}</span>
            <button
              type="button"
              className="panel-link"
              onClick={() => navigate('/nivedan')}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              {text.viewAll}
            </button>
          </div>
          <div className="panel-body">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className="activity-item">
                  <span
                    className="activity-dot"
                    style={{
                      background:
                        act.statusColor === 'success'
                          ? '#16A34A'
                          : act.statusColor === 'warning'
                            ? '#D97706'
                            : act.statusColor === 'danger'
                              ? '#DC2626'
                              : '#2563EB',
                    }}
                  />
                  <div>
                    <div className="activity-text">
                      <strong>{act.referenceId}</strong> — {act.title}
                    </div>
                    <div className="activity-time">{act.timeAgo || act.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', color: 'var(--text-3, #64748B)', fontSize: '13px' }}>
                {text.noActivities}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">{text.upcomingEventsTitle}</span>
            <button
              type="button"
              className="panel-link"
              onClick={() => navigate('/calendar')}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              {text.calendarLink}
            </button>
          </div>
          <div className="panel-body">
            {events.length > 0 ? (
              events.map((evt) => (
                <div key={evt.id} className="event-item">
                  <div className="event-date">
                    <span className="day">{evt.day}</span>
                    <span className="month">{evt.month}</span>
                  </div>
                  <div className="event-info">
                    <div className="event-title">{evt.title}</div>
                    <div className="event-meta">{evt.meta}</div>
                  </div>
                  <span
                    className="event-badge"
                    style={{
                      background: evt.badgeBg || '#EFF6FF',
                      color: evt.badgeColor || '#2563EB',
                    }}
                  >
                    {evt.badge}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', color: 'var(--text-3, #64748B)', fontSize: '13px' }}>
                {text.noEvents}
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default DashboardPage;
