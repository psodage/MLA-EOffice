// src/pages/settings/UserManagementPage.jsx
// ============================================================
// User Management & Office Settings Page — Module 14
// RBAC User administration, Accessible Modules Editor, Soft Deactivation, & Directory Settings
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import useLangStore from '../../store/langStore.js';
import api from '../../services/api.js';
import useAuthStore from '../../store/authStore.js';
import './UserManagementPage.css';

const MODULE_OPTIONS_EN = [
  { id: 'inward', label: '📫 Inward Register' },
  { id: 'outward', label: '📤 Outward Register' },
  { id: 'nivedan', label: '📋 Petitions & Complaints' },
  { id: 'visitor', label: '👥 Visitor Book' },
  { id: 'devworks', label: '🏗️ Development Works' },
  { id: 'karyakarta', label: '🚩 Karyakarta Directory' },
  { id: 'calendar', label: '📅 Calendar & Schedule' },
  { id: 'reports', label: '📊 Reports & Analytics' },
];

const MODULE_OPTIONS_MR = [
  { id: 'inward', label: '📫 आवक नोंदवही' },
  { id: 'outward', label: '📤 जावक नोंदवही' },
  { id: 'nivedan', label: '📋 तक्रार निवारण' },
  { id: 'visitor', label: '👥 नागरिक भेट' },
  { id: 'devworks', label: '🏗️ विकासकामे' },
  { id: 'karyakarta', label: '🚩 कार्यकर्ता नोंदवही' },
  { id: 'calendar', label: '📅 दिनदर्शिका' },
  { id: 'reports', label: '📊 अहवाल व विश्लेषण' },
];

const t = {
  EN: {
    title: 'User Management & Office Settings',
    subtitle: 'Manage system users, role-based access permissions, department directory, and greeting calendars',
    addUser: 'Add New User',
    tabUsers: '⚙️ User Management',
    tabDepartments: '🏢 Department Directory',
    tabGreetings: '🎂 Greetings Calendar',
    tabCategories: '🏷️ Petition Categories',
    secUsers: '⚙️ System Users & Module Permissions',
    colUser: 'User & Username',
    colRole: 'Role',
    colMobile: 'Mobile',
    colModules: 'Accessible Modules',
    colStatus: 'Status',
    colActions: 'Actions',
    active: '🟢 Active',
    inactive: '🔴 Inactive',
    editModules: '✏️ Modules',
    resetPassword: '🔑 Password',
    secDept: '🏢 Government Departments & Head Officers',
    colDept: 'Department Name',
    colHead: 'Head Officer Name',
    colContact: 'Contact Mobile',
    colEmail: 'Email',
    secGreet: '🎂 Festival & Birthday Greeting Presets',
    colOccasion: 'Occasion / Event',
    colDate: 'Scheduled Date',
    colTemplate: 'Message Template (WhatsApp)',
    secCat: '🏷️ Petition Classification & Priority System',
    colCatName: 'Category Name',
    colSla: 'Default SLA (Days)',
    colDeptAssigned: 'Assigned Dept',
    loading: 'Loading settings data...',
  },
  MR: {
    title: 'वापरकर्ता व्यवस्थापन व सेटिंग्ज',
    subtitle: 'प्रणाली वापरकर्ते, रोल-बेस्ड ॲक्सेस परवानग्या, विभाग मार्गदर्शिका व व्हॉट्सॲप कॅलेंडर',
    addUser: 'नवीन वापरकर्ता जोडा',
    tabUsers: '⚙️ वापरकर्ता व्यवस्थापन',
    tabDepartments: '🏢 विभाग मार्गदर्शिका',
    tabGreetings: '🎂 सण व वाढदिवस कॅलेंडर',
    tabCategories: '🏷️ तक्रार वर्गवारी',
    secUsers: '⚙️ प्रणाली वापरकर्ते व मॉड्युल्स ॲक्सेस',
    colUser: 'वापरकर्त्याचे नाव व युझरनेम',
    colRole: 'रोल',
    colMobile: 'मोबाईल',
    colModules: 'ॲक्सेस असलेले मॉड्युल्स',
    colStatus: 'स्थिती',
    colActions: 'कृती',
    active: '🟢 सक्रिय',
    inactive: '🔴 निष्क्रिय',
    editModules: '✏️ मॉड्युल्स',
    resetPassword: '🔑 पासवर्ड',
    secDept: '🏢 शासन विभाग अधिकारी मार्गदर्शिका',
    colDept: 'विभाग नाव',
    colHead: 'प्रमुख अधिकारी नाव व पद',
    colContact: 'संपर्क क्रमांक',
    colEmail: 'ईमेल',
    secGreet: '🎂 सण व दिनविशेष शुभेच्छा संदेश कॅलेंडर',
    colOccasion: 'प्रसंग / सण',
    colDate: 'दिनांक',
    colTemplate: 'शुभेच्छा संदेश (WhatsApp Template)',
    secCat: '🏷️ तक्रार/निवेदन वर्गवारी रचना',
    colCatName: 'वर्गवारी नाव',
    colSla: 'SLA कालावधी (दिवस)',
    colDeptAssigned: 'संबंधित विभाग',
    loading: 'माहिती लोड होत आहे...',
  },
};

const UserManagementPage = () => {
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'ADMIN';
  const { lang } = useLangStore();
  const text = t[lang] || t.EN;

  const [activeTab, setActiveTab] = useState(isAdmin ? 'USERS' : 'DEPARTMENTS');
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

  return (
    <div className="inward-page-container">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="inward-page-header">
        <div className="title-group">
          <h1 className="page-title-mr">⚙️ {text.title}</h1>
          <p className="page-subtitle">{text.subtitle}</p>
        </div>

        {isAdmin && activeTab === 'USERS' && (
          <button className="create-inward-btn" onClick={() => setShowAddUserModal(true)}>
            <span>➕</span>
            <span>{text.addUser}</span>
          </button>
        )}
      </div>

      {/* ── Tab Switcher ────────────────────────────────────── */}
      <div className="status-tabs-container" style={{ marginBottom: '1.25rem' }}>
        {isAdmin && (
          <button
            className={`status-tab-btn ${activeTab === 'USERS' ? 'active' : ''}`}
            onClick={() => setActiveTab('USERS')}
          >
            {text.tabUsers}
          </button>
        )}
        <button
          className={`status-tab-btn ${activeTab === 'DEPARTMENTS' ? 'active' : ''}`}
          onClick={() => setActiveTab('DEPARTMENTS')}
        >
          {text.tabDepartments}
        </button>
        <button
          className={`status-tab-btn ${activeTab === 'GREETINGS' ? 'active' : ''}`}
          onClick={() => setActiveTab('GREETINGS')}
        >
          {text.tabGreetings}
        </button>
        <button
          className={`status-tab-btn ${activeTab === 'CATEGORIES' ? 'active' : ''}`}
          onClick={() => setActiveTab('CATEGORIES')}
        >
          {text.tabCategories}
        </button>
      </div>

      {/* ── Main Work Area ──────────────────────────────────── */}
      <div className="inward-table-card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div className="table-loading-box">
            <div className="mini-spinner"></div>
            <p>{text.loading}</p>
          </div>
        ) : (
          <>
            {/* 1. User Management (Admin Only) */}
            {activeTab === 'USERS' && isAdmin && (
              <div>
                <h3 className="settings-section-title">{text.secUsers}</h3>

                <div className="table-responsive">
                  <table className="inward-table">
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
                          <td className="col-sender">
                            <div className="sender-name-primary">{u.full_name}</div>
                            <div className="mobile-sub">👤 @{u.username}</div>
                          </td>
                          <td>
                            <span className="user-role-badge">{u.role}</span>
                          </td>
                          <td>📱 {u.mobile}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                              {(u.accessible_modules || []).map((m) => (
                                <span key={m} className="module-tag-chip">{m}</span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <button
                              className={`user-active-toggle-btn ${u.is_active ? 'active' : 'inactive'}`}
                              onClick={() => handleToggleActive(u.id)}
                            >
                              {u.is_active ? text.active : text.inactive}
                            </button>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                              <button
                                className="btn-secondary"
                                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                                onClick={() => openModuleEditor(u)}
                              >
                                {text.editModules}
                              </button>
                              <button
                                className="btn-secondary"
                                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#f87171' }}
                                onClick={() => handleResetPassword(u.id)}
                              >
                                {text.resetPassword}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. Department Directory */}
            {activeTab === 'DEPARTMENTS' && (
              <div>
                <h3 className="settings-section-title">{text.secDept}</h3>
                <div className="table-responsive">
                  <table className="inward-table">
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
                          <td className="sender-name-primary">🏢 {lang === 'MR' ? d.name_mr : d.name_en || d.name_mr}</td>
                          <td>{d.head_officer_name || '—'}</td>
                          <td>📱 {d.contact_number || '—'}</td>
                          <td>✉️ {d.email || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. WhatsApp Greeting Calendar */}
            {activeTab === 'GREETINGS' && (
              <div>
                <h3 className="settings-section-title">{text.secGreet}</h3>
                <div className="table-responsive">
                  <table className="inward-table">
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
                          <td className="sender-name-primary">🎉 {g.event_name}</td>
                          <td>📅 {g.event_date}</td>
                          <td style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{g.template_name}</td>
                          <td><span className="user-active-toggle-btn active">{text.active}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. Nivedan Categories */}
            {activeTab === 'CATEGORIES' && (
              <div>
                <h3 className="settings-section-title">{text.secCat}</h3>
                <div className="table-responsive">
                  <table className="inward-table">
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
                          <td className="sender-name-primary">🏷️ {c.name_mr}</td>
                          <td>{c.name_en}</td>
                          <td>{lang === 'MR' ? `विभाग #${c.default_department_id || 1}` : `Department #${c.default_department_id || 1}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Add User Modal ───────────────────────────────────── */}
      {showAddUserModal && (
        <div className="inward-modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="inward-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="inward-modal-header">
              <h3>➕ नवीन वापरकर्ता जोडा (Create System User)</h3>
              <button className="modal-close-btn" onClick={() => setShowAddUserModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="inward-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>युझरनेम (Username) <span className="req">*</span></label>
                  <input
                    type="text"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    placeholder="उदा. receptionist2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>वापरकर्त्याचे पूर्ण नाव (Full Name) <span className="req">*</span></label>
                  <input
                    type="text"
                    value={newUserForm.full_name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                    placeholder="उदा. राहुल शिंदे"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>रोल (Role) <span className="req">*</span></label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  >
                    <option value="PA">PA (पर्सनल असिस्टंट)</option>
                    <option value="RECEPTIONIST">RECEPTIONIST (रिसेप्सनिस्ट)</option>
                    <option value="AUDITOR">AUDITOR (ऑडिटर)</option>
                    <option value="ADMIN">ADMIN (प्रणाली व्यवस्थापक)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>मोबाईल क्रमांक (Mobile)</label>
                  <input
                    type="tel"
                    value={newUserForm.mobile}
                    onChange={(e) => setNewUserForm({ ...newUserForm, mobile: e.target.value })}
                    placeholder="98220XXXXX"
                  />
                </div>

                <div className="form-group col-span-2">
                  <label>सुरवातीचा पासवर्ड (Initial Password)</label>
                  <input
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="Pa@12345"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddUserModal(false)}>
                  रद्द करा
                </button>
                <button type="submit" className="btn-primary">
                  वापरकर्ता जोडा (Save User)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Accessible Modules Checkbox Modal ───────────────── */}
      {showModulesModal && selectedUserForModules && (
        <div className="inward-modal-overlay" onClick={() => setShowModulesModal(false)}>
          <div className="inward-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="inward-modal-header">
              <h3>✏️ मॉड्युल्स परवानग्या संपादक (Module Permissions)</h3>
              <button className="modal-close-btn" onClick={() => setShowModulesModal(false)}>✕</button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <p style={{ color: '#ff9933', fontWeight: 700, marginBottom: '1rem' }}>
                वापरकर्ता: {selectedUserForModules.full_name} ({selectedUserForModules.role})
              </p>

              <div className="modules-checkbox-grid">
                {MODULE_OPTIONS.map((m) => {
                  const isChecked = selectedModules.includes(m.id);
                  return (
                    <label key={m.id} className="module-checkbox-label">
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
                      <span>{m.labelMr}</span>
                    </label>
                  );
                })}
              </div>

              <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                <button className="btn-secondary" onClick={() => setShowModulesModal(false)}>
                  रद्द करा
                </button>
                <button className="btn-primary" onClick={handleSaveModules}>
                  💾 परवानग्या जतन करा (Save Permissions)
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
