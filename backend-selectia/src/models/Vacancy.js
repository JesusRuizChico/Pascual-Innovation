// backend-selectia/src/models/Vacancy.js
const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    salary_min: { // Separé el rango para mejor filtrado
        type: Number,
        required: true
    },
    salary_max: {
        type: Number,
        required: true
    },
    modality: {
        type: String,
        enum: ['Presencial', 'Remoto', 'Híbrido'],
        default: 'Presencial'
    },
    status: {
        type: String,
        enum: ['activa', 'cerrada', 'pausada'],
        default: 'activa'
    },
    skills_required: {
        type: [String], // Array de strings
        default: []
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Relación con la colección Users
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vacancy', vacancySchema);