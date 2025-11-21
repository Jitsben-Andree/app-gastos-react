import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;


// Middleware para proteger rutas.

export const authRequired = (req, res, next) => {
  //  header 
  const authHeader = req.headers['authorization'];

  // El token usualmente viene como "Bearer"
  const token = authHeader && authHeader.split(' ')[1];

  //ssis no hay token , no autorizado
  if (!token) {
    return res.status(401).json({ message: "No autorizado. Token no provisto." });
  }

  
  jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      
      return res.status(401).json({ message: "Token inválido o expirado." });
    }

    req.userId = decodedPayload.id;

    
    next();
  });
};