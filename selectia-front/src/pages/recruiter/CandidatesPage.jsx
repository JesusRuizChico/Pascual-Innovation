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
  const [selectedApp, setSelectedApp] = useState(null); // La postulación seleccionada

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
    { id: 'nuevo', title: 'Nuevos', color: 'border-blue-500' },
    { id: 'entrevista', title: 'Entrevista', color: 'border-yellow-500' },
    { id: 'contratado', title: 'Contratados', color: 'border-green-500' },
    { id: 'rechazado', title: 'Descartados', color: 'border-red-500' },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500 relative">
      
      {/* Header y Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-shrink-0">
        <div>
            <h1 className="text-2xl font-bold text-white">Gestión de Candidatos</h1>
            <p className="text-slate-400 text-sm">
                Mostrando <span className="text-white font-bold">{filteredApplications.length}</span> candidatos
            </p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Buscador */}
            <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar..." 
                    className="w-full md:w-40 bg-slate-900 border border-white/10 rounded-lg pl-10 pr-8 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-2 top-2.5 text-slate-500 hover:text-white"><X size={14} /></button>}
            </div>

            {/* Selects */}
            <select value={filterVacancy} onChange={(e) => setFilterVacancy(e.target.value)} className="bg-slate-900 border border-white/10 rounded-lg py-2 px-3 text-sm text-slate-300 outline-none focus:border-blue-500">
                <option value="all" className="bg-slate-900">Todas las Vacantes</option>
                {uniqueVacancies.map(v => <option key={v._id} value={v._id} className="bg-slate-900">{v.title.substring(0, 15)}...</option>)}
            </select>
            <select value={filterScore} onChange={(e) => setFilterScore(e.target.value)} className="bg-slate-900 border border-white/10 rounded-lg py-2 px-3 text-sm text-slate-300 outline-none focus:border-blue-500">
                <option value="all" className="bg-slate-900">Score: Todos</option>
                <option value="high" className="bg-slate-900">🔥 Top (85%+)</option>
                <option value="medium" className="bg-slate-900">⚠️ Medio</option>
                <option value="low" className="bg-slate-900">❌ Bajo</option>
            </select>
        </div>
      </div>

      {/* --- KANBAN BOARD --- */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 h-full min-w-[1000px]">
            {loading ? <div className="w-full flex justify-center pt-20"><Loader2 className="animate-spin text-blue-500" size={40}/></div> : 
            columns.map((col) => (
                <div key={col.id} className="flex-1 flex flex-col bg-slate-900/50 border border-white/5 rounded-xl min-w-[240px]">
                    <div className={`p-3 border-b border-white/5 border-t-4 ${col.color} rounded-t-xl bg-slate-900 sticky top-0 z-10 flex justify-between`}>
                        <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">{col.title}</h3>
                        <span className="bg-white/10 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">{getColumnApps(col.id).length}</span>
                    </div>

                    <div className="p-2 flex-1 overflow-y-auto custom-scrollbar space-y-2">
                        {getColumnApps(col.id).map((app) => (
                            <div key={app._id} className="bg-brand-surface border border-white/5 p-3 rounded-lg shadow-sm hover:border-blue-500/30 transition-all group relative">
                                {movingId === app._id && <div className="absolute inset-0 bg-slate-950/60 z-20 flex items-center justify-center rounded-lg backdrop-blur-sm"><Loader2 className="animate-spin text-white" /></div>}
                                
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                            {app.candidate?.full_name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm leading-tight truncate w-24">{app.candidate?.full_name}</h4>
                                            <p className="text-[10px] text-slate-400 truncate w-24">{app.vacancy?.title}</p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${app.ai_score >= 85 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                        <Brain size={10} /> {app.ai_score}%
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-2">
                                    {/* BOTÓN VER PERFIL */}
                                    <button 
                                        onClick={() => setSelectedApp(app)} 
                                        className="text-slate-500 hover:text-white p-1 rounded hover:bg-white/10 transition-colors" 
                                        title="Ver Detalles"
                                    >
                                        <User size={16} />
                                    </button>
                                    
                                    <div className="flex gap-1">
                                        {col.id !== 'rechazado' && <button onClick={() => handleMove(app._id, 'rechazado')} className="p-1 text-red-400 hover:bg-red-500/10 rounded"><XCircle size={14}/></button>}
                                        {col.id === 'nuevo' && <button onClick={() => handleMove(app._id, 'entrevista')} className="p-1 text-blue-400 hover:bg-blue-500/10 rounded"><ArrowRight size={14}/></button>}
                                        {col.id === 'entrevista' && <button onClick={() => handleMove(app._id, 'contratado')} className="p-1 text-green-400 hover:bg-green-500/10 rounded"><CheckCircle size={14}/></button>}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-brand-surface border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-white/10 bg-slate-900 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            {selectedApp.candidate?.full_name?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{selectedApp.candidate?.full_name}</h2>
                            <p className="text-slate-400 text-sm flex items-center gap-1">
                                <Briefcase size={14}/> Aplicando a: <span className="text-white">{selectedApp.vacancy?.title}</span>
                            </p>
                            <div className="flex gap-2 mt-2">
                                <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-white/5 capitalize">
                                    {selectedApp.status}
                                </span>
                                <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20 flex items-center gap-1 font-bold">
                                    <Brain size={12}/> Match: {selectedApp.ai_score}%
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setSelectedApp(null)} className="text-slate-500 hover:text-white p-1">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                    
                    {/* Contacto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><Mail size={18}/></div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Correo</p>
                                <p className="text-sm text-white truncate">{selectedApp.candidate?.email}</p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                            <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400"><Phone size={18}/></div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Teléfono</p>
                                <p className="text-sm text-white">{selectedApp.candidate?.phone || 'No registrado'}</p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                            <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400"><MapPin size={18}/></div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Ubicación</p>
                                <p className="text-sm text-white">{selectedApp.candidate?.location || 'No registrada'}</p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                            <div className="bg-pink-500/20 p-2 rounded-lg text-pink-400"><Calendar size={18}/></div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Postulado</p>
                                <p className="text-sm text-white">{new Date(selectedApp.applied_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* CV y Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Briefcase size={18}/> Habilidades</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedApp.candidate?.skills?.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-white/10">
                                        {skill}
                                    </span>
                                ))}
                                {(!selectedApp.candidate?.skills || selectedApp.candidate?.skills.length === 0) && (
                                    <p className="text-slate-500 text-sm italic">Sin habilidades registradas.</p>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-white mb-3 flex items-center gap-2"><FileText size={18}/> Curriculum Vitae</h3>
                            {selectedApp.candidate?.cv_url ? (
                                <a 
                                    href={selectedApp.candidate.cv_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 group"
                                >
                                    <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
                                    Descargar PDF
                                </a>
                            ) : (
                                <div className="w-full py-4 bg-slate-800/50 border border-dashed border-slate-600 rounded-xl flex items-center justify-center text-slate-500 gap-2">
                                    <XCircle size={18}/> El candidato no ha subido su CV
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-slate-900 border-t border-white/10 flex justify-end gap-3">
                    <button onClick={() => setSelectedApp(null)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cerrar</button>
                    {selectedApp.status === 'nuevo' && (
                        <button 
                            onClick={() => handleMove(selectedApp._id, 'entrevista')}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-2"
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