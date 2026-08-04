// src/pages/gramward/GramWardPage.jsx
// ============================================================
// Gram / Ward Organization Page — Module
// Matching WIREFRAMES/gram_ward.html
// Features: Geographical hierarchy, 6 Summary Stat Cards,
// 2-Column List & Sticky Detail Drawer layout, Multi-Facet Filters, Bilingual Toggle
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import useLangStore from '../../store/langStore.js';
import './GramWardPage.css';

const SAMPLE_TALUKAS = [
  {
    nameEn: 'Haveli Taluka',
    nameMr: 'हवेली तालुका',
    countText: '22 areas · 92 booths',
    areas: [
      {
        id: 'wadgaon',
        nameEn: 'Wadgaon',
        nameMr: 'वडगाव',
        type: 'village',
        parent: 'GP: Wadgaon · Haveli Taluka',
        complaints: 8,
        resolved: 5,
        devWorks: 3,
        workers: 24,
        booths: 6,
        voters: 4812,
        allPramukhsAssigned: true,
        boothsList: [
          { id: 12, title: 'Booth 12 — ZP School', pramukh: 'Vishnu Gaikwad', voters: 845 },
          { id: 13, title: 'Booth 13 — Gram Panchayat Office', pramukh: 'Anil Shinde', voters: 912 },
          { id: 14, title: 'Booth 14 — Community Hall', pramukh: 'Suresh Pawar', voters: 738 },
        ],
        recentNivedans: [
          { id: 'NIV/2026/0345', title: 'Road repair near ZP School', date: '28 Jul 2026', status: 'pending', statusText: 'Pending' },
          { id: 'NIV/2026/0312', title: 'Water supply pipeline leakage', date: '22 Jul 2026', status: 'progress', statusText: 'In Progress' },
          { id: 'NIV/2026/0289', title: 'Street light installation request', date: '15 Jul 2026', status: 'resolved', statusText: 'Resolved' },
        ],
        activeDevWorks: [
          { title: 'Road widening — Wadgaon to NH-4', fund: 'MLALAD', budget: '₹45 Lakhs', progress: '60%' },
          { title: 'Community hall construction', fund: 'ZP Fund', budget: '₹28 Lakhs', progress: '35%' },
        ],
        keyWorkers: [
          { name: 'Vishnu Gaikwad', initials: 'VG' },
          { name: 'Anil Shinde', initials: 'AS' },
          { name: 'Suresh Pawar', initials: 'SP' },
          { name: 'Meena Kale', initials: 'MK' },
          { name: 'Ravi Jadhav', initials: 'RJ' },
          { name: 'Deepak Thorat', initials: 'DT' },
        ],
      },
      {
        id: 'pimpri-ward-5',
        nameEn: 'Pimpri (Ward 5)',
        nameMr: 'पिंपरी (वॉर्ड ५)',
        type: 'ward',
        parent: 'Haveli Taluka · Urban',
        complaints: 14,
        resolved: 9,
        devWorks: 5,
        workers: 38,
        booths: 12,
        voters: 10245,
        allPramukhsAssigned: true,
        boothsList: [
          { id: 145, title: 'Booth 145 — Pimpri Govt School', pramukh: 'Ramesh Patil', voters: 920 },
          { id: 146, title: 'Booth 146 — Ward Office Hall', pramukh: 'Mangesh Jadhav', voters: 880 },
          { id: 148, title: 'Booth 148 — Community Center', pramukh: 'Priya Deshmukh', voters: 950 },
        ],
        recentNivedans: [
          { id: 'NIV/2026/0401', title: 'Drainage blockage in Ward 5', date: '01 Aug 2026', status: 'progress', statusText: 'In Progress' },
          { id: 'NIV/2026/0388', title: 'Public park LED lighting', date: '29 Jul 2026', status: 'resolved', statusText: 'Resolved' },
        ],
        activeDevWorks: [
          { title: 'NH-4 Junction Road Widening', fund: 'State PWD', budget: '₹2.45 Cr', progress: '72%' },
        ],
        keyWorkers: [
          { name: 'Ramesh Patil', initials: 'RP' },
          { name: 'Mangesh Jadhav', initials: 'MJ' },
          { name: 'Priya Deshmukh', initials: 'PD' },
        ],
      },
      {
        id: 'shivaji-nagar-ward-1',
        nameEn: 'Shivaji Nagar (Ward 1)',
        nameMr: 'शिवाजी नगर (वॉर्ड १)',
        type: 'ward',
        parent: 'Haveli Taluka · Urban',
        complaints: 6,
        resolved: 4,
        devWorks: 2,
        workers: 18,
        booths: 8,
        voters: 6720,
        allPramukhsAssigned: true,
        boothsList: [
          { id: 1, title: 'Booth 1 — Shivaji Nagar High School', pramukh: 'Sunil More', voters: 810 },
        ],
        recentNivedans: [
          { id: 'NIV/2026/0390', title: 'Water pressure issue', date: '30 Jul 2026', status: 'pending', statusText: 'Pending' },
        ],
        activeDevWorks: [
          { title: 'Street Light Installation', fund: 'MSEDCL', budget: '₹12 Lakhs', progress: '0%' },
        ],
        keyWorkers: [
          { name: 'Sunil More', initials: 'SM' },
        ],
      },
      {
        id: 'ambegaon',
        nameEn: 'Ambegaon',
        nameMr: 'आंबेगाव',
        type: 'village',
        parent: 'GP: Ambegaon · Haveli Taluka',
        complaints: 3,
        resolved: 2,
        devWorks: 1,
        workers: 12,
        booths: 4,
        voters: 2340,
        allPramukhsAssigned: false,
        missingPramukhCount: 1,
        boothsList: [
          { id: 3, title: 'Booth 3 — ZP Primary School', pramukh: 'Anand Kamble', voters: 580 },
        ],
        recentNivedans: [
          { id: 'NIV/2026/0360', title: 'School building roof repair', date: '25 Jul 2026', status: 'progress', statusText: 'In Progress' },
        ],
        activeDevWorks: [
          { title: 'ZP School Building Repair', fund: 'Education Dept', budget: '₹42 Lakhs', progress: '35%' },
        ],
        keyWorkers: [
          { name: 'Anand Kamble', initials: 'AK' },
        ],
      },
    ],
  },
  {
    nameEn: 'Maval Taluka',
    nameMr: 'मावळ तालुका',
    countText: '14 areas · 38 booths',
    areas: [
      {
        id: 'talegaon',
        nameEn: 'Talegaon Dabhade',
        nameMr: 'तळेगाव दाभाडे',
        type: 'village',
        parent: 'GP: Talegaon · Maval Taluka',
        complaints: 7,
        resolved: 4,
        devWorks: 4,
        workers: 22,
        booths: 8,
        voters: 6120,
        allPramukhsAssigned: false,
        missingPramukhCount: 2,
        boothsList: [
          { id: 21, title: 'Booth 21 — Municipal School 1', pramukh: 'Vijay Kakade', voters: 780 },
        ],
        recentNivedans: [],
        activeDevWorks: [],
        keyWorkers: [],
      },
      {
        id: 'lonavala',
        nameEn: 'Lonavala',
        nameMr: 'लोणावळा',
        type: 'village',
        parent: 'GP: Lonavala · Maval Taluka',
        complaints: 4,
        resolved: 3,
        devWorks: 2,
        workers: 14,
        booths: 5,
        voters: 3890,
        allPramukhsAssigned: true,
        boothsList: [],
        recentNivedans: [],
        activeDevWorks: [],
        keyWorkers: [],
      },
    ],
  },
];

const GramWardPage = () => {
  const { lang, setLang } = useLangStore();
  const isMr = lang === 'MR';

  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedArea, setSelectedArea] = useState(SAMPLE_TALUKAS[0].areas[0]);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    taluka: 'ALL',
    gp: 'ALL',
    areaType: 'ALL',
    status: 'ALL',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="gramward-page-container">
      {/* ── Breadcrumb ───────────────────────────────────────── */}
      <div className="breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <span style={{ color: 'var(--t4)' }}>/</span>
        <span>Constituency</span>
        <span style={{ color: 'var(--t4)' }}>/</span>
        <span>Gram & Ward</span>
      </div>

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="ph">
        <div>
          <h1 className="title">
            Gram / Ward Organization · <span className="mr" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>ग्राम / वॉर्ड रचना</span>
          </h1>
          <p className="sub">
            {isMr
              ? 'भौगोलिक रचना — क्षेत्रनिहाय फिल्टरिंग व मतदारसंघ व्यवस्थापन'
              : 'Geographical hierarchy — area-wise filtering and constituency management'}
          </p>
        </div>

        <div className="gramward-actions">
          <button className="btn-o" onClick={() => alert(isMr ? 'Excel इन्पोर्ट करत आहे...' : 'Importing Excel...')}>
            📥 {isMr ? 'इम्पोर्ट Excel' : 'Import Excel'}
          </button>
          <button className="btn-o" onClick={() => alert(isMr ? 'PDF एक्सपोर्ट होत आहे...' : 'Exporting PDF...')}>
            📄 {isMr ? 'एक्सपोर्ट PDF' : 'Export PDF'}
          </button>
          <button className="btn-p" onClick={() => alert(isMr ? 'नवीन क्षेत्र जोडा फॉर्म उघडत आहे...' : 'Add Area form...')}>
            + {isMr ? 'क्षेत्र जोडा' : 'Add Area'}
          </button>
        </div>
      </div>

      {/* ── 6 KPI Summary Stats ─────────────────────────────── */}
      <div className="stats">
        <div className="stat">
          <div className="stat-val" style={{ color: 'var(--t1)' }}>3</div>
          <div className="stat-label">{isMr ? 'तालुके' : 'Talukas'}</div>
        </div>
        <div className="stat">
          <div className="stat-val" style={{ color: 'var(--pu, #7c3aed)' }}>18</div>
          <div className="stat-label">{isMr ? 'ग्रामपंचायती (ग्रा.पं.)' : 'Gram Panchayats'}</div>
        </div>
        <div className="stat">
          <div className="stat-val" style={{ color: 'var(--ok, #16a34a)' }}>47</div>
          <div className="stat-label">{isMr ? 'गावे' : 'Villages'}</div>
        </div>
        <div className="stat">
          <div className="stat-val" style={{ color: 'var(--in, #2563eb)' }}>12</div>
          <div className="stat-label">{isMr ? 'शहर वॉर्ड' : 'City Wards'}</div>
        </div>
        <div className="stat">
          <div className="stat-val" style={{ color: 'var(--wr, #d97706)' }}>156</div>
          <div className="stat-label">{isMr ? 'बूथ' : 'Booths'}</div>
        </div>
        <div className="stat">
          <div className="stat-val" style={{ color: 'var(--er, #dc2626)' }}>34</div>
          <div className="stat-label">{isMr ? 'प्रलंबित निवेदने' : 'Pending Nivedans'}</div>
        </div>
      </div>

      {/* ── Category Tabs ───────────────────────────────────── */}
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          📍 {isMr ? 'सर्व क्षेत्रे' : 'All Areas'} <span className="tab-count">59</span>
        </div>
        <div
          className={`tab ${activeTab === 'VILLAGES' ? 'active' : ''}`}
          onClick={() => setActiveTab('VILLAGES')}
        >
          🏡 {isMr ? 'गावे' : 'Villages'} <span className="tab-count">47</span>
        </div>
        <div
          className={`tab ${activeTab === 'WARDS' ? 'active' : ''}`}
          onClick={() => setActiveTab('WARDS')}
        >
          🏙️ {isMr ? 'शहर वॉर्ड' : 'City Wards'} <span className="tab-count">12</span>
        </div>
        <div
          className={`tab ${activeTab === 'GPS' ? 'active' : ''}`}
          onClick={() => setActiveTab('GPS')}
        >
          🏘️ {isMr ? 'ग्रामपंचायती' : 'Gram Panchayats'} <span className="tab-count">18</span>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="filter-bar">
        <div className="fg">
          <span className="fl">{isMr ? 'शोध' : 'Search'}</span>
          <input
            className="fi"
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder={isMr ? 'गाव, वॉर्ड नाव शोधा...' : 'Village, ward name...'}
            style={{ minWidth: '180px' }}
          />
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'तालुका' : 'Taluka'}</span>
          <select className="fi" name="taluka" value={filters.taluka} onChange={handleFilterChange}>
            <option value="ALL">{isMr ? 'सर्व तालुके' : 'All Talukas'}</option>
            <option value="Haveli">Haveli</option>
            <option value="Maval">Maval</option>
            <option value="Shirur">Shirur</option>
          </select>
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'ग्रामपंचायत' : 'Gram Panchayat'}</span>
          <select className="fi" name="gp" value={filters.gp} onChange={handleFilterChange}>
            <option value="ALL">{isMr ? 'सर्व ग्रा.पं.' : 'All GPs'}</option>
            <option value="Wadgaon GP">Wadgaon GP</option>
            <option value="Pirangut GP">Pirangut GP</option>
            <option value="Urse GP">Urse GP</option>
          </select>
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'क्षेत्र प्रकार' : 'Area Type'}</span>
          <select className="fi" name="areaType" value={filters.areaType} onChange={handleFilterChange}>
            <option value="ALL">{isMr ? 'सर्व प्रकार' : 'All Types'}</option>
            <option value="village">Village (गाव)</option>
            <option value="ward">Ward (वॉर्ड)</option>
          </select>
        </div>

        <div className="fg">
          <span className="fl">{isMr ? 'तक्रार स्थिती' : 'Complaint Status'}</span>
          <select className="fi" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="ALL">{isMr ? 'कोणतीही' : 'Any'}</option>
            <option value="PENDING">{isMr ? 'प्रलंबित आहे' : 'Has Pending'}</option>
            <option value="RESOLVED">{isMr ? 'सर्व मार्गी' : 'All Resolved'}</option>
          </select>
        </div>
      </div>

      {/* ── 2-Column Layout (List Panel + Sticky Detail Drawer) ── */}
      <div className="layout">
        <div className="list-panel">
          {SAMPLE_TALUKAS.map((talukaGroup, tIdx) => (
            <div key={tIdx} className="taluka-group">
              <div className="taluka-header">
                <div className="taluka-icon">📍</div>
                <span className="taluka-name">{talukaGroup.nameEn}</span>
                <span className="taluka-name-mr">{talukaGroup.nameMr}</span>
                <span className="taluka-count">{talukaGroup.countText}</span>
              </div>

              <div className="area-grid">
                {talukaGroup.areas.map((area) => {
                  const isSelected = selectedArea?.id === area.id;
                  const resPct = area.complaints > 0 ? Math.round((area.resolved / area.complaints) * 100) : 100;

                  return (
                    <div
                      key={area.id}
                      className={`area-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedArea(area)}
                    >
                      <span className={`area-type-badge type-${area.type}`}>
                        {area.type}
                      </span>

                      <div className="area-card-header">
                        <div className={`area-icon ${area.type}`}>
                          {area.type === 'village' ? '🏡' : '🏙️'}
                        </div>
                        <div className="area-info">
                          <div className="area-name">
                            {area.nameEn} · <span className="mr" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{area.nameMr}</span>
                          </div>
                          <div className="area-parent">{area.parent}</div>
                        </div>
                      </div>

                      <div className="area-stats">
                        <div className="area-stat">
                          <div className="area-stat-val" style={{ color: 'var(--er, #dc2626)' }}>{area.complaints}</div>
                          <div className="area-stat-label">Complaints</div>
                        </div>
                        <div className="area-stat">
                          <div className="area-stat-val" style={{ color: 'var(--in, #2563eb)' }}>{area.devWorks}</div>
                          <div className="area-stat-label">Dev Works</div>
                        </div>
                        <div className="area-stat">
                          <div className="area-stat-val" style={{ color: 'var(--pu, #7c3aed)' }}>{area.workers}</div>
                          <div className="area-stat-label">Workers</div>
                        </div>
                        <div className="area-stat">
                          <div className="area-stat-val" style={{ color: 'var(--ok, #16a34a)' }}>{area.booths}</div>
                          <div className="area-stat-label">Booths</div>
                        </div>
                      </div>

                      <div className="area-progress">
                        <div className="progress-header">
                          <span>Nivedan Resolution</span>
                          <span>{area.resolved} / {area.complaints} resolved</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill-ok" style={{ width: `${resPct}%` }} />
                          <div className="progress-fill-er" style={{ width: `${100 - resPct}%` }} />
                        </div>
                      </div>

                      <div className="area-footer">
                        <span className="area-booths">
                          🗳️ <strong>{area.booths}</strong> booths · {area.voters.toLocaleString()} voters
                        </span>
                        <span className="area-pramukh">
                          <span className={`pramukh-dot ${area.allPramukhsAssigned ? 'pramukh-yes' : 'pramukh-no'}`} />
                          {area.allPramukhsAssigned
                            ? 'All Pramukh assigned'
                            : `${area.missingPramukhCount || 1} Pramukh missing`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Sticky Detail Drawer (Right Panel) ────────────────── */}
        {selectedArea && (
          <div className="detail-panel">
            <div className="dp-header">
              <button className="dp-close" onClick={() => setSelectedArea(null)}>✕</button>
              <div className="dp-title">
                {selectedArea.type === 'village' ? '🏡' : '🏙️'} {selectedArea.nameEn} · <span className="mr" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{selectedArea.nameMr}</span>
              </div>
              <div className="dp-sub">{selectedArea.parent}</div>

              <div className="dp-stats">
                <div className="dp-stat">
                  <div className="dp-stat-val" style={{ color: 'var(--er, #dc2626)' }}>{selectedArea.complaints}</div>
                  <div className="dp-stat-label">{isMr ? 'निवेदने' : 'Nivedans'}</div>
                </div>
                <div className="dp-stat">
                  <div className="dp-stat-val" style={{ color: 'var(--in, #2563eb)' }}>{selectedArea.devWorks}</div>
                  <div className="dp-stat-label">{isMr ? 'विकास कामे' : 'Dev Works'}</div>
                </div>
                <div className="dp-stat">
                  <div className="dp-stat-val" style={{ color: 'var(--pu, #7c3aed)' }}>{selectedArea.workers}</div>
                  <div className="dp-stat-label">{isMr ? 'कार्यकर्ते' : 'Workers'}</div>
                </div>
                <div className="dp-stat">
                  <div className="dp-stat-val" style={{ color: 'var(--ok, #16a34a)' }}>{selectedArea.booths}</div>
                  <div className="dp-stat-label">{isMr ? 'बूथ' : 'Booths'}</div>
                </div>
              </div>
            </div>

            <div className="dp-body">
              {/* Linked Booths */}
              <div className="dp-section-title">
                🗳️ Booths in {selectedArea.nameEn} ({selectedArea.booths})
              </div>
              {selectedArea.boothsList && selectedArea.boothsList.length > 0 ? (
                selectedArea.boothsList.map((b) => (
                  <div key={b.id} className="linked-item">
                    <div className="li-icon" style={{ background: 'var(--pl)', color: 'var(--p)', fontWeight: 700, fontSize: '12px' }}>
                      {b.id}
                    </div>
                    <div className="li-info">
                      <div className="li-title">{b.title}</div>
                      <div className="li-meta">Pramukh: {b.pramukh} · {b.voters} voters</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--t4)', padding: '6px 0' }}>No booth data available</div>
              )}

              {/* Recent Nivedans */}
              <div className="dp-section-title">
                📝 Recent Nivedans ({selectedArea.recentNivedans?.length || 0})
              </div>
              {selectedArea.recentNivedans && selectedArea.recentNivedans.length > 0 ? (
                selectedArea.recentNivedans.map((n, idx) => (
                  <div key={idx} className="linked-item">
                    <div className="li-icon" style={{ background: 'var(--inb)' }}>📝</div>
                    <div className="li-info">
                      <div className="li-title">{n.title}</div>
                      <div className="li-meta">{n.id} · {n.date}</div>
                    </div>
                    <span className={`li-status status-${n.status}`}>{n.statusText}</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--t4)', padding: '6px 0' }}>No recent nivedans</div>
              )}

              {/* Active Dev Works */}
              <div className="dp-section-title">
                🏗️ Active Development Works ({selectedArea.activeDevWorks?.length || 0})
              </div>
              {selectedArea.activeDevWorks && selectedArea.activeDevWorks.length > 0 ? (
                selectedArea.activeDevWorks.map((dw, idx) => (
                  <div key={idx} className="linked-item">
                    <div className="li-icon" style={{ background: 'var(--wrb)' }}>🏗️</div>
                    <div className="li-info">
                      <div className="li-title">{dw.title}</div>
                      <div className="li-meta">{dw.fund} · {dw.budget} · {dw.progress} complete</div>
                    </div>
                    <span className="li-status status-progress">In Progress</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--t4)', padding: '6px 0' }}>No active development works</div>
              )}

              {/* Key Workers */}
              <div className="dp-section-title">
                👥 Key Workers ({selectedArea.workers} total)
              </div>
              <div className="worker-avatars">
                {selectedArea.keyWorkers && selectedArea.keyWorkers.length > 0 ? (
                  selectedArea.keyWorkers.map((kw, idx) => (
                    <div key={idx} className="w-avatar" title={kw.name}>
                      {kw.initials}
                    </div>
                  ))
                ) : (
                  <div className="w-avatar">KP</div>
                )}
                <div className="w-avatar w-more">+{Math.max(0, selectedArea.workers - (selectedArea.keyWorkers?.length || 0))}</div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                <button className="btn-o" style={{ height: '32px', fontSize: '12px' }} onClick={() => alert('Exporting area report...')}>
                  📄 {isMr ? 'अहवाल' : 'Area Report'}
                </button>
                <button className="btn-p" style={{ height: '32px', fontSize: '12px' }} onClick={() => alert(`Opening details for ${selectedArea.nameEn}...`)}>
                  👁 {isMr ? 'सविस्तर पहा' : 'View Full Detail'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GramWardPage;
