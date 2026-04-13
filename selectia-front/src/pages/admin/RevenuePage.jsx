// src/pages/admin/RevenuePage.jsx
import React from 'react';
import { DollarSign, TrendingUp, Download, CreditCard, Activity } from 'lucide-react';

const RevenuePage = () => {
  const chartData = [40, 65, 45, 80, 55, 90, 100]; 
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Finanzas y Suscripciones</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">Monitoreo de ingresos de empresas reclutadoras.</p>
        </div>
        <button className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none text-sm font-medium">
            <Download size={16} /> Exportar CSV
        </button>
      </div>

      {/* --- TARJETAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gradient-to-br dark:from-green-900/20 dark:to-slate-900 border border-slate-200 dark:border-green-500/20 p-6 rounded-2xl shadow-sm dark:shadow-none transition-colors">
            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider transition-colors">Ingresos Mes Actual</p>
                <DollarSign size={16} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">$124,500.00</h2>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors">
                <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded transition-colors">+12%</span> vs mes anterior
            </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm dark:shadow-none transition-colors">
            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider transition-colors">Suscripciones Activas</p>
                <Activity size={16} className="text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">85</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors">Empresas en Plan Premium</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm dark:shadow-none transition-colors">
            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider transition-colors">Pago Promedio (ARPU)</p>
                <TrendingUp size={16} className="text-purple-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">$1,464.00</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors">Por empresa activa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfica Simple */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm dark:shadow-none transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 transition-colors">Ingresos Semanales</h3>
            
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4">
                {chartData.map((height, index) => (
                    <div key={index} className="w-full flex flex-col items-center gap-3 group">
                        <div 
                            className="w-full max-w-[40px] bg-blue-100 dark:bg-blue-900/30 border-t-4 border-blue-500 rounded-t transition-all duration-500 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 relative"
                            style={{ height: `${height}%` }}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                ${height * 150}
                            </div>
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors">{days[index]}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Últimas Transacciones */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm dark:shadow-none transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 transition-colors">Pagos Recientes</h3>
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-green-600 dark:text-green-400 shadow-sm transition-colors">
                                <CreditCard size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">Empresa #{item}23</p>
                                <p className="text-[10px] text-slate-500 font-medium transition-colors">Plan Mensual</p>
                            </div>
                        </div>
                        <span className="font-mono text-slate-900 dark:text-white font-bold text-sm transition-colors">+$990</span>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default RevenuePage;