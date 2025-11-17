import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, BarChart3 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { signin, errors: authErrors, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await signin({ correo, contrasena });
    
    if (user) {
      toast.success(`¡Bienvenido de vuelta, ${user.nombre}!`);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0 md:m-0">
        
        {/* Lado Derecho (Formulario) */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-2 text-4xl font-bold text-gray-800">Bienvenido</span> {/* CAMBIO: Añadido 'text-gray-800' */}
          <span className="text-lg text-gray-500 mb-8">
            Inicia sesión para gestionar tus finanzas
          </span>
          
          {authErrors && authErrors.length > 0 && (
            <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
              {authErrors.map((error, i) => (
                <p key={i}>{error}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* --- CAMPO CORREO --- */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2" /* CAMBIO: 'text-gray-700' y quitado 'dark:' */
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="tu@correo.com" /* Placeholder real */
                  className="" /* Quitamos 'pt-6 peer' */
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* --- CAMPO CONTRASEÑA --- */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2" /* CAMBIO: 'text-gray-700' y quitado 'dark:' */
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  required
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••" /* Placeholder real */
                  className="" /* Quitamos 'pt-6 peer' */
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:bg-gray-400"
              >
                <LogIn className="w-5 h-5 mr-2" />
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <p className="text-sm text-center text-gray-600 mt-8">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="btn-link font-semibold">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Lado Izquierdo (Branding) */}
        <div className="relative hidden lg:flex flex-col justify-center items-center w-[400px] bg-gradient-to-b from-primary to-indigo-600 rounded-r-2xl p-10 text-white">
          {/* <div className="absolute inset-0 bg-black opacity-20 rounded-r-2xl"></div>  <- Eliminamos este overlay */}
          <div className="z-10 text-center">
            <BarChart3 className="w-24 h-24 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">AppGastos</h2>
            <p className="text-lg font-light">
              Toma el control de tu dinero. De forma simple y relajante.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}