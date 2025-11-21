import { createContext, useState, useCallback } from 'react'; // 1. Importar useCallback
import {
  getGastosRequest,
  createGastoRequest,
  deleteGastoRequest,
  getGastoRequest,
  updateGastoRequest,
} from '../api/gastos';

// 1. Crear el contexto
export const GastosContext = createContext();

// 2. Crear el Proveedor
export const GastosProvider = ({ children }) => {
  const [gastos, setGastos] = useState([]);
  const [errors, setErrors] = useState([]);

  // --- Funciones del CRUD ---

  // OBTENER todos los gastos
  const getGastos = useCallback(async () => { 
    // 2. Envolver con useCallback
    try {
      const res = await getGastosRequest();
      setGastos(res.data);
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al obtener gastos']);
    }
  }, []); // 3. Añadir array de dependencias (vacío en este caso)

  // CREAR un gasto
  const createGasto = useCallback(async (gasto) => { // 2. Envolver
    try {
      const res = await createGastoRequest(gasto);
      setGastos([...gastos, res.data]); // Añadir el nuevo gasto al estado
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al crear gasto']);
    }
  }, [gastos]); // 3. Depende de 'gastos' (porque usamos ...gastos)

  // ELIMINAR un gasto
  const deleteGasto = useCallback(async (id) => { // 2. Envolver
    try {
      const res = await deleteGastoRequest(id);
      if (res.status === 204) {
        // Filtramos el gasto eliminado del estado
        setGastos(gastos.filter((gasto) => gasto.id !== id));
      }
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al eliminar gasto']);
    }
  }, [gastos]); // 3. Depende de 'gastos' (porque usamos .filter)

  // OBTENER un gasto (para editar)
  const getGasto = useCallback(async (id) => { // 2. Envolver
    try {
      const res = await getGastoRequest(id);
      return res.data; // Devolvemos el gasto encontrado
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al obtener gasto']);
    }
  }, []); // 3. Array de dependencias vacío

  // ACTUALIZAR un gasto
  const updateGasto = useCallback(async (id, gasto) => { // 2. Envolver
    try {
      const res = await updateGastoRequest(id, gasto);
      // Actualizamos el gasto en el estado
      setGastos(
        gastos.map((g) => (g.id === id ? res.data : g))
      );
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al actualizar gasto']);
    }
  }, [gastos]); // 3. Depende de 'gastos' (porque usamos .map)

  // 3. Devolvemos el proveedor
  return (
    <GastosContext.Provider
      value={{
        gastos,
        errors,
        getGastos,
        createGasto,
        deleteGasto,
        getGasto,
        updateGasto,
      }}
    >
      {children}
    </GastosContext.Provider>
  );
};