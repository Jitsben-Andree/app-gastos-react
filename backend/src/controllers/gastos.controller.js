import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- Obtener todos los gastos del usuario autenticado ---
export const getGastos = async (req, res) => {
  // req.userId viene del middleware authRequired
  const userId = req.userId;

  try {
    const gastos = await prisma.gasto.findMany({
      where: {
        usuario_id: userId,
      },
      orderBy: {
        fecha: 'desc', // Mostrar los más recientes primero
      },
    });
    res.status(200).json(gastos);
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- Crear un nuevo gasto ---
export const createGasto = async (req, res) => {
  const { monto, categoria, fecha, descripcion } = req.body;
  const userId = req.userId;

  // Validación
  if (!monto || !categoria || !fecha) {
    return res.status(400).json({ message: "Monto, categoría y fecha son requeridos" });
  }

  try {
    const newGasto = await prisma.gasto.create({
      data: {
        monto: parseFloat(monto), // Asegurarse de que sea un número
        categoria,
        fecha: new Date(fecha), // Asegurarse de que sea un objeto Date
        descripcion,
        usuario_id: userId, // Asociar con el usuario logueado
      },
    });
    res.status(201).json(newGasto);
  } catch (error) {
    console.error("Error al crear gasto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- Obtener un gasto específico por ID ---
export const getGastoById = async (req, res) => {
  const gastoId = req.params.id; // <-- CAMBIO: Eliminamos parseInt()
  const userId = req.userId;

  try {
    const gasto = await prisma.gasto.findFirst({
      where: {
        id: gastoId, // <-- Ahora le pasamos el String
        usuario_id: userId, // Asegurarse que el gasto pertenece al usuario
      },
    });

    if (!gasto) {
      return res.status(404).json({ message: "Gasto no encontrado o no autorizado" });
    }
    res.status(200).json(gasto);
  } catch (error) {
    console.error("Error al obtener gasto por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- Actualizar un gasto ---
export const updateGasto = async (req, res) => {
  const gastoId = req.params.id; // <-- CAMBIO: Eliminamos parseInt()
  const userId = req.userId;
  const { monto, categoria, fecha, descripcion } = req.body;

  try {
    // Prisma nos permite hacer un updateMany con un 'where' compuesto
    // para asegurar que solo actualizamos si el ID y el usuario_id coinciden.
    const result = await prisma.gasto.updateMany({
      where: {
        id: gastoId, // <-- Ahora le pasamos el String
        usuario_id: userId,
      },
      data: {
        monto: monto ? parseFloat(monto) : undefined,
        categoria: categoria ? categoria : undefined,
        fecha: fecha ? new Date(fecha) : undefined,
        descripcion: descripcion ? descripcion : undefined,
      },
    });

    // Si result.count es 0, significa que no se encontró el gasto o no pertenece al usuario
    if (result.count === 0) {
      return res.status(404).json({ message: "Gasto no encontrado o no autorizado" });
    }

    // Devolvemos el gasto actualizado
    const updatedGasto = await prisma.gasto.findUnique({ where: { id: gastoId } });
    res.status(200).json(updatedGasto);

  } catch (error) {
    console.error("Error al actualizar gasto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- Eliminar un gasto ---
export const deleteGasto = async (req, res) => {
  const gastoId = req.params.id; // <-- CAMBIO: Eliminamos parseInt()
  const userId = req.userId;

  try {
    // Usamos deleteMany para asegurar que solo borramos si el ID y usuario_id coinciden
    const result = await prisma.gasto.deleteMany({
      where: {
        id: gastoId, // <-- Ahora le pasamos el String
        usuario_id: userId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "Gasto no encontrado o no autorizado" });
    }

    // 'No Content'. Es la respuesta estándar para un DELETE exitoso.
    res.sendStatus(204); 

  } catch (error) {
    console.error("Error al eliminar gasto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- Obtener Estadísticas (Placeholder) ---
export const getGastosStats = async (req, res) => {
  const userId = req.userId;
  // (Aquí implementarías la lógica de agregación de Prisma)
  // Por ahora, devolvemos un mensaje
  res.json({ message: `Estadísticas para el usuario ${userId} estarán aquí.` });
};