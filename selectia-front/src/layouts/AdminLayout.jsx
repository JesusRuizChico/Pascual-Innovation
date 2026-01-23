// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Brain, 
  LayoutGrid, 
  ShieldCheck, 
  CreditCard, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Bell
} from 'lucide-react';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Vista General', path: '/admin/dashboard', icon: <LayoutGrid size={18} /> },
    { name: 'Validar Empresas', path: '/admin/validate', icon: <ShieldCheck size={18} /> },
    { name: 'Ingresos', path: '/admin/revenue', icon: <CreditCard size={18} /> },
    { name: 'Usuarios', path: '/admin/users', icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 flex flex-col">
      
      {/* NAVBAR ADMIN (Acento Naranja) */}
      <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-orange-500/30 shadow-lg shadow-orange-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Admin */}
            <div className="flex items-center gap-8">
              <Link to="/admin/dashboard" className="flex items-center gap-2 group">
                <div className="bg-orange-600 p-1.5 rounded-lg group-hover:bg-orange-500 transition-colors">
                    <Brain className="text-white w-6 h-6" />
                </div>
                <span className="font-bold text-xl text-white hidden sm:block">
                  Select<span className="text-orange-500">IA</span> <span className="text-xs text-slate-500 font-normal ml-1 uppercase tracking-wider">Admin</span>
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
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Perfil Admin */}
            <div className="flex items-center gap-4">
              
              {/* --- MODIFICADO: Ahora es un Link a Notificaciones --- */}
              <Link to="/admin/notifications" className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
              </Link>
              
              <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white">Super Admin</p>
                    <p className="text-[10px] text-orange-400">Acceso Total</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    SA
                </div>
                <Link to="/login" className="p-2 text-slate-500 hover:text-red-400 transition-colors" title="Salir">
                    <LogOut size={18} />
                </Link>
              </div>

              {/* Móvil Trigger */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú Móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-white/10 p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;