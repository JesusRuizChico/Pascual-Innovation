// src/pages/candidate/DashboardHome.jsx
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, MapPin, DollarSign, Briefcase, ChevronRight, 
  UploadCloud, Edit3, CheckCircle2, Brain, Loader2, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

const DashboardHome = () => {
  const [profile, setProfile] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState(0);

  const userLocal = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Cargar Perfil
        let currentProfile = null;
        try {
            const resProfile = await axios.get('/candidates/me');
            currentProfile = resProfile.data;
            setProfile(currentProfile);
        } catch (err) { console.log("Perfil no creado"); }

        // 2. Calcular % Completado
        let percent = 0;
        if (currentProfile) {
            if (currentProfile.title) percent += 20;
            if (currentProfile.phone) percent += 20;
            if (currentProfile.location) percent += 20;
            if (currentProfile.skills?.length > 0) percent += 20;
            if (currentProfile.cv_url) percent += 20;
        }
        setCompletion(percent);

        // 3. Cargar Vacantes
        const resVacancies = await axios.get('/vacancies');
        
        // --- FILTRADO DE DESCARTADAS ---
        const rejectedIds = currentProfile?.rejected_vacancies || [];
        const availableVacancies = resVacancies.data.filter(vac => !rejectedIds.includes(vac._id));

        // 4. Calcular Match IA y Ordenar
        const sortedVacancies = availableVacancies.map(vac => {
            let matchScore = 0;
            if (currentProfile?.skills && vac.skills_required) {
                const userSkills = currentProfile.skills.map(s => s.toLowerCase().trim());
                const reqSkills = vac.skills_required.map(s => s.toLowerCase().trim());
                const matches = reqSkills.filter(r => userSkills.includes(r));
                matchScore = reqSkills.length > 0 ? Math.round((matches.length / reqSkills.length) * 100) : 50;
            } else { matchScore = 10; }
            return { ...vac, matchScore };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);

        setVacancies(sortedVacancies);

      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleDiscard = async (vacancyId) => {
      try {
          setVacancies(prev => prev.filter(v => v._id !== vacancyId));
          await axios.put(`/candidates/discard/${vacancyId}`);
      } catch (error) {
          console.error("Error al descartar", error);
          alert("Hubo un error al descartar la vacante.");
      }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-brand-primary" size={40}/></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* COLUMNA IZQUIERDA (Perfil) */}
      <div className="lg:col-span-3 space-y-6">
        {/* Tarjeta Perfil: Blanco con borde en día / brand-surface en noche */}
        <div className="bg-white dark:bg-brand-surface/50 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none rounded-2xl p-6 text-center relative overflow-hidden group transition-colors">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-brand-primary/10 dark:from-brand-primary/20 to-transparent transition-colors"></div>
            
            <Link to="/candidate/cv" className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white transition-colors z-10">
              <Edit3 size={16} />
            </Link>

            <div className="relative inline-block mt-4 mb-4">
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-brand-dark border-4 border-white dark:border-brand-surface flex items-center justify-center text-3xl font-bold text-brand-primary shadow-lg dark:shadow-xl overflow-hidden transition-colors">
                    {profile?.photo_url ? <img src={profile.photo_url} alt="Perfil" className="w-full h-full object-cover"/> : null}
                    <span style={{ display: profile?.photo_url ? 'none' : 'block' }}>
                        {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : userLocal.name?.substring(0, 2).toUpperCase()}
                    </span>
                </div>
                <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-white dark:border-brand-surface transition-colors ${completion === 100 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>

            {/* Texto Nombre adaptable */}
            <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">{profile ? profile.full_name : userLocal.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 transition-colors">{profile?.title || "Sin título profesional"}</p>

            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-6 ${completion === 100 ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400'}`}>
                <span className={`w-2 h-2 rounded-full ${completion === 100 ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                {completion === 100 ? 'Perfil Activo' : 'CV Incompleto'}
            </div>

            <div className="border-t border-slate-100 dark:border-white/5 pt-4 transition-colors">
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2 transition-colors">
                  <span>Perfil completado</span>
                  <span className="text-slate-900 dark:text-white font-bold">{completion}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-brand-dark rounded-full h-2 overflow-hidden transition-colors">
                  <div className={`h-full rounded-full transition-all duration-1000 ${completion === 100 ? 'bg-green-500' : 'bg-brand-primary'}`} style={{width: `${completion}%`}}></div>
                </div>
            </div>
        </div>

        {/* Tarjeta IA: Borde y degradado ligero en día / oscuro en noche */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-violet-900/50 dark:to-brand-dark border border-brand-primary/20 dark:border-brand-primary/30 shadow-sm dark:shadow-none rounded-2xl p-6 text-center transition-colors">
            <div className="w-12 h-12 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3 text-brand-primary transition-colors"><Sparkles /></div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors">{completion >= 80 ? 'IA Activada 🚀' : 'IA en Espera'}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 transition-colors">{completion >= 80 ? "Tu perfil está optimizado. Estamos buscando las mejores vacantes." : "Completa tu perfil para que nuestra IA pueda empezar a buscar por ti."}</p>
        </div>
      </div>

      {/* COLUMNA DERECHA (Contenido) */}
      <div className="lg:col-span-9 space-y-6">
        <div>
            {/* Títulos adaptables */}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">¡Bienvenido/a, {userLocal.name?.split(' ')[0]}!</h1>
            <p className="text-slate-600 dark:text-slate-400 transition-colors">Aquí tienes lo que necesitas para comenzar tu búsqueda.</p>
        </div>

        {!profile?.cv_url && (
            <Link to="/candidate/cv" className="block">
                {/* Banner CV: Claro en día / oscuro en noche */}
                <div className="bg-blue-50 dark:bg-gradient-to-r dark:from-blue-600/20 dark:to-brand-primary/20 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-transparent transition-all cursor-pointer group">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-blue-500 rounded-full text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform"><UploadCloud size={24} /></div>
                        <div>
                          <h3 className="text-lg font-bold text-blue-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">Sube tu CV y ahorra tiempo</h3>
                          <p className="text-blue-700/80 dark:text-slate-400 text-sm transition-colors">Nuestra IA extraerá tus datos automáticamente.</p>
                        </div>
                    </div>
                    <div className="p-2 bg-white dark:bg-white/5 rounded-full text-blue-500 dark:text-slate-300 shadow-sm dark:shadow-none group-hover:bg-blue-200 dark:group-hover:bg-white/10 group-hover:text-blue-700 dark:group-hover:text-white transition-colors"><ChevronRight /></div>
                </div>
            </Link>
        )}

        {/* SECCIÓN SUGERENCIAS */}
        <div>
            <div className="flex items-center gap-2 mb-4 mt-8">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg transition-colors">Sugerencias para ti</h3>
                <span className="bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary text-xs px-2 py-0.5 rounded border border-brand-primary/20 dark:border-brand-primary/30 transition-colors">IA Beta</span>
            </div>
            
            <div className="space-y-4">
                {vacancies.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 dark:text-slate-500 italic border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-transparent transition-colors">
                        No hay vacantes sugeridas disponibles en este momento.
                    </div>
                ) : (
                    vacancies.map((job) => (
                        /* Tarjeta Vacante: Blanca en día / brand-surface en noche */
                        <div key={job._id} className="bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none rounded-2xl p-6 hover:border-brand-primary/40 dark:hover:border-brand-primary/50 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0 text-xl font-bold text-slate-900 border border-slate-200 dark:border-none transition-colors">
                                        {job.created_by?.companyName?.charAt(0) || 'E'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg hover:text-brand-primary dark:hover:text-brand-secondary cursor-pointer transition-colors">{job.title}</h4>
                                        <p className="text-brand-primary dark:text-brand-secondary text-sm font-medium mb-1 transition-colors">{job.created_by?.companyName || 'Empresa Confidencial'}</p>
                                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 transition-colors">
                                            <span className="flex items-center gap-1"><MapPin size={12}/> {job.modality}</span>
                                            <span className="flex items-center gap-1"><Briefcase size={12}/> Tiempo completo</span>
                                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><DollarSign size={12}/> ${job.salary_min} - ${job.salary_max}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col items-end gap-3 justify-between">
                                     <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border transition-colors ${job.matchScore >= 80 ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' : 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'}`}>
                                        <Sparkles size={12} /> {job.matchScore}% Match
                                     </div>
                                     <div className="flex gap-2 w-full md:w-auto">
                                        
                                        {/* Botón descartar adaptable */}
                                        <button 
                                            onClick={() => handleDiscard(job._id)}
                                            className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-500 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            title="No me interesa esta vacante"
                                        >
                                            <XCircle size={16} /> <span className="hidden sm:inline">Descartar</span>
                                        </button>
                                        
                                        <Link to="/candidate/search" className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-brand-primary hover:bg-violet-600 text-white text-sm font-bold shadow-md shadow-brand-primary/20 transition-colors text-center flex items-center justify-center">
                                            Ver vacante
                                        </Link>
                                     </div>
                                </div>
                            </div>
                            
                            {/* Razón IA adaptable */}
                            {profile && job.skills_required && job.skills_required.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 flex gap-2 transition-colors">
                                    <Brain size={14} className="text-brand-primary dark:text-brand-accent flex-shrink-0"/>
                                    <span>La IA te recomienda esto porque dominas <strong className="text-slate-700 dark:text-slate-300">{job.skills_required[0]}</strong>.</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;