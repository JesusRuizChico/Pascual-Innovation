// src/pages/candidate/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Lock, Bell, Shield, Save, Loader2, Eye, EyeOff, AlertTriangle, Trash2, Camera 
} from 'lucide-react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('security');
  const [profile, setProfile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  const userLocal = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
      try {
          const res = await axios.get('/candidates/me');
          setProfile(res.data);
      } catch (error) { console.log("Perfil no cargado"); }
  };

  const handlePhotoUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
          alert('Solo se permiten archivos de imagen (JPG, PNG)');
          return;
      }

      const formData = new FormData();
      formData.append('photo', file);

      setUploadingPhoto(true);
      try {
          const res = await axios.post('/candidates/upload-photo', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          setProfile(prev => ({ ...prev, photo_url: res.data.photo_url }));
          
          // --- MAGIA: AVISAR AL HEADER QUE ACTUALICE LA FOTO ---
          window.dispatchEvent(new Event('profileUpdated')); 
          // -----------------------------------------------------

          alert('Foto de perfil actualizada correctamente');
      } catch (error) {
          console.error(error);
          alert('Error al subir la imagen');
      } finally {
          setUploadingPhoto(false);
      }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-10">
      
      {/* Header con Foto */}
      <div className="bg-brand-surface border border-white/5 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
              <div className="w-28 h-28 rounded-full border-4 border-brand-dark overflow-hidden bg-slate-800 flex items-center justify-center shadow-2xl">
                  {profile?.photo_url ? <img src={profile.photo_url} className="w-full h-full object-cover" alt="Perfil"/> : <span className="text-4xl font-bold text-slate-500">{userLocal.name?.charAt(0)}</span>}
              </div>
              <button onClick={() => fileInputRef.current.click()} disabled={uploadingPhoto} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  {uploadingPhoto ? <Loader2 className="animate-spin text-white"/> : <Camera className="text-white"/>}
              </button>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload}/>
          </div>
          <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{userLocal.name}</h1>
              <p className="text-slate-400">{profile?.title || 'Candidato'}</p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
            {['security', 'notifications', 'privacy'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all capitalize ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
                    {tab === 'security' && <Lock size={18}/>}
                    {tab === 'notifications' && <Bell size={18}/>}
                    {tab === 'privacy' && <Shield size={18}/>}
                    <span className="font-medium text-sm">{tab === 'security' ? 'Seguridad' : tab === 'notifications' ? 'Notificaciones' : 'Privacidad'}</span>
                </button>
            ))}
        </div>

        <div className="md:col-span-3">
            {activeTab === 'security' && <SecuritySettings user={userLocal} />}
            {activeTab === 'notifications' && <NotificationSettings profile={profile} refresh={fetchProfile} />}
            {activeTab === 'privacy' && <PrivacySettings />}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTES INTERNOS ---

const NotificationSettings = ({ profile, refresh }) => {
    const [toggles, setToggles] = useState({ 
        emailNotify: profile?.preferences?.emailNotify ?? true, 
        browserNotify: profile?.preferences?.browserNotify ?? true 
    });
    const [saving, setSaving] = useState(false);

    // Guardar cambios automáticamente al hacer toggle
    const handleToggle = async (key) => {
        const newValue = !toggles[key];
        const newToggles = { ...toggles, [key]: newValue };
        setToggles(newToggles);
        
        // Simular guardado en perfil (Como usamos un solo modelo Candidate, actualizamos todo el objeto preferences)
        // Nota: Idealmente crearíamos un endpoint específico, pero usaremos el de update profile general para simplicidad
        setSaving(true);
        try {
            // Actualizamos solo las preferencias manteniendo el resto del perfil
            await axios.post('/candidates', { 
                ...profile, 
                preferences: newToggles 
            });
            refresh(); // Recargar perfil para sincronizar
        } catch (error) {
            console.error(error);
            setToggles(toggles); // Revertir si falla
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-brand-surface border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Preferencias de Notificación</h3>
                {saving && <span className="text-xs text-brand-primary flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> Guardando...</span>}
            </div>
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><p className="text-white font-medium">Alertas por Correo</p><p className="text-sm text-slate-400">Recibe actualizaciones de entrevistas.</p></div>
                    <div onClick={() => handleToggle('emailNotify')} className={`w-12 h-6 rounded-full cursor-pointer transition-colors p-1 flex items-center ${toggles.emailNotify ? 'bg-green-500 justify-end' : 'bg-slate-700 justify-start'}`}><div className="w-4 h-4 bg-white rounded-full shadow-md"></div></div>
                </div>
                <hr className="border-white/5" />
                <div className="flex items-center justify-between">
                    <div><p className="text-white font-medium">Notificaciones en Navegador</p><p className="text-sm text-slate-400">Punto rojo y alertas en pantalla.</p></div>
                    <div onClick={() => handleToggle('browserNotify')} className={`w-12 h-6 rounded-full cursor-pointer transition-colors p-1 flex items-center ${toggles.browserNotify ? 'bg-green-500 justify-end' : 'bg-slate-700 justify-start'}`}><div className="w-4 h-4 bg-white rounded-full shadow-md"></div></div>
                </div>
            </div>
        </div>
    );
};

const PrivacySettings = () => {
    const navigate = useNavigate();
    
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("¿ESTÁS SEGURO? Esta acción borrará tu cuenta, tu CV y todas tus postulaciones permanentemente.");
        if (!confirmDelete) return;

        try {
            await axios.delete('/auth/me');
            alert("Tu cuenta ha sido eliminada. Lamentamos verte partir.");
            localStorage.clear();
            navigate('/');
        } catch (error) {
            alert("Error al eliminar cuenta");
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-brand-surface border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Visibilidad</h3>
                <p className="text-sm text-slate-400">Tu perfil es visible para las empresas donde te postulas.</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2"><AlertTriangle size={20}/> Zona de Peligro</h3>
                <p className="text-sm text-slate-400 mb-6">Si eliminas tu cuenta, perderás todo permanentemente.</p>
                <button onClick={handleDeleteAccount} className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                    <Trash2 size={16}/> Eliminar mi cuenta permanentemente
                </button>
            </div>
        </div>
    );
};

const SecuritySettings = ({ user }) => {
    const [pass, setPass] = useState({ current: '', new: '', confirm: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(pass.new !== pass.confirm) return alert("Las contraseñas no coinciden");
        setLoading(true);
        try {
            await axios.post('/auth/change-password', { currentPassword: pass.current, newPassword: pass.new });
            alert("Contraseña actualizada");
            setPass({ current: '', new: '', confirm: '' });
        } catch (error) { alert(error.response?.data?.msg || "Error"); } finally { setLoading(false); }
    };

    return (
        <div className="bg-brand-surface border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Cambiar Contraseña</h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <input required type="password" placeholder="Contraseña Actual" value={pass.current} onChange={e=>setPass({...pass, current:e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white outline-none"/>
                <input required type="password" placeholder="Nueva Contraseña" value={pass.new} onChange={e=>setPass({...pass, new:e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white outline-none"/>
                <input required type="password" placeholder="Confirmar Nueva" value={pass.confirm} onChange={e=>setPass({...pass, confirm:e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white outline-none"/>
                <button disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Actualizar
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;