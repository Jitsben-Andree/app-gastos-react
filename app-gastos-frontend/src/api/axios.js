import axios from 'axios';
import Cookies from 'js-cookie';

// Creamos una instancia de Axios con la URL base del backend
// 1. CAMBIO: Añadimos 'export const' aquí
export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true, // Permite que Axios envíe cookies
});

// Interceptor: Se ejecuta ANTES de cada petición
// Su trabajo es adjuntar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); // Leemos el token de las cookies
    if (token) {
      // Si el token existe, lo añadimos al header 'Authorization'
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. CAMBIO: Eliminamos esta línea
// export default api;