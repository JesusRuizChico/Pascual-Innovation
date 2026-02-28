const Candidate = require('../models/Candidate');
const User = require('../models/User');
const axios = require('axios');
const n8nService = require('../services/n8nService');


// (Tus funciones getMyProfile, updateProfile, discardVacancy, uploadPhoto se quedan IGUAL)

exports.getMyProfile = async (req, res) => {
    try {
        const profile = await Candidate.findOne({ user: req.user.id }).populate('user', ['name', 'lastname', 'email']);
        if (!profile) return res.status(404).json({ msg: 'No hay perfil creado para este usuario' });
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

exports.updateProfile = async (req, res) => {
    // ... (Tu código existente de updateProfile) ...
};

exports.discardVacancy = async (req, res) => {
   // ... (Tu código existente de discardVacancy) ...
};

exports.uploadPhoto = async (req, res) => {
   // ... (Tu código existente de uploadPhoto) ...
};

// --- MODIFICADO: SUBIR CV Y SOBRESCRIBIR PERFIL CON IA ---
exports.uploadCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No se subió ningún archivo');
        }

        // 1. URL Pública del archivo para guardarlo en la Base de Datos (Ahora sí usará localhost)
        const publicBaseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;
        const cvUrl = `${publicBaseUrl}/uploads/${req.file.filename}`;

        console.log("Archivo guardado localmente. Link BD:", cvUrl);

        // 2. Guardamos el perfil inicial con el link del CV
        let profile = await Candidate.findOneAndUpdate(
            { user: req.user.id },
            { $set: { cv_url: cvUrl } },
            { new: true, upsert: true }
        );

        // 3. MANDAR EL ARCHIVO FÍSICO A n8n
        // Pasamos la ruta física donde se guardó el archivo (ej: 'uploads/123-456.pdf')
        console.log("Enviando documento físico a n8n...");
        const dataIA = await n8nService.analizarCvConIA(req.file.path);

        // 4. Si n8n responde con el JSON de la IA, sobrescribimos el perfil
        if (dataIA && dataIA.resultado_evaluacion) {
            console.log("Datos recibidos de IA, sobrescribiendo perfil...");
            
            const mappedExperience = dataIA.experiencia_laboral?.map(exp => ({
                position: exp.puesto,
                company: exp.empresa,
                from: exp.fecha_inicio,
                to: exp.fecha_fin,
                description: exp.responsabilidades?.join('. '),
                responsibilities: exp.responsabilidades
            })) || [];

            const mappedEducation = dataIA.formacion_academica?.map(edu => ({
                level: edu.nivel,
                school: edu.institucion,
                degree: edu.carrera,
                from: edu.fecha_inicio,
                to: edu.fecha_fin,
                status: edu.estado
            })) || [];

            const mappedSkills = dataIA.habilidades_tecnicas?.map(s => s.skill) || [];

            profile = await Candidate.findOneAndUpdate(
                { user: req.user.id },
                { 
                    $set: { 
                        title: dataIA.perfil_profesional?.area_principal,
                        phone: dataIA.contacto?.telefono,
                        location: `${dataIA.contacto?.ciudad || ''} ${dataIA.contacto?.pais || ''}`.trim(),
                        experience_years: dataIA.perfil_profesional?.anios_experiencia_estimados || 0,
                        skills: mappedSkills,
                        experience: mappedExperience,
                        education: mappedEducation,
                        'ai_details.resume': dataIA.perfil_profesional?.resumen,
                        'ai_details.soft_skills': dataIA.habilidades_blandas,
                        'ai_details.certifications': dataIA.certificaciones,
                        'ai_details.analysis': {
                            is_suitable: dataIA.resultado_evaluacion?.apto,
                            reason: dataIA.resultado_evaluacion?.razon,
                            seniority: dataIA.resultado_evaluacion?.nivel_seniority,
                            compatibility: dataIA.resultado_evaluacion?.compatibilidad_porcentaje,
                            strengths: dataIA.analisis_ia?.fortalezas,
                            improvements: dataIA.analisis_ia?.areas_mejora,
                            risks: dataIA.analisis_ia?.riesgos_detectados,
                            recommendation: dataIA.analisis_ia?.recomendacion_reclutador
                        }
                    } 
                },
                { new: true }
            );
        }

        res.json(profile);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al subir el CV');
    }
};