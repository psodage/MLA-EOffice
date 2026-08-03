// src/pages/whatsapp/WhatsAppLogsPage.jsx
// ============================================================
// WhatsApp Logs & Integration Dashboard — Module 12
// Live Meta delivery status logs (Sent, Delivered, Read, Failed), retry triggers & test dispatcher
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import './WhatsAppLogsPage.css';

const STATUS_PILLS = {
  DELIVERED: { mr: '🟢 मिळालेला (Delivered)', bg: 'rgba(34, 197, 94, 0.18)', color: '#4ade80' },
  READ: { mr: '🔵 वाचलेला (Read)', bg: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8' },
  SENT: { mr: '🟡 पाठवलेला (Sent)', bg: 'rgba(245, 158, 11, 0.18)', color: '#fbbf24' },
  QUEUED: { mr: '⏳ रांगेत (Queued)', bg: 'rgba(148, 163, 184, 0.18)', color: '#94a3b8' },
  FAILED: { mr: '🔴 अयशस्वी (Failed)', bg: 'rgba(239, 68, 68, 0.18)', color: '#f87171' },
};

const WhatsAppLogsPage = () => {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    totalSent: 0,
    deliveredCount: 0,
    readCount: 0,
    failedCount: 0,
  });
  const [meta, setMeta] = useState({ page: 1, limit: 20, totalItems: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    delivery_status: 'ALL',
    message_type: 'ALL',
    page: 1,
  });

  // Test Modal State
  const [showTestModal, setShowTestModal] = useState(false);
  const [testForm, setTestForm] = useState({
    recipient_mobile: '9822011223',
    template_name: 'nivedan_ack',
    custom_text: 'नमस्कार, आपली तक्रार यशस्वीरित्या नोंदवली गेली आहे. — आमदार कार्यालय',
  });
  const [sendingTest, setSendingTest] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 20,
      };
      if (filters.search) params.search = filters.search;
      if (filters.delivery_status !== 'ALL') params.delivery_status = filters.delivery_status;
      if (filters.message_type !== 'ALL') params.message_type = filters.message_type;

      const { data } = await api.get('/whatsapp/logs', { params });
      setItems(data.data || []);
      setSummary(data.summary || { totalSent: 0, deliveredCount: 0, readCount: 0, failedCount: 0 });
      setMeta(data.meta || { page: 1, limit: 20, totalItems: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch WhatsApp logs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSendTestMessage = async (e) => {
    e.preventDefault();
    setSendingTest(true);
    try {
      await api.post('/whatsapp/send', testForm);
      alert('व्हॉट्सॲप संदेश यशस्वीरित्या पाठवला गेला!');
      setShowTestModal(false);
      fetchLogs();
    } catch (err) {
      alert(err?.response?.data?.message || 'संदेश पाठवताना त्रुटी आली.');
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="inward-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="inward-page-header">
        <div className="title-group">
          <h1 className="page-title-mr">💬 व्हॉट्सॲप संदेश लॉग (WhatsApp Integration & Logs)</h1>
          <p className="page-subtitle">
            Meta Cloud API द्वारे पाठवलेले संदेश, डिलिव्हरी स्टेटस ट्रॅकिंग (Delivered/Read) व पुन्हा प्रयत्न लॉजिक
          </p>
        </div>

        <button className="create-inward-btn" onClick={() => setShowTestModal(true)}>
          <span>💬</span>
          <span>टेस्ट व्हॉट्सॲप संदेश पाठवा (Send Test)</span>
        </button>
      </div>

      {/* ── Summary Stat Cards ─────────────────────────────── */}
      <div className="wa-summary-grid">
        <div className="wa-stat-card">
          <div className="stat-icon-box">📤</div>
          <div className="stat-info">
            <span className="stat-val">{summary.totalSent}</span>
            <span className="stat-lbl">एकूण पाठवलेले संदेश (Total Dispatched)</span>
          </div>
        </div>

        <div className="wa-stat-card delivered-card">
          <div className="stat-icon-box">🟢</div>
          <div className="stat-info">
            <span className="stat-val" style={{ color: '#4ade80' }}>{summary.deliveredCount}</span>
            <span className="stat-lbl">मिळालेले संदेश (Delivered)</span>
          </div>
        </div>

        <div className="wa-stat-card read-card">
          <div className="stat-icon-box">🔵</div>
          <div className="stat-info">
            <span className="stat-val" style={{ color: '#38bdf8' }}>{summary.readCount}</span>
            <span className="stat-lbl">वाचलेले संदेश (Read)</span>
          </div>
        </div>

        <div className="wa-stat-card failed-card">
          <div className="stat-icon-box">🔴</div>
          <div className="stat-info">
            <span className="stat-val" style={{ color: '#f87171' }}>{summary.failedCount}</span>
            <span className="stat-lbl">अयशस्वी / री-ट्राय (Failed / Retrying)</span>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="inward-filter-bar wa-filter-bar">
        <div className="filter-group search-group">
          <label>शोध (Search)</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="मोबाईल नंबर किंवा संदेशाचा मजकूर शोधा..."
          />
        </div>

        <div className="filter-group">
          <label>डिलिव्हरी स्टेटस (Status)</label>
          <select name="delivery_status" value={filters.delivery_status} onChange={handleFilterChange}>
            <option value="ALL">सर्व स्टेटस (All Status)</option>
            <option value="DELIVERED">🟢 DELIVERED (मिळालेला)</option>
            <option value="READ">🔵 READ (वाचलेला)</option>
            <option value="SENT">🟡 SENT (पाठवलेला)</option>
            <option value="FAILED">🔴 FAILED (अयशस्वी)</option>
          </select>
        </div>

        <div className="filter-group">
          <label>प्रकार (Type)</label>
          <select name="message_type" value={filters.message_type} onChange={handleFilterChange}>
            <option value="ALL">सर्व प्रकार (All Types)</option>
            <option value="NIVEDAN_ACK">तक्रार पोहोचपावती (Nivedan Ack)</option>
            <option value="NIVEDAN_UPDATE">तक्रार स्थिती अपडेट (Status Update)</option>
            <option value="BIRTHDAY">वाढदिवस शुभेच्छा (Birthday)</option>
            <option value="FESTIVAL">सण शुभेच्छा (Festival)</option>
          </select>
        </div>

        <div className="filter-actions">
          <button className="reset-filter-btn" onClick={() => setFilters({ search: '', delivery_status: 'ALL', message_type: 'ALL', page: 1 })}>
            🔄 रिसेट
          </button>
        </div>
      </div>

      {/* ── Data Table ─────────────────────────────────────── */}
      <div className="inward-table-card">
        {loading ? (
          <div className="table-loading-box">
            <div className="mini-spinner"></div>
            <p>व्हॉट्सॲप लॉग्स लोड होत आहेत...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="table-empty-box">
            <div className="empty-icon">💬</div>
            <h3>कोणताही व्हॉट्सॲप संदेश लॉग सापडला नाही</h3>
            <p>कृपया फिल्टर बदलून पहा.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="inward-table">
              <thead>
                <tr>
                  <th>पाठवल्याची तारीख व वेळ (Dispatched At)</th>
                  <th>नागरिक मोबाईल (Recipient)</th>
                  <th>संदेश प्रकार (Message Type)</th>
                  <th>मजकूर (Message Content)</th>
                  <th>डिलिव्हरी स्टेटस (Status)</th>
                  <th style={{ textAlign: 'right' }}>Meta ID</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const statusCfg = STATUS_PILLS[item.delivery_status] || STATUS_PILLS.SENT;
                  const dateStr = item.created_at
                    ? new Date(item.created_at).toLocaleString('mr-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '—';

                  return (
                    <tr key={item.id}>
                      <td className="col-inward-no">⏱️ {dateStr}</td>
                      <td className="col-sender">📱 {item.recipient_mobile}</td>
                      <td>
                        <span className="wa-type-pill">{item.message_type}</span>
                      </td>
                      <td className="col-subject">
                        <div style={{ fontSize: '0.82rem', color: '#e2e8f0' }}>{item.message_body || item.template_name}</div>
                        {item.error_message && (
                          <div style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '0.15rem' }}>⚠️ {item.error_message}</div>
                        )}
                      </td>
                      <td>
                        <span className="wa-status-pill" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
                          {statusCfg.mr}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                        {item.meta_message_id ? `${item.meta_message_id.slice(0, 15)}...` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && meta.totalPages > 1 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              एकूण {meta.totalItems} पैकी पान {meta.page}
            </span>

            <div className="pagination-controls">
              <button
                className="page-btn"
                disabled={meta.page <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
              >
                ← मागील
              </button>
              <span className="current-page-num">{meta.page}</span>
              <button
                className="page-btn"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
              >
                पुढील →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Test Message Modal ─────────────────────────────── */}
      {showTestModal && (
        <div className="inward-modal-overlay" onClick={() => setShowTestModal(false)}>
          <div className="inward-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="inward-modal-header">
              <h3>💬 टेस्ट व्हॉट्सॲप मेसेज (Test Message Sender)</h3>
              <button className="modal-close-btn" onClick={() => setShowTestModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSendTestMessage} className="inward-form">
              <div className="form-grid">
                <div className="form-group col-span-2">
                  <label>नागरिकाचा १० अंकी मोबाईल नंबर (Mobile) <span className="req">*</span></label>
                  <input
                    type="tel"
                    value={testForm.recipient_mobile}
                    onChange={(e) => setTestForm({ ...testForm, recipient_mobile: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group col-span-2">
                  <label>व्हॉट्सॲप टेम्पलेट (Template)</label>
                  <select
                    value={testForm.template_name}
                    onChange={(e) => setTestForm({ ...testForm, template_name: e.target.value })}
                  >
                    <option value="nivedan_ack">तक्रार पोहोचपावती (nivedan_ack)</option>
                    <option value="nivedan_update">तक्रार स्थिती बदल (nivedan_update)</option>
                    <option value="birthday_wish">वाढदिवस शुभेच्छा (birthday_wish)</option>
                    <option value="festival_greeting">सण शुभेच्छा (festival_greeting)</option>
                  </select>
                </div>

                <div className="form-group col-span-2">
                  <label>संदेश मजकूर (Message Content)</label>
                  <textarea
                    value={testForm.custom_text}
                    onChange={(e) => setTestForm({ ...testForm, custom_text: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowTestModal(false)}>
                  रद्द करा
                </button>
                <button type="submit" className="btn-primary" disabled={sendingTest}>
                  {sendingTest ? 'पाठवत आहे...' : '💬 मेसेज पाठवा (Send)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppLogsPage;
