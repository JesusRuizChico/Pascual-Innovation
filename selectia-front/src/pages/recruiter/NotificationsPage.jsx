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
          case 'success': return <CheckCircle className="text-green-500" />;
          case 'alert': return <AlertTriangle className="text-orange-500" />;
          default: return <Info className="text-blue-500" />;
      }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Cargando avisos...</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-20">
      
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-brand-primary/20 rounded-xl text-brand-primary">
            <Bell size={28} />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-white">Notificaciones</h1>
            <p className="text-slate-400">Mantente al día con tus procesos.</p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
            <div className="text-center py-12 bg-brand-surface/30 rounded-2xl border border-white/5">
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
                            ? 'bg-slate-900/50 border-white/5 opacity-70 hover:opacity-100' // Estilo LEÍDO (apagado)
                            : 'bg-brand-surface border-brand-primary/30 shadow-lg shadow-brand-primary/10' // Estilo NO LEÍDO (resaltado)
                        }
                    `}
                >
                    {/* Indicador de "Nuevo" (Punto Azul) */}
                    {!notif.read && (
                        <span className="absolute top-4 right-4 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
                        </span>
                    )}

                    <div className="flex gap-4">
                        <div className={`mt-1 p-2 rounded-full h-fit ${notif.read ? 'bg-slate-800' : 'bg-white/10'}`}>
                            {getIcon(notif.type)}
                        </div>
                        <div>
                            <h3 className={`font-bold text-lg mb-1 ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                                {notif.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-3">
                                {notif.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Clock size={12}/> {new Date(notif.created_at).toLocaleDateString()}
                                </span>
                                {notif.read && (
                                    <span className="flex items-center gap-1 text-green-500/50">
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