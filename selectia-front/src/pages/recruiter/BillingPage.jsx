import React from 'react';
import { Download } from 'lucide-react';
const BillingPage = () => (
  <div className="max-w-4xl mx-auto animate-in fade-in">
    <h1 className="text-2xl font-bold text-white mb-6">Facturación y Plan</h1>
    <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-900/50 to-slate-900 border border-blue-500/30 p-6 rounded-xl">
            <h3 className="text-blue-400 font-bold mb-2">Plan Actual: PREMIUM</h3>
            <p className="text-white text-3xl font-bold mb-4">$2,500 <span className="text-sm text-slate-400">/mes</span></p>
            <p className="text-slate-400 text-sm mb-4">Próxima facturación: 20 Feb 2026</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Administrar Plan</button>
        </div>
        <div className="bg-slate-900 border border-white/10 p-6 rounded-xl">
            <h3 className="text-white font-bold mb-4">Datos Fiscales</h3>
            <p className="text-slate-400 text-sm">Innovation Pascual S.A. de C.V.</p>
            <p className="text-slate-400 text-sm">IPX990101AAA</p>
            <p className="text-slate-400 text-sm">Av. Tecnológico 45, San Juan del Río</p>
            <button className="text-blue-400 text-sm mt-4 hover:underline">Editar datos</button>
        </div>
    </div>
    <h3 className="text-white font-bold mb-4">Historial de Facturas</h3>
    <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-500"><tr><th className="p-4">Fecha</th><th className="p-4">Concepto</th><th className="p-4">Monto</th><th className="p-4"></th></tr></thead>
            <tbody className="divide-y divide-white/5">
                <tr><td className="p-4">20 Ene 2026</td><td className="p-4">Plan Premium - Enero</td><td className="p-4">$2,500.00</td><td className="p-4 text-right"><button><Download size={16}/></button></td></tr>
            </tbody>
        </table>
    </div>
  </div>
);
export default BillingPage;