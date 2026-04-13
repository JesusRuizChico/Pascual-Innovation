// src/pages/admin/AdminNotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Building2, Check, Info, Loader2, Trash2 } from 'lucide-react';
import axios from '../../api/axios';

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Descomenta para usar el endpoint de notificaciones reales (el que pasaste en tu código)
        // const res = await axios.get('/notifications/me');
        // setNotifications(res.data);

        setNotifications([
          { _id: 1, title: 'Validación de Empresa Pendiente', message: 'Inversiones Patito S.A. requiere revisión de documentos.', type: 'alert', created_at: new Date() },
          { _id: 2, title: 'Posible Spam Detectado', message: 'Múltiples postulaciones sospechosas desde una misma IP.', type: 'warning', created_at: new Date(Date.now() - 3600000) },
        ]);
      } catch (error) {
        console.error("Error cargando notificaciones", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
      try {
          // await axios.put(`/notifications/read/${id}`);
          setNotifications(notifications.filter(n => n._id !== id));
      } catch (error) {
          console.error("Error", error);
      }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-white/10 pb-6 transition-colors">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
                <Bell className="text-blue-600 dark:text-blue-400"/> Centro de Alertas
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 transition-colors">Notificaciones administrativas y reportes del sistema SelectIA.</p>
        </div>
        <button className="text-sm text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
            Marcar todas como leídas
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? notifications.map((notif) => (
            <div key={notif._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-2xl flex gap-4 hover:border-blue-500/30 dark:hover:border-blue-500/50 transition-colors shadow-sm dark:shadow-none group">
                
                <div className={`p-3 rounded-xl h-fit transition-colors ${
                    notif.type === 'alert' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' : 
                    notif.type === 'warning' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 
                    notif.type === 'success' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' :
                    'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}>
                    {notif.type === 'alert' ? <Building2 size={24}/> : 
                     notif.type === 'warning' ? <AlertTriangle size={24}/> : 
                     <Info size={24}/>}
                </div>
                
                <div className="flex-1 py-1">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white transition-colors">{notif.title}</h3>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded transition-colors">
                            {new Date(notif.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">{notif.message}</p>
                </div>

                <div className="flex items-center gap-1">
                    <button onClick={() => markAsRead(notif._id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-50 dark:bg-slate-800 rounded-lg transition-all" title="Marcar como leída">
                        <Check size={20}/>
                    </button>
                    <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-slate-50 dark:bg-slate-800 rounded-lg transition-all" title="Eliminar">
                        <Trash2 size={20}/>
                    </button>
                </div>
            </div>
        )) : (
            <div className="text-center py-12">
                <Bell size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                <p className="text-slate-500">No tienes notificaciones pendientes.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationsPage;