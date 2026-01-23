// backend-selectia/src/models/Recruiter.js
const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    company_name: { type: String, required: true },
    logo_url: { type: String }, // Aquí guardaremos la imagen
    website: { type: String },
    location: { type: String },
    industry: { type: String }, // Ej. Tecnología, Salud, Finanzas
    description: { type: String }, // "Somos una empresa líder en..."
    
    // Configuración extra
    verified: { type: Boolean, default: false }, // Para el admin check azul

    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Recruiter', recruiterSchema);