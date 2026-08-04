// src/components/layout/MainLayout.jsx
// ============================================================
// Main Application Layout Component — Enterprise Shell
// Includes top navbar, search, segmented theme/language controls,
// and grouped left navigation sidebar matching dashboard.html
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sun, Moon, Globe, Flag, X, Layers, FileText } from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import useLangStore from '../../store/langStore.js';
import usePermission from '../../hooks/usePermission.js';
import api from '../../services/api.js';
import LucideIcon from '../common/LucideIcon.jsx';
import './MainLayout.css';

// Master list of all searchable modules & system pages
const SEARCH_MODULES = [
  {
    path: '/dashboard',
    labelMr: 'डॅशबोर्ड',
    labelEn: 'Dashboard',
    categoryMr: 'कार्यालय',
    categoryEn: 'Office',
    module: 'dashboard',
    iconKey: 'dashboard',
    tags: ['home', 'main', 'overview', 'मुख्य', 'सांख्यिकी', 'डॅशबोर्ड']
  },
  {
    path: '/inward',
    labelMr: 'आवक व जावक नोंदवही',
    labelEn: 'Inward & Outward Register',
    categoryMr: 'कार्यालय',
    categoryEn: 'Office',
    module: 'inward',
    iconKey: 'inward',
    tags: ['inward', 'outward', 'letter', 'mail', 'post', 'आवक', 'जावक', 'पत्र', 'नोंदवही']
  },
  {
    path: '/visitors',
    labelMr: 'नागरिक भेट नोंदवही',
    labelEn: 'Visitor Book',
    categoryMr: 'कार्यालय',
    categoryEn: 'Office',
    module: 'visitor',
    iconKey: 'visitor',
    tags: ['visitor', 'citizen', 'meeting', 'नागरिक', 'भेट', 'पाहुणे']
  },
  {
    path: '/nivedan',
    labelMr: 'निवेदने व अर्ज',
    labelEn: 'Nivedans & Petitions',
    categoryMr: 'जनता',
    categoryEn: 'Public',
    module: 'nivedan',
    iconKey: 'nivedan',
    tags: ['nivedan', 'petition', 'complaint', 'request', 'निवेदने', 'तक्रार', 'अर्ज']
  },
  {
    path: '/devworks',
    labelMr: 'विकासकामे नोंदवही',
    labelEn: 'Development Works',
    categoryMr: 'जनता',
    categoryEn: 'Public',
    module: 'devworks',
    iconKey: 'devworks',
    tags: ['devworks', 'project', 'scheme', 'fund', 'विकासकामे', 'निधी', 'रस्ता', 'पाणी', 'काम']
  },
  {
    path: '/karyakarta',
    labelMr: 'कार्यकर्ता नोंदवही',
    labelEn: 'Karyakarta Master',
    categoryMr: 'संघटन',
    categoryEn: 'Network',
    module: 'karyakarta',
    iconKey: 'karyakarta',
    tags: ['karyakarta', 'worker', 'member', 'party', 'कार्यकर्ता', 'पद', 'सदस्य']
  },
  {
    path: '/gram-ward',
    labelMr: 'ग्राम / वॉर्ड रचना',
    labelEn: 'Gram / Ward Organization',
    categoryMr: 'संघटन',
    categoryEn: 'Network',
    module: 'karyakarta',
    iconKey: 'gram-ward',
    tags: ['gram', 'ward', 'village', 'panchayat', 'ग्राम', 'वॉर्ड', 'गाव', 'रचना']
  },
  {
    path: '/booth',
    labelMr: 'बूथ संरचना',
    labelEn: 'Booth Structure',
    categoryMr: 'संघटन',
    categoryEn: 'Network',
    module: 'karyakarta',
    iconKey: 'booth',
    tags: ['booth', 'polling', 'election', 'बूथ', 'मतदान', 'केंद्र']
  },
  {
    path: '/calendar',
    labelMr: 'दिनदर्शिका व कार्यक्रम',
    labelEn: 'Calendar & Schedule',
    categoryMr: 'साधने',
    categoryEn: 'Tools',
    module: 'calendar',
    iconKey: 'calendar',
    tags: ['calendar', 'events', 'meeting', 'schedule', 'दिनदर्शिका', 'कार्यक्रम', 'वेळापत्रक']
  },
  {
    path: '/whatsapp',
    labelMr: 'व्हॉट्सॲप ऑटोमेशन',
    labelEn: 'WhatsApp Automation',
    categoryMr: 'साधने',
    categoryEn: 'Tools',
    module: 'whatsapp',
    iconKey: 'whatsapp',
    tags: ['whatsapp', 'message', 'broadcast', 'व्हॉट्सॲप', 'संदेश', 'ऑटोमेशन']
  },
  {
    path: '/reports',
    labelMr: 'अहवाल व विश्लेषण',
    labelEn: 'Reports & Analytics',
    categoryMr: 'साधने',
    categoryEn: 'Tools',
    module: 'reports',
    iconKey: 'reports',
    tags: ['reports', 'analytics', 'pdf', 'excel', 'अहवाल', 'रिपोर्ट', 'विश्लेषण']
  },
  {
    path: '/settings',
    labelMr: 'सेटिंग्ज',
    labelEn: 'Settings',
    categoryMr: 'सिस्टम',
    categoryEn: 'System',
    module: 'settings',
    iconKey: 'settings',
    tags: ['settings', 'config', 'profile', 'सेटिंग्ज', 'प्रोफाईल']
  },
  {
    path: '/user-mgmt',
    labelMr: 'वापरकर्ता व्यवस्थापन',
    labelEn: 'User Management',
    categoryMr: 'सिस्टम',
    categoryEn: 'System',
    module: 'users',
    iconKey: 'users',
    tags: ['users', 'admin', 'roles', 'permissions', 'वापरकर्ता', 'अधिकार', 'व्यवस्थापन']
  }
];

// Universal Search Content Dataset (Simulated & API populated page content records)
const SAMPLE_CONTENT_RECORDS = [
  {
    type: 'nivedan',
    path: '/nivedan',
    id: 'NIV-2026-104',
    titleMr: 'निवेदन: शेततळे अनुदान थकबाकी तात्काळ मिळणेबाबत (NIV-104)',
    titleEn: 'Petition: Farm Pond Subsidy Disbursement Request (NIV-104)',
    subtitleMr: 'सुनीता देशमुख • मो. ९८२२०१२३४५ • सिन्नर',
    subtitleEn: 'Sunita Deshmukh • Mob: 9822012345 • Sinnar',
    badgeMr: 'प्रलंबित',
    badgeEn: 'Pending',
    badgeClass: 'badge-warning',
    module: 'nivedan',
    iconKey: 'nivedan',
    tags: ['शेततळे', 'अनुदान', 'सुनीता', 'देशमुख', '9822012345', 'सिन्नर', 'niv-2026-104', 'nivedan', 'farm', 'pond']
  },
  {
    type: 'nivedan',
    path: '/nivedan',
    id: 'NIV-2026-112',
    titleMr: 'निवेदन: गावात नवीन डीपी व वीज खांब बसवणे (NIV-112)',
    titleEn: 'Petition: Installation of New Electricity DP (NIV-112)',
    subtitleMr: 'रमेश पाटील • मो. ९९२१०९८७६५ • पिंपळगाव',
    subtitleEn: 'Ramesh Patil • Mob: 9921098765 • Pimpalgaon',
    badgeMr: 'प्रगतीपथावर',
    badgeEn: 'In Progress',
    badgeClass: 'badge-info',
    module: 'nivedan',
    iconKey: 'nivedan',
    tags: ['डीपी', 'वीज', 'रमेश', 'पाटील', '9921098765', 'पिंपळगाव', 'electricity', 'transformer']
  },
  {
    type: 'nivedan',
    path: '/nivedan',
    id: 'NIV-2026-128',
    titleMr: 'निवेदन: प्राथमिक शाळा डिजिटल क्लासरूम निधी (NIV-128)',
    titleEn: 'Petition: Primary School Digital Classroom Fund (NIV-128)',
    subtitleMr: 'अनिल जाधव • मो. ९८२३४५६७८९ • निफाड',
    subtitleEn: 'Anil Jadhav • Mob: 9823456789 • Niphad',
    badgeMr: 'मंजूर',
    badgeEn: 'Approved',
    badgeClass: 'badge-success',
    module: 'nivedan',
    iconKey: 'nivedan',
    tags: ['शाळा', 'डिजिटल', 'वर्ग', 'निधी', 'अनिल', 'जाधव', '9823456789', 'निफाड', 'school']
  },
  {
    type: 'inward',
    path: '/inward',
    id: 'IN-2026-089',
    titleMr: 'आवक पत्र #IN-089: ग्रामीण रस्ते खडीकरण मंजूर करणेबाबत',
    titleEn: 'Inward Letter #IN-089: Rural Road Graveling Approval',
    subtitleMr: 'सरपंच, पिंपळगाव ग्रामपंचायत • PWD विभाग',
    subtitleEn: 'Sarpanch, Pimpalgaon • Public Works Dept (PWD)',
    badgeMr: 'आवक नोंद',
    badgeEn: 'Inward Mail',
    badgeClass: 'badge-primary',
    module: 'inward',
    iconKey: 'inward',
    tags: ['in-2026-089', 'रस्ते', 'खडीकरण', 'सरपंच', 'पिंपळगाव', 'pwd', 'inward']
  },
  {
    type: 'outward',
    path: '/outward',
    id: 'OUT-2026-041',
    titleMr: 'जावक पत्र #OUT-041: जिल्हाधिकारी कार्यालयास विकास निधी पत्र',
    titleEn: 'Outward Letter #OUT-041: Fund Allocation to Collector',
    subtitleMr: 'जिल्हाधिकारी कार्यालय, नाशिक • महसूल विभाग',
    subtitleEn: 'District Collector Office, Nashik • Revenue Dept',
    badgeMr: 'जावक नोंद',
    badgeEn: 'Outward Mail',
    badgeClass: 'badge-secondary',
    module: 'outward',
    iconKey: 'inward',
    tags: ['out-2026-041', 'जिल्हाधिकारी', 'नाशिक', 'महसूल', 'निधी', 'outward']
  },
  {
    type: 'visitor',
    path: '/visitors',
    id: 'VIS-2026-045',
    titleMr: 'नागरिक भेट: विजय भोसले व संगमनेर ग्रामस्थ शिष्टमंडळ',
    titleEn: 'Visitor: Vijay Bhosale & Sangamner Village Delegation',
    subtitleMr: 'विषय: प्रादेशिक पाणी पुरवठा योजना • मो. ९८९०१२३४५६',
    subtitleEn: 'Purpose: Water Supply Scheme Meeting • Mob: 9890123456',
    badgeMr: 'नागरिक भेट',
    badgeEn: 'Visitor Entry',
    badgeClass: 'badge-success',
    module: 'visitor',
    iconKey: 'visitor',
    tags: ['विजय', 'भोसले', 'संगमनेर', 'पाणी', 'शिष्टमंडळ', '9890123456', 'visitor']
  },
  {
    type: 'devworks',
    path: '/devworks',
    id: 'DEV-2026-01',
    titleMr: 'विकासकाम: मुख्य रस्ते सिमेंट काँक्रीटीकरण टप्पा १',
    titleEn: 'Development Work: Main Road Cement Concrete Phase 1',
    subtitleMr: 'सिन्नर - शिर्डी महामार्ग • २५-१५ निधी • अंदाज: ₹४५,००,०००',
    subtitleEn: 'Sinnar Highway • 25-15 Scheme • Est: ₹45,00,000',
    badgeMr: 'प्रकल्प काम',
    badgeEn: 'Project Work',
    badgeClass: 'badge-info',
    module: 'devworks',
    iconKey: 'devworks',
    tags: ['सिन्नर', 'रस्ता', 'काँक्रीटीकरण', 'शिर्डी', 'निधी', '4500000', 'devworks']
  },
  {
    type: 'karyakarta',
    path: '/karyakarta',
    id: 'KAR-2026-07',
    titleMr: 'कार्यकर्ता: सचिन शिंदे (तालुका अध्यक्ष)',
    titleEn: 'Karyakarta: Sachin Shinde (Taluka President)',
    subtitleMr: 'सिन्नर तालुका • बूथ क्र. १२ • मो. ९८२२११४४५५',
    subtitleEn: 'Sinnar Taluka • Booth #12 • Mob: 9822114455',
    badgeMr: 'पदाधिकारी',
    badgeEn: 'Party Worker',
    badgeClass: 'badge-primary',
    module: 'karyakarta',
    iconKey: 'karyakarta',
    tags: ['सचिन', 'शिंदे', 'तालुका', 'अध्यक्ष', 'सिन्नर', '9822114455', 'karyakarta']
  }
];

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('mla_theme') || 'light');
  const { lang, setLang } = useLangStore();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [apiContentResults, setApiContentResults] = useState([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const searchContainerRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { canAccess } = usePermission();

  // Sync theme attribute on documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mla_theme', theme);
  }, [theme]);

  // Handle clicking outside of search bar container to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live API content results dynamically when search query changes
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setApiContentResults([]);
      setIsSearchingApi(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingApi(true);
      try {
        const q = searchQuery.trim();
        // Concurrently query available backend search APIs
        const [nivedanRes, inwardRes, visitorRes] = await Promise.allSettled([
          api.get('/nivedan', { params: { search: q } }),
          api.get('/inward', { params: { search: q } }),
          api.get('/visitor', { params: { search: q } }),
        ]);

        const apiFetched = [];
        if (nivedanRes.status === 'fulfilled' && nivedanRes.value.data?.data) {
          nivedanRes.value.data.data.slice(0, 3).forEach((n) => {
            apiFetched.push({
              type: 'nivedan',
              path: `/nivedan/${n.id}`,
              id: n.petition_number || `NIV-${n.id}`,
              titleMr: `निवेदन: ${n.subject} (${n.petition_number || n.id})`,
              titleEn: `Petition: ${n.subject} (${n.petition_number || n.id})`,
              subtitleMr: `${n.applicant_name || 'नागरिक'} • मो. ${n.applicant_mobile || '-'}`,
              subtitleEn: `${n.applicant_name || 'Citizen'} • Mob: ${n.applicant_mobile || '-'}`,
              badgeMr: n.status || 'प्रलंबित',
              badgeEn: n.status || 'Pending',
              badgeClass: 'badge-warning',
              module: 'nivedan',
              iconKey: 'nivedan'
            });
          });
        }
        setApiContentResults(apiFetched);
      } catch (err) {
        console.debug('Dynamic API search handled gracefully:', err);
      } finally {
        setIsSearchingApi(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Filter modules based on permissions and query string
  const filteredModules = SEARCH_MODULES.filter((item) => {
    if (!canAccess(item.module)) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.labelEn.toLowerCase().includes(q) ||
      item.labelMr.toLowerCase().includes(q) ||
      item.categoryEn.toLowerCase().includes(q) ||
      item.categoryMr.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  // Filter static sample content records by search query
  const filteredSampleContent = SAMPLE_CONTENT_RECORDS.filter((item) => {
    if (!canAccess(item.module)) return false;
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.titleEn.toLowerCase().includes(q) ||
      item.titleMr.toLowerCase().includes(q) ||
      item.subtitleEn.toLowerCase().includes(q) ||
      item.subtitleMr.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  // Combine API results with sample content records (avoid duplicates by id)
  const combinedContentResults = [
    ...apiContentResults,
    ...filteredSampleContent.filter(
      (sample) => !apiContentResults.some((apiItem) => apiItem.id === sample.id)
    )
  ];

  const totalResultsCount = filteredModules.length + combinedContentResults.length;

  const handleSelectSearchResult = (path, searchParam) => {
    if (searchParam) {
      navigate(`${path}?search=${encodeURIComponent(searchParam)}`);
    } else {
      navigate(path);
    }
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsSearchFocused(false);
    } else if (e.key === 'Enter') {
      if (filteredModules.length > 0) {
        handleSelectSearchResult(filteredModules[0].path);
      } else if (combinedContentResults.length > 0) {
        handleSelectSearchResult(combinedContentResults[0].path);
      }
    }
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
      {/* Mobile Sidebar Overlay Backdrop */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'show' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Left Sidebar Navigation ─────────────────────────── */}
      <aside className={`left-sidebar ${mobileOpen ? 'mobile-show' : ''}`}>
        <div className="sidebar-logo-container">
          <div className="sidebar-avatar-circle">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'H'}
          </div>
          {!collapsed && (
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">{user?.full_name || 'Honorable MLA'}</span>
              <span className="sidebar-user-role">{user?.role || 'MLA'}</span>
            </div>
          )}
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

          <div className="nav-divider" />
          <button
            type="button"
            className="nav-link sidebar-logout-btn"
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            title={lang === 'MR' ? 'बाहेर पडा' : 'Logout'}
          >
            <span className="nav-icon">
              <LucideIcon name="logout" size={18} />
            </span>
            {!collapsed && (
              <span>{lang === 'MR' ? 'बाहेर पडा' : 'Logout'}</span>
            )}
          </button>
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

        {/* Wide Centered Universal Search Bar (Desktop) */}
        <div className="topbar-search-container desktop-search-container" ref={searchContainerRef}>
          <span className="topbar-search-icon">
            <LucideIcon name="search" size={16} />
          </span>
          <input
            type="text"
            className="topbar-search-input"
            placeholder={
              lang === 'MR'
                ? 'निवेदने, पत्रे, नागरिक, विकासकामे किंवा मॉड्यूल्स शोधा...'
                : 'Search petitions, letters, visitors, dev works or pages...'
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleSearchKeyDown}
          />
          {searchQuery && (
            <button
              type="button"
              className="topbar-search-clear"
              onClick={() => {
                setSearchQuery('');
                setIsSearchFocused(false);
              }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}

          {/* Universal Search Overlay Results */}
          {isSearchFocused && (searchQuery.trim().length > 0 || totalResultsCount > 0) && (
            <div className="topbar-search-results">

              {/* Group 1: Page Content & Entity Records */}
              {combinedContentResults.length > 0 && (
                <div className="search-group">
                  <div className="search-group-header">
                    <span>
                      {lang === 'MR' ? '📄 पृष्ठ सामग्री व नोंदी' : '📄 Page Content & Entity Records'}
                    </span>
                    <span className="search-group-count">{combinedContentResults.length}</span>
                  </div>
                  {combinedContentResults.map((item) => (
                    <div
                      key={item.id}
                      className="search-result-item content-result"
                      onClick={() => handleSelectSearchResult(item.path, searchQuery)}
                    >
                      <div className="search-result-icon">
                        <LucideIcon name={item.iconKey} size={18} />
                      </div>
                      <div className="search-result-info">
                        <div className="search-result-title">
                          {lang === 'MR' ? item.titleMr : item.titleEn}
                        </div>
                        <div className="search-result-subtitle">
                          {lang === 'MR' ? item.subtitleMr : item.subtitleEn}
                        </div>
                      </div>
                      <span className={`search-result-badge ${item.badgeClass || ''}`}>
                        {lang === 'MR' ? item.badgeMr : item.badgeEn}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Group 2: System Modules & Pages */}
              {filteredModules.length > 0 && (
                <div className="search-group">
                  <div className="search-group-header">
                    <span>
                      {lang === 'MR' ? '📌 मुख्य मॉड्यूल्स व पृष्ठे' : '📌 System Modules & Navigation'}
                    </span>
                    <span className="search-group-count">{filteredModules.length}</span>
                  </div>
                  {filteredModules.map((item) => (
                    <div
                      key={item.path}
                      className="search-result-item"
                      onClick={() => handleSelectSearchResult(item.path)}
                    >
                      <div className="search-result-icon">
                        <LucideIcon name={item.iconKey} size={18} />
                      </div>
                      <div className="search-result-info">
                        <div className="search-result-title">
                          {lang === 'MR' ? item.labelMr : item.labelEn}
                        </div>
                        <div className="search-result-subtitle">
                          {lang === 'MR' ? item.labelEn : item.labelMr}
                        </div>
                      </div>
                      <span className="search-result-category">
                        {lang === 'MR' ? item.categoryMr : item.categoryEn}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* No results placeholder */}
              {totalResultsCount === 0 && (
                <div className="search-no-results">
                  {lang === 'MR'
                    ? 'कोणतीही जुळणारी माहिती, निवेदने किंवा पृष्ठे सापडली नाहीत'
                    : 'No matching records, petitions, or pages found'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Segmented Controls, Profile & Actions */}
        <div className="navbar-right">
          {/* Mobile Search Icon Button */}
          <button
            type="button"
            className="mobile-search-trigger"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Search"
            title={lang === 'MR' ? 'शोधा' : 'Search'}
          >
            <LucideIcon name="search" size={16} />
          </button>

          {/* Theme Segmented Switch */}
          <div className="segmented-switch">
            <button
              type="button"
              className={theme === 'light' ? 'active' : ''}
              onClick={() => setTheme('light')}
              aria-label="Light Theme"
            >
              <Sun size={14} /> <span className="switch-label">Light</span>
            </button>
            <button
              type="button"
              className={theme === 'dark' ? 'active' : ''}
              onClick={() => setTheme('dark')}
              aria-label="Dark Theme"
            >
              <Moon size={14} /> <span className="switch-label">Dark</span>
            </button>
          </div>

          {/* Language Segmented Switch */}
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
      </header>

      {/* Slide-down Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-bar-inner">
            <span className="mobile-search-icon">
              <LucideIcon name="search" size={16} />
            </span>
            <input
              type="text"
              className="mobile-search-input"
              placeholder={
                lang === 'MR'
                  ? 'शोधा...'
                  : 'Search...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              onKeyDown={handleSearchKeyDown}
            />
            {searchQuery && (
              <button
                type="button"
                className="mobile-search-clear"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
            <button
              type="button"
              className="mobile-search-close"
              onClick={() => setMobileSearchOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* Mobile Search Results */}
          {(searchQuery.trim().length > 0 || totalResultsCount > 0) && (
            <div className="mobile-search-results">
              {combinedContentResults.length > 0 && (
                <div className="search-group">
                  <div className="search-group-header">
                    <span>{lang === 'MR' ? '📄 नोंदणी व सामग्री' : '📄 Content & Records'}</span>
                    <span className="search-group-count">{combinedContentResults.length}</span>
                  </div>
                  {combinedContentResults.map((item) => (
                    <div
                      key={item.id}
                      className="search-result-item content-result"
                      onClick={() => {
                        handleSelectSearchResult(item.path, searchQuery);
                        setMobileSearchOpen(false);
                      }}
                    >
                      <div className="search-result-icon">
                        <LucideIcon name={item.iconKey} size={18} />
                      </div>
                      <div className="search-result-info">
                        <div className="search-result-title">
                          {lang === 'MR' ? item.titleMr : item.titleEn}
                        </div>
                        <div className="search-result-subtitle">
                          {lang === 'MR' ? item.subtitleMr : item.subtitleEn}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredModules.length > 0 && (
                <div className="search-group">
                  <div className="search-group-header">
                    <span>{lang === 'MR' ? '📌 मॉड्यूल्स' : '📌 Modules'}</span>
                    <span className="search-group-count">{filteredModules.length}</span>
                  </div>
                  {filteredModules.map((item) => (
                    <div
                      key={item.path}
                      className="search-result-item"
                      onClick={() => {
                        handleSelectSearchResult(item.path);
                        setMobileSearchOpen(false);
                      }}
                    >
                      <div className="search-result-icon">
                        <LucideIcon name={item.iconKey} size={18} />
                      </div>
                      <div className="search-result-info">
                        <div className="search-result-title">
                          {lang === 'MR' ? item.labelMr : item.labelEn}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalResultsCount === 0 && (
                <div className="search-no-results">
                  {lang === 'MR' ? 'कोणतीही माहिती सापडली नाही' : 'No records found'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
