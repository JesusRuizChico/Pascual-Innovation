// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, User, Building2, ArrowLeft, Briefcase, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import axios from '../api/axios';
import ThemeToggle from '../components/ThemeToggle'; // <--- IMPORTADO

const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('candidate');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    companyName: '',
    rfc: ''
  });

  const validate = () => {
      const newErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
      if (!formData.lastname.trim()) newErrors.lastname = "El apellido es obligatorio.";
      
      if (!formData.email) {
          newErrors.email = "El correo es obligatorio.";
      } else if (!emailRegex.test(formData.email)) {
          newErrors.email = "Ingresa un correo válido.";
      }

      if (!formData.password) {
          newErrors.password = "La contraseña es obligatoria.";
      } else if (formData.password.length < 6) {
          newErrors.password = "Mínimo 6 caracteres.";
      }

      if (role === 'recruiter') {
          if (!formData.companyName.trim()) newErrors.companyName = "El nombre de la empresa es requerido.";
          if (!formData.rfc.trim()) newErrors.rfc = "El RFC es requerido.";
          else if (formData.rfc.length < 12 || formData.rfc.length > 13) newErrors.rfc = "RFC inválido (12-13 caracteres).";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const dataToSend = {
        name: `${formData.name} ${formData.lastname}`,
        email: formData.email,
        password: formData.password,
        role: role,
        companyName: role === 'recruiter' ? formData.companyName : undefined,
        rfc: role === 'recruiter' ? formData.rfc : undefined
      };

      const res = await axios.post('/auth/register', dataToSend);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (role === 'candidate') {
        navigate('/candidate/dashboard');
      } else {
        navigate('/recruiter/dashboard');
      }

    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.msg || 'Error al registrarse. Intenta de nuevo.');
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

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none transition-colors">
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] transition-colors"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] transition-colors"></div>
      </div>

      <div className="w-full max-w-md bg-white/90 dark:bg-brand-surface/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl relative z-10 transition-colors duration-300">
        
        <Link to="/" className="absolute top-6 left-6 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <div className="text-center mb-8 pt-2">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Crear Cuenta</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm transition-colors">Únete a la red de talento más inteligente</p>
        </div>

        {serverError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg text-center transition-colors">
                {serverError}
            </div>
        )}

        <div className="bg-slate-100 dark:bg-brand-dark/50 p-1 rounded-xl flex mb-6 border border-slate-200 dark:border-white/5 transition-colors">
            <button 
                type="button"
                onClick={() => setRole('candidate')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'candidate' ? 'bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm dark:shadow-lg' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <User className="w-4 h-4" /> Candidato
            </button>
            <button 
                type="button"
                onClick={() => setRole('recruiter')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'recruiter' ? 'bg-brand-primary text-white shadow-md dark:shadow-lg shadow-brand-primary/20' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <Briefcase className="w-4 h-4" /> Reclutador
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-1 flex-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-300 ml-1 uppercase tracking-wider transition-colors">Nombre(s)</label>
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 w-5 h-5 transition-colors" />
                    <input 
                        type="text" name="name" 
                        value={formData.name} onChange={handleChange}
                        placeholder="Juan" 
                        className={`w-full bg-slate-50 dark:bg-brand-dark/50 border rounded-xl px-10 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-white/10'}`}
                    />
                </div>
                {errors.name && <p className="text-red-500 dark:text-red-400 text-xs ml-1 transition-colors">{errors.name}</p>}
            </div>
            <div className="space-y-1 flex-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-300 ml-1 uppercase tracking-wider transition-colors">Apellidos</label>
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 w-5 h-5 transition-colors" />
                    <input 
                        type="text" name="lastname" 
                        value={formData.lastname} onChange={handleChange}
                        placeholder="Pérez" 
                        className={`w-full bg-slate-50 dark:bg-brand-dark/50 border rounded-xl px-10 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.lastname ? 'border-red-500' : 'border-slate-300 dark:border-white/10'}`}
                    />
                </div>
                {errors.lastname && <p className="text-red-500 dark:text-red-400 text-xs ml-1 transition-colors">{errors.lastname}</p>}
            </div>
          </div>

          {role === 'recruiter' && (
            <>
                <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-300 ml-1 uppercase tracking-wider text-brand-secondary transition-colors">Empresa</label>
                    <div className="relative group">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 w-5 h-5 transition-colors" />
                        <input 
                            type="text" name="companyName" 
                            value={formData.companyName} onChange={handleChange}
                            placeholder="Innovation Pascual S.A." 
                            className={`w-full bg-slate-50 dark:bg-brand-dark/50 border rounded-xl px-10 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-secondary dark:focus:border-brand-secondary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.companyName ? 'border-red-500' : 'border-slate-300 dark:border-brand-secondary/30'}`}
                        />
                    </div>
                    {errors.companyName && <p className="text-red-500 dark:text-red-400 text-xs ml-1 transition-colors">{errors.companyName}</p>}
                </div>
                <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-300 ml-1 uppercase tracking-wider text-brand-secondary transition-colors">RFC</label>
                    <div className="relative group">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 w-5 h-5 transition-colors" />
                        <input 
                            type="text" name="rfc" maxLength={13}
                            value={formData.rfc} onChange={handleChange}
                            placeholder="IPX990101AAA" 
                            className={`w-full bg-slate-50 dark:bg-brand-dark/50 border rounded-xl px-10 py-3 text-slate-900 dark:text-white uppercase focus:outline-none focus:border-brand-secondary dark:focus:border-brand-secondary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.rfc ? 'border-red-500' : 'border-slate-300 dark:border-brand-secondary/30'}`}
                        />
                    </div>
                    {errors.rfc && <p className="text-red-500 dark:text-red-400 text-xs ml-1 transition-colors">{errors.rfc}</p>}
                </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-300 ml-1 uppercase tracking-wider transition-colors">Correo</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 w-5 h-5 transition-colors" />
              <input 
                type="email" name="email" 
                value={formData.email} onChange={handleChange}
                placeholder="ejemplo@correo.com" 
                className={`w-full bg-slate-50 dark:bg-brand-dark/50 border rounded-xl px-10 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.email ? 'border-red-500' : 'border-slate-300 dark:border-white/10'}`}
              />
            </div>
            {errors.email && <p className="text-red-500 dark:text-red-400 text-xs ml-1 transition-colors">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-300 ml-1 uppercase tracking-wider transition-colors">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 w-5 h-5 transition-colors" />
              <input 
                type="password" name="password" 
                value={formData.password} onChange={handleChange}
                placeholder="••••••••" 
                className={`w-full bg-slate-50 dark:bg-brand-dark/50 border rounded-xl px-10 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.password ? 'border-red-500' : 'border-slate-300 dark:border-white/10'}`}
              />
            </div>
            {errors.password && <p className="text-red-500 dark:text-red-400 text-xs ml-1 transition-colors">{errors.password}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-md dark:shadow-lg mt-2 flex items-center justify-center gap-2 ${role === 'recruiter' ? 'bg-gradient-to-r from-blue-500 to-blue-700 dark:from-brand-secondary dark:to-blue-600 text-white shadow-blue-500/20' : 'bg-gradient-to-r from-brand-primary to-violet-600 text-white shadow-brand-primary/20'}`}
          >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" /> Registrando...
                </>
            ) : (
                `Registrarme como ${role === 'candidate' ? 'Candidato' : 'Reclutador'}`
            )}
          </button>

          <p className="text-xs text-slate-500 dark:text-slate-500 text-center px-4 transition-colors">
            Al registrarte, aceptas nuestros <a href="#" className="underline hover:text-slate-900 dark:hover:text-white transition-colors">Términos</a>.
          </p>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 text-center transition-colors">
            <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">
            ¿Ya tienes cuenta? <Link to="/login" className="text-brand-primary font-bold hover:text-brand-accent dark:hover:text-white transition-colors">Inicia Sesión</Link>
            </p>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;