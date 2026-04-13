import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Building2, Loader2 } from 'lucide-react';
import axios from '../../api/axios';

const ValidateCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get('/admin/pending-companies');
        setCompanies(res.data);
      } catch (error) {
        console.error("Error cargando empresas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    try {
        await axios.post(`/admin/validate-company/${id}`, { action });
        setCompanies(companies.filter(c => c._id !== id));
    } catch (error) {
        console.error("Error al validar", error);
        alert("Ocurrió un error al procesar la solicitud.");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Aprobación de Empresas</h1>
        <p className="text-slate-600 text-sm">Habilita o rechaza reclutadores recién registrados.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 text-xs uppercase">
                    <tr><th className="px-6 py-4">Empresa</th><th className="px-6 py-4">RFC / Correo</th><th className="px-6 py-4 text-right">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                    {companies.length > 0 ? companies.map((comp) => (
                        <tr key={comp._id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500"><Building2 size={20} /></div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{comp.name || comp.companyName}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">ID: {comp._id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <p className="font-mono text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded w-fit text-xs font-bold mb-1">{comp.rfc || 'No especificado'}</p>
                                <p className="text-xs text-slate-500">{comp.email}</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => handleAction(comp._id, 'reject')} className="px-3 py-2 bg-white dark:bg-slate-800 text-red-600 border border-slate-200 rounded-lg hover:bg-red-50 flex items-center gap-2 text-xs font-bold">
                                        <XCircle size={16} /> Rechazar
                                    </button>
                                    <button onClick={() => handleAction(comp._id, 'approve')} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-xs font-bold">
                                        <CheckCircle size={16} /> Aprobar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="3" className="px-6 py-16 text-center text-slate-500"><p className="font-medium text-slate-900 dark:text-white">¡Al día!</p><p className="text-sm mt-1">No hay empresas pendientes.</p></td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ValidateCompaniesPage;