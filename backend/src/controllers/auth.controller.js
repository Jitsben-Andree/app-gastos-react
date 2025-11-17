import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// --- Registrar un nuevo usuario ---
export const register = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  // Validación simple
  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    // Verificar si el correo ya existe
    const userFound = await prisma.usuario.findUnique({ where: { correo } });
    if (userFound) {
      return res.status(400).json({ message: "El correo ya está en uso" });
    }

    // Encriptar la contraseña
    const passwordHash = await bcrypt.hash(contrasena, 10);

    // Crear el nuevo usuario
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contrasena: passwordHash,
      },
    });

    // Crear el token JWT
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, {
      expiresIn: '1d', // El token expira en 1 día
    });

    // Devolvemos el token y la información básica del usuario (sin contraseña)
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        correo: newUser.correo,
      },
    });

  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- Iniciar sesión (Login) ---
export const login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    // Buscar al usuario por correo
    const userFound = await prisma.usuario.findUnique({ where: { correo } });
    if (!userFound) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(contrasena, userFound.contrasena);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Crear el token JWT
    const token = jwt.sign({ id: userFound.id }, JWT_SECRET, {
      expiresIn: '1d',
    });

    // Devolvemos el token y la info del usuario
    res.status(200).json({
      token,
      user: {
        id: userFound.id,
        nombre: userFound.nombre,
        correo: userFound.correo,
      },
    });

  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- Obtener el perfil del usuario (verificar token) ---
export const getMe = async (req, res) => {
  // El ID del usuario viene de req.userId (establecido en el middleware authRequired)
  const userId = req.userId;

  // --- INICIO DE LA MODIFICACIÓN (Hacerlo más robusto) ---
  if (!userId || isNaN(parseInt(userId))) {
    return res.status(400).json({ message: "ID de usuario inválido" });
  }
  // --- FIN DE LA MODIFICACIÓN ---

  try {
    const user = await prisma.usuario.findUnique({
      where: { id: parseInt(userId) }, // Aseguramos que sea un Int
      select: { // Solo devolvemos los campos seguros
        id: true,
        nombre: true,
        correo: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};