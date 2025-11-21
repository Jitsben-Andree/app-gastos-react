import { createContext, useState, useEffect } from 'react';
import { loginRequest, registerRequest, verifyTokenRequest } from '../api/auth';
import Cookies from 'js-cookie';


export const AuthContext = createContext();

//  Crear el Proveedor (Provider)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [errors, setErrors] = useState([]);

  
  const signup = async (userData) => {
    try {
      const res = await registerRequest(userData);
      // Guardamos el token en las cookies
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
          setErrors([error.response.data.message || 'Error en el registro']);
        }
      } else {
        // es un error de red (CORS, backend caído)
        setErrors([error.message || 'Error de conexión con el servidor']);
      }
      
    }
  };

  
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

  // cerramos sesion 
  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  //errores 
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // token
  useEffect(() => {
    const checkLogin = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // peticion /auth/me usando el token
        const res = await verifyTokenRequest(token);
        if (!res.data) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setUser(res.data);
        }
      } catch (error) {
        
        // token inválido (401) o el usuario no se encuentra (404),
        // borramos cookie y deslogueamos.
        setIsAuthenticated(false);
        setUser(null);
        Cookies.remove('token'); 
        
      } finally {
        setLoading(false); 
      }
    };
    checkLogin();
  }, []);

  //  Devolvemos el proveedor con los valores
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