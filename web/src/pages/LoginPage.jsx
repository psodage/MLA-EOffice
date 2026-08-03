// src/pages/LoginPage.jsx
// ============================================================
// MLA E-Office Login Page
// Marathi-first, premium dark glassmorphism UI
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
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="login-page">
      {/* ── Animated Background ── */}
      <div className="login-bg" aria-hidden="true">
        <div className="login-bg__grid" />
        <div className="login-bg__orb login-bg__orb--1" />
        <div className="login-bg__orb login-bg__orb--2" />
        <div className="login-bg__orb login-bg__orb--3" />
      </div>

      {/* ── Login Card ── */}
      <div className="login-card" role="main">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo__emblem" aria-label="MLA E-Office emblem">
            🏛️
          </div>
          <h1 className="login-logo__title-mr">एमएलए ई-ऑफिस</h1>
          <p className="login-logo__title-en">MLA E-OFFICE MANAGEMENT SYSTEM</p>
          <div className="login-logo__divider" />
        </div>

        <p className="login-form-title">
          आपल्या खात्यात प्रवेश करा
        </p>

        {/* Error message */}
        {error && (
          <div className="login-error" role="alert" aria-live="assertive">
            <span className="login-error__icon">⚠️</span>
            <span className="login-error__text">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          {/* Username */}
          <div className="login-field">
            <label htmlFor="login-username" className="login-label">
              <span className="login-label__mr">वापरकर्तानाव</span>
              <span>/ Username</span>
            </label>
            <div className="login-input-wrapper">
              <input
                id="login-username"
                type="text"
                name="username"
                className={`login-input${error ? ' login-input--error' : ''}`}
                placeholder="उदा. pa_suresh"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                spellCheck="false"
                autoCapitalize="none"
                disabled={isSubmitting}
                aria-required="true"
              />
              <span className="login-input-icon" aria-hidden="true">👤</span>
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="login-password" className="login-label">
              <span className="login-label__mr">पासवर्ड</span>
              <span>/ Password</span>
            </label>
            <div className="login-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`login-input login-input--pw${error ? ' login-input--error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={isSubmitting}
                aria-required="true"
              />
              <span className="login-input-icon" aria-hidden="true">🔒</span>
              <button
                type="button"
                className="login-pw-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'पासवर्ड लपवा' : 'पासवर्ड दाखवा'}
                tabIndex={0}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            className="login-btn"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="login-spinner" aria-hidden="true" />
                प्रवेश होत आहे...
              </>
            ) : (
              <>
                <span aria-hidden="true">→</span>
                प्रवेश करा
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <footer className="login-footer">
          <p>पासवर्ड विसरलात? प्रशासकाशी संपर्क करा.</p>
          <p style={{ marginTop: '0.4rem', opacity: 0.5, fontSize: '0.7rem' }}>
            © {new Date().getFullYear()} MLA E-Office · Maharashtra
          </p>
        </footer>

        {/* Tricolor bottom border */}
        <div className="login-tricolor" aria-hidden="true" />
      </div>
    </div>
  );
};

export default LoginPage;
