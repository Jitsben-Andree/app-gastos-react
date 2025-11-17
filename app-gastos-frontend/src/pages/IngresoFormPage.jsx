import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useIngresos } from '../hooks/useIngresos'; // 1. Usar hook de Ingresos
import { toast } from 'react-hot-toast';
import { Save, Loader, ArrowLeft, DollarSign, Calendar, FileText } from 'lucide-react';

export default function IngresoFormPage() {
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  
  const params = useParams();
  const navigate = useNavigate();
  // 2. Usar contexto de Ingresos
  const { createIngreso, getIngreso, updateIngreso } = useIngresos();

  useEffect(() => {
    const loadIngreso = async () => {
      if (params.id) {
        setPageLoading(true);
        const ingreso = await getIngreso(params.id);
        if (ingreso) {
          setMonto(Number(ingreso.monto).toString());
          setFecha(new Date(ingreso.fecha).toISOString().split('T')[0]);
          setDescripcion(ingreso.descripcion || '');
        }
        setPageLoading(false);
      }
    };
    loadIngreso();
  }, [params.id, getIngreso]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const ingresoData = {
      monto: parseFloat(monto),
      fecha: new Date(fecha),
      descripcion,
    };

    try {
      if (params.id) {
        // 3. Actualizar Ingreso
        await updateIngreso(params.id, ingresoData);
        toast.success('Ingreso actualizado con éxito');
      } else {
        // 4. Crear Ingreso
        await createIngreso(ingresoData);
        toast.success('Ingreso creado con éxito');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error('Hubo un error al guardar el ingreso');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading && params.id) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Botón de Volver */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al Dashboard
      </Link>

      <div className="bg-card dark:bg-card-dark shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {params.id ? 'Editar Ingreso' : 'Crear Nuevo Ingreso'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-7">
          
          {/* Campo: Monto */}
          <div>
            <label
              htmlFor="monto"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
            >
              Monto ($)
            </label>
            <div className="relative">
              <input
                type="number"
                id="monto"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
                placeholder="0.00"
                className="pr-10"
              />
              <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Campo: Fecha */}
          <div>
            <label 
              htmlFor="fecha" 
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
            >
              Fecha
            </label>
            <div className="relative">
              <input
                type="date"
                id="fecha"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                className="pr-10"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Campo: Descripción */}
          <div>
            <label 
              htmlFor="descripcion" 
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
            >
              Descripción
            </label>
            <div className="relative">
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: Salario mensual, Venta laptop..."
                className="pr-10 h-24"
                rows="3"
                required
              />
              <FileText className="absolute right-4 top-4 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:bg-gray-400"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? (params.id ? 'Actualizando...' : 'Guardando...') : (params.id ? 'Actualizar Ingreso' : 'Guardar Ingreso')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}