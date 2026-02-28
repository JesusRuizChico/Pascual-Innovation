import React from 'react';
import { Download } from 'lucide-react';

const BillingPage = () => (
  <div className="max-w-4xl mx-auto animate-in fade-in transition-colors duration-300">
    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">Facturación y Plan</h1>
    
    <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Tarjeta Plan Actual */}
        <div className="bg-blue-50 dark:bg-gradient-to-br dark:from-blue-900/50 dark:to-slate-900 border border-blue-200 dark:border-blue-500/30 p-6 rounded-xl shadow-sm dark:shadow-none transition-colors">
            <h3 className="text-blue-700 dark:text-blue-400 font-bold mb-2 transition-colors">Plan Actual: PREMIUM</h3>
            <p className="text-slate-900 dark:text-white text-3xl font-bold mb-4 transition-colors">
                $2,500 <span className="text-sm text-slate-500 dark:text-slate-400 font-normal transition-colors">/mes</span>
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 transition-colors">Próxima facturación: 20 Feb 2026</p>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm">
                Administrar Plan
            </button>
        </div>
        
        {/* Tarjeta Datos Fiscales */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 rounded-xl shadow-sm dark:shadow-none transition-colors">
            <h3 className="text-slate-900 dark:text-white font-bold mb-4 transition-colors">Datos Fiscales</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">Innovation Pascual S.A. de C.V.</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">IPX990101AAA</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">Av. Tecnológico 45, San Juan del Río</p>
            <button className="text-blue-600 dark:text-blue-400 text-sm mt-4 hover:underline font-medium transition-colors">
                Editar datos
            </button>
        </div>
    </div>

    <h3 className="text-slate-900 dark:text-white font-bold mb-4 transition-colors">Historial de Facturas</h3>
    
    {/* Tabla Historial */}
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm dark:shadow-none transition-colors">
        <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300 transition-colors">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 transition-colors">
                <tr>
                    <th className="p-4 font-semibold">Fecha</th>
                    <th className="p-4 font-semibold">Concepto</th>
                    <th className="p-4 font-semibold">Monto</th>
                    <th className="p-4 font-semibold text-right">Acción</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors">
                <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4">20 Ene 2026</td>
                    <td className="p-4">Plan Premium - Enero</td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white transition-colors">$2,500.00</td>
                    <td className="p-4 text-right">
                        <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1" title="Descargar XML/PDF">
                            <Download size={18}/>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
);

export default BillingPage;