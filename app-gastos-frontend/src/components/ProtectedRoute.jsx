import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from 'lucide-react';


export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  
  return <Outlet />;
};