import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mainApiRouter from './routes/index.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares básicos
app.use(cors({
  origin: 'http://localhost:5173', // 1. Especifica el origen de tu frontend
  credentials: true // 2. Permite el envío de credenciales (cookies/tokens)
}));
app.use(express.json()); // Para parsear JSON en el body

// Mensaje de bienvenida en la ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API de Registro de Gastos funcionando' });
});

// Enrutador principal de la API
// Todas las rutas de la API estarán bajo /api
// Ej: /api/auth/register, /api/gastos/
app.use('/api', mainApiRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});