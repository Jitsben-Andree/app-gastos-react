import { createContext, useState, useCallback } from 'react';
import {
  getIngresosRequest,
  createIngresoRequest,
  deleteIngresoRequest,
  getIngresoRequest,
  updateIngresoRequest,
} from '../api/ingresos';

export const IngresosContext = createContext();

export const IngresosProvider = ({ children }) => {
  const [ingresos, setIngresos] = useState([]);
  const [errors, setErrors] = useState([]);

  // OBTENER todos los ingresos
  const getIngresos = useCallback(async () => {
    try {
      const res = await getIngresosRequest();
      setIngresos(res.data);
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al obtener ingresos']);
    }
  }, []);

  // CREAR un ingreso
  const createIngreso = useCallback(async (ingreso) => {
    try {
      const res = await createIngresoRequest(ingreso);
      setIngresos(prev => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al crear ingreso']);
    }
  }, [ingresos]);

  // ELIMINAR un ingreso
  const deleteIngreso = useCallback(async (id) => {
    try {
      const res = await deleteIngresoRequest(id);
      if (res.status === 204) {
        setIngresos(prev => prev.filter((ingreso) => ingreso.id !== id));
      }
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al eliminar ingreso']);
    }
  }, [ingresos]);

  // OBTENER un ingreso (para editar)
  const getIngreso = useCallback(async (id) => {
    try {
      const res = await getIngresoRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al obtener ingreso']);
    }
  }, []);

  // ACTUALIZAR un ingreso
  const updateIngreso = useCallback(async (id, ingreso) => {
    try {
      const res = await updateIngresoRequest(id, ingreso);
      setIngresos(prev => 
        prev.map((i) => (i.id === id ? res.data : i))
      );
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message || 'Error al actualizar ingreso']);
    }
  }, [ingresos]);

  return (
    <IngresosContext.Provider
      value={{
        ingresos,
        errors,
        getIngresos,
        createIngreso,
        deleteIngreso,
        getIngreso,
        updateIngreso,
      }}
    >
      {children}
    </IngresosContext.Provider>
  );
};