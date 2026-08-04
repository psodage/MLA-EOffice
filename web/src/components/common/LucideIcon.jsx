// src/components/common/LucideIcon.jsx
// ============================================================
// Lucide Icon Renderer Component for MLA E-Office
// Supports 4 Cohesive Uniform Icon Family Styles:
// 1. 'saas-line'      - Sleek SaaS Line (Linear / Vercel Style - Recommended)
// 2. 'ios-line'       - Apple iOS Rounded Line (Soft Curves & Corners)
// 3. 'tech-line'      - Tech Monochromatic (Stripe / Supabase Style)
// 4. 'executive-line' - Executive Government (Formal Fine Line Art)
// ============================================================

import React from 'react';
import { getLucideIcon, getFamilyStrokeWidth } from '../../utils/iconMap.js';

export const COHESIVE_FAMILIES = {
  SAAS: 'saas-line',
  IOS: 'ios-line',
  TECH: 'tech-line',
  EXECUTIVE: 'executive-line',
};

const LucideIcon = ({
  name,
  size = 20,
  strokeWidth,
  family,
  variant, // Backwards-compatibility alias for family
  color,
  className = '',
  style = {},
  ...props
}) => {
  // Get active family style from prop, localStorage, or fallback to tech-line
  const activeFamily = family || variant || localStorage.getItem('mla_icon_family') || COHESIVE_FAMILIES.TECH;

  const IconComponent = getLucideIcon(name, activeFamily);
  const defaultStroke = getFamilyStrokeWidth(activeFamily);
  const dynamicStroke = strokeWidth || defaultStroke;

  return (
    <span className={`lucide-icon-wrapper family-${activeFamily} ${className}`}>
      <IconComponent
        size={size}
        strokeWidth={dynamicStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        color={color}
        className={`lucide-icon lucide-icon-${name}`}
        style={{ verticalAlign: 'middle', display: 'inline-block', ...style }}
        {...props}
      />
    </span>
  );
};

export default LucideIcon;
