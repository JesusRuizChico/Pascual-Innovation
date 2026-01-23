// src/layouts/RecruiterLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Brain, LayoutDashboard, Briefcase, Users, PlusCircle, Bell, Menu, X, ChevronDown, Building2, HelpCircle 
} from 'lucide-react';
import ChatAssistant from '../components/ChatAssistant';

const RecruiterLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null); // Estado para el modal flotante (Legales)

  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/recruiter/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Mis Vacantes', path: '/recruiter/vacancies', icon: <Briefcase size={18} /> },
    { name: 'Candidatos', path: '/recruiter/candidates', icon: <Users size={18} /> },
  ];

  // --- CONTENIDO DE MODALES (Para términos y privacidad) ---
  const handleOpenModal = (type) => {
      let content = { title: '', body: '' };
      switch(type) {
          case 'terms':
              content = { 
                  title: 'Términos de Servicio B2B', 
                  body: 'Al utilizar SelectIA Empresas, aceptas nuestros términos de uso corporativo. Nos comprometemos a proteger la confidencialidad de tus vacantes y procesos de selección. El uso indebido de los datos de candidatos resultará en la suspensión inmediata de la cuenta corporativa.' 
              };
              break;
          case 'privacy':
              content = { 
                  title: 'Política de Privacidad', 
                  body: 'Tus datos empresariales y la información de tus candidatos están encriptados bajo estándares bancarios. No compartimos información con terceros sin tu consentimiento. Cumplimos estrictamente con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.' 
              };
              break;
          default: return;
      }
      setModalContent(content);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 flex flex-col relative">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/recruiter/dashboard" className="flex items-center gap-2 group">
                <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors">
                    <Brain className="text-white w-6 h-6" />
                </div>
                <span className="font-bold text-xl text-white hidden sm:block">
                  Select<span className="text-blue-500">IA</span> <span className="text-xs text-slate-500 font-normal ml-1">Empresas</span>
                </span>
              </Link>
              <nav className="hidden md:flex space-x-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link key={link.path} to={link.path} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                      {link.icon} {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/recruiter/post-job" className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-900/20">
                <PlusCircle size={16} /> <span className="hidden lg:inline">Publicar Vacante</span>
              </Link>
              
              <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
              
              <Link to="/recruiter/notifications" className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
              </Link>
              
              <div className="relative">
                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 focus:outline-none">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white">Innovation Pascual</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Plan Premium</p>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                    <Building2 size={18} />
                  </div>
                  <ChevronDown size={16} className="text-slate-500 hidden sm:block" />
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm text-white font-bold">Innovation Pascual S.A.</p>
                        <p className="text-xs text-slate-500">RFC: IPX990101AAA</p>
                    </div>
                    {/* --- MENÚ LIMPIO --- */}
                    <Link to="/recruiter/settings" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5">Configuración de Empresa</Link>
                    <Link to="/recruiter/help" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5">Soporte para Empresas</Link>
                    
                    <div className="border-t border-white/5 my-1"></div>
                    <Link to="/login" className="block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">Cerrar Sesión</Link>
                  </div>
                )}
              </div>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-white/10 p-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>
                {link.icon} {link.name}
              </Link>
            ))}
            <Link to="/recruiter/post-job" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600/20 text-blue-400 font-bold mt-4" onClick={() => setIsMobileMenuOpen(false)}>
                <PlusCircle size={18} /> Publicar Vacante
            </Link>
          </div>
        )}
      </header>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-white/5 bg-slate-950 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Botón Soporte Principal (Redirige a la página) */}
            <Link 
                to="/recruiter/help"
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 rounded-lg text-sm text-blue-200 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all shadow-sm"
            >
              <HelpCircle size={18} />
              <span className="font-medium">Soporte para Empresas</span>
            </Link>

            {/* Enlaces Legales */}
            <div className="flex flex-wrap gap-4 md:gap-8 text-xs text-slate-500">
              <button onClick={() => handleOpenModal('terms')} className="hover:text-blue-400 transition-colors cursor-pointer">Términos de servicio B2B</button>
              <span className="hidden md:block text-slate-700">|</span>
              <button onClick={() => handleOpenModal('privacy')} className="hover:text-blue-400 transition-colors cursor-pointer">Política de privacidad</button>
              <span className="hidden md:block text-slate-700">|</span>
              <Link to="/recruiter/help" className="hover:text-blue-400 transition-colors">Centro de ayuda</Link>
            </div>
          </div>
          <div className="mt-8 text-[11px] text-slate-600 border-t border-white/5 pt-6">
            <p>SelectIA Empresas D.R. © 2023-2026 Innovation Pascual S.A. de C.V. Derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* MODAL FLOTANTE (Para Legales) */}
      {modalContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                  <button 
                      onClick={() => setModalContent(null)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white"
                  >
                      <X size={20} />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                          <Building2 size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white">{modalContent.title}</h3>
                  </div>
                  
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {modalContent.body}
                  </p>

                  <button 
                      onClick={() => setModalContent(null)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-colors"
                  >
                      Entendido
                  </button>
              </div>
          </div>
      )}

      <ChatAssistant />
    </div>
  );
};

export default RecruiterLayout;