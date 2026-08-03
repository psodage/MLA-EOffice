// src/pages/settings/UserManagementPage.jsx
// ============================================================
// User Management & Office Settings Page — Module 14
// RBAC User administration, Accessible Modules Editor, Soft Deactivation, & Directory Settings
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import useAuthStore from '../../store/authStore.js';
import './UserManagementPage.css';

const MODULE_OPTIONS = [
  { id: 'inward', labelMr: '📫 आवक नोंदवही (Inward Register)' },
  { id: 'outward', labelMr: '📤 जावक नोंदवही (Outward Register)' },
  { id: 'nivedan', labelMr: '📋 तक्रार निवारण (Nivedan / Petitions)' },
  { id: 'visitor', labelMr: '👥 नागरिक भेट (Visitor Book)' },
  { id: 'devworks', labelMr: '🏗️ विकासकामे (Development Works)' },
  { id: 'karyakarta', labelMr: '🚩 कार्यकर्ता नोंदवही (Karyakarta Directory)' },
  { id: 'calendar', labelMr: '📅 दिनदर्शिका (Calendar & Schedule)' },
  { id: 'reports', labelMr: '📊 अहवाल व विश्लेषण (Reports & Analytics)' },
];

const UserManagementPage = () => {
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'ADMIN';

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
          <h1 className="page-title-mr">⚙️ वापरकर्ता व्यवस्थापन व सेटिंग्ज (Settings)</h1>
          <p className="page-subtitle">
            प्रणाली वापरकर्ते, रोल-बेस्ड ॲक्सेस परवानग्या, विभाग मार्गदर्शिका व व्हॉट्सॲप कॅलेंडर
          </p>
        </div>

        {isAdmin && activeTab === 'USERS' && (
          <button className="create-inward-btn" onClick={() => setShowAddUserModal(true)}>
            <span>➕</span>
            <span>नवीन वापरकर्ता जोडा (Add User)</span>
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
            ⚙️ वापरकर्ता व्यवस्थापन (Users)
          </button>
        )}
        <button
          className={`status-tab-btn ${activeTab === 'DEPARTMENTS' ? 'active' : ''}`}
          onClick={() => setActiveTab('DEPARTMENTS')}
        >
          🏢 विभाग मार्गदर्शिका (Departments)
        </button>
        <button
          className={`status-tab-btn ${activeTab === 'GREETINGS' ? 'active' : ''}`}
          onClick={() => setActiveTab('GREETINGS')}
        >
          🎂 सण व वाढदिवस कॅलेंडर (Greetings)
        </button>
        <button
          className={`status-tab-btn ${activeTab === 'CATEGORIES' ? 'active' : ''}`}
          onClick={() => setActiveTab('CATEGORIES')}
        >
          🏷️ तक्रार वर्गवारी (Categories)
        </button>
      </div>

      {/* ── Main Work Area ──────────────────────────────────── */}
      <div className="inward-table-card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div className="table-loading-box">
            <div className="mini-spinner"></div>
            <p>माहिती लोड होत आहे...</p>
          </div>
        ) : (
          <>
            {/* 1. User Management (Admin Only) */}
            {activeTab === 'USERS' && isAdmin && (
              <div>
                <h3 className="settings-section-title">⚙️ प्रणाली वापरकर्ते व मॉड्युल्स ॲक्सेस (User Administration)</h3>

                <div className="table-responsive">
                  <table className="inward-table">
                    <thead>
                      <tr>
                        <th>वापरकर्त्याचे नाव व युझरनेम (User)</th>
                        <th>रोल (Role)</th>
                        <th>मोबाईल (Mobile)</th>
                        <th>ॲक्सेस असलेले मॉड्युल्स (Accessible Modules)</th>
                        <th>स्टेटस (Status)</th>
                        <th style={{ textAlign: 'right' }}>कृती (Actions)</th>
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
                              {u.is_active ? '🟢 सक्रिय (Active)' : '🔴 निष्क्रिय (Inactive)'}
                            </button>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                              <button
                                className="btn-secondary"
                                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                                onClick={() => openModuleEditor(u)}
                              >
                                ✏️ मॉड्युल्स
                              </button>
                              <button
                                className="btn-secondary"
                                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#f87171' }}
                                onClick={() => handleResetPassword(u.id)}
                              >
                                🔑 पासवर्ड
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
                <h3 className="settings-section-title">🏢 शासन विभाग अधिकारी मार्गदर्शिका (Department Directory)</h3>
                <div className="table-responsive">
                  <table className="inward-table">
                    <thead>
                      <tr>
                        <th>विभाग नाव (Department)</th>
                        <th>प्रमुख अधिकारी नाव व पद (Head Officer)</th>
                        <th>संपर्क क्रमांक (Contact Mobile)</th>
                        <th>ईमेल (Email)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((d) => (
                        <tr key={d.id}>
                          <td className="sender-name-primary">🏢 {d.name_mr}</td>
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
                <h3 className="settings-section-title">🎂 सण व दिनविशेष व्हॉट्सॲप कॅलेंडर (Greeting Calendar)</h3>
                <div className="table-responsive">
                  <table className="inward-table">
                    <thead>
                      <tr>
                        <th>सण / दिनविशेष (Festival Event)</th>
                        <th>तारीख (Event Date)</th>
                        <th>टेम्प्लेट कोड (WABA Template)</th>
                        <th>स्टेटस (Status)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {greetings.map((g) => (
                        <tr key={g.id}>
                          <td className="sender-name-primary">🎉 {g.event_name}</td>
                          <td>📅 {g.event_date}</td>
                          <td style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{g.template_name}</td>
                          <td><span className="user-active-toggle-btn active">🟢 सक्रिय</span></td>
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
                <h3 className="settings-section-title">🏷️ तक्रार निवारण वर्गवारी सूची (Nivedan Categories)</h3>
                <div className="table-responsive">
                  <table className="inward-table">
                    <thead>
                      <tr>
                        <th>वर्गवारी नाव (Marathi Name)</th>
                        <th>English Name</th>
                        <th>डिफॉल्ट विभाग (Default Dept ID)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c) => (
                        <tr key={c.id}>
                          <td className="sender-name-primary">🏷️ {c.name_mr}</td>
                          <td>{c.name_en}</td>
                          <td>विभाग #{c.default_department_id || 1}</td>
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
