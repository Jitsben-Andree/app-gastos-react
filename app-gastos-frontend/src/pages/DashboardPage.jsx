import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGastos } from '../hooks/useGastos';
import { useIngresos } from '../hooks/useIngresos';

import GastoCard from '../components/GastoCard';
import IngresoCard from '../components/IngresoCard'; 
import TotalGastosCard from '../components/TotalGastosCard';
import TotalIngresosCard from '../components/TotalIngresosCard'; 
import SaldoCard from '../components/SaldoCard'; 
import GastosPorCategoriaCard from '../components/GastosPorCategoriaCard';
import { Loader, PlusCircle, Filter, TrendingUp } from 'lucide-react'; 
import { Link } from 'react-router-dom';


function CategoryPill({ children, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors flex-shrink-0 ${
        isActive
          ? 'bg-primary text-white'
          : 'bg-gray-100 dark:bg-dark text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  );
}

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function DashboardPage() {
  const { user } = useAuth();
  //Usar AMBOS contextos
  const { gastos, getGastos, errors: gastosErrors } = useGastos();
  const { ingresos, getIngresos, errors: ingresosErrors } = useIngresos();
  
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [categoryFilter, setCategoryFilter] = useState([]);

  //  Cargar AMBOS tipos de datos
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      await Promise.all([
        getGastos(),
        getIngresos()
      ]);
      setLoading(false);
    };
    loadData();
  }, [getGastos, getIngresos]); 

  // Memo para categorías únicas (igual)
  const uniqueCategories = useMemo(() => {
    const categories = new Set(gastos.map(g => g.categoria).filter(Boolean));
    return Array.from(categories).sort();
  }, [gastos]);

  //  LÓGICA DE CÁLCULO MEJORADA (UNIFICADA) 
  const summaryData = useMemo(() => {
    
    //Filtrar Gastos (por fecha y categoría)
    const filteredGastos = gastos.filter(gasto => {
      const fechaGasto = new Date(gasto.fecha);
      
      const anoGasto = fechaGasto.getUTCFullYear(); 
      const mesGasto = fechaGasto.getUTCMonth(); 
      

      if (anoGasto !== selectedYear) return false;
      if (selectedMonth !== 'todo' && mesGasto !== parseInt(selectedMonth)) {
        return false;
      }
      // Filtrar por categoría
      if (categoryFilter.length > 0 && !categoryFilter.includes(gasto.categoria)) {
        return false;
      }
      return true; 
    });

    // Filtrar Ingresos
    const filteredIngresos = ingresos.filter(ingreso => {
      
      const fechaIngreso = new Date(ingreso.fecha);
      // Usar UTC para los filtros
      const anoIngreso = fechaIngreso.getUTCFullYear();
      const mesIngreso = fechaIngreso.getUTCMonth(); 
      

      if (anoIngreso !== selectedYear) return false;
      if (selectedMonth !== 'todo' && mesIngreso !== parseInt(selectedMonth)) {
        return false;
      }
      return true;
    });

    // 8.3. Calcular Resúmenes
    const totalGastos = filteredGastos.reduce((acc, gasto) => acc + Number(gasto.monto), 0);
    const countGastos = filteredGastos.length;

    const totalIngresos = filteredIngresos.reduce((acc, ing) => acc + Number(ing.monto), 0);
    const countIngresos = filteredIngresos.length;

    const saldo = totalIngresos - totalGastos;

    //  Calcular "Por Categoría" 
    const categoriesMap = filteredGastos.reduce((acc, gasto) => {
      const categoria = gasto.categoria || 'Sin Categoría';
      const monto = Number(gasto.monto);
      
      if (!acc[categoria]) {
        acc[categoria] = 0;
      }
      acc[categoria] += monto;
      return acc;
    }, {});
    
    const byCategory = Object.entries(categoriesMap)
      .map(([categoria, total]) => ({
        categoria,
        total,
      }))
      .sort((a, b) => b.total - b.total);

    //  Unir y ordenar transacciones
    const gastosConTipo = filteredGastos.map(g => ({ ...g, type: 'gasto' }));
    const ingresosConTipo = filteredIngresos.map(i => ({ ...i, type: 'ingreso' }));

    const allTransactions = [...gastosConTipo, ...ingresosConTipo].sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha) 
    );

    return { 
      totalGastos,
      countGastos,
      totalIngresos,
      countIngresos,
      saldo,
      byCategory, 
      allTransactions 
    };

  }, [gastos, ingresos, selectedMonth, selectedYear, categoryFilter]);

  //Funciones para manejar los filtros
  const handleCategoryToggle = (categoria) => {
    setCategoryFilter(prev => {
      if (prev.includes(categoria)) {
        return prev.filter(c => c !== categoria);
      }
      return [...prev, categoria];
    });
  };

  const clearCategoryFilter = () => {
    setCategoryFilter([]);
  };

  const allErrors = [...gastosErrors, ...ingresosErrors];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-12 w-12 text-primary" />
        </div>
      ) : (
        <>
          {allErrors.length > 0 && (
            <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
              {allErrors.map((error, i) => (
                <p key={i}>{error}</p>
              ))}
            </div>
          )}

          {/*  Filtros   */}
          <div className="mb-8 p-6 bg-card dark:bg-card-dark rounded-xl shadow-md space-y-4">
            
            {/*  Filtro de Fecha   */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Desplegable de Mes */}
              <div className="flex-1">
                <label htmlFor="month-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Mes
                </label>
                <select
                  id="month-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-gray-100 dark:bg-dark border-none rounded-md p-2 text-sm font-medium focus:ring-2 focus:ring-primary w-full"
                >
                  <option value="todo">Ver Todo el Año</option>
                  {MESES.map((mes, index) => (
                    <option key={mes} value={index.toString()}>
                      {mes}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Campo de Año */}
              <div className="flex-1 sm:flex-none sm:w-32">
                 <label htmlFor="year-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Año
                </label>
                <input
                  id="year-input"
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value) || new Date().getFullYear())}
                  className="bg-gray-100 dark:bg-dark border-none rounded-md p-2 text-sm font-medium focus:ring-2 focus:ring-primary w-full"
                  placeholder="Año"
                />
              </div>
            </div>

            {/*Filtro de Categorías  */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Filtrar por Categoría:
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <CategoryPill
                  onClick={clearCategoryFilter}
                  isActive={categoryFilter.length === 0}
                >
                  Ver Todas
                </CategoryPill>
                {uniqueCategories.map(cat => (
                  <CategoryPill
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    isActive={categoryFilter.includes(cat)}
                  >
                    {cat}
                  </CategoryPill>
                ))}
              </div>
            </div>
          </div>


          {/*  NUEVO LAYOUT DE RESUMEN --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <TotalIngresosCard 
              total={summaryData.totalIngresos} 
              count={summaryData.countIngresos} 
            />
            <TotalGastosCard 
              total={summaryData.totalGastos} 
              count={summaryData.countGastos} 
            />
            <SaldoCard 
              saldo={summaryData.saldo} 
            />
          </div>

          {/* Gráfico de Categorías  */}
          <div className="mb-6">
            <GastosPorCategoriaCard data={summaryData.byCategory} />
          </div>

          {/*LISTA DE TRANSACCIONES UNIFICADA --- */}
          <h2 className="text-2xl font-bold mb-4">
            Transacciones Recientes
          </h2>
          
          {(gastos.length === 0 && ingresos.length === 0) ? (
            // Mensaje si NUNCA ha creado NADA
            <div className="text-center text-gray-500 py-16 bg-card rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-4">¡Aún no hay transacciones!</h2>
              <p className="mb-6">Empieza a registrar tus ingresos y gastos.</p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/ingresos/new"
                  className="btn-secondary inline-flex w-auto px-6 py-3"
                >
                  <TrendingUp className="w-6 h-6" />
                  Añadir Ingreso
                </Link>
                <Link
                  to="/gastos/new"
                  className="btn-primary inline-flex w-auto px-6 py-3"
                >
                  <PlusCircle className="w-6 h-6" />
                  Añadir Gasto
                </Link>
              </div>
            </div>
          ) : (summaryData.allTransactions.length === 0) ? (
            // Mensaje si hay datos
            <div className="text-center text-gray-500 py-16 bg-card rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Sin resultados</h2>
              <p className="mb-6">No se encontraron transacciones que coincidan con los filtros seleccionados.</p>
            </div>
          ) : (
            // Renderizar la lista unificada
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {summaryData.allTransactions.map((tx) => (
                tx.type === 'gasto' 
                  ? <GastoCard gasto={tx} key={`gasto-${tx.id}`} />
                  : <IngresoCard ingreso={tx} key={`ingreso-${tx.id}`} />
              ))}
            </div>
          )}

          {/* --- BOTÓN FLOTANTE --- */}
          <Link
            to="/gastos/new"
            className="btn-primary fixed bottom-8 right-8 w-auto h-16 p-4 rounded-full shadow-lg"
          >
            <PlusCircle className="w-8 h-8" />
          </Link>
        </>
      )}
    </>
  );
}