import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGastos } from '../hooks/useGastos';
import { toast } from 'react-hot-toast';
import { Save, Loader, ArrowLeft, DollarSign, Tag, Calendar, FileText } from 'lucide-react';

export default function GastoFormPage() {
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); 
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  
  const params = useParams();
  const navigate = useNavigate();
  
  const { createGasto, getGasto, updateGasto, gastos } = useGastos();

  useEffect(() => {
    const loadGasto = async () => {
      if (params.id) {
        setPageLoading(true);
        const gasto = await getGasto(params.id);
        if (gasto) {
          setMonto(Number(gasto.monto).toString());
          setCategoria(gasto.categoria);
          
         
          
          const dbDate = new Date(gasto.fecha);
          const utcYear = dbDate.getUTCFullYear();
          const utcMonth = (dbDate.getUTCMonth() + 1).toString().padStart(2, '0');
          const utcDay = dbDate.getUTCDate().toString().padStart(2, '0');
          setFecha(`${utcYear}-${utcMonth}-${utcDay}`);
          
          setDescripcion(gasto.descripcion || '');
        }
        setPageLoading(false);
      }
    };
    loadGasto();
  }, [params.id, getGasto]);

  
  const uniqueCategories = useMemo(() => {
    
    const categories = new Set(gastos.map(g => g.categoria).filter(Boolean));
    return Array.from(categories).sort();
  }, [gastos]); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    
    
    
    const fechaUTC = new Date(fecha + 'T00:00:00Z');

    const gastoData = {
      monto: parseFloat(monto),
      categoria,
      fecha: fechaUTC, 
      descripcion,
    };
   

    try {
      if (params.id) {
        // Actualizando
        await updateGasto(params.id, gastoData);
        toast.success('Gasto actualizado con éxito');
      } else {
        // Creando
        await createGasto(gastoData);
        toast.success('Gasto creado con éxito');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error('Hubo un error al guardar el gasto');
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
          {params.id ? 'Editar Gasto' : 'Crear Nuevo Gasto'}
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

         
          <div>
            <label
              htmlFor="categoria"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2" 
            >
              Categoría
            </label>
            <div className="relative">
              <input
                type="text"
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
                placeholder="Selecciona o escribe una categoría"
                list="categorias-list" 
                className="pr-10"      
              />
              <Tag className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              
              {/* Datalist con las sugerencias */}
              <datalist id="categorias-list">
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>

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
              Descripción (Opcional)
            </label>
            <div className="relative">
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: Cena con amigos..."
                className="pr-10 h-24" 
                rows="3"
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
              {loading ? (params.id ? 'Actualizando...' : 'Guardando...') : (params.id ? 'Actualizar Gasto' : 'Guardar Gasto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}