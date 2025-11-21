import { useGastos } from '../hooks/useGastos';
import { Link } from 'react-router-dom';
import { 
  Trash2, Edit, Utensils, Car, Dumbbell, 
  Film, ShoppingCart, Plane, Home, HelpCircle, Briefcase
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Función helper para obtener un ícono basado en la categoría
const getCategoryIcon = (categoria) => {
  const cat = categoria.toLowerCase();
  if (cat.includes('comida') || cat.includes('restaurante')) {
    return <Utensils className="w-6 h-6 text-yellow-500" />;
  }
  if (cat.includes('transporte') || cat.includes('gasolina')) {
    return <Car className="w-6 h-6 text-blue-500" />;
  }
  if (cat.includes('ocio') || cat.includes('entretenimiento')) {
    return <Film className="w-6 h-6 text-purple-500" />;
  }
  if (cat.includes('compras') || cat.includes('supermercado')) {
    return <ShoppingCart className="w-6 h-6 text-green-500" />;
  }
  if (cat.includes('viaje')) {
    return <Plane className="w-6 h-6 text-cyan-500" />;
  }
  if (cat.includes('hogar') || cat.includes('alquiler')) {
    return <Home className="w-6 h-6 text-orange-500" />;
  }
  if (cat.includes('trabajo')) {
    return <Briefcase className="w-6 h-6 text-gray-500" />;
  }
  if (cat.includes('gimnasio') || cat.includes('deporte')) {
    return <Dumbbell className="w-6 h-6 text-red-500" />;
  }
  return <HelpCircle className="w-6 h-6 text-gray-400" />;
};

export default function GastoCard({ gasto }) {
  const { deleteGasto } = useGastos();

  const handleDelete = () => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">¿Seguro que quieres eliminar este gasto?</p>
        <p>Monto: ${gasto.monto} - {gasto.categoria}</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              deleteGasto(gasto.id);
              toast.dismiss(t.id);
              toast.success('Gasto eliminado');
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

  //Mostrar en Tarjeta ---
  const fechaFormateada = new Date(gasto.fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC', // Le decimos que la fecha de la BD 
  });


  return (
    <div className="bg-card dark:bg-card-dark shadow-md rounded-xl p-6 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        {/* Sección de Categoría con Ícono */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-light dark:bg-dark rounded-full">
            {getCategoryIcon(gasto.categoria)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{gasto.categoria}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{fechaFormateada}</p>
          </div>
        </div>
        
        {/* Botones de Acción */}
        <div className="flex gap-2">
          <Link
            to={`/gastos/edit/${gasto.id}`}
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
      
      {/* Descripción */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 min-h-[20px]">
        {gasto.descripcion || <span className="italic text-gray-400">Sin descripción</span>}
      </p>
      
      {/* Monto */}
      <div className="text-right">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          ${Number(gasto.monto).toFixed(2)}
        </span>
      </div>
    </div>
  );
}