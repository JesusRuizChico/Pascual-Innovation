// src/layouts/CandidateLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Brain, Home, Search, FileText, Bell, Menu, X, ChevronDown, HelpCircle, LogOut 
} from 'lucide-react';
import axios from '../api/axios';
import ChatAssistant from '../components/ChatAssistant';
import ThemeToggle from '../components/ThemeToggle'; // <--- AGREGADO

const CandidateLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // ESTADO: Datos del usuario
  const [userData, setUserData] = useState({
      name: 'Cargando...',
      photo_url: null,
      initial: 'U'
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Función para cargar datos frescos de la BD
  const fetchUserData = async () => {
    try {
        const localUser = JSON.parse(localStorage.getItem('user'));
        let currentName = localUser?.name || 'Usuario';
        let currentInitial = localUser?.name ? localUser.name.charAt(0).toUpperCase() : 'U';
        let currentPhoto = null;

        try {
            const profileRes = await axios.get('/candidates/me');
            if (profileRes.data) {
                currentName = profileRes.data.full_name;
                currentInitial = profileRes.data.full_name.charAt(0).toUpperCase();
                if (profileRes.data.photo_url) {
                    currentPhoto = profileRes.data.photo_url;
                    console.log("Foto cargada desde BD:", currentPhoto);
                }
            }
        } catch (err) {
            console.log("No se pudo cargar perfil extendido (puede que sea nuevo usuario)");
        }

        try {
            const notifRes = await axios.get('/notifications');
            setUnreadCount(notifRes.data.filter(n => !n.read).length);
        } catch (err) { /* Ignorar error notif */ }

        setUserData({
            name: currentName,
            photo_url: currentPhoto,
            initial: currentInitial
        });

    } catch (error) {
        console.error("Error crítico en layout:", error);
    }
  };

  useEffect(() => {
    fetchUserData();

    const handleProfileUpdate = () => fetchUserData();
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [location.pathname]);

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
  };

  const navLinks = [
    { name: 'Inicio', path: '/candidate/dashboard', icon: <Home size={18} /> },
    { name: 'Buscar Empleo', path: '/candidate/search', icon: <Search size={18} /> },
    { name: 'Mi CV', path: '/candidate/cv', icon: <FileText size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark font-sans text-slate-900 dark:text-slate-200 flex flex-col transition-colors duration-300">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-brand-dark/80 backdrop-blur-lg border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/candidate/dashboard" className="flex items-center gap-2">
                <Brain className="text-brand-primary w-8 h-8" />
                <span className="font-bold text-xl text-slate-900 dark:text-white hidden sm:block">
                  Select<span className="text-brand-primary">IA</span>
                </span>
              </Link>

              <nav className="hidden md:flex space-x-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link key={link.path} to={link.path} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive ? 'bg-brand-primary/10 dark:bg-brand-surface text-brand-primary border border-brand-primary/20' : 'text-slate-600 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                      {link.icon}{link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Menú Derecho */}
            <div className="flex items-center gap-4">
              
              <ThemeToggle />

              <Link to="/candidate/notifications" className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white transition-colors">
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-brand-dark animate-pulse"></span>}
              </Link>

              <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>

              {/* Dropdown Perfil */}
              <div className="relative">
                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 focus:outline-none group">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
                        {userData.name}
                    </p>
                  </div>
                  
                  {/* FOTO DE PERFIL */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-blue-600 p-[1px]">
                    <div className="w-full h-full rounded-full bg-white dark:bg-brand-dark flex items-center justify-center overflow-hidden">
                        {userData.photo_url ? (
                            <img 
                                src={userData.photo_url} 
                                alt="Perfil" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.log("Error cargando imagen:", userData.photo_url);
                                    e.target.style.display='none';
                                }} 
                            />
                        ) : null}
                        <span className={`font-bold text-xs text-slate-900 dark:text-white ${userData.photo_url ? 'absolute -z-10' : ''}`}>
                            {userData.initial}
                        </span>
                    </div>
                  </div>
                  <ChevronDown size={16} className="text-slate-500 hidden sm:block" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl py-1 z-50">
                    <Link to="/candidate/profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-brand-primary dark:hover:text-white">Configurar cuenta</Link>
                    <Link to="/candidate/help" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-brand-primary dark:hover:text-white">Ayuda</Link>
                    <div className="border-t border-slate-200 dark:border-white/10 my-1"></div>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <LogOut size={14}/> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-500 dark:text-slate-400">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-brand-surface border-t border-slate-200 dark:border-white/10 p-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-brand-primary dark:hover:text-white">
                {link.icon}{link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-brand-dark pt-8 pb-12 transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-6">
            <Link to="/candidate/help">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-700 dark:text-blue-200 hover:text-brand-primary dark:hover:text-white transition-colors">
                <HelpCircle size={18} /><span>Centro de ayuda</span>
              </button>
            </Link>
            <div className="text-[11px] text-slate-500 dark:text-slate-600"><p>SelectIA D.R. © 2026 Innovation Pascual S.A. de C.V.</p></div>
        </div>
      </footer>
      <ChatAssistant />
    </div>
  );
};

export default CandidateLayout;