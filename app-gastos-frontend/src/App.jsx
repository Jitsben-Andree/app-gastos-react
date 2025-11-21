import { Routes, Route, Outlet } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import GastoFormPage from './pages/GastoFormPage'
import IngresoFormPage from './pages/IngresoFormPage' // 1. Importar nueva página
import { ProtectedRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'


function PublicLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}


function PrivateLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark dark:to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Rutas Públicas  */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Rutas Privadas  */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/gastos/new" element={<GastoFormPage />} />
          <Route path="/gastos/edit/:id" element={<GastoFormPage />} />
          <Route path="/ingresos/new" element={<IngresoFormPage />} />
          <Route path="/ingresos/edit/:id" element={<IngresoFormPage />} />
        </Route>
      </Route>

      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  )
}

export default App