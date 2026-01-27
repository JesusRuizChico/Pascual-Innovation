// backend-selectia/src/controllers/candidateController.js
const Candidate = require('../models/Candidate');
const User = require('../models/User');

// --- OBTENER MI PERFIL ---
exports.getMyProfile = async (req, res) => {
    try {
        const profile = await Candidate.findOne({ user: req.user.id }).populate('user', ['name', 'lastname', 'email']);
        
        if (!profile) {
            return res.status(404).json({ msg: 'No hay perfil creado para este usuario' });
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// --- CREAR O ACTUALIZAR PERFIL ---
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

// --- DESCARTAR VACANTE ---
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

// --- NUEVO: SUBIR FOTO (Cloudinary) ---
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

// --- NUEVO: SUBIR CV PDF (Cloudinary) ---
exports.uploadCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No se subió ningún archivo');
        }

        const cvUrl = req.file.path; // URL del PDF en la nube

        const profile = await Candidate.findOneAndUpdate(
            { user: req.user.id },
            { $set: { cv_url: cvUrl } },
            { new: true, upsert: true }
        );

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al subir el CV');
    }
};