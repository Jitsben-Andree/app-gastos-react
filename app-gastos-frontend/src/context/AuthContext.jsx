import { createContext, useState, useEffect } from 'react';
import { loginRequest, registerRequest, verifyTokenRequest } from '../api/auth';
import Cookies from 'js-cookie';

// 1. Crear el contexto
export const AuthContext = createContext();

// 2. Crear el Proveedor (Provider)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Para saber si ya se verificó el token
  const [errors, setErrors] = useState([]);

  // Función de Registro (Signup)
  const signup = async (userData) => {
    try {
      const res = await registerRequest(userData);
      // Guardamos el token en las cookies (más seguro que localStorage para SSR)
      Cookies.set('token', res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return res.data.user;
    } catch (error) {
      
      // Verificamos si el error tiene una respuesta del servidor (ej. error 400, 500)
      if (error.response) {
        if (Array.isArray(error.response.data)) {
          setErrors(error.response.data);
        } else {
          setErrors([error.response.data.message || 'Error en el registro']);
        }
      } else {
        // Si no hay 'error.response', es un error de red (CORS, backend caído, etc.)
        setErrors([error.message || 'Error de conexión con el servidor']);
      }
      
    }
  };

  // Función de Login (Signin)
  const signin = async (userData) => {
    try {
      const res = await loginRequest(userData);
      Cookies.set('token', res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return res.data.user;
    } catch (error) {
      
      // Verificamos si el error tiene una respuesta del servidor
      if (error.response) {
        if (Array.isArray(error.response.data)) {
          setErrors(error.response.data);
        } else {
          setErrors([error.response.data.message || 'Error al iniciar sesión']);
        }
      } else {
        // Si no hay 'error.response', es un error de red
        setErrors([error.message || 'Error de conexión con el servidor']);
      }
     
    }
  };

  // Función de Logout
  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Limpiar errores después de un tiempo
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000); // Limpia errores después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Efecto para verificar el token al cargar la app
  useEffect(() => {
    const checkLogin = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Hacemos una petición a /auth/me usando el token
        const res = await verifyTokenRequest(token);
        if (!res.data) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setUser(res.data);
        }
      } catch (error) {
        
        // Si el token es inválido (401) o el usuario no se encuentra (404),
        // borramos la cookie y deslogueamos.
        setIsAuthenticated(false);
        setUser(null);
        Cookies.remove('token'); // <-- Añadir esta línea
        
      } finally {
        setLoading(false); // Terminamos de cargar
      }
    };
    checkLogin();
  }, []);

  // 3. Devolvemos el proveedor con los valores
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        errors,
        signup,
        signin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};