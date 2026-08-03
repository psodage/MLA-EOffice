// src/components/layout/MainLayout.jsx
// ============================================================
// Main Application Layout Component
// Includes Top Navbar Header & Collapsible Left Sidebar with
// role-based navigation and bilingual Marathi / English labels.
// ============================================================

import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import usePermission from '../../hooks/usePermission.js';
import './MainLayout.css';

// SVG Icon Helpers for clean, zero-dependency modern UI
const Icons = {
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect>
      <rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect>
    </svg>
  ),
  Inward: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 15 11"></polyline><line x1="12" y1="2" x2="12" y2="14"></line>
      <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path>
    </svg>
  ),
  Outward: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 8 12 5 9 8"></polyline><line x1="12" y1="17" x2="12" y2="5"></line>
      <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path>
    </svg>
  ),
  Nivedan: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  Visitors: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Devworks: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line>
      <line x1="12" y1="18" x2="12" y2="18.01"></line><line x1="12" y1="14" x2="12" y2="14.01"></line>
      <line x1="12" y1="10" x2="12" y2="10.01"></line><line x1="12" y1="6" x2="12" y2="6.01"></line>
    </svg>
  ),
  Karyakarta: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
      <line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Reports: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
  Menu: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
};

const NAV_ITEMS = [
  { path: '/dashboard', labelMr: 'डॅशबोर्ड', labelEn: 'Dashboard', module: 'dashboard', icon: Icons.Dashboard },
  { path: '/inward', labelMr: 'आवक नोंदवही', labelEn: 'Inward Register', module: 'inward', icon: Icons.Inward },
  { path: '/outward', labelMr: 'जावक नोंदवही', labelEn: 'Outward Register', module: 'outward', icon: Icons.Outward },
  { path: '/nivedan', labelMr: 'निवेदने', labelEn: 'Petitions', module: 'nivedan', icon: Icons.Nivedan },
  { path: '/visitors', labelMr: 'नागरिक भेट', labelEn: 'Visitor Book', module: 'visitor', icon: Icons.Visitors },
  { path: '/devworks', labelMr: 'विकासकामे', labelEn: 'Dev Works', module: 'devworks', icon: Icons.Devworks },
  { path: '/karyakarta', labelMr: 'कार्यकर्ता नोंद', labelEn: 'Karyakarta Directory', module: 'karyakarta', icon: Icons.Karyakarta },
  { path: '/calendar', labelMr: 'दिनदर्शिका', labelEn: 'Calendar', module: 'calendar', icon: Icons.Calendar },
  { path: '/reports', labelMr: 'अहवाल', labelEn: 'Reports', module: 'reports', icon: Icons.Reports },
];

const ROLE_LABELS = {
  MLA: { mr: 'आमदार (MLA)', en: 'Executive Owner', bg: 'rgba(255, 153, 51, 0.2)', text: '#FF9933' },
  PA: { mr: 'पी.ए. / व्यवस्थापक', en: 'PA / Office Manager', bg: 'rgba(56, 189, 248, 0.2)', text: '#38bdf8' },
  RECEPTIONIST: { mr: 'रिसेप्शनिस्ट', en: 'Front Desk Clerk', bg: 'rgba(168, 85, 247, 0.2)', text: '#c084fc' },
  AUDITOR: { mr: 'क्षेत्रीय ऑडिटर', en: 'Field Auditor', bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80' },
  ADMIN: { mr: 'प्रशासक (Admin)', en: 'System Administrator', bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171' },
  BOOTH_PRAMUKH: { mr: 'बूथ प्रमुख', en: 'Booth Pramukh', bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24' },
  CITIZEN: { mr: 'नागरिक', en: 'Citizen', bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8' },
};

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { canAccess } = usePermission();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const roleInfo = ROLE_LABELS[user?.role] || ROLE_LABELS.CITIZEN;

  return (
    <div className={`layout-root ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* ── Top Navbar ────────────────────────────────────────── */}
      <header className="top-navbar">
        <div className="navbar-left">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            <Icons.Menu />
          </button>
          <div className="brand-logo-container">
            <span className="brand-emblem" aria-hidden="true">🏛️</span>
            <div className="brand-text">
              <span className="brand-title-mr">महाराष्ट्र विधानसभा • आमदार ई-कार्यालय</span>
              <span className="brand-title-en">MLA E-Office • Governance System</span>
            </div>
          </div>
        </div>

        <div className="navbar-right">
          {/* Active User Badge */}
          <div className="user-profile-badge">
            <div className="user-avatar-circle">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.full_name || user?.username}</span>
              <span
                className="user-role-tag"
                style={{ background: roleInfo.bg, color: roleInfo.text }}
              >
                {roleInfo.mr}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button className="logout-btn" onClick={handleLogout} title="बाहेर पडा / Logout">
            <Icons.Logout />
            <span className="logout-label">बाहेर पडा</span>
          </button>
        </div>
      </header>

      <div className="layout-body">
        {/* ── Mobile Sidebar Overlay ──────────────────────────── */}
        {mobileOpen && (
          <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
        )}

        {/* ── Left Sidebar Navigation ─────────────────────────── */}
        <aside className={`left-sidebar ${mobileOpen ? 'mobile-show' : ''}`}>
          <div className="sidebar-header">
            {!collapsed && (
              <span className="sidebar-section-title">मुख्य मेनू / NAVIGATION</span>
            )}
            <button
              className="collapse-toggle-btn"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'विस्तारित करा / Expand' : 'लहान करा / Collapse'}
            >
              {collapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
            </button>
          </div>

          <nav className="sidebar-nav">
            {NAV_ITEMS.filter((item) => canAccess(item.module)).map((item) => {
              const IconComp = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="nav-icon"><IconComp /></span>
                  {!collapsed && (
                    <div className="nav-label-block">
                      <span className="nav-label-mr">{item.labelMr}</span>
                      <span className="nav-label-en">{item.labelEn}</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Office Footer Badge in Sidebar */}
          {!collapsed && (
            <div className="sidebar-footer">
              <span className="footer-status-dot"></span>
              <div className="footer-text">
                <span className="footer-line1">ई-कार्यालय ऑनलाईन</span>
                <span className="footer-line2">v1.0.0 • सुरक्षित JWT</span>
              </div>
            </div>
          )}
        </aside>

        {/* ── Main Content Container ──────────────────────────── */}
        <main className="main-content-wrapper">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
