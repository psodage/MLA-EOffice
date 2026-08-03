// src/pages/LoginPage.jsx
// ============================================================
// MLA E-Office Login Page
// Modern Split-Screen Enterprise Design
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuthStore();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('mla_theme') || 'light');
  const [lang, setLang] = useState(() => localStorage.getItem('mla_lang') || 'EN');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync theme attribute on documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mla_theme', theme);
  }, [theme]);

  // Sync language selection
  useEffect(() => {
    localStorage.setItem('mla_lang', lang);
  }, [lang]);

  // Load remembered username if present
  useEffect(() => {
    const savedUser = localStorage.getItem('mla_remembered_username');
    if (savedUser) {
      setForm((prev) => ({ ...prev, username: savedUser }));
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) {
      setError('कृपया वापरकर्तानाव प्रविष्ट करा');
      return;
    }
    if (!form.password) {
      setError('कृपया पासवर्ड प्रविष्ट करा');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (rememberMe) {
        localStorage.setItem('mla_remembered_username', form.username.trim());
      } else {
        localStorage.removeItem('mla_remembered_username');
      }

      const result = await login(form.username.trim(), form.password);

      if (result?.mustChangePassword) {
        navigate('/change-password', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 401) {
        setError('चुकीचे वापरकर्तानाव किंवा पासवर्ड');
      } else if (status === 403) {
        setError('हे खाते निष्क्रिय आहे. प्रशासकाशी संपर्क करा.');
      } else if (status === 423) {
        setError(msg || 'खाते तात्पुरते बंद आहे. १५ मिनिटांनंतर पुन्हा प्रयत्न करा.');
      } else {
        setError('सर्व्हरशी संपर्क होत नाही. पुन्हा प्रयत्न करा.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* ── Theme Toggle (Top Right) ── */}
      <div className="theme-toggle">
        <button
          type="button"
          className={theme === 'light' ? 'active' : ''}
          onClick={() => setTheme('light')}
          aria-label="Light Theme"
        >
          <span>☀</span> Light
        </button>
        <button
          type="button"
          className={theme === 'dark' ? 'active' : ''}
          onClick={() => setTheme('dark')}
          aria-label="Dark Theme"
        >
          <span>🌙</span> Dark
        </button>
      </div>

      <div className="login-container">
        {/* ── Left Branding Panel ── */}
        <div className="login-branding">
          <div className="branding-icon" aria-label="Government Emblem">🏛️</div>
          <h1 className="branding-title">MLA E-Office</h1>
          <p className="branding-subtitle">Digital Office Management System</p>
          <p className="branding-marathi">डिजिटल कार्यालय व्यवस्थापन प्रणाली</p>

          <ul className="branding-features">
            <li><span className="dot" /> Paperless Inward/Outward Register</li>
            <li><span className="dot" /> Citizen Complaint Tracking (निवेदन)</li>
            <li><span className="dot" /> AI-Powered Letter Drafting</li>
            <li><span className="dot" /> WhatsApp Automation</li>
            <li><span className="dot" /> Development Works Monitoring</li>
            <li><span className="dot" /> Party Worker Network Management</li>
          </ul>
        </div>

        {/* ── Right Login Form Panel ── */}
        <div className="login-form-panel">
          <div className="login-card" role="main">
            {/* Language Switcher */}
            <div className="lang-toggle">
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

            {/* Welcome Section */}
            <h2 className="login-heading">Welcome back</h2>
            <p className="login-subheading">
              Sign in to your office account <span>· आपल्या खात्यात साइन इन करा</span>
            </p>

            {/* Error alert */}
            {error && (
              <div className="login-error-alert" role="alert" aria-live="assertive">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              {/* Username */}
              <div className="form-group">
                <label htmlFor="login-username" className="form-label">
                  Username <span className="mr">/ वापरकर्त्याचे नाव</span>
                </label>
                <input
                  id="login-username"
                  type="text"
                  name="username"
                  className={`form-input${error ? ' form-input--error' : ''}`}
                  placeholder="rajesh.pa"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  spellCheck="false"
                  autoCapitalize="none"
                  disabled={isSubmitting}
                  aria-required="true"
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="login-password" className="form-label">
                  Password <span className="mr">/ पासवर्ड</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`form-input${error ? ' form-input--error' : ''}`}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    aria-required="true"
                  />
                  <button
                    type="button"
                    className="eye-icon"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="form-check">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me / लक्षात ठेवा</label>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit-btn"
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="login-spinner-icon" aria-hidden="true" />
                    प्रवेश होत आहे...
                  </>
                ) : (
                  'Login · लॉगिन'
                )}
              </button>

              {/* Forgot Password */}
              <div className="form-footer">
                <button
                  type="button"
                  onClick={() => alert('कृपया पासवर्ड रीसेट करण्यासाठी प्रशासकाशी संपर्क साधा.')}
                >
                  Forgot Password? / पासवर्ड विसरलात?
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="login-copyright">
            © {new Date().getFullYear()} MLA E-Office. All Rights Reserved.
          </div>
        </div>
      </div>


    </div>
  );
};

export default LoginPage;
