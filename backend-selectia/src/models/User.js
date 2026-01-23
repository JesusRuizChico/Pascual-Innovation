// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastname: { // Agregado para soportar tu formulario de registro
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'recruiter', 'candidate'], // Los roles definidos
        default: 'candidate'
    },
    // Campos opcionales solo para Reclutadores
    companyName: {
        type: String,
        required: function() { return this.role === 'recruiter'; } // Solo obligatorio si es reclutador
    },
    rfc: {
        type: String,
        uppercase: true,
        required: function() { return this.role === 'recruiter'; }
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);