import useLangStore from '../../store/langStore.js';

const STATUS_CONFIG = {
  PENDING: {
    mr: 'प्रलंबित',
    en: 'Pending',
    bg: 'rgba(245, 158, 11, 0.18)',
    border: 'rgba(245, 158, 11, 0.35)',
    color: '#fbbf24',
    dot: '#f59e0b',
  },
  ASSIGNED: {
    mr: 'नियुक्त',
    en: 'Assigned',
    bg: 'rgba(168, 85, 247, 0.18)',
    border: 'rgba(168, 85, 247, 0.35)',
    color: '#c084fc',
    dot: '#a855f7',
  },
  IN_PROGRESS: {
    mr: 'प्रगतीपथावर',
    en: 'In Progress',
    bg: 'rgba(56, 189, 248, 0.18)',
    border: 'rgba(56, 189, 248, 0.35)',
    color: '#38bdf8',
    dot: '#0ea5e9',
  },
  COMPLETED: {
    mr: 'पूर्ण',
    en: 'Completed',
    bg: 'rgba(34, 197, 94, 0.18)',
    border: 'rgba(34, 197, 94, 0.35)',
    color: '#4ade80',
    dot: '#22c55e',
  },
  CANCELLED: {
    mr: 'रद्द',
    en: 'Cancelled',
    bg: 'rgba(148, 163, 184, 0.18)',
    border: 'rgba(148, 163, 184, 0.35)',
    color: '#94a3b8',
    dot: '#64748b',
  },
};

const InwardStatusBadge = ({ status }) => {
  const { lang } = useLangStore();
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.25rem 0.6rem',
        borderRadius: '6px',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        fontSize: '0.78rem',
        fontWeight: 600,
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
      <span>{lang === 'MR' ? config.mr : config.en}</span>
    </span>
  );
};

export default InwardStatusBadge;
