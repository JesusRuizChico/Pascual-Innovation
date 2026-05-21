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

// --- MODIFICADO: SUBIR CV Y SOBRESCRIBIR PERFIL CON IA (A PRUEBA DE FALLOS Y ARRAYS) ---
// --- MODIFICADO: SUBIR CV Y SOBRESCRIBIR PERFIL CON IA (A PRUEBA DE FALLOS Y CAST ERRORS) ---
// --- MODIFICADO: SUBIR CV Y SOBRESCRIBIR PERFIL CON IA (DOMADOR DE OLLAMA 2.0) ---
exports.uploadCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No se subió ningún archivo');
        }

        // 1. URL Pública del archivo
        const publicBaseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;
        const cvUrl = `${publicBaseUrl}/uploads/${req.file.filename}`;

        console.log("Archivo guardado localmente. Link BD:", cvUrl);

        // 2. Guardamos el perfil inicial con el link del CV
        let profile = await Candidate.findOneAndUpdate(
            { user: req.user.id },
            { $set: { cv_url: cvUrl } },
            { new: true, upsert: true }
        );

        // 3. MANDAR EL ARCHIVO A n8n
        console.log("Enviando documento físico a n8n...");
        let dataIA = null;
        try {
            dataIA = await n8nService.analizarCvConIA(req.file.path);
        } catch (n8nError) {
            console.error("❌ Error conectando con n8n.");
        }

        // Si n8n nos devuelve un Array, extraemos el primer elemento.
        if (Array.isArray(dataIA) && dataIA.length > 0) {
            dataIA = dataIA[0];
        }

        // 👇 DOMADOR DE OLLAMA (Llaves principales) 👇
        if (dataIA) {
            if (dataIA.profile_profesional) dataIA.perfil_profesional = dataIA.profile_profesional;
            
            if (dataIA.resultado_evaluacion) {
                dataIA.resultado_evaluacion.apto = dataIA.resultado_evaluacion.apto ?? dataIA.resultado_evaluacion.Apto;
                dataIA.resultado_evaluacion.razon = dataIA.resultado_evaluacion.razon || dataIA.resultado_evaluacion.Razon;
                dataIA.resultado_evaluacion.nivel_seniority = dataIA.resultado_evaluacion.nivel_seniority || dataIA.resultado_evaluacion.Nivel_seniority;
                dataIA.resultado_evaluacion.compatibilidad_porcentaje = dataIA.resultado_evaluacion.compatibilidad_porcentaje || dataIA.resultado_evaluacion.Compatibilidad_porcentaje;
            }
            if (dataIA.analisis_ia) {
                dataIA.analisis_ia.fortalezas = dataIA.analisis_ia.fortalezas || dataIA.analisis_ia.Fortalezas;
                dataIA.analisis_ia.areas_mejora = dataIA.analisis_ia.areas_mejora || dataIA.analisis_ia.Areas_mejora;
                dataIA.analisis_ia.riesgos_detectados = dataIA.analisis_ia.riesgos_detectados || dataIA.analisis_ia.Riesgos_detectados;
                dataIA.analisis_ia.recomendacion_reclutador = dataIA.analisis_ia.recomendacion_reclutador || dataIA.analisis_ia.Recomendacion_reclutador;
            }
        }
        // 👆 ========================================= 👆

        // 4. Si tenemos los datos, sobrescribimos el perfil
        if (dataIA && dataIA.resultado_evaluacion) {
            console.log("Datos recibidos de IA, mapeando listas...");
            
            // 👇 DOMADOR DE OLLAMA (Para Experiencia y Educación) 👇
            const mappedExperience = dataIA.experiencia_laboral?.map(exp => {
                const responsabilidades = exp.responsabilidades || exp.Responsabilidades || [];
                return {
                    // Buscamos minúscula o mayúscula, si no hay nada ponemos string vacío
                    position: exp.puesto || exp.Puesto || '',
                    company: exp.empresa || exp.Empresa || '',
                    from: exp.fecha_inicio || exp.Fecha_inicio || exp.FechaInicio || null,
                    to: exp.fecha_fin || exp.Fecha_fin || exp.FechaFin || null,
                    description: Array.isArray(responsabilidades) ? responsabilidades.join('. ') : (responsabilidades || ''),
                    responsibilities: Array.isArray(responsabilidades) ? responsabilidades : [responsabilidades]
                };
            }) || [];

            const mappedEducation = dataIA.formacion_academica?.map(edu => ({
                level: edu.nivel || edu.Nivel || '',
                school: edu.institucion || edu.Institucion || '',
                degree: edu.carrera || edu.Carrera || '',
                from: edu.fecha_inicio || edu.Fecha_inicio || edu.FechaInicio || null,
                to: edu.fecha_fin || edu.Fecha_fin || edu.FechaFin || null,
                status: edu.estado || edu.Estado || ''
            })) || [];
            // 👆 =================================================== 👆

            const mappedSkills = dataIA.habilidades_tecnicas?.map(s => s.skill || s.Skill || '')
                .filter(s => s !== '') || []; // Filtramos vacíos

            const mappedCertifications = dataIA.certificaciones
                ?.filter(cert => cert && cert.trim() !== '') 
                ?.map(cert => {
                    return typeof cert === 'string' ? { name: cert, title: cert } : cert;
                }) || [];

            const mappedSoftSkills = dataIA.habilidades_blandas
                ?.filter(skill => typeof skill === 'string' && skill.trim() !== '') || [];

            console.log("Sobrescribiendo Mongo...");

            // Guardamos en Mongo
            profile = await Candidate.findOneAndUpdate(
                { user: req.user.id },
                { 
                    $set: { 
                        title: dataIA.perfil_profesional?.area_principal || dataIA.perfil_profesional?.Area_principal,
                        phone: dataIA.contacto?.telefono || dataIA.contacto?.Telefono,
                        location: `${dataIA.contacto?.ciudad || dataIA.contacto?.Ciudad || ''} ${dataIA.contacto?.pais || dataIA.contacto?.Pais || ''}`.trim(),
                        experience_years: dataIA.perfil_profesional?.anios_experiencia_estimados || dataIA.perfil_profesional?.Anios_experiencia_estimados || 0,
                        skills: mappedSkills,
                        experience: mappedExperience,
                        education: mappedEducation,
                        'ai_details.resume': dataIA.perfil_profesional?.resumen || dataIA.perfil_profesional?.Resumen,
                        'ai_details.soft_skills': mappedSoftSkills,
                        'ai_details.certifications': mappedCertifications,
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
        console.error("Error al subir el CV:", error);
        res.status(500).send('Error al procesar el CV');
    }
};