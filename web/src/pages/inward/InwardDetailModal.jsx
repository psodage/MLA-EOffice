// src/pages/inward/InwardDetailModal.jsx
// ============================================================
// Modal for Viewing Inward Entry Details, Attachments,
// and Performing Status Updates or Assigning to PA
// ============================================================

import { useState } from 'react';
import { X, Calendar, User, FileText, Tag, Paperclip, ExternalLink, Users, Zap, Check } from 'lucide-react';
import InwardStatusBadge from '../../components/inward/InwardStatusBadge.jsx';
import PriorityBadge from '../../components/inward/PriorityBadge.jsx';
import api from '../../services/api.js';

const InwardDetailModal = ({ isOpen, onClose, entry, onUpdateSuccess }) => {
  const [updating, setUpdating] = useState(false);
  const [assignedUser, setAssignedUser] = useState(entry?.assigned_to_user_id || '');

  if (!isOpen || !entry) return null;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await api.patch(`/inward/${entry.id}`, { status: newStatus });
      onUpdateSuccess();
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || 'स्टेटस अपडेट करण्यात त्रुटी आली.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignChange = async (e) => {
    const val = e.target.value;
    setAssignedUser(val);
    setUpdating(true);
    try {
      await api.patch(`/inward/${entry.id}`, {
        assigned_to_user_id: val ? parseInt(val, 10) : null,
        status: val ? 'ASSIGNED' : 'PENDING',
      });
      onUpdateSuccess();
    } catch (err) {
      alert(err?.response?.data?.message || 'नियुक्ती अपडेट करण्यात त्रुटी आली.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="inward-modal-overlay" onClick={onClose}>
      <div className="inward-modal-container detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inward-modal-header">
          <div className="modal-title-group">
            <span className="detail-ref-badge">{entry.inward_number}</span>
            <h3>आवक पत्र तपशील (Inward Details)</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="detail-modal-body">
          {/* Header Info Cards */}
          <div className="detail-summary-bar">
            <div className="summary-item">
              <span className="item-label">प्राप्त दिनांक (Received Date)</span>
              <span className="item-value" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> {entry.date_received}
              </span>
            </div>
            <div className="summary-item">
              <span className="item-label">प्राधान्यक्रम (Priority)</span>
              <PriorityBadge priority={entry.priority} />
            </div>
            <div className="summary-item">
              <span className="item-label">सध्याची स्थिती (Current Status)</span>
              <InwardStatusBadge status={entry.status} />
            </div>
          </div>

          {/* Main Info Blocks */}
          <div className="detail-section">
            <h4 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} /> पाठवणाऱ्याची माहिती (Sender Details)
            </h4>
            <div className="info-grid">
              <div><strong>नाव (Sender):</strong> {entry.sender_name}</div>
              <div><strong>पदनाम (Designation):</strong> {entry.sender_designation || '—'}</div>
              <div><strong>विभाग (Department):</strong> {entry.department?.name_mr || '—'}</div>
            </div>
          </div>

          <div className="detail-section">
            <h4 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} /> विषय व तपशील (Subject & Description)
            </h4>
            <div className="subject-box">
              <strong>विषय:</strong> {entry.subject}
            </div>
            {entry.description && (
              <div className="description-box">
                <strong>तपशील:</strong> {entry.description}
              </div>
            )}
          </div>

          {/* Tags */}
          {Array.isArray(entry.tags) && entry.tags.length > 0 && (
            <div className="detail-section">
              <h4 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={16} /> टॅग्स (Tags)
              </h4>
              <div className="tags-container">
                {entry.tags.map((t, idx) => (
                  <span key={idx} className="tag-pill">#{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          <div className="detail-section">
            <h4 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Paperclip size={16} /> जोडपत्रे / फाईल्स (Attachments)
            </h4>
            {Array.isArray(entry.attachment_urls) && entry.attachment_urls.length > 0 ? (
              <div className="attachments-list">
                {entry.attachment_urls.map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="attachment-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} /> जोडपत्र फाईल {idx + 1} (PDF / Document) <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="no-attachments">कोणतीही जोडपत्र फाईल अपलोड केलेली नाही.</p>
            )}
          </div>

          {/* Assign Control */}
          <div className="detail-section assign-control-box">
            <h4 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} /> जबाबदारी नियुक्ती (Assign Staff / PA)
            </h4>
            <div className="assign-row">
              <select value={assignedUser} onChange={handleAssignChange} disabled={updating}>
                <option value="">-- अनियुक्त (Unassigned) --</option>
                <option value="2">सुरेश पाटील (PA / Senior Office Manager)</option>
                <option value="4">राहुल जाधव (Field Auditor)</option>
              </select>
              <span className="assign-status-text">
                {entry.assignedTo ? `नियुक्त: ${entry.assignedTo.full_name}` : 'सध्या कोणाकडेही नियुक्त नाही'}
              </span>
            </div>
          </div>

          {/* Status Quick Transitions */}
          <div className="detail-section status-actions-box">
            <h4 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} /> कार्यस्थिती अपडेट करा (Quick Status Update)
            </h4>
            <div className="status-buttons-group">
              <button
                className="status-btn btn-assign"
                onClick={() => handleStatusChange('ASSIGNED')}
                disabled={updating || entry.status === 'ASSIGNED'}
              >
                नियुक्त (ASSIGNED)
              </button>

              <button
                className="status-btn btn-progress"
                onClick={() => handleStatusChange('IN_PROGRESS')}
                disabled={updating || entry.status === 'IN_PROGRESS'}
              >
                प्रगतीपथावर (IN_PROGRESS)
              </button>

              <button
                className="status-btn btn-complete"
                onClick={() => handleStatusChange('COMPLETED')}
                disabled={updating || entry.status === 'COMPLETED'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <Check size={14} /> पूर्ण (COMPLETED)
              </button>

              <button
                className="status-btn btn-cancel"
                onClick={() => handleStatusChange('CANCELLED')}
                disabled={updating || entry.status === 'CANCELLED'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <X size={14} /> रद्द (CANCEL)
              </button>
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

export default InwardDetailModal;
