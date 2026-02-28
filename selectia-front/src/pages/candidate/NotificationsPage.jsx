import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Info, Loader2 } from 'lucide-react';
import axios from '../../api/axios';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await axios.get('/notifications');
        setNotifications(res.data);
        // Marcar como leídas al entrar
        await axios.put('/notifications/read');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500 transition-colors">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-primary/10 dark:bg-slate-800 rounded-xl text-brand-primary transition-colors">
            <Bell size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Notificaciones</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">Mantente al día con tus postulaciones.</p>
        </div>
      </div>

      {/* LISTA DE NOTIFICACIONES */}
      <div className="space-y-4">
        {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-primary"/></div>
        ) : notifications.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/5 transition-colors">
                <Bell size={40} className="mx-auto mb-4 text-slate-300 dark:text-slate-600 transition-colors"/>
                <p className="text-slate-500">No tienes notificaciones nuevas.</p>
            </div>
        ) : (
            notifications.map((notif) => (
                <div key={notif._id} className={`p-4 rounded-xl border flex gap-4 transition-colors ${
                    notif.read 
                        ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 opacity-70' 
                        : 'bg-white dark:bg-brand-surface border-brand-primary/30 dark:border-brand-primary/30 shadow-sm dark:shadow-none'
                }`}>
                    <div className="mt-1">
                        {notif.type === 'success' && <CheckCircle className="text-green-600 dark:text-green-400 transition-colors" size={20}/>}
                        {notif.type === 'error' && <XCircle className="text-red-600 dark:text-red-400 transition-colors" size={20}/>}
                        {(notif.type === 'info' || !notif.type) && <Info className="text-blue-600 dark:text-blue-400 transition-colors" size={20}/>}
                    </div>
                    <div>
                        <h3 className={`font-bold text-sm transition-colors ${notif.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                            {notif.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 transition-colors">
                            {notif.message}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-600 mt-2 transition-colors">
                            {new Date(notif.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;