// src/pages/nivedan/NivedanDetailModal.jsx
// ============================================================
// Modal for Viewing Nivedan Details, Status Transitions, Notes,
// and Immutable Vertical Activity History Log Timeline.
// ============================================================

import { useState } from 'react';
import NivedanStatusBadge from '../../components/nivedan/NivedanStatusBadge.jsx';
import PriorityBadge from '../../components/inward/PriorityBadge.jsx';
import api from '../../services/api.js';

const NivedanDetailModal = ({ isOpen, onClose, entry, onUpdateSuccess }) => {
  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolveInput, setShowResolveInput] = useState(false);

  if (!isOpen || !entry) return null;

  const handleStatusChange = async (newStatus) => {
    if (newStatus === 'RESOLVED' && !resolutionNotes.trim()) {
      setShowResolveInput(true);
      return;
    }

    setUpdating(true);
    try {
      await api.patch(`/nivedans/${entry.id}/status`, {
        status: newStatus,
        resolution_notes: resolutionNotes,
        note: resolutionNotes || `स्थिती बदल: ${newStatus}`,
      });
      setShowResolveInput(false);
      onUpdateSuccess();
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || 'स्थिती बदलताना त्रुटी आली.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setUpdating(true);
    try {
      await api.post(`/nivedans/${entry.id}/timeline`, {
        note: newNote,
        is_internal: true,
      });
      setNewNote('');
      onUpdateSuccess();
    } catch (err) {
      alert(err?.response?.data?.message || 'टीप जोडताना त्रुटी आली.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="inward-modal-overlay" onClick={onClose}>
      <div className="inward-modal-container detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inward-modal-header">
          <div className="modal-title-group">
            <span className="detail-ref-badge">{entry.tracking_id}</span>
            <h3>निवेदन तपशील व टाइमलाईन (Petition Details & Timeline)</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="detail-modal-body">
          {/* Top Status & Meta Card */}
          <div className="detail-summary-bar">
            <div className="summary-item">
              <span className="item-label">नागरिकाचे नाव (Citizen)</span>
              <span className="item-value">👤 {entry.citizen_name}</span>
            </div>
            <div className="summary-item">
              <span className="item-label">मोबाईल (Mobile)</span>
              <span className="item-value">📱 {entry.citizen_mobile}</span>
            </div>
            <div className="summary-item">
              <span className="item-label">प्राधान्यक्रम (Priority)</span>
              <PriorityBadge priority={entry.priority} />
            </div>
            <div className="summary-item">
              <span className="item-label">सध्याची स्थिती (Status)</span>
              <NivedanStatusBadge status={entry.status} />
            </div>
          </div>

          {/* Citizen Details */}
          <div className="detail-section">
            <h4 className="section-title">🏠 नागरिक व वर्गवारी माहिती</h4>
            <div className="info-grid">
              <div><strong>पत्ता:</strong> {entry.citizen_address_line || '—'}</div>
              <div><strong>वर्गवारी:</strong> {entry.category?.name_mr || '—'}</div>
              <div><strong>विभाग:</strong> {entry.forwardedDepartment?.name_mr || '—'}</div>
            </div>
          </div>

          {/* Subject & Description */}
          <div className="detail-section">
            <h4 className="section-title">📝 विषयाचा सविस्तर मसुदा</h4>
            <div className="subject-box">
              <strong>विषय:</strong> {entry.subject}
            </div>
            <div className="description-box">
              <strong>तपशील:</strong> {entry.description}
            </div>
          </div>

          {/* Status Actions Box */}
          <div className="detail-section status-actions-box">
            <h4 className="section-title">⚡ कार्यस्थिती अपडेट (Status Transition)</h4>

            <div className="whatsapp-toggle-bar" style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', fontSize: '0.82rem' }}>
              <input
                type="checkbox"
                id="whatsapp-check"
                defaultChecked={true}
                style={{ accentColor: '#22c55e', cursor: 'pointer' }}
              />
              <label htmlFor="whatsapp-check" style={{ cursor: 'pointer', fontWeight: 600 }}>
                💬 नागरिकाला व्हॉट्सॲप अलर्ट संदेश पाठवा (Send WhatsApp SMS Alert to Citizen)
              </label>
            </div>

            {showResolveInput && (
              <div className="resolve-notes-input-box">
                <label>पूर्ण झाल्याची नोंद व टिप्पणी (Resolution Note):</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="नागरिकाच्या अर्जावर काय कार्यवाही करण्यात आली त्याची नोंद लिहा..."
                  rows={2}
                />
                <button
                  className="status-btn btn-complete"
                  onClick={() => handleStatusChange('RESOLVED')}
                >
                  ✓ पूर्ण म्हणून नोंदवा (Confirm Resolution)
                </button>
              </div>
            )}

            <div className="status-buttons-group">
              <button
                className="status-btn btn-progress"
                onClick={() => handleStatusChange('IN_PROGRESS')}
                disabled={updating || entry.status === 'IN_PROGRESS'}
              >
                प्रगतीपथावर (IN_PROGRESS)
              </button>

              <button
                className="status-btn btn-assign"
                onClick={() => handleStatusChange('FORWARDED')}
                disabled={updating || entry.status === 'FORWARDED'}
              >
                विभागाकडे पाठवले (FORWARDED)
              </button>

              <button
                className="status-btn btn-complete"
                onClick={() => setShowResolveInput(!showResolveInput)}
                disabled={updating || entry.status === 'RESOLVED'}
              >
                ✓ मार्गी लावले / पूर्ण (RESOLVED)
              </button>

              <button
                className="status-btn btn-cancel"
                onClick={() => handleStatusChange('REJECTED')}
                disabled={updating || entry.status === 'REJECTED'}
              >
                ✕ नाकारले (REJECTED)
              </button>
            </div>
          </div>

          {/* Timeline Activity Log History */}
          <div className="detail-section timeline-section">
            <h4 className="section-title">📜 टाइमलाईन आणि घडामोडींचा इतिहास (Activity Timeline)</h4>

            {/* Note Input */}
            <form onSubmit={handleAddNote} className="add-note-form">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="कार्यालयीन नोंद किंवा टीप जोडा (Add Internal Note)..."
              />
              <button type="submit" className="btn-secondary" disabled={updating}>
                + टीप जोडा
              </button>
            </form>

            {/* Vertical Timeline */}
            <div className="vertical-timeline">
              {Array.isArray(entry.timeline) && entry.timeline.length > 0 ? (
                entry.timeline.map((t) => {
                  let actionIcon = '🔄';
                  if (t.action_type === 'CREATED') actionIcon = '📌';
                  else if (t.action_type === 'RESOLVED') actionIcon = '✅';
                  else if (t.action_type === 'FORWARDED') actionIcon = '📤';
                  else if (t.action_type === 'NOTE_ADDED') actionIcon = '💬';

                  return (
                    <div key={t.id} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-top">
                          <span className="timeline-action">{actionIcon} {t.action_type}</span>
                          <span className="timeline-date">{new Date(t.created_at).toLocaleString('mr-IN')}</span>
                        </div>
                        <p className="timeline-note">{t.note}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="timeline-performer">
                            👤 {t.performer?.full_name || 'कार्यालय प्रतिनिधी'}
                          </span>
                          <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: t.is_internal ? 'rgba(234, 88, 12, 0.2)' : 'rgba(56, 189, 248, 0.2)', color: t.is_internal ? '#fb923c' : '#38bdf8' }}>
                            {t.is_internal ? '🔒 अंतर्गत नोंद' : '🌐 सार्वजनिक'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="no-attachments">कोणतीही टाइमलाईन नोंद उपलब्ध नाही.</p>
              )}
            </div>
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

export default NivedanDetailModal;
