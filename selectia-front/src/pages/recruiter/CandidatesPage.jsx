// src/pages/recruiter/CandidatesPage.jsx
import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, User, 
    ArrowRight, XCircle, CheckCircle,
    Loader2, Brain, Briefcase, ChevronDown, X,
    MapPin, Phone, Mail, FileText, Download, Calendar
} from 'lucide-react';
import axios from '../../api/axios';

const CandidatesPage = () => {
  // --- ESTADOS ---
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState(null);
  
  // Estado para el Modal de Detalle
  const [selectedApp, setSelectedApp] = useState(null);

  // --- FILTROS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVacancy, setFilterVacancy] = useState('all');
  const [filterScore, setFilterScore] = useState('all');

  // 1. Cargar Candidatos
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get('/applications/recruiter');
        setApplications(res.data);
      } catch (error) {
        console.error("Error al cargar candidatos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // Función para mover tarjeta
  const handleMove = async (appId, newStatus) => {
    setMovingId(appId);
    try {
        await axios.put(`/applications/${appId}/status`, { status: newStatus });
        setApplications(prev => prev.map(app => app._id === appId ? { ...app, status: newStatus } : app));
        // Si el modal está abierto y es el mismo candidato, actualizamos su estado visual también
        if (selectedApp && selectedApp._id === appId) {
            setSelectedApp(prev => ({ ...prev, status: newStatus }));
        }
    } catch (error) {
        alert("Error al mover candidato");
    } finally {
        setMovingId(null);
    }
  };

  // Filtros
  const uniqueVacancies = Array.from(new Set(applications.map(app => app.vacancy?._id)))
    .map(id => applications.find(app => app.vacancy?._id === id)?.vacancy).filter(v => v);

  const filteredApplications = applications.filter(app => {
    const nameMatch = app.candidate?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const vacancyMatch = filterVacancy === 'all' || app.vacancy?._id === filterVacancy;
    let scoreMatch = true;
    if (filterScore === 'high') scoreMatch = app.ai_score >= 85;
    if (filterScore === 'medium') scoreMatch = app.ai_score >= 70 && app.ai_score < 85;
    if (filterScore === 'low') scoreMatch = app.ai_score < 70;
    return nameMatch && vacancyMatch && scoreMatch;
  });

  const getColumnApps = (status) => filteredApplications.filter(app => app.status === status);
  
  const columns = [
    { id: 'nuevo', title: 'Nuevos', color: 'border-blue-500', bgClaro: 'bg-blue-50', bgOscuro: 'bg-slate-900/50' },
    { id: 'entrevista', title: 'Entrevista', color: 'border-yellow-500', bgClaro: 'bg-yellow-50', bgOscuro: 'bg-slate-900/50' },
    { id: 'contratado', title: 'Contratados', color: 'border-green-500', bgClaro: 'bg-green-50', bgOscuro: 'bg-slate-900/50' },
    { id: 'rechazado', title: 'Descartados', color: 'border-red-500', bgClaro: 'bg-red-50', bgOscuro: 'bg-slate-900/50' },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500 relative transition-colors">
      
      {/* Header y Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-shrink-0">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Gestión de Candidatos</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
                Mostrando <span className="text-slate-900 dark:text-white font-bold">{filteredApplications.length}</span> candidatos
            </p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Buscador */}
            <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 w-4 h-4 transition-colors" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar..." 
                    className="w-full md:w-40 bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg pl-10 pr-8 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors shadow-sm dark:shadow-none placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-2 top-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white transition-colors"><X size={14} /></button>}
            </div>

            {/* Selects */}
            <select value={filterVacancy} onChange={(e) => setFilterVacancy(e.target.value)} className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg py-2 px-3 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 transition-colors shadow-sm dark:shadow-none">
                <option value="all">Todas las Vacantes</option>
                {uniqueVacancies.map(v => <option key={v._id} value={v._id}>{v.title.substring(0, 15)}...</option>)}
            </select>
            <select value={filterScore} onChange={(e) => setFilterScore(e.target.value)} className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg py-2 px-3 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 transition-colors shadow-sm dark:shadow-none">
                <option value="all">Score: Todos</option>
                <option value="high">🔥 Top (85%+)</option>
                <option value="medium">⚠️ Medio</option>
                <option value="low">❌ Bajo</option>
            </select>
        </div>
      </div>

      {/* --- KANBAN BOARD --- */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 h-full min-w-[1000px]">
            {loading ? <div className="w-full flex justify-center pt-20"><Loader2 className="animate-spin text-blue-500" size={40}/></div> : 
            columns.map((col) => (
                <div key={col.id} className={`flex-1 flex flex-col ${col.bgClaro} dark:${col.bgOscuro} border border-slate-200 dark:border-white/5 rounded-xl min-w-[240px] transition-colors`}>
                    
                    {/* Header de Columna */}
                    <div className={`p-3 border-b border-slate-200 dark:border-white/5 border-t-4 ${col.color} rounded-t-xl bg-white dark:bg-slate-900 sticky top-0 z-10 flex justify-between transition-colors`}>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wider transition-colors">{col.title}</h3>
                        <span className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors">{getColumnApps(col.id).length}</span>
                    </div>

                    {/* Tarjetas */}
                    <div className="p-2 flex-1 overflow-y-auto custom-scrollbar space-y-2">
                        {getColumnApps(col.id).map((app) => (
                            <div key={app._id} className="bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/5 p-3 rounded-lg shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500/30 transition-all group relative">
                                {movingId === app._id && <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/60 z-20 flex items-center justify-center rounded-lg backdrop-blur-sm"><Loader2 className="animate-spin text-blue-500 dark:text-white" /></div>}
                                
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-white border border-slate-200 dark:border-transparent transition-colors">
                                            {app.candidate?.full_name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <h4 className="text-slate-900 dark:text-white font-bold text-sm leading-tight truncate w-24 transition-colors">{app.candidate?.full_name}</h4>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-24 transition-colors">{app.vacancy?.title}</p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${app.ai_score >= 85 ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' : 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'}`}>
                                        <Brain size={10} /> {app.ai_score}%
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-white/5 mt-2 transition-colors">
                                    {/* BOTÓN VER PERFIL */}
                                    <button 
                                        onClick={() => setSelectedApp(app)} 
                                        className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 transition-colors" 
                                        title="Ver Detalles"
                                    >
                                        <User size={16} />
                                    </button>
                                    
                                    <div className="flex gap-1">
                                        {col.id !== 'rechazado' && <button onClick={() => handleMove(app._id, 'rechazado')} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 rounded transition-colors"><XCircle size={14}/></button>}
                                        {col.id === 'nuevo' && <button onClick={() => handleMove(app._id, 'entrevista')} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 rounded transition-colors"><ArrowRight size={14}/></button>}
                                        {col.id === 'entrevista' && <button onClick={() => handleMove(app._id, 'contratado')} className="p-1 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-500/10 rounded transition-colors"><CheckCircle size={14}/></button>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* --- MODAL DE DETALLE DEL CANDIDATO --- */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 transition-colors">
            <div className="bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 flex justify-between items-start transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            {selectedApp.candidate?.full_name?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">{selectedApp.candidate?.full_name}</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-1 transition-colors">
                                <Briefcase size={14}/> Aplicando a: <span className="text-slate-900 dark:text-white font-medium">{selectedApp.vacancy?.title}</span>
                            </p>
                            <div className="flex gap-2 mt-2">
                                <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded border border-slate-300 dark:border-white/5 capitalize transition-colors">
                                    {selectedApp.status}
                                </span>
                                <span className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs px-2 py-1 rounded border border-green-200 dark:border-green-500/20 flex items-center gap-1 font-bold transition-colors">
                                    <Brain size={12}/> Match: {selectedApp.ai_score}%
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setSelectedApp(null)} className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white p-1 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                    
                    {/* Contacto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3 transition-colors">
                            <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"><Mail size={18}/></div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-500 uppercase font-bold transition-colors">Correo</p>
                                <p className="text-sm text-slate-900 dark:text-white truncate transition-colors">{selectedApp.candidate?.email}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3 transition-colors">
                            <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-lg text-purple-600 dark:text-purple-400 transition-colors"><Phone size={18}/></div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-500 uppercase font-bold transition-colors">Teléfono</p>
                                <p className="text-sm text-slate-900 dark:text-white transition-colors">{selectedApp.candidate?.phone || 'No registrado'}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3 transition-colors">
                            <div className="bg-orange-100 dark:bg-orange-500/20 p-2 rounded-lg text-orange-600 dark:text-orange-400 transition-colors"><MapPin size={18}/></div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-500 uppercase font-bold transition-colors">Ubicación</p>
                                <p className="text-sm text-slate-900 dark:text-white transition-colors">{selectedApp.candidate?.location || 'No registrada'}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3 transition-colors">
                            <div className="bg-pink-100 dark:bg-pink-500/20 p-2 rounded-lg text-pink-600 dark:text-pink-400 transition-colors"><Calendar size={18}/></div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-500 uppercase font-bold transition-colors">Postulado</p>
                                <p className="text-sm text-slate-900 dark:text-white transition-colors">{new Date(selectedApp.applied_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* CV y Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 transition-colors"><Briefcase size={18}/> Habilidades</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedApp.candidate?.skills?.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm border border-slate-200 dark:border-white/10 transition-colors">
                                        {skill}
                                    </span>
                                ))}
                                {(!selectedApp.candidate?.skills || selectedApp.candidate?.skills.length === 0) && (
                                    <p className="text-slate-500 text-sm italic transition-colors">Sin habilidades registradas.</p>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 transition-colors"><FileText size={18}/> Curriculum Vitae</h3>
                            {selectedApp.candidate?.cv_url ? (
                                <a 
                                    href={selectedApp.candidate.cv_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-900/20 group"
                                >
                                    <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
                                    Descargar PDF
                                </a>
                            ) : (
                                <div className="w-full py-4 bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center text-slate-500 gap-2 transition-colors">
                                    <XCircle size={18}/> El candidato no ha subido su CV
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 transition-colors">
                    <button onClick={() => setSelectedApp(null)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Cerrar</button>
                    {selectedApp.status === 'nuevo' && (
                        <button 
                            onClick={() => handleMove(selectedApp._id, 'entrevista')}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-all"
                        >
                            Pasar a Entrevista <ArrowRight size={16}/>
                        </button>
                    )}
                </div>

            </div>
        </div>
      )}

    </div>
  );
};

export default CandidatesPage;