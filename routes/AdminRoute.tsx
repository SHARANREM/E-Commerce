
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const AdminRoute: React.FC = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div className="p-10"><Loader /></div>;

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
