import { Wallet, TrendingUp } from 'lucide-react';

// Función para formatear a moneda (ej: $242.00)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // Puedes cambiar esto si es necesario
  }).format(amount);
};

export default function TotalGastosCard({ total, count }) {
  return (
    <div className="bg-card dark:bg-card-dark shadow-md rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-500">Total de Gastos</span>
        <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-full">
          <Wallet className="w-5 h-5 text-primary" />
        </div>
      </div>
      <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {formatCurrency(total)}
      </p>
      <p className="text-sm text-gray-500">
        {count} {count === 1 ? 'gasto registrado' : 'gastos registrados'}
      </p>
    </div>
  );
}