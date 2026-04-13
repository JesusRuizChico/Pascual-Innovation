import React, { useState, useEffect } from 'react';
import { Search, User, Briefcase, ShieldAlert, Trash2, Lock, Loader2 } from 'lucide-react';
import axios from '../../api/axios';

const UsersGlobalPage = () => {
  const [filter, setFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/admin/users');
        setUsers(res.data);
      } catch (error) {
        console.error("Error cargando usuarios", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.role === filter);

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Directorio de Usuarios</h1>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-white/10">
            {['all', 'candidate', 'recruiter'].map((type) => (
                <button 
                    key={type} onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${filter === type ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500'}`}
                >
                    {type === 'all' ? 'Todos' : type === 'candidate' ? 'Candidatos' : 'Reclutadores'}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 text-xs uppercase">
                    <tr><th className="px-6 py-4">Usuario</th><th className="px-6 py-4">Rol</th><th className="px-6 py-4">Registro</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                    {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${user.role === 'candidate' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                                        {(user.name || user.companyName || 'U').charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{user.name || user.companyName}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-md text-xs font-bold ${user.role === 'candidate' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                    {user.role === 'candidate' ? <User size={14}/> : <Briefcase size={14}/>}
                                    {user.role === 'candidate' ? 'Candidato' : 'Reclutador'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                        </tr>
                    )) : (
                        <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-500">No se encontraron usuarios en la base de datos.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default UsersGlobalPage;