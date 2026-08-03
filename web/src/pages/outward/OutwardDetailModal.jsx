// src/pages/outward/OutwardDetailModal.jsx
// ============================================================
// Modal for Viewing Official Government Outward Letterhead,
// Approving the Draft, and Printing the Finalized Letter.
// ============================================================

import { useState } from 'react';
import api from '../../services/api.js';
import './OutwardLetterPrint.css';

const OutwardDetailModal = ({ isOpen, onClose, entry, onUpdateSuccess }) => {
  const [approving, setApproving] = useState(false);

  if (!isOpen || !entry) return null;

  const handleApprove = async () => {
    setApproving(true);
    try {
      await api.patch(`/outward/${entry.id}/approve`);
      onUpdateSuccess();
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || 'मंजुरी देण्यात त्रुटी आली.');
    } finally {
      setApproving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="inward-modal-overlay" onClick={onClose}>
      <div className="inward-modal-container detail-modal outward-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inward-modal-header no-print">
          <div className="modal-title-group">
            <span className="detail-ref-badge">{entry.outward_number}</span>
            <h3>जावक पत्र पाहणे व मुद्रण (Outward Letter Preview)</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="outward-letterhead-container printable-letter-area">
          {/* Official Government Letterhead Header */}
          <div className="letterhead-header">
            <div className="emblem-box">
              <span className="state-emblem">🏛️</span>
            </div>
            <div className="header-text-block">
              <h2 className="mla-name-title">महाराष्ट्र विधानसभा • आमदार कार्यालय</h2>
              <h3 className="mla-constituency">राहाता विधानसभा मतदारसंघ (अहमदनगर)</h3>
              <p className="office-address-line">कार्यालय: मध्यवर्ती प्रशासकीय इमारत, राहाता, जि. अहमदनगर • मो. ९८२२० XXXXX</p>
            </div>
          </div>

          <div className="letterhead-divider"></div>

          {/* Letter Meta Row */}
          <div className="letter-meta-row">
            <div className="outward-no-box">
              <strong>जावक क्रमांक:</strong> {entry.outward_number}
            </div>
            <div className="outward-date-box">
              <strong>दिनांक:</strong> {entry.date_sent}
            </div>
          </div>

          {/* Linked Inward Reference if present */}
          {entry.referenceInward && (
            <div className="letter-reference-box">
              <strong>संदर्भ:</strong> आवक नोंदवही पत्र क्र. {entry.referenceInward.inward_number} (विषय: {entry.referenceInward.subject})
            </div>
          )}

          {/* Letter Body Content */}
          <div className="letter-body-content">
            <pre className="letter-pre-text">{entry.body_text}</pre>
          </div>

          {/* Signature Block */}
          <div className="letter-signature-block">
            <div className="sign-stamp-area">
              {entry.approver ? (
                <div className="approval-stamp">
                  <span className="stamp-icon">✓ APPROVED</span>
                  <span className="stamp-by">मंजूर: {entry.approver.full_name}</span>
                </div>
              ) : (
                <div className="draft-watermark-tag">मसुदा (DRAFT - PENDING APPROVAL)</div>
              )}
            </div>
            <div className="sign-text-group">
              <p className="sign-valediction">आपला / आपली नम्र,</p>
              <div className="sign-space"></div>
              <p className="sign-name"><strong>(सदस्य, महाराष्ट्र विधानसभा)</strong></p>
              <p className="sign-sub">आमदार कार्यालय, राहाता</p>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="modal-actions no-print">
          <button className="btn-secondary" onClick={onClose}>
            बंद करा (Close)
          </button>

          {!entry.approved_by && (
            <button className="btn-approve" onClick={handleApprove} disabled={approving}>
              {approving ? 'मंजूर होत आहे...' : '✓ पत्र मंजूर करा (Approve Letter)'}
            </button>
          )}

          <button className="btn-primary" onClick={handlePrint}>
            🖨️ मुद्रित करा (Print Letter)
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutwardDetailModal;
