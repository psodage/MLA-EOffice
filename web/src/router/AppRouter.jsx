// src/router/AppRouter.jsx
// ============================================================
// React Router v6 — Application routing configuration
// Auth-aware: ProtectedRoute guards all protected pages.
// ============================================================

import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// ── Generic Module Placeholder Component ──────────────────
const ModulePlaceholder = ({ titleMr, titleEn, icon }) => (
  <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(30,41,59,0.7)', borderRadius: '16px', border: '1px solid rgba(255,153,51,0.2)', margin: '1rem 0' }}>
    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{icon}</div>
    <h1 style={{ fontSize: '1.75rem', color: '#FF9933', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
      {titleMr}
    </h1>
    <p style={{ color: '#94a3b8', marginTop: '0.25rem', fontSize: '0.9rem' }}>{titleEn} — पुढील मॉड्युमध्ये समाविष्ट</p>
    <div style={{ marginTop: '1.5rem' }}>
      <Link to="/dashboard" style={{ display: 'inline-block', padding: '0.6rem 1.2rem', background: '#FF9933', color: '#0f172a', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
        ← डॅशबोर्डवर परत जा / Return to Dashboard
      </Link>
    </div>
  </div>
);

const UnauthorizedPage = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a1020', color: '#e2e8f0' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
      <h1 style={{ fontSize: '1.5rem', color: '#FC5C7D', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>प्रवेश नाकारला</h1>
      <p style={{ color: '#8EA4C8', marginTop: '0.5rem' }}>You don't have permission to access this page.</p>
      <Link to="/dashboard" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#FF9933', textDecoration: 'none' }}>
        ← परत डॅशबोर्डवर जा
      </Link>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a1020', color: '#e2e8f0' }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '5rem', color: '#FF9933', lineHeight: 1 }}>404</h1>
      <p style={{ color: '#8EA4C8', marginTop: '0.5rem' }}>पृष्ठ सापडले नाही / Page not found</p>
      <Link to="/dashboard" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#FF9933', textDecoration: 'none' }}>
        ← परत जा
      </Link>
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
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Module routes (placeholders replaced as each module is built) */}
        <Route
          path="/inward/*"
          element={
            <ProtectedRoute module="inward">
              <MainLayout>
                <ModulePlaceholder titleMr="📥 आवक नोंदवही" titleEn="Inward Register Module" icon="📥" />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/outward/*"
          element={
            <ProtectedRoute module="outward">
              <MainLayout>
                <ModulePlaceholder titleMr="📤 जावक नोंदवही" titleEn="Outward Register Module" icon="📤" />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/nivedan/*"
          element={
            <ProtectedRoute module="nivedan">
              <MainLayout>
                <ModulePlaceholder titleMr="📋 निवेदने" titleEn="Petitions (Nivedan) Module" icon="📋" />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/visitors/*"
          element={
            <ProtectedRoute module="visitor">
              <MainLayout>
                <ModulePlaceholder titleMr="👥 नागरिक भेट नोंद" titleEn="Visitor Book Module" icon="👥" />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/devworks/*"
          element={
            <ProtectedRoute module="devworks">
              <MainLayout>
                <ModulePlaceholder titleMr="🏗️ विकासकामे" titleEn="Development Works Module" icon="🏗️" />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/karyakarta/*"
          element={
            <ProtectedRoute module="karyakarta">
              <MainLayout>
                <ModulePlaceholder titleMr="🚩 कार्यकर्ता नोंदवही" titleEn="Karyakarta Directory Module" icon="🚩" />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar/*"
          element={
            <ProtectedRoute module="calendar">
              <MainLayout>
                <ModulePlaceholder titleMr="🗓️ दिनदर्शिका" titleEn="Calendar Module" icon="🗓️" />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/*"
          element={
            <ProtectedRoute module="reports">
              <MainLayout>
                <ModulePlaceholder titleMr="📊 अहवाल व विश्लेषण" titleEn="Reports & Analytics Module" icon="📊" />
              </MainLayout>
            </ProtectedRoute>
          }
        />

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
