// src/pages/settings/UserManagementPage.jsx
// ============================================================
// User Management & Office Settings Page — Module 14
// RBAC User administration, Accessible Modules Editor, Soft Deactivation, & Directory Settings
// 100% Matching Design System with InwardListPage, VisitorListPage & NivedanListPage
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { Settings, UserPlus, Building2, Calendar, Tag, Shield, Key, Phone, Mail, Edit, CheckCircle2, XCircle, X, Save, Plus, Users } from 'lucide-react';
import useLangStore from '../../store/langStore.js';
import api from '../../services/api.js';
import useAuthStore from '../../store/authStore.js';
import './UserManagementPage.css';

const MODULE_OPTIONS_EN = [
  { id: 'inward', label: 'Inward Register' },
  { id: 'outward', label: 'Outward Register' },
  { id: 'nivedan', label: 'Petitions & Complaints' },
  { id: 'visitor', label: 'Visitor Book' },
  { id: 'devworks', label: 'Development Works' },
  { id: 'karyakarta', label: 'Karyakarta Directory' },
  { id: 'calendar', label: 'Calendar & Schedule' },
  { id: 'reports', label: 'Reports & Analytics' },
];

const MODULE_OPTIONS_MR = [
  { id: 'inward', label: 'आवक नोंदवही' },
  { id: 'outward', label: 'जावक नोंदवही' },
  { id: 'nivedan', label: 'तक्रार निवारण' },
  { id: 'visitor', label: 'नागरिक भेट' },
  { id: 'devworks', label: 'विकासकामे' },
  { id: 'karyakarta', label: 'कार्यकर्ता नोंदवही' },
  { id: 'calendar', label: 'दिनदर्शिका' },
  { id: 'reports', label: 'अहवाल व विश्लेषण' },
];

const t = {
  EN: {
    title: 'User Management & Office Settings',
    subtitle: 'Manage system users, role-based access permissions, department directory, and greeting calendars',
    addUser: 'Add New User',
    tabUsers: 'User Management',
    tabDepartments: 'Department Directory',
    tabGreetings: 'Greetings Calendar',
    tabCategories: 'Petition Categories',
    secUsers: 'System Users & Module Permissions',
    colUser: 'User & Username',
    colRole: 'Role',
    colMobile: 'Mobile',
    colModules: 'Accessible Modules',
    colStatus: 'Status',
    colActions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    editModules: 'Modules',
    resetPassword: 'Password',
    secDept: 'Government Departments & Head Officers',
    colDept: 'Department Name',
    colHead: 'Head Officer Name',
    colContact: 'Contact Mobile',
    colEmail: 'Email',
    secGreet: 'Festival & Birthday Greeting Presets',
    colOccasion: 'Occasion / Event',
    colDate: 'Scheduled Date',
    colTemplate: 'Message Template (WhatsApp)',
    secCat: 'Petition Classification & Priority System',
    colCatName: 'Category Name',
    colSla: 'Default SLA (Days)',
    colDeptAssigned: 'Assigned Dept',
    loading: 'Loading settings data...',
  },
  MR: {
    title: 'वापरकर्ता व्यवस्थापन व सेटिंग्ज',
    subtitle: 'प्रणाली वापरकर्ते, रोल-बेस्ड ॲक्सेस परवानग्या, विभाग मार्गदर्शिका व व्हॉट्सॲप कॅलेंडर',
    addUser: 'नवीन वापरकर्ता जोडा',
    tabUsers: 'वापरकर्ता व्यवस्थापन',
    tabDepartments: 'विभाग मार्गदर्शिका',
    tabGreetings: 'सण व वाढदिवस कॅलेंडर',
    tabCategories: 'तक्रार वर्गवारी',
    secUsers: 'प्रणाली वापरकर्ते व मॉड्युल्स ॲक्सेस',
    colUser: 'वापरकर्त्याचे नाव व युझरनेम',
    colRole: 'रोल',
    colMobile: 'मोबाईल',
    colModules: 'ॲक्सेस असलेले मॉड्युल्स',
    colStatus: 'स्थिती',
    colActions: 'कृती',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    editModules: 'मॉड्युल्स',
    resetPassword: 'पासवर्ड',
    secDept: 'शासन विभाग अधिकारी मार्गदर्शिका',
    colDept: 'विभाग नाव',
    colHead: 'प्रमुख अधिकारी नाव व पद',
    colContact: 'संपर्क क्रमांक',
    colEmail: 'ईमेल',
    secGreet: 'सण व दिनविशेष शुभेच्छा संदेश कॅलेंडर',
    colOccasion: 'प्रसंग / सण',
    colDate: 'दिनांक',
    colTemplate: 'शुभेच्छा संदेश (WhatsApp Template)',
    secCat: 'तक्रार/निवेदन वर्गवारी रचना',
    colCatName: 'वर्गवारी नाव',
    colSla: 'SLA कालावधी (दिवस)',
    colDeptAssigned: 'संबंधित विभाग',
    loading: 'माहिती लोड होत आहे...',
  },
};

const UserManagementPage = ({ defaultTab }) => {
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'ADMIN';
  const { lang } = useLangStore();
  const text = t[lang] || t.EN;

  const initialTab = defaultTab
    ? (defaultTab === 'USERS' && !isAdmin ? 'DEPARTMENTS' : defaultTab)
    : (isAdmin ? 'USERS' : 'DEPARTMENTS');

  const [activeTab, setActiveTab] = useState(initialTab);

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [greetings, setGreetings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showModulesModal, setShowModulesModal] = useState(false);
  const [selectedUserForModules, setSelectedUserForModules] = useState(null);
  const [selectedModules, setSelectedModules] = useState([]);

  // Form states
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    full_name: '',
    role: 'RECEPTIONIST',
    mobile: '',
    email: '',
    password: '',
  });

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, []);

  const fetchSettingsData = useCallback(async () => {
    setLoading(true);
    try {
      if (isAdmin) await fetchUsers();

      const [resDep, resGreet, resCat] = await Promise.all([
        api.get('/settings/departments'),
        api.get('/settings/greetings'),
        api.get('/settings/categories'),
      ]);

      setDepartments(resDep.data?.data || []);
      setGreetings(resGreet.data?.data || []);
      setCategories(resCat.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, fetchUsers]);

  useEffect(() => {
    fetchSettingsData();
  }, [fetchSettingsData]);

  // Toggle user active status
  const handleToggleActive = async (userId) => {
    try {
      await api.patch(`/users/${userId}/active`);
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || 'स्टेटस बदलताना त्रुटी आली.');
    }
  };

  // Reset user password
  const handleResetPassword = async (userId) => {
    const tempPass = prompt('नवीन तात्पुरता पासवर्ड प्रविष्ट करा (Enter Temp Password):', 'Pa@12345');
    if (!tempPass) return;

    try {
      await api.patch(`/users/${userId}/password`, { new_password: tempPass });
      alert('पासवर्ड यशस्वीरित्या रीसेट झाला!');
    } catch (err) {
      alert(err?.response?.data?.message || 'पासवर्ड रीसेट करताना त्रुटी आली.');
    }
  };

  // Open Module Editor
  const openModuleEditor = (userObj) => {
    setSelectedUserForModules(userObj);
    setSelectedModules(userObj.accessible_modules || []);
    setShowModulesModal(true);
  };

  // Save Module Permissions
  const handleSaveModules = async () => {
    if (!selectedUserForModules) return;

    try {
      await api.patch(`/users/${selectedUserForModules.id}/modules`, {
        accessible_modules: selectedModules,
      });
      setShowModulesModal(false);
      fetchUsers();
      alert('वापरकर्ता मॉड्युल्स परवानग्या यशस्वीरित्या अपडेट झाल्या!');
    } catch (err) {
      alert(err?.response?.data?.message || 'परवानग्या जतन करताना त्रुटी आली.');
    }
  };

  // Create User submit
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', newUserForm);
      setShowAddUserModal(false);
      fetchUsers();
      alert('नवीन वापरकर्ता यशस्वीरित्या तयार झाला!');
    } catch (err) {
      alert(err?.response?.data?.message || 'वापरकर्ता तयार करताना त्रुटी आली.');
    }
  };

  const moduleOptions = lang === 'MR' ? MODULE_OPTIONS_MR : MODULE_OPTIONS_EN;

  return (
    <div className="inward-page-container">
      {/* ── Page Header (Matching Inward/Visitor Page Design) ── */}
      <div className="ph">
        <div>
          <h1 className={`title ${lang === 'MR' ? 'mr' : ''}`}>{text.title}</h1>
          <p className={`sub ${lang === 'MR' ? 'mr' : ''}`}>{text.subtitle}</p>
        </div>

        {isAdmin && activeTab === 'USERS' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-p"
              onClick={() => setShowAddUserModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <UserPlus size={15} />
              <span>{text.addUser}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Tab Switcher (Matching Inward/Outward Tab Design) ── */}
      <div className="tabs">
        {isAdmin && (
          <div
            className={`tab ${activeTab === 'USERS' ? 'active' : ''}`}
            onClick={() => setActiveTab('USERS')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <Settings size={14} />
            <span>{text.tabUsers}</span>
          </div>
        )}
        <div
          className={`tab ${activeTab === 'DEPARTMENTS' ? 'active' : ''}`}
          onClick={() => setActiveTab('DEPARTMENTS')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <Building2 size={14} />
          <span>{text.tabDepartments}</span>
        </div>
        <div
          className={`tab ${activeTab === 'GREETINGS' ? 'active' : ''}`}
          onClick={() => setActiveTab('GREETINGS')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <Calendar size={14} />
          <span>{text.tabGreetings}</span>
        </div>
        <div
          className={`tab ${activeTab === 'CATEGORIES' ? 'active' : ''}`}
          onClick={() => setActiveTab('CATEGORIES')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <Tag size={14} />
          <span>{text.tabCategories}</span>
        </div>
      </div>

      {/* ── Main Work Area Table Card ────────────────────────── */}
      <div className="table-wrap">
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--inw-t3)' }}>
            <p>{text.loading}</p>
          </div>
        ) : (
          <>
            {/* 1. User Management Table */}
            {activeTab === 'USERS' && isAdmin && (
              <table>
                <thead>
                  <tr>
                    <th>{text.colUser}</th>
                    <th>{text.colRole}</th>
                    <th>{text.colMobile}</th>
                    <th>{text.colModules}</th>
                    <th>{text.colStatus}</th>
                    <th style={{ textAlign: 'right' }}>{text.colActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--inw-t1)' }}>{u.full_name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--inw-t3)', fontFamily: 'monospace' }}>@{u.username}</div>
                      </td>
                      <td>
                        <span className="user-role-badge" data-role={u.role}>
                          <Shield size={11} /> {u.role}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} /> {u.mobile}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {(u.accessible_modules || []).map((m) => (
                            <span key={m} className="module-chip">{m}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`status-toggle-btn ${u.is_active ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleActive(u.id)}
                        >
                          {u.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          <span>{u.is_active ? text.active : text.inactive}</span>
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="btn btn-o"
                            style={{ fontSize: '11px', height: '28px', padding: '0 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => openModuleEditor(u)}
                          >
                            <Edit size={12} /> {text.editModules}
                          </button>
                          <button
                            type="button"
                            className="btn btn-o"
                            style={{ fontSize: '11px', height: '28px', padding: '0 8px', color: 'var(--inw-er)', borderColor: 'rgba(220,38,38,0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => handleResetPassword(u.id)}
                          >
                            <Key size={12} /> {text.resetPassword}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 2. Department Directory Table */}
            {activeTab === 'DEPARTMENTS' && (
              <table>
                <thead>
                  <tr>
                    <th>{text.colDept}</th>
                    <th>{text.colHead}</th>
                    <th>{text.colContact}</th>
                    <th>{text.colEmail}</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d) => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600, color: 'var(--inw-t1)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Building2 size={14} color="var(--inw-p)" />
                          {lang === 'MR' ? d.name_mr : d.name_en || d.name_mr}
                        </span>
                      </td>
                      <td>{d.head_officer_name || '—'}</td>
                      <td style={{ fontFamily: 'monospace' }}>
                        {d.contact_number ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={12} /> {d.contact_number}
                          </span>
                        ) : '—'}
                      </td>
                      <td>
                        {d.email ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={12} /> {d.email}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 3. WhatsApp Greeting Calendar Table */}
            {activeTab === 'GREETINGS' && (
              <table>
                <thead>
                  <tr>
                    <th>{text.colOccasion}</th>
                    <th>{text.colDate}</th>
                    <th>{text.colTemplate}</th>
                    <th>{text.colStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {greetings.map((g) => (
                    <tr key={g.id}>
                      <td style={{ fontWeight: 600, color: 'var(--inw-t1)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} color="var(--inw-in)" /> {g.event_name}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace' }}>📅 {g.event_date}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--inw-in)', fontWeight: 600 }}>{g.template_name}</td>
                      <td>
                        <span className="badge b-comp" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> {text.active}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 4. Nivedan Categories Table */}
            {activeTab === 'CATEGORIES' && (
              <table>
                <thead>
                  <tr>
                    <th>{text.colCatName} (Marathi)</th>
                    <th>{text.colCatName} (English)</th>
                    <th>{text.colDeptAssigned}</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600, color: 'var(--inw-t1)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Tag size={14} color="var(--inw-wr)" /> {c.name_mr}
                        </span>
                      </td>
                      <td>{c.name_en}</td>
                      <td>{lang === 'MR' ? `विभाग #${c.default_department_id || 1}` : `Department #${c.default_department_id || 1}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      {/* ── Add User Modal (Matching Inward/Visitor Form Modal Style) ── */}
      {showAddUserModal && (
        <div className="inward-modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="inward-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="inward-modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} color="var(--inw-p)" />
                {lang === 'MR' ? 'नवीन वापरकर्ता जोडा' : 'Create System User'}
              </h3>
              <button className="modal-close-btn" onClick={() => setShowAddUserModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="inward-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>{lang === 'MR' ? 'युझरनेम (Username)' : 'Username'} <span className="req">*</span></label>
                  <input
                    type="text"
                    className="fi"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    placeholder="receptionist2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{lang === 'MR' ? 'पूर्ण नाव (Full Name)' : 'Full Name'} <span className="req">*</span></label>
                  <input
                    type="text"
                    className="fi"
                    value={newUserForm.full_name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                    placeholder="Rahul Shinde"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{lang === 'MR' ? 'रोल (Role)' : 'Role'} <span className="req">*</span></label>
                  <select
                    className="fi"
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  >
                    <option value="PA">PA (Personal Assistant)</option>
                    <option value="RECEPTIONIST">RECEPTIONIST</option>
                    <option value="AUDITOR">AUDITOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{lang === 'MR' ? 'मोबाईल (Mobile)' : 'Mobile'}</label>
                  <input
                    type="tel"
                    className="fi"
                    value={newUserForm.mobile}
                    onChange={(e) => setNewUserForm({ ...newUserForm, mobile: e.target.value })}
                    placeholder="98220XXXXX"
                  />
                </div>

                <div className="form-group col-span-2">
                  <label>{lang === 'MR' ? 'तात्पुरता पासवर्ड (Initial Password)' : 'Initial Password'}</label>
                  <input
                    type="password"
                    className="fi"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="Pa@12345"
                  />
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-o" onClick={() => setShowAddUserModal(false)}>
                  {lang === 'MR' ? 'रद्द करा' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-p" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <UserPlus size={15} /> {lang === 'MR' ? 'वापरकर्ता जोडा' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Accessible Modules Checkbox Modal ── */}
      {showModulesModal && selectedUserForModules && (
        <div className="inward-modal-overlay" onClick={() => setShowModulesModal(false)}>
          <div className="inward-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="inward-modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit size={18} color="var(--inw-p)" />
                {lang === 'MR' ? 'मॉड्युल्स परवानग्या संपादक' : 'Module Access Permissions'}
              </h3>
              <button className="modal-close-btn" onClick={() => setShowModulesModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '16px' }}>
              <p style={{ color: 'var(--inw-p)', fontWeight: 600, marginBottom: '12px', fontSize: '13px' }}>
                {selectedUserForModules.full_name} ({selectedUserForModules.role})
              </p>

              <div className="modules-grid">
                {moduleOptions.map((m) => {
                  const isChecked = selectedModules.includes(m.id);
                  return (
                    <label key={m.id} className="module-checkbox-row">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedModules([...selectedModules, m.id]);
                          } else {
                            setSelectedModules(selectedModules.filter((id) => id !== m.id));
                          }
                        }}
                      />
                      <span>{m.label}</span>
                    </label>
                  );
                })}
              </div>

              <div className="modal-actions" style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-o" onClick={() => setShowModulesModal(false)}>
                  {lang === 'MR' ? 'रद्द करा' : 'Cancel'}
                </button>
                <button type="button" className="btn btn-p" onClick={handleSaveModules} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={15} /> {lang === 'MR' ? 'परवानग्या जतन करा' : 'Save Permissions'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
