// src/components/inward/PriorityBadge.jsx
// ============================================================
// Priority Badge Component for Inward Entries
// HIGH | MEDIUM | LOW
// ============================================================

const PRIORITY_CONFIG = {
  HIGH: {
    mr: 'उच्च प्राधान्य',
    en: 'High',
    bg: 'rgba(239, 68, 68, 0.18)',
    border: 'rgba(239, 68, 68, 0.35)',
    color: '#f87171',
    icon: '🔴',
  },
  MEDIUM: {
    mr: 'मध्यम प्राधान्य',
    en: 'Medium',
    bg: 'rgba(245, 158, 11, 0.18)',
    border: 'rgba(245, 158, 11, 0.35)',
    color: '#fbbf24',
    icon: '🟡',
  },
  LOW: {
    mr: 'सामान्य प्राधान्य',
    en: 'Low',
    bg: 'rgba(56, 189, 248, 0.18)',
    border: 'rgba(56, 189, 248, 0.35)',
    color: '#38bdf8',
    icon: '🔵',
  },
};

const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.2rem 0.55rem',
        borderRadius: '6px',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        fontSize: '0.75rem',
        fontWeight: 600,
        fontFamily: "'Noto Sans Devanagari', sans-serif",
      }}
    >
      <span style={{ fontSize: '0.65rem' }}>{config.icon}</span>
      <span>{config.mr}</span>
    </span>
  );
};

export default PriorityBadge;
