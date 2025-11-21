import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from 'lucide-react';


export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Si está cargando (verificando el token), mostramos un spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  // Si terminó de cargar y NO está autenticado, lo redirigimos al login
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza la página hija (ej: Dashboard)
  // 'Outlet' es un placeholder de react-router-dom para el componente hijo
  return <Outlet />;
};