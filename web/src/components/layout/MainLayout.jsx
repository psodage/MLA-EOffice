// src/components/layout/MainLayout.jsx
// ============================================================
// Main Application Layout Component — Enterprise Shell
// Includes top navbar, search, theme/language controls,
// and grouped left navigation sidebar matching dashboard.html
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import usePermission from '../../hooks/usePermission.js';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('mla_theme') || 'light');
  const [lang, setLang] = useState(() => localStorage.getItem('mla_lang') || 'EN');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { canAccess } = usePermission();

  // Sync theme attribute on documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mla_theme', theme);
  }, [theme]);

  // Sync language selection
  useEffect(() => {
    localStorage.setItem('mla_lang', lang);
  }, [lang]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navGroups = [
    {
      sectionTitle: lang === 'MR' ? 'Office · कार्यालय' : 'OFFICE',
      items: [
        { path: '/dashboard', labelMr: 'डॅशबोर्ड', labelEn: 'Dashboard', module: 'dashboard', icon: '📊' },
        { path: '/inward', labelMr: 'आवक व जावक', labelEn: 'Inward & Outward', module: 'inward', icon: '📨' },
        { path: '/visitors', labelMr: 'नागरिक भेट', labelEn: 'Visitor Book', module: 'visitor', icon: '👤' },
      ],
    },
    {
      sectionTitle: lang === 'MR' ? 'Public · जनता' : 'PUBLIC',
      items: [
        { path: '/nivedan', labelMr: 'निवेदने', labelEn: 'Nivedans', module: 'nivedan', icon: '📝' },
        { path: '/devworks', labelMr: 'विकासकामे', labelEn: 'Development Works', module: 'devworks', icon: '🏗️' },
      ],
    },
    {
      sectionTitle: lang === 'MR' ? 'Network · संघटन' : 'NETWORK',
      items: [
        { path: '/karyakarta', labelMr: 'कार्यकर्ता नोंद', labelEn: 'Karyakarta Master', module: 'karyakarta', icon: '👥' },
        { path: '/gram-ward', labelMr: 'ग्राम / वॉर्ड', labelEn: 'Gram / Ward', module: 'karyakarta', icon: '📍' },
        { path: '/booth', labelMr: 'बूथ रचना', labelEn: 'Booth Structure', module: 'karyakarta', icon: '🗳️' },
      ],
    },
    {
      sectionTitle: lang === 'MR' ? 'Tools · साधने' : 'TOOLS',
      items: [
        { path: '/calendar', labelMr: 'दिनदर्शिका', labelEn: 'Calendar', module: 'calendar', icon: '📅' },
        { path: '/whatsapp', labelMr: 'व्हॉट्सॲप', labelEn: 'WhatsApp', module: 'whatsapp', icon: '💬' },
        { path: '/reports', labelMr: 'अहवाल', labelEn: 'Reports', module: 'reports', icon: '📑' },
      ],
    },
    {
      isDivider: true,
      items: [
        { path: '/settings', labelMr: 'सेटिंग्ज', labelEn: 'Settings', module: 'settings', icon: '⚙️' },
        { path: '/user-mgmt', labelMr: 'वापरकर्ता व्यवस्थापन', labelEn: 'User Management', module: 'users', icon: '🛡️' },
      ],
    },
  ];

  return (
    <div className={`layout-root ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* ── Left Sidebar Navigation ─────────────────────────── */}
      <aside className={`left-sidebar ${mobileOpen ? 'mobile-show' : ''}`}>
        <div className="sidebar-logo-container">
          <div className="emblem-icon">🏛️</div>
          {!collapsed && <span className="brand-title">MLA E-Office</span>}
        </div>

        <nav className="sidebar-nav">
          {navGroups.map((group, gIdx) => {
            if (group.isDivider) {
              return (
                <div key={`div-${gIdx}`}>
                  <div className="nav-divider" />
                  {group.items.filter(item => canAccess(item.module)).map(item => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-link ${isActive ? 'active' : ''}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && (
                          <span>{lang === 'MR' ? `${item.labelEn} · ${item.labelMr}` : item.labelEn}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            }

            const accessibleItems = group.items.filter(item => canAccess(item.module));
            if (accessibleItems.length === 0) return null;

            return (
              <div key={group.sectionTitle || gIdx}>
                {!collapsed && group.sectionTitle && (
                  <div className="nav-section-header">{group.sectionTitle}</div>
                )}
                {accessibleItems.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {!collapsed && (
                        <span>
                          {lang === 'MR'
                            ? `${item.labelEn} · ${item.labelMr}`
                            : item.labelEn}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ── Top Navbar ────────────────────────────────────────── */}
      <header className="top-navbar">
        <div className="navbar-left">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <button
            type="button"
            className="topbar-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            ☰
          </button>
        </div>

        {/* Wide Centered Search Bar */}
        <div className="topbar-search-container">
          <span className="topbar-search-icon">🔍</span>
          <input
            type="text"
            className="topbar-search-input"
            placeholder={
              lang === 'MR'
                ? 'सर्व मॉड्यूल्समध्ये शोधा... / Search across all modules...'
                : 'Search across all modules...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Actions, Theme, Language & User Profile */}
        <div className="navbar-right">
          {/* Language Toggle */}
          <button
            type="button"
            className="topbar-icon-btn"
            title="Switch Language"
            onClick={() => setLang(l => l === 'EN' ? 'MR' : 'EN')}
          >
            🌐
          </button>

          {/* Notifications */}
          <button type="button" className="topbar-icon-btn" title="Notifications">
            🔔<span className="badge">5</span>
          </button>

          {/* Theme Toggle */}
          <div className="layout-theme-toggle">
            <button
              type="button"
              className={theme === 'light' ? 'active' : ''}
              onClick={() => setTheme('light')}
            >
              ☀ Light
            </button>
            <button
              type="button"
              className={theme === 'dark' ? 'active' : ''}
              onClick={() => setTheme('dark')}
            >
              🌙 Dark
            </button>
          </div>

          {/* User Profile Badge */}
          <div className="topbar-user-badge" title={user?.role || 'User'}>
            <div className="user-avatar-circle">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-details-block">
              <span className="user-name-text">{user?.full_name || user?.username || 'Rajesh Deshmukh'}</span>
              <span className="user-role-text">{user?.role || 'Personal Assistant'}</span>
            </div>
          </div>

          {/* Logout Icon */}
          <button
            type="button"
            className="logout-btn-icon"
            onClick={handleLogout}
            title="Logout / बाहेर पडा"
          >
            🚪
          </button>
        </div>
      </header>

      {/* ── Main Body & Content ─────────────────────────────── */}
      <div className="layout-body">
        <main className="main-content-wrapper">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
