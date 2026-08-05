// src/router/AppRouter.jsx
// ============================================================
// React Router v6 — Application routing configuration
// Auth-aware: ProtectedRoute guards all protected pages.
// ============================================================

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Sun, Moon, Globe, Flag } from 'lucide-react';
import useLangStore from '../store/langStore.js';
import LoginPage from '../pages/LoginPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import InwardListPage from '../pages/inward/InwardListPage.jsx';
import OutwardListPage from '../pages/outward/OutwardListPage.jsx';
import NivedanListPage from '../pages/nivedan/NivedanListPage.jsx';
import NivedanDetailPage from '../pages/nivedan/NivedanDetailPage.jsx';
import PublicTrackingPage from '../pages/nivedan/PublicTrackingPage.jsx';
import VisitorListPage from '../pages/visitors/VisitorListPage.jsx';
import DevWorksListPage from '../pages/devworks/DevWorksListPage.jsx';
import DevWorkDetailPage from '../pages/devworks/DevWorkDetailPage.jsx';
import KaryakartaListPage from '../pages/karyakarta/KaryakartaListPage.jsx';
import GramWardPage from '../pages/gramward/GramWardPage.jsx';
import BoothPage from '../pages/booth/BoothPage.jsx';
import CalendarPage from '../pages/calendar/CalendarPage.jsx';
import WhatsAppLogsPage from '../pages/whatsapp/WhatsAppLogsPage.jsx';
import ReportsPage from '../pages/reports/ReportsPage.jsx';
import UserManagementPage from '../pages/settings/UserManagementPage.jsx';
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

// ── Floating Toggle Controls for Standalone Pages ──────────
const StandaloneToggles = ({ theme, setTheme }) => {
  const { lang, setLang } = useLangStore();

  return (
    <div style={{ position: 'fixed', top: '16px', right: '20px', display: 'flex', gap: '10px', zIndex: 1000 }}>
      <div className="segmented-switch">
        <button
          type="button"
          className={theme === 'light' ? 'active' : ''}
          onClick={() => setTheme('light')}
          aria-label="Light Theme"
        >
          <Sun size={14} /> Light
        </button>
        <button
          type="button"
          className={theme === 'dark' ? 'active' : ''}
          onClick={() => setTheme('dark')}
          aria-label="Dark Theme"
        >
          <Moon size={14} /> Dark
        </button>
      </div>
      <div className="segmented-switch" title="भाषा बदला / Change Language">
        <button
          type="button"
          className={lang === 'EN' ? 'active' : ''}
          onClick={() => setLang('EN')}
          aria-label="English Language"
          title="English"
        >
          <Globe size={14} /> EN
        </button>
        <button
          type="button"
          className={lang === 'MR' ? 'active' : ''}
          onClick={() => setLang('MR')}
          style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          aria-label="Marathi Language"
          title="मराठी (Marathi)"
        >
          <Flag size={14} /> मराठी
        </button>
      </div>
    </div>
  );
};

const UnauthorizedPage = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('mla_theme') || 'light');
  const { lang } = useLangStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mla_theme', theme);
  }, [theme]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-bg-primary, #0a1020)', color: 'var(--color-text-primary, #e2e8f0)', position: 'relative' }}>
      <StandaloneToggles theme={theme} setTheme={setTheme} />
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
        <h1 style={{ fontSize: '1.75rem', color: '#FC5C7D', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          {lang === 'MR' ? 'प्रवेश नाकारला' : 'Access Denied'}
        </h1>
        <p style={{ color: 'var(--color-text-secondary, #8EA4C8)', marginTop: '0.5rem' }}>
          {lang === 'MR' ? 'आपल्याला या पृष्ठावर प्रवेश करण्याची परवानगी नाही.' : "You don't have permission to access this page."}
        </p>
        <Link to="/dashboard" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#FF9933', textDecoration: 'none', fontWeight: 600 }}>
          {lang === 'MR' ? '← डॅशबोर्डवर परत जा' : '← Return to Dashboard'}
        </Link>
      </div>
    </div>
  );
};

const NotFoundPage = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('mla_theme') || 'light');
  const { lang } = useLangStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mla_theme', theme);
  }, [theme]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-bg-primary, #0a1020)', color: 'var(--color-text-primary, #e2e8f0)', position: 'relative' }}>
      <StandaloneToggles theme={theme} setTheme={setTheme} />
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '5rem', color: '#FF9933', lineHeight: 1 }}>404</h1>
        <p style={{ color: 'var(--color-text-secondary, #8EA4C8)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
          {lang === 'MR' ? 'पृष्ठ सापडले नाही' : 'Page Not Found'}
        </p>
        <Link to="/dashboard" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#FF9933', textDecoration: 'none', fontWeight: 600 }}>
          {lang === 'MR' ? '← परत जा' : '← Go Back'}
        </Link>
      </div>
    </div>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/track" element={<PublicTrackingPage />} />
        <Route path="/track/:mobile" element={<PublicTrackingPage />} />

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
        {/* Inward Register Module */}
        <Route
          path="/inward/*"
          element={
            <ProtectedRoute module="inward">
              <MainLayout>
                <InwardListPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Outward Register Module */}
        <Route
          path="/outward/*"
          element={
            <ProtectedRoute module="outward">
              <MainLayout>
                <OutwardListPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Nivedan / Petitions Module */}
        <Route
          path="/nivedan/:id"
          element={
            <ProtectedRoute module="nivedan">
              <MainLayout>
                <NivedanDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nivedan/*"
          element={
            <ProtectedRoute module="nivedan">
              <MainLayout>
                <NivedanListPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Visitor Book Module */}
        <Route
          path="/visitors/*"
          element={
            <ProtectedRoute module="visitor">
              <MainLayout>
                <VisitorListPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Development Works Module */}
        <Route
          path="/devworks"
          element={
            <ProtectedRoute module="devworks">
              <MainLayout>
                <DevWorksListPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/devworks/:id"
          element={
            <ProtectedRoute module="devworks">
              <MainLayout>
                <DevWorkDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/devworks/*"
          element={
            <ProtectedRoute module="devworks">
              <MainLayout>
                <DevWorksListPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Karyakarta Directory Module */}
        <Route
          path="/karyakarta/*"
          element={
            <ProtectedRoute module="karyakarta">
              <MainLayout>
                <KaryakartaListPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Gram / Ward Organization Module */}
        <Route
          path="/gram-ward"
          element={
            <ProtectedRoute module="karyakarta">
              <MainLayout>
                <GramWardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gramward/*"
          element={
            <ProtectedRoute module="karyakarta">
              <MainLayout>
                <GramWardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Booth Structure Module */}
        <Route
          path="/booth"
          element={
            <ProtectedRoute module="karyakarta">
              <MainLayout>
                <BoothPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/booth/*"
          element={
            <ProtectedRoute module="karyakarta">
              <MainLayout>
                <BoothPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/booths/*"
          element={
            <ProtectedRoute module="karyakarta">
              <MainLayout>
                <BoothPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Calendar & Schedule Module */}
        <Route
          path="/calendar/*"
          element={
            <ProtectedRoute module="calendar">
              <MainLayout>
                <CalendarPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* WhatsApp Integration Module */}
        <Route
          path="/whatsapp/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <WhatsAppLogsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Reports & Analytics Module */}
        <Route
          path="/reports/*"
          element={
            <ProtectedRoute module="reports">
              <MainLayout>
                <ReportsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* User Management Module (ADMIN access ONLY) */}
        <Route
          path="/user-mgmt/*"
          element={
            <ProtectedRoute module="users" roles={['ADMIN']}>
              <MainLayout>
                <UserManagementPage defaultTab="USERS" />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Office Settings Module */}
        <Route
          path="/settings/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UserManagementPage defaultTab="DEPARTMENTS" />
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
