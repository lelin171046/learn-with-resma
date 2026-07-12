import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import LoadingSpinner from './LoadingSpinner';

export default function AdminRoute() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;
  if (!user || !isAdmin) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
