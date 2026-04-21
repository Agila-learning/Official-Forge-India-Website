import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    const token = localStorage.getItem('token');

    if (!userInfo || !token) {
        // Redirect to login if unauthenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
        // Redirect to home if authorized but with wrong role
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
