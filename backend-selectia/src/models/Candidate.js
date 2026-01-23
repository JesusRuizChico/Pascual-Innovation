// backend-selectia/src/models/Candidate.js
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
        
    },
    full_name: { type: String, required: true },
    title: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    salary_expectations: { type: Number },
    cv_url: { type: String },
    skills: { type: [String], default: [] },
    experience_years: { type: Number, default: 0 },
    photo_url: { type: String },
    
    // --- NUEVO: EXPERIENCIA Y EDUCACIÓN ---
    experience: [{
        position: String,
        company: String,
        start_date: String, // Guardaremos "2022-01"
        end_date: String,   // Guardaremos "2023-05" o "Actualidad"
        description: String
    }],
    education: [{
        school: String,
        degree: String, // Título o Carrera
        start_date: String,
        end_date: String
    }],
    // --------------------------------------

    preferences: {
        emailNotify: { type: Boolean, default: true },
        browserNotify: { type: Boolean, default: true }
    },
    
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Candidate', candidateSchema);