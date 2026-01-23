// src/pages/admin/UsersGlobalPage.jsx
import React, { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  User, 
  Briefcase, 
  ShieldAlert, 
  Trash2, 
  Lock 
} from 'lucide-react';

const UsersGlobalPage = () => {
  const [filter, setFilter] = useState('all'); // all, candidate, recruiter

  // Mock Data
  const users = [
    { id: 1, name: "Juan Pérez", email: "juan@gmail.com", role: "candidate", status: "active" },
    { id: 2, name: "Maria Lopez", email: "maria@empresa.com", role: "recruiter", status: "active" },
    { id: 3, name: "Pedro Hacker", email: "hack@spam.com", role: "candidate", status: "banned" },
    { id: 4, name: "Innovation Pascual", email: "admin@pascual.com", role: "recruiter", status: "active" },
  ];

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.role === filter);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
        <div className="flex bg-slate-900 p-1 rounded-lg border border-white/10">
            {['all', 'candidate', 'recruiter'].map((type) => (
                <button 
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filter === type ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    {type === 'all' ? 'Todos' : type === 'candidate' ? 'Candidatos' : 'Reclutadores'}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {/* Buscador interno */}
        <div className="p-4 border-b border-white/10 bg-slate-950/50">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre o correo..." 
                    className="bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white w-full focus:outline-none focus:border-orange-500" 
                />
            </div>
        </div>

        <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                <tr>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Rol</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${user.role === 'candidate' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{user.name}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded text-xs font-bold border ${user.role === 'candidate' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                {user.role === 'candidate' ? <User size={12}/> : <Briefcase size={12}/>}
                                {user.role === 'candidate' ? 'Candidato' : 'Reclutador'}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            {user.status === 'active' ? (
                                <span className="text-green-400 text-xs font-bold flex items-center gap-1">● Activo</span>
                            ) : (
                                <span className="text-red-400 text-xs font-bold flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                                    <ShieldAlert size={12}/> Baneado
                                </span>
                            )}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-orange-400" title="Bloquear Acceso">
                                    <Lock size={16} />
                                </button>
                                <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-red-400" title="Eliminar Definitivamente">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersGlobalPage;