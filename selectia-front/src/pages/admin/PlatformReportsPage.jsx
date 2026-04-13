// src/pages/admin/PlatformReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Building2, BrainCircuit, Loader2, Download } from 'lucide-react';
import axios from '../../api/axios';

const PlatformReportsPage = () => {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  // Estado inicial vacío (TODO REAL)
  const [reportData, setReportData] = useState({ 
    topCompanies: [], 
    averageAiScore: 0,
    chartData: [0, 0, 0, 0, 0, 0, 0],    // Altura de barras
    rawChartData: [0, 0, 0, 0, 0, 0, 0]  // Cantidad real de postulaciones
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('/admin/reports');
        // Si el backend no devuelve gráfica, usamos un fallback de ceros
        const data = {
            ...res.data,
            chartData: res.data.chartData || [0,0,0,0,0,0,0],
            rawChartData: res.data.rawChartData || [0,0,0,0,0,0,0]
        };
        setReportData(data);
      } catch (error) {
        console.error("Error fetching reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reportes de Plataforma</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Análisis real del rendimiento y uso de SelectIA.</p>
        </div>
        <button className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-white/10 shadow-sm text-sm font-medium">
            <Download size={16} /> Exportar Reporte
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Promedio Match IA Global</p>
                <BrainCircuit size={16} className="text-purple-500" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{reportData.averageAiScore}%</h2>
            <p className="text-xs text-slate-500">De afinidad histórica entre candidatos y vacantes.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Postulaciones (7 Días)</p>
                <BarChart3 size={16} className="text-blue-500" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {reportData.rawChartData.reduce((a, b) => a + b, 0)}
            </h2>
            <p className="text-xs text-slate-500">Postulaciones totales esta semana.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfica Real de Postulaciones */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Volumen de Postulaciones (Semanal)</h3>
            
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4 border-b border-slate-100 dark:border-white/5 pb-2">
                {reportData.chartData.map((height, index) => (
                    <div key={index} className="w-full flex flex-col items-center gap-3 group">
                        <div 
                            className="w-full max-w-[40px] bg-blue-100 dark:bg-blue-900/30 border-t-4 border-blue-500 rounded-t transition-all duration-500 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 relative"
                            // Si la altura es 0, le damos 2% para que se vea una rayita y no desaparezca
                            style={{ height: `${height > 0 ? height : 2}%` }}
                        >
                            {/* Este tooltip muestra el NÚMERO REAL, no el porcentaje */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {reportData.rawChartData[index]} apps
                            </div>
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{days[index]}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Top Empresas Reales */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Top Empresas Reclutadoras</h3>
            <p className="text-xs text-slate-500 mb-4">Empresas con mayor volumen de vacantes.</p>
            <div className="space-y-3">
                {reportData.topCompanies.length > 0 ? reportData.topCompanies.map((comp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-orange-500 font-bold text-xs">
                                #{idx + 1}
                            </div>
                            <div className="w-24 truncate">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate" title={comp.name}>{comp.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold text-lg">{comp.vacancies}</span>
                            <p className="text-[10px] text-slate-500">Vacantes</p>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-slate-500 py-8 text-sm">No hay vacantes publicadas aún en la plataforma.</p>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default PlatformReportsPage;