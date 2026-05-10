import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export const SecurityLoading = () => (
  <div className="flex h-screen items-center justify-center bg-[#FBF9F4]">
    <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-[#2F4F4F]"></div>
  </div>
);

export const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}`;

  if (loading) return <SecurityLoading />;
  if (!session) return <Navigate to={redirectTo} replace state={{ from: returnTo }} />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}`;

  if (loading) return <SecurityLoading />;
  if (!session) return <Navigate to="/login" replace state={{ from: returnTo }} />;
  if (isAdmin === null) return <SecurityLoading />;
  if (!isAdmin) return <Navigate to="/discovery" replace />;
  return children;
};

export const GuestRoute = ({ children, redirectTo = '/' }) => {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();
  const returnTo = location.state?.from || redirectTo;
  const isRecoveryRoute = new URLSearchParams(location.search).get('recovery') === '1';

  if (loading) return <SecurityLoading />;
  if (isRecoveryRoute) return children;
  if (session) {
    if (isAdmin === null) return <SecurityLoading />;
    return <Navigate to={isAdmin ? '/archive' : returnTo} replace />;
  }
  return children;
};

