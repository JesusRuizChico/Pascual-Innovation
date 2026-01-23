// src/pages/admin/AdminNotificationsPage.jsx
import React from 'react';
import { Bell, AlertTriangle, Building2, ShieldCheck, Check } from 'lucide-react';

const AdminNotificationsPage = () => {
  const notifications = [
    { id: 1, title: 'Nueva empresa registrada', desc: 'Inversiones Patito requiere validación de documentos.', type: 'alert', time: 'Hace 10 min' },
    { id: 2, title: 'Reporte de usuario', desc: 'Se ha reportado una vacante falsa.', type: 'warning', time: 'Hace 1 hora' },
    { id: 3, title: 'Pago confirmado', desc: 'Tech Solutions ha renovado su plan anual.', type: 'success', time: 'Ayer' },
  ];

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Bell className="text-orange-500"/> Centro de Alertas Admin
      </h1>

      <div className="space-y-4">
        {notifications.map((notif) => (
            <div key={notif.id} className="bg-slate-900 border border-white/10 p-4 rounded-xl flex gap-4 hover:border-orange-500/50 transition-colors cursor-pointer group">
                <div className={`p-3 rounded-full h-fit ${
                    notif.type === 'alert' ? 'bg-blue-500/10 text-blue-400' : 
                    notif.type === 'warning' ? 'bg-red-500/10 text-red-400' : 
                    'bg-green-500/10 text-green-400'
                }`}>
                    {notif.type === 'alert' ? <Building2 size={20}/> : 
                     notif.type === 'warning' ? <AlertTriangle size={20}/> : 
                     <ShieldCheck size={20}/>}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white text-sm">{notif.title}</h3>
                        <span className="text-xs text-slate-500">{notif.time}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{notif.desc}</p>
                </div>
                <button className="self-center opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-green-400 transition-all" title="Marcar como atendido">
                    <Check size={18}/>
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotificationsPage;