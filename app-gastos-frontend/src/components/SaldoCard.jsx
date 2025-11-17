import { Scale } from 'lucide-react';

// Función para formatear a moneda
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function SaldoCard({ saldo }) {
  const saldoColor = saldo >= 0 ? 'text-blue-600' : 'text-danger';
  const iconColor = saldo >= 0 ? 'text-blue-600' : 'text-danger';
  const iconBg = saldo >= 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-red-100 dark:bg-red-900';

  return (
    <div className="bg-card dark:bg-card-dark shadow-md rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-500">Saldo del Periodo</span>
        <div className={`flex items-center justify-center w-10 h-10 ${iconBg} rounded-full`}>
          <Scale className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      <p className={`text-4xl font-bold ${saldoColor} mb-2`}>
        {formatCurrency(saldo)}
      </p>
      <p className="text-sm text-gray-500">
        {saldo >= 0 ? 'Balance positivo' : 'Balance negativo'}
      </p>
    </div>
  );
}