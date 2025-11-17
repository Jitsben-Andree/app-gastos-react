import { api } from './axios'; // Importamos la instancia de Axios

// Petición para OBTENER TODOS los ingresos
export const getIngresosRequest = () => api.get('/ingresos');

// Petición para OBTENER UN ingreso
export const getIngresoRequest = (id) => api.get(`/ingresos/${id}`);

// Petición para CREAR un ingreso
export const createIngresoRequest = (ingreso) => api.post('/ingresos', ingreso);

// Petición para ACTUALIZAR un ingreso
export const updateIngresoRequest = (id, ingreso) => api.put(`/ingresos/${id}`, ingreso);

// Petición para ELIMINAR un ingreso
export const deleteIngresoRequest = (id) => api.delete(`/ingresos/${id}`);