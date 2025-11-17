import { Routes, Route, Outlet } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import GastoFormPage from './pages/GastoFormPage'
import IngresoFormPage from './pages/IngresoFormPage' // 1. Importar nueva página
import { ProtectedRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'

// ... (PublicLayout se queda igual) ...
function PublicLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

// ... (PrivateLayout se queda igual) ...
function PrivateLayout() {
  return (
    // Usamos un degradado sutil para el fondo de la app
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark dark:to-slate-900">
      <Navbar />
      {/* Añadimos "container mx-auto" aquí.
        Esto centrará el contenido de TODAS las páginas privadas (Dashboard, Formulario, etc.)
      */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Rutas Públicas (usan PublicLayout, sin Navbar) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Rutas Privadas (usan PrivateLayout, con Navbar y fondo) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/gastos/new" element={<GastoFormPage />} />
          <Route path="/gastos/edit/:id" element={<GastoFormPage />} />
          
          {/* --- NUEVAS RUTAS DE INGRESOS --- */}
          <Route path="/ingresos/new" element={<IngresoFormPage />} />
          <Route path="/ingresos/edit/:id" element={<IngresoFormPage />} />
        </Route>
      </Route>

      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  )
}

export default App