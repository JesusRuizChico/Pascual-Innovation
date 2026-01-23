// src/pages/ForgotPassPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassPage = () => {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center relative overflow-hidden p-4">
      
      {/* --- Fondo Decorativo --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px]"></div>
      </div>

      {/* --- Tarjeta --- */}
      <div className="w-full max-w-md bg-brand-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
        
        <Link to="/login" className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <div className="text-center mb-8 pt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-dark border border-white/10 rounded-2xl mb-4 shadow-lg">
            <LockResetIcon />
          </div>
          <h2 className="text-2xl font-bold text-white">¿Olvidaste tu contraseña?</h2>
          <p className="text-slate-400 mt-2 text-sm px-4">
            No te preocupes. Ingresa tu correo y te enviaremos instrucciones para recuperarla.
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider">Correo Registrado</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors w-5 h-5" />
              <input 
                type="email" 
                placeholder="ejemplo@selectia.com" 
                className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>
          </div>

          <button className="w-full bg-white text-brand-dark hover:bg-slate-200 font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            Enviar Instrucciones
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link to="/login" className="text-brand-secondary font-bold hover:text-white transition-colors text-sm">
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