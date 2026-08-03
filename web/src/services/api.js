// src/services/api.js
// ============================================================
// Axios instance with base URL from environment.
// Auto-attaches Authorization header if token exists.
// Handles token refresh on 401 responses (to be implemented in Module 3).
// ============================================================

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies (for refresh token httpOnly cookie)
});

// ── Request Interceptor ──────────────────────────────────────
// Attach access token to every request (if available)
api.interceptors.request.use(
  (config) => {
    // Token will be managed by Zustand authStore (Module 3)
    // For now, check localStorage as a fallback
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────
// Handle 401 errors and attempt token refresh (Module 3)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying, attempt token refresh
    // This will be fully implemented in Module 3 (Auth)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // TODO: Module 3 — implement token refresh logic here
    }

    return Promise.reject(error);
  }
);

export default api;
