import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, BarChart2, Megaphone, FileText, ClipboardList, PartyPopper, Download, Send, CheckCheck, Check, X, Clock, AlertTriangle, Bot, Cake, Building2, HardHat, RefreshCw, ChevronRight } from 'lucide-react';
import api from '../../services/api.js';
import useLangStore from '../../store/langStore.js';
import LucideIcon from '../../components/common/LucideIcon.jsx';
import './WhatsAppLogsPage.css';

const TABS = [
  { id: 'OVERVIEW', labelEn: 'Overview', labelMr: 'सारांश' },
  { id: 'BROADCASTS', labelEn: 'Broadcasts', labelMr: 'प्रसारण', count: 4 },
  { id: 'TEMPLATES', labelEn: 'Templates', labelMr: 'नमुने', count: 11 },
  { id: 'DELIVERY_LOG', labelEn: 'Delivery Log', labelMr: 'वितरण लॉग' },
  { id: 'GREETINGS', labelEn: 'Greetings', labelMr: 'शुभेच्छा' },
];

const MOCK_RECENT_LOGS = [
  {
    id: 1,
    iconType: 'auto',
    recipientName: 'सुरेश जाधव',
    recipientMobile: '98765 43210',
    templateCode: 'NIV_ACK',
    templateDesc: 'Nivedan Acknowledgment · तक्रार पोहोचपावती',
    timeAgo: '2 min ago',
    status: 'READ',
  },
  {
    id: 2,
    iconType: 'auto',
    recipientName: 'अनिता कांबळे',
    recipientMobile: '87654 32109',
    templateCode: 'NIV_STATUS',
    templateDesc: 'Status Update · स्थिती अद्ययावत',
    timeAgo: '8 min ago',
    status: 'DELIVERED',
  },
  {
    id: 3,
    iconType: 'broadcast',
    recipientName: 'Broadcast: Haveli Taluka Workers',
    recipientMobile: '156 recipients',
    templateCode: 'EVENT_INVITE',
    templateDesc: 'ग्रामसभा कार्यक्रम, वडगाव · 05/08/2026',
    timeAgo: '25 min ago',
    status: 'SENT',
  },
  {
    id: 4,
    iconType: 'bot',
    recipientName: 'प्रकाश मोरे',
    recipientMobile: '76543 21098',
    templateCode: 'BOT_STATUS',
    templateDesc: 'Tracking ID: NIV-2026-01247 · Auto-reply',
    timeAgo: '32 min ago',
    status: 'READ',
  },
  {
    id: 5,
    iconType: 'failed',
    recipientName: 'रमेश पवार',
    recipientMobile: '65432 10987',
    templateCode: 'NIV_RESOLVED',
    templateDesc: 'Nivedan Resolved · Number not on WhatsApp',
    timeAgo: '45 min ago',
    status: 'FAILED',
  },
  {
    id: 6,
    iconType: 'greeting',
    recipientName: 'मंगेश जाधव',
    recipientMobile: '43210 98765',
    templateCode: 'GREETING',
    templateDesc: 'Birthday Greeting · वाढदिवस शुभेच्छा',
    timeAgo: '1 hr ago',
    status: 'READ',
  },
  {
    id: 7,
    iconType: 'auto',
    recipientName: 'विनोद शिंदे',
    recipientMobile: '54321 09876',
    templateCode: 'NIV_RESOLVED',
    templateDesc: 'Nivedan Resolved · तक्रार निकाली',
    timeAgo: '1 hr ago',
    status: 'DELIVERED',
  },
  {
    id: 8,
    iconType: 'auto',
    recipientName: 'नवीन कार्यकर्ता',
    recipientMobile: '32109 87654',
    templateCode: 'KK_WELCOME',
    templateDesc: 'New Karyakarta Welcome · स्वागत',
    timeAgo: '2 hr ago',
    status: 'SENT',
  },
  {
    id: 9,
    iconType: 'broadcast',
    recipientName: 'Broadcast: Wadgaon Area Workers',
    recipientMobile: '24 recipients',
    templateCode: 'WORK_UPDATE',
    templateDesc: 'Road widening 60% complete · विकास काम अद्ययावत',
    timeAgo: '3 hr ago',
    status: 'DELIVERED',
  },
  {
    id: 10,
    iconType: 'pending',
    recipientName: 'दीपक थोरात',
    recipientMobile: '21098 76543',
    templateCode: 'NIV_STATUS',
    templateDesc: 'Status Update · In queue',
    timeAgo: '3 hr ago',
    status: 'PENDING',
  },
];

const renderLogIcon = (type) => {
  switch (type) {
    case 'broadcast':
      return <Megaphone size={14} />;
    case 'bot':
      return <Bot size={14} />;
    case 'failed':
      return <X size={14} />;
    case 'greeting':
      return <Cake size={14} />;
    case 'pending':
      return <Clock size={14} />;
    case 'auto':
    default:
      return <MessageSquare size={14} />;
  }
};

const WhatsAppLogsPage = () => {
  const { lang } = useLangStore();
  const isMr = lang === 'MR';

  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Broadcast / Test Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    recipient_type: 'WORKERS',
    template_code: 'EVENT_INVITE',
    custom_message: '',
    target_group: 'Haveli Taluka Workers',
  });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/whatsapp/logs');
      setItems(data.data || []);
    } catch (err) {
      console.error('Failed to fetch WhatsApp logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setSendingBroadcast(true);
    try {
      await api.post('/whatsapp/send', {
        recipient_mobile: '9822011223',
        template_name: broadcastForm.template_code,
        custom_text: broadcastForm.custom_message || 'प्रसारण संदेश',
      });
      alert(isMr ? 'व्हॉट्सअॅप संदेश यशस्वीरित्या पाठवला!' : 'WhatsApp broadcast message dispatched successfully!');
      setShowBroadcastModal(false);
      fetchLogs();
    } catch (err) {
      alert(err?.response?.data?.message || (isMr ? 'संदेश पाठवताना त्रुटी आली.' : 'Failed to send broadcast.'));
    } finally {
      setSendingBroadcast(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'READ':
        return (
          <span className="msg-status status-read" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCheck size={13} style={{ color: '#38bdf8' }} /> {isMr ? 'वाचलेला' : 'Read'}
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="msg-status status-delivered" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCheck size={13} style={{ color: '#94a3b8' }} /> {isMr ? 'मिळालेला' : 'Delivered'}
          </span>
        );
      case 'SENT':
        return (
          <span className="msg-status status-sent" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Check size={13} style={{ color: '#94a3b8' }} /> {isMr ? 'पाठवलेला' : 'Sent'}
          </span>
        );
      case 'FAILED':
        return (
          <span className="msg-status status-failed" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <X size={13} /> {isMr ? 'अयशस्वी' : 'Failed'}
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="msg-status status-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> {isMr ? 'प्रलंबित' : 'Pending'}
          </span>
        );
    }
  };

  return (
    <div className="wa-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={22} style={{ color: '#25D366' }} /> WhatsApp Automation · <span className="mr">व्हॉट्सअॅप ऑटोमेशन</span>
          </h1>
          <p className="page-subtitle">
            {isMr
              ? 'ऑटोमेटेड संदेश प्रणाली — नागरिक अद्ययावत माहिती, प्रसारण व शुभेच्छा'
              : 'Automated messaging engine — citizen updates, broadcasts, and greetings'}
          </p>
        </div>

        <div className="page-actions">
          <button className="btn-o" onClick={() => alert(isMr ? 'वितरण अहवाल एक्सपोर्ट होत आहे...' : 'Exporting delivery log...')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> {isMr ? 'एक्सपोर्ट' : 'Export'}
          </button>
          <button className="btn-p" onClick={() => setShowBroadcastModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Megaphone size={14} /> {isMr ? 'नवीन प्रसारण' : 'New Broadcast'}
          </button>
        </div>
      </div>

      {/* ── 5 KPI Stats Cards Grid ──────────────────────────── */}
      <div className="wa-stats-grid">
        <div className="wa-stat-card">
          <div className="wa-stat-val" style={{ color: '#25D366' }}>1,247</div>
          <div className="wa-stat-label">{isMr ? 'आज पाठवले' : 'Sent Today'}</div>
          <div className="wa-stat-trend up">↑ 12% vs yesterday</div>
        </div>

        <div className="wa-stat-card">
          <div className="wa-stat-val" style={{ color: '#16A34A' }}>96.2%</div>
          <div className="wa-stat-label">{isMr ? 'वितरण दर' : 'Delivery Rate'}</div>
          <div className="wa-stat-trend up">↑ 0.8%</div>
        </div>

        <div className="wa-stat-card">
          <div className="wa-stat-val" style={{ color: '#DC2626' }}>47</div>
          <div className="wa-stat-label">{isMr ? 'अयशस्वी' : 'Failed'}</div>
          <div className="wa-stat-trend down">↑ 12 from yesterday</div>
        </div>

        <div className="wa-stat-card">
          <div className="wa-stat-val" style={{ color: '#D97706' }}>23</div>
          <div className="wa-stat-label">{isMr ? 'प्रतीक्षा रांग' : 'Pending Queue'}</div>
          <div className="wa-stat-trend">Processing...</div>
        </div>

        <div className="wa-stat-card">
          <div className="wa-stat-val" style={{ color: '#2563EB' }}>8,412</div>
          <div className="wa-stat-label">{isMr ? 'या महिन्यात' : 'This Month'}</div>
          <div className="wa-stat-trend up">↑ 18% vs last month</div>
        </div>
      </div>

      {/* ── Tabs Navigation ─────────────────────────────────── */}
      <div className="wa-tabs-bar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`wa-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {isMr ? tab.labelMr : tab.labelEn}
            {tab.count !== undefined && <span className="tab-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* ── Quick Action Cards ───────────────────────────────── */}
      <div className="wa-quick-actions">
        <div className="qa-card" onClick={() => setShowBroadcastModal(true)}>
          <div className="qa-icon" style={{ background: '#E8F8ED', color: '#25D366' }}><Megaphone size={18} /></div>
          <div className="qa-info">
            <div className="qa-title">{isMr ? 'नवीन प्रसारण' : 'New Broadcast'}</div>
            <div className="qa-desc">{isMr ? 'कार्यकर्ते / गटांना पाठवा' : 'Send to workers / groups'}</div>
          </div>
        </div>

        <div className="qa-card" onClick={() => alert(isMr ? 'वाढदिवस शुभेच्छा यादी...' : 'Birthday Greetings...')}>
          <div className="qa-icon" style={{ background: '#FFFBEB', color: '#D97706' }}><PartyPopper size={18} /></div>
          <div className="qa-info">
            <div className="qa-title">{isMr ? 'वाढदिवस शुभेच्छा' : 'Birthday Greetings'}</div>
            <div className="qa-desc">{isMr ? 'आज ३ वाढदिवस आहेत' : '3 birthdays today'}</div>
          </div>
        </div>

        <div className="qa-card" onClick={() => alert(isMr ? 'अयशस्वी संदेश पुन्हा पाठवले जात आहेत...' : 'Retrying failed messages...')}>
          <div className="qa-icon" style={{ background: '#FEF2F2', color: '#DC2626' }}><AlertTriangle size={18} /></div>
          <div className="qa-info">
            <div className="qa-title">{isMr ? 'अयशस्वी री-ट्राय' : 'Retry Failed'}</div>
            <div className="qa-desc">{isMr ? '४७ संदेश अयशस्वी' : '47 failed messages'}</div>
          </div>
        </div>

        <div className="qa-card" onClick={() => alert(isMr ? 'बॉट उत्तर कार्य नोंद...' : 'Bot activity log...')}>
          <div className="qa-icon" style={{ background: '#F5F3FF', color: '#7C3AED' }}><Bot size={18} /></div>
          <div className="qa-info">
            <div className="qa-title">{isMr ? 'बॉट कार्यप्रणाली' : 'Bot Activity'}</div>
            <div className="qa-desc">{isMr ? 'आज १२ चौकशी' : '12 queries today'}</div>
          </div>
        </div>
      </div>

      {/* ── Two Column Layout (Recent Activity + Right Panels) ── */}
      <div className="wa-layout">
        {/* Left Column: Recent Activity Log */}
        <div className="wa-panel">
          <div className="wa-panel-header">
            <span className="wa-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ClipboardList size={16} /> {isMr ? 'अलीकडील कार्य (Recent Activity)' : 'Recent Activity'}
            </span>
            <span className="wa-panel-action" onClick={() => fetchLogs()} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {isMr ? 'सर्व पहा' : 'View All'} <ChevronRight size={14} />
            </span>
          </div>

          <div className="msg-list">
            {(items.length > 0 ? items : MOCK_RECENT_LOGS).map((msg) => (
              <div key={msg.id} className="msg-row">
                <div className={`msg-icon ${msg.iconType || 'auto'}`}>{renderLogIcon(msg.iconType)}</div>
                <div className="msg-info">
                  <div className="msg-recipient">
                    {msg.recipientName || msg.recipient_mobile} ·{' '}
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--text-4)' }}>
                      {msg.recipientMobile || msg.recipient_mobile}
                    </span>
                  </div>
                  <div className="msg-template">
                    {msg.templateCode || msg.template_name} — {msg.templateDesc || msg.custom_text || 'Automated update'}
                  </div>
                </div>
                <div className="msg-meta">
                  <div className="msg-time">{msg.timeAgo || 'Just now'}</div>
                  {renderStatusBadge(msg.status || msg.delivery_status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Delivery Ring & Active Templates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Delivery Breakdown Ring Chart Panel */}
          <div className="wa-panel">
            <div className="wa-panel-header">
              <span className="wa-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BarChart2 size={16} /> {isMr ? 'वितरण विभाजन (Delivery Breakdown)' : 'Delivery Breakdown'}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-4)' }}>{isMr ? 'आज' : 'Today'}</span>
            </div>

            <div className="ring-container">
              <div className="ring">
                <div className="ring-inner">
                  <div className="ring-val">1,247</div>
                  <div className="ring-label">{isMr ? 'एकूण' : 'Total'}</div>
                </div>
              </div>
              <div className="ring-legend">
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#16A34A' }}></span>
                  {isMr ? 'वाचलेले — ५२४ (४२%)' : 'Read — 524 (42%)'}
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#25D366' }}></span>
                  {isMr ? 'मिळालेले — ४४९ (३६%)' : 'Delivered — 449 (36%)'}
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#2563EB' }}></span>
                  {isMr ? 'पाठवलेले — १६३ (१३%)' : 'Sent — 163 (13%)'}
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#DC2626' }}></span>
                  {isMr ? 'अयशस्वी — ४७ (४%)' : 'Failed — 47 (4%)'}
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#D97706' }}></span>
                  {isMr ? 'प्रलंबित — ६४ (५%)' : 'Pending — 64 (5%)'}
                </div>
              </div>
            </div>
          </div>

          {/* Active Templates Panel */}
          <div className="wa-panel">
            <div className="wa-panel-header">
              <span className="wa-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} /> {isMr ? 'सक्रिय नमुने (Active Templates)' : 'Active Templates'}
              </span>
              <span className="wa-panel-action" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {isMr ? 'व्यवस्थापन' : 'Manage'} <ChevronRight size={14} />
              </span>
            </div>

            <div className="template-grid">
              <div className="tpl-card">
                <div className="tpl-header">
                  <span className="tpl-name">Nivedan Acknowledgment</span>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span className="tpl-code">NIV_ACK</span>
                    <span className="tpl-category cat-utility">Utility</span>
                  </div>
                </div>
                <div className="tpl-preview">
                  {isMr ? 'नमस्कार {{name}}, आपली तक्रार क्र. {{tracking_id}} नोंदवली गेली आहे...' : 'Hello {{name}}, your complaint No {{tracking_id}} has been received...'}
                </div>
                <div className="tpl-meta">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Send size={12} /> {isMr ? 'वापर: ३१२ वेळा' : 'Used: 312 times'}
                  </span>
                  <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <Check size={12} /> {isMr ? 'मंजूर' : 'Approved'}
                  </span>
                </div>
              </div>

              <div className="tpl-card">
                <div className="tpl-header">
                  <span className="tpl-name">Event Invitation</span>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span className="tpl-code">EVENT_INVITE</span>
                    <span className="tpl-category cat-marketing">Marketing</span>
                  </div>
                </div>
                <div className="tpl-preview">
                  {isMr ? 'आपणास {{event_name}} कार्यक्रमास निमंत्रण. दिनांक: {{date}}...' : 'You are invited to {{event_name}}. Date: {{date}}...'}
                </div>
                <div className="tpl-meta">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Send size={12} /> {isMr ? 'वापर: ८९ वेळा' : 'Used: 89 times'}
                  </span>
                  <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <Check size={12} /> {isMr ? 'मंजूर' : 'Approved'}
                  </span>
                </div>
              </div>

              <div className="tpl-card">
                <div className="tpl-header">
                  <span className="tpl-name">Broadcast Announcement</span>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span className="tpl-code">BROADCAST</span>
                    <span className="tpl-category cat-marketing">Marketing</span>
                  </div>
                </div>
                <div className="tpl-preview">
                  {isMr ? '{{mla_name}} कार्यालयाकडून: {{custom_message}}' : 'From {{mla_name}} Office: {{custom_message}}'}
                </div>
                <div className="tpl-meta">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Send size={12} /> {isMr ? 'वापर: ४५ वेळा' : 'Used: 45 times'}
                  </span>
                  <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <Check size={12} /> {isMr ? 'मंजूर' : 'Approved'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── New Broadcast Form Modal ─────────────────────────── */}
      {showBroadcastModal && (
        <div className="nivedan-modal-overlay" onClick={() => setShowBroadcastModal(false)}>
          <div className="nivedan-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Megaphone size={18} /> {isMr ? 'नवीन व्हॉट्सअॅप प्रसारण पाठवा' : 'Send WhatsApp Broadcast'}
              </h3>
              <button className="modal-close-btn" onClick={() => setShowBroadcastModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleSendBroadcast}>
              <div className="modal-body">
                <div className="nivedan-form-grid">
                  <div className="nivedan-form-group">
                    <label className="nivedan-form-label">
                      {isMr ? 'प्राप्तकर्ता गट (Recipient Group)' : 'Target Group'}
                    </label>
                    <select
                      className="nivedan-form-input"
                      value={broadcastForm.target_group}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, target_group: e.target.value })}
                    >
                      <option value="Haveli Taluka Workers">{isMr ? 'हवेली तालुका कार्यकर्ते (156)' : 'Haveli Workers (156)'}</option>
                      <option value="Wadgaon Area Workers">{isMr ? 'वडगाव परिसर कार्यकर्ते (24)' : 'Wadgaon Workers (24)'}</option>
                      <option value="Booth Pramukhs">{isMr ? 'सर्व बूथ प्रमुख (156)' : 'All Booth Pramukhs (156)'}</option>
                    </select>
                  </div>

                  <div className="nivedan-form-group">
                    <label className="nivedan-form-label">
                      {isMr ? 'वापरणारा संदेश नमुना (Template)' : 'Template'}
                    </label>
                    <select
                      className="nivedan-form-input"
                      value={broadcastForm.template_code}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, template_code: e.target.value })}
                    >
                      <option value="EVENT_INVITE">{isMr ? 'EVENT_INVITE (कार्यक्रम निमंत्रण)' : 'EVENT_INVITE'}</option>
                      <option value="BROADCAST">{isMr ? 'BROADCAST (सार्वजनिक घोषणा)' : 'BROADCAST'}</option>
                      <option value="WORK_UPDATE">{isMr ? 'WORK_UPDATE (विकासकाम अद्ययावत)' : 'WORK_UPDATE'}</option>
                    </select>
                  </div>

                  <div className="nivedan-form-group full">
                    <label className="nivedan-form-label">
                      {isMr ? 'संदेश मजकूर (Custom Message)' : 'Message Content'}
                    </label>
                    <textarea
                      className="nivedan-form-input"
                      style={{ height: '80px' }}
                      value={broadcastForm.custom_message}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, custom_message: e.target.value })}
                      placeholder={isMr ? 'आपला संदेश येथे लिहा...' : 'Enter broadcast message content...'}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowBroadcastModal(false)}
                  disabled={sendingBroadcast}
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-wa" disabled={sendingBroadcast} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Megaphone size={16} /> {sendingBroadcast ? (isMr ? 'पाठवत आहे...' : 'Sending...') : (isMr ? 'प्रसारण संदेश पाठवा' : 'Send Broadcast')}
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
