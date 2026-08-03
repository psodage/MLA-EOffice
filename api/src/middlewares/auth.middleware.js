// src/middlewares/auth.middleware.js
// ============================================================
// JWT verification middleware.
// Extracts Bearer token from Authorization header,
// verifies it, and attaches decoded user to req.user.
// ============================================================

import jwt from 'jsonwebtoken';
import config from '../config/env.config.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
      modules: decoded.modules || [],
    };
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Access token has expired'
      : 'Invalid access token';

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

export default authMiddleware;
