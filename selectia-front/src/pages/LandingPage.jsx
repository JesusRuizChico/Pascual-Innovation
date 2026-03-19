// src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; 
import { 
  Search, MapPin, Brain, Menu, X, ChevronRight, Briefcase, Code, 
  Users, BarChart3, Building2, CheckCircle2, ArrowRight, CircleUser, 
  Sparkles, Linkedin, Twitter, Instagram, ShieldCheck, FileText 
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('candidato');
  const [modalContent, setModalContent] = useState(null);

  // Referencias para efectos Premium
  const cursorFollowerRef = useRef(null);
  const tiltRef = useRef(null);

  const categories = [
    { title: "Desarrollo de Software", count: "+1,200 vacantes", icon: <Code className="w-6 h-6" />, color: "text-blue-500 dark:text-blue-400", border: "hover:border-blue-300 dark:hover:border-blue-500/50" },
    { title: "Recursos Humanos", count: "+850 vacantes", icon: <Users className="w-6 h-6" />, color: "text-purple-500 dark:text-purple-400", border: "hover:border-purple-300 dark:hover:border-purple-500/50" },
    { title: "Ventas y Marketing", count: "+2,100 vacantes", icon: <BarChart3 className="w-6 h-6" />, color: "text-green-600 dark:text-green-400", border: "hover:border-green-300 dark:hover:border-green-500/50" },
    { title: "Ingeniería Industrial", count: "+930 vacantes", icon: <Building2 className="w-6 h-6" />, color: "text-orange-500 dark:text-orange-400", border: "hover:border-orange-300 dark:hover:border-orange-500/50" },
  ];

  const companies = [
    { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Apple", url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "IBM", url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { name: "Oracle", url: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
    { name: "Salesforce", url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
    { name: "Samsung", url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
    { name: "Spotify", url: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
    { name: "Uber", url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" },
    { name: "Tesla", url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png" },
    { name: "Intel", url: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg" },
    { name: "Meta", url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Nvidia", url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" },
    { name: "Slack", url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
    { name: "Adobe", url: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png" },
    { name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Visa", url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
    { name: "Airbnb", url: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg" }
  ];

  const handleOpenModal = (type) => {
      let content = { title: '', body: '' };
      switch(type) {
          case 'terms':
              content = { 
                  title: 'Términos y Condiciones', 
                  body: 'Bienvenido a SelectIA. Al utilizar nuestra plataforma, aceptas que tus datos serán procesados por nuestros algoritmos de IA para fines de reclutamiento. Garantizamos la confidencialidad de tu información personal y profesional.' 
              };
              break;
          case 'privacy':
              content = { 
                  title: 'Aviso de Privacidad', 
                  body: 'En SelectIA, nos tomamos muy en serio tu privacidad. Tus datos personales están encriptados y solo se comparten con empresas verificadas cuando te postulas a una vacante. Cumplimos con la normativa vigente de protección de datos.' 
              };
              break;
          default: return;
      }
      setModalContent(content);
  };

  // --- EFECTOS PREMIUM (Mouse, Intersección, Spotlight) ---
  useEffect(() => {
    // 1. Cursor Seguidor
    const moveCursor = (e) => {
      if (cursorFollowerRef.current) {
        // Interpolación manual ligera para suavidad (opcional, aquí uso posición directa con CSS transition)
        cursorFollowerRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);

    // 2. Intersection Observer (Animaciones al hacer scroll)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
    };
  }, []);

  // 3. Efecto Tilt 3D
  const handleTiltMove = (e) => {
    if (!tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltRef.current.style.transform = `perspective(1000px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleTiltLeave = () => {
    if (!tiltRef.current) return;
    tiltRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
  };

  // 4. Efecto Spotlight (Cards)
  const handleSpotlight = (e) => {
    const cards = document.querySelectorAll('.spotlight-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-200 font-sans selection:bg-brand-primary selection:text-white flex flex-col transition-colors duration-500 relative overflow-hidden"
      onMouseMove={handleSpotlight}
    >
      {/* --- CURSOR PREMIUM --- */}
      <div 
        ref={cursorFollowerRef} 
        className="pointer-events-none fixed top-0 left-0 w-8 h-8 rounded-full border border-brand-primary/50 bg-brand-primary/10 z-[9999] transition-transform duration-75 ease-out hidden lg:block backdrop-blur-sm"
      ></div>

      {/* --- AMBIENT BACKGROUND (MESH GRADIENT) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/10 dark:bg-blue-600/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[10000ms]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-purple-500/10 dark:bg-brand-primary/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[8000ms]"></div>
      </div>
      
      {/* --- NAVBAR (GLASSMORPHISM) --- */}
      <nav className="w-full bg-white/60 dark:bg-[#0a0f1c]/60 backdrop-blur-xl border-b border-white/20 dark:border-white/5 h-20 fixed top-0 z-50 transition-all duration-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-gradient-to-tr from-brand-primary to-blue-600 p-2 rounded-xl shadow-lg shadow-brand-primary/20 group-hover:scale-105 transition-transform">
                <Brain className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white transition-colors">
              Select<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-500">IA</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/register" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors">
                Soy Reclutador
            </Link>
            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors">Ayuda</Link>
            
            <div className="h-5 w-px bg-slate-300 dark:bg-white/10 transition-colors"></div>
            
            <ThemeToggle />

            <Link to="/register" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-white transition-colors">
                Regístrate
            </Link>
            
            <Link to="/login">
                <button className="relative overflow-hidden group bg-transparent border border-brand-primary/50 text-brand-primary dark:text-white px-6 py-2 rounded-full font-bold transition-all text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <span className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">Iniciar Sesión</span>
                </button>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900 dark:text-white p-2 transition-colors relative z-50">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Glassmorphism */}
        {isMenuOpen && (
            <div className="absolute top-20 left-0 w-full bg-white/90 dark:bg-[#0a0f1c]/90 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-2xl transition-all animate-in slide-in-from-top-4">
                <Link to="/register" className="block py-2 text-slate-700 dark:text-slate-200 hover:text-brand-primary transition-colors">Soy Reclutador</Link>
                <Link to="/register" className="block py-2 text-slate-700 dark:text-slate-200 hover:text-brand-primary transition-colors">Regístrate</Link>
                <Link to="/login" className="w-full bg-gradient-to-r from-brand-primary to-blue-600 py-3 rounded-xl font-bold text-white text-center shadow-lg shadow-brand-primary/20 block">
                    Iniciar Sesión
                </Link>
            </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 z-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight transition-colors reveal-on-scroll opacity-0 translate-y-10 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 duration-1000 ease-out">
            Encuentra el trabajo que <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-brand-primary to-purple-500">quieres y mereces</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto transition-colors reveal-on-scroll opacity-0 translate-y-10 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 duration-1000 delay-150 ease-out">
            La plataforma impulsada por IA que conecta tu talento con las empresas líderes de Querétaro y el Bajío.
          </p>

          {/* Search Bar Premium Glass */}
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto transform hover:scale-[1.01] transition-all duration-300 reveal-on-scroll opacity-0 translate-y-10 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 delay-300 ease-out">
            <div className="flex-1 flex items-center w-full px-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10 py-3">
              <Search className="text-brand-primary dark:text-blue-400 w-5 h-5 mr-3" />
              <input type="text" placeholder="Puesto, empresa o palabra clave" className="w-full outline-none text-slate-900 dark:text-white placeholder-slate-400 font-medium bg-transparent" />
            </div>
            <div className="flex-1 flex items-center w-full px-4 py-3">
              <MapPin className="text-brand-primary dark:text-blue-400 w-5 h-5 mr-3" />
              <input type="text" placeholder="Ciudad o Estado" className="w-full outline-none text-slate-900 dark:text-white placeholder-slate-400 font-medium bg-transparent" />
            </div>
            <Link to="/login" className="w-full md:w-auto">
                <button className="w-full bg-gradient-to-r from-brand-primary to-blue-600 hover:from-blue-600 hover:to-brand-primary text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-brand-primary/25 text-lg">
                Buscar
                </button>
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 transition-colors reveal-on-scroll opacity-0 [&.is-visible]:opacity-100 duration-1000 delay-500">
              <span className="hidden md:inline">Tendencias:</span>
              <span className="text-brand-primary dark:text-blue-400 cursor-pointer hover:underline transition-colors">Programador Java</span>
              <span className="text-brand-primary dark:text-blue-400 cursor-pointer hover:underline transition-colors">Ventas</span>
              <span className="text-brand-primary dark:text-blue-400 cursor-pointer hover:underline transition-colors">Contador</span>
          </div>
        </div>
      </div>

      {/* --- CARRUSEL DE LOGOS --- */}
      <div className="w-full bg-white/30 dark:bg-white/5 backdrop-blur-md border-y border-slate-200 dark:border-white/5 py-10 overflow-hidden transition-colors z-10">
        <p className="text-center text-slate-500 dark:text-slate-400 text-xs font-bold tracking-[0.2em] mb-10 uppercase transition-colors">
            Confían en nuestro talento
        </p>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-scroll whitespace-nowrap flex gap-20 items-center pl-10">
            {[...companies, ...companies].map((company, index) => (
              <img 
                key={index} 
                src={company.url} 
                alt={company.name} 
                className="h-8 w-auto object-contain opacity-40 hover:opacity-100 transition-all duration-500 grayscale dark:brightness-0 dark:invert dark:opacity-40 dark:hover:opacity-100 cursor-pointer hover:scale-110"
                title={company.name}
              />
            ))}
          </div>
          {/* Sombras laterales Premium */}
          <div className="absolute top-0 left-0 h-full w-40 bg-gradient-to-r from-slate-50 dark:from-[#0a0f1c] to-transparent z-10 transition-colors pointer-events-none"></div>
          <div className="absolute top-0 right-0 h-full w-40 bg-gradient-to-l from-slate-50 dark:from-[#0a0f1c] to-transparent z-10 transition-colors pointer-events-none"></div>
        </div>
      </div>

      {/* --- HISTORIA DE ÉXITO (TILT 3D) --- */}
      <div className="py-32 relative overflow-hidden transition-colors z-10">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                
                {/* Contenedor Tilt 3D */}
                <div 
                  className="relative group aspect-[4/3] flex items-center justify-center rounded-3xl reveal-on-scroll opacity-0 translate-x-[-50px] [&.is-visible]:opacity-100 [&.is-visible]:translate-x-0 duration-1000 ease-out"
                  onMouseMove={handleTiltMove}
                  onMouseLeave={handleTiltLeave}
                  style={{ perspective: '1000px' }}
                >
                  <div 
                    ref={tiltRef} 
                    className="w-full h-full flex items-center justify-center bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-3xl shadow-2xl transition-transform duration-200 ease-out overflow-hidden"
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand-primary/20 dark:bg-brand-primary/30 rounded-full blur-[80px] group-hover:bg-brand-primary/40 transition-all duration-700"></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center p-12 rounded-full bg-white/60 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.05)] transform-gpu" style={{ transform: 'translateZ(40px)' }}>
                        <CircleUser className="w-32 h-32 text-slate-800 dark:text-white opacity-90 transition-colors" strokeWidth={1} />
                        <div className="absolute -top-2 -right-2 text-brand-primary dark:text-blue-400 animate-pulse transition-colors" style={{ transform: 'translateZ(60px)' }}>
                            <Sparkles className="w-12 h-12" />
                        </div>
                    </div>
                  </div>
                </div>

                {/* Textos */}
                <div className="reveal-on-scroll opacity-0 translate-x-[50px] [&.is-visible]:opacity-100 [&.is-visible]:translate-x-0 duration-1000 delay-200 ease-out">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight transition-colors">
                        Comienza tu <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">historia de éxito</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed transition-colors">
                        En SelectIA, no solo buscas empleo; dejas que el empleo ideal te encuentre a ti. Nuestra Inteligencia Artificial analiza tu perfil y lo conecta instantáneamente con las vacantes.
                    </p>
                    <ul className="space-y-5 mb-10">
                        <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                            <CheckCircle2 className="text-brand-primary dark:text-blue-400 w-6 h-6 shrink-0 mt-0.5" />
                            <span className="text-slate-700 dark:text-slate-300 font-medium transition-colors">Crea tu CV digital en minutos.</span>
                        </li>
                        <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                            <CheckCircle2 className="text-brand-primary dark:text-blue-400 w-6 h-6 shrink-0 mt-0.5" />
                            <span className="text-slate-700 dark:text-slate-300 font-medium transition-colors">Recibe alertas personalizadas.</span>
                        </li>
                        <li className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                            <CheckCircle2 className="text-brand-primary dark:text-blue-400 w-6 h-6 shrink-0 mt-0.5" />
                            <span className="text-slate-700 dark:text-slate-300 font-medium transition-colors">Visibilidad ante más de 500 empresas.</span>
                        </li>
                    </ul>
                    
                    <Link to="/register">
                        <button className="relative overflow-hidden group bg-slate-900 dark:bg-white text-white dark:text-[#0a0f1c] px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                            <span className="relative z-10 flex items-center gap-2">
                              Crear mi cuenta gratis
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
      </div>

      {/* --- SECTORES (SPOTLIGHT CARDS) --- */}
      <div className="relative py-24 border-y border-slate-200 dark:border-white/5 transition-colors z-10 bg-slate-50/50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-10 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 duration-700">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Sectores con mayor demanda</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">Explora las áreas con más oportunidades de crecimiento en 2026</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <div 
                key={index} 
                className={`spotlight-card group relative bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-white/60 dark:border-white/10 p-8 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden shadow-sm dark:shadow-none hover:-translate-y-2 reveal-on-scroll opacity-0 translate-y-10 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Pseudo-elemento para el Spotlight interno */}
                <div 
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                  style={{ 
                    background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.15), transparent 40%)' 
                  }}
                />
                
                <div className="relative z-10">
                  <div className={`mb-6 p-4 rounded-xl bg-slate-100/80 dark:bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300 shadow-sm ${cat.color}`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">{cat.title}</h3>
                  <p className={`text-sm font-medium ${cat.color} opacity-80 mb-6 transition-colors`}>{cat.count}</p>
                  <Link to="/login" className="flex items-center text-slate-500 dark:text-slate-400 text-sm font-semibold group-hover:text-brand-primary dark:group-hover:text-blue-400 transition-colors">
                    Ver vacantes <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- PESTAÑAS AYUDA (GLASS PILLS) --- */}
      <div className="py-32 relative z-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 transition-colors reveal-on-scroll opacity-0 translate-y-10 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 duration-700">
              ¿Cómo te ayuda SelectIA?
            </h2>
            
            <div className="flex justify-center mb-16 reveal-on-scroll opacity-0 translate-y-10 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 duration-700 delay-100">
                <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md p-1.5 rounded-full inline-flex border border-white/60 dark:border-white/10 transition-colors shadow-lg">
                    <button 
                        onClick={() => setActiveTab('candidato')}
                        className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'candidato' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        Soy Candidato
                    </button>
                    <button 
                        onClick={() => setActiveTab('reclutador')}
                        className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'reclutador' ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        Soy Reclutador
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 reveal-on-scroll opacity-0 scale-95 [&.is-visible]:opacity-100 [&.is-visible]:scale-100 duration-700 delay-200">
                {activeTab === 'candidato' ? (
                    <>
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/60 dark:border-white/10 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_40px_rgba(255,255,255,0.02)]">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-500/20 dark:to-purple-500/5 rounded-xl flex items-center justify-center mx-auto mb-6 text-purple-600 dark:text-purple-400 shadow-inner"><Brain /></div>
                            <h3 className="text-xl text-slate-900 dark:text-white font-bold mb-3 transition-colors">Match con IA</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">Nuestro algoritmo analiza tu CV y te sugiere vacantes ideales.</p>
                        </div>
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/60 dark:border-white/10 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_40px_rgba(255,255,255,0.02)]">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-500/20 dark:to-blue-500/5 rounded-xl flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400 shadow-inner"><MapPin /></div>
                            <h3 className="text-xl text-slate-900 dark:text-white font-bold mb-3 transition-colors">Empleo Local</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">Vacantes cerca de tu domicilio en Querétaro y el Bajío.</p>
                        </div>
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/60 dark:border-white/10 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_40px_rgba(255,255,255,0.02)]">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-500/20 dark:to-green-500/5 rounded-xl flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400 shadow-inner"><BarChart3 /></div>
                            <h3 className="text-xl text-slate-900 dark:text-white font-bold mb-3 transition-colors">Salarios Claros</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">Conoce el rango salarial antes de postularte.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/60 dark:border-white/10 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_40px_rgba(255,255,255,0.02)]">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-500/20 dark:to-orange-500/5 rounded-xl flex items-center justify-center mx-auto mb-6 text-orange-600 dark:text-orange-400 shadow-inner"><Users /></div>
                            <h3 className="text-xl text-slate-900 dark:text-white font-bold mb-3 transition-colors">Base de Talentos</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">Acceso a miles de profesionales activos en la región.</p>
                        </div>
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/60 dark:border-white/10 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_40px_rgba(255,255,255,0.02)]">
                            <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-500/20 dark:to-pink-500/5 rounded-xl flex items-center justify-center mx-auto mb-6 text-pink-600 dark:text-pink-400 shadow-inner"><Briefcase /></div>
                            <h3 className="text-xl text-slate-900 dark:text-white font-bold mb-3 transition-colors">Gestión ATS</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">Organiza a tus candidatos por etapas en un solo panel.</p>
                        </div>
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/60 dark:border-white/10 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_40px_rgba(255,255,255,0.02)]">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-50 dark:from-cyan-500/20 dark:to-cyan-500/5 rounded-xl flex items-center justify-center mx-auto mb-6 text-cyan-600 dark:text-cyan-400 shadow-inner"><Brain /></div>
                            <h3 className="text-xl text-slate-900 dark:text-white font-bold mb-3 transition-colors">Filtrado Automático</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">Deja que la IA lea los CVs y te presente los mejores.</p>
                        </div>
                    </>
                )}
            </div>
          </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="relative bg-white/40 dark:bg-black/40 backdrop-blur-2xl py-16 border-t border-slate-200 dark:border-white/10 text-sm transition-colors z-10">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
                {/* Columna 1: Marca y Redes */}
                <div className="col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-brand-primary p-1.5 rounded-lg">
                          <Brain className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-2xl text-slate-900 dark:text-white transition-colors">SelectIA</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-xs transition-colors text-base">
                        La plataforma de reclutamiento inteligente que conecta el mejor talento con las empresas más innovadoras de México.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-12 h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all"><Linkedin size={20}/></a>
                        <a href="#" className="w-12 h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all"><Twitter size={20}/></a>
                        <a href="#" className="w-12 h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-pink-600 hover:text-white dark:hover:bg-pink-600 dark:hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all"><Instagram size={20}/></a>
                    </div>
                </div>

                {/* Columna 2: Candidatos */}
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-8 uppercase tracking-widest text-xs flex items-center gap-2 transition-colors">
                        <CircleUser size={16} className="text-brand-primary"/> Candidatos
                    </h4>
                    <ul className="space-y-4 text-slate-600 dark:text-slate-400 transition-colors text-base">
                        <li><Link to="/login" className="hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 hover:translate-x-2 duration-300">Buscar empleo</Link></li>
                        <li><Link to="/register" className="hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 hover:translate-x-2 duration-300">Crear cuenta gratis</Link></li>
                        <li><Link to="/login" className="hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-2 hover:translate-x-2 duration-300">Subir CV</Link></li>
                    </ul>
                </div>

                {/* Columna 3: Empresas */}
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-8 uppercase tracking-widest text-xs flex items-center gap-2 transition-colors">
                        <Briefcase size={16} className="text-blue-600 dark:text-blue-400 transition-colors"/> Empresas
                    </h4>
                    <ul className="space-y-4 text-slate-600 dark:text-slate-400 transition-colors text-base">
                        <li><Link to="/register" className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-2 hover:translate-x-2 duration-300">Publicar vacante</Link></li>
                        <li><Link to="/login" className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-2 hover:translate-x-2 duration-300">Ingreso Reclutadores</Link></li>
                        <li><Link to="/login" className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-2 hover:translate-x-2 duration-300">Soporte Empresarial</Link></li>
                    </ul>
                </div>
            </div>

            {/* Barra Inferior (Legales Funcionales) */}
            <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-500 gap-4 transition-colors">
                <p>© 2026 Innovation Pascual S.A. de C.V. Todos los derechos reservados.</p>
                <div className="flex flex-wrap gap-8 justify-center">
                    <button onClick={() => handleOpenModal('privacy')} className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors flex items-center gap-1.5 font-medium">
                        <ShieldCheck size={16}/> Aviso de Privacidad
                    </button>
                    <button onClick={() => handleOpenModal('terms')} className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors flex items-center gap-1.5 font-medium">
                        <FileText size={16}/> Términos y Condiciones
                    </button>
                </div>
            </div>
        </div>
      </footer>

      {/* --- MODAL FLOTANTE (Legales Premium) --- */}
      {modalContent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-white/90 dark:bg-[#0a0f1c]/90 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.2)] max-w-lg w-full p-10 relative transition-all scale-100 animate-in zoom-in-95 duration-300">
                  <button onClick={() => setModalContent(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 p-2 rounded-full transition-colors hover:rotate-90">
                      <X size={20} />
                  </button>
                  <div className="flex items-center gap-4 mb-8">
                      <div className="p-4 bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 rounded-2xl text-brand-primary shadow-inner transition-colors">
                          <ShieldCheck size={28} />
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white transition-colors">{modalContent.title}</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-10 transition-colors">
                      {modalContent.body}
                  </p>
                  <button onClick={() => setModalContent(null)} className="w-full py-4 bg-gradient-to-r from-brand-primary to-blue-600 hover:from-blue-600 hover:to-brand-primary text-white rounded-2xl font-bold text-base transition-all shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:-translate-y-1">
                      Entendido
                  </button>
              </div>
          </div>
      )}

    </div>
  );
}

export default LandingPage;