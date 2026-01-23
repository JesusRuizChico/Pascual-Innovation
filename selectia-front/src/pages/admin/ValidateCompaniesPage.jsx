// src/pages/admin/ValidateCompaniesPage.jsx
import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  FileText, 
  Search, 
  Building2, 
  AlertTriangle,
  Eye
} from 'lucide-react';

const ValidateCompaniesPage = () => {
  // Datos simulados de empresas pendientes
  const [companies, setCompanies] = useState([
    { 
      id: 1, 
      name: "Tech Solutions S.A. de C.V.", 
      rfc: "TES990101AAA", 
      email: "contacto@techsolutions.mx",
      docs: "Acta Constitutiva, Constancia Fiscal",
      status: "pending",
      date: "20 Ene 2026"
    },
    { 
      id: 2, 
      name: "Consultoría Global", 
      rfc: "CON880202BBB", 
      email: "rh@consultoria.com",
      docs: "Constancia Fiscal",
      status: "pending",
      date: "19 Ene 2026"
    },
    { 
      id: 3, 
      name: "Inversiones Patito", 
      rfc: "INV770303CCC", 
      email: "dinero@patito.com",
      docs: "Sin documentos",
      status: "suspicious", // Marcada como sospechosa
      date: "18 Ene 2026"
    }
  ]);

  // Función para aprobar/rechazar (Solo visual por ahora)
  const handleAction = (id, action) => {
    // En una app real, aquí harías una petición al backend
    alert(`Empresa #${id} ${action === 'approve' ? 'APROBADA' : 'RECHAZADA'}`);
    setCompanies(companies.filter(c => c.id !== id));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-white">Validación de Empresas</h1>
            <p className="text-slate-400 text-sm">Revisa la documentación antes de activar las cuentas.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
            <input 
                type="text" 
                placeholder="Buscar por RFC o Nombre..." 
                className="bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500 w-64" 
            />
        </div>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                <tr>
                    <th className="px-6 py-4">Empresa</th>
                    <th className="px-6 py-4">RFC / Contacto</th>
                    <th className="px-6 py-4">Documentación</th>
                    <th className="px-6 py-4">Fecha Registro</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
                {companies.length > 0 ? companies.map((comp) => (
                    <tr key={comp.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-orange-400">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-white flex items-center gap-2">
                                        {comp.name}
                                        {comp.status === 'suspicious' && (
                                            <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded border border-red-500/30 flex items-center gap-1">
                                                <AlertTriangle size={10} /> Riesgo
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-slate-500">ID: #{comp.id}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <p className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded w-fit text-xs mb-1">{comp.rfc}</p>
                            <p className="text-xs text-slate-500">{comp.email}</p>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-400">
                                <FileText size={16} />
                                <span>{comp.docs}</span>
                            </div>
                            <button className="text-blue-400 text-xs hover:text-white mt-1 flex items-center gap-1">
                                <Eye size={12}/> Ver archivos
                            </button>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{comp.date}</td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => handleAction(comp.id, 'reject')}
                                    className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
                                >
                                    <XCircle size={14} /> Rechazar
                                </button>
                                <button 
                                    onClick={() => handleAction(comp.id, 'approve')}
                                    className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
                                >
                                    <CheckCircle size={14} /> Aprobar
                                </button>
                            </div>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                            <CheckCircle size={48} className="mx-auto mb-3 opacity-20" />
                            <p>¡Todo limpio! No hay empresas pendientes de validación.</p>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidateCompaniesPage;