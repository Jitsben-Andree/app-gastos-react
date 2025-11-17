import { useContext } from 'react';
import { IngresosContext } from '../context/IngresosContext';

/**
 * Hook personalizado para acceder al IngresosContext.
 */
export const useIngresos = () => {
  const context = useContext(IngresosContext);
  if (!context) {
    throw new Error('useIngresos debe ser usado dentro de un IngresosProvider');
  }
  return context;
};