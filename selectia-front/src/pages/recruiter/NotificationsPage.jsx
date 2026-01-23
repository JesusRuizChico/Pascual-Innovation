// src/pages/recruiter/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, User, Briefcase, Info, Loader2, CheckCircle2 } from 'lucide-react';
import axios from '../../api/axios';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar notificaciones
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error("Error al cargar notificaciones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Marcar una como leída
  const handleMarkRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      // Actualizar localmente
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      // Disparar evento para actualizar la campana del Header
      window.dispatchEvent(new Event('notificationUpdate'));
    } catch (error) { console.error(error); }
  };

  // Marcar TODAS como leídas
  const handleMarkAllRead = async () => {
    try {
      await axios.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      window.dispatchEvent(new Event('notificationUpdate'));
    } catch (error) { console.error(error); }
  };

  // Eliminar
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
      window.dispatchEvent(new Event('notificationUpdate'));
    } catch (error) { console.error(error); }
  };

  // Icono según tipo
  const getIcon = (type) => {
      switch(type) {
          case 'success': return <CheckCircle2 className="text-green-400" />;
          case 'error': return <Info className="text-red-400" />;
          default: return <User className="text-blue-400" />;
      }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Bell className="text-blue-500"/> Notificaciones
            </h1>
            <p className="text-slate-400 text-sm">Mantente al día con tus candidatos y procesos.</p>
        </div>
        {notifications.some(n => !n.read) && (
            <button 
                onClick={handleMarkAllRead}
                className="text-sm text-blue-400 hover:text-white flex items-center gap-2 transition-colors"
            >
                <Check size={16} /> Marcar todo como leído
            </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
            <div className="text-center py-20 bg-slate-900 border border-white/5 rounded-2xl">
                <Bell size={48} className="mx-auto text-slate-700 mb-4"/>
                <p className="text-slate-500">No tienes notificaciones nuevas.</p>
            </div>
        ) : (
            notifications.map((notif) => (
                <div 
                    key={notif._id} 
                    className={`p-5 rounded-xl border transition-all flex gap-4 items-start group ${
                        notif.read 
                        ? 'bg-slate-900/50 border-white/5 opacity-70' 
                        : 'bg-slate-800 border-blue-500/30 shadow-lg shadow-blue-900/10'
                    }`}
                >
                    {/* Icono */}
                    <div className={`p-3 rounded-full flex-shrink-0 ${notif.read ? 'bg-slate-800' : 'bg-slate-900 border border-white/10'}`}>
                        {getIcon(notif.type)}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className={`font-bold text-base ${notif.read ? 'text-slate-400' : 'text-white'}`}>
                                {notif.title}
                            </h4>
                            <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                                {new Date(notif.date).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                            {notif.message}
                        </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.read && (
                            <button 
                                onClick={() => handleMarkRead(notif._id)}
                                title="Marcar como leída"
                                className="p-2 bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                            >
                                <Check size={14} />
                            </button>
                        )}
                        <button 
                            onClick={() => handleDelete(notif._id)}
                            title="Eliminar"
                            className="p-2 bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;