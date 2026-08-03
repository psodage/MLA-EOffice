// src/pages/DashboardPage.jsx
// ============================================================
// MLA E-Office — Enterprise Dashboard Page
// Dynamic Backend API integration (/api/v1/dashboard/summary)
// Multi-language (EN / Marathi) + Dark Mode ready
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import useAuthStore from '../store/authStore.js';
import './DashboardPage.css';

// Translation Dictionary for English and Marathi
const t = {
  EN: {
    title: 'Dashboard',
    titleMr: 'डॅशबोर्ड',
    welcomeBack: 'Welcome back',
    lastUpdated: 'Last updated',
    exportBtn: '📥 Export',
    newNivedanBtn: '+ New Nivedan',
    kpis: {
      nivedans: 'Total Nivedans',
      nivedansMr: 'एकूण निवेदने',
      nivedansTrend: '↑ 12% from last month',
      pending: 'Pending',
      pendingMr: 'प्रलंबित',
      pendingTrend: '↑ 8% from last month',
      visitors: "Today's Visitors",
      visitorsMr: 'आजचे अभ्यागत',
      visitorsTrend: '↑ 5 more than yesterday',
      devWorks: 'Active Dev Works',
      devWorksMr: 'सुरू विकासकामे',
      devWorksTrend: '3 completed this week',
    },
    monthlyTrendTitle: 'Monthly Nivedan Trend',
    monthlyTrendTitleMr: 'मासिक निवेदन ट्रेंड',
    monthlyTrendSub: 'Last 6 months — Received vs Resolved',
    donutTitle: 'Nivedans by Status',
    donutTitleMr: 'स्थितीनुसार निवेदने',
    donutSub: 'Current distribution',
    donutLegend: {
      pending: 'Pending · प्रलंबित',
      inProgress: 'In Progress · सुरू',
      resolved: 'Resolved · निकाली',
      rejected: 'Rejected · नाकारले',
    },
    recentActivityTitle: 'Recent Activity',
    recentActivityTitleMr: 'अलीकडील क्रिया',
    viewAll: 'View All →',
    upcomingEventsTitle: 'Upcoming Events',
    upcomingEventsTitleMr: 'आगामी कार्यक्रम',
    calendarLink: 'Calendar →',
  },
  MR: {
    title: 'डॅशबोर्ड',
    titleMr: 'Dashboard',
    welcomeBack: 'पुन्हा स्वागत आहे',
    lastUpdated: 'सर्व्हेक्षण वेळ',
    exportBtn: '📥 निर्यात (Export)',
    newNivedanBtn: '+ नवीन निवेदन',
    kpis: {
      nivedans: 'एकूण निवेदने',
      nivedansMr: 'Total Nivedans',
      nivedansTrend: '↑ १२% मागील महिन्यापेक्षा',
      pending: 'प्रलंबित',
      pendingMr: 'Pending',
      pendingTrend: '↑ ८% मागील महिन्यापेक्षा',
      visitors: 'आजचे अभ्यागत',
      visitorsMr: "Today's Visitors",
      visitorsTrend: '↑ ५ कालपेक्षा जास्त',
      devWorks: 'सुरू विकासकामे',
      devWorksMr: 'Active Dev Works',
      devWorksTrend: '३ या आठवड्यात पूर्ण',
    },
    monthlyTrendTitle: 'मासिक निवेदन ट्रेंड',
    monthlyTrendTitleMr: 'Monthly Nivedan Trend',
    monthlyTrendSub: 'मागील ६ महिने — प्राप्त विरुद्ध निकाली',
    donutTitle: 'स्थितीनुसार निवेदने',
    donutTitleMr: 'Nivedans by Status',
    donutSub: 'सध्याचे वितरण',
    donutLegend: {
      pending: 'प्रलंबित (Pending)',
      inProgress: 'सुरू (In Progress)',
      resolved: 'निकाली (Resolved)',
      rejected: 'नाकारले (Rejected)',
    },
    recentActivityTitle: 'अलीकडील क्रिया',
    recentActivityTitleMr: 'Recent Activity',
    viewAll: 'सर्व पहा →',
    upcomingEventsTitle: 'आगामी कार्यक्रम',
    upcomingEventsTitleMr: 'Upcoming Events',
    calendarLink: 'दिनदर्शिका →',
  },
};

const DashboardPage = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState(() => localStorage.getItem('mla_lang') || 'EN');

  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Listen for language changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const currentLang = localStorage.getItem('mla_lang') || 'EN';
      setLang(currentLang);
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

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

  // Destructure backend data with safe defaults
  const dist = summaryData?.statusDistribution || {
    total: 1247,
    pending: 342,
    inProgress: 274,
    resolved: 498,
    rejected: 133,
  };

  const activities = summaryData?.activities || [];
  const events = summaryData?.upcomingEvents || [];

  return (
    <div className="dashboard-page-container">
      {/* ── Page Header & Quick Actions ─────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {text.title} · <span className="mr">{text.titleMr}</span>
          </h1>
          <p className="page-subtitle">
            {text.welcomeBack}, {username} · {text.lastUpdated}: {getFormattedDate()}
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/reports')}
          >
            {text.exportBtn}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/nivedan/new')}
          >
            {text.newNivedanBtn}
          </button>
        </div>
      </div>

      {/* ── KPI Stat Cards ──────────────────────────────────── */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">
              {text.kpis.nivedans} · <span className="mr">{text.kpis.nivedansMr}</span>
            </span>
            <div className="kpi-icon" style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563EB' }}>
              📝
            </div>
          </div>
          <div className="kpi-value">
            {summaryData?.stats?.find((s) => s.key === 'nivedans')?.count?.toLocaleString() || dist.total?.toLocaleString() || '1,247'}
          </div>
          <div className="kpi-trend up">{text.kpis.nivedansTrend}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">
              {text.kpis.pending} · <span className="mr">{text.kpis.pendingMr}</span>
            </span>
            <div className="kpi-icon" style={{ background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
              ⏳
            </div>
          </div>
          <div className="kpi-value">
            {summaryData?.stats?.find((s) => s.key === 'pending')?.count?.toLocaleString() || dist.pending?.toLocaleString() || '342'}
          </div>
          <div className="kpi-trend down">{text.kpis.pendingTrend}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">
              {text.kpis.visitors} · <span className="mr">{text.kpis.visitorsMr}</span>
            </span>
            <div className="kpi-icon" style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16A34A' }}>
              👤
            </div>
          </div>
          <div className="kpi-value">
            {summaryData?.stats?.find((s) => s.key === 'visitors')?.count?.toLocaleString() || '47'}
          </div>
          <div className="kpi-trend up">{text.kpis.visitorsTrend}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">
              {text.kpis.devWorks} · <span className="mr">{text.kpis.devWorksMr}</span>
            </span>
            <div className="kpi-icon" style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED' }}>
              🏗️
            </div>
          </div>
          <div className="kpi-value">
            {summaryData?.stats?.find((s) => s.key === 'devWorks')?.count?.toLocaleString() || '23'}
          </div>
          <div className="kpi-trend up">{text.kpis.devWorksTrend}</div>
        </div>
      </div>

      {/* ── Charts Grid (Line & Donut SVG) ──────────────────── */}
      <div className="charts-grid">
        {/* Line Chart */}
        <div className="chart-card">
          <div className="chart-title">
            {text.monthlyTrendTitle} · <span className="mr">{text.monthlyTrendTitleMr}</span>
          </div>
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
              <path className="data-area" d="M40,130 L130,110 L220,90 L310,70 L395,80 L465,55 L465,180 L40,180 Z" />
              <polyline className="data-line-1" points="40,130 130,110 220,90 310,70 395,80 465,55" />
              <polyline className="data-line-2" points="40,150 130,130 220,120 310,100 395,90 465,75" />
              <circle cx="465" cy="55" r="4" fill="#1B3A5C" />
              <circle cx="465" cy="75" r="3" fill="#2563EB" />
            </svg>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="chart-card">
          <div className="chart-title">
            {text.donutTitle} · <span className="mr">{text.donutTitleMr}</span>
          </div>
          <div className="chart-subtitle">{text.donutSub}</div>
          <div className="chart-placeholder">
            <div className="donut-container">
              <svg className="donut-svg" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="60" fill="none" stroke="var(--border, #DDE3EB)" strokeWidth="20" />
                <circle
                  cx="80" cy="80" r="60" fill="none" stroke="#D97706" strokeWidth="20"
                  strokeDasharray="103.67 273.62" strokeDashoffset="0" transform="rotate(-90 80 80)"
                />
                <circle
                  cx="80" cy="80" r="60" fill="none" stroke="#2563EB" strokeWidth="20"
                  strokeDasharray="82.94 294.35" strokeDashoffset="-103.67" transform="rotate(-90 80 80)"
                />
                <circle
                  cx="80" cy="80" r="60" fill="none" stroke="#16A34A" strokeWidth="20"
                  strokeDasharray="150.8 226.49" strokeDashoffset="-186.61" transform="rotate(-90 80 80)"
                />
                <circle
                  cx="80" cy="80" r="60" fill="none" stroke="#DC2626" strokeWidth="20"
                  strokeDasharray="39.88 337.41" strokeDashoffset="-337.41" transform="rotate(-90 80 80)"
                />
                <text x="80" y="76" textAnchor="middle" fill="var(--text-1, #0F172A)" fontSize="20" fontWeight="700" fontFamily="Inter">
                  {dist.total?.toLocaleString() || '1,247'}
                </text>
                <text x="80" y="93" textAnchor="middle" fill="var(--text-3, #64748B)" fontSize="10" fontFamily="Inter">
                  Total
                </text>
              </svg>

              <div className="donut-legend">
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#D97706' }} />
                  {text.donutLegend.pending} <span className="legend-val">{dist.pending}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#2563EB' }} />
                  {text.donutLegend.inProgress} <span className="legend-val">{dist.inProgress}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#16A34A' }} />
                  {text.donutLegend.resolved} <span className="legend-val">{dist.resolved}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#DC2626' }} />
                  {text.donutLegend.rejected} <span className="legend-val">{dist.rejected}</span>
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
            <span className="panel-title">
              {text.recentActivityTitle} · <span className="mr">{text.recentActivityTitleMr}</span>
            </span>
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
                          : act.statusColor === 'purple'
                          ? '#7C3AED'
                          : '#2563EB',
                    }}
                  />
                  <div>
                    <div className="activity-text">
                      <strong>{act.referenceId || act.title}</strong> — {act.title}
                    </div>
                    <div className="activity-time">{act.timeAgo || act.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', color: 'var(--text-3)' }}>No recent activities found</div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">
              {text.upcomingEventsTitle} · <span className="mr">{text.upcomingEventsTitleMr}</span>
            </span>
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
              <div style={{ padding: '20px', color: 'var(--text-3)' }}>No upcoming events found</div>
            )}
          </div>
        </div>
      </div>

      {/* Wireframe Watermark Badge */}
      <div className="dashboard-wireframe-badge">WIREFRAME · DASHBOARD</div>
    </div>
  );
};

export default DashboardPage;
