// src/middlewares/rbac.middleware.js
// ============================================================
// Role-Based Access Control middleware.
// Checks if the authenticated user's role is in the allowed list.
// Must be used AFTER auth.middleware.js in the chain.
// ============================================================

/**
 * Factory function — returns middleware that checks user role
 * @param {...string} allowedRoles - Roles that can access this route
 * @returns {import('express').RequestHandler}
 *
 * Usage:
 *   router.post('/nivedans', auth, authorize('PA', 'RECEPTIONIST'), controller.create);
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

export default authorize;
