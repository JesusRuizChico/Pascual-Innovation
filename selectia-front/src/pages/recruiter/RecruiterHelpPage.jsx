// src/pages/recruiter/RecruiterHelpPage.jsx
import React from 'react';
import { 
  Search, 
  MessageCircle, 
  Building2, 
  ShieldCheck, 
  Users, 
  HelpCircle,
  ChevronRight,
  Zap,
  BarChart3
} from 'lucide-react';

const RecruiterHelpPage = () => {

  const categories = [
    { title: 'Gestión de Empresa', icon: <Building2 className="text-blue-400" />, desc: 'Perfil corporativo, logo y datos fiscales' },
    { title: 'Vacantes e IA', icon: <Zap className="text-yellow-400" />, desc: 'Optimización de descripciones y Match IA' },
    { title: 'Candidatos', icon: <Users className="text-purple-400" />, desc: 'Filtros, estados de Kanban y CVs' },
    { title: 'Reportes y Datos', icon: <BarChart3 className="text-green-400" />, desc: 'Exportación de métricas y analítica' },
  ];

  const faqs = [
    "¿Cómo mejorar el porcentaje de Match de mi vacante?",
    "¿Puedo exportar la lista de candidatos a Excel?",
    "¿Cómo ocultar una vacante sin eliminarla?",
    "¿Cómo agendar una entrevista desde el tablero?",
    "Problemas al subir el logo de la empresa"
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto pb-20">
      
      {/* --- HERO DE BÚSQUEDA --- */}
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-2xl mb-6 shadow-xl border border-white/5">
            <HelpCircle size={32} className="text-blue-500" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Soporte para Empresas</h1>
        <p className="text-slate-400 mb-8 text-lg">Optimiza tu proceso de reclutamiento con nuestra guía de ayuda.</p>

        {/* Buscador Grande */}
        <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full group-hover:bg-blue-600/30 transition-all"></div>
            <div className="relative bg-slate-900 border border-white/10 rounded-full flex items-center px-6 py-4 shadow-2xl focus-within:border-blue-500 transition-colors">
                <Search className="text-slate-400 mr-4" />
                <input 
                    type="text" 
                    placeholder="Busca una solución (ej. 'editar vacante')" 
                    className="bg-transparent border-none outline-none text-white w-full text-lg placeholder-slate-500" 
                />
            </div>
        </div>
      </div>

      {/* --- GRID DE CATEGORÍAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {categories.map((cat, index) => (
            <div key={index} className="bg-slate-900 border border-white/5 hover:border-blue-500/50 p-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 group">
                <div className="mb-4 bg-slate-950 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/5">
                    {cat.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{cat.title}</h3>
                <p className="text-sm text-slate-400">{cat.desc}</p>
            </div>
        ))}
      </div>

      {/* --- SECCIÓN INFERIOR: FAQ y CHAT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Preguntas Frecuentes */}
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
             <h2 className="text-xl font-bold text-white mb-6">Preguntas Frecuentes</h2>
             <div className="space-y-3">
                {faqs.map((faq, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-950 hover:bg-white/5 cursor-pointer transition-colors group border border-white/5">
                        <span className="text-slate-300 group-hover:text-white">{faq}</span>
                        <ChevronRight size={16} className="text-slate-500 group-hover:text-blue-400"/>
                    </div>
                ))}
             </div>
             <button className="mt-6 text-blue-400 font-bold text-sm hover:underline">
                Ver guías detalladas &rarr;
             </button>
          </div>

          {/* Banner de Chat con IA */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-600/20 border border-blue-500/30 rounded-3xl p-8 flex flex-col justify-center text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px]"></div>
             
             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/30 animate-pulse">
                <MessageCircle size={32} className="text-white" />
             </div>
             
             <h2 className="text-2xl font-bold text-white mb-2">Asistencia Ejecutiva</h2>
             <p className="text-blue-100 mb-8">
                Nuestro soporte técnico está disponible para ayudarte a configurar tu cuenta corporativa o resolver dudas de facturación.
             </p>

             <button className="bg-white text-blue-900 font-bold py-3 px-8 rounded-full hover:bg-slate-200 transition-colors shadow-xl w-full sm:w-auto mx-auto">
                Contactar a un Agente
             </button>
          </div>

      </div>

    </div>
  );
};

export default RecruiterHelpPage;