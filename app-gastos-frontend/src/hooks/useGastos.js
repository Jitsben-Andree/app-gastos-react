import { useContext } from 'react';
import { GastosContext } from '../context/GastosContext';

/**
 * Hook personalizado para acceder al GastosContext.
 */
export const useGastos = () => {
  const context = useContext(GastosContext);
  if (!context) {
    throw new Error('useGastos debe ser usado dentro de un GastosProvider');
  }
  return context;
};