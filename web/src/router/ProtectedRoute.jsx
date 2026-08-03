// src/router/ProtectedRoute.jsx
// ============================================================
// Route guard component — redirects unauthenticated users.
// Usage:
//   <ProtectedRoute module="nivedan">
//     <NivedanListPage />
//   </ProtectedRoute>
// ============================================================

import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import { usePermission } from '../hooks/usePermission.js';

const ProtectedRoute = ({ children, module = null, roles = null }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { canAccess, isRole } = usePermission();
  const location = useLocation();

  // Show nothing while initial auth check is running
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0a0f1e',
        color: '#38bdf8',
        fontSize: '1.1rem',
        gap: '0.75rem',
      }}>
        <span style={{ fontSize: '1.5rem', animation: 'spin 1s linear infinite' }}>⟳</span>
        लोड होत आहे...
      </div>
    );
  }

  // Not logged in → redirect to login, remember where they were
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Must change password → redirect to change-password page
  if (user?.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  // Specific role check
  if (roles && !isRole(...roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Module access check
  if (module && !canAccess(module)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
