import { api } from "./Axios"; // CAMBIO: Importamos { api } en lugar de 'api'

// Petición para registrar un usuario
export const registerRequest = (user) => api.post('/auth/register', user);

// Petición para loguear un usuario
export const loginRequest = (user) => api.post('/auth/login', user);

// Petición para verificar el token (ruta /auth/me)
export const verifyTokenRequest = () => api.get('/auth/me');