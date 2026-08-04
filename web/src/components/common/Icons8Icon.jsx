// src/components/common/Icons8Icon.jsx
// ============================================================
// Compatibility Wrapper — Delegates to LucideIcon component
// ============================================================

import React from 'react';
import LucideIcon from './LucideIcon.jsx';

export const ICONS8_STYLES = {
  FLUENCY: 'fluency',
  THREE_D: '3d-fluency',
  ENTERPRISE: 'ios-filled',
  THEME_MATCH: 'theme-matched',
};

const Icons8Icon = ({ name, size = 20, ...props }) => {
  return <LucideIcon name={name} size={size} {...props} />;
};

export default Icons8Icon;
