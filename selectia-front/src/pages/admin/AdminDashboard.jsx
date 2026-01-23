// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import axios from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar estadísticas globales reales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/stats/admin');
        setStats(res.data);
      } catch (error) {
        console.error("Error cargando admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  // Empresas pendientes de validación (Simulado para Demo Visual)
  const pendingCompanies = [
    { id: 1, name: "Tech Solutions S.A.", rfc: "TES990101AAA", registered: "Hace 2 horas", status: "pending" },
    { id: 2, name: "Consultoría Global", rfc: "CON880202BBB", registered: "Hace 5 horas", status: "pending" },
    { id: 3, name: "Inversiones Patito", rfc: "INV770303CCC", registered: "Ayer", status: "suspicious" },
  ];

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <h1 className="text-2xl font-bold text-white mb-6">Visión Global de la Plataforma</h1>

      {/* --- KPI CARDS (CONECTADO A DB) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Card 1: Ingresos Estimados */}
        <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-green-500/20"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2 bg-green-500/20 text-green-400 rounded-lg"><DollarSign size={20}/></div>
                <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">Simulado</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1 relative z-10">${stats.estimatedRevenue?.toLocaleString()}</h3>
            <p className="text-slate-400 text-xs relative z-10">Ingresos Mensuales Recurrentes (MRR)</p>
        </div>

        {/* Card 2: Candidatos Totales */}
        <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Users size={20}/></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.totalCandidates}</h3>
            <p className="text-slate-400 text-xs">Candidatos Registrados</p>
        </div>

        {/* Card 3: Empresas Totales */}
        <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg"><Building2 size={20}/></div>
                <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full">+ Nuevas</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.totalRecruiters}</h3>
            <p className="text-slate-400 text-xs">Empresas Activas</p>
        </div>

        {/* Card 4: Postulaciones Totales */}
        <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><TrendingUp size={20}/></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.totalApplications}</h3>
            <p className="text-slate-400 text-xs">Postulaciones Totales</p>
        </div>
      </div>

      {/* --- VALIDACIÓN DE EMPRESAS (Sección Visual Demo) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-white">Empresas pendientes de validación</h3>
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded border border-orange-500/30 animate-pulse">3 Acciones requeridas</span>
            </div>
            
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-950 text-slate-500 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-4">Empresa</th>
                        <th className="px-6 py-4">RFC</th>
                        <th className="px-6 py-4">Registro</th>
                        <th className="px-6 py-4 text-right">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                    {pendingCompanies.map((comp) => (
                        <tr key={comp.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                                {comp.status === 'suspicious' && <AlertTriangle size={14} className="text-yellow-500" />}
                                {comp.name}
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-400">{comp.rfc}</td>
                            <td className="px-6 py-4 text-xs">{comp.registered}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button className="p-2 bg-green-500/10 text-green-400 rounded hover:bg-green-500 hover:text-white transition-colors" title="Aprobar">
                                        <CheckCircle size={16} />
                                    </button>
                                    <button className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors" title="Rechazar">
                                        <XCircle size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* --- AUDITORÍA DE SISTEMA (Visual Demo) --- */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Logs del Sistema</h3>
            <div className="space-y-4 font-mono text-xs">
                <div className="flex gap-3 text-slate-400">
                    <span className="text-slate-600">10:42:01</span>
                    <span>Nuevo pago recibido: <span className="text-green-400">$2,500</span> (ID: #TX99)</span>
                </div>
                <div className="flex gap-3 text-slate-400">
                    <span className="text-slate-600">10:35:15</span>
                    <span>Usuario reportado: <span className="text-red-400">Spam en vacantes</span></span>
                </div>
                <div className="flex gap-3 text-slate-400">
                    <span className="text-slate-600">10:15:00</span>
                    <span>Backup de base de datos completado.</span>
                </div>
                <div className="flex gap-3 text-slate-400">
                    <span className="text-slate-600">09:55:23</span>
                    <span>Usuarios totales: {stats?.totalUsers}</span>
                </div>
            </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;