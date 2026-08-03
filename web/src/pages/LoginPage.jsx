// src/pages/LoginPage.jsx
// ============================================================
// MLA E-Office Login Page
// Modern Split-Screen Enterprise Design
// Reactive Multi-Language Support (English / Marathi)
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import './LoginPage.css';

// Translation Dictionary for English and Marathi
const t = {
  EN: {
    systemTitle: 'MLA E-Office',
    systemSubtitle: 'Digital Office Management System',
    systemSubtitleAlt: 'डिजिटल कार्यालय व्यवस्थापन प्रणाली',
    features: [
      'Paperless Inward/Outward Register',
      'Citizen Complaint Tracking (निवेदन)',
      'AI-Powered Letter Drafting',
      'WhatsApp Automation',
      'Development Works Monitoring',
      'Party Worker Network Management',
    ],
    welcomeHeading: 'Welcome back',
    welcomeSubheading: 'Sign in to your office account',
    usernameLabel: 'Username',
    usernameLabelAlt: '/ वापरकर्त्याचे नाव',
    usernamePlaceholder: 'rajesh.pa',
    passwordLabel: 'Password',
    passwordLabelAlt: '/ पासवर्ड',
    rememberMe: 'Remember me',
    loginBtn: 'Login',
    loginBtnSubmitting: 'Signing in...',
    forgotPassword: 'Forgot Password?',
    forgotPasswordAlert: 'Please contact the administrator to reset your password.',
    errUsername: 'Please enter your username',
    errPassword: 'Please enter your password',
    err401: 'Invalid username or password',
    err403: 'This account is inactive. Please contact system administrator.',
    err423: 'Account is temporarily locked. Please try again after 15 minutes.',
    errServer: 'Unable to connect to server. Please try again.',
    copyright: `© ${new Date().getFullYear()} MLA E-Office. All Rights Reserved.`,
    showPw: 'Show password',
    hidePw: 'Hide password',
  },
  MR: {
    systemTitle: 'एमएलए ई-ऑफिस',
    systemSubtitle: 'डिजिटल कार्यालय व्यवस्थापन प्रणाली',
    systemSubtitleAlt: 'Digital Office Management System',
    features: [
      'कागदविरहित आवक-जावक नोंदवही',
      'नागरिक तक्रार निवारण (निवेदन)',
      'AI-समर्थित पत्र लेखन',
      'व्हॉट्सॲप स्वयंचलितीकरण',
      'विकास कामे देखरेख',
      'कार्यकर्ता नेटवर्क व्यवस्थापन',
    ],
    welcomeHeading: 'पुन्हा स्वागत आहे',
    welcomeSubheading: 'आपल्या खात्यात साइन इन करा',
    usernameLabel: 'वापरकर्त्याचे नाव',
    usernameLabelAlt: '/ Username',
    usernamePlaceholder: 'उदा. rajesh.pa',
    passwordLabel: 'पासवर्ड',
    passwordLabelAlt: '/ Password',
    rememberMe: 'लक्षात ठेवा',
    loginBtn: 'लॉगिन करा',
    loginBtnSubmitting: 'प्रवेश होत आहे...',
    forgotPassword: 'पासवर्ड विसरलात?',
    forgotPasswordAlert: 'कृपया पासवर्ड रीसेट करण्यासाठी प्रशासकाशी संपर्क साधा.',
    errUsername: 'कृपया वापरकर्तानाव प्रविष्ट करा',
    errPassword: 'कृपया पासवर्ड प्रविष्ट करा',
    err401: 'चुकीचे वापरकर्तानाव किंवा पासवर्ड',
    err403: 'हे खाते निष्क्रिय आहे. प्रशासकाशी संपर्क करा.',
    err423: 'खाते तात्पुरते बंद आहे. १५ मिनिटांनंतर पुन्हा प्रयत्न करा.',
    errServer: 'सर्व्हरशी संपर्क होत नाही. पुन्हा प्रयत्न करा.',
    copyright: `© ${new Date().getFullYear()} एमएलए ई-ऑफिस. सर्व हक्क सुरक्षित.`,
    showPw: 'पासवर्ड दाखवा',
    hidePw: 'पासवर्ड लपवा',
  },
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuthStore();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('mla_theme') || 'light');
  const [lang, setLang] = useState(() => localStorage.getItem('mla_lang') || 'EN');
  const [errorKey, setErrorKey] = useState('');
  const [customError, setCustomError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active translation dictionary based on selected language
  const text = t[lang] || t.EN;

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
    setErrorKey('');
    setCustomError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) {
      setErrorKey('errUsername');
      return;
    }
    if (!form.password) {
      setErrorKey('errPassword');
      return;
    }

    setIsSubmitting(true);
    setErrorKey('');
    setCustomError('');

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
        setErrorKey('err401');
      } else if (status === 403) {
        setErrorKey('err403');
      } else if (status === 423) {
        if (msg) {
          setCustomError(msg);
        } else {
          setErrorKey('err423');
        }
      } else {
        setErrorKey('errServer');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resolve current active error message
  const activeError = customError || (errorKey ? text[errorKey] : '');

  return (
    <div className="login-page-wrapper">
      {/* ── Segmented Pill Controls (Top Right Header) ── */}
      <div className="toggle-container--v1">
        {/* Theme Switch */}
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

        {/* Language Switch */}
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
      </div>

      <div className="login-container">
        {/* ── Left Branding Panel ── */}
        <div className="login-branding">
          <div className="branding-icon" aria-label="Government Emblem">🏛️</div>
          <h1 className="branding-title">{text.systemTitle}</h1>
          <p className="branding-subtitle">{text.systemSubtitle}</p>
          <p className="branding-marathi">{text.systemSubtitleAlt}</p>

          <ul className="branding-features">
            {text.features.map((feature, idx) => (
              <li key={idx}>
                <span className="dot" /> {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right Login Form Panel ── */}
        <div className="login-form-panel">
          <div className="login-card" role="main">
            {/* Welcome Section */}
            <h2 className="login-heading">{text.welcomeHeading}</h2>
            <p className="login-subheading">
              {text.welcomeSubheading}
            </p>

            {/* Error alert */}
            {activeError && (
              <div className="login-error-alert" role="alert" aria-live="assertive">
                <span className="error-icon">⚠️</span>
                <span>{activeError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              {/* Username */}
              <div className="form-group">
                <label htmlFor="login-username" className="form-label">
                  {text.usernameLabel} <span className="mr">{text.usernameLabelAlt}</span>
                </label>
                <input
                  id="login-username"
                  type="text"
                  name="username"
                  className={`form-input${activeError ? ' form-input--error' : ''}`}
                  placeholder={text.usernamePlaceholder}
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
                  {text.passwordLabel} <span className="mr">{text.passwordLabelAlt}</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`form-input${activeError ? ' form-input--error' : ''}`}
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
                    aria-label={showPassword ? text.hidePw : text.showPw}
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
                <label htmlFor="remember">{text.rememberMe}</label>
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
                    {text.loginBtnSubmitting}
                  </>
                ) : (
                  text.loginBtn
                )}
              </button>

              {/* Forgot Password */}
              <div className="form-footer">
                <button
                  type="button"
                  onClick={() => alert(text.forgotPasswordAlert)}
                >
                  {text.forgotPassword}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="login-copyright">
            {text.copyright}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
