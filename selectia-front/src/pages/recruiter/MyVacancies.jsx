// src/pages/recruiter/MyVacancies.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Search, 
    Filter, 
    Calendar, 
    Edit3, 
    Trash2, 
    Loader2, 
    PlusCircle, 
    Briefcase
} from 'lucide-react';
import axios from '../../api/axios';

const MyVacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Cargar vacantes reales al entrar
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await axios.get('/vacancies/mine');
        setVacancies(res.data);
      } catch (err) {
        console.error(err);
        setError('No pudimos cargar tus vacantes.');
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  // Función auxiliar para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="animate-in fade-in duration-500 min-h-[500px] transition-colors">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Mis Vacantes</h1>
        
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 w-4 h-4 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Buscar vacante..." 
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm dark:shadow-none" 
                />
            </div>
            <button className="p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-blue-300 transition-colors shadow-sm dark:shadow-none">
                <Filter size={20}/>
            </button>
            <Link to="/recruiter/post-job" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md dark:shadow-lg dark:shadow-blue-900/20">
                <PlusCircle size={16} /> 
                <span className="hidden sm:inline">Nueva</span>
            </Link>
        </div>
      </div>

      {/* Tabla de Contenido */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm dark:shadow-xl transition-colors duration-300">
        
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
                <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Cargando tus vacantes...</p>
            </div>
        ) : error ? (
            <div className="p-10 text-center text-red-500 dark:text-red-400 transition-colors">
                <p>{error}</p>
            </div>
        ) : vacancies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 transition-colors">
                <Briefcase size={48} className="mb-4 opacity-50 dark:opacity-20 transition-colors" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 transition-colors">No tienes vacantes activas</h3>
                <p className="mb-6 max-w-xs text-center text-slate-600 dark:text-slate-400 transition-colors">Publica tu primera oferta de empleo para empezar a recibir candidatos con IA.</p>
                <Link to="/recruiter/post-job" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors">
                    Crear Vacante
                </Link>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-xs transition-colors">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Título</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 text-center font-semibold">Salario</th>
                            <th className="px-6 py-4 text-center font-semibold">Modalidad</th>
                            <th className="px-6 py-4 font-semibold">Publicada</th>
                            <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300 transition-colors">
                        {vacancies.map((job) => (
                            <tr key={job._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900 dark:text-white text-base transition-colors">{job.title}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5 line-clamp-1 max-w-[200px] transition-colors">
                                        {job.description}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border capitalize transition-colors ${
                                        job.status === 'activa' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' : 
                                        job.status === 'pausada' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20' :
                                        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                                    }`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center font-mono text-xs text-slate-600 dark:text-slate-400 transition-colors">
                                    ${job.salary_min} - ${job.salary_max}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-transparent px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-300 transition-colors">
                                        {job.modality}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-2 transition-colors">
                                    <Calendar size={14}/> {formatDate(job.created_at)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400 transition-colors" title="Editar">
                                            <Edit3 size={16}/>
                                        </button>
                                        <button className="p-2 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400 transition-colors" title="Eliminar">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default MyVacancies;