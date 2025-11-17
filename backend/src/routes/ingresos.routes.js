import { Router } from 'express';
import {
  createIngreso,
  getIngresos,
  getIngresoById,
  updateIngreso,
  deleteIngreso,
} from '../controllers/ingresos.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = Router();

// Protegemos todas las rutas de ingresos
router.use(authRequired);

// Rutas CRUD de Ingresos
router.post('/', createIngreso);
router.get('/', getIngresos);
router.get('/:id', getIngresoById);
router.put('/:id', updateIngreso);
router.delete('/:id', deleteIngreso);

export default router;