import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { GastosProvider } from './context/GastosContext.jsx'
import { IngresosProvider } from './context/IngresosContext.jsx' // 1. Importar
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <GastosProvider>
        <IngresosProvider> {/* 2. Envolver la app */}
          <BrowserRouter>
            <App />
            <Toaster position="top-right" reverseOrder={false} />
          </BrowserRouter>
        </IngresosProvider>
      </GastosProvider>
    </AuthProvider>
  </React.StrictMode>,
)