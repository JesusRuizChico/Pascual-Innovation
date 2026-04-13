// src/pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import axios from '../api/axios';
import ThemeToggle from '../components/ThemeToggle'; 

const ResetPasswordPage = () => {
  const { token } = useParams(); 
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Estados independientes para mostrar contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (passwords.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }
    if (passwords.password !== passwords.confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }

    setLoading(true);
    try {
      await axios.post(`/auth/reset-password/${token}`, { 
        password: passwords.password 
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Error al restablecer la contraseña. El enlace puede haber expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark flex items-center justify-center relative overflow-hidden p-4 transition-colors duration-300">
      <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-brand-primary/10 dark:bg-brand-primary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-white/90 dark:bg-brand-surface/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl relative z-10 transition-colors">
        
        {!success && (
          <Link to="/login" className="absolute top-6 left-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        )}

        <div className="text-center mb-8 pt-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Crea una nueva contraseña</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Asegúrate de que sea segura y fácil de recordar.
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4 animate-in fade-in zoom-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">¡Contraseña actualizada!</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Serás redirigido al inicio de sesión en unos segundos...
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 rounded-lg flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-300 ml-1 uppercase">Nueva Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={passwords.password}
                    onChange={(e) => setPasswords({...passwords, password: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-brand-dark/50 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-10 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-300 ml-1 uppercase">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-brand-dark/50 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-10 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-primary hover:bg-violet-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Guardar y Entrar'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;