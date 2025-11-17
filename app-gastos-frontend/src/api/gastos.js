import { api } from "./Axios"; // CAMBIO: Importamos { api } en lugar de 'api'

// Petición para OBTENER TODOS los gastos
export const getGastosRequest = () => api.get('/gastos');

// Petición para OBTENER UN gasto
export const getGastoRequest = (id) => api.get(`/gastos/${id}`);

// Petición para CREAR un gasto
export const createGastoRequest = (gasto) => api.post('/gastos', gasto);

// Petición para ACTUALIZAR un gasto
export const updateGastoRequest = (id, gasto) => api.put(`/gastos/${id}`, gasto);

// Petición para ELIMINAR un gasto
export const deleteGastoRequest = (id) => api.delete(`/gastos/${id}`);