// src/pages/recruiter/PostJobPage.jsx
import React, { useState } from 'react';
import { 
  Briefcase, DollarSign, MapPin, Plus, X, Sparkles, Layout, Save, Loader2 
} from 'lucide-react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const PostJobPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    modality: 'Remoto',
    salary_min: '',
    salary_max: '',
    skills_required: []
  });

  const [skillInput, setSkillInput] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills_required.includes(skillInput.trim())) {
        setFormData({
          ...formData,
          skills_required: [...formData.skills_required, skillInput.trim()]
        });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills_required: formData.skills_required.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/vacancies', formData);
      alert('¡Vacante publicada con éxito!');
      navigate('/recruiter/vacancies'); 
    } catch (error) {
      console.error(error);
      alert('Error al publicar la vacante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-10 transition-colors">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
            <Briefcase className="text-blue-600 dark:text-blue-500"/> Publicar Nueva Vacante
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 transition-colors">
            Crea una oportunidad atractiva para encontrar al mejor talento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- FORMULARIO --- */}
        <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-6 space-y-6 transition-colors duration-300">
                
                {/* Título */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Título de la Vacante</label>
                    <input required type="text" name="title" value={formData.title} onChange={handleChange}
                        placeholder="Ej. Desarrollador React Senior" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-colors" />
                </div>

                {/* Modalidad y Salario */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Modalidad</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-slate-400 dark:text-slate-500 transition-colors" size={18}/>
                            <select name="modality" value={formData.modality} onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 outline-none appearance-none transition-colors">
                                <option>Remoto</option>
                                <option>Presencial</option>
                                <option>Híbrido</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Salario Mín</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-400 dark:text-slate-500 transition-colors">$</span>
                                <input type="number" name="salary_min" value={formData.salary_min} onChange={handleChange}
                                    placeholder="10000" 
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-6 pr-2 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Salario Máx</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-400 dark:text-slate-500 transition-colors">$</span>
                                <input type="number" name="salary_max" value={formData.salary_max} onChange={handleChange}
                                    placeholder="20000" 
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-6 pr-2 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills (Tags) */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex justify-between transition-colors">
                        <span>Habilidades Requeridas (Para la IA)</span>
                        <span className="text-blue-600 dark:text-blue-400 text-[10px]">Presiona Enter para agregar</span>
                    </label>
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl p-2 flex flex-wrap gap-2 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-colors">
                        {formData.skills_required.map((skill, index) => (
                            <span key={index} className="bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg text-sm flex items-center gap-1 border border-blue-200 dark:border-blue-600/30 transition-colors">
                                {skill}
                                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-blue-900 dark:hover:text-white transition-colors"><X size={14}/></button>
                            </span>
                        ))}
                        <input 
                            type="text" 
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillKeyDown}
                            placeholder={formData.skills_required.length === 0 ? "Ej. React, Node, Inglés..." : ""}
                            className="bg-transparent text-slate-900 dark:text-white outline-none flex-grow p-1 min-w-[100px] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Descripción del Puesto</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} rows="6"
                        placeholder="Describe las responsabilidades y requisitos..."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-md dark:shadow-lg dark:shadow-blue-900/20 flex items-center gap-2 transition-all">
                        {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                        Publicar Vacante
                    </button>
                </div>

            </form>
        </div>

        {/* --- VISTA PREVIA LATERAL --- */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none rounded-2xl p-6 sticky top-24 transition-colors duration-300">
                <h3 className="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2 transition-colors">
                    <Layout size={18} className="text-slate-400 dark:text-slate-400"/> Vista Previa
                </h3>
                
                {/* Tarjeta de Ejemplo */}
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight transition-colors">
                            {formData.title || 'Título de Vacante'}
                        </h4>
                        <div className="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded text-[10px] font-bold border border-green-200 dark:border-green-500/20 transition-colors">
                            95% Match
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 transition-colors">
                        <span className="flex items-center gap-1"><MapPin size={12}/> {formData.modality}</span>
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 transition-colors"><DollarSign size={12}/> {formData.salary_min || '0'} - {formData.salary_max || '0'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                        {formData.skills_required.length > 0 ? formData.skills_required.slice(0, 3).map((s,i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-300 dark:border-white/5 transition-colors">{s}</span>
                        )) : <span className="text-[10px] text-slate-400 dark:text-slate-500 italic transition-colors">Sin skills</span>}
                    </div>
                    <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-lg border border-slate-200 dark:border-white/5 transition-colors">
                        Ver detalles (Ejemplo)
                    </button>
                </div>

                {/* Tip de IA */}
                <div className="mt-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex gap-3 items-start transition-colors">
                    <Sparkles className="text-blue-500 dark:text-blue-400 flex-shrink-0 mt-1 transition-colors" size={18} />
                    <div>
                        <h5 className="text-blue-800 dark:text-blue-200 font-bold text-sm transition-colors">Tip de IA</h5>
                        <p className="text-blue-600 dark:text-blue-300/80 text-xs mt-1 transition-colors">
                            Agregar entre <strong className="text-blue-800 dark:text-blue-200">5 y 8 habilidades</strong> clave mejora la precisión del algoritmo de matching en un 40%.
                        </p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default PostJobPage;