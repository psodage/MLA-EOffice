// src/store/authStore.js
// ============================================================
// Zustand store for authentication state.
// Manages: user object, access token, role, auth status.
// Full implementation in Module 3 (Auth).
// ============================================================

import { create } from 'zustand';

const useAuthStore = create((set) => ({
  // State
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // true until initial auth check completes

  // Actions (skeletons — full implementation in Module 3)
  setAuth: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  // Convenience getters
  getRole: () => useAuthStore.getState().user?.role || null,
}));

export default useAuthStore;
