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
        // Obtenemos los IDs descartados del perfil (si existen)
        const rejectedIds = currentProfile?.rejected_vacancies || [];
        
        // Filtramos las vacantes que NO estén en la lista de rechazadas
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

  // --- FUNCIÓN PARA DESCARTAR ---
  const handleDiscard = async (vacancyId) => {
      try {
          // 1. Actualización Optimista (Lo borramos de la vista inmediatamente)
          setVacancies(prev => prev.filter(v => v._id !== vacancyId));
          
          // 2. Petición al Backend
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
        <div className="bg-brand-surface/50 border border-white/5 rounded-2xl p-6 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-brand-primary/20 to-transparent"></div>
            <Link to="/candidate/cv" className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-10"><Edit3 size={16} /></Link>

            <div className="relative inline-block mt-4 mb-4">
                <div className="w-24 h-24 rounded-full bg-brand-dark border-4 border-brand-surface flex items-center justify-center text-3xl font-bold text-brand-primary shadow-xl overflow-hidden">
                    {profile?.photo_url ? <img src={profile.photo_url} alt="Perfil" className="w-full h-full object-cover"/> : null}
                    <span style={{ display: profile?.photo_url ? 'none' : 'block' }}>
                        {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : userLocal.name?.substring(0, 2).toUpperCase()}
                    </span>
                </div>
                <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-brand-surface ${completion === 100 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>

            <h2 className="text-xl font-bold text-white">{profile ? profile.full_name : userLocal.name}</h2>
            <p className="text-sm text-slate-400 mb-4">{profile?.title || "Sin título profesional"}</p>

            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-6 ${completion === 100 ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                <span className={`w-2 h-2 rounded-full ${completion === 100 ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                {completion === 100 ? 'Perfil Activo' : 'CV Incompleto'}
            </div>

            <div className="border-t border-white/5 pt-4">
                <div className="flex justify-between text-sm text-slate-400 mb-2"><span>Perfil completado</span><span className="text-white">{completion}%</span></div>
                <div className="w-full bg-brand-dark rounded-full h-2 overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 ${completion === 100 ? 'bg-green-500' : 'bg-brand-primary'}`} style={{width: `${completion}%`}}></div></div>
            </div>
        </div>

        <div className="bg-gradient-to-br from-violet-900/50 to-brand-dark border border-brand-primary/30 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3 text-brand-primary"><Sparkles /></div>
            <h3 className="font-bold text-white mb-1">{completion >= 80 ? 'IA Activada 🚀' : 'IA en Espera'}</h3>
            <p className="text-xs text-slate-400 mb-4">{completion >= 80 ? "Tu perfil está optimizado. Estamos buscando las mejores vacantes." : "Completa tu perfil para que nuestra IA pueda empezar a buscar por ti."}</p>
        </div>
      </div>

      {/* COLUMNA DERECHA (Contenido) */}
      <div className="lg:col-span-9 space-y-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">¡Bienvenido/a, {userLocal.name?.split(' ')[0]}!</h1>
            <p className="text-slate-400">Aquí tienes lo que necesitas para comenzar tu búsqueda.</p>
        </div>

        {!profile?.cv_url && (
            <Link to="/candidate/cv" className="block">
                <div className="bg-gradient-to-r from-blue-600/20 to-brand-primary/20 border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-500/50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-blue-500 rounded-full text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform"><UploadCloud size={24} /></div>
                        <div><h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Sube tu CV y ahorra tiempo</h3><p className="text-slate-400 text-sm">Nuestra IA extraerá tus datos automáticamente.</p></div>
                    </div>
                    <div className="p-2 bg-white/5 rounded-full text-slate-300 group-hover:bg-white/10 group-hover:text-white transition-colors"><ChevronRight /></div>
                </div>
            </Link>
        )}

        {/* SECCIÓN SUGERENCIAS */}
        <div>
            <div className="flex items-center gap-2 mb-4 mt-8">
                <h3 className="font-bold text-white text-lg">Sugerencias para ti</h3>
                <span className="bg-brand-primary/20 text-brand-primary text-xs px-2 py-0.5 rounded border border-brand-primary/30">IA Beta</span>
            </div>
            
            <div className="space-y-4">
                {vacancies.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 italic border border-white/5 rounded-2xl">
                        No hay vacantes sugeridas disponibles en este momento.
                    </div>
                ) : (
                    vacancies.map((job) => (
                        <div key={job._id} className="bg-brand-surface border border-white/5 rounded-2xl p-6 hover:border-brand-primary/50 transition-all animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 text-xl font-bold text-slate-900">
                                        {job.created_by?.companyName?.charAt(0) || 'E'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg hover:text-brand-secondary cursor-pointer">{job.title}</h4>
                                        <p className="text-brand-secondary text-sm font-medium mb-1">{job.created_by?.companyName || 'Empresa Confidencial'}</p>
                                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                                            <span className="flex items-center gap-1"><MapPin size={12}/> {job.modality}</span>
                                            <span className="flex items-center gap-1"><Briefcase size={12}/> Tiempo completo</span>
                                            <span className="flex items-center gap-1 text-green-400"><DollarSign size={12}/> ${job.salary_min} - ${job.salary_max}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col items-end gap-3 justify-between">
                                     <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border ${job.matchScore >= 80 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                        <Sparkles size={12} /> {job.matchScore}% Match
                                     </div>
                                     <div className="flex gap-2 w-full md:w-auto">
                                        
                                        {/* --- BOTÓN DESCARTAR FUNCIONAL --- */}
                                        <button 
                                            onClick={() => handleDiscard(job._id)}
                                            className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            title="No me interesa esta vacante"
                                        >
                                            <XCircle size={16} /> Descartar
                                        </button>
                                        
                                        <Link to="/candidate/search" className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-brand-primary hover:bg-violet-600 text-white text-sm font-bold shadow-lg shadow-brand-primary/20 transition-colors text-center">
                                            Ver vacante
                                        </Link>
                                     </div>
                                </div>
                            </div>
                            
                            {profile && job.skills_required && job.skills_required.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-500 flex gap-2">
                                    <Brain size={14} className="text-brand-accent flex-shrink-0"/>
                                    <span>La IA te recomienda esto porque dominas <strong>{job.skills_required[0]}</strong>.</span>
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