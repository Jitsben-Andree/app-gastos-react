import { Router } from 'express';
import authRoutes from './auth.routes.js';
import gastosRoutes from './gastos.routes.js';
import ingresosRoutes from './ingresos.routes.js'; // 1. Importar nuevas rutas

const router = Router();

// Define las rutas base para cada módulo
// Rutas de autenticación 
router.use('/auth', authRoutes);

// Rutas de gastos
router.use('/gastos', gastosRoutes);

// --- NUEVA LÍNEA ---
// Rutas de ingresos 
router.use('/ingresos', ingresosRoutes); 

export default router;