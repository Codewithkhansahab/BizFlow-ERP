import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContent } from '../context/AppContext';

const RoleRoute = ({ roles = [], children }) => {
  const { isLoggedIn, userData } = useContext(AppContent);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // If userData is missing or role not allowed, redirect to their default dashboard or login
  const userRole = userData?.role;
  if (!userRole || (roles.length > 0 && !roles.includes(userRole))) {
    // Redirect to their own dashboard if logged in with different role
    const defaultPath = userRole
      ? `/${userRole.toLowerCase()}`
      : '/login';
    return <Navigate to={defaultPath} replace />;
  }

  return children;
};

export default RoleRoute;
