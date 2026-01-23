const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    full_name: { type: String },
    title: { type: String },
    location: { type: String },
    phone: { type: String },
    experience_years: { type: Number, default: 0 },
    salary_expectations: { type: Number },
    skills: { type: [String], default: [] },
    cv_url: { type: String },
    photo_url: { type: String },
    
    // --- NUEVO CAMPO: Vacantes Descartadas ---
    rejected_vacancies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy' }],
    // -----------------------------------------

    experience: [/* ... (lo que ya tenías) ... */],
    education: [/* ... (lo que ya tenías) ... */],
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);