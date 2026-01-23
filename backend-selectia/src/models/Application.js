// backend-selectia/src/models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    vacancy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vacancy', // Referencia a la vacante
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate', // Referencia al perfil del candidato
        required: true
    },
    status: {
        type: String,
        enum: ['nuevo', 'entrevista', 'rechazado', 'contratado'],
        default: 'nuevo'
    },
    ai_score: {
        type: Number, // Calificación del 0 al 100
        default: 0
    },
    interview_date: { type: Date },
    recruiter_notes: {
        type: String
    },
    applied_at: {
        type: Date,
        default: Date.now
    }
});

// Evitar que un candidato se postule dos veces a la misma vacante
applicationSchema.index({ vacancy: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);