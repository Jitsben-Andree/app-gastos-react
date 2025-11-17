import { TrendingUp } from 'lucide-react';

// Función para formatear a moneda
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function TotalIngresosCard({ total, count }) {
  return (
    <div className="bg-card dark:bg-card-dark shadow-md rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-500">Total Ingresos</span>
        <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full">
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
      </div>
      <p className="text-4xl font-bold text-green-600 dark:text-green-500 mb-2">
        {formatCurrency(total)}
      </p>
      <p className="text-sm text-gray-500">
        {count} {count === 1 ? 'ingreso registrado' : 'ingresos registrados'}
      </p>
    </div>
  );
}