import { Router } from 'express';
import {
  createGasto,
  getGastos,
  getGastoById,
  updateGasto,
  deleteGasto,
  getGastosStats 
} from '../controllers/gastos.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = Router();

// Aplicamos el middleware 'authRequired' a TODAS las rutas de este archivo.
// Esto asegura que solo usuarios autenticados puedan acceder a sus gastos.
router.use(authRequired);

// Rutas CRUD de Gastos (protegidas)
router.post('/', createGasto);
router.get('/', getGastos);
router.get('/estadisticas', getGastosStats);
router.get('/:id', getGastoById);
router.put('/:id', updateGasto);
router.delete('/:id', deleteGasto);

export default router;