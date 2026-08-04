import useLangStore from '../../store/langStore.js';

const PRIORITY_CONFIG = {
  HIGH: {
    mr: 'उच्च प्राधान्य',
    en: 'High Priority',
    bg: 'rgba(239, 68, 68, 0.18)',
    border: 'rgba(239, 68, 68, 0.35)',
    color: '#f87171',
    icon: '🔴',
  },
  MEDIUM: {
    mr: 'मध्यम प्राधान्य',
    en: 'Medium Priority',
    bg: 'rgba(245, 158, 11, 0.18)',
    border: 'rgba(245, 158, 11, 0.35)',
    color: '#fbbf24',
    icon: '🟡',
  },
  LOW: {
    mr: 'सामान्य प्राधान्य',
    en: 'Low Priority',
    bg: 'rgba(56, 189, 248, 0.18)',
    border: 'rgba(56, 189, 248, 0.35)',
    color: '#38bdf8',
    icon: '🔵',
  },
};

const PriorityBadge = ({ priority }) => {
  const { lang } = useLangStore();
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
      }}
    >
      <span style={{ fontSize: '0.65rem' }}>{config.icon}</span>
      <span>{lang === 'MR' ? config.mr : config.en}</span>
    </span>
  );
};

export default PriorityBadge;
