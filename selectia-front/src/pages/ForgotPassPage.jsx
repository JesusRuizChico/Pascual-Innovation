// src/pages/ForgotPassPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from '../api/axios'; // <--- Ajusta la ruta si es necesario
import ThemeToggle from '../components/ThemeToggle'; // <--- IMPORTADO

const ForgotPassPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }

    setLoading(true);
    try {
      // OJO: Asegúrate de que este endpoint exista en tu backend de SelectIA
      const res = await axios.post('/auth/forgot-password', { email });
      
      setMessage(res.data.msg || 'Instrucciones enviadas. Revisa tu bandeja de entrada.');
      setEmail(''); // Limpiamos el input en caso de éxito
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Error al procesar la solicitud. Verifica el correo e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark flex items-center justify-center relative overflow-hidden p-4 transition-colors duration-300">
      
      {/* Botón flotante para cambiar tema */}
      <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
      </div>

      {/* --- Fondo Decorativo --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none transition-colors">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-brand-primary/10 dark:bg-brand-primary/10 rounded-full blur-[120px] transition-colors"></div>
      </div>

      {/* --- Tarjeta --- */}
      <div className="w-full max-w-md bg-white/90 dark:bg-brand-surface/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl relative z-10 transition-colors duration-300">
        
        <Link to="/login" className="absolute top-6 left-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <div className="text-center mb-8 pt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-brand-dark border border-slate-200 dark:border-white/10 rounded-2xl mb-4 shadow-sm dark:shadow-lg transition-colors">
            <LockResetIcon />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">¿Olvidaste tu contraseña?</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm px-4 transition-colors">
            No te preocupes. Ingresa tu correo y te enviaremos instrucciones para recuperarla.
          </p>
        </div>

        {/* Alerta de Éxito */}
        {message && (
          <div className="mb-6 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/50 rounded-lg flex items-start gap-2 text-green-700 dark:text-green-400 text-sm transition-colors animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>{message}</p>
          </div>
        )}

        {/* Alerta de Error */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 rounded-lg flex items-start gap-2 text-red-600 dark:text-red-400 text-sm transition-colors animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-300 ml-1 uppercase tracking-wider transition-colors">Correo Registrado</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@selectia.com" 
                className="w-full bg-slate-50 dark:bg-brand-dark/50 border border-slate-300 dark:border-white/10 rounded-xl px-10 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-violet-600 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-md dark:shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
            ) : (
                <>
                    <Send className="w-4 h-4" /> Enviar Instrucciones
                </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 text-center transition-colors">
            <Link to="/login" className="text-brand-primary dark:text-brand-secondary font-bold hover:text-brand-accent dark:hover:text-white transition-colors text-sm">
                Volver al inicio de sesión
            </Link>
        </div>

      </div>
    </div>
  );
}

// Icono personalizado para esta vista
const LockResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><path d="M12 15v4"/><path d="M16 16.5l1.5-1.5"/><path d="M16 18.5l1.5 1.5"/>
    </svg>
)

export default ForgotPassPage;