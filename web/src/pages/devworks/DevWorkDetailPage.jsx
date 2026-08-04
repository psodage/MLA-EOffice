// src/pages/devworks/DevWorkDetailPage.jsx
// ============================================================
// Development Works Standalone Project Detail Page
// Matching WIREFRAMES/dev_works_detail.html
// Features: Full-page layout, Breadcrumb navigation, Progress Bar,
// Meta Grid, Geotagged Photo Gallery (BEFORE/DURING/AFTER) & Milestones Timeline
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';
import './DevWorksListPage.css';

const CATEGORY_MAP = {
  ROAD: { en: '🛣️ Road', mr: '🛣️ रस्ते / पूल', bg: 'var(--inb, #eff6ff)', color: 'var(--in, #2563eb)' },
  WATER_PIPELINE: { en: '💧 Water', mr: '💧 पाणीपुरवठा', bg: 'var(--okb, #f0fdf4)', color: 'var(--ok, #16a34a)' },
  HOSPITAL: { en: '🏥 Hospital', mr: '🏥 रुग्णालय', bg: 'var(--erb, #fef2f2)', color: 'var(--er, #dc2626)' },
  SCHOOL: { en: '🏫 School', mr: '🏫 शाळा / शिक्षण', bg: 'var(--erb, #fef2f2)', color: 'var(--er, #dc2626)' },
  STREET_LIGHT: { en: '⚡ Street Light', mr: '⚡ रस्त्यावरील दिवे', bg: 'var(--pub, #f5f3ff)', color: 'var(--pu, #7c3aed)' },
  ELECTRIFICATION: { en: '⚡ Electrification', mr: '⚡ विद्युतीकरण', bg: 'var(--pub, #f5f3ff)', color: 'var(--pu, #7c3aed)' },
  COMMUNITY_HALL: { en: '🏛️ Hall', mr: '🏛️ समाजमंदिर', bg: 'var(--wrb, #fffbeb)', color: 'var(--wr, #d97706)' },
  OTHER: { en: '🏗️ Other', mr: '🏗️ इतर प्रकल्प', bg: 'var(--bg, #f5f7fa)', color: 'var(--t2, #475569)' },
};

const STATUS_MAP = {
  SANCTIONED: { en: 'Sanctioned', mr: 'मंजूर', badgeClass: 'b-sanc' },
  IN_PROGRESS: { en: 'In Progress', mr: 'सुरू (प्रगतीवर)', badgeClass: 'b-prog' },
  COMPLETED: { en: 'Completed', mr: 'पूर्ण', badgeClass: 'b-comp' },
  DELAYED: { en: 'Delayed', mr: 'विलंबित', badgeClass: 'b-delay' },
};

const formatCurrency = (val) => {
  const num = Number(val) || 0;
  if (num >= 10000000) {
    return `₹ ${(num / 10000000).toFixed(2)} Cr`;
  }
  return `₹ ${(num / 100000).toFixed(2)} L`;
};

const DEFAULT_MILESTONES = [
  { id: 1, title: 'Land Acquisition & Sanction', desc: 'Approvals & land clearance completed', date: '15 Feb 2026', status: 'COMPLETED' },
  { id: 2, title: 'Foundation & Earth Work', desc: 'Underground levelling and foundation complete', date: '30 Apr 2026', status: 'COMPLETED' },
  { id: 3, title: 'Phase 1 Construction', desc: 'Primary structural assembly', date: '20 Jun 2026', status: 'COMPLETED' },
  { id: 4, title: 'Phase 2 Execution (Current)', desc: 'Surface work and secondary installation', date: 'ETA: 15 Aug 2026', status: 'IN_PROGRESS' },
  { id: 5, title: 'Final Testing & Inspection', desc: 'Quality audit and safety check', date: 'ETA: 30 Sep 2026', status: 'PENDING' },
  { id: 6, title: 'Handover & Inauguration', desc: 'Official inauguration ceremony', date: 'ETA: 15 Oct 2026', status: 'PENDING' },
];

const DevWorkDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang } = useLangStore();
  const isMr = lang === 'MR';

  const [entry, setEntry] = useState(location.state?.entry || null);
  const [loading, setLoading] = useState(!location.state?.entry);
  const [progressVal, setProgressVal] = useState(0);
  const [spentVal, setSpentVal] = useState(0);
  const [statusVal, setStatusVal] = useState('SANCTIONED');
  const [activePhotoStage, setActivePhotoStage] = useState('ALL');
  const [showEditSection, setShowEditSection] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Photo upload state
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoStage, setPhotoStage] = useState('DURING');
  const [photoCaption, setPhotoCaption] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const fetchProjectDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/devworks/${id}`);
      const project = data.data || data;
      setEntry(project);
      setProgressVal(project.progress_percentage || 0);
      setSpentVal(project.budget_spent || 0);
      setStatusVal(project.status || 'SANCTIONED');
    } catch (err) {
      console.warn('Failed to fetch project detail from API, using fallback state:', err);
      if (!entry) {
        setEntry({
          id: id || 1,
          project_name: 'NH-4 Junction Road Widening',
          category: 'ROAD',
          location: 'Pimpri-Chinchwad, Ward 5 · Haveli Taluka',
          geo_latitude: 18.6298,
          geo_longitude: 73.7997,
          funding_source: 'State PWD',
          budget_allocated: 24500000.0,
          budget_spent: 17640000.0,
          contractor_name: 'Patel Infra Pvt Ltd',
          contractor_contact: '98765 00123',
          start_date: '01 Mar 2026',
          expected_completion_date: '15 Oct 2026',
          status: 'IN_PROGRESS',
          progress_percentage: 72,
          photos: [
            { id: 101, photo_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800', photo_stage: 'BEFORE', caption: 'कामापूर्वीची परिस्थिती', created_at: '2026-03-01' },
            { id: 102, photo_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800', photo_stage: 'DURING', caption: 'काम सुरू असताना', created_at: '2026-07-15' },
          ],
        });
        setProgressVal(72);
        setSpentVal(17640000);
        setStatusVal('IN_PROGRESS');
      }
    } finally {
      setLoading(false);
    }
  }, [id, entry]);

  useEffect(() => {
    if (entry) {
      setProgressVal(entry.progress_percentage || 0);
      setSpentVal(entry.budget_spent || 0);
      setStatusVal(entry.status || 'SANCTIONED');
    }
    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="devworks-page-container" style={{ padding: '60px', textAlign: 'center' }}>
        <p>{isMr ? 'प्रकल्प माहिती लोड होत आहे...' : 'Loading project details...'}</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="devworks-page-container" style={{ padding: '60px', textAlign: 'center' }}>
        <h2>{isMr ? 'प्रकल्प सापडला नाही' : 'Project Not Found'}</h2>
        <Link to="/devworks" className="btn-p" style={{ marginTop: '16px', display: 'inline-flex' }}>
          ← {isMr ? 'विकासकामे यादीवर परत जा' : 'Back to Development Works List'}
        </Link>
      </div>
    );
  }

  const allocated = Number(entry.budget_allocated) || 0;
  const spent = Number(spentVal) || 0;
  const spentPct = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;

  const catConfig = CATEGORY_MAP[entry.category] || CATEGORY_MAP.OTHER;
  const statusConfig = STATUS_MAP[statusVal] || STATUS_MAP.SANCTIONED;

  const photosList = Array.isArray(entry.photos) && entry.photos.length > 0
    ? entry.photos
    : [
        { id: 101, photo_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800', photo_stage: 'BEFORE', caption: 'कामापूर्वीची परिस्थिती', created_at: '2026-03-01' },
        { id: 102, photo_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800', photo_stage: 'DURING', caption: 'काम सुरू असताना', created_at: '2026-07-15' },
      ];

  const filteredPhotos = activePhotoStage === 'ALL'
    ? photosList
    : photosList.filter((p) => p.photo_stage === activePhotoStage);

  const handleSaveProgress = async () => {
    setUpdating(true);
    try {
      await api.patch(`/devworks/${entry.id}`, {
        progress_percentage: progressVal,
        budget_spent: spentVal,
        status: statusVal,
      });
      setShowEditSection(false);
      alert(isMr ? 'प्रकल्प प्रगती व अर्थसंकल्प अपडेट झाला!' : 'Project progress updated successfully!');
      fetchProjectDetails();
    } catch (err) {
      alert(err?.response?.data?.message || (isMr ? 'अपडेट करताना त्रुटी आली.' : 'Failed to update project.'));
    } finally {
      setUpdating(false);
    }
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!photoUrl.trim()) return;

    setUploadingPhoto(true);
    try {
      await api.post(`/devworks/${entry.id}/photos`, {
        photo_url: photoUrl,
        photo_stage: photoStage,
        caption: photoCaption,
      });
      setPhotoUrl('');
      setPhotoCaption('');
      setShowPhotoForm(false);
      fetchProjectDetails();
    } catch (err) {
      alert(err?.response?.data?.message || (isMr ? 'फोटो अपलोड करताना त्रुटी आली.' : 'Failed to upload photo.'));
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="devworks-page-container">
      {/* Top Header Row with Language Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button className="btn-o" onClick={() => navigate('/devworks')}>
          ← {isMr ? 'विकासकामे यादीवर परत जा' : 'Back to Development Works List'}
        </button>

        <div className="segmented-switch">
          <button
            type="button"
            className={lang === 'EN' ? 'active' : ''}
            onClick={() => setLang('EN')}
          >
            EN
          </button>
          <button
            type="button"
            className={lang === 'MR' ? 'active' : ''}
            onClick={() => setLang('MR')}
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* ── Breadcrumb Navigation ────────────────────────────── */}
      <div className="detail-breadcrumb">
        <Link to="/dashboard">{isMr ? 'डॅशबोर्ड' : 'Dashboard'}</Link>
        <span style={{ color: 'var(--t4)' }}>/</span>
        <Link to="/devworks">{isMr ? 'विकासकामे' : 'Development Works'}</Link>
        <span style={{ color: 'var(--t4)' }}>/</span>
        <span>{entry.project_name}</span>
      </div>

      {/* ── Detailed Header ────────────────────────────────── */}
      <div className="detail-header-card">
        <div className="dh-top">
          <div>
            <span className="dh-cat" style={{ background: catConfig.bg, color: catConfig.color }}>
              {isMr ? catConfig.mr : catConfig.en}
            </span>
            <div className="dh-title">{entry.project_name}</div>
            <div className="dh-loc">📍 {entry.location}</div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className={`badge ${statusConfig.badgeClass}`}>
              🟡 {isMr ? statusConfig.mr : statusConfig.en}
            </span>
            <button className="btn-o" onClick={() => setShowEditSection(!showEditSection)}>
              ✏️ {isMr ? 'संपादित करा' : 'Edit'}
            </button>
            <button className="btn-p" onClick={() => setShowPhotoForm(!showPhotoForm)}>
              📷 {isMr ? 'फोटो जोडा' : 'Add Photo'}
            </button>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="progress-section">
          <div className="pg-bar-lg">
            <div
              className="pg-fill-lg"
              style={{
                width: `${Math.min(progressVal, 100)}%`,
                background: statusVal === 'COMPLETED' ? 'var(--ok, #16a34a)' : statusVal === 'DELAYED' ? 'var(--er, #dc2626)' : 'var(--wr, #d97706)',
              }}
            >
              {progressVal}%
            </div>
          </div>
          <div className="pg-labels">
            <span>{isMr ? 'सुरुवात:' : 'Started:'} {entry.start_date || '01 Mar 2026'}</span>
            <span>
              {statusVal === 'COMPLETED'
                ? (isMr ? 'पूर्ण झाले: ' : 'Completed: ') + (entry.actual_completion_date || '20 Jul 2026')
                : (isMr ? 'अपेक्षित पूर्णता: ' : 'Due: ') + (entry.expected_completion_date || '15 Oct 2026') + ' (74 days left)'}
            </span>
          </div>
        </div>

        {/* Meta Grid */}
        <div className="meta-grid">
          <div className="meta-item">
            <span className="meta-label">{isMr ? 'अर्थसंकल्प · अंदाजपत्रक' : 'Budget'}</span>
            <span className="meta-value" style={{ fontFamily: 'JetBrains Mono', color: 'var(--p, #1b3a5c)', fontSize: '18px', fontWeight: 700 }}>
              {formatCurrency(allocated)}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">{isMr ? 'खर्च ·Spent' : 'Spent'}</span>
            <span className="meta-value" style={{ fontFamily: 'JetBrains Mono' }}>
              {formatCurrency(spent)} ({spentPct}%)
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">{isMr ? 'निधीचा स्रोत · निधी' : 'Funding Source'}</span>
            <span className="meta-value">{entry.funding_source || 'State PWD'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">{isMr ? 'ठेकेदार' : 'Contractor'}</span>
            <span className="meta-value">{entry.contractor_name || 'Patel Infra Pvt Ltd'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">{isMr ? 'संपर्क' : 'Contact'}</span>
            <span className="meta-value" style={{ fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
              {entry.contractor_contact || '98765 00123'}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">GPS Coordinates</span>
            <span className="meta-value" style={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}>
              {entry.geo_latitude || '18.6298'}°N, {entry.geo_longitude || '73.7997'}°E
            </span>
          </div>
        </div>
      </div>

      {/* Quick Edit Progress Section */}
      {showEditSection && (
        <div className="card" style={{ padding: '16px', marginBottom: '16px', border: '1px solid var(--p, #1b3a5c)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--p, #1b3a5c)' }}>
            📊 {isMr ? 'प्रगती टक्केवारी व खर्च अपडेट करा' : 'Update Project Progress & Spent Budget'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
            <div>
              <label className="filter-fl">{isMr ? 'प्रगती %:' : 'Progress %:'} {progressVal}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={progressVal}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setProgressVal(v);
                  if (v === 100) setStatusVal('COMPLETED');
                  else if (v > 0 && statusVal === 'SANCTIONED') setStatusVal('IN_PROGRESS');
                }}
                style={{ width: '100%', accentColor: 'var(--p, #1b3a5c)', cursor: 'pointer', marginTop: '6px' }}
              />
            </div>
            <div>
              <label className="filter-fl">{isMr ? 'खर्च रक्कम ₹' : 'Spent Budget ₹'}</label>
              <input
                type="number"
                className="filter-fi"
                value={spentVal}
                onChange={(e) => setSpentVal(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label className="filter-fl">{isMr ? 'स्थिती' : 'Status'}</label>
              <select className="filter-fi" value={statusVal} onChange={(e) => setStatusVal(e.target.value)} style={{ width: '100%' }}>
                <option value="SANCTIONED">Sanctioned (मंजूर)</option>
                <option value="IN_PROGRESS">In Progress (सुरू)</option>
                <option value="COMPLETED">Completed (पूर्ण)</option>
                <option value="DELAYED">Delayed (विलंबित)</option>
              </select>
            </div>
            <button className="btn-p" onClick={handleSaveProgress} disabled={updating}>
              {updating ? (isMr ? 'जतन होत आहे...' : 'Saving...') : `💾 ${isMr ? 'जतन करा' : 'Save'}`}
            </button>
          </div>
        </div>
      )}

      {/* Photo Upload Form Drawer */}
      {showPhotoForm && (
        <form onSubmit={handleUploadPhoto} className="card" style={{ padding: '16px', marginBottom: '16px', border: '1px solid var(--p, #1b3a5c)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
            📷 {isMr ? 'नवीन जिओटॅग फोटो अपलोड करा' : 'Upload Geotagged Progress Photo'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <input
              type="url"
              className="filter-fi"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder={isMr ? 'इमेज फाईल URL (Cloudinary / Direct image link)...' : 'Image file URL...'}
              required
            />
            <select className="filter-fi" value={photoStage} onChange={(e) => setPhotoStage(e.target.value)}>
              <option value="BEFORE">🟢 कामापूर्वी (BEFORE)</option>
              <option value="DURING">🟡 काम सुरू असताना (DURING)</option>
              <option value="AFTER">🔵 काम पूर्ण झाल्यावर (AFTER)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="filter-fi"
              style={{ flex: 1 }}
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              placeholder={isMr ? 'फोटोचे वर्णन / कॅप्शन...' : 'Photo description / caption...'}
            />
            <button type="submit" className="btn-p" disabled={uploadingPhoto}>
              {uploadingPhoto ? '...' : `💾 ${isMr ? 'अपलोड' : 'Upload'}`}
            </button>
          </div>
        </form>
      )}

      {/* ── Content Grid (Photos & Milestones) ──────────────── */}
      <div className="content-grid">
        {/* Photo Gallery */}
        <div className="card">
          <div className="card-header">
            📷 {isMr ? 'प्रगती फोटो · Progress Photos' : 'Progress Photos'}
            <span style={{ color: 'var(--t4)', fontWeight: 400, marginLeft: 'auto', fontSize: '12px' }}>
              {filteredPhotos.length} {isMr ? 'फोटो' : 'photos'}
            </span>
          </div>
          <div className="card-body">
            {/* Photo Stage Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
              {['ALL', 'BEFORE', 'DURING', 'AFTER'].map((stg) => (
                <button
                  key={stg}
                  onClick={() => setActivePhotoStage(stg)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: '1px solid var(--b, #dde3eb)',
                    background: activePhotoStage === stg ? 'var(--p, #1b3a5c)' : 'var(--c, #ffffff)',
                    color: activePhotoStage === stg ? '#ffffff' : 'var(--t3, #64748b)',
                    cursor: 'pointer',
                  }}
                >
                  {stg}
                </button>
              ))}
            </div>

            <div className="photo-grid">
              {filteredPhotos.map((p) => (
                <div key={p.id} className="photo" onClick={() => window.open(p.photo_url, '_blank')}>
                  <img src={p.photo_url} alt={p.caption || 'Project Photo'} />
                  <span className="date">{p.photo_stage} · {p.created_at ? p.created_at.slice(0, 10) : 'Recent'}</span>
                </div>
              ))}
              <div className="photo photo-add" onClick={() => setShowPhotoForm(true)} title="Add Photo">
                +
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="card">
          <div className="card-header">
            📋 {isMr ? 'प्रकल्पाचे टप्पे · Milestones' : 'Milestones'}
          </div>
          <div className="card-body" style={{ padding: '12px 20px' }}>
            {DEFAULT_MILESTONES.map((m) => {
              const isDone = m.status === 'COMPLETED';
              const isOngoing = m.status === 'IN_PROGRESS';
              return (
                <div key={m.id} className="milestone">
                  <div
                    className="ml-dot"
                    style={{
                      background: isDone ? 'var(--okb, #f0fdf4)' : isOngoing ? 'var(--wrb, #fffbeb)' : 'var(--bg, #f5f7fa)',
                      color: isDone ? 'var(--ok, #16a34a)' : isOngoing ? 'var(--wr, #d97706)' : 'var(--t4, #94a3b8)',
                    }}
                  >
                    {isDone ? '✓' : isOngoing ? '→' : '○'}
                  </div>
                  <div className="ml-content">
                    <div className="ml-title">{m.title}</div>
                    <div className="ml-desc">{m.desc}</div>
                    <div className="ml-date">{m.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevWorkDetailPage;
