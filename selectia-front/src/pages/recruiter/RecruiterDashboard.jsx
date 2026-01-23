// src/pages/recruiter/RecruiterDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, Clock, Sparkles, ArrowRight, Loader2, Download, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

const RecruiterDashboard = () => {
  const [statsData, setStatsData] = useState({
    totalVacancies: 0, activeVacancies: 0, totalCandidates: 0, newCandidates: 0
  });
  const [recentApps, setRecentApps] = useState([]);
  const [agenda, setAgenda] = useState([]); // <--- Estado para Agenda
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false); // Estado descarga

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Reclutador' };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get('/stats/recruiter');
        setStatsData(statsRes.data);

        const appsRes = await axios.get('/applications/recruiter');
        setRecentApps(appsRes.data.slice(0, 5));

        // --- Cargar Agenda ---
        const agendaRes = await axios.get('/applications/agenda');
        setAgenda(agendaRes.data);

      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FUNCIÓN DESCARGAR REPORTE ---
  const handleDownloadReport = async () => {
      setDownloading(true);
      try {
          const response = await axios.get('/stats/report', { responseType: 'blob' });
          
          // Crear un link invisible para descargar el archivo
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'reporte_selectia.csv');
          document.body.appendChild(link);
          link.click();
          link.remove();
      } catch (error) {
          console.error("Error descargando reporte", error);
          alert("Error al descargar el reporte");
      } finally {
          setDownloading(false);
      }
  };

  const statsCards = [
    { title: 'Candidatos Nuevos', value: statsData.newCandidates, change: 'Pendientes', icon: <Users className="text-blue-400" />, color: 'bg-blue-500/10 border-blue-500/20' },
    { title: 'Vacantes Activas', value: statsData.activeVacancies, change: `de ${statsData.totalVacancies} total`, icon: <Briefcase className="text-purple-400" />, color: 'bg-purple-500/10 border-purple-500/20' },
    { title: 'Total Postulaciones', value: statsData.totalCandidates, change: '+100%', icon: <Clock className="text-orange-400" />, color: 'bg-orange-500/10 border-orange-500/20' },
    { title: 'Eficiencia IA', value: '92%', change: '+5%', icon: <Sparkles className="text-green-400" />, color: 'bg-green-500/10 border-green-500/20' },
  ];

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-white">Panel de Control</h1>
            <p className="text-slate-400 text-sm">Bienvenido de nuevo, {user.name} 👋</p>
        </div>
        <div className="flex gap-3">
            {/* BOTÓN DESCARGAR FUNCIONAL */}
            <button 
                onClick={handleDownloadReport}
                disabled={downloading}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-white/5 flex items-center gap-2"
            >
                {downloading ? <Loader2 size={16} className="animate-spin"/> : <Download size={16}/>}
                {downloading ? 'Generando...' : 'Descargar Reporte'}
            </button>
            <Link to="/recruiter/post-job" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2">
                + Nueva Vacante
            </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, index) => (
            <div key={index} className={`p-5 rounded-2xl border ${stat.color} hover:scale-[1.02] transition-transform`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-slate-900/50 rounded-lg">{stat.icon}</div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-slate-900/50 ${stat.change.includes('+') ? 'text-green-400' : 'text-slate-400'}`}>{stat.change}</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-slate-400 text-sm">{stat.title}</p>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLUMNA IZQUIERDA: Candidatos Recientes --- */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 animate-pulse flex-shrink-0">
                        <Sparkles className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">La IA está analizando perfiles</h3>
                        <p className="text-blue-200 text-sm">Tus vacantes están siendo optimizadas.</p>
                    </div>
                </div>
                <Link to="/recruiter/candidates" className="px-4 py-2 bg-white text-blue-900 font-bold rounded-lg text-sm hover:bg-blue-50 transition-colors whitespace-nowrap">Ver Candidatos</Link>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-white">Actividad Reciente</h3>
                    <Link to="/recruiter/candidates" className="text-blue-400 text-sm hover:text-white transition-colors">Ver todos</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-950/50">
                            <tr><th className="px-6 py-4">Candidato</th><th className="px-6 py-4">Vacante</th><th className="px-6 py-4">Match IA</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4"></th></tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentApps.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No hay actividad reciente.</td></tr>
                            ) : (
                                recentApps.map((app) => (
                                    <tr key={app._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold overflow-hidden">
                                                {app.candidate?.photo_url ? <img src={app.candidate.photo_url} className="w-full h-full object-cover"/> : (app.candidate?.full_name?.charAt(0) || '?')}
                                            </div>
                                            <div>
                                                {app.candidate?.full_name}
                                                <div className="text-xs text-slate-500 font-normal">{new Date(app.applied_at).toLocaleDateString()}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{app.vacancy?.title}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className={`h-full rounded-full ${app.ai_score > 85 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${app.ai_score}%`}}></div></div>
                                                <span className="text-xs font-bold text-slate-400">{app.ai_score}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-bold border bg-slate-800 border-slate-700 text-slate-300 capitalize">{app.status}</span></td>
                                        <td className="px-6 py-4 text-right"><Link to="/recruiter/candidates" className="p-1 hover:bg-slate-700 rounded text-slate-400"><ArrowRight size={16} /></Link></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* --- COLUMNA DERECHA: Agenda --- */}
        <div className="space-y-6">
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-400"/> Agenda de Entrevistas
                </h3>
                <div className="space-y-4 relative">
                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-800"></div>

                    {agenda.length === 0 ? (
                        <div className="relative pl-6">
                            <div className="absolute left-0 top-1 w-4 h-4 bg-slate-600 rounded-full border-2 border-slate-900"></div>
                            <p className="text-sm font-bold text-white">Sin entrevistas</p>
                            <p className="text-xs text-slate-500">Mueve candidatos a la columna "Entrevista" para verlos aquí.</p>
                        </div>
                    ) : (
                        agenda.map((item) => (
                            <div key={item._id} className="relative pl-6 pb-2 group">
                                <div className="absolute left-0 top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-slate-900 shadow shadow-blue-500/50"></div>
                                <p className="text-xs text-blue-300 mb-0.5 font-bold">
                                    {item.interview_date ? new Date(item.interview_date).toLocaleString() : "Por agendar"}
                                </p>
                                <p className="text-sm font-bold text-white">{item.candidate?.full_name}</p>
                                <p className="text-xs text-slate-400">{item.vacancy?.title}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4">Consejo Rápido</h3>
                <p className="text-sm text-slate-400">Completa la descripción de tus vacantes al 100% para mejorar el match de la Inteligencia Artificial.</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default RecruiterDashboard;