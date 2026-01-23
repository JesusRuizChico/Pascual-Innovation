// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import axios from '../api/axios'; // Importar configuración de Axios

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/auth/login', formData);
      
      // 1. Guardar Token en LocalStorage
      localStorage.setItem('token', res.data.token);
      
      // 2. Guardar datos básicos del usuario
      localStorage.setItem('user', JSON.stringify(res.data.user));

      console.log('Login exitoso:', res.data.user);

      // 3. Redirigir según el rol que viene de la Base de Datos
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'recruiter') navigate('/recruiter/dashboard');
      else navigate('/candidate/dashboard');

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center relative overflow-hidden p-4">
      
      {/* Fondo igual al register */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-brand-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
        
        <Link to="/" className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <div className="text-center mb-8 pt-4">
          <div className="inline-flex items-center justify-center p-3 bg-brand-surface rounded-2xl mb-4 border border-white/5 shadow-lg">
            <Brain className="w-10 h-10 text-brand-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white">¡Hola de nuevo!</h2>
          <p className="text-slate-400 mt-2 text-sm">Ingresa a tu cuenta para continuar</p>
        </div>

        {/* Mensaje de Error */}
        {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center animate-in fade-in">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider">Correo Electrónico</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors w-5 h-5" />
              <input 
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                placeholder="tu@correo.com" 
                className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Contraseña</label>
                <Link to="/forgot-password" className="text-xs text-brand-primary hover:text-white transition-colors">¿Olvidaste tu contraseña?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors w-5 h-5" />
              <input 
                type="password" name="password" required
                value={formData.password} onChange={handleChange}
                placeholder="••••••••" 
                className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-primary to-violet-600 hover:from-violet-600 hover:to-brand-primary text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-brand-primary/25 flex items-center justify-center gap-2"
          >
            {loading ? (
                <> <Loader2 className="animate-spin"/> Entrando... </>
            ) : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-slate-400 text-sm">
            ¿No tienes cuenta? <Link to="/register" className="text-brand-primary font-bold hover:text-white transition-colors">Regístrate gratis</Link>
            </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;