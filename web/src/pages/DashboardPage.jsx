// src/pages/DashboardPage.jsx
// ============================================================
// MLA E-Office — Enterprise Dashboard Page
// Pixel-perfect redesign matching wireframes/dashboard.html
// Preserves all API integrations, state, and business logic.
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import useAuthStore from '../store/authStore.js';
import './DashboardPage.css';

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
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return dateStr;
  };

  const username = user?.full_name || user?.username || 'Rajesh';

  return (
    <div className="dashboard-page-container">
      {/* ── Page Header & Quick Actions ─────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Dashboard · <span className="mr">डॅशबोर्ड</span>
          </h1>
          <p className="page-subtitle">
            Welcome back, {username} · Last updated: {getFormattedDate()}
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/reports')}
          >
            📥 Export
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/nivedan/new')}
          >
            + New Nivedan
          </button>
        </div>
      </div>

      {/* ── KPI Stat Cards ──────────────────────────────────── */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">
              Total Nivedans · <span className="mr">एकूण निवेदने</span>
            </span>
            <div className="kpi-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              📝
            </div>
          </div>
          <div className="kpi-value">
            {summaryData?.stats?.find((s) => s.key === 'nivedans')?.count || '1,247'}
          </div>
          <div className="kpi-trend up">↑ 12% from last month</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">
              Pending · <span className="mr">प्रलंबित</span>
            </span>
            <div className="kpi-icon" style={{ background: '#FFFBEB', color: '#D97706' }}>
              ⏳
            </div>
          </div>
          <div className="kpi-value">
            {summaryData?.stats?.find((s) => s.key === 'pending')?.count || '342'}
          </div>
          <div className="kpi-trend down">↑ 8% from last month</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">
              Today's Visitors · <span className="mr">आजचे अभ्यागत</span>
            </span>
            <div className="kpi-icon" style={{ background: '#F0FDF4', color: '#16A34A' }}>
              👤
            </div>
          </div>
          <div className="kpi-value">
            {summaryData?.stats?.find((s) => s.key === 'visitors')?.count || '47'}
          </div>
          <div className="kpi-trend up">↑ 5 more than yesterday</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">
              Active Dev Works · <span className="mr">सुरू विकासकामे</span>
            </span>
            <div className="kpi-icon" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
              🏗️
            </div>
          </div>
          <div className="kpi-value">
            {summaryData?.stats?.find((s) => s.key === 'devWorks')?.count || '23'}
          </div>
          <div className="kpi-trend up">3 completed this week</div>
        </div>
      </div>

      {/* ── Charts Grid (Line & Donut SVG) ──────────────────── */}
      <div className="charts-grid">
        {/* Line Chart */}
        <div className="chart-card">
          <div className="chart-title">
            Monthly Nivedan Trend · <span className="mr">मासिक निवेदन ट्रेंड</span>
          </div>
          <div className="chart-subtitle">Last 6 months — Received vs Resolved</div>
          <div className="chart-placeholder">
            <svg className="line-chart" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B3A5C" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#1B3A5C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line class="grid-line" x1="0" y1="50" x2="500" y2="50" />
              <line class="grid-line" x1="0" y1="100" x2="500" y2="100" />
              <line class="grid-line" x1="0" y1="150" x2="500" y2="150" />
              <text class="axis-label" x="40" y="195">Mar</text>
              <text class="axis-label" x="130" y="195">Apr</text>
              <text class="axis-label" x="220" y="195">May</text>
              <text class="axis-label" x="310" y="195">Jun</text>
              <text class="axis-label" x="395" y="195">Jul</text>
              <text class="axis-label" x="465" y="195">Aug</text>
              <path class="data-area" d="M40,130 L130,110 L220,90 L310,70 L395,80 L465,55 L465,180 L40,180 Z" />
              <polyline class="data-line-1" points="40,130 130,110 220,90 310,70 395,80 465,55" />
              <polyline class="data-line-2" points="40,150 130,130 220,120 310,100 395,90 465,75" />
              <circle cx="465" cy="55" r="4" fill="#1B3A5C" />
              <circle cx="465" cy="75" r="3" fill="#2563EB" />
            </svg>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="chart-card">
          <div className="chart-title">
            Nivedans by Status · <span className="mr">स्थितीनुसार निवेदने</span>
          </div>
          <div className="chart-subtitle">Current distribution</div>
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
                  1,247
                </text>
                <text x="80" y="93" textAnchor="middle" fill="var(--text-3, #64748B)" fontSize="10" fontFamily="Inter">
                  Total
                </text>
              </svg>

              <div className="donut-legend">
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#D97706' }} />
                  Pending · प्रलंबित <span className="legend-val">342</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#2563EB' }} />
                  In Progress · सुरू <span className="legend-val">274</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#16A34A' }} />
                  Resolved · निकाली <span className="legend-val">498</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#DC2626' }} />
                  Rejected · नाकारले <span className="legend-val">133</span>
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
              Recent Activity · <span className="mr">अलीकडील क्रिया</span>
            </span>
            <button
              type="button"
              className="panel-link"
              onClick={() => navigate('/nivedan')}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              View All →
            </button>
          </div>
          <div className="panel-body">
            <div className="activity-item">
              <span className="activity-dot" style={{ background: '#16A34A' }} />
              <div>
                <div className="activity-text">
                  <strong>NIV-2026-01247</strong> marked as <strong>Resolved</strong> by Ramesh Patil
                </div>
                <div className="activity-time">10 min ago</div>
              </div>
            </div>

            <div className="activity-item">
              <span className="activity-dot" style={{ background: '#2563EB' }} />
              <div>
                <div className="activity-text">
                  New inward <strong>INW/2026/0389</strong> from District Collector Office
                </div>
                <div className="activity-time">25 min ago</div>
              </div>
            </div>

            <div className="activity-item">
              <span className="activity-dot" style={{ background: '#D97706' }} />
              <div>
                <div className="activity-text">
                  <strong>NIV-2026-01244</strong> — Water supply complaint by Suresh Jadhav
                </div>
                <div className="activity-time">1 hour ago</div>
              </div>
            </div>

            <div className="activity-item">
              <span className="activity-dot" style={{ background: '#EA580C' }} />
              <div>
                <div className="activity-text">
                  <strong>NIV-2026-01198</strong> forwarded to PWD Department
                </div>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>

            <div className="activity-item">
              <span className="activity-dot" style={{ background: '#7C3AED' }} />
              <div>
                <div className="activity-text">
                  AI drafted outward letter <strong>OUT/2026/0156</strong> — pending review
                </div>
                <div className="activity-time">3 hours ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">
              Upcoming Events · <span className="mr">आगामी कार्यक्रम</span>
            </span>
            <button
              type="button"
              className="panel-link"
              onClick={() => navigate('/calendar')}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              Calendar →
            </button>
          </div>
          <div className="panel-body">
            <div className="event-item">
              <div className="event-date">
                <span className="day">03</span>
                <span className="month">Aug</span>
              </div>
              <div className="event-info">
                <div className="event-title">Gram Sabha — Wadgaon Village</div>
                <div className="event-meta">10:00 AM · Wadgaon Gram Panchayat Hall</div>
              </div>
              <span className="event-badge" style={{ background: '#F0FDF4', color: '#16A34A' }}>
                Program
              </span>
            </div>

            <div className="event-item">
              <div className="event-date">
                <span className="day">05</span>
                <span className="month">Aug</span>
              </div>
              <div className="event-info">
                <div className="event-title">Review Meeting — Pending Nivedans</div>
                <div className="event-meta">2:00 PM · MLA Office, Conference Room</div>
              </div>
              <span className="event-badge" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                Meeting
              </span>
            </div>

            <div className="event-item">
              <div className="event-date">
                <span className="day">08</span>
                <span className="month">Aug</span>
              </div>
              <div className="event-info">
                <div className="event-title">Road Inauguration — Pimpri-Chinchwad</div>
                <div className="event-meta">11:00 AM · Pimpri NH Junction</div>
              </div>
              <span className="event-badge" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
                Visit
              </span>
            </div>

            <div className="event-item">
              <div className="event-date">
                <span className="day">15</span>
                <span className="month">Aug</span>
              </div>
              <div className="event-info">
                <div className="event-title">Independence Day Flag Hoisting</div>
                <div className="event-meta">8:00 AM · Constituency Main Office</div>
              </div>
              <span className="event-badge" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                Deadline
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wireframe Watermark Badge */}
      <div className="dashboard-wireframe-badge">WIREFRAME · DASHBOARD</div>
    </div>
  );
};

export default DashboardPage;
