import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware para proteger rutas.
 * Verifica el token JWT que viene en el header 'Authorization'.
 */
export const authRequired = (req, res, next) => {
  // 1. Obtener el header 'Authorization'
  const authHeader = req.headers['authorization'];

  // 2. El token usualmente viene como "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  // 3. Si no hay token, no está autorizado
  if (!token) {
    return res.status(401).json({ message: "No autorizado. Token no provisto." });
  }

  // 4. Verificar el token
  jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      // Si el token es inválido o expiró
      return res.status(401).json({ message: "Token inválido o expirado." });
    }

    // 5. El token es válido. Añadimos el ID del usuario al objeto 'req'
    // El 'decodedPayload' es lo que pusimos al firmar: { id: userId }
    req.userId = decodedPayload.id;

    // 6. Continuar con el siguiente controlador
    next();
  });
};