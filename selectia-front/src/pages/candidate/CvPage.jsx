// src/pages/candidate/CvPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
    Download, PlusCircle, Briefcase, GraduationCap, 
    Award, Cpu, Edit2, Loader2, MapPin, Phone, UploadCloud, FileText,
    Save, X, DollarSign, Clock, Trash2, Calendar, Camera, Sparkles, Eye
} from 'lucide-react';
import axios from '../../api/axios';

const CvPage = () => {
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    
    const [profile, setProfile] = useState({
        experience: [],
        education: [],
        skills: []
    });
    
    // --- ESTADOS EDICIÓN PERFIL ---
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);

    // --- ESTADOS PARA MODALES (EXP/EDU/CV) ---
    const [modalType, setModalType] = useState(null);
    const [newItem, setNewItem] = useState({});
    
    // --- NUEVO ESTADO: PREVISUALIZAR CV ---
    const [showCvPreview, setShowCvPreview] = useState(false);

    const fileInputRef = useRef(null);
    const photoInputRef = useRef(null);
    
    const userLocal = JSON.parse(localStorage.getItem('user')) || {};

    // --- LISTA DE SKILLS SUGERIDAS ---
    const suggestedSkills = [
        'Inglés', 'Excel', 'Liderazgo', 'Trabajo en equipo', 
        'React', 'JavaScript', 'Python', 'Ventas', 
        'Atención al Cliente', 'Gestión de Proyectos', 'SQL', 'Java'
    ];

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/candidates/me');
            setProfile(res.data);
        } catch (err) { 
            console.log("Perfil no creado aún"); 
        } finally { 
            setLoading(false); 
        }
    };

    // --- MANEJO DE FOTO DE PERFIL ---
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
            window.dispatchEvent(new Event('profileUpdated'));
            alert('Foto de perfil actualizada');
        } catch (error) {
            console.error(error);
            alert('Error al subir la imagen');
        } finally {
            setUploadingPhoto(false);
        }
    };

    // --- LOGICA DE EDICIÓN DATOS BÁSICOS ---
    const handleEditClick = () => {
        setEditForm({
            title: profile.title || '',
            location: profile.location || '',
            phone: profile.phone || '',
            salary_expectations: profile.salary_expectations || '',
            experience_years: profile.experience_years || 0,
            skills: profile.skills ? profile.skills.join(', ') : ''
        });
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const skillsArray = typeof editForm.skills === 'string' 
                ? editForm.skills.split(',').map(s => s.trim()).filter(s => s !== '') 
                : profile.skills;
            
            const payload = { ...profile, ...editForm, skills: skillsArray };
            const res = await axios.post('/candidates', payload);
            setProfile(res.data);
            setIsEditing(false);
            window.dispatchEvent(new Event('profileUpdated'));
        } catch (error) { 
            alert("Error al actualizar perfil"); 
        } finally { 
            setSaving(false); 
        }
    };

    const handleInputChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

    // --- FUNCIÓN PARA AGREGAR SKILL SUGERIDA (MODO EDICIÓN) ---
    const addSuggestedSkillToEdit = (skill) => {
        const currentSkills = editForm.skills || '';
        if (!currentSkills.toLowerCase().includes(skill.toLowerCase())) {
            const newSkills = currentSkills ? `${currentSkills}, ${skill}` : skill;
            setEditForm({ ...editForm, skills: newSkills });
        }
    };

    // --- LÓGICA AGREGAR/ELIMINAR ITEMS (EXP/EDU) ---
    const openModal = (type) => {
        setModalType(type);
        setNewItem({});
    };

    const handleSaveItem = async () => {
        if ((modalType === 'experience' && !newItem.company) || (modalType === 'education' && !newItem.school)) {
            alert("Por favor completa los campos obligatorios");
            return;
        }
        const updatedProfile = { ...profile };
        if (modalType === 'experience') {
            updatedProfile.experience = [...(profile.experience || []), newItem];
        } else {
            updatedProfile.education = [...(profile.education || []), newItem];
        }
        try {
            const res = await axios.post('/candidates', updatedProfile);
            setProfile(res.data);
            setModalType(null);
        } catch (error) { 
            console.error(error); 
            alert("Error al guardar"); 
        }
    };

    const handleDeleteItem = async (type, index) => {
        if(!confirm("¿Estás seguro de eliminar este registro?")) return;
        const updatedProfile = { ...profile };
        if (type === 'experience') {
            updatedProfile.experience = profile.experience.filter((_, i) => i !== index);
        } else {
            updatedProfile.education = profile.education.filter((_, i) => i !== index);
        }
        try {
            const res = await axios.post('/candidates', updatedProfile);
            setProfile(res.data);
        } catch (error) { 
            console.error(error); 
        }
    };

    // --- MANEJO ARCHIVO PDF CON INTEGRACIÓN IA ---
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || file.type !== 'application/pdf') return alert('Solo se permiten archivos PDF');
        
        const formData = new FormData();
        formData.append('cv', file);
        
        setUploading(true);
        
        try {
            const res = await axios.post('/candidates/upload-cv', formData, { 
                headers: { 'Content-Type': 'multipart/form-data' } 
            });
            
            setProfile(res.data);
            window.dispatchEvent(new Event('profileUpdated'));
            alert('¡Éxito! Tu CV ha sido analizado por la IA y tu perfil se ha autocompletado.');
            
        } catch (error) { 
            console.error(error);
            alert('Hubo un error al procesar el CV. Inténtalo de nuevo.'); 
        } finally { 
            setUploading(false); 
        }
    };

    // Render campo editable
    const renderField = (label, name, value, type="text", icon=null) => {
        if (isEditing) return (
            <div className="mb-3">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1 block transition-colors">{label}</label>
                <div className="relative">
                    {icon && <div className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500">{icon}</div>}
                    <input type={type} name={name} value={editForm[name]} onChange={handleInputChange}
                        className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-brand-primary/50 rounded-lg py-2 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary transition-colors ${icon ? 'pl-10' : 'px-3'}`} />
                </div>
            </div>
        );
        return null;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 relative">
        
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Mi Currículum</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 transition-colors">
                {profile?.updated_at ? `Actualizado: ${new Date(profile.updated_at).toLocaleDateString()}` : 'Crea tu perfil'}
            </p>
            </div>
            
            {/* --- BOTONES DE ACCIÓN PARA EL CV --- */}
            {profile?.cv_url && (
                <div className="flex gap-2 w-full sm:w-auto">
                    {/* Botón Vista Previa */}
                    <button 
                        onClick={() => setShowCvPreview(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-600/20 dark:shadow-blue-900/20 transition-all"
                    >
                        <Eye size={16} /> <span className="hidden sm:inline">Vista Previa</span>
                    </button>
                    
                    {/* Botón Descarga */}
                    <a 
                        href={profile.cv_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm border border-slate-200 dark:border-white/10 transition-colors"
                    >
                        <Download size={16} /> <span className="hidden sm:inline">Descargar</span>
                    </a>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- COLUMNA IZQUIERDA (Datos Personales y FOTO) --- */}
            <div className="space-y-6">
            <div className="bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-sm dark:shadow-lg transition-colors">
                <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${profile?.full_name ? 'bg-green-500' : 'bg-red-500'}`}></div>
                
                {/* Botones editar perfil */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="p-2 bg-red-50 dark:bg-red-500/20 text-red-500 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-500/30 transition-colors"><X size={16} /></button>
                            <button onClick={handleSaveProfile} disabled={saving} className="p-2 bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full hover:bg-green-100 dark:hover:bg-green-500/30 transition-colors">
                                {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />}
                            </button>
                        </>
                    ) : (
                        <button onClick={handleEditClick} className="text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white p-2 bg-slate-50 dark:bg-brand-dark border border-slate-200 dark:border-transparent rounded-full transition-colors"><Edit2 size={16} /></button>
                    )}
                </div>

                {/* --- AVATAR CON FOTO --- */}
                <div className="text-center mb-4 relative group">
                    <div className="w-32 h-32 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 mt-2 border-4 border-white dark:border-brand-dark overflow-hidden relative shadow-md dark:shadow-xl transition-colors">
                        {profile?.photo_url ? (
                            <img 
                                src={profile.photo_url} 
                                alt="Perfil" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display='none'; 
                                    e.target.nextSibling.style.display='block'; 
                                }}
                            />
                        ) : null}
                        <span style={{ display: profile?.photo_url ? 'none' : 'block' }} className="text-4xl font-bold text-brand-primary tracking-tighter">
                            {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : userLocal.name?.substring(0, 2).toUpperCase() || 'U'}
                        </span>
                        <div onClick={() => photoInputRef.current.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
                            {uploadingPhoto ? <Loader2 className="animate-spin text-white"/> : <Camera className="text-white" size={24} />}
                        </div>
                    </div>
                    <input type="file" accept="image/*" className="hidden" ref={photoInputRef} onChange={handlePhotoUpload} />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">{profile?.full_name || userLocal.name}</h2>
                </div>

                <div className="space-y-4">
                    {isEditing ? renderField("Título", "title", editForm.title) : <p className="text-sm text-brand-primary dark:text-brand-secondary font-bold text-center mb-6 transition-colors">{profile?.title || 'Sin título'}</p>}
                    <hr className="border-slate-100 dark:border-white/5 my-4 transition-colors"/>
                    {isEditing ? renderField("Ubicación", "location", editForm.location, "text", <MapPin size={14}/>) : profile?.location && <div className="flex gap-3 text-slate-600 dark:text-slate-300 text-sm transition-colors"><MapPin size={16} className="text-slate-400 dark:text-slate-500"/> {profile.location}</div>}
                    {isEditing ? renderField("Teléfono", "phone", editForm.phone, "tel", <Phone size={14}/>) : profile?.phone && <div className="flex gap-3 text-slate-600 dark:text-slate-300 text-sm transition-colors"><Phone size={16} className="text-slate-400 dark:text-slate-500"/> {profile.phone}</div>}
                    {isEditing ? renderField("Exp. (Años)", "experience_years", editForm.experience_years, "number", <Clock size={14}/>) : profile?.experience_years > 0 && <div className="flex gap-3 text-slate-600 dark:text-slate-300 text-sm transition-colors"><Clock size={16} className="text-slate-400 dark:text-slate-500"/> {profile.experience_years} Años exp.</div>}
                    {isEditing ? renderField("Sueldo Mensual", "salary_expectations", editForm.salary_expectations, "number", <DollarSign size={14}/>) : profile?.salary_expectations > 0 && <div className="flex gap-3 text-slate-600 dark:text-slate-300 text-sm transition-colors"><DollarSign size={16} className="text-slate-400 dark:text-slate-500"/> ${profile.salary_expectations?.toLocaleString()}</div>}
                </div>
            </div>

            <div className="bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/5 rounded-2xl p-6 relative shadow-sm dark:shadow-none transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary"></div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2 transition-colors"><Cpu size={18}/> Skills</h3>
                
                {isEditing ? (
                    <div>
                        <label className="text-xs text-slate-500 font-bold uppercase mb-2 block transition-colors">Separa por comas o usa las sugerencias:</label>
                        <textarea name="skills" value={editForm.skills} onChange={handleInputChange} rows="3" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-brand-primary/50 rounded-lg p-3 text-slate-900 dark:text-white text-sm mb-3 transition-colors focus:outline-none focus:border-brand-primary" />
                        
                        {/* --- SUGERENCIAS EN MODO EDICIÓN --- */}
                        <div className="flex flex-wrap gap-2">
                            {suggestedSkills.map((skill) => (
                                <button 
                                    key={skill} 
                                    onClick={() => addSuggestedSkillToEdit(skill)}
                                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-transparent text-xs rounded hover:bg-brand-primary hover:text-white dark:hover:bg-brand-primary transition-colors"
                                >
                                    + {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {profile?.skills?.length > 0 
                            ? profile.skills.map((skill, i) => <span key={i} className="px-3 py-1 bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary border border-brand-primary/20 dark:border-brand-primary/30 rounded-full text-xs font-bold transition-colors">{skill}</span>)
                            : <p className="text-slate-500 text-sm transition-colors">No has agregado habilidades aún.</p>
                        }
                    </div>
                )}
            </div>
            </div>

            {/* --- COLUMNA DERECHA --- */}
            <div className="lg:col-span-2 space-y-6">
            
            {/* --- CARD DE SUBIDA DE CV --- */}
            <div className="bg-blue-50 dark:bg-gradient-to-r dark:from-blue-900/20 dark:to-brand-surface border border-blue-200 dark:border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-600/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors"><FileText size={24} /></div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white transition-colors">Tu CV en PDF</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">{profile?.cv_url ? "Ya tienes un CV cargado." : "Sube tu CV para análisis IA."}</p>
                    </div>
                </div>
                <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <button onClick={() => fileInputRef.current.click()} disabled={uploading || !profile?.full_name} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 disabled:opacity-50 transition-all shadow-sm">
                    {uploading ? <Loader2 className="animate-spin" size={18}/> : <UploadCloud size={18}/>} 
                    {uploading ? 'Analizando con IA...' : 'Subir PDF y Autocompletar'}
                </button>
            </div>

            {!profile?.full_name && !loading && (
                <div className="bg-white dark:bg-brand-surface border border-brand-primary/30 dark:border-brand-primary/50 rounded-2xl p-8 shadow-lg dark:shadow-2xl transition-colors">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">Crea tu Perfil Profesional</h3>
                    <CreateProfileForm onSuccess={setProfile} suggestions={suggestedSkills} />
                </div>
            )}

            {/* Experiencia */}
            <div className="bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-lg relative hover:border-brand-primary/30 transition-colors">
                <div className="absolute top-6 bottom-6 left-0 w-1 bg-slate-300 dark:bg-slate-700 rounded-r-full transition-colors"></div>
                <div className="ml-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3 transition-colors"><Briefcase size={20} className="text-slate-400 dark:text-slate-500"/> Experiencia Profesional</h3>
                        <button onClick={() => openModal('experience')} className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white border border-slate-200 dark:border-transparent px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"><PlusCircle size={14}/> Agregar</button>
                    </div>
                    <div className="space-y-4">
                        {profile?.experience?.length > 0 ? profile.experience.map((exp, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-white/5 group relative transition-colors">
                                <button onClick={() => handleDeleteItem('experience', i)} className="absolute top-3 right-3 text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                <h4 className="font-bold text-slate-900 dark:text-white transition-colors">{exp.position}</h4>
                                <p className="text-brand-primary dark:text-brand-secondary text-sm font-medium transition-colors">{exp.company}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 mb-2 transition-colors">
                                    <Calendar size={12}/> {exp.from || exp.start_date} - {exp.to || exp.end_date || 'Actualidad'}
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">{exp.description}</p>
                            </div>
                        )) : <p className="text-slate-500 text-sm italic transition-colors">No has registrado experiencia laboral.</p>}
                    </div>
                </div>
            </div>

            {/* Educación */}
            <div className="bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-lg relative hover:border-brand-primary/30 transition-colors">
                <div className="absolute top-6 bottom-6 left-0 w-1 bg-slate-300 dark:bg-slate-700 rounded-r-full transition-colors"></div>
                <div className="ml-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3 transition-colors"><GraduationCap size={20} className="text-slate-400 dark:text-slate-500"/> Educación</h3>
                        <button onClick={() => openModal('education')} className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white border border-slate-200 dark:border-transparent px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"><PlusCircle size={14}/> Agregar</button>
                    </div>
                    <div className="space-y-4">
                        {profile?.education?.length > 0 ? profile.education.map((edu, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-white/5 group relative transition-colors">
                                <button onClick={() => handleDeleteItem('education', i)} className="absolute top-3 right-3 text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                <h4 className="font-bold text-slate-900 dark:text-white transition-colors">{edu.degree}</h4>
                                <p className="text-brand-primary dark:text-brand-secondary text-sm font-medium transition-colors">{edu.school}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 transition-colors">
                                    <Calendar size={12}/> {edu.from || edu.start_date} - {edu.to || edu.end_date || 'Finalizado'}
                                </div>
                            </div>
                        )) : <p className="text-slate-500 text-sm italic transition-colors">No has registrado educación.</p>}
                    </div>
                </div>
            </div>

            </div>
        </div>

        {/* --- MODAL AGREGAR EXP/EDU --- */}
        {modalType && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 transition-colors">
                <div className="bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/10 w-full max-w-md rounded-2xl shadow-2xl p-6 transition-colors">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Agregar {modalType === 'experience' ? 'Experiencia' : 'Educación'}</h2>
                    <div className="space-y-3">
                        {modalType === 'experience' ? (
                            <>
                                <input type="text" placeholder="Puesto / Cargo" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg p-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-primary transition-colors"
                                    value={newItem.position || ''} onChange={e => setNewItem({...newItem, position: e.target.value})} />
                                <input type="text" placeholder="Empresa" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg p-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-primary transition-colors"
                                    value={newItem.company || ''} onChange={e => setNewItem({...newItem, company: e.target.value})} />
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="month" className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg p-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" value={newItem.start_date || ''} onChange={e => setNewItem({...newItem, start_date: e.target.value})} />
                                    <input type="month" className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg p-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" value={newItem.end_date || ''} onChange={e => setNewItem({...newItem, end_date: e.target.value})} />
                                </div>
                                <textarea placeholder="Descripción..." rows="3" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg p-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" value={newItem.description || ''} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                            </>
                        ) : (
                            <>
                                <input type="text" placeholder="Carrera / Título" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg p-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" value={newItem.degree || ''} onChange={e => setNewItem({...newItem, degree: e.target.value})} />
                                <input type="text" placeholder="Institución" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg p-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" value={newItem.school || ''} onChange={e => setNewItem({...newItem, school: e.target.value})} />
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="month" className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg p-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" value={newItem.start_date || ''} onChange={e => setNewItem({...newItem, start_date: e.target.value})} />
                                    <input type="month" className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg p-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" value={newItem.end_date || ''} onChange={e => setNewItem({...newItem, end_date: e.target.value})} />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setModalType(null)} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white px-4 py-2 text-sm transition-colors">Cancelar</button>
                        <button onClick={handleSaveItem} className="bg-brand-primary hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">Guardar</button>
                    </div>
                </div>
            </div>
        )}

        {/* --- MODAL VISOR DE PDF --- */}
        {showCvPreview && profile?.cv_url && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/90 backdrop-blur-md animate-in fade-in duration-200 transition-colors">
                <div className="w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col relative overflow-hidden shadow-2xl transition-colors">
                    <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 transition-colors">
                        <h3 className="text-slate-900 dark:text-white font-bold flex items-center gap-2 transition-colors">
                            <FileText size={18} className="text-blue-500 dark:text-blue-400"/> Vista Previa
                        </h3>
                        <div className="flex items-center gap-3">
                            <a href={profile.cv_url} download target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-500 transition">
                                Descargar
                            </a>
                            <button onClick={() => setShowCvPreview(false)} className="bg-slate-200 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-500 dark:hover:text-red-400 text-slate-500 dark:text-slate-400 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-800 relative transition-colors">
                        <object
                            data={profile.cv_url}
                            type="application/pdf"
                            className="w-full h-full"
                        >
                            <div className="flex flex-col items-center justify-center h-full text-slate-600 dark:text-slate-400 transition-colors">
                                <p>Tu navegador no puede mostrar este PDF directamente.</p>
                                <a href={profile.cv_url} download className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">Haz clic aquí para descargarlo</a>
                            </div>
                        </object>
                    </div>
                </div>
            </div>
        )}

        </div>
    );
};

// Componente CreateProfileForm
const CreateProfileForm = ({ onSuccess, suggestions }) => {
    const [formData, setFormData] = useState({ title: '', location: '', skills: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim());
            const res = await axios.post('/candidates', { ...formData, skills: skillsArray });
            onSuccess(res.data);
            window.dispatchEvent(new Event('profileUpdated'));
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }

    const addSuggestion = (skill) => {
        if (!formData.skills.toLowerCase().includes(skill.toLowerCase())) {
            setFormData(prev => ({...prev, skills: prev.skills ? `${prev.skills}, ${skill}` : skill}));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase transition-colors">Título</label>
              <input required type="text" placeholder="Ej. Desarrollador" className="w-full mt-1 bg-slate-50 dark:bg-brand-dark border border-slate-300 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-colors" onChange={e => setFormData({...formData, title: e.target.value})}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase transition-colors">Ubicación</label>
                  <input required type="text" placeholder="Ciudad" className="w-full mt-1 bg-slate-50 dark:bg-brand-dark border border-slate-300 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-colors" onChange={e => setFormData({...formData, location: e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase transition-colors">Skills</label>
                  <input required type="text" placeholder="React, Node..." value={formData.skills} className="w-full mt-1 bg-slate-50 dark:bg-brand-dark border border-slate-300 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-colors" onChange={e => setFormData({...formData, skills: e.target.value})}/>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs text-slate-500 mr-1 flex items-center transition-colors"><Sparkles size={12} className="mr-1"/> Sugerencias:</span>
                {suggestions.slice(0, 6).map((skill) => (
                    <button key={skill} type="button" onClick={() => addSuggestion(skill)} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-transparent text-xs rounded hover:bg-brand-primary hover:text-white dark:hover:bg-brand-primary transition-colors">
                        + {skill}
                    </button>
                ))}
            </div>
            <button disabled={loading} className="mt-4 bg-brand-primary hover:bg-violet-600 text-white font-bold py-3 px-6 rounded-xl w-full transition-colors flex justify-center items-center gap-2 shadow-md shadow-brand-primary/20">{loading ? <Loader2 className="animate-spin"/> : "Guardar Perfil"}</button>
        </form>
    )
}

export default CvPage;