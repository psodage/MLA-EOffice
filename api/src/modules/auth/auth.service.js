// src/modules/auth/auth.service.js
// ============================================================
// Authentication business logic — login, token generation,
// refresh, lockout detection, login history recording.
// ============================================================

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../../config/env.config.js';
import User from '../../models/User.js';
import sequelize from '../../config/database.js';

const { Op } = sequelize.Sequelize;

/**
 * Safely parse accessible_modules — handles both string and array
 * (MySQL JSON column via bulkInsert sometimes stores as string)
 */
const parseModules = (modules) => {
  if (Array.isArray(modules)) return modules;
  if (typeof modules === 'string') {
    try { return JSON.parse(modules); } catch { return []; }
  }
  return [];
};

// ── Token Generation ─────────────────────────────────────────

/**
 * Generate a JWT access token (24h by default)
 * Payload: userId, username, role, modules
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
      modules: parseModules(user.accessible_modules),
    },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpiry }
  );
};

/**
 * Generate a JWT refresh token (7d by default)
 * Payload: userId, tokenVersion
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      tokenVersion: user.token_version,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiry }
  );
};

// ── Cookie Helpers ───────────────────────────────────────────

/**
 * Set refresh token as httpOnly secure cookie
 */
export const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.app.isProduction,      // HTTPS only in production
    sameSite: config.app.isProduction ? 'Strict' : 'Lax', // Lax in dev for cross-port
    path: '/api/v1/auth',                 // Only sent to auth endpoints
    maxAge: 7 * 24 * 60 * 60 * 1000,     // 7 days
  });
};

/**
 * Clear the refresh token cookie
 */
export const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.app.isProduction,
    sameSite: config.app.isProduction ? 'Strict' : 'Lax',
    path: '/api/v1/auth',
  });
};

// ── Lockout Check ────────────────────────────────────────────

/**
 * Check if the user account is locked due to failed login attempts
 * @returns {{ isLocked: boolean, minutesRemaining: number }}
 */
export const checkLockout = (user) => {
  const maxAttempts = config.rateLimit.loginMax;        // 5
  const lockoutMin = config.rateLimit.lockoutMin;       // 15

  if (user.failed_login_count < maxAttempts) {
    return { isLocked: false, minutesRemaining: 0 };
  }

  if (!user.last_failed_login_at) {
    return { isLocked: false, minutesRemaining: 0 };
  }

  const lockoutEnd = new Date(user.last_failed_login_at.getTime() + lockoutMin * 60 * 1000);
  const now = new Date();

  if (now < lockoutEnd) {
    const minutesRemaining = Math.ceil((lockoutEnd - now) / 60000);
    return { isLocked: true, minutesRemaining };
  }

  return { isLocked: false, minutesRemaining: 0 };
};

// ── Core Login Logic ─────────────────────────────────────────

/**
 * Authenticate user by username + password
 * @returns {{ user, accessToken, refreshToken, mustChangePassword }}
 */
export const authenticateUser = async (username, password, ip, userAgent) => {
  // 1. Find user (include password_hash via scope)
  const user = await User.scope('withPassword').findOne({
    where: { username },
  });

  if (!user) {
    throw Object.assign(new Error('Invalid username or password'), { statusCode: 401 });
  }

  // 2. Check if account is active
  if (!user.is_active) {
    throw Object.assign(new Error('Account is inactive. Contact the administrator.'), { statusCode: 403 });
  }

  // 3. Check lockout
  const lockout = checkLockout(user);
  if (lockout.isLocked) {
    await recordLoginAttempt(user.id, ip, userAgent, false);
    throw Object.assign(
      new Error(`Account locked. Try again after ${lockout.minutesRemaining} minutes.`),
      { statusCode: 423 }
    );
  }

  // 4. Verify password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    // Increment failed count
    await user.update({
      failed_login_count: user.failed_login_count + 1,
      last_failed_login_at: new Date(),
    });
    await recordLoginAttempt(user.id, ip, userAgent, false);

    // Log failed attempt to audit_logs
    await logAuditAction(user.id, 'LOGIN_FAILED', ip, userAgent);

    throw Object.assign(new Error('Invalid username or password'), { statusCode: 401 });
  }

  // 5. Check if password change is required (first login or 90-day rotation)
  const mustChangePassword = !user.password_changed_at || isPasswordExpired(user.password_changed_at);

  // 6. Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // 7. Update user record — reset failed count, store refresh token, update login info
  await user.update({
    refresh_token: refreshToken,
    failed_login_count: 0,
    last_login_at: new Date(),
    last_login_ip: ip,
  });

  // 8. Record login history + audit log
  await recordLoginAttempt(user.id, ip, userAgent, true);
  await logAuditAction(user.id, 'LOGIN', ip, userAgent);

  // 9. Return sanitized user data (no password_hash)
  const userData = {
    id: user.id,
    full_name: user.full_name,
    username: user.username,
    role: user.role,
    mobile: user.mobile,
    email: user.email,
    profile_photo_url: user.profile_photo_url,
    accessible_modules: parseModules(user.accessible_modules),
  };

  return { user: userData, accessToken, refreshToken, mustChangePassword };
};

// ── Refresh Token Logic ──────────────────────────────────────

/**
 * Verify refresh token and issue new access token
 */
export const refreshAccessToken = async (refreshTokenValue) => {
  if (!refreshTokenValue) {
    throw Object.assign(new Error('Refresh token not provided'), { statusCode: 401 });
  }

  // 1. Verify JWT
  let decoded;
  try {
    decoded = jwt.verify(refreshTokenValue, config.jwt.secret);
  } catch {
    throw Object.assign(new Error('Refresh token is invalid or expired'), { statusCode: 401 });
  }

  // 2. Find user
  const user = await User.findByPk(decoded.userId);
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 401 });
  }

  // 3. Check active
  if (!user.is_active) {
    throw Object.assign(new Error('Account is inactive'), { statusCode: 403 });
  }

  // 4. Check token_version (invalidated by password change)
  if (decoded.tokenVersion !== user.token_version) {
    throw Object.assign(new Error('Refresh token has been revoked'), { statusCode: 401 });
  }

  // 5. Generate new access token
  const accessToken = generateAccessToken(user);

  const userData = {
    id: user.id,
    full_name: user.full_name,
    username: user.username,
    role: user.role,
    mobile: user.mobile,
    email: user.email,
    profile_photo_url: user.profile_photo_url,
    accessible_modules: user.accessible_modules,
  };

  return { user: userData, accessToken };
};

// ── Logout ───────────────────────────────────────────────────

/**
 * Clear refresh token from DB
 */
export const logoutUser = async (userId, ip, userAgent) => {
  await User.update(
    { refresh_token: null },
    { where: { id: userId } }
  );
  await logAuditAction(userId, 'LOGOUT', ip, userAgent);
};

// ── Helpers ──────────────────────────────────────────────────

/**
 * Check if password is older than 90 days
 */
const isPasswordExpired = (passwordChangedAt) => {
  if (!passwordChangedAt) return true;
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  return new Date(passwordChangedAt) < ninetyDaysAgo;
};

/**
 * Parse user agent string into device_type and browser
 */
const parseUserAgent = (ua) => {
  if (!ua) return { deviceType: null, browser: null };

  let deviceType = 'DESKTOP';
  if (/mobile|android|iphone|ipad/i.test(ua)) {
    deviceType = /ipad|tablet/i.test(ua) ? 'TABLET' : 'MOBILE';
  }

  let browser = 'Unknown';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/chrome/i.test(ua)) browser = 'Chrome';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  return { deviceType, browser };
};

/**
 * Record a login attempt in login_history table
 */
const recordLoginAttempt = async (userId, ip, userAgent, isSuccessful) => {
  const { deviceType, browser } = parseUserAgent(userAgent);
  try {
    await sequelize.query(
      `INSERT INTO login_history (user_id, ip_address, user_agent, device_type, browser, is_successful, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      {
        replacements: [userId, ip || null, userAgent || null, deviceType, browser, isSuccessful],
        type: sequelize.Sequelize.QueryTypes.INSERT,
      }
    );
  } catch (err) {
    console.error('Failed to record login attempt:', err.message);
  }
};

/**
 * Record an audit log entry
 */
const logAuditAction = async (userId, action, ip, userAgent) => {
  try {
    await sequelize.query(
      `INSERT INTO audit_logs (user_id, action, module, entity_type, ip_address, user_agent, created_at)
       VALUES (?, ?, 'auth', 'user', ?, ?, NOW())`,
      {
        replacements: [userId, action, ip || null, userAgent || null],
        type: sequelize.Sequelize.QueryTypes.INSERT,
      }
    );
  } catch (err) {
    console.error('Failed to record audit log:', err.message);
  }
};
