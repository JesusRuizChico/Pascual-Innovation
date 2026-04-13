// backend-selectia/src/controllers/candidateController.js
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
    try {
        const { 
            title, phone, location, salary_expectations, 
            skills, experience_years, education_level, 
            experience, education // Asegúrate de recibir estos también si los envías
        } = req.body;

        const userRecord = await User.findById(req.user.id);
        if (!userRecord) return res.status(404).json({ msg: 'Usuario no encontrado' });

        const realFullName = `${userRecord.name} ${userRecord.lastname}`;

        const profileFields = {
            user: req.user.id,
            full_name: realFullName,
            title,
            phone,
            location,
            salary_expectations,
            skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []), 
            experience_years,
            education_level,
            experience: experience || [], // Mantener arrays si vienen
            education: education || []
        };

        let profile = await Candidate.findOne({ user: req.user.id });

        if (profile) {
            profile = await Candidate.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        profile = new Candidate(profileFields);
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

exports.discardVacancy = async (req, res) => {
    try {
        const { vacancyId } = req.params;
        await Candidate.findOneAndUpdate(
            { user: req.user.id },
            { $addToSet: { rejected_vacancies: vacancyId } }
        );
        res.json({ msg: 'Vacante descartada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al descartar vacante');
    }
};

exports.uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No se subió ningún archivo');
        }

        // Con Cloudinary, req.file.path YA ES LA URL WEB (https://...)
        const photoUrl = req.file.path;

        const profile = await Candidate.findOneAndUpdate(
            { user: req.user.id },
            { $set: { photo_url: photoUrl } },
            { new: true, upsert: true } // Upsert crea el perfil si no existe solo con la foto
        );

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al subir la imagen');
    }
};

// --- MODIFICADO: SUBIR CV Y SOBRESCRIBIR PERFIL CON IA (A PRUEBA DE FALLOS) ---
exports.uploadCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No se subió ningún archivo');
        }

        // 1. URL Pública del archivo para guardarlo en la Base de Datos
        const publicBaseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;
        const cvUrl = `${publicBaseUrl}/uploads/${req.file.filename}`;

        console.log("Archivo guardado localmente. Link BD:", cvUrl);

        // 2. Guardamos el perfil inicial con el link del CV ANTES de contactar a n8n
        let profile = await Candidate.findOneAndUpdate(
            { user: req.user.id },
            { $set: { cv_url: cvUrl } },
            { new: true, upsert: true }
        );

        // 3. MANDAR EL ARCHIVO FÍSICO A n8n (Bloque protegido con Try/Catch interno)
        console.log("Enviando documento físico a n8n...");
        let dataIA = null;
        try {
            dataIA = await n8nService.analizarCvConIA(req.file.path);
        } catch (n8nError) {
            // Atrapamos el error aquí. El servidor NO colapsa y la ruta del CV ya está guardada.
            console.error("❌ Error conectando con n8n. El CV se guardó, pero la IA no pudo extraer los datos.");
        }

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

        // 5. Respondemos al Frontend. El perfil siempre se devuelve (con o sin datos de la IA).
        res.json(profile);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al subir el CV');
    }
};