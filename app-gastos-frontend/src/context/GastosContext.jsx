import { createContext, useState, useCallback } from 'react'; 
import {
  getGastosRequest,
  createGastoRequest,
  deleteGastoRequest,
  getGastoRequest,
  updateGastoRequest,
} from '../api/gastos';


export const GastosContext = createContext();


export const GastosProvider = ({ children }) => {
  const [gastos, setGastos] = useState([]);
  const [errors, setErrors] = useState([]);

  // Funciones del CRUD 

  // OBTENER todos los gastos
  const getGastos = useCallback(async () => { 
    // Envolver con useCallback
    try {
      const res = await getGastosRequest();
      setGastos(res.data);
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al obtener gastos']);
    }
  }, []); //  Añadir array de dependencias (vacío en este caso)

  // CREAR un gasto
  const createGasto = useCallback(async (gasto) => { 
    try {
      const res = await createGastoRequest(gasto);
      setGastos([...gastos, res.data]); 
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al crear gasto']);
    }
  }, [gastos]); 

  
  const deleteGasto = useCallback(async (id) => { 
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
  }, [gastos]); 
  // OBTENER un gasto 
  const getGasto = useCallback(async (id) => {
    try {
      const res = await getGastoRequest(id);
      return res.data; 
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al obtener gasto']);
    }
  }, []); 

  
  const updateGasto = useCallback(async (id, gasto) => { 
    try {
      const res = await updateGastoRequest(id, gasto);
      
      setGastos(
        gastos.map((g) => (g.id === id ? res.data : g))
      );
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al actualizar gasto']);
    }
  }, [gastos]);

 
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