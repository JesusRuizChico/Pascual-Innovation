const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    full_name: { type: String },
    title: { type: String }, // Ej: "Desarrollador Full Stack"
    location: { type: String },
    phone: { type: String },
    experience_years: { type: Number, default: 0 },
    salary_expectations: { type: Number },
    
    // Aquí guardaremos las "habilidades_tecnicas" que detecte la IA
    skills: { type: [String], default: [] }, 
    
    cv_url: { type: String },
    photo_url: { type: String },
    
    // --- NUEVO CAMPO: Vacantes Descartadas ---
    rejected_vacancies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy' }],
    // -----------------------------------------

    // Mapearemos "experiencia_laboral" de la IA aquí
    experience: [{
        position: String,
        company: String,
        from: String, // Usamos String porque la IA a veces devuelve "2020" o fechas parciales
        to: String,
        description: String,
        responsibilities: [String] // Agregado para soportar el array de la IA
    }],

    // Mapearemos "formacion_academica" de la IA aquí
    education: [{
        level: String,
        school: String,
        degree: String,
        from: String,
        to: String,
        status: String // "En curso", "Finalizado"
    }],

    // --- NUEVO: CONTENEDOR DE INTELIGENCIA ARTIFICIAL ---
    // Aquí guardamos el análisis profundo para usarlo luego con el Chatbot
    ai_details: {
        resume: String, // El "resumen" del perfil profesional
        soft_skills: [String], // "habilidades_blandas"
        certifications: [{ nombre: String, institucion: String, fecha: String }],
        
        // El análisis del reclutador (Riesgos, fortalezas, veredicto)
        analysis: {
            is_suitable: Boolean, // "apto"
            reason: String, // "razon"
            seniority: String,
            compatibility: Number,
            strengths: [String],
            improvements: [String],
            risks: [String],
            recommendation: String
        }
    },

    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);