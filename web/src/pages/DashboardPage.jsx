// src/pages/DashboardPage.jsx
// ============================================================
// Dashboard Page — Module 4
// Role-aware summary stat cards, recent activity feed,
// quick actions, and bilingual Marathi/English presentation.
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import useAuthStore from '../store/authStore.js';
import './DashboardPage.css';

// SVG Icon dictionary for dashboard stat cards & activities
const DashboardIcons = {
  FileText: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  ),
  Building: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line>
      <line x1="12" y1="18" x2="12" y2="18.01"></line><line x1="12" y1="14" x2="12" y2="14.01"></line>
    </svg>
  ),
  Users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  UserCheck: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>
    </svg>
  ),
  Clock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12" y2="17.01"></line>
    </svg>
  ),
  Inbox: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
    </svg>
  ),
  FilePlus: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line>
      <line x1="9" y1="15" x2="15" y2="15"></line>
    </svg>
  ),
  CheckSquare: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"></polyline>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  ),
  MapPin: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Camera: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  ),
  PlusCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  ),
  UserPlus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line>
      <line x1="17" y1="11" x2="23" y2="11"></line>
    </svg>
  ),
  Sparkles: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c.132 0 .263 0 .393 0M5 21l.5-.5M19 21l-.5-.5M12 21v-3M4.5 9h3M16.5 9h3M12 6V3"></path>
      <path d="M9.9 4.24l1.6 3.25a1 1 0 0 0 .45.45l3.25 1.6a.5.5 0 0 1 0 .9l-3.25 1.6a1 1 0 0 0-.45.45l-1.6 3.25a.5.5 0 0 1-.9 0l-1.6-3.25a1 1 0 0 0-.45-.45l-3.25-1.6a.5.5 0 0 1 0-.9l3.25-1.6a1 1 0 0 0 .45-.45l1.6-3.25a.5.5 0 0 1 .9 0z"></path>
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Upload: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  ),
  BarChart2: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  ),
};

const DashboardPage = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = new Date().toLocaleDateString('mr-IN', options);
    const dateStrEn = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    return `${dateStr} • ${dateStrEn}`;
  };

  if (loading) {
    return (
      <div className="dashboard-loading-screen">
        <div className="loading-spinner"></div>
        <p className="loading-text-mr">डॅशबोर्ड माहिती लोड होत आहे...</p>
        <p className="loading-text-en">Loading role-specific dashboard metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error-state">
        <div className="error-icon">⚠️</div>
        <h3>माहिती लोड करण्यात अडचण</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          पुन्हा प्रयत्न करा / Retry
        </button>
      </div>
    );
  }

  const { stats = [], activities = [], quickActions = [] } = summaryData || {};

  return (
    <div className="dashboard-page-container">
      {/* ── Top Greeting Header ─────────────────────────────── */}
      <section className="welcome-banner">
        <div className="welcome-text-group">
          <div className="greeting-badge">
            <span className="role-dot"></span>
            <span>{summaryData?.role} भूमिका / ROLE</span>
          </div>
          <h1 className="welcome-title">
            नमस्कार, {user?.full_name || user?.username}!
          </h1>
          <p className="welcome-subtitle">
            आमदार ई-कार्यालय डॅशबोर्ड — मतदारसंघातील कार्यप्रणालीचे विहंगावलोकन
          </p>
        </div>
        <div className="date-display-box">
          <span className="calendar-icon">📅</span>
          <span className="date-text">{getFormattedDate()}</span>
        </div>
      </section>

      {/* ── Quick Action Shortcuts Bar ─────────────────────── */}
      {quickActions.length > 0 && (
        <section className="quick-actions-section">
          <div className="section-header-mini">
            <h3>⚡ जलद कृती / Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action) => {
              const IconComponent = DashboardIcons[action.icon] || DashboardIcons.PlusCircle;
              return (
                <button
                  key={action.id}
                  className={`quick-action-card ${action.primary ? 'primary-action' : ''}`}
                  onClick={() => navigate(action.path)}
                >
                  <span className="action-icon-wrapper">
                    <IconComponent />
                  </span>
                  <div className="action-label-block">
                    <span className="action-label-mr">{action.label}</span>
                    <span className="action-label-en">{action.labelEn}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Role-Aware Summary Stat Cards ──────────────────── */}
      <section className="stat-cards-section">
        <div className="section-header">
          <h2>📊 मुख्य कार्यप्रदर्शन दर्शक / Key Statistics</h2>
          <span className="last-updated-tag">थेट अपडेट / Live Updates</span>
        </div>

        <div className="stat-cards-grid">
          {stats.map((stat) => {
            const IconComponent = DashboardIcons[stat.icon] || DashboardIcons.FileText;
            return (
              <div key={stat.key} className={`stat-card card-color-${stat.color || 'blue'}`}>
                <div className="stat-card-top">
                  <div className="stat-icon-badge">
                    <IconComponent />
                  </div>
                  {stat.badge && (
                    <span className={`stat-badge badge-${stat.badgeColor || 'warning'}`}>
                      {stat.badge}
                    </span>
                  )}
                </div>

                <div className="stat-card-content">
                  <div className="stat-value-group">
                    <span className="stat-number">{stat.count}</span>
                    <span className="stat-unit">{stat.unit}</span>
                  </div>

                  <h3 className="stat-title-mr">{stat.title}</h3>
                  <span className="stat-title-en">{stat.titleEn}</span>

                  {stat.trend && (
                    <div className="stat-trend-bar">
                      <span className="trend-dot"></span>
                      <span className="trend-text">{stat.trend}</span>
                    </div>
                  )}

                  {/* Breakdown details if present */}
                  {stat.breakdown && (
                    <div className="stat-breakdown-list">
                      {Object.entries(stat.breakdown).map(([k, v]) => (
                        <div key={k} className="breakdown-item">
                          <span className="breakdown-key">{formatBreakdownKey(k)}</span>
                          <span className="breakdown-val">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Two Column Bottom Section (Activity Feed + Overview Widget) ── */}
      <div className="dashboard-grid-two-col">
        {/* Recent Activity List */}
        <section className="activity-feed-card">
          <div className="card-header">
            <h3>📋 अलीकडील घडामोडी / Recent Activity</h3>
            <span className="activity-count-badge">{activities.length} नवीन</span>
          </div>

          <div className="activity-list">
            {activities.map((act) => {
              const IconComp = DashboardIcons.FileText;
              return (
                <div key={act.id} className="activity-item">
                  <div className={`activity-type-icon type-${act.type}`}>
                    <IconComp />
                  </div>

                  <div className="activity-content">
                    <div className="activity-top-row">
                      <span className="activity-ref-id">{act.referenceId}</span>
                      <span className="activity-time">{act.time} ({act.timeAgo})</span>
                    </div>

                    <h4 className="activity-title-mr">{act.title}</h4>
                    <p className="activity-title-en">{act.subtitle}</p>

                    <div className="activity-footer">
                      <span className="activity-actor">👤 {act.actor}</span>
                      <span className={`status-pill status-${act.statusColor}`}>
                        {act.statusText}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Constituency & System Overview Widget */}
        <section className="constituency-overview-card">
          <div className="card-header">
            <h3>🏛️ मतदारसंघ विहंगावलोकन / Constituency Snapshot</h3>
          </div>

          <div className="overview-stats-list">
            <div className="overview-row">
              <span className="overview-icon">🗺️</span>
              <div className="overview-text">
                <span className="overview-label-mr">तालुके / Talukas</span>
                <span className="overview-label-en">२ (राहाता, संगमनेर अंश)</span>
              </div>
              <span className="overview-value">२</span>
            </div>

            <div className="overview-row">
              <span className="overview-icon">🏡</span>
              <div className="overview-text">
                <span className="overview-label-mr">ग्रामपंचायती व गावे</span>
                <span className="overview-label-en">Gram Panchayats & Villages</span>
              </div>
              <span className="overview-value">४८</span>
            </div>

            <div className="overview-row">
              <span className="overview-icon">📮</span>
              <div className="overview-text">
                <span className="overview-label-mr">मतदान केंद्रे (बूथ)</span>
                <span className="overview-label-en">Polling Booths</span>
              </div>
              <span className="overview-value">२३५</span>
            </div>

            <div className="overview-row">
              <span className="overview-icon">📱</span>
              <div className="overview-text">
                <span className="overview-label-mr">व्हॉट्सॲप ट्रॅकिंग</span>
                <span className="overview-label-en">WhatsApp Bot Active</span>
              </div>
              <span className="overview-value status-online">सक्रिय / Active</span>
            </div>
          </div>

          <div className="helpline-info-box">
            <h4>📞 कार्यालय हेल्पलाइन / Office Helpline</h4>
            <p>नागरिक तक्रार व निवेदन पाठपुरावा: <strong>+91 98220 XXXXX</strong></p>
            <span className="office-timing">कार्यालय वेळ: स. १०:०० ते सायं. ६:००</span>
          </div>
        </section>
      </div>
    </div>
  );
};

/** Format keys like pending -> 'प्रलंबित / Pending' for breakdown list */
const formatBreakdownKey = (key) => {
  const map = {
    pending: 'प्रलंबित (Pending)',
    inProgress: 'प्रगतीपथावर (In Progress)',
    escalated: 'कालावधी उलटलेले (Escalated)',
    resolved: 'पूर्ण (Resolved)',
    sanctioned: 'मंजूर (Sanctioned)',
    completed: 'पूर्ण (Completed)',
    boothPramukhs: 'बूथ प्रमुख (Pramukhs)',
    activeWorkers: 'सक्रिय कार्यकर्ते (Workers)',
    inspected: 'तपासणी पूर्ण (Inspected)',
  };
  return map[key] || key;
};

export default DashboardPage;
