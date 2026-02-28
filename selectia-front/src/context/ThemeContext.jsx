// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Creamos el contexto
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Leemos si ya tenía un tema guardado, si no, forzamos 'dark'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Cada vez que cambie el tema, actualizamos el HTML y lo guardamos
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Removemos el tema viejo y ponemos el nuevo
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Guardamos en localStorage para que no se borre al recargar
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Función para alternar entre temas
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};