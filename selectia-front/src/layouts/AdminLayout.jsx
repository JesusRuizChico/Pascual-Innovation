// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Brain, 
  LayoutGrid, 
  ShieldCheck, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Bell,
  BarChart3 // <--- Nuevo icono para reportes
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle'; // <--- Añadimos el botón de tema

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Vista General', path: '/admin/dashboard', icon: <LayoutGrid size={18} /> },
    { name: 'Validar Empresas', path: '/admin/validate', icon: <ShieldCheck size={18} /> }, 
    
    // CORREGIDO: Cambiado de 'Ingresos' a 'Reportes'
    { name: 'Reportes', path: '/admin/reports', icon: <BarChart3 size={18} /> }, 
    
    { name: 'Usuarios', path: '/admin/users', icon: <Users size={18} /> }, 
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200 flex flex-col transition-colors duration-300">
      
      {/* NAVBAR ADMIN (Acento Azul/Naranja) */}
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-blue-500/30 shadow-sm dark:shadow-lg dark:shadow-blue-900/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* --- SECCIÓN IZQUIERDA: Logo y Enlaces --- */}
            <div className="flex items-center gap-8">
              
              {/* Logo Admin */}
              <Link to="/admin/dashboard" className="flex items-center gap-2 group">
                <div className="bg-blue-600 dark:bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors shadow-sm dark:shadow-blue-500/20">
                    <Brain className="text-white w-6 h-6" />
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white hidden sm:block transition-colors">
                  Select<span className="text-blue-600 dark:text-blue-500">IA</span> 
                  <span className="text-[10px] text-slate-500 font-bold ml-1.5 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded transition-colors">Admin</span>
                </span>
              </Link>

              {/* Menú Desktop */}
              <nav className="hidden md:flex space-x-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        isActive 
                          ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shadow-sm dark:shadow-none' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* --- SECCIÓN DERECHA: Perfil y Controles --- */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Toggle Tema Claro/Oscuro */}
              <ThemeToggle />
              
              {/* Notificaciones */}
              <Link to="/admin/notifications" className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <Bell size={18} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full transition-colors"></span>
              </Link>
              
              <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block transition-colors"></div>

              {/* Perfil Admin */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">Super Admin</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold transition-colors">Acceso Total</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 dark:from-blue-600 dark:to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    SA
                </div>
                
                {/* Botón de Salir */}
                <Link 
                    to="/login" 
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }}
                    className="p-2 ml-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" 
                    title="Cerrar Sesión"
                >
                    <LogOut size={18} />
                </Link>
              </div>

              {/* Móvil Trigger */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú Móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 p-4 space-y-2 transition-colors shadow-lg">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
                      isActive
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;