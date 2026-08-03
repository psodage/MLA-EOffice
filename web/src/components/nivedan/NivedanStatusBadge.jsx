// src/components/nivedan/NivedanStatusBadge.jsx
// ============================================================
// Status Badge Component for Nivedan (8 Statuses)
// PENDING | IN_PROGRESS | FORWARDED | AWAITING_RESPONSE | RESOLVED | REJECTED | CANCELLED | ARCHIVED
// ============================================================

const STATUS_CONFIG = {
  PENDING: {
    mr: 'प्रलंबित',
    en: 'Pending',
    bg: 'rgba(245, 158, 11, 0.18)',
    border: 'rgba(245, 158, 11, 0.35)',
    color: '#fbbf24',
    dot: '#f59e0b',
  },
  IN_PROGRESS: {
    mr: 'प्रगतीपथावर',
    en: 'In Progress',
    bg: 'rgba(56, 189, 248, 0.18)',
    border: 'rgba(56, 189, 248, 0.35)',
    color: '#38bdf8',
    dot: '#0ea5e9',
  },
  FORWARDED: {
    mr: 'पाठावलेले',
    en: 'Forwarded',
    bg: 'rgba(249, 115, 22, 0.18)',
    border: 'rgba(249, 115, 22, 0.35)',
    color: '#fb923c',
    dot: '#f97316',
  },
  AWAITING_RESPONSE: {
    mr: 'उत्तराच्या प्रतीक्षेत',
    en: 'Awaiting Response',
    bg: 'rgba(168, 85, 247, 0.18)',
    border: 'rgba(168, 85, 247, 0.35)',
    color: '#c084fc',
    dot: '#a855f7',
  },
  RESOLVED: {
    mr: 'मार्गस्थ / पूर्ण',
    en: 'Resolved',
    bg: 'rgba(34, 197, 94, 0.18)',
    border: 'rgba(34, 197, 94, 0.35)',
    color: '#4ade80',
    dot: '#22c55e',
  },
  REJECTED: {
    mr: 'नाकारलेले',
    en: 'Rejected',
    bg: 'rgba(239, 68, 68, 0.18)',
    border: 'rgba(239, 68, 68, 0.35)',
    color: '#f87171',
    dot: '#ef4444',
  },
  CANCELLED: {
    mr: 'रद्द',
    en: 'Cancelled',
    bg: 'rgba(148, 163, 184, 0.18)',
    border: 'rgba(148, 163, 184, 0.35)',
    color: '#94a3b8',
    dot: '#64748b',
  },
  ARCHIVED: {
    mr: 'अर्काइव्ह केलेले',
    en: 'Archived',
    bg: 'rgba(71, 85, 105, 0.25)',
    border: 'rgba(71, 85, 105, 0.4)',
    color: '#cbd5e1',
    dot: '#475569',
  },
};

const NivedanStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.25rem 0.65rem',
        borderRadius: '6px',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        fontSize: '0.78rem',
        fontWeight: 600,
        fontFamily: "'Noto Sans Devanagari', sans-serif",
        lineHeight: 1.2,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.dot,
          boxShadow: `0 0 6px ${config.dot}`,
        }}
      />
      <span>{config.mr}</span>
      <span style={{ opacity: 0.7, fontSize: '0.68rem' }}>({config.en})</span>
    </span>
  );
};

export default NivedanStatusBadge;
