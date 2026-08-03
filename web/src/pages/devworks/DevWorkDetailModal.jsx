// src/pages/devworks/DevWorkDetailModal.jsx
// ============================================================
// Modal for Viewing Project Details, Interactive Progress Slider (0-100%),
// Budget Tracker Gauge & Geotagged Photo Gallery (Before / During / After)
// ============================================================

import { useState } from 'react';
import api from '../../services/api.js';

const DevWorkDetailModal = ({ isOpen, onClose, entry, onUpdateSuccess }) => {
  const [progressVal, setProgressVal] = useState(entry?.progress_percentage || 0);
  const [spentVal, setSpentVal] = useState(entry?.budget_spent || 0);
  const [statusVal, setStatusVal] = useState(entry?.status || 'SANCTIONED');
  const [activePhotoStage, setActivePhotoStage] = useState('ALL');
  const [updating, setUpdating] = useState(false);

  // Photo upload sub-form state
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoStage, setPhotoStage] = useState('DURING');
  const [photoCaption, setPhotoCaption] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  if (!isOpen || !entry) return null;

  const allocated = Number(entry.budget_allocated) || 0;
  const spent = Number(spentVal) || 0;
  const spentPct = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;

  const photosList = Array.isArray(entry.photos) ? entry.photos : [];
  const filteredPhotos = activePhotoStage === 'ALL'
    ? photosList
    : photosList.filter((p) => p.photo_stage === activePhotoStage);

  // Save Progress Slider & Budget Update
  const handleSaveProgress = async () => {
    setUpdating(true);
    try {
      await api.patch(`/devworks/${entry.id}`, {
        progress_percentage: progressVal,
        budget_spent: spentVal,
        status: statusVal,
      });
      onUpdateSuccess();
      alert('प्रकल्प प्रगती व अर्थसंकल्प यशस्वीरित्या अपडेट झाला!');
    } catch (err) {
      alert(err?.response?.data?.message || 'अपडेट करताना त्रुटी आली.');
    } finally {
      setUpdating(false);
    }
  };

  // Upload Geotagged Photo
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
      onUpdateSuccess();
    } catch (err) {
      alert(err?.response?.data?.message || 'फोटो अपलोड करताना त्रुटी आली.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="inward-modal-overlay" onClick={onClose}>
      <div className="inward-modal-container detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inward-modal-header">
          <div className="modal-title-group">
            <span className="detail-ref-badge">{entry.category}</span>
            <h3>{entry.project_name}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="detail-modal-body">
          {/* Top Meta summary */}
          <div className="detail-summary-bar">
            <div className="summary-item">
              <span className="item-label">निधीचा स्रोत (Funding)</span>
              <span className="item-value">🏛️ {entry.funding_source}</span>
            </div>
            <div className="summary-item">
              <span className="item-label">मंजूर अर्थसंकल्प (Allocated)</span>
              <span className="item-value" style={{ color: '#4ade80' }}>₹ {(allocated / 100000).toFixed(2)} लाख</span>
            </div>
            <div className="summary-item">
              <span className="item-label">खर्च झालेली रक्कम (Spent)</span>
              <span className="item-value" style={{ color: '#fb923c' }}>₹ {(spent / 100000).toFixed(2)} लाख</span>
            </div>
            <div className="summary-item">
              <span className="item-label">स्थिती (Status)</span>
              <span className="item-value" style={{ color: '#38bdf8' }}>{statusVal}</span>
            </div>
          </div>

          {/* Interactive Progress Slider & Budget Tracker Bar */}
          <div className="detail-section status-actions-box">
            <h4 className="section-title">📊 प्रकल्प प्रगती आणि अर्थसंकल्प ट्रॅकर (Progress Slider)</h4>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#f8fafc' }}>
                <span>कामाची प्रगती (Completion Progress): <strong>{progressVal}%</strong></span>
                <span>खर्च टक्केवारी: <strong>{spentPct}%</strong></span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={progressVal}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setProgressVal(val);
                  if (val === 100) setStatusVal('COMPLETED');
                  else if (val > 0 && statusVal === 'SANCTIONED') setStatusVal('IN_PROGRESS');
                }}
                style={{ width: '100%', accentColor: '#ff9933', cursor: 'pointer', height: '8px' }}
              />
            </div>

            {/* Budget Gauge Bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                अर्थसंकल्प वापर (Spent ₹ {(spent / 100000).toFixed(2)} L of ₹ {(allocated / 100000).toFixed(2)} L)
              </div>
              <div style={{ width: '100%', height: '12px', background: '#0f172a', borderRadius: '6px', overflow: 'hidden', border: '1px solid #334155' }}>
                <div
                  style={{
                    width: `${Math.min(spentPct, 100)}%`,
                    height: '100%',
                    background: spentPct > 100 ? '#ef4444' : 'linear-gradient(90deg, #ff9933, #16a34a)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* Quick Spent Amount Input */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>खर्च झालेली नवीन रक्कम ₹ (Spent Amount):</label>
                <input
                  type="number"
                  value={spentVal}
                  onChange={(e) => setSpentVal(e.target.value)}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#ffffff', padding: '0.45rem', borderRadius: '6px', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>प्रकल्प स्थिती (Status):</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#ffffff', padding: '0.45rem', borderRadius: '6px', marginTop: '0.25rem' }}
                >
                  <option value="SANCTIONED">SANCTIONED (मंजूर)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (प्रगतीपथावर)</option>
                  <option value="COMPLETED">COMPLETED (पूर्ण)</option>
                  <option value="DELAYED">DELAYED (विलंबित)</option>
                </select>
              </div>

              <button
                className="btn-primary"
                onClick={handleSaveProgress}
                disabled={updating}
                style={{ marginTop: '1.25rem', padding: '0.55rem 1.1rem' }}
              >
                {updating ? 'जतन होत आहे...' : '💾 बदला जतन करा (Save Changes)'}
              </button>
            </div>
          </div>

          {/* Project Details */}
          <div className="detail-section">
            <h4 className="section-title">📍 स्थान व ठेकेदार माहिती</h4>
            <div className="info-grid">
              <div><strong>ठिकाण:</strong> {entry.location}</div>
              <div><strong>ठेकेदार:</strong> {entry.contractor_name || '—'}</div>
              <div><strong>मोबाईल:</strong> {entry.contractor_contact || '—'}</div>
              <div><strong>GPS Lat/Lng:</strong> {entry.geo_latitude || '19.6917'}, {entry.geo_longitude || '74.4842'}</div>
              <div><strong>सुरुवात तारीख:</strong> {entry.start_date || '—'}</div>
              <div><strong>अपेक्षित पूर्णता:</strong> {entry.expected_completion_date || '—'}</div>
            </div>
          </div>

          {/* Geotagged Photo Gallery (Before / During / After) */}
          <div className="detail-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h4 className="section-title" style={{ margin: 0 }}>🖼️ फोटो गॅलरी (Geotagged Photo Gallery)</h4>
              <button className="btn-secondary" onClick={() => setShowPhotoForm(!showPhotoForm)}>
                + फोटो जोडा (Upload Photo)
              </button>
            </div>

            {/* Photo Upload Form Dialog */}
            {showPhotoForm && (
              <form onSubmit={handleUploadPhoto} style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', borderRadius: '8px', border: '1px solid #38bdf8', marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="इमेज फाईल URL (Cloudinary URL)..."
                    style={{ background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                    required
                  />
                  <select
                    value={photoStage}
                    onChange={(e) => setPhotoStage(e.target.value)}
                    style={{ background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  >
                    <option value="BEFORE">🟢 कामापूर्वी (BEFORE)</option>
                    <option value="DURING">🟡 काम सुरू असताना (DURING)</option>
                    <option value="AFTER">🔵 काम पूर्ण झाल्यावर (AFTER)</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="फोटोचे वर्णन / कॅप्शन..."
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.75rem' }}
                />
                <button type="submit" className="btn-primary" disabled={uploadingPhoto}>
                  {uploadingPhoto ? 'अपलोड होत आहे...' : 'फोटो जतन करा'}
                </button>
              </form>
            )}

            {/* Tabbed Photo Stage Filters */}
            <div className="status-tabs-container" style={{ marginBottom: '1rem' }}>
              <button
                className={`status-tab-btn ${activePhotoStage === 'ALL' ? 'active' : ''}`}
                onClick={() => setActivePhotoStage('ALL')}
              >
                📷 सर्व फोटो ({photosList.length})
              </button>
              <button
                className={`status-tab-btn ${activePhotoStage === 'BEFORE' ? 'active' : ''}`}
                onClick={() => setActivePhotoStage('BEFORE')}
              >
                🟢 कामापूर्वी (BEFORE)
              </button>
              <button
                className={`status-tab-btn ${activePhotoStage === 'DURING' ? 'active' : ''}`}
                onClick={() => setActivePhotoStage('DURING')}
              >
                🟡 काम सुरू असताना (DURING)
              </button>
              <button
                className={`status-tab-btn ${activePhotoStage === 'AFTER' ? 'active' : ''}`}
                onClick={() => setActivePhotoStage('AFTER')}
              >
                🔵 काम पूर्ण झाल्यावर (AFTER)
              </button>
            </div>

            {/* Photos Grid */}
            {filteredPhotos.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {filteredPhotos.map((p) => (
                  <div key={p.id} style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 153, 51, 0.2)' }}>
                    <img src={p.photo_url} alt={p.caption} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: '0.5rem 0.75rem' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: p.photo_stage === 'BEFORE' ? '#4ade80' : p.photo_stage === 'DURING' ? '#fb923c' : '#38bdf8' }}>
                        {p.photo_stage}
                      </span>
                      <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: '0.2rem 0 0 0' }}>{p.caption || 'फोटो'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-attachments">या टप्प्यासाठी कोणताही फोटो अपलोड केलेला नाही.</p>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            बंद करा (Close)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevWorkDetailModal;
