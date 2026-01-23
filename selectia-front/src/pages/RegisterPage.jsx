// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, User, Building2, ArrowLeft, Briefcase, FileText, Loader2, CheckCircle2 } from 'lucide-react';
// CORRECCIÓN AQUÍ: Solo un "../"
import axios from '../api/axios';

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
      // CORRECCIÓN AQUÍ: Eliminada la duplicidad de 'name'
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
    <div className="min-h-screen bg-brand-dark flex items-center justify-center relative overflow-hidden p-4">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-brand-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
        
        <Link to="/" className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <div className="text-center mb-8 pt-2">
          <h2 className="text-3xl font-bold text-white">Crear Cuenta</h2>
          <p className="text-slate-400 mt-2 text-sm">Únete a la red de talento más inteligente</p>
        </div>

        {serverError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
                {serverError}
            </div>
        )}

        <div className="bg-brand-dark/50 p-1 rounded-xl flex mb-6 border border-white/5">
            <button 
                type="button"
                onClick={() => setRole('candidate')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'candidate' ? 'bg-brand-surface border border-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <User className="w-4 h-4" /> Candidato
            </button>
            <button 
                type="button"
                onClick={() => setRole('recruiter')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'recruiter' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Briefcase className="w-4 h-4" /> Reclutador
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-1 flex-1">
                <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider">Nombre(s)</label>
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" name="name" 
                        value={formData.name} onChange={handleChange}
                        placeholder="Juan" 
                        className={`w-full bg-brand-dark/50 border rounded-xl px-10 py-3 text-white focus:outline-none focus:border-brand-primary transition-all ${errors.name ? 'border-red-500' : 'border-white/10'}`}
                    />
                </div>
                {errors.name && <p className="text-red-400 text-xs ml-1">{errors.name}</p>}
            </div>
            <div className="space-y-1 flex-1">
                <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider">Apellidos</label>
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" name="lastname" 
                        value={formData.lastname} onChange={handleChange}
                        placeholder="Pérez" 
                        className={`w-full bg-brand-dark/50 border rounded-xl px-10 py-3 text-white focus:outline-none focus:border-brand-primary transition-all ${errors.lastname ? 'border-red-500' : 'border-white/10'}`}
                    />
                </div>
                {errors.lastname && <p className="text-red-400 text-xs ml-1">{errors.lastname}</p>}
            </div>
          </div>

          {role === 'recruiter' && (
            <>
                <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider text-brand-secondary">Empresa</label>
                    <div className="relative group">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="text" name="companyName" 
                            value={formData.companyName} onChange={handleChange}
                            placeholder="Innovation Pascual S.A." 
                            className={`w-full bg-brand-dark/50 border rounded-xl px-10 py-3 text-white focus:outline-none focus:border-brand-secondary transition-all ${errors.companyName ? 'border-red-500' : 'border-brand-secondary/30'}`}
                        />
                    </div>
                    {errors.companyName && <p className="text-red-400 text-xs ml-1">{errors.companyName}</p>}
                </div>
                <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider text-brand-secondary">RFC</label>
                    <div className="relative group">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="text" name="rfc" maxLength={13}
                            value={formData.rfc} onChange={handleChange}
                            placeholder="IPX990101AAA" 
                            className={`w-full bg-brand-dark/50 border rounded-xl px-10 py-3 text-white uppercase focus:outline-none focus:border-brand-secondary transition-all ${errors.rfc ? 'border-red-500' : 'border-brand-secondary/30'}`}
                        />
                    </div>
                    {errors.rfc && <p className="text-red-400 text-xs ml-1">{errors.rfc}</p>}
                </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider">Correo</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="email" name="email" 
                value={formData.email} onChange={handleChange}
                placeholder="ejemplo@correo.com" 
                className={`w-full bg-brand-dark/50 border rounded-xl px-10 py-3 text-white focus:outline-none focus:border-brand-primary transition-all ${errors.email ? 'border-red-500' : 'border-white/10'}`}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs ml-1">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="password" name="password" 
                value={formData.password} onChange={handleChange}
                placeholder="••••••••" 
                className={`w-full bg-brand-dark/50 border rounded-xl px-10 py-3 text-white focus:outline-none focus:border-brand-primary transition-all ${errors.password ? 'border-red-500' : 'border-white/10'}`}
              />
            </div>
            {errors.password && <p className="text-red-400 text-xs ml-1">{errors.password}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg mt-2 flex items-center justify-center gap-2 ${role === 'recruiter' ? 'bg-gradient-to-r from-brand-secondary to-blue-600 text-white shadow-blue-500/25' : 'bg-gradient-to-r from-brand-primary to-violet-600 text-white shadow-brand-primary/25'}`}
          >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" /> Registrando...
                </>
            ) : (
                `Registrarme como ${role === 'candidate' ? 'Candidato' : 'Reclutador'}`
            )}
          </button>

          <p className="text-xs text-slate-500 text-center px-4">
            Al registrarte, aceptas nuestros <a href="#" className="underline hover:text-white">Términos</a>.
          </p>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-slate-400 text-sm">
            ¿Ya tienes cuenta? <Link to="/login" className="text-brand-primary font-bold hover:text-white transition-colors">Inicia Sesión</Link>
            </p>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;