import React from 'react';
import { UserPlus, Trash2 } from 'lucide-react';

const UserManagementPage = () => (
  <div className="max-w-4xl mx-auto animate-in fade-in transition-colors duration-300">
    <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Gestión de Usuarios</h1>
        <button className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-white px-4 py-2 rounded border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm dark:shadow-none transition-all"><UserPlus size={16}/> Invitar Usuario</button>
    </div>
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm dark:shadow-none transition-colors">
        <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300 transition-colors">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 transition-colors"><tr><th className="p-4">Nombre</th><th className="p-4">Email</th><th className="p-4">Rol</th><th className="p-4"></th></tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors">
                <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3 font-medium text-slate-900 dark:text-white transition-colors"><div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">JR</div> Jesús Ruiz</td>
                    <td className="p-4">jesus@pascual.com</td>
                    <td className="p-4"><span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-xs border border-blue-200 dark:border-blue-500/20 transition-colors">Admin</span></td>
                    <td className="p-4 text-right"><button className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"><Trash2 size={16}/></button></td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
);

export default UserManagementPage;