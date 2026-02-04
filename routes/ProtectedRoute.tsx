
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10"><Loader /></div>;

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
