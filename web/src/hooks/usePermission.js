// src/hooks/usePermission.js
// ============================================================
// Role-permission hook from AUTH_SPEC.md §13.
// Provides canAccess(module), canPerform(action), isRole(...roles)
// ============================================================

import useAuthStore from '../store/authStore.js';

// Role → module + action matrix (from AUTH_SPEC §13)
const ROLE_PERMISSIONS = {
  MLA: {
    modules: [
      'dashboard', 'inward', 'outward', 'nivedan', 'visitor', 'devworks',
      'karyakarta', 'booth', 'geography', 'calendar', 'whatsapp', 'reports',
      'notifications', 'audit',
    ],
    actions: ['view', 'export'],
  },
  PA: {
    modules: [
      'dashboard', 'inward', 'outward', 'nivedan', 'visitor', 'devworks',
      'karyakarta', 'booth', 'geography', 'calendar', 'whatsapp', 'reports',
      'notifications',
    ],
    actions: ['view', 'create', 'edit', 'assign', 'forward', 'resolve', 'broadcast', 'export', 'delegate'],
  },
  RECEPTIONIST: {
    modules: ['inward', 'nivedan', 'visitor', 'calendar', 'notifications'],
    actions: ['view_own', 'create'],
  },
  AUDITOR: {
    modules: ['devworks', 'booth', 'calendar', 'notifications'],
    actions: ['view_assigned', 'verify', 'upload_photos'],
  },
  BOOTH_PRAMUKH: {
    modules: [],
    actions: ['view_own'],
  },
  ADMIN: {
    modules: ['users', 'audit', 'notifications'],
    actions: ['view', 'create', 'edit', 'reset_password', 'deactivate'],
  },
  CITIZEN: {
    modules: [],
    actions: [],
  },
};

export const usePermission = () => {
  const { user } = useAuthStore();
  const role = user?.role;

  /** Check if current role can access a module */
  const canAccess = (module) => {
    if (!role) return false;
    // Also check accessible_modules from JWT (dynamic per user)
    const userModules = user?.accessible_modules || [];
    const roleModules = ROLE_PERMISSIONS[role]?.modules || [];
    return userModules.includes(module) || roleModules.includes(module);
  };

  /** Check if current role can perform an action */
  const canPerform = (action) => {
    if (!role) return false;
    return ROLE_PERMISSIONS[role]?.actions.includes(action) || false;
  };

  /** Check if current user has one of the given roles */
  const isRole = (...roles) => roles.includes(role);

  /** Check if user is a super-user (MLA or PA) */
  const isSuperUser = () => isRole('MLA', 'PA');

  return { canAccess, canPerform, isRole, isSuperUser, role };
};

export default usePermission;
