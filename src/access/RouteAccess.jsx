import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useLoader } from '../context/LoaderContext';

export const RouteAccess = ({ children }) => {
    const { user, loading } = useAuth();
    const { loading: isLoading } = useLoader()

    if (loading) return isLoading;

    if (!user) return <Navigate to="/login" />

    return children;
};

export const RestrictedRoute = ({ children }) => {
    const { user, loading } = useAuth();
        const { loading: isLoading } = useLoader()


    if (loading) return isLoading;

    if (user) return null; 

    return children;
};


