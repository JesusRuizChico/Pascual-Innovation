// src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import axios from '../api/axios'; // <--- OJO: Ajusta la ruta si es necesario
import ThemeToggle from '../components/ThemeToggle'; // <--- IMPORTADO

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Validación de Formulario
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post('/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (res.data.user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (error) {
      console.error(error);
      setServerError(error.response?.data?.msg || 'Error al iniciar sesión. Revisa tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Botón flotante para cambiar tema */}
      <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
      </div>

      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-primary/5 dark:from-brand-primary/10 to-transparent dark:to-brand-dark z-0 transition-colors"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-primary/10 dark:bg-blue-600/20 rounded-full blur-[80px] dark:blur-[100px] transition-colors"></div>

      <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 p-8 rounded-2xl shadow-xl dark:shadow-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300 transition-colors">
        
        <Link to="/" className="absolute top-6 left-6 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={20} />
        </Link>

        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Bienvenido de nuevo</h2>
          <p className="text-slate-600 dark:text-slate-400 transition-colors">Ingresa a tu cuenta SelectIA</p>
        </div>

        {serverError && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm transition-colors">
            <AlertCircle size={16} /> {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 transition-colors">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400 dark:text-slate-500 transition-colors" size={18} />
              <input 
                type="email" 
                name="email"
                placeholder="ejemplo@correo.com"
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.email ? 'border-red-500' : 'border-slate-300 dark:border-white/10 focus:border-brand-primary dark:focus:border-brand-primary'}`}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1 ml-1 transition-colors">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 transition-colors">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400 dark:text-slate-500 transition-colors" size={18} />
              <input 
                type="password" 
                name="password"
                placeholder="••••••••"
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.password ? 'border-red-500' : 'border-slate-300 dark:border-white/10 focus:border-brand-primary dark:focus:border-brand-primary'}`}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1 ml-1 transition-colors">{errors.password}</p>}
            
            <div className="text-right mt-2">
                <a href="#" className="text-xs text-brand-primary hover:text-brand-accent dark:hover:text-white transition-colors">¿Olvidaste tu contraseña?</a>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-violet-600 text-white font-bold py-3 rounded-xl transition-all shadow-md dark:shadow-lg shadow-brand-primary/30 dark:shadow-brand-primary/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={18} /> Iniciar Sesión</>}
          </button>

        </form>

        <p className="text-center text-slate-600 dark:text-slate-500 text-sm mt-8 transition-colors">
          ¿Aún no tienes cuenta? <Link to="/register" className="text-brand-primary font-bold hover:underline">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;