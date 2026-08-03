// src/utils/officeHours.js
// ============================================================
// Office-hours access check for time-restricted roles
// (AUTH_SPEC.md §10 — RECEPTIONIST, AUDITOR)
// ============================================================

import config from '../config/env.config.js';

const TIME_RESTRICTED_ROLES = ['RECEPTIONIST', 'AUDITOR'];

/**
 * @returns {boolean} true if login/API access is allowed now
 */
export const isWithinOfficeHours = () => {
  if (!config.officeHours.enabled) {
    return true;
  }

  const now = new Date();
  const istString = now.toLocaleString('en-US', { timeZone: config.officeHours.tz });
  const istDate = new Date(istString);

  const day = istDate.getDay(); // 0 = Sun, 6 = Sat
  if (day === 0) {
    return false;
  }

  const currentMinutes = istDate.getHours() * 60 + istDate.getMinutes();

  const [startH, startM] = config.officeHours.start.split(':').map(Number);
  const [endH, endM] = config.officeHours.end.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};

/**
 * @param {string} role
 * @returns {boolean}
 */
export const isRoleTimeRestricted = (role) => TIME_RESTRICTED_ROLES.includes(role);
