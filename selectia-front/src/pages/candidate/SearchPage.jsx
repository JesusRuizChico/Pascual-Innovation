// src/pages/candidate/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, DollarSign, Filter, Briefcase, 
  Clock, CheckCircle2, Building2, Sparkles, Brain, Loader2, Share2, Bookmark, Check
} from 'lucide-react';
import axios from '../../api/axios';

const SearchPage = () => {
  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  
  // --- ESTADO NUEVO: Lista de IDs de vacantes a las que ya apliqué ---
  const [appliedJobIds, setAppliedJobIds] = useState(new Set()); 

  const [searchText, setSearchText] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [candidateProfile, setCandidateProfile] = useState(null);

  // 1. Cargar Datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // A. Perfil
        try {
            const resProfile = await axios.get('/candidates/me');
            setCandidateProfile(resProfile.data);
        } catch (e) { console.log("Sin perfil"); }

        // B. Vacantes
        const resVacancies = await axios.get('/vacancies');
        
        // C. Mis Postulaciones (NUEVO)
        try {
            const resApps = await axios.get('/applications/me');
            const ids = new Set(resApps.data.map(app => app.vacancy));
            setAppliedJobIds(ids);
        } catch (e) { console.log("Error cargando aplicaciones"); }

        // Procesar Match IA
        const processed = resVacancies.data.map(job => {
            let matchScore = 10; 
            if (candidateProfile?.skills && job.skills_required?.length > 0) {
                const userSkills = candidateProfile.skills.map(s => s.toLowerCase().trim());
                const jobSkills = job.skills_required.map(s => s.toLowerCase().trim());
                const matches = jobSkills.filter(s => userSkills.includes(s));
                matchScore = Math.round((matches.length / jobSkills.length) * 100);
            }
            return { ...job, matchScore };
        });

        processed.sort((a, b) => b.matchScore - a.matchScore);
        setVacancies(processed);
        setFilteredVacancies(processed);
        
        if (processed.length > 0) setSelectedJob(processed[0]);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); 

  // Filtrado
  useEffect(() => {
    let results = vacancies;
    if (searchText) {
        const lowerSearch = searchText.toLowerCase();
        results = results.filter(job => job.title.toLowerCase().includes(lowerSearch) || job.company?.name?.toLowerCase().includes(lowerSearch));
    }
    if (locationFilter) {
        results = results.filter(job => job.modality.toLowerCase().includes(locationFilter.toLowerCase()));
    }
    setFilteredVacancies(results);
  }, [searchText, locationFilter, vacancies]);

  // --- LÓGICA DE POSTULACIÓN ---
  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
        await axios.post('/applications', { vacancyId: selectedJob._id });
        
        setAppliedJobIds(prev => new Set(prev).add(selectedJob._id));
        
        alert(`¡Te has postulado exitosamente a ${selectedJob.title}!`);
    } catch (error) {
        const msg = error.response?.data?.msg || 'Error al postularse';
        alert(msg);
    } finally {
        setApplying(false);
    }
  };

  const formatMoney = (amount) => {
      if (!amount) return '0';
      return amount >= 1000 ? `${(amount/1000).toFixed(1)}k` : amount;
  };

  const isAlreadyApplied = selectedJob && appliedJobIds.has(selectedJob._id);

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-brand-primary" size={40}/></div>;

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-80px)] flex flex-col transition-colors">
      
      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 p-4 md:p-6 sticky top-0 z-20 transition-colors duration-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                  <Search className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 transition-colors" size={20} />
                  <input type="text" placeholder="Puesto, empresa..." 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              </div>
              <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 transition-colors" size={20} />
                  <input type="text" placeholder="Ciudad..." 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
              </div>
              <button className="bg-brand-primary hover:bg-violet-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-brand-primary/20 transition-all">Buscar</button>
          </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 overflow-hidden">
          
          {/* List Left */}
          <div className="lg:col-span-5 overflow-y-auto p-4 space-y-3 custom-scrollbar h-full">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 transition-colors">{filteredVacancies.length} empleos encontrados</p>
              {filteredVacancies.map((job) => {
                  const isAppliedList = appliedJobIds.has(job._id); 
                  return (
                    <div key={job._id} onClick={() => setSelectedJob(job)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-brand-primary/50 relative group ${
                          selectedJob?._id === job._id 
                            ? 'bg-brand-primary/5 dark:bg-brand-primary/10 border-brand-primary shadow-sm dark:shadow-none' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}>
                        
                        {isAppliedList && (
                            <div className="absolute top-2 right-2 text-green-500" title="Ya te postulaste">
                                <CheckCircle2 size={16} />
                            </div>
                        )}

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200 dark:border-white/10 transition-colors">
                                {job.company?.logo ? <img src={job.company.logo} className="w-full h-full object-contain p-1" /> : <span className="text-xl font-bold text-slate-500 dark:text-slate-900">{job.company?.name?.charAt(0)}</span>}
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg leading-tight transition-colors ${selectedJob?._id === job._id ? 'text-brand-primary' : 'text-slate-900 dark:text-white'}`}>{job.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium transition-colors">{job.company?.name}</p>
                                <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500 dark:text-slate-500">
                                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded transition-colors"><MapPin size={12}/> {job.modality}</span>
                                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded text-green-600 dark:text-green-400 transition-colors"><DollarSign size={12}/> {formatMoney(job.salary_min)} - {formatMoney(job.salary_max)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  );
              })}
          </div>

          {/* Details Right */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-white/5 h-full overflow-y-auto p-6 md:p-8 hidden lg:block transition-colors duration-300">
              {selectedJob ? (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
                      <div className="flex justify-between items-start mb-6">
                          <div className="flex gap-5">
                              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-lg transition-colors">
                                  {selectedJob.company?.logo ? <img src={selectedJob.company.logo} className="w-full h-full object-contain p-2" /> : <span className="text-3xl font-bold text-slate-400 dark:text-slate-900">{selectedJob.company?.name?.charAt(0)}</span>}
                              </div>
                              <div>
                                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">{selectedJob.title}</h1>
                                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm transition-colors">
                                      <Building2 size={16} /><span className="font-medium text-slate-800 dark:text-white transition-colors">{selectedJob.company?.name}</span>
                                      <span className="bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-[10px] px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-500/30 flex items-center gap-1 transition-colors"><CheckCircle2 size={10} /> Verificada</span>
                                  </div>
                              </div>
                          </div>
                          <div className="flex gap-2">
                              <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-transparent rounded-lg text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm dark:shadow-none"><Share2 size={20}/></button>
                              <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-transparent rounded-lg text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm dark:shadow-none"><Bookmark size={20}/></button>
                          </div>
                      </div>

                      <div className="bg-white dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900 border border-brand-primary/20 dark:border-white/10 shadow-sm dark:shadow-none rounded-xl p-4 mb-8 flex gap-4 items-start transition-colors">
                          <div className="p-2 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-lg text-brand-primary transition-colors"><Brain size={24} /></div>
                          <div>
                              <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-1 transition-colors">Análisis de SelectIA</h3>
                              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed transition-colors">Tu perfil encaja un <strong className="text-green-600 dark:text-green-400">{selectedJob.matchScore}%</strong> con esta vacante.</p>
                          </div>
                      </div>

                      <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                          <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4 transition-colors">Descripción</h3>
                          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed transition-colors">{selectedJob.description}</p>
                      </div>

                      <div className="mb-8">
                          <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4 transition-colors">Habilidades Requeridas</h3>
                          <div className="flex flex-wrap gap-2">
                              {selectedJob.skills_required?.map((skill, i) => <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm border border-slate-200 dark:border-white/5 transition-colors">{skill}</span>)}
                          </div>
                      </div>

                      {/* --- BOTÓN DE ACCIÓN DINÁMICO --- */}
                      <div className="sticky bottom-6 p-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between shadow-lg dark:shadow-2xl z-50 transition-colors">
                          <div>
                              <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold transition-colors">Salario ofrecido</p>
                              <p className="text-slate-900 dark:text-white font-bold text-lg transition-colors">${formatMoney(selectedJob.salary_min)} - {formatMoney(selectedJob.salary_max)} <span className="text-xs font-normal text-slate-500">/ mes</span></p>
                          </div>
                          
                          <button 
                            onClick={handleApply}
                            disabled={applying || isAlreadyApplied} 
                            className={`font-bold py-3 px-8 rounded-xl shadow-lg flex items-center gap-2 transition-all ${
                                isAlreadyApplied 
                                ? 'bg-green-50 dark:bg-green-600/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/50 cursor-not-allowed shadow-none' 
                                : 'bg-brand-primary hover:bg-violet-600 text-white shadow-brand-primary/20' 
                            }`}
                          >
                              {applying ? (
                                  <> <Loader2 className="animate-spin" size={20}/> Enviando... </>
                              ) : isAlreadyApplied ? (
                                  <> <CheckCircle2 size={20}/> Postulado </>
                              ) : (
                                  'Postularme ahora'
                              )}
                          </button>
                      </div>

                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 transition-colors">
                      <Briefcase size={48} className="mb-4 opacity-20" />
                      <p>Selecciona una vacante</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default SearchPage;