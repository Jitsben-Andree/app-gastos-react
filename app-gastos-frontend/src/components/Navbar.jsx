import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Wallet, PlusCircle, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('¡Has cerrado sesión!');
  };

  return (
    <nav className="bg-white/90 dark:bg-dark/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          to={isAuthenticated ? "/dashboard" : "/"} 
          className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-white"
        >
          {/* Icono verde como en tu foto */}
          <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-full">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          Registro de Gastos
        </Link>
        
        <ul className="flex items-center gap-4 md:gap-6">
          {isAuthenticated ? (
            <>
              <li className="text-gray-600 dark:text-gray-300 hidden sm:block">
                Hola, {user?.nombre}
              </li>
              
              
              {/* Botón Nuevo Ingreso */}
              <li>
                <Link
                  to="/ingresos/new"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                  title="Añadir Ingreso"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="hidden md:block">Nuevo Ingreso</span>
                </Link>
              </li>
              {/* Botón Nuevo Gasto */}
              <li>
                <Link
                  to="/gastos/new"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-secondary"
                  title="Añadir Gasto"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span className="hidden md:block">Nuevo Gasto</span>
                </Link>
              </li>
              

              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-danger"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar sesión
                </button>
              </li>
            </>
          ) : (
            // ... (links de login/register )
            <>
              <li>
                <Link to="/login" className="text-gray-700 hover:text-primary font-medium">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-green-600">
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}