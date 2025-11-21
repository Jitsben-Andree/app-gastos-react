import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = Router();


// Rutas de autenticación según tu informe
router.post('/register', register);
router.post('/login', login);

// Ruta protegida para obtener el perfil del usuario (verificar el token)
// authRequired es el middleware que protege esta ruta
router.get('/me', authRequired, getMe);

export default router;