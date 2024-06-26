// app/client/PeerGrade/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '@/utils/redux/selectors/userSelectors';
import { useSelector } from 'react-redux'; // Assuming you're using redux for state management

const ProtectedRoute = ({ children, requiredRoles }) => {
  const location = useLocation();
  const currentUser = useSelector(getCurrentUser);
  const isAuthenticated = Boolean(currentUser); // Assuming `currentUser` is null when not authenticated

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (requiredRoles && !requiredRoles.includes(currentUser.role)) {
    // Redirect to unauthorized page if user doesn't have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;