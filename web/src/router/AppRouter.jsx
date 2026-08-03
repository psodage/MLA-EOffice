// src/router/AppRouter.jsx
// ============================================================
// React Router v6 — Application routing configuration
// Routes are organized by module matching the architecture spec
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Placeholder page components (to be replaced with real pages per module)
const LoginPage = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a' }}>
    <div style={{ textAlign: 'center', color: '#e2e8f0' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#38bdf8' }}>MLA E-Office</h1>
      <p style={{ fontSize: '1.125rem', color: '#94a3b8' }}>एमएलए ई-ऑफिस</p>
      <p style={{ marginTop: '2rem', color: '#64748b' }}>Login page — Module 3</p>
    </div>
  </div>
);

const DashboardPage = () => (
  <div style={{ padding: '2rem', background: '#0f172a', minHeight: '100vh', color: '#e2e8f0' }}>
    <h1 style={{ fontSize: '1.75rem', color: '#38bdf8' }}>📊 Dashboard</h1>
    <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Dashboard — Module 4</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
      {['Inward', 'Outward', 'Nivedan', 'Visitors', 'Dev Works', 'Karyakarta'].map((mod) => (
        <div key={mod} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '1rem' }}>{mod}</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Coming soon</p>
        </div>
      ))}
    </div>
  </div>
);

const NotFoundPage = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a', color: '#e2e8f0' }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', color: '#38bdf8' }}>404</h1>
      <p style={{ color: '#94a3b8' }}>Page not found</p>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes (auth guard added in Module 3) */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Module routes (added per module) */}
        {/* <Route path="/inward/*" element={<InwardRoutes />} /> */}
        {/* <Route path="/outward/*" element={<OutwardRoutes />} /> */}
        {/* <Route path="/nivedan/*" element={<NivedanRoutes />} /> */}
        {/* <Route path="/visitors/*" element={<VisitorRoutes />} /> */}
        {/* <Route path="/devworks/*" element={<DevWorksRoutes />} /> */}
        {/* <Route path="/karyakarta/*" element={<KaryakartaRoutes />} /> */}
        {/* <Route path="/calendar/*" element={<CalendarRoutes />} /> */}
        {/* <Route path="/reports/*" element={<ReportsRoutes />} /> */}

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
