import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContent } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AppContent);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
