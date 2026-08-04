// src/components/layout/MainLayout.jsx
// ============================================================
// Main Application Layout Component — Enterprise Shell
// Includes top navbar, search, segmented theme/language controls,
// and grouped left navigation sidebar matching dashboard.html
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import useLangStore from '../../store/langStore.js';
import usePermission from '../../hooks/usePermission.js';
import LucideIcon from '../common/LucideIcon.jsx';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('mla_theme') || 'light');
  const { lang, setLang } = useLangStore();
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

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navGroups = [
    {
      sectionTitle: lang === 'MR' ? 'कार्यालय' : 'OFFICE',
      items: [
        { path: '/dashboard', labelMr: 'डॅशबोर्ड', labelEn: 'Dashboard', module: 'dashboard', iconKey: 'dashboard' },
        { path: '/inward', labelMr: 'आवक व जावक नोंदवही', labelEn: 'Inward & Outward', module: 'inward', iconKey: 'inward' },
        { path: '/visitors', labelMr: 'नागरिक भेट नोंदवही', labelEn: 'Visitor Book', module: 'visitor', iconKey: 'visitor' },
      ],
    },
    {
      sectionTitle: lang === 'MR' ? 'जनता' : 'PUBLIC',
      items: [
        { path: '/nivedan', labelMr: 'निवेदने', labelEn: 'Nivedans', module: 'nivedan', iconKey: 'nivedan' },
        { path: '/devworks', labelMr: 'विकासकामे', labelEn: 'Development Works', module: 'devworks', iconKey: 'devworks' },
      ],
    },
    {
      sectionTitle: lang === 'MR' ? 'संघटन' : 'NETWORK',
      items: [
        { path: '/karyakarta', labelMr: 'कार्यकर्ता नोंदवही', labelEn: 'Karyakarta Master', module: 'karyakarta', iconKey: 'karyakarta' },
        { path: '/gram-ward', labelMr: 'ग्राम / वॉर्ड रचना', labelEn: 'Gram / Ward', module: 'karyakarta', iconKey: 'gram-ward' },
        { path: '/booth', labelMr: 'बूथ संरचना', labelEn: 'Booth Structure', module: 'karyakarta', iconKey: 'booth' },
      ],
    },
    {
      sectionTitle: lang === 'MR' ? 'साधने' : 'TOOLS',
      items: [
        { path: '/calendar', labelMr: 'दिनदर्शिका', labelEn: 'Calendar', module: 'calendar', iconKey: 'calendar' },
        { path: '/whatsapp', labelMr: 'व्हॉट्सॲप ऑटोमेशन', labelEn: 'WhatsApp', module: 'whatsapp', iconKey: 'whatsapp' },
        { path: '/reports', labelMr: 'अहवाल', labelEn: 'Reports', module: 'reports', iconKey: 'reports' },
      ],
    },
    {
      isDivider: true,
      items: [
        { path: '/settings', labelMr: 'सेटिंग्ज', labelEn: 'Settings', module: 'settings', iconKey: 'settings' },
        { path: '/user-mgmt', labelMr: 'वापरकर्ता व्यवस्थापन', labelEn: 'User Management', module: 'users', iconKey: 'users' },
      ],
    },
  ];

  return (
    <div className={`layout-root ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* ── Left Sidebar Navigation ─────────────────────────── */}
      <aside className={`left-sidebar ${mobileOpen ? 'mobile-show' : ''}`}>
        <div className="sidebar-logo-container">
          <div className="emblem-icon">
            <LucideIcon name="emblem" size={26} />
          </div>
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
                        <span className="nav-icon">
                          <LucideIcon name={item.iconKey} size={18} />
                        </span>
                        {!collapsed && (
                          <span>{lang === 'MR' ? item.labelMr : item.labelEn}</span>
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
                      <span className="nav-icon">
                        <LucideIcon name={item.iconKey} size={18} />
                      </span>
                      {!collapsed && (
                        <span>{lang === 'MR' ? item.labelMr : item.labelEn}</span>
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
          <span className="topbar-search-icon">
            <LucideIcon name="search" size={16} />
          </span>
          <input
            type="text"
            className="topbar-search-input"
            placeholder={
              lang === 'MR'
                ? 'सर्व मॉड्यूल्समध्ये शोधा...'
                : 'Search across all modules...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Segmented Controls, Profile & Actions */}
        <div className="navbar-right">

          {/* Theme Segmented Switch */}
          <div className="segmented-switch">
            <button
              type="button"
              className={theme === 'light' ? 'active' : ''}
              onClick={() => setTheme('light')}
              aria-label="Light Theme"
            >
              ☀ Light
            </button>
            <button
              type="button"
              className={theme === 'dark' ? 'active' : ''}
              onClick={() => setTheme('dark')}
              aria-label="Dark Theme"
            >
              🌙 Dark
            </button>
          </div>

          {/* Language Segmented Switch */}
          <div className="segmented-switch">
            <button
              type="button"
              className={lang === 'EN' ? 'active' : ''}
              onClick={() => setLang('EN')}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === 'MR' ? 'active' : ''}
              onClick={() => setLang('MR')}
              style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            >
              मराठी
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
            <LucideIcon name="logout" size={18} />
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
