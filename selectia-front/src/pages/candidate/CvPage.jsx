// src/pages/candidate/CvPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, PlusCircle, Briefcase, GraduationCap, 
  Award, Cpu, Edit2, Loader2, MapPin, Phone, UploadCloud, FileText,
  Save, X, DollarSign, Clock, Trash2, Calendar, Camera
} from 'lucide-react';
import axios from '../../api/axios';

const CvPage = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false); // State for photo upload
  
  const [profile, setProfile] = useState({
      experience: [],
      education: [],
      skills: []
  });
  
  // --- PROFILE EDITING STATES ---
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // --- MODAL STATES (EXP/EDU) ---
  const [modalType, setModalType] = useState(null);
  const [newItem, setNewItem] = useState({});

  const fileInputRef = useRef(null);      // For PDF
  const photoInputRef = useRef(null);     // For Photo (NEW)
  
  const userLocal = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/candidates/me');
      setProfile(res.data);
    } catch (err) { console.log("Profile not created yet"); } finally { setLoading(false); }
  };

  // --- NEW: PROFILE PHOTO HANDLING ---
  const handlePhotoUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
          alert('Only image files (JPG, PNG) are allowed');
          return;
      }

      const formData = new FormData();
      formData.append('photo', file);

      setUploadingPhoto(true);
      try {
          const res = await axios.post('/candidates/upload-photo', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          // Update local view
          setProfile(prev => ({ ...prev, photo_url: res.data.photo_url }));
          
          // IMPORTANT! Notify Layout (top bar) to update photo
          window.dispatchEvent(new Event('profileUpdated'));
          
          alert('Profile photo updated');
      } catch (error) {
          console.error(error);
          alert('Error uploading image');
      } finally {
          setUploadingPhoto(false);
      }
  };

  // --- BASIC DATA EDITING LOGIC ---
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
        // Also notify layout in case name changed
        window.dispatchEvent(new Event('profileUpdated'));
    } catch (error) { alert("Error updating profile"); } finally { setSaving(false); }
  };

  const handleInputChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  // --- ADD/DELETE ITEMS LOGIC (EXP/EDU) ---
  const openModal = (type) => {
      setModalType(type);
      setNewItem({});
  };

  const handleSaveItem = async () => {
      if ((modalType === 'experience' && !newItem.company) || (modalType === 'education' && !newItem.school)) {
          alert("Please complete the required fields");
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
      } catch (error) { console.error(error); alert("Error saving"); }
  };

  const handleDeleteItem = async (type, index) => {
      if(!confirm("Are you sure you want to delete this record?")) return;
      const updatedProfile = { ...profile };
      if (type === 'experience') {
          updatedProfile.experience = profile.experience.filter((_, i) => i !== index);
      } else {
          updatedProfile.education = profile.education.filter((_, i) => i !== index);
      }
      try {
          const res = await axios.post('/candidates', updatedProfile);
          setProfile(res.data);
      } catch (error) { console.error(error); }
  };

  // --- PDF FILE HANDLING ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return alert('Only PDF');
    const formData = new FormData();
    formData.append('cv', file);
    setUploading(true);
    try {
        const res = await axios.post('/candidates/upload-cv', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setProfile({ ...profile, cv_url: res.data.cv_url });
        alert('CV uploaded');
    } catch (error) { alert('Error uploading'); } finally { setUploading(false); }
  };

  // Render editable field
  const renderField = (label, name, value, type="text", icon=null) => {
      if (isEditing) return (
          <div className="mb-3">
              <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">{label}</label>
              <div className="relative">
                {icon && <div className="absolute left-3 top-2.5 text-slate-500">{icon}</div>}
                <input type={type} name={name} value={editForm[name]} onChange={handleInputChange}
                    className={`w-full bg-slate-950 border border-brand-primary/50 rounded-lg py-2 text-white focus:outline-none focus:border-brand-primary ${icon ? 'pl-10' : 'px-3'}`} />
              </div>
          </div>
      );
      return null;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 relative">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-bold text-white">Mi Currículum</h1>
           <p className="text-xs text-slate-500 mt-1">
             {profile?.updated_at ? `Actualizado: ${new Date(profile.updated_at).toLocaleDateString()}` : 'Crea tu perfil'}
           </p>
        </div>
        {profile?.cv_url && (
            <a href={profile.cv_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm border border-white/10">
                <Download size={16} /> <span className="hidden sm:inline">PDF</span>
            </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (Personal Data and PHOTO) --- */}
        <div className="space-y-6">
          <div className="bg-brand-surface border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-lg">
             <div className={`absolute top-0 left-0 w-1 h-full ${profile?.full_name ? 'bg-green-500' : 'bg-red-500'}`}></div>
             
             {/* Edit profile buttons */}
             <div className="absolute top-4 right-4 flex gap-2 z-10">
                 {isEditing ? (
                     <>
                        <button onClick={() => setIsEditing(false)} className="p-2 bg-red-500/20 text-red-400 rounded-full"><X size={16} /></button>
                        <button onClick={handleSaveProfile} disabled={saving} className="p-2 bg-green-500/20 text-green-400 rounded-full">
                            {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />}
                        </button>
                     </>
                 ) : (
                    <button onClick={handleEditClick} className="text-slate-400 hover:text-white p-2 bg-brand-dark rounded-full"><Edit2 size={16} /></button>
                 )}
             </div>

             {/* --- AVATAR WITH PHOTO AND EDITING --- */}
             <div className="text-center mb-4 relative group">
                <div className="w-32 h-32 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4 mt-2 border-4 border-brand-dark overflow-hidden relative shadow-xl">
                    
                    {/* IMPROVED PHOTO LOGIC */}
                    {profile?.photo_url ? (
                        <img 
                            src={profile.photo_url} 
                            alt="Perfil" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.error("Error loading image:", profile.photo_url);
                                e.target.style.display = 'none'; // Hide if fails
                                // Show fallback initials
                                e.target.nextSibling.style.display = 'block'; 
                            }}
                        />
                    ) : null}

                    {/* FALLBACK INITIALS (Shown if no photo or if loading fails) */}
                    <span 
                        className="text-4xl font-bold text-brand-primary tracking-tighter absolute"
                        style={{ display: profile?.photo_url ? 'none' : 'block' }} // Hide if photo attempting to load
                    >
                        {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : userLocal.name?.substring(0, 2).toUpperCase() || 'U'}
                    </span>
                    
                    {/* Overlay to upload photo */}
                    <div 
                        onClick={() => photoInputRef.current.click()}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                    >
                        {uploadingPhoto ? <Loader2 className="animate-spin text-white"/> : <Camera className="text-white" size={24} />}
                    </div>
                </div>
                
                {/* Hidden input for photo */}
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={photoInputRef} 
                    onChange={handlePhotoUpload} 
                />

                <h2 className="text-xl font-bold text-white">
                    {profile?.full_name || userLocal.name}
                </h2>
             </div>

             <div className="space-y-4">
                 {isEditing ? renderField("Título", "title", editForm.title) : <p className="text-sm text-brand-secondary font-bold text-center mb-6">{profile?.title || 'Sin título'}</p>}
                 <hr className="border-white/5 my-4"/>
                 {isEditing ? renderField("Ubicación", "location", editForm.location, "text", <MapPin size={14}/>) : profile?.location && <div className="flex gap-3 text-slate-300 text-sm"><MapPin size={16} className="text-slate-500"/> {profile.location}</div>}
                 {isEditing ? renderField("Teléfono", "phone", editForm.phone, "tel", <Phone size={14}/>) : profile?.phone && <div className="flex gap-3 text-slate-300 text-sm"><Phone size={16} className="text-slate-500"/> {profile.phone}</div>}
                 {isEditing ? renderField("Exp. (Años)", "experience_years", editForm.experience_years, "number", <Clock size={14}/>) : profile?.experience_years > 0 && <div className="flex gap-3 text-slate-300 text-sm"><Clock size={16} className="text-slate-500"/> {profile.experience_years} Años exp.</div>}
                 {isEditing ? renderField("Sueldo Mensual", "salary_expectations", editForm.salary_expectations, "number", <DollarSign size={14}/>) : profile?.salary_expectations > 0 && <div className="flex gap-3 text-slate-300 text-sm"><DollarSign size={16} className="text-slate-500"/> ${profile.salary_expectations?.toLocaleString()}</div>}
             </div>
          </div>

          <div className="bg-brand-surface border border-white/5 rounded-2xl p-6 relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary"></div>
             <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2"><Cpu size={18}/> Skills</h3>
             {isEditing ? (
                 <div>
                     <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Separa por comas</label>
                     <textarea name="skills" value={editForm.skills} onChange={handleInputChange} rows="3" className="w-full bg-slate-950 border border-brand-primary/50 rounded-lg p-3 text-white text-sm" />
                 </div>
             ) : (
                 <div className="flex flex-wrap gap-2">
                    {profile?.skills?.map((skill, i) => <span key={i} className="px-3 py-1 bg-brand-primary/20 text-brand-primary border border-brand-primary/30 rounded-full text-xs font-bold">{skill}</span>)}
                 </div>
             )}
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-gradient-to-r from-blue-900/20 to-brand-surface border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400"><FileText size={24} /></div>
                <div><h3 className="font-bold text-white">Tu CV en PDF</h3><p className="text-sm text-slate-400">{profile?.cv_url ? "Ya tienes un CV cargado." : "Sube tu CV para reclutadores."}</p></div>
             </div>
             <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
             <button onClick={() => fileInputRef.current.click()} disabled={uploading || !profile?.full_name} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 disabled:opacity-50">
                {uploading ? <Loader2 className="animate-spin" size={18}/> : <UploadCloud size={18}/>} {uploading ? 'Subiendo...' : 'Subir PDF'}
             </button>
          </div>

          {!profile?.full_name && !loading && (
             <div className="bg-brand-surface border border-brand-primary/50 rounded-2xl p-8 shadow-2xl"><h3 className="text-xl font-bold text-white mb-6">Crea tu Perfil Profesional</h3><CreateProfileForm onSuccess={setProfile} /></div>
          )}

          {/* Experience */}
          <div className="bg-brand-surface border border-white/5 rounded-2xl p-6 shadow-lg relative hover:border-brand-primary/30 transition-colors">
              <div className="absolute top-6 bottom-6 left-0 w-1 bg-slate-700 rounded-r-full"></div>
              <div className="ml-4">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-3"><Briefcase size={20} className="text-slate-500"/> Experiencia Profesional</h3>
                      <button onClick={() => openModal('experience')} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"><PlusCircle size={14}/> Agregar</button>
                  </div>
                  <div className="space-y-4">
                      {profile?.experience?.length > 0 ? profile.experience.map((exp, i) => (
                          <div key={i} className="bg-slate-950/50 p-4 rounded-xl border border-white/5 group relative">
                              <button onClick={() => handleDeleteItem('experience', i)} className="absolute top-3 right-3 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                              <h4 className="font-bold text-white">{exp.position}</h4>
                              <p className="text-brand-secondary text-sm font-medium">{exp.company}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 mb-2">
                                  <Calendar size={12}/> {exp.start_date} - {exp.end_date || 'Actualidad'}
                              </div>
                              <p className="text-slate-400 text-sm">{exp.description}</p>
                          </div>
                      )) : <p className="text-slate-500 text-sm italic">No has registrado experiencia laboral.</p>}
                  </div>
              </div>
          </div>

          {/* Education */}
          <div className="bg-brand-surface border border-white/5 rounded-2xl p-6 shadow-lg relative hover:border-brand-primary/30 transition-colors">
              <div className="absolute top-6 bottom-6 left-0 w-1 bg-slate-700 rounded-r-full"></div>
              <div className="ml-4">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-3"><GraduationCap size={20} className="text-slate-500"/> Educación</h3>
                      <button onClick={() => openModal('education')} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"><PlusCircle size={14}/> Agregar</button>
                  </div>
                  <div className="space-y-4">
                      {profile?.education?.length > 0 ? profile.education.map((edu, i) => (
                          <div key={i} className="bg-slate-950/50 p-4 rounded-xl border border-white/5 group relative">
                              <button onClick={() => handleDeleteItem('education', i)} className="absolute top-3 right-3 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                              <h4 className="font-bold text-white">{edu.degree}</h4>
                              <p className="text-brand-secondary text-sm font-medium">{edu.school}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                  <Calendar size={12}/> {edu.start_date} - {edu.end_date || 'Finalizado'}
                              </div>
                          </div>
                      )) : <p className="text-slate-500 text-sm italic">No has registrado educación.</p>}
                  </div>
              </div>
          </div>

        </div>
      </div>

      {/* --- FLOATING MODAL --- */}
      {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-brand-surface border border-white/10 w-full max-w-md rounded-2xl shadow-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Agregar {modalType === 'experience' ? 'Experiencia' : 'Educación'}</h2>
                  <div className="space-y-3">
                      {modalType === 'experience' ? (
                          <>
                              <input type="text" placeholder="Puesto / Cargo" className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm"
                                  value={newItem.position || ''} onChange={e => setNewItem({...newItem, position: e.target.value})} />
                              <input type="text" placeholder="Empresa" className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm"
                                  value={newItem.company || ''} onChange={e => setNewItem({...newItem, company: e.target.value})} />
                              <div className="grid grid-cols-2 gap-2">
                                  <input type="month" className="bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm" value={newItem.start_date || ''} onChange={e => setNewItem({...newItem, start_date: e.target.value})} />
                                  <input type="month" className="bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm" value={newItem.end_date || ''} onChange={e => setNewItem({...newItem, end_date: e.target.value})} />
                              </div>
                              <textarea placeholder="Descripción..." rows="3" className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm" value={newItem.description || ''} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                          </>
                      ) : (
                          <>
                              <input type="text" placeholder="Carrera / Título" className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm" value={newItem.degree || ''} onChange={e => setNewItem({...newItem, degree: e.target.value})} />
                              <input type="text" placeholder="Institución" className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm" value={newItem.school || ''} onChange={e => setNewItem({...newItem, school: e.target.value})} />
                              <div className="grid grid-cols-2 gap-2">
                                  <input type="month" className="bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm" value={newItem.start_date || ''} onChange={e => setNewItem({...newItem, start_date: e.target.value})} />
                                  <input type="month" className="bg-slate-900 border border-white/10 rounded-lg p-2 text-white text-sm" value={newItem.end_date || ''} onChange={e => setNewItem({...newItem, end_date: e.target.value})} />
                              </div>
                          </>
                      )}
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white px-4 py-2 text-sm">Cancelar</button>
                      <button onClick={handleSaveItem} className="bg-brand-primary hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">Guardar</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

// Component CreateProfileForm unchanged
const CreateProfileForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({ title: '', location: '', skills: '' });
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim());
            const res = await axios.post('/candidates', { ...formData, skills: skillsArray });
            onSuccess(res.data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div><label className="text-xs font-bold text-slate-400 uppercase">Título</label><input required type="text" placeholder="Ej. Desarrollador" className="w-full mt-1 bg-brand-dark border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none" onChange={e => setFormData({...formData, title: e.target.value})}/></div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-slate-400 uppercase">Ubicación</label><input required type="text" placeholder="Ciudad" className="w-full mt-1 bg-brand-dark border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none" onChange={e => setFormData({...formData, location: e.target.value})}/></div>
                <div><label className="text-xs font-bold text-slate-400 uppercase">Skills</label><input required type="text" placeholder="React, Node..." className="w-full mt-1 bg-brand-dark border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none" onChange={e => setFormData({...formData, skills: e.target.value})}/></div>
            </div>
            <button disabled={loading} className="bg-brand-primary hover:bg-violet-600 text-white font-bold py-3 px-6 rounded-xl w-full transition-colors flex justify-center items-center gap-2">{loading ? <Loader2 className="animate-spin"/> : "Guardar Perfil"}</button>
        </form>
    )
}

export default CvPage;