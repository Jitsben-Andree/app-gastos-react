import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- Obtener todos los ingresos del usuario autenticado ---
export const getIngresos = async (req, res) => {
  const userId = req.userId;
  try {
    const ingresos = await prisma.ingreso.findMany({
      where: { usuario_id: userId },
      orderBy: { fecha: 'desc' },
    });
    res.status(200).json(ingresos);
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- Crear un nuevo ingreso ---
export const createIngreso = async (req, res) => {
  const { monto, descripcion, fecha } = req.body;
  const userId = req.userId;

  if (!monto || !descripcion || !fecha) {
    return res.status(400).json({ message: "Monto, descripción y fecha son requeridos" });
  }

  try {
    const newIngreso = await prisma.ingreso.create({
      data: {
        monto: parseFloat(monto),
        descripcion,
        fecha: new Date(fecha),
        usuario_id: userId,
      },
    });
    res.status(201).json(newIngreso);
  } catch (error) {
    console.error("Error al crear ingreso:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- Obtener un ingreso específico por ID ---
export const getIngresoById = async (req, res) => {
  const ingresoId = req.params.id;
  const userId = req.userId;

  try {
    const ingreso = await prisma.ingreso.findFirst({
      where: {
        id: ingresoId,
        usuario_id: userId,
      },
    });
    if (!ingreso) {
      return res.status(404).json({ message: "Ingreso no encontrado o no autorizado" });
    }
    res.status(200).json(ingreso);
  } catch (error) {
    console.error("Error al obtener ingreso por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- Actualizar un ingreso ---
export const updateIngreso = async (req, res) => {
  const ingresoId = req.params.id;
  const userId = req.userId;
  const { monto, descripcion, fecha } = req.body;

  try {
    const result = await prisma.ingreso.updateMany({
      where: {
        id: ingresoId,
        usuario_id: userId,
      },
      data: {
        monto: monto ? parseFloat(monto) : undefined,
        descripcion: descripcion ? descripcion : undefined,
        fecha: fecha ? new Date(fecha) : undefined,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "Ingreso no encontrado o no autorizado" });
    }

    const updatedIngreso = await prisma.ingreso.findUnique({ where: { id: ingresoId } });
    res.status(200).json(updatedIngreso);
  } catch (error) {
    console.error("Error al actualizar ingreso:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- Eliminar un ingreso ---
export const deleteIngreso = async (req, res) => {
  const ingresoId = req.params.id;
  const userId = req.userId;

  try {
    const result = await prisma.ingreso.deleteMany({
      where: {
        id: ingresoId,
        usuario_id: userId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "Ingreso no encontrado o no autorizado" });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error("Error al eliminar ingreso:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};