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
import axios from '../../api/axios'; // Nuestra configuración de Axios

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
    <div className="animate-in fade-in duration-500 min-h-[500px]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">Mis Vacantes</h1>
        
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Buscar vacante..." 
                    className="w-full bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                />
            </div>
            <button className="p-2 bg-slate-900 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Filter size={20}/>
            </button>
            <Link to="/recruiter/post-job" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-900/20">
                <PlusCircle size={16} /> 
                <span className="hidden sm:inline">Nueva</span>
            </Link>
        </div>
      </div>

      {/* Tabla de Contenido */}
      <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden shadow-xl">
        
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
                <p className="text-slate-400 text-sm">Cargando tus vacantes...</p>
            </div>
        ) : error ? (
            <div className="p-10 text-center text-red-400">
                <p>{error}</p>
            </div>
        ) : vacancies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Briefcase size={48} className="mb-4 opacity-20" />
                <h3 className="text-lg font-bold text-white mb-2">No tienes vacantes activas</h3>
                <p className="mb-6 max-w-xs text-center">Publica tu primera oferta de empleo para empezar a recibir candidatos con IA.</p>
                <Link to="/recruiter/post-job" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg">
                    Crear Vacante
                </Link>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Título</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-center">Salario</th>
                            <th className="px-6 py-4 text-center">Modalidad</th>
                            <th className="px-6 py-4">Publicada</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                        {vacancies.map((job) => (
                            <tr key={job._id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white text-base">{job.title}</div>
                                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-[200px]">
                                        {job.description}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border capitalize ${
                                        job.status === 'activa' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                        job.status === 'pausada' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                        'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center font-mono text-xs text-slate-400">
                                    ${job.salary_min} - ${job.salary_max}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300">
                                        {job.modality}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 flex items-center gap-2 mt-2">
                                    <Calendar size={14}/> {formatDate(job.created_at)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-colors" title="Editar">
                                            <Edit3 size={16}/>
                                        </button>
                                        <button className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" title="Eliminar">
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