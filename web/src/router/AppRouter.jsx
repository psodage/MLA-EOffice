// src/router/AppRouter.jsx
// ============================================================
// React Router v6 — Application routing configuration
// Auth-aware: ProtectedRoute guards all protected pages.
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// ── Placeholder pages (replaced per module) ──────────────────
const DashboardPage = () => (
  <div style={{ padding: '2rem', background: '#0a1020', minHeight: '100vh', color: '#e2e8f0' }}>
    <h1 style={{ fontSize: '1.75rem', color: '#FF9933', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
      📊 डॅशबोर्ड
    </h1>
    <p style={{ color: '#8EA4C8', marginTop: '0.5rem' }}>Dashboard — Module 4</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
      {['Inward', 'Outward', 'Nivedan', 'Visitors', 'Dev Works', 'Karyakarta'].map((mod) => (
        <div key={mod} style={{ background: 'rgba(14,22,44,0.85)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,153,51,0.15)' }}>
          <h3 style={{ color: '#FF9933', fontSize: '1rem' }}>{mod}</h3>
          <p style={{ color: '#4A6080', fontSize: '0.875rem', marginTop: '0.25rem' }}>Coming soon</p>
        </div>
      ))}
    </div>
  </div>
);

const UnauthorizedPage = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a1020', color: '#e2e8f0' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
      <h1 style={{ fontSize: '1.5rem', color: '#FC5C7D', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>प्रवेश नाकारला</h1>
      <p style={{ color: '#8EA4C8', marginTop: '0.5rem' }}>You don't have permission to access this page.</p>
      <a href="/dashboard" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#FF9933', textDecoration: 'none' }}>
        ← परत डॅशबोर्डवर जा
      </a>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a1020', color: '#e2e8f0' }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '5rem', color: '#FF9933', lineHeight: 1 }}>404</h1>
      <p style={{ color: '#8EA4C8', marginTop: '0.5rem' }}>पृष्ठ सापडले नाही / Page not found</p>
      <a href="/dashboard" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#FF9933', textDecoration: 'none' }}>
        ← परत जा
      </a>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ── */}
        <Route path="/login" element={<LoginPage />} />

        {/* ── Protected routes ── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Module routes (added per module) */}
        {/* <Route path="/inward/*" element={<ProtectedRoute module="inward"><InwardRoutes /></ProtectedRoute>} /> */}
        {/* <Route path="/nivedan/*" element={<ProtectedRoute module="nivedan"><NivedanRoutes /></ProtectedRoute>} /> */}

        {/* ── Utility routes ── */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* ── Default redirect ── */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ── 404 ── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
