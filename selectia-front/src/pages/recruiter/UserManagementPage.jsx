import React from 'react';
import { UserPlus, Trash2 } from 'lucide-react';
const UserManagementPage = () => (
  <div className="max-w-4xl mx-auto animate-in fade-in">
    <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
        <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded border border-white/10 hover:bg-slate-700"><UserPlus size={16}/> Invitar Usuario</button>
    </div>
    <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-500"><tr><th className="p-4">Nombre</th><th className="p-4">Email</th><th className="p-4">Rol</th><th className="p-4"></th></tr></thead>
            <tbody className="divide-y divide-white/5">
                <tr>
                    <td className="p-4 flex items-center gap-3"><div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">JR</div> Jesús Ruiz</td>
                    <td className="p-4">jesus@pascual.com</td>
                    <td className="p-4"><span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/20">Admin</span></td>
                    <td className="p-4 text-right"><button className="text-slate-500 hover:text-red-400"><Trash2 size={16}/></button></td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
);
export default UserManagementPage;