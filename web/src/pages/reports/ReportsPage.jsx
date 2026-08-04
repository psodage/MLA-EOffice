import { useState, useEffect, useCallback } from 'react';
import { FileText, Mail, User, HardHat, Vote, MessageSquare, Download, Zap, BarChart2, Printer, ArrowRight } from 'lucide-react';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';
import './ReportsPage.css';

const REPORT_SUITES = [
  {
    id: 'NIVEDANS',
    titleEn: 'Nivedan Summary Report',
    titleMr: 'निवेदन सारांश',
    bg: 'var(--inb, #eff6ff)',
    color: 'var(--in, #2563eb)',
    descEn: 'Total, pending, resolved, rejected nivedans with category-wise breakdown. Filter by date range, ward, status.',
    descMr: 'एकूण, प्रलंबित, मार्गी लावलेली निवेदने व प्रकारनिहाय विश्लेषण. दिनांक, वॉर्ड व स्थितीनुसार फिल्टर करा.',
    formats: ['PDF', 'Excel', 'Print'],
  },
  {
    id: 'INWARD',
    titleEn: 'Inward/Outward Register',
    titleMr: 'आवक/जावक रजिस्टर',
    bg: 'var(--okb, #f0fdf4)',
    color: 'var(--ok, #16a34a)',
    descEn: 'Complete correspondence log with sender, department, dates, and status. Traditional register format for office records.',
    descMr: 'पाठवणारा, विभाग, दिनांक व स्थितीसह आवक-जावक पत्रव्यवहार नोंदवही.',
    formats: ['PDF', 'Excel', 'Print'],
  },
  {
    id: 'VISITORS',
    titleEn: 'Visitor Daily Report',
    titleMr: 'अभ्यागत दैनिक अहवाल',
    bg: 'var(--pub, #f5f3ff)',
    color: 'var(--pu, #7c3aed)',
    descEn: 'Day-wise visitor count, purpose breakdown, average wait time, repeat visitor statistics, and peak hours.',
    descMr: 'दैनिक नागरिक संख्या, भेटण्याचे कारण, सरासरी प्रतीक्षा वेळ व नागरिकांचे वर्गीकरण.',
    formats: ['PDF', 'Print'],
  },
  {
    id: 'DEVWORKS',
    titleEn: 'Development Works Progress',
    titleMr: 'विकासकामे प्रगती',
    bg: 'var(--wrb, #fffbeb)',
    color: 'var(--wr, #d97706)',
    descEn: 'Project-wise status, budget vs spent, progress percentage, delayed projects, and contractor performance.',
    descMr: 'प्रकल्पनिहाय स्थिती, अर्थसंकल्प खर्च, प्रगती टक्केवारी व विलंबित प्रकल्पांचा सविस्तर अहवाल.',
    formats: ['PDF', 'Excel', 'Print'],
  },
  {
    id: 'BOOTH',
    titleEn: 'Booth-wise Worker Report',
    titleMr: 'बूथनिहाय कार्यकर्ता',
    bg: 'var(--orb, #fff7ed)',
    color: 'var(--or, #ea580c)',
    descEn: 'Taluka → Village → Booth hierarchy with pramukh names, worker counts, voter coverage, and vacancy status.',
    descMr: 'तालुका → गाव → बूथ रचना, प्रमुख नावे, कार्यकर्ते संख्या व मतदारसंघ व्याप्ती.',
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'WHATSAPP',
    titleEn: 'WhatsApp Message Log',
    titleMr: 'व्हॉट्सअॅप लॉग',
    bg: 'var(--erb, #fef2f2)',
    color: 'var(--er, #dc2626)',
    descEn: 'All sent messages, delivery status, template usage, and communication history per citizen/nivedan.',
    descMr: 'पाठवलेले सर्व व्हॉट्सअॅप संदेश, डिलिव्हरी स्टेटस व नागरिक संवाद इतिहास.',
    formats: ['PDF', 'CSV'],
  },
];

const renderSuiteIcon = (id) => {
  if (id === 'NIVEDANS') return <FileText size={20} />;
  if (id === 'INWARD') return <Mail size={20} />;
  if (id === 'VISITORS') return <User size={20} />;
  if (id === 'DEVWORKS') return <HardHat size={20} />;
  if (id === 'BOOTH') return <Vote size={20} />;
  if (id === 'WHATSAPP') return <MessageSquare size={20} />;
  return <FileText size={20} />;
};

const ReportsPage = () => {
  const { lang } = useLangStore();
  const isMr = lang === 'MR';

  const [activeSuiteId, setActiveSuiteId] = useState('NIVEDANS');

  // Quick Generate Form State
  const [quickForm, setQuickForm] = useState({
    reportType: 'Nivedan Summary',
    dateFrom: '2026-07-01',
    dateTo: '2026-08-02',
    format: 'PDF',
  });

  const [loading, setLoading] = useState(false);
  const [suiteData, setSuiteData] = useState({
    nivedans: {
      total: 342,
      resolved: 248,
      inProgress: 64,
      pending: 30,
      byCategory: [
        { category: 'रस्ते व पूल निर्माण', count: 112 },
        { category: 'पाणीपुरवठा सुधारणा', count: 86 },
        { category: 'विद्युतीकरण व स्ट्रीट लाईट', count: 64 },
        { category: 'शाळा / आरोग्य केंद्र', count: 48 },
        { category: 'वैयक्तिक योजना व इतर', count: 32 },
      ],
    },
    devworks: {
      totalProjects: 54,
      allocated: 38400000,
      spent: 27610000,
      byFunding: [
        { sourceName: 'MLALAD (आमदार निधी)', allocated: 15000000, spent: 11200000 },
        { sourceName: 'ZP Fund (जिल्हा परिषद)', allocated: 12000000, spent: 9400000 },
        { sourceName: 'State Grant (राज्य शासन)', allocated: 11400000, spent: 7010000 },
      ],
    },
    visitors: {
      totalVisitors: 890,
      byPurpose: [
        { purpose: 'तक्रार व निवेदन सादर करणे', count: 420 },
        { purpose: 'सत्कार व सदिच्छा भेट', count: 260 },
        { purpose: 'विकासकामे पाठपुरावा', count: 140 },
        { purpose: 'इतर कार्यालयीन काम', count: 70 },
      ],
    },
    inward: {
      under7Days: 24,
      days7To14: 12,
      days14To30: 8,
      over30Days: 3,
    },
    booth: {
      totalBoothsCount: 215,
      coveredBoothsCount: 156,
      uncoveredBoothsCount: 59,
      coveragePercentage: 73,
    },
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      if (activeSuiteId === 'NIVEDANS') {
        const { data } = await api.get('/reports/nivedans');
        if (data?.data) {
          setSuiteData((prev) => ({
            ...prev,
            nivedans: {
              total: data.data.total || 342,
              resolved: data.data.byStatus?.RESOLVED || 248,
              inProgress: data.data.byStatus?.IN_PROGRESS || 64,
              pending: data.data.byStatus?.PENDING || 30,
              byCategory: data.data.byCategory || prev.nivedans.byCategory,
            },
          }));
        }
      }
    } catch (err) {
      console.warn('API error fetching reports data, using mock statistics:', err);
    } finally {
      setLoading(false);
    }
  }, [activeSuiteId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleQuickFormChange = (e) => {
    const { name, value } = e.target;
    setQuickForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = () => {
    alert(
      isMr
        ? `अहवाल तयार होत आहे: ${quickForm.reportType} (${quickForm.format}) [दिनांक ${quickForm.dateFrom} ते ${quickForm.dateTo}]`
        : `Generating report: ${quickForm.reportType} (${quickForm.format}) [Date: ${quickForm.dateFrom} to ${quickForm.dateTo}]`
    );
  };

  const handlePrintPreview = () => {
    window.print();
  };

  return (
    <div className="reports-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="reports-header">
        <div>
          <h1 className="title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={24} style={{ color: 'var(--primary)' }} /> Reports · <span className="mr" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>अहवाल</span>
          </h1>
          <p className="sub">
            {isMr
              ? 'शासकीय व कार्यालयीन अहवाल निर्मिती, एक्सपोर्ट आणि प्रिंट'
              : 'Generate, export, and print office reports'}
          </p>
        </div>

        <div className="reports-actions">
          <button className="btn-o" onClick={() => alert(isMr ? 'अहवाल एक्सपोर्ट होत आहे...' : 'Exporting reports...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> {isMr ? 'एक्सपोर्ट' : 'Export'}
          </button>
        </div>
      </div>

      {/* ── 6 Report Suite Cards Grid ────────────────────────── */}
      <div className="report-grid">
        {REPORT_SUITES.map((suite) => (
          <div
            key={suite.id}
            className={`report-card ${activeSuiteId === suite.id ? 'active' : ''}`}
            onClick={() => setActiveSuiteId(suite.id)}
          >
            <div className="rc-header">
              <div className="rc-icon" style={{ background: suite.bg, color: suite.color }}>
                {renderSuiteIcon(suite.id)}
              </div>
              <div className="rc-info">
                <div className="rc-title">
                  {suite.titleEn} · <span className="mr" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{suite.titleMr}</span>
                </div>
                <div className="rc-desc">{isMr ? suite.descMr : suite.descEn}</div>
              </div>
            </div>

            <div className="rc-footer">
              <div className="rc-formats">
                {suite.formats.map((fmt, idx) => (
                  <span key={idx} className="rc-fmt">{fmt}</span>
                ))}
              </div>
              <span className="rc-gen" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {isMr ? 'तयार करा' : 'Generate'} <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── ⚡ Quick Generate Form Section ────────────────────── */}
      <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Zap size={16} style={{ color: 'var(--amber)' }} /> {isMr ? 'जलद अहवाल निर्मिती' : 'Quick Generate'} · <span className="mr" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>जलद अहवाल</span>
      </div>

      <div className="quick-form">
        <div className="fg">
          <span className="fl">{isMr ? 'अहवाल प्रकार' : 'Report Type'}</span>
          <select
            className="fi"
            name="reportType"
            value={quickForm.reportType}
            onChange={handleQuickFormChange}
          >
            <option value="Nivedan Summary">Nivedan Summary (निवेदन सारांश)</option>
            <option value="Inward/Outward Register">Inward/Outward Register (आवक/जावक)</option>
            <option value="Visitor Daily">Visitor Daily (अभ्यागत दैनिक)</option>
            <option value="Dev Works Progress">Dev Works Progress (विकासकामे प्रगती)</option>
            <option value="Booth Worker Report">Booth Worker Report (बूथनिहाय)</option>
            <option value="WhatsApp Log">WhatsApp Message Log (व्हॉट्सअॅप लॉग)</option>
          </select>
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'दिनांक पासून' : 'Date From'}</span>
          <input
            className="fi"
            type="date"
            name="dateFrom"
            value={quickForm.dateFrom}
            onChange={handleQuickFormChange}
          />
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'दिनांक पर्यंत' : 'Date To'}</span>
          <input
            className="fi"
            type="date"
            name="dateTo"
            value={quickForm.dateTo}
            onChange={handleQuickFormChange}
          />
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'फॉर्मेट' : 'Format'}</span>
          <select
            className="fi"
            name="format"
            value={quickForm.format}
            onChange={handleQuickFormChange}
          >
            <option value="PDF">PDF</option>
            <option value="Excel (.xlsx)">Excel (.xlsx)</option>
            <option value="CSV">CSV</option>
          </select>
        </div>

        <button className="btn-p" onClick={handleGenerateReport} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <BarChart2 size={15} /> {isMr ? 'अहवाल डाउनलोड करा' : 'Generate Report'}
        </button>
        <button className="btn-o" onClick={handlePrintPreview} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Printer size={15} /> {isMr ? 'प्रिंट प्रीव्ह्यू' : 'Print Preview'}
        </button>
      </div>

      {/* ── Live Analytics Preview Card for Selected Suite ───── */}
      <div className="analytics-preview-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--t3)' }}>
            <p>{isMr ? 'अहवाल सांख्यिकी लोड होत आहे...' : 'Loading analytics preview...'}</p>
          </div>
        ) : (
          <>
            {activeSuiteId === 'NIVEDANS' && (
              <div>
                <h3 className="report-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={18} /> {isMr ? 'निवेदने सद्यस्थिती व वर्गवारी अहवाल प्रीव्ह्यू' : 'Nivedan Summary Analytics Preview'}
                </h3>
                <div className="reports-stat-grid">
                  <div className="report-metric-card">
                    <span className="metric-val">{suiteData.nivedans.total}</span>
                    <span className="metric-lbl">{isMr ? 'एकूण निवेदने' : 'Total Nivedans'}</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: 'var(--ok, #16a34a)' }}>{suiteData.nivedans.resolved}</span>
                    <span className="metric-lbl">{isMr ? 'मार्गी लावलेली (Resolved)' : 'Resolved'}</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: 'var(--in, #2563eb)' }}>{suiteData.nivedans.inProgress}</span>
                    <span className="metric-lbl">{isMr ? 'कार्यवाही सुरू (In Progress)' : 'In Progress'}</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: 'var(--wr, #d97706)' }}>{suiteData.nivedans.pending}</span>
                    <span className="metric-lbl">{isMr ? 'प्रलंबित (Pending)' : 'Pending'}</span>
                  </div>
                </div>

                <h4 style={{ color: 'var(--t1)', marginBottom: '10px', fontSize: '13px', fontWeight: 600 }}>
                  {isMr ? 'वर्गवारीनुसार वितरण (Category Breakdown):' : 'Category Breakdown:'}
                </h4>
                {suiteData.nivedans.byCategory.map((cat, idx) => (
                  <div key={idx} className="chart-row-item">
                    <span className="chart-label-col">{cat.category}</span>
                    <div className="chart-bar-bg">
                      <div
                        className="chart-bar-fill"
                        style={{ width: `${Math.min((cat.count / suiteData.nivedans.total) * 100 * 2.5, 100)}%`, background: 'var(--in, #2563eb)' }}
                      />
                    </div>
                    <span className="chart-value-col">{cat.count} {isMr ? 'निवेदने' : 'items'}</span>
                  </div>
                ))}
              </div>
            )}

            {activeSuiteId === 'DEVWORKS' && (
              <div>
                <h3 className="report-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HardHat size={18} /> {isMr ? 'विकासकामे व अर्थसंकल्प अहवाल प्रीव्ह्यू' : 'Development Works Budget Analytics Preview'}
                </h3>
                <div className="reports-stat-grid">
                  <div className="report-metric-card">
                    <span className="metric-val">{suiteData.devworks.totalProjects}</span>
                    <span className="metric-lbl">{isMr ? 'एकूण विकासकामे' : 'Total Projects'}</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: 'var(--ok, #16a34a)' }}>
                      ₹ {(suiteData.devworks.allocated / 10000000).toFixed(2)} Cr
                    </span>
                    <span className="metric-lbl">{isMr ? 'मंजूर अर्थसंकल्प' : 'Allocated Budget'}</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: 'var(--wr, #d97706)' }}>
                      ₹ {(suiteData.devworks.spent / 10000000).toFixed(2)} Cr
                    </span>
                    <span className="metric-lbl">{isMr ? 'खर्च झालेली रक्कम' : 'Spent Amount'}</span>
                  </div>
                </div>

                <h4 style={{ color: 'var(--t1)', marginBottom: '10px', fontSize: '13px', fontWeight: 600 }}>
                  {isMr ? 'निधी स्रोतानुसार वापर (Funding Utilization):' : 'Funding Source Utilization:'}
                </h4>
                {suiteData.devworks.byFunding.map((fund, idx) => {
                  const spentPct = Math.round((fund.spent / fund.allocated) * 100);
                  return (
                    <div key={idx} className="chart-row-item">
                      <span className="chart-label-col">{fund.sourceName}</span>
                      <div className="chart-bar-bg">
                        <div
                          className="chart-bar-fill"
                          style={{ width: `${Math.min(spentPct, 100)}%`, background: 'var(--wr, #d97706)' }}
                        />
                      </div>
                      <span className="chart-value-col">
                        ₹ {(fund.spent / 100000).toFixed(2)} L / ₹ {(fund.allocated / 100000).toFixed(2)} L ({spentPct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {activeSuiteId === 'VISITORS' && (
              <div>
                <h3 className="report-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={18} /> {isMr ? 'अभ्यागत नागरिक भेट सांख्यिकी प्रीव्ह्यू' : 'Visitor Statistics Analytics Preview'}
                </h3>
                <div className="reports-stat-grid">
                  <div className="report-metric-card">
                    <span className="metric-val">{suiteData.visitors.totalVisitors}</span>
                    <span className="metric-lbl">{isMr ? 'एकूण नागरिक भेट नोंद' : 'Total Visitor Logins'}</span>
                  </div>
                </div>

                <h4 style={{ color: 'var(--t1)', marginBottom: '10px', fontSize: '13px', fontWeight: 600 }}>
                  {isMr ? 'भेटण्याच्या कारणानुसार वर्गीकरण:' : 'Breakdown by Visit Purpose:'}
                </h4>
                {suiteData.visitors.byPurpose.map((p, idx) => (
                  <div key={idx} className="chart-row-item">
                    <span className="chart-label-col">{p.purpose}</span>
                    <div className="chart-bar-bg">
                      <div
                        className="chart-bar-fill"
                        style={{ width: `${Math.min((p.count / suiteData.visitors.totalVisitors) * 100 * 2, 100)}%`, background: 'var(--pu, #7c3aed)' }}
                      />
                    </div>
                    <span className="chart-value-col">{p.count} {isMr ? 'नागरिक' : 'visitors'}</span>
                  </div>
                ))}
              </div>
            )}

            {(activeSuiteId === 'INWARD' || activeSuiteId === 'BOOTH' || activeSuiteId === 'WHATSAPP') && (
              <div>
                <h3 className="report-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BarChart2 size={18} /> {isMr ? 'शासकीय पत्रव्यवहार व बूथ व्याप्ती अहवाल प्रीव्ह्यू' : 'Correspondence & Booth Coverage Summary'}
                </h3>
                <div className="reports-stat-grid">
                  <div className="report-metric-card">
                    <span className="metric-val">{suiteData.booth.totalBoothsCount}</span>
                    <span className="metric-lbl">{isMr ? 'एकूण मतदान केंद्र' : 'Total Booths'}</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: 'var(--pu, #7c3aed)' }}>{suiteData.booth.coveredBoothsCount}</span>
                    <span className="metric-lbl">{isMr ? 'प्रमुख नियुक्त बूथ' : 'Covered Booths'}</span>
                  </div>
                  <div className="report-metric-card">
                    <span className="metric-val" style={{ color: 'var(--ok, #16a34a)' }}>{suiteData.booth.coveragePercentage}%</span>
                    <span className="metric-lbl">{isMr ? 'व्याप्ती टक्केवारी' : 'Coverage %'}</span>
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

