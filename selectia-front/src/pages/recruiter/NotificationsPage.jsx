import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from '../../api/axios';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar notificaciones al entrar
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNCIÓN PARA MARCAR COMO LEÍDA ---
  const handleMarkAsRead = async (id, isAlreadyRead) => {
    if (isAlreadyRead) return; // Si ya está leída, no hacemos nada

    try {
      // 1. Actualización Optimista (Frontend inmediato)
      const updatedList = notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      );
      setNotifications(updatedList);

      // 2. Actualización en Base de Datos (Backend)
      await axios.put(`/notifications/${id}/read`);
      
      // Opcional: Disparar evento para actualizar el contador de la campanita en el Navbar
      // window.dispatchEvent(new Event('notificationRead')); 

    } catch (error) {
      console.error("Error al marcar como leída", error);
    }
  };

  const getIcon = (type) => {
      switch(type) {
          case 'success': return <CheckCircle className="text-green-600 dark:text-green-500 transition-colors" />;
          case 'alert': return <AlertTriangle className="text-orange-600 dark:text-orange-500 transition-colors" />;
          default: return <Info className="text-blue-600 dark:text-blue-500 transition-colors" />;
      }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Cargando avisos...</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-20 transition-colors">
      
      {/* HEADER */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-xl text-brand-primary transition-colors">
            <Bell size={28} />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Notificaciones</h1>
            <p className="text-slate-600 dark:text-slate-400 transition-colors">Mantente al día con tus procesos.</p>
        </div>
      </div>

      {/* LISTA */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-brand-surface/30 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none transition-colors">
                <p className="text-slate-500">No tienes notificaciones nuevas.</p>
            </div>
        ) : (
            notifications.map((notif) => (
                <div 
                    key={notif._id}
                    onClick={() => handleMarkAsRead(notif._id, notif.read)}
                    className={`
                        relative p-5 rounded-2xl border transition-all cursor-pointer group
                        ${notif.read 
                            ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 opacity-70 hover:opacity-100' // Estilo LEÍDO
                            : 'bg-white dark:bg-brand-surface border-brand-primary/30 shadow-md dark:shadow-lg dark:shadow-brand-primary/10' // Estilo NO LEÍDO
                        }
                    `}
                >
                    {/* Indicador de "Nuevo" (Punto Morado) */}
                    {!notif.read && (
                        <span className="absolute top-4 right-4 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
                        </span>
                    )}

                    <div className="flex gap-4">
                        <div className={`mt-1 p-2 rounded-full h-fit transition-colors ${notif.read ? 'bg-slate-200 dark:bg-slate-800' : 'bg-slate-100 dark:bg-white/10'}`}>
                            {getIcon(notif.type)}
                        </div>
                        <div>
                            <h3 className={`font-bold text-lg mb-1 transition-colors ${notif.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                                {notif.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3 transition-colors">
                                {notif.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1 transition-colors">
                                    <Clock size={12}/> {new Date(notif.created_at).toLocaleDateString()}
                                </span>
                                {notif.read && (
                                    <span className="flex items-center gap-1 text-green-600/70 dark:text-green-500/50 transition-colors">
                                        <Check size={12}/> Visto
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;