import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const DashboardRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    const location = useLocation();

    if (token !== null) {
        if (location.pathname !== '/dashboard') {
            return <Navigate to="/dashboard" replace />;
        }
        return children;
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
}

export default DashboardRoute;