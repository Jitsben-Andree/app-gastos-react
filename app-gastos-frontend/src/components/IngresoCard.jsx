import { useIngresos } from '../hooks/useIngresos';
import { Link } from 'react-router-dom';
import { Trash2, Edit, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Función para formatear a moneda
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function IngresoCard({ ingreso }) {
  const { deleteIngreso } = useIngresos();

  const handleDelete = () => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">¿Seguro que quieres eliminar este ingreso?</p>
        <p>Monto: {formatCurrency(ingreso.monto)} - {ingreso.descripcion}</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              deleteIngreso(ingreso.id);
              toast.dismiss(t.id);
              toast.success('Ingreso eliminado');
            }}
            className="w-full px-4 py-2 text-white bg-danger rounded-md hover:bg-red-600"
          >
            Eliminar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  // --- INICIO DE LA CORRECCIÓN 3 (Mostrar en Tarjeta) ---
  const fechaFormateada = new Date(ingreso.fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC', // Le decimos que la fecha de la BD ya está en UTC
  });
  // --- FIN DE LA CORRECCIÓN 3 ---

  return (
    <div className="bg-card dark:bg-card-dark shadow-md rounded-xl p-6 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        {/* Sección de Descripción con Ícono */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{ingreso.descripcion}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{fechaFormateada}</p>
          </div>
        </div>
        
        {/* Botones de Acción */}
        <div className="flex gap-2">
          <Link
            to={`/ingresos/edit/${ingreso.id}`}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-light dark:hover:bg-dark"
          >
            <Edit className="w-5 h-5" />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-danger rounded-full hover:bg-light dark:hover:bg-dark"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Monto */}
      <div className="text-right">
        <span className="text-3xl font-bold text-green-600 dark:text-green-500">
          +{formatCurrency(ingreso.monto)}
        </span>
      </div>
    </div>
  );
}