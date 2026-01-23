// src/pages/admin/RevenuePage.jsx
import React from 'react';
import { DollarSign, TrendingUp, Download, CreditCard } from 'lucide-react';

const RevenuePage = () => {
  
  // Datos para la gráfica (simulada con CSS)
  const chartData = [40, 65, 45, 80, 55, 90, 100]; // Porcentajes de altura
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Reporte de Ingresos</h1>
        <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-colors border border-white/10">
            <Download size={18} /> Exportar CSV
        </button>
      </div>

      {/* --- TARJETAS SUPERIORES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-900/40 to-slate-900 border border-green-500/30 p-6 rounded-2xl">
            <p className="text-green-400 text-sm font-bold mb-2 uppercase tracking-wider">Ingresos Totales (Mes)</p>
            <h2 className="text-4xl font-bold text-white mb-2">$124,500.00</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="bg-green-500/20 text-green-400 px-1.5 rounded text-xs font-bold">+12%</span> vs mes anterior
            </div>
        </div>
        <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm font-bold mb-2 uppercase tracking-wider">Suscripciones Activas</p>
            <h2 className="text-4xl font-bold text-white mb-2">85</h2>
            <p className="text-sm text-slate-500">Empresas en Plan Premium</p>
        </div>
        <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm font-bold mb-2 uppercase tracking-wider">Pago Promedio (ARPU)</p>
            <h2 className="text-4xl font-bold text-white mb-2">$1,450</h2>
            <p className="text-sm text-slate-500">Por empresa activa</p>
        </div>
      </div>

      {/* --- GRÁFICA Y TRANSACCIONES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfica Simple CSS */}
        <div className="lg:col-span-2 bg-slate-900 border border-white/10 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <TrendingUp className="text-orange-500" size={20}/> Tendencia Semanal
                </h3>
            </div>
            
            {/* Contenedor Gráfica */}
            <div className="h-64 flex items-end justify-between gap-4 px-4">
                {chartData.map((height, index) => (
                    <div key={index} className="w-full flex flex-col items-center gap-2 group">
                        <div 
                            className="w-full bg-orange-600/20 border-t-4 border-orange-500 rounded-t-sm transition-all duration-500 group-hover:bg-orange-600/40 relative"
                            style={{ height: `${height}%` }}
                        >
                            {/* Tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                ${height * 150}
                            </div>
                        </div>
                        <span className="text-xs text-slate-500">{days[index]}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Últimas Transacciones */}
        <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl overflow-y-auto max-h-[400px] custom-scrollbar">
            <h3 className="font-bold text-white mb-4">Recientes</h3>
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-800 rounded-full text-green-400">
                                <CreditCard size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Innovation Pascual</p>
                                <p className="text-xs text-slate-500">Plan Premium</p>
                            </div>
                        </div>
                        <span className="font-mono text-green-400 font-bold text-sm">+$2,500</span>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default RevenuePage;