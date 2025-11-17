import { Router } from 'express';
import authRoutes from './auth.routes.js';
import gastosRoutes from './gastos.routes.js';
import ingresosRoutes from './ingresos.routes.js'; // 1. Importar nuevas rutas

const router = Router();

// Define las rutas base para cada módulo
// Rutas de autenticación (ej: /api/auth/register)
router.use('/auth', authRoutes);

// Rutas de gastos (ej: /api/gastos/)
router.use('/gastos', gastosRoutes);

// --- NUEVA LÍNEA ---
// Rutas de ingresos (ej: /api/ingresos/)
router.use('/ingresos', ingresosRoutes); // 2. Añadir nuevas rutas

export default router;