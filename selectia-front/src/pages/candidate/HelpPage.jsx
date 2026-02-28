// src/pages/candidate/HelpPage.jsx
import React from 'react';
import { 
  Search, 
  MessageCircle, 
  FileText, 
  ShieldCheck, 
  Briefcase, 
  HelpCircle,
  ChevronRight,
  Zap
} from 'lucide-react';

const HelpPage = () => {

  const categories = [
    { title: 'Mi Cuenta', icon: <FileText className="text-blue-500 dark:text-blue-400" />, desc: 'Configuración, contraseña y datos' },
    { title: 'Postulaciones', icon: <Briefcase className="text-brand-primary" />, desc: 'Estado de mis candidaturas' },
    { title: 'Seguridad', icon: <ShieldCheck className="text-green-600 dark:text-green-400" />, desc: 'Evitar fraudes y reportar' },
    { title: 'Problemas Técnicos', icon: <Zap className="text-yellow-500 dark:text-yellow-400" />, desc: 'La app no carga o falla' },
  ];

  const faqs = [
    "¿Cómo oculto mi CV a mi empresa actual?",
    "¿Qué significa el 'Match de IA'?",
    "¿Cómo eliminar una postulación enviada?",
    "No recibo correos de confirmación"
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto pb-20 transition-colors">
      
      {/* --- HERO DE BÚSQUEDA --- */}
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-brand-surface rounded-2xl mb-6 shadow-md dark:shadow-xl border border-slate-200 dark:border-white/5 transition-colors">
            <HelpCircle size={32} className="text-brand-primary" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">¿Cómo podemos ayudarte?</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg transition-colors">Nuestro equipo y nuestra IA están listos para resolver tus dudas.</p>

        {/* Buscador Grande */}
        <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-brand-primary/10 dark:bg-brand-primary/20 blur-xl rounded-full group-hover:bg-brand-primary/20 dark:group-hover:bg-brand-primary/30 transition-all"></div>
            <div className="relative bg-white dark:bg-brand-surface border border-slate-300 dark:border-white/10 rounded-full flex items-center px-6 py-4 shadow-lg dark:shadow-2xl focus-within:border-brand-primary transition-colors">
                <Search className="text-slate-400 mr-4" />
                <input 
                    type="text" 
                    placeholder="Busca un problema (ej. 'cambiar contraseña')" 
                    className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full text-lg placeholder-slate-400 dark:placeholder-slate-500 transition-colors" 
                />
            </div>
        </div>
      </div>

      {/* --- GRID DE CATEGORÍAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {categories.map((cat, index) => (
            <div key={index} className="bg-white dark:bg-brand-surface/50 border border-slate-200 dark:border-white/5 hover:border-brand-primary/50 dark:hover:border-brand-primary/50 shadow-sm dark:shadow-none p-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 group">
                <div className="mb-4 bg-slate-50 dark:bg-brand-dark w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {cat.icon}
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1 transition-colors">{cat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">{cat.desc}</p>
            </div>
        ))}
      </div>

      {/* --- SECCIÓN INFERIOR: FAQ y CHAT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Preguntas Frecuentes */}
          <div className="bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none rounded-3xl p-8 transition-colors">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">Preguntas Frecuentes</h2>
             <div className="space-y-3">
                {faqs.map((faq, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-brand-dark hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-transparent cursor-pointer transition-colors group">
                        <span className="text-slate-700 dark:text-slate-300 group-hover:text-brand-primary dark:group-hover:text-white transition-colors">{faq}</span>
                        <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-brand-primary transition-colors"/>
                    </div>
                ))}
             </div>
             <button className="mt-6 text-brand-primary font-bold text-sm hover:underline">
                Ver todas las preguntas &rarr;
             </button>
          </div>

          {/* Banner de Chat con IA (Innovación) */}
          <div className="bg-gradient-to-br from-blue-50 dark:from-blue-900/40 to-brand-primary/10 dark:to-brand-primary/20 border border-brand-primary/20 dark:border-brand-primary/30 rounded-3xl p-8 flex flex-col justify-center text-center relative overflow-hidden transition-colors">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-[50px]"></div>
             
             <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-primary/30 animate-pulse">
                <MessageCircle size={32} className="text-white" />
             </div>
             
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">¿Aún tienes dudas?</h2>
             <p className="text-slate-700 dark:text-slate-300 mb-8 transition-colors">
                Nuestro asistente virtual <strong className="text-brand-primary dark:text-white">SelectBot</strong> está disponible 24/7 para solucionar problemas de cuenta o postulación.
             </p>

             <button className="bg-brand-primary dark:bg-white text-white dark:text-brand-dark font-bold py-3 px-8 rounded-full hover:bg-violet-600 dark:hover:bg-slate-200 transition-colors shadow-xl shadow-brand-primary/20 dark:shadow-none w-full sm:w-auto mx-auto">
                Iniciar Chat en Vivo
             </button>
          </div>

      </div>

    </div>
  );
};

export default HelpPage;