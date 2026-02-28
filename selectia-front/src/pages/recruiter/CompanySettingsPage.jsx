// src/pages/recruiter/CompanySettingsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Globe, MapPin, FileText, UploadCloud, 
  Save, Loader2, Image as ImageIcon, CheckCircle2, Layout
} from 'lucide-react';
import axios from '../../api/axios';

const CompanySettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  const [companyData, setCompanyData] = useState({
      company_name: '',
      website: '',
      location: '',
      industry: '',
      description: '',
      logo_url: ''
  });

  const logoInputRef = useRef(null);

  // 1. Cargar datos existentes
  useEffect(() => {
    const fetchCompany = async () => {
        try {
            const res = await axios.get('/recruiters/me');
            if (res.data) {
                setCompanyData({
                    company_name: res.data.company_name || '',
                    website: res.data.website || '',
                    location: res.data.location || '',
                    industry: res.data.industry || '',
                    description: res.data.description || '',
                    logo_url: res.data.logo_url || ''
                });
            }
        } catch (error) {
            console.log("Aún no hay perfil de empresa");
        } finally {
            setLoading(false);
        }
    };
    fetchCompany();
  }, []);

  // 2. Manejar cambios en el formulario
  const handleChange = (e) => {
      setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  // 3. Subir Logo
  const handleLogoUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
          alert('Solo se permiten imágenes (JPG, PNG)');
          return;
      }

      const formData = new FormData();
      formData.append('logo', file);

      setUploadingLogo(true);
      try {
          const res = await axios.post('/recruiters/upload-logo', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          setCompanyData(prev => ({ ...prev, logo_url: res.data.logo_url }));
          // Disparar evento para actualizar Layout si fuera necesario
          window.dispatchEvent(new Event('companyUpdated'));
          alert("Logo actualizado correctamente");
      } catch (error) {
          console.error(error);
          alert("Error al subir el logo");
      } finally {
          setUploadingLogo(false);
      }
  };

  // 4. Guardar Perfil Completo
  const handleSave = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
          const res = await axios.post('/recruiters', companyData);
          setCompanyData(res.data); 
          alert("Perfil de empresa guardado exitosamente");
      } catch (error) {
          console.error(error);
          alert("Error al guardar los datos");
      } finally {
          setSaving(false);
      }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-10 transition-colors">
      
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
                <Building2 className="text-blue-600 dark:text-blue-500"/> Perfil de Empresa
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 transition-colors">
                Esta información aparecerá en todas tus vacantes publicadas.
            </p>
        </div>
        <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 shadow-md dark:shadow-lg dark:shadow-blue-900/20 transition-all disabled:opacity-50"
        >
            {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
            Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLUMNA IZQUIERDA: LOGO --- */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-6 text-center transition-colors duration-300">
                <h3 className="text-slate-900 dark:text-white font-bold mb-4 transition-colors">Logo de la Empresa</h3>
                
                {/* Caja de subida de imagen */}
                <div 
                    className="w-48 h-48 mx-auto bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                    onClick={() => logoInputRef.current.click()}
                >
                    {companyData.logo_url ? (
                        <img src={companyData.logo_url} alt="Logo Empresa" className="w-full h-full object-contain p-2" />
                    ) : (
                        <div className="text-slate-400 dark:text-slate-500 flex flex-col items-center transition-colors">
                            <ImageIcon size={40} className="mb-2"/>
                            <span className="text-xs">Clic para subir</span>
                        </div>
                    )}

                    {/* Overlay al pasar mouse o cargando */}
                    <div className={`absolute inset-0 bg-slate-900/40 dark:bg-black/60 flex items-center justify-center transition-opacity ${uploadingLogo ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {uploadingLogo ? <Loader2 className="animate-spin text-white"/> : <UploadCloud className="text-white"/>}
                    </div>
                </div>
                
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={logoInputRef} 
                    onChange={handleLogoUpload}
                />

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 transition-colors">
                    Recomendado: PNG o JPG de 500x500px. <br/> Fondo transparente es mejor.
                </p>
            </div>

            {/* Tarjeta de "Vista Previa" (Cómo lo ven los candidatos) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-6 transition-colors duration-300">
                <h3 className="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2 transition-colors">
                    <Layout size={16} className="text-slate-400"/> Vista Previa
                </h3>
                <div className="bg-slate-50 dark:bg-brand-surface border border-slate-200 dark:border-white/5 rounded-xl p-4 transition-colors">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200 dark:border-transparent transition-colors">
                            {companyData.logo_url ? (
                                <img src={companyData.logo_url} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-slate-900 font-bold">{companyData.company_name?.charAt(0) || 'E'}</span>
                            )}
                        </div>
                        <div>
                            <h4 className="text-slate-900 dark:text-white font-bold text-sm transition-colors">{companyData.company_name || 'Nombre Empresa'}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Hace 2 horas • {companyData.location || 'Ubicación'}</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-transparent px-2 py-1 rounded transition-colors">Ejemplo Vacante</span>
                    </div>
                </div>
            </div>
        </div>

        {/* --- COLUMNA DERECHA: FORMULARIO --- */}
        <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-8 transition-colors duration-300">
                <form onSubmit={handleSave} className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Nombre de la Empresa</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 text-slate-400 dark:text-slate-500 transition-colors" size={18}/>
                                <input 
                                    type="text" name="company_name" required
                                    value={companyData.company_name} onChange={handleChange}
                                    placeholder="Ej. Tech Solutions S.A." 
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Sitio Web</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 text-slate-400 dark:text-slate-500 transition-colors" size={18}/>
                                <input 
                                    type="text" name="website"
                                    value={companyData.website} onChange={handleChange}
                                    placeholder="Ej. www.miempresa.com" 
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Ubicación Principal</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-400 dark:text-slate-500 transition-colors" size={18}/>
                                <input 
                                    type="text" name="location"
                                    value={companyData.location} onChange={handleChange}
                                    placeholder="Ej. CDMX, Reforma 222" 
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Industria / Sector</label>
                            <select 
                                name="industry"
                                value={companyData.industry} onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl py-2.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 appearance-none transition-colors"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Tecnología">Tecnología e Informática</option>
                                <option value="Salud">Salud y Medicina</option>
                                <option value="Finanzas">Finanzas y Banca</option>
                                <option value="Manufactura">Manufactura e Ingeniería</option>
                                <option value="Ventas">Ventas y Marketing</option>
                                <option value="Educación">Educación</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Descripción de la Empresa</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-slate-400 dark:text-slate-500 transition-colors" size={18}/>
                            <textarea 
                                name="description"
                                value={companyData.description} onChange={handleChange}
                                rows="5"
                                placeholder="Cuéntanos sobre tu cultura, misión y qué hacen..."
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            ></textarea>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-right transition-colors">Se recomienda entre 100 y 300 caracteres.</p>
                    </div>

                </form>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CompanySettingsPage;