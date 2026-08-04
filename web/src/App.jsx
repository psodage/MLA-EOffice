// src/App.jsx
// ============================================================
// Root application component.
// Calls checkAuth() on mount to restore session from
// httpOnly refresh token cookie (silent refresh on page load).
// ============================================================

import { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import useAuthStore from './store/authStore.js';

function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  // Initialize data-theme on initial mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('mla_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // On every page load / refresh, attempt silent token refresh.
  // This restores auth state from the httpOnly cookie.
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <AppRouter />;
}

export default App;

