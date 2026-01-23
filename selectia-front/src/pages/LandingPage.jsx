// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importamos Link para navegar
import { Search, MapPin, Brain, Menu, X, ChevronRight, Briefcase, Code, Users, BarChart3, Building2, CheckCircle2, ArrowRight, CircleUser, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('candidato');

  // Datos simulados (Categorías)
  const categories = [
    { title: "Desarrollo de Software", count: "+1,200 vacantes", icon: <Code className="w-6 h-6" />, color: "text-blue-400", border: "hover:border-blue-500/50" },
    { title: "Recursos Humanos", count: "+850 vacantes", icon: <Users className="w-6 h-6" />, color: "text-purple-400", border: "hover:border-purple-500/50" },
    { title: "Ventas y Marketing", count: "+2,100 vacantes", icon: <BarChart3 className="w-6 h-6" />, color: "text-green-400", border: "hover:border-green-500/50" },
    { title: "Ingeniería Industrial", count: "+930 vacantes", icon: <Building2 className="w-6 h-6" />, color: "text-orange-400", border: "hover:border-orange-500/50" },
  ];

  // Empresas para el carrusel
  const companies = ["Google", "Microsoft", "Tesla", "Amazon", "Samsung", "Oracle", "IBM", "Intel", "SpaceX", "Meta", "Nvidia", "AMD"];

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
            {/* LINK ACTUALIZADO: Soy Reclutador -> Lleva a registro (donde pueden elegir rol) */}
            <Link to="/register" className="text-sm font-medium hover:text-white transition-colors">
                Soy Reclutador
            </Link>
            
            <a href="#" className="text-sm font-medium hover:text-white transition-colors">Ayuda</a>
            
            <div className="h-5 w-px bg-white/10"></div>
            
            {/* LINK ACTUALIZADO: Regístrate -> Lleva a /register */}
            <Link to="/register" className="text-sm font-medium hover:text-white transition-colors">
                Regístrate
            </Link>
            
            {/* Botón Login que redirige */}
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
        
        {/* Menú Móvil */}
        {isMenuOpen && (
            <div className="absolute top-20 left-0 w-full bg-brand-surface border-b border-white/10 p-4 flex flex-col gap-4 md:hidden shadow-2xl">
                {/* LINKS ACTUALIZADOS EN MÓVIL */}
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
            <button className="w-full md:w-auto bg-brand-primary hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg text-lg">
              Buscar
            </button>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-sm text-slate-500">
             <span className="hidden md:inline">Tendencias:</span>
             <span className="text-brand-secondary cursor-pointer hover:underline">Programador Java</span>
             <span className="text-brand-secondary cursor-pointer hover:underline">Ventas</span>
             <span className="text-brand-secondary cursor-pointer hover:underline">Contador</span>
          </div>
        </div>
      </div>

      {/* --- CARRUSEL --- */}
      <div className="w-full bg-brand-surface/50 border-y border-white/5 py-10 overflow-hidden">
        <p className="text-center text-slate-500 text-xs font-bold tracking-[0.2em] mb-8 uppercase">Confían en nuestro talento</p>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-scroll whitespace-nowrap flex gap-16 items-center">
            {[...companies, ...companies].map((company, index) => (
              <span key={index} className="text-2xl md:text-3xl font-bold text-slate-600 hover:text-white transition-colors cursor-default">
                {company}
              </span>
            ))}
          </div>
          <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-brand-dark to-transparent z-10"></div>
          <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-brand-dark to-transparent z-10"></div>
        </div>
      </div>

      {/* --- HISTORIA DE ÉXITO --- */}
      <div className="py-24 bg-brand-dark relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                
                {/* Avatar Abstracto */}
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

                {/* Texto Persuasivo */}
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Comienza tu <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-secondary">historia de éxito</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                        En SelectIA, no solo buscas empleo; dejas que el empleo ideal te encuentre a ti. Nuestra Inteligencia Artificial analiza tu perfil y lo conecta instantáneamente con las vacantes que encajan con tus habilidades y expectativas salariales.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="text-brand-primary w-6 h-6 shrink-0" />
                            <span className="text-slate-300">Crea tu CV digital en minutos.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="text-brand-primary w-6 h-6 shrink-0" />
                            <span className="text-slate-300">Recibe alertas personalizadas por WhatsApp.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="text-brand-primary w-6 h-6 shrink-0" />
                            <span className="text-slate-300">Visibilidad ante más de 500 empresas.</span>
                        </li>
                    </ul>
                    
                    {/* LINK ACTUALIZADO: Botón principal lleva a registro */}
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
                <div className="flex items-center text-slate-500 text-sm font-medium group-hover:text-white transition-colors">
                  Ver vacantes <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- PESTAÑAS AYUDA --- */}
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
                        <div className="bg-brand-surface/50 p-6 rounded-xl border border-white/5 hover:border-brand-primary/30 transition-colors">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-purple-400"><Brain /></div>
                            <h3 className="text-white font-bold mb-2">Match con IA</h3>
                            <p className="text-slate-400 text-sm">Nuestro algoritmo analiza tu CV y te sugiere solo las vacantes donde tienes altas probabilidades.</p>
                        </div>
                        <div className="bg-brand-surface/50 p-6 rounded-xl border border-white/5 hover:border-brand-primary/30 transition-colors">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-400"><MapPin /></div>
                            <h3 className="text-white font-bold mb-2">Empleo Local</h3>
                            <p className="text-slate-400 text-sm">Filtros especializados para encontrar vacantes cerca de tu domicilio en Querétaro.</p>
                        </div>
                        <div className="bg-brand-surface/50 p-6 rounded-xl border border-white/5 hover:border-brand-primary/30 transition-colors">
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-green-400"><BarChart3 /></div>
                            <h3 className="text-white font-bold mb-2">Salarios Claros</h3>
                            <p className="text-slate-400 text-sm">Conoce el rango salarial antes de postularte y compara con el mercado.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-brand-surface/50 p-6 rounded-xl border border-white/5 hover:border-brand-secondary/30 transition-colors">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-orange-400"><Users /></div>
                            <h3 className="text-white font-bold mb-2">Base de Talentos</h3>
                            <p className="text-slate-400 text-sm">Accede a una base de datos de más de 10,000 profesionales activos en la región.</p>
                        </div>
                        <div className="bg-brand-surface/50 p-6 rounded-xl border border-white/5 hover:border-brand-secondary/30 transition-colors">
                            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-pink-400"><Briefcase /></div>
                            <h3 className="text-white font-bold mb-2">Gestión ATS</h3>
                            <p className="text-slate-400 text-sm">Organiza a tus candidatos por etapas (entrevista, pruebas, contratado) en un solo panel.</p>
                        </div>
                        <div className="bg-brand-surface/50 p-6 rounded-xl border border-white/5 hover:border-brand-secondary/30 transition-colors">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-cyan-400"><Brain /></div>
                            <h3 className="text-white font-bold mb-2">Filtrado Automático</h3>
                            <p className="text-slate-400 text-sm">Deja que la IA lea los CVs por ti y te presente solo a los mejores 5 candidatos.</p>
                        </div>
                    </>
                )}
            </div>
          </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-black py-16 border-t border-white/10 text-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-2 mb-6">
                <Brain className="text-brand-primary w-6 h-6" />
                <span className="font-bold text-xl text-white">SelectIA</span>
             </div>
             <p className="text-slate-500 mb-6 leading-relaxed">
                Transformando el reclutamiento en México mediante tecnología, transparencia y eficiencia.
             </p>
             <div className="flex gap-4">
                <div className="w-8 h-8 bg-brand-surface rounded-full flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white transition-colors cursor-pointer">IG</div>
                <div className="w-8 h-8 bg-brand-surface rounded-full flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white transition-colors cursor-pointer">LI</div>
                <div className="w-8 h-8 bg-brand-surface rounded-full flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white transition-colors cursor-pointer">X</div>
             </div>
          </div>

          <div>
             <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Candidatos</h4>
             <ul className="space-y-3 text-slate-500">
                <li><a href="#" className="hover:text-brand-primary transition-colors">Buscar empleo</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Salarios</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Blog de carrera</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Empresas TOP</a></li>
             </ul>
          </div>

          <div>
             <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Reclutadores</h4>
             <ul className="space-y-3 text-slate-500">
                <li><a href="#" className="hover:text-brand-primary transition-colors">Publicar vacante</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Soluciones de IA</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Acceso Clientes</a></li>
             </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Disponible en</h4>
            <div className="flex flex-col gap-3">
              <button className="bg-slate-900 border border-white/20 rounded-xl p-3 flex items-center gap-3 hover:bg-slate-800 transition-colors group">
                 <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg pb-1 group-hover:scale-110 transition-transform">A</div>
                 <div className="text-left">
                    <div className="text-[10px] text-slate-400">Consíguelo en el</div>
                    <div className="font-bold text-white text-sm">App Store</div>
                 </div>
              </button>
              <button className="bg-slate-900 border border-white/20 rounded-xl p-3 flex items-center gap-3 hover:bg-slate-800 transition-colors group">
                 <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg pb-1 group-hover:scale-110 transition-transform">G</div>
                 <div className="text-left">
                    <div className="text-[10px] text-slate-400">DISPONIBLE EN</div>
                    <div className="font-bold text-white text-sm">Google Play</div>
                 </div>
              </button>
            </div>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>© 2025 Innovation Pascual S.A. de C.V.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-slate-400">Aviso de Privacidad</a>
             <a href="#" className="hover:text-slate-400">Términos y Condiciones</a>
             <a href="#" className="hover:text-slate-400">Mapa del sitio</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;