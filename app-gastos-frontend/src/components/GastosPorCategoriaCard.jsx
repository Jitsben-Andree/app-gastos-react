import { useState } from 'react';
import { TrendingUp, PieChart as PieChartIcon, BarChart } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// Función para formatear a moneda (ej: $242.00)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // Puedes cambiar esto si es necesario
  }).format(amount);
};

// Colores consistentes para los gráficos
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function GastosPorCategoriaCard({ data }) {
  const [chartType, setChartType] = useState('pie'); // 'pie' o 'bar'

  // Solo mostramos las 5 categorías principales
  const topCategories = data.slice(0, 5);

  // --- INICIO DE LA CORRECCIÓN ---
  // 1. Objeto de estilo para el Tooltip
  const tooltipContentStyle = {
    backgroundColor: '#ffffff', // bg-white
    borderRadius: '0.5rem', // rounded-lg
    border: 'none',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md
  };
  const tooltipLabelStyle = {
    color: '#1f2937', // text-gray-800 (¡Esto arregla tu bug!)
    marginBottom: '0.25rem', // mb-1
    fontWeight: '600', // font-semibold
  };
  const tooltipItemStyle = {
    color: '#374151', // text-gray-700
  };
  // --- FIN DE LA CORRECCIÓN ---

  return (
    <div className="bg-card dark:bg-card-dark shadow-md rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-500">Por Categoría</span>
        
        {/* Botones para cambiar el tipo de gráfico */}
        <div className="flex gap-1 bg-gray-100 dark:bg-dark p-1 rounded-lg">
          <button 
            onClick={() => setChartType('pie')}
            className={`p-1.5 rounded-md transition-colors ${
              chartType === 'pie' 
                ? 'bg-white dark:bg-card-dark shadow text-primary' 
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'
            }`}
            aria-label="Ver gráfico de pastel"
          >
            <PieChartIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-md transition-colors ${
              chartType === 'bar' 
                ? 'bg-white dark:bg-card-dark shadow text-primary' 
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'
            }`}
            aria-label="Ver gráfico de barras"
          >
            <BarChart className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Contenedor principal (Gráfico + Lista) */}
      {topCategories.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-10">
          No hay datos de categorías para mostrar.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mt-4">
          
          {/* Columna 1: Gráfico (Condicional) */}
          <div className="h-48 md:h-56">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                // --- Gráfico de Pastel ---
                <PieChart>
                  <Pie
                    data={topCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius="100%"
                    fill="#8884d8"
                    dataKey="total"
                    nameKey="categoria"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {topCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)} 
                    contentStyle={tooltipContentStyle} // 2. Aplicar estilos
                    labelStyle={tooltipLabelStyle}   // 2. Aplicar estilos
                    itemStyle={tooltipItemStyle}    // 2. Aplicar estilos
                  />
                </PieChart>
              ) : (
                // --- Gráfico de Barras ---
                <RechartsBarChart 
                  data={topCategories} 
                  margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="categoria" fontSize={10} tick={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)} 
                    contentStyle={tooltipContentStyle} // 2. Aplicar estilos
                    labelStyle={tooltipLabelStyle}   // 2. Aplicar estilos
                    itemStyle={tooltipItemStyle}    // 2. Aplicar estilos
                  />
                  <Bar dataKey="total">
                    {topCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {/* Columna 2: Lista de Categorías */}
          <div className="space-y-4">
            {topCategories.map((item, index) => (
              <div key={item.categoria} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.categoria}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}