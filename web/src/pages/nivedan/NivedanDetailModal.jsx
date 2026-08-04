// src/pages/nivedan/NivedanDetailModal.jsx
// ============================================================
// Modal for Viewing Nivedan Details, Status Transitions, Notes,
// WhatsApp Logs and Immutable Vertical Activity History Timeline.
// 1:1 Layout Match with WIREFRAMES/nivedan_detail.html
// Clean Language Toggle (EN / MR) Support
// ============================================================

import { useState } from 'react';
import useLangStore from '../../store/langStore.js';
import api from '../../services/api.js';

const NivedanDetailModal = ({ isOpen, onClose, entry, onUpdateSuccess }) => {
  const { lang } = useLangStore();
  const isMr = lang === 'MR';

  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [targetStatus, setTargetStatus] = useState('');
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
        note: resolutionNotes || `Status changed to ${newStatus}`,
      });
      setShowResolveInput(false);
      onUpdateSuccess();
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || (isMr ? 'स्थिती बदलताना त्रुटी आली.' : 'Error updating status.'));
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() && !targetStatus) return;

    setUpdating(true);
    try {
      if (targetStatus) {
        await api.patch(`/nivedans/${entry.id}/status`, {
          status: targetStatus,
          note: newNote || `Status updated to ${targetStatus}`,
        });
      } else {
        await api.post(`/nivedans/${entry.id}/timeline`, {
          note: newNote,
          is_internal: true,
        });
      }

      setNewNote('');
      setTargetStatus('');
      onUpdateSuccess();
    } catch (err) {
      alert(err?.response?.data?.message || (isMr ? 'टीप जोडताना त्रुटी आली.' : 'Error adding note.'));
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge-pill status-pending">{isMr ? '🟡 प्रलंबित' : '🟡 Pending'}</span>;
      case 'IN_PROGRESS':
        return <span className="badge-pill status-progress">{isMr ? '🔵 प्रगतीपथावर' : '🔵 In Progress'}</span>;
      case 'FORWARDED':
        return <span className="badge-pill status-forwarded">{isMr ? '🟠 पाठवलेले' : '🟠 Forwarded'}</span>;
      case 'ESCALATED':
        return <span className="badge-pill status-escalated">{isMr ? '⚠️ कालावधी उलटलेले' : '⚠️ Escalated'}</span>;
      case 'RESOLVED':
        return <span className="badge-pill status-resolved">{isMr ? '🟢 मार्गी लागलेले' : '🟢 Resolved'}</span>;
      default:
        return <span className="badge-pill">{status}</span>;
    }
  };

  const formattedDate = entry.created_at
    ? new Date(entry.created_at).toLocaleString(isMr ? 'mr-IN' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <div className="nivedan-modal-overlay" onClick={onClose}>
      <div className="nivedan-modal-card wide" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="breadcrumb-bar" style={{ margin: 0 }}>
            <span>{isMr ? 'डॅशबोर्ड' : 'Dashboard'}</span>
            <span>/</span>
            <span>{isMr ? 'निवेदने' : 'Nivedans'}</span>
            <span>/</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{entry.tracking_id}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Detail Header Card (Matching nivedan_detail.html) */}
          <div className="detail-header-card">
            <div className="dh-top-row">
              <div>
                <div className="dh-id-title">{entry.tracking_id}</div>
                <div className="dh-sub-title">{entry.subject}</div>
              </div>
              <div className="dh-action-buttons">
                {getStatusBadge(entry.status)}
                <button
                  className="btn btn-outline"
                  onClick={() => alert(isMr ? 'निवेदन संपादित करा...' : 'Edit Petition...')}
                >
                  ✏️ {isMr ? 'संपादित करा' : 'Edit'}
                </button>
                <button className="btn btn-outline" onClick={() => window.print()}>
                  🖨️ {isMr ? 'पावती प्रिंट' : 'Print Receipt'}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => alert(isMr ? 'अधिकारी नियुक्त करा...' : 'Assign User...')}
                >
                  👤+ {isMr ? 'नियुक्त करा' : 'Assign'}
                </button>
                <button
                  className="btn btn-primary"
                  style={{ background: 'var(--success, #16A34A)' }}
                  disabled={updating || entry.status === 'RESOLVED'}
                  onClick={() => handleStatusChange('RESOLVED')}
                >
                  ✓ {isMr ? 'मार्गी लागले' : 'Mark Resolved'}
                </button>
                <button
                  className="btn btn-outline"
                  style={{ color: 'var(--error, #DC2626)', borderColor: 'var(--error, #DC2626)' }}
                  disabled={updating || entry.status === 'REJECTED'}
                  onClick={() => handleStatusChange('REJECTED')}
                >
                  ✕ {isMr ? 'नाकारा' : 'Reject'}
                </button>
              </div>
            </div>

            {/* Dh Meta Grid */}
            <div className="dh-meta-grid">
              <div className="meta-item">
                <span className="meta-label">{isMr ? 'नागरिक नाव' : 'Citizen Name'}</span>
                <span className="meta-value">👤 {entry.citizen_name}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">{isMr ? 'मोबाईल' : 'Mobile'}</span>
                <span className="meta-value" style={{ fontFamily: 'JetBrains Mono' }}>
                  📱 {entry.citizen_mobile}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">{isMr ? 'वर्गवारी' : 'Category'}</span>
                <span className="meta-value">
                  {isMr ? entry.category?.name_mr : entry.category?.name_en || entry.category?.name_mr || '—'}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">{isMr ? 'प्राधान्य' : 'Priority'}</span>
                <span
                  className="meta-value"
                  style={{ color: entry.priority === 'HIGH' || entry.priority === 'URGENT' ? 'var(--error)' : 'var(--text-1)' }}
                >
                  {entry.priority === 'HIGH' || entry.priority === 'URGENT'
                    ? isMr
                      ? '🔴 अतिमहत्त्वाचे (High)'
                      : '🔴 High'
                    : entry.priority === 'MEDIUM'
                    ? isMr
                      ? '🟡 मध्यम (Medium)'
                      : '🟡 Medium'
                    : isMr
                    ? '🔵 सामान्य (Low)'
                    : '🔵 Low'}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">{isMr ? 'वॉर्ड / गाव' : 'Ward / Village'}</span>
                <span className="meta-value">{entry.citizen_address_line || entry.citizen_city || '—'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">{isMr ? 'दाखल वेळ' : 'Created Date'}</span>
                <span className="meta-value" style={{ fontSize: '12px' }}>{formattedDate}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">{isMr ? 'नियुक्त अधिकारी' : 'Assigned To'}</span>
                <span className="meta-value" style={{ color: entry.assignedToUser ? 'var(--text-1)' : 'var(--text-4)' }}>
                  {entry.assignedToUser?.full_name || (isMr ? '— अद्याप अनियुक्त —' : '— Unassigned —')}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">{isMr ? 'नोंदवणारे अधिकारी' : 'Created By'}</span>
                <span className="meta-value">{entry.createdByUser?.full_name || 'Rajesh Patil (PA)'}</span>
              </div>
            </div>
          </div>

          {/* Resolution Notes Box if resolving */}
          {showResolveInput && (
            <div
              style={{
                background: 'var(--success-bg, #F0FDF4)',
                border: '1px solid var(--success-border, #BBF7D0)',
                padding: '14px',
                borderRadius: '4px',
                marginBottom: '16px',
              }}
            >
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--success)', display: 'block', marginBottom: '6px' }}>
                {isMr ? 'मार्गी लागल्याचा सविस्तर शेरा (Resolution Notes)' : 'Resolution Details & Notes'}
              </label>
              <textarea
                className="nivedan-form-input"
                style={{ height: '60px', marginBottom: '8px' }}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder={isMr ? 'उदा. संबंधित विभागाने काम पूर्ण केले असून नागरिकाला कळवले आहे...' : 'Enter resolution details...'}
              />
              <button
                className="btn btn-primary"
                style={{ height: '32px', fontSize: '12px', background: 'var(--success)' }}
                onClick={() => handleStatusChange('RESOLVED')}
              >
                {isMr ? 'पूर्ण झाले म्हणून नोंदवा' : 'Confirm Resolution'}
              </button>
            </div>
          )}

          {/* 2-Column Content Grid */}
          <div className="detail-content-grid">
            {/* Left Column: Description & Attachments & WhatsApp Logs */}
            <div>
              {/* Description Card */}
              <div className="detail-card">
                <div className="detail-card-header">
                  📄 {isMr ? 'सविस्तर वर्णन (Description)' : 'Description'}
                </div>
                <div className="detail-card-body">
                  <div className="description-text">
                    {entry.description || (isMr ? 'नागरिकाने मांडलेली तक्रार/निवेदन सविस्तर नोंदवलेले आहे.' : 'Detailed grievance petition filed by citizen.')}
                  </div>

                  {/* Attachments List */}
                  <div className="attach-list">
                    <div className="attach-item">
                      <span>📄</span>
                      <span className="name">nivedan_application_document.pdf</span>
                      <span className="size">1.2 MB</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '12px' }}>↓</span>
                    </div>
                    {entry.attachment_urls && (
                      <div className="attach-item">
                        <span>🖼️</span>
                        <span className="name">{entry.attachment_urls}</span>
                        <span className="size">Attachment</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '12px' }}>↓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* WhatsApp Log Card */}
              <div className="detail-card">
                <div className="detail-card-header">
                  💬 {isMr ? 'व्हॉट्सअॅप सूचना इतिहास (WhatsApp Notifications)' : 'WhatsApp Notifications'}
                </div>
                <div className="detail-card-body">
                  <div className="wa-item">
                    <span>📤</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: 'var(--text-1)' }}>
                        {isMr ? 'पोहोच पावती संदेश (Acknowledgment)' : 'Acknowledgment SMS'}
                      </strong>
                      <br />
                      <span style={{ color: 'var(--text-3)' }}>
                        {isMr ? `नागरिक ${entry.citizen_mobile} ला पाठवले` : `Sent to ${entry.citizen_mobile}`}
                      </span>
                    </div>
                    <span className="wa-status-badge" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                      {isMr ? 'पावलेला' : 'Delivered'}
                    </span>
                    <span style={{ color: 'var(--text-4)', fontSize: '11px' }}>{formattedDate}</span>
                  </div>

                  <div className="wa-item">
                    <span>📤</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: 'var(--text-1)' }}>
                        {isMr ? 'स्थिती अपडेट संदेश (Status Update)' : 'Status Update Notice'}
                      </strong>
                      <br />
                      <span style={{ color: 'var(--text-3)' }}>
                        {isMr ? 'अद्याप न पाठवलेला' : 'Pending notification dispatch'}
                      </span>
                    </div>
                    <span className="wa-status-badge" style={{ background: 'var(--bg-page)', color: 'var(--text-4)' }}>
                      {isMr ? 'प्रलंबित' : 'Pending'}
                    </span>
                    <span style={{ color: 'var(--text-4)', fontSize: '11px' }}>—</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Activity Timeline & Add Note */}
            <div className="detail-card">
              <div className="detail-card-header">
                📋 {isMr ? 'क्रिया टाइमलाइन (Activity Timeline)' : 'Activity Timeline'}
              </div>
              <div className="detail-card-body">
                <div className="timeline">
                  {entry.timelines && entry.timelines.length > 0 ? (
                    entry.timelines.map((tl) => (
                      <div className="tl-item" key={tl.id}>
                        <div className="tl-dot">📝</div>
                        <div className="tl-content">
                          <div className="tl-title">{tl.note}</div>
                          <div className="tl-desc">
                            {isMr ? 'द्वारा:' : 'By:'} <strong>{tl.createdByUser?.full_name || 'Rajesh Patil (PA)'}</strong>
                          </div>
                          <div className="tl-time">
                            {new Date(tl.created_at).toLocaleString(isMr ? 'mr-IN' : 'en-US')}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="tl-item">
                        <div className="tl-dot" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>📝</div>
                        <div className="tl-content">
                          <div className="tl-title">{isMr ? 'निवेदन नोंदवले (Nivedan Created)' : 'Nivedan Registered'}</div>
                          <div className="tl-desc">
                            {isMr
                              ? `द्वारे नोंदणीकृत: Rajesh Patil (PA). वर्गवारी: ${entry.category?.name_mr || 'सामान्य'}`
                              : `Registered by Rajesh Patil (PA). Category: ${entry.category?.name_en || 'General'}`}
                          </div>
                          <div className="tl-time">{formattedDate}</div>
                        </div>
                      </div>

                      <div className="tl-item">
                        <div className="tl-dot" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>💬</div>
                        <div className="tl-content">
                          <div className="tl-title">{isMr ? 'व्हॉट्सअॅप पाठवले' : 'WhatsApp Sent'}</div>
                          <div className="tl-desc">
                            {isMr
                              ? `पोहोच संदेश पाठवला. ट्रॅकिंग ID: ${entry.tracking_id}`
                              : `Acknowledgment sent. Tracking ID: ${entry.tracking_id}`}
                          </div>
                          <div className="tl-time">{formattedDate}</div>
                        </div>
                      </div>

                      <div className="tl-item">
                        <div className="tl-dot" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>🔄</div>
                        <div className="tl-content">
                          <div className="tl-title">{isMr ? 'ऑटो-रूट सुचवलेले' : 'Auto-Route Suggested'}</div>
                          <div className="tl-desc">
                            {isMr
                              ? `प्रणालीद्वारे सुचवलेला विभाग: ${entry.forwardedDepartment?.name_mr || 'जलसंपदा विभाग'}`
                              : `Suggested Department: ${entry.forwardedDepartment?.name_en || 'Water Supply Dept'}`}
                          </div>
                          <div className="tl-time">{formattedDate}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Add Internal Note & Status Change Form */}
                <form onSubmit={handleAddNote} className="add-note-box">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={isMr ? 'टीप किंवा अपडेट जोडा... / Add a note or update...' : 'Add a note or update...'}
                  />
                  <div className="add-note-actions">
                    <select
                      style={{
                        height: '32px',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        padding: '0 8px',
                        fontSize: '12px',
                        background: 'var(--bg-card)',
                        color: 'var(--text-1)',
                        fontFamily: 'inherit',
                      }}
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value)}
                    >
                      <option value="">{isMr ? 'स्थिती बदला...' : 'Change Status To...'}</option>
                      <option value="IN_PROGRESS">{isMr ? 'प्रगतीपथावर (In Progress)' : 'In Progress'}</option>
                      <option value="FORWARDED">{isMr ? 'पाठवलेले (Forwarded)' : 'Forwarded'}</option>
                      <option value="ESCALATED">{isMr ? 'कालावधी उलटलेले (Escalated)' : 'Escalated'}</option>
                      <option value="RESOLVED">{isMr ? 'मार्गी लागले (Resolved)' : 'Resolved'}</option>
                      <option value="REJECTED">{isMr ? 'नाकारले (Rejected)' : 'Rejected'}</option>
                    </select>
                    <button className="btn btn-primary" type="submit" style={{ height: '32px', fontSize: '12px' }} disabled={updating}>
                      + {isMr ? 'टीप जोडा' : 'Add Note'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={() => window.print()}>
            🖨️ {isMr ? 'पावती प्रिंट करा' : 'Print Receipt'}
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            {isMr ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NivedanDetailModal;
