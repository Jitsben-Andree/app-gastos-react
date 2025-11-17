/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal (AHORA VERDE)
        primary: '#10b981',   // emerald-500
        secondary: '#059669', // emerald-600
        danger: '#dc2626',    // red-600

        // Paleta de fondo y tarjetas
        light: '#f8fafc',    // slate-50 (Fondo principal)
        dark: '#0f172a',     // slate-900 (Fondo modo oscuro)
        card: '#ffffff',     // white (Tarjetas)
        'card-dark': '#1e293b', // slate-800
      }
    },
  },
  plugins: [],
}