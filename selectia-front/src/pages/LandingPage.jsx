// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { 
  Search, MapPin, Brain, Menu, X, ChevronRight, Briefcase, Code, 
  Users, BarChart3, Building2, CheckCircle2, ArrowRight, CircleUser, 
  Sparkles, Linkedin, Twitter, Instagram, ShieldCheck, FileText 
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('candidato');
  
  // Estado para el Modal de Legales (Igual que en el Layout)
  const [modalContent, setModalContent] = useState(null);

  // Datos simulados (Categorías)
  const categories = [
    { title: "Desarrollo de Software", count: "+1,200 vacantes", icon: <Code className="w-6 h-6" />, color: "text-blue-400", border: "hover:border-blue-500/50" },
    { title: "Recursos Humanos", count: "+850 vacantes", icon: <Users className="w-6 h-6" />, color: "text-purple-400", border: "hover:border-purple-500/50" },
    { title: "Ventas y Marketing", count: "+2,100 vacantes", icon: <BarChart3 className="w-6 h-6" />, color: "text-green-400", border: "hover:border-green-500/50" },
    { title: "Ingeniería Industrial", count: "+930 vacantes", icon: <Building2 className="w-6 h-6" />, color: "text-orange-400", border: "hover:border-orange-500/50" },
  ];

  // --- LOGOS DE EMPRESAS (Lista Ampliada) ---
  const companies = [
    { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "IBM", url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { name: "Oracle", url: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
    { name: "Samsung", url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
    { name: "Spotify", url: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
    { name: "Tesla", url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png" },
    { name: "Intel", url: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg" },
    { name: "Meta", url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Nvidia", url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" },
    { name: "Adobe", url: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png" },
    { name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Airbnb", url: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg" }
  ];

  // --- LÓGICA DEL MODAL ---
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

  return (
    <div className="min-h-screen bg-brand-dark text-slate-200 font-sans selection:bg-brand-primary selection:text-white flex flex-col">
      
      {/* --- NAVBAR --- */}
      <nav className="w-full bg-brand-dark/90 backdrop-blur-md border-b border-white/5 h-20 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-gradient-to-tr from-brand-primary to-blue-600 p-2 rounded-lg">
                <Brain className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              Select<span className="text-brand-primary">IA</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/register" className="text-sm font-medium hover:text-white transition-colors">
                Soy Reclutador
            </Link>
            {/* El botón de ayuda ahora puede abrir el modal de contacto o llevar al login si es ayuda técnica */}
            <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Ayuda</Link>
            
            <div className="h-5 w-px bg-white/10"></div>
            
            <Link to="/register" className="text-sm font-medium hover:text-white transition-colors">
                Regístrate
            </Link>
            
            <Link to="/login">
                <button className="bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-6 py-2 rounded-full font-bold transition-all text-sm">
                Iniciar Sesión
                </button>
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
            <div className="absolute top-20 left-0 w-full bg-brand-surface border-b border-white/10 p-4 flex flex-col gap-4 md:hidden shadow-2xl">
                <Link to="/register" className="block py-2 hover:text-brand-primary transition-colors">Soy Reclutador</Link>
                <Link to="/register" className="block py-2 hover:text-brand-primary transition-colors">Regístrate</Link>
                <Link to="/login" className="w-full bg-brand-primary py-3 rounded-lg font-bold text-white text-center block">
                    Iniciar Sesión
                </Link>
            </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Encuentra el trabajo que <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-brand-primary">quieres y mereces</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            La plataforma impulsada por IA que conecta tu talento con las empresas líderes de Querétaro y el Bajío.
          </p>

          <div className="bg-white p-2 rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex-1 flex items-center w-full px-4 border-b md:border-b-0 md:border-r border-gray-200 py-3">
              <Search className="text-brand-primary w-5 h-5 mr-3" />
              <input type="text" placeholder="Puesto, empresa o palabra clave" className="w-full outline-none text-gray-800 placeholder-gray-400 font-medium" />
            </div>
            <div className="flex-1 flex items-center w-full px-4 py-3">
              <MapPin className="text-brand-primary w-5 h-5 mr-3" />
              <input type="text" placeholder="Ciudad o Estado" className="w-full outline-none text-gray-800 placeholder-gray-400 font-medium" />
            </div>
            <Link to="/login" className="w-full md:w-auto">
                <button className="w-full bg-brand-primary hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg text-lg">
                Buscar
                </button>
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-sm text-slate-500">
              <span className="hidden md:inline">Tendencias:</span>
              <span className="text-brand-secondary cursor-pointer hover:underline">Programador Java</span>
              <span className="text-brand-secondary cursor-pointer hover:underline">Ventas</span>
              <span className="text-brand-secondary cursor-pointer hover:underline">Contador</span>
          </div>
        </div>
      </div>

      {/* --- CARRUSEL DE LOGOS (ACTUALIZADO CON MÁS EMPRESAS) --- */}
      <div className="w-full bg-brand-surface/50 border-y border-white/5 py-10 overflow-hidden">
        <p className="text-center text-slate-500 text-xs font-bold tracking-[0.2em] mb-10 uppercase">
            Confían en nuestro talento
        </p>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-scroll whitespace-nowrap flex gap-20 items-center pl-10">
            {/* Renderizamos la lista dos veces para el efecto infinito */}
            {[...companies, ...companies].map((company, index) => (
              <img 
                key={index} 
                src={company.url} 
                alt={company.name} 
                className="h-8 w-auto object-contain opacity-50 hover:opacity-100 transition-all duration-300 grayscale brightness-0 invert cursor-pointer"
                title={company.name}
              />
            ))}
          </div>
          {/* Sombras laterales */}
          <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-brand-dark to-transparent z-10"></div>
          <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-brand-dark to-transparent z-10"></div>
        </div>
      </div>

      {/* --- HISTORIA DE ÉXITO --- */}
      <div className="py-24 bg-brand-dark relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                
                <div className="relative group aspect-[4/3] flex items-center justify-center bg-brand-surface/30 rounded-3xl border border-white/10 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-brand-primary/20 rounded-full blur-[100px] group-hover:bg-brand-primary/30 transition-all duration-1000"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center p-10 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/20 backdrop-blur-sm shadow-2xl shadow-brand-primary/20 group-hover:scale-105 transition-transform">
                        <CircleUser className="w-32 h-32 text-white opacity-90" strokeWidth={1.5} />
                        <div className="absolute -top-4 -right-4 text-brand-accent animate-pulse">
                            <Sparkles className="w-12 h-12" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-brand-dark/50 to-transparent"></div>
                </div>

                <div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Comienza tu <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-secondary">historia de éxito</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                        En SelectIA, no solo buscas empleo; dejas que el empleo ideal te encuentre a ti. Nuestra Inteligencia Artificial analiza tu perfil y lo conecta instantáneamente con las vacantes.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="text-brand-primary w-6 h-6 shrink-0" />
                            <span className="text-slate-300">Crea tu CV digital en minutos.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="text-brand-primary w-6 h-6 shrink-0" />
                            <span className="text-slate-300">Recibe alertas personalizadas.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="text-brand-primary w-6 h-6 shrink-0" />
                            <span className="text-slate-300">Visibilidad ante más de 500 empresas.</span>
                        </li>
                    </ul>
                    
                    <Link to="/register">
                        <button className="bg-white text-brand-dark hover:bg-brand-accent hover:text-white px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2 group">
                            Crear mi cuenta gratis
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
      </div>

      {/* --- SECTORES --- */}
      <div className="bg-brand-surface py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Sectores con mayor demanda</h2>
            <p className="text-slate-400">Explora las áreas con más oportunidades de crecimiento en 2026</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <div key={index} className={`bg-brand-dark border border-white/5 p-8 rounded-2xl transition-all duration-300 group cursor-pointer border-l-4 border-l-transparent ${cat.border}`}>
                <div className={`mb-6 p-3 rounded-lg bg-white/5 w-fit group-hover:bg-white/10 transition-colors ${cat.color}`}>
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
                <p className={`text-sm font-medium ${cat.color} opacity-80 mb-4`}>{cat.count}</p>
                <Link to="/login" className="flex items-center text-slate-500 text-sm font-medium group-hover:text-white transition-colors">
                  Ver vacantes <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- PESTAÑAS AYUDA (Contenido resumido) --- */}
      <div className="py-24 bg-brand-dark">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-10">¿Cómo te ayuda SelectIA?</h2>
            <div className="flex justify-center mb-12">
                <div className="bg-brand-surface p-1 rounded-full inline-flex border border-white/10">
                    <button 
                        onClick={() => setActiveTab('candidato')}
                        className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'candidato' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Soy Candidato
                    </button>
                    <button 
                        onClick={() => setActiveTab('reclutador')}
                        className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'reclutador' ? 'bg-brand-secondary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Soy Reclutador
                    </button>
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {activeTab === 'candidato' ? (
                    <>
                        <div className="bg-brand-surface/50 p-6 rounded-xl border border-white/5">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-purple-400"><Brain /></div>
                            <h3 className="text-white font-bold mb-2">Match con IA</h3>
                            <p className="text-slate-400 text-sm">Nuestro algoritmo analiza tu CV y te sugiere vacantes ideales.</p>
                        </div>
                        <div className="bg-brand-surface/50 p-6 rounded-xl border border-white/5">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-400"><MapPin /></div>
                            <h3 className="text-white font-bold mb-2">Empleo Local</h3>
                            <p className="text-slate-400 text-sm">Vacantes cerca de tu domicilio en Querétaro y el Bajío.</p>
                        </div>
                        <div className="bg-brand-surface/50 p-6 rounded-xl border border-white/5">
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-green-400"><BarChart3 /></div>
                            <h3 className="text-white font-bold mb-2">Salarios Claros</h3>
                            <p className="text-slate-400 text-sm">Conoce el rango salarial antes de postularte.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-brand-surface/50 p-6 rounded-xl border border-white/5">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-orange-400"><Users /></div>
                            <h3 className="text-white font-bold mb-2">Base de Talentos</h3>
                            <p className="text-slate-400 text-sm">Acceso a miles de profesionales activos en la región.</p>
                        </div>
                        <div className="bg-brand-surface/50 p-6 rounded-xl border border-white/5">
                            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-pink-400"><Briefcase /></div>
                            <h3 className="text-white font-bold mb-2">Gestión ATS</h3>
                            <p className="text-slate-400 text-sm">Organiza a tus candidatos por etapas en un solo panel.</p>
                        </div>
                        <div className="bg-brand-surface/50 p-6 rounded-xl border border-white/5">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-cyan-400"><Brain /></div>
                            <h3 className="text-white font-bold mb-2">Filtrado Automático</h3>
                            <p className="text-slate-400 text-sm">Deja que la IA lea los CVs y te presente los mejores.</p>
                        </div>
                    </>
                )}
            </div>
          </div>
      </div>

      {/* --- FOOTER OPTIMIZADO --- */}
      <footer className="bg-black py-12 border-t border-white/10 text-sm">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
                {/* Columna 1: Marca y Redes */}
                <div className="col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <Brain className="text-brand-primary w-6 h-6" />
                        <span className="font-bold text-xl text-white">SelectIA</span>
                    </div>
                    <p className="text-slate-500 mb-6 leading-relaxed max-w-xs">
                        La plataforma de reclutamiento inteligente que conecta el mejor talento con las empresas más innovadoras de México.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"><Linkedin size={18}/></a>
                        <a href="#" className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all"><Twitter size={18}/></a>
                        <a href="#" className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all"><Instagram size={18}/></a>
                    </div>
                </div>

                {/* Columna 2: Candidatos (Links Funcionales) */}
                <div>
                    <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
                        <CircleUser size={14} className="text-brand-primary"/> Candidatos
                    </h4>
                    <ul className="space-y-3 text-slate-500">
                        <li><Link to="/login" className="hover:text-white transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Buscar empleo</Link></li>
                        <li><Link to="/register" className="hover:text-white transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Crear cuenta gratis</Link></li>
                        <li><Link to="/login" className="hover:text-white transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Subir CV</Link></li>
                    </ul>
                </div>

                {/* Columna 3: Empresas (Links Funcionales) */}
                <div>
                    <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
                        <Briefcase size={14} className="text-brand-secondary"/> Empresas
                    </h4>
                    <ul className="space-y-3 text-slate-500">
                        <li><Link to="/register" className="hover:text-white transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Publicar vacante</Link></li>
                        <li><Link to="/login" className="hover:text-white transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Ingreso Reclutadores</Link></li>
                        <li><Link to="/login" className="hover:text-white transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Soporte Empresarial</Link></li>
                    </ul>
                </div>

            </div>

            {/* Barra Inferior (Legales Funcionales) */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 gap-4">
                <p>© 2025 Innovation Pascual S.A. de C.V. Todos los derechos reservados.</p>
                <div className="flex flex-wrap gap-6 justify-center">
                    <button onClick={() => handleOpenModal('privacy')} className="hover:text-slate-300 transition-colors flex items-center gap-1">
                        <ShieldCheck size={14}/> Aviso de Privacidad
                    </button>
                    <button onClick={() => handleOpenModal('terms')} className="hover:text-slate-300 transition-colors flex items-center gap-1">
                        <FileText size={14}/> Términos y Condiciones
                    </button>
                </div>
            </div>
        </div>
      </footer>

      {/* --- MODAL FLOTANTE (Legales) --- */}
      {modalContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
                  <button onClick={() => setModalContent(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 p-1 rounded-full">
                      <X size={20} />
                  </button>
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-brand-primary/20 rounded-xl text-brand-primary">
                          <ShieldCheck size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{modalContent.title}</h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-8">
                      {modalContent.body}
                  </p>
                  <button onClick={() => setModalContent(null)} className="w-full py-3 bg-brand-primary hover:bg-violet-600 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-brand-primary/20">
                      Entendido
                  </button>
              </div>
          </div>
      )}

    </div>
  );
}

export default LandingPage;