import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Building2, Briefcase, CheckCircle, XCircle, ShieldCheck, Loader2 } from 'lucide-react';
import axios from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalCandidates: 0, totalRecruiters: 0, totalVacancies: 0, totalApplications: 0, estimatedRevenue: 0 });
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/admin/dashboard-stats');
        setStats(res.data.stats);
        setPendingCompanies(res.data.pendingCompanies);
      } catch (error) {
        console.error("Error cargando admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Visión Global SelectIA</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">Resumen de actividad y métricas clave de la plataforma en tiempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg"><Users size={20}/></div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats.totalCandidates}</h3>
            <p className="text-slate-500 text-xs">Candidatos Registrados</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg"><Building2 size={20}/></div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats.totalRecruiters}</h3>
            <p className="text-slate-500 text-xs">Empresas Reclutadoras</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg"><Briefcase size={20}/></div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats.totalVacancies}</h3>
            <p className="text-slate-500 text-xs">Vacantes Publicadas</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg"><TrendingUp size={20}/></div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats.totalApplications}</h3>
            <p className="text-slate-500 text-xs">Postulaciones Totales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white">Empresas Recientes (Pendientes)</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 text-xs uppercase">
                        <tr><th className="px-6 py-4">Empresa / Email</th><th className="px-6 py-4">Registro</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                        {pendingCompanies.length > 0 ? pendingCompanies.map((comp) => (
                            <tr key={comp._id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                    {comp.name || comp.companyName || 'Sin Nombre'}
                                    <div className="text-xs font-normal text-slate-500 mt-0.5">{comp.email}</div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-500">{new Date(comp.createdAt).toLocaleDateString()}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="2" className="px-6 py-8 text-center text-slate-500">No hay empresas pendientes recientes.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-500" /> Estado del Sistema
            </h3>
            <div className="space-y-4 font-mono text-xs">
                <div className="flex flex-col gap-1 text-slate-600 dark:text-slate-400">
                    <span className="bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-100 dark:border-green-500/20 text-green-700 dark:text-green-400">Todas las APIs operativas. Conexión a MongoDB estable.</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;