// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- ESTA ES LA LÍNEA NUEVA QUE AGREGAMOS
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',    // Fondo principal
          primary: '#7c3aed', // Morado principal
          secondary: '#3b82f6', // Azul secundario
          accent: '#c084fc',  // Detalles
          surface: '#1e293b', // Tarjetas
        }
      },
      // --- AGREGA ESTO PARA LA ANIMACIÓN DEL CARRUSEL ---
      animation: {
        scroll: 'scroll 25s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      // --------------------------------------------------
    },
  },
  plugins: [],
}