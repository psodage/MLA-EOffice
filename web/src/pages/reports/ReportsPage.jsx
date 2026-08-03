// src/pages/reports/ReportsPage.jsx
// ============================================================
// Reports & Analytics Dashboard — Module 13
// 5 constituency report suites, date range picker & 1-click CSV export
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import './ReportsPage.css';

const REPORT_TABS = [
  { id: 'NIVEDANS', titleMr: '📋 निवेदने अहवाल', icon: '📋' },
  { id: 'DEVWORKS', titleMr: '🏗️ विकासकामे अर्थसंकल्प', icon: '🏗️' },
  { id: 'VISITORS', titleMr: '👥 नागरिक भेट सांख्यिकी', icon: '👥' },
  { id: 'INWARD', titleMr: '📫 आवक प्रलंबितता (Aging)', icon: '📫' },
  { id: 'BOOTH', titleMr: '🗳️ बूथ प्रमुख व्याप्ती', icon: '🗳️' },
];

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('NIVEDANS');
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  // Data states for 5 report suites
  const [nivedanData, setNivedanData] = useState(null);
  const [devworksData, setDevworksData] = useState(null);
  const [visitorData, setVisitorData] = useState(null);
  const [inwardData, setInwardData] = useState(null);
  const [boothData, setBoothData] = useState(null);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'NIVEDANS') {
        const { data } = await api.get('/reports/nivedans', { params: { from: fromDate, to: toDate } });
        setNivedanData(data.data);
      } else if (activeTab === 'DEVWORKS') {
        const { data } = await api.get('/reports/devworks');
        setDevworksData(data.data);
      } else if (activeTab === 'VISITORS') {
        const { data } = await api.get('/reports/visitors', { params: { period: 'month' } });
        setVisitorData(data.data);
      } else if (activeTab === 'INWARD') {
        const { data } = await api.get('/reports/inward-pendency');
        setInwardData(data.data);
      } else if (activeTab === 'BOOTH') {
        const { data } = await api.get('/reports/booth-coverage');
        setBoothData(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch report data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, fromDate, toDate]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // CSV Export Generator with UTF-8 BOM for Marathi Excel compatibility
  const exportToCSV = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM

    if (activeTab === 'NIVEDANS' && nivedanData) {
      csvContent += 'Nivedan Status,Count\n';
      Object.keys(nivedanData.byStatus || {}).forEach((st) => {
        csvContent += `"${st}",${nivedanData.byStatus[st]}\n`;
      });
    } else if (activeTab === 'DEVWORKS' && devworksData) {
      csvContent += 'Funding Source,Sanctioned Budget (INR),Spent Budget (INR),Projects Count\n';
      Object.keys(devworksData.byFunding || {}).forEach((src) => {
        const item = devworksData.byFunding[src];
        csvContent += `"${item.sourceName || src}",${item.allocated},${item.spent},${item.count}\n`;
      });
    } else if (activeTab === 'VISITORS' && visitorData) {
      csvContent += 'Visit Purpose,Count\n';
      Object.keys(visitorData.byPurpose || {}).forEach((p) => {
        csvContent += `"${p}",${visitorData.byPurpose[p]}\n`;
      });
    } else if (activeTab === 'INWARD' && inwardData) {
      csvContent += 'Aging Category,Pending Inward Count\n';
      csvContent += `"Under 7 Days",${inwardData.aging.under7Days}\n`;
      csvContent += `"7 to 14 Days",${inwardData.aging.days7To14}\n`;
      csvContent += `"14 to 30 Days",${inwardData.aging.days14To30}\n`;
      csvContent += `"Over 30 Days Overdue",${inwardData.aging.over30Days}\n`;
    } else if (activeTab === 'BOOTH' && boothData) {
      csvContent += 'Metric,Value\n';
      csvContent += `"Total Constituency Booths",${boothData.totalBoothsCount}\n`;
      csvContent += `"Covered Booths (Pramukh Assigned)",${boothData.coveredBoothsCount}\n`;
      csvContent += `"Uncovered Booths",${boothData.uncoveredBoothsCount}\n`;
      csvContent += `"Coverage Percentage",${boothData.coveragePercentage}%\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MLA_EOffice_Report_${activeTab}_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="inward-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="inward-page-header">
        <div className="title-group">
          <h1 className="page-title-mr">📊 अहवाल व विश्लेषण (Reports & Analytics)</h1>
          <p className="page-subtitle">
            निवेदने, विकासकामे अर्थसंकल्प, नागरिक भेट व बूथ प्रमुख व्याप्ती सविस्तर अहवाल
          </p>
        </div>

        <button className="create-inward-btn" onClick={exportToCSV}>
          <span>📥</span>
          <span>CSV अहवाल डाऊनलोड करा (Export CSV)</span>
        </button>
      </div>

      {/* ── Report Suite Tab Selector ───────────────────────── */}
      <div className="status-tabs-container" style={{ marginBottom: '1.25rem' }}>
        {REPORT_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`status-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.titleMr}
          </button>
        ))}
      </div>

      {/* ── Date Range Selector ─────────────────────────────── */}
      <div className="inward-filter-bar reports-filter-bar">
        <div className="filter-group">
          <label>पासून (From Date)</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>पर्यंत (To Date)</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <button
            className="reset-filter-btn"
            onClick={() => {
              setFromDate(`${new Date().getFullYear()}-01-01`);
              setToDate(new Date().toISOString().split('T')[0]);
            }}
          >
            🔄 या वर्षातील (This Year)
          </button>
        </div>
      </div>

      {/* ── Main Report Content Cards ──────────────────────── */}
      <div className="inward-table-card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div className="table-loading-box">
            <div className="mini-spinner"></div>
            <p>अहवाल तयार होत आहे...</p>
          </div>
        ) : (
          <>
            {/* 1. Nivedan Report Suite */}
            {activeTab === 'NIVEDANS' && nivedanData && (
              <div>
                <h3 className="report-section-title">📋 निवेदने सद्यस्थिती व वर्गवारी अहवाल (Nivedans Summary)</h3>

                <div className="reports-stat-grid">
                  <div className="report-metric-card">
                    <span className="metric-val">{nivedanData.total}</span>
                    <span className="metric-lbl">एकूण नोंदवलेली निवेदने</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#4ade80' }}>{nivedanData.byStatus.RESOLVED}</span>
                    <span className="metric-lbl">मार्गी लावलेली (Resolved)</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#38bdf8' }}>{nivedanData.byStatus.IN_PROGRESS}</span>
                    <span className="metric-lbl">कार्यवाही सुरू (In Progress)</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#fbbf24' }}>{nivedanData.byStatus.PENDING}</span>
                    <span className="metric-lbl">प्रलंबित (Pending)</span>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ color: '#ff9933', marginBottom: '0.75rem', fontSize: '0.95rem' }}>वर्गवारीनुसार वितरण (Category Breakdown):</h4>
                  {(nivedanData.byCategory || []).map((cat, idx) => (
                    <div key={idx} className="chart-row-item">
                      <span className="chart-label-col">{cat.category}</span>
                      <div className="chart-bar-bg">
                        <div
                          className="chart-bar-fill"
                          style={{ width: `${Math.min((cat.count / nivedanData.total) * 100 * 2, 100)}%`, background: '#38bdf8' }}
                        />
                      </div>
                      <span className="chart-value-col">{cat.count} निवेदने</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Development Works Report Suite */}
            {activeTab === 'DEVWORKS' && devworksData && (
              <div>
                <h3 className="report-section-title">🏗️ विकासकामे व अर्थसंकल्प अहवाल (Budget Utilization)</h3>

                <div className="reports-stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#38bdf8' }}>{devworksData.totalProjects}</span>
                    <span className="metric-lbl">एकूण विकासकामे प्रकल्प</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#4ade80' }}>
                      ₹ {(Object.values(devworksData.byFunding).reduce((a, b) => a + b.allocated, 0) / 100000).toFixed(2)} लाख
                    </span>
                    <span className="metric-lbl">एकूण मंजूर अर्थसंकल्प</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#fb923c' }}>
                      ₹ {(Object.values(devworksData.byFunding).reduce((a, b) => a + b.spent, 0) / 100000).toFixed(2)} लाख
                    </span>
                    <span className="metric-lbl">एकूण खर्च झालेली रक्कम</span>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ color: '#ff9933', marginBottom: '0.75rem', fontSize: '0.95rem' }}>निधीच्या स्रोतानुसार अर्थसंकल्प वापर (Funding Utilization):</h4>
                  {Object.keys(devworksData.byFunding).map((src, idx) => {
                    const item = devworksData.byFunding[src];
                    const allocLakhs = (item.allocated / 100000).toFixed(2);
                    const spentLakhs = (item.spent / 100000).toFixed(2);
                    const spentPct = item.allocated > 0 ? Math.round((item.spent / item.allocated) * 100) : 0;

                    return (
                      <div key={idx} className="chart-row-item">
                        <span className="chart-label-col">{item.sourceName || src}</span>
                        <div className="chart-bar-bg">
                          <div
                            className="chart-bar-fill"
                            style={{ width: `${Math.min(spentPct, 100)}%`, background: 'linear-gradient(90deg, #ff9933, #16a34a)' }}
                          />
                        </div>
                        <span className="chart-value-col">₹ {spentLakhs} L / ₹ {allocLakhs} L ({spentPct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Visitor Statistics Suite */}
            {activeTab === 'VISITORS' && visitorData && (
              <div>
                <h3 className="report-section-title">👥 नागरिक भेट सांख्यिकी अहवाल (Visitor Statistics)</h3>

                <div className="reports-stat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <div className="report-metric-card">
                    <span className="metric-val">{visitorData.totalVisitors}</span>
                    <span className="metric-lbl">एकूण नागरिक भेट नोंद</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#fbbf24' }}>
                      {visitorData.byPurpose.GRIEVANCE || 0}
                    </span>
                    <span className="metric-lbl">तक्रार / निवेदनासाठी भेट</span>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ color: '#ff9933', marginBottom: '0.75rem', fontSize: '0.95rem' }}>भेटण्याच्या कारणानुसार वर्गीकरण (By Purpose):</h4>
                  {Object.keys(visitorData.byPurpose).map((p, idx) => (
                    <div key={idx} className="chart-row-item">
                      <span className="chart-label-col">{p}</span>
                      <div className="chart-bar-bg">
                        <div
                          className="chart-bar-fill"
                          style={{ width: `${Math.min((visitorData.byPurpose[p] / visitorData.totalVisitors) * 100 * 2, 100)}%`, background: '#c084fc' }}
                        />
                      </div>
                      <span className="chart-value-col">{visitorData.byPurpose[p]} नागरिक</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Inward Pendency Aging Suite */}
            {activeTab === 'INWARD' && inwardData && (
              <div>
                <h3 className="report-section-title">📫 आवक पत्र व्यवहार प्रलंबितता (Inward Aging Report)</h3>

                <div className="reports-stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#4ade80' }}>{inwardData.aging.under7Days}</span>
                    <span className="metric-lbl">७ दिवसांपेक्षा कमी</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#38bdf8' }}>{inwardData.aging.days7To14}</span>
                    <span className="metric-lbl">७ ते १४ दिवस</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#fbbf24' }}>{inwardData.aging.days14To30}</span>
                    <span className="metric-lbl">१४ ते ३० दिवस</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#f87171' }}>{inwardData.aging.over30Days}</span>
                    <span className="metric-lbl">३० दिवसांपेक्षा जास्त (Overdue)</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Karyakarta Booth Coverage Suite */}
            {activeTab === 'BOOTH' && boothData && (
              <div>
                <h3 className="report-section-title">🗳️ मतदान केंद्र बूथ प्रमुख व्याप्ती (Booth Coverage)</h3>

                <div className="reports-stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  <div className="report-metric-card">
                    <span className="metric-val">{boothData.totalBoothsCount}</span>
                    <span className="metric-lbl">एकूण मतदान केंद्र (Booths)</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#facc15' }}>{boothData.coveredBoothsCount}</span>
                    <span className="metric-lbl">प्रमुख नियुक्त बूथ (Covered)</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#f87171' }}>{boothData.uncoveredBoothsCount}</span>
                    <span className="metric-lbl">प्रमुख नसलेले बूथ (Uncovered)</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: '#4ade80' }}>{boothData.coveragePercentage}%</span>
                    <span className="metric-lbl">बूथ व्याप्ती टक्केवारी (Coverage %)</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
