import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
