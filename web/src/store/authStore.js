// src/store/authStore.js
// ============================================================
// Zustand auth store — manages user state, login, logout,
// and initial auth check on page load (silent refresh).
// ============================================================

import { create } from 'zustand';
import api, { setAccessToken, clearAccessToken } from '../services/api.js';

const useAuthStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────
  user: null,
  isAuthenticated: false,
  isLoading: true, // true until initial checkAuth() resolves

  // ── Login ────────────────────────────────────────────────
  /**
   * POST /auth/login
   * Stores access token in memory, user in store.
   * @returns {{ mustChangePassword: boolean }}
   */
  login: async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    const { accessToken, user, mustChangePassword } = data.data;

    setAccessToken(accessToken);
    set({ user, isAuthenticated: true, isLoading: false });

    return { mustChangePassword };
  },

  // ── Logout ───────────────────────────────────────────────
  /**
   * POST /auth/logout
   * Clears server refresh token + client state
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Always clear local state even if server call fails
    } finally {
      clearAccessToken();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // ── Initial Auth Check (page refresh recovery) ────────────
  /**
   * Called once on app mount.
   * Attempts silent refresh using httpOnly cookie.
   * If refresh succeeds → user is authenticated.
   * If refresh fails → user goes to /login.
   */
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/refresh');
      const { accessToken, user } = data.data;

      setAccessToken(accessToken);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      // No valid refresh token → not authenticated
      clearAccessToken();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // ── Convenience selectors ─────────────────────────────────
  getRole: () => get().user?.role || null,
  getModules: () => get().user?.accessible_modules || [],
}));

export default useAuthStore;
