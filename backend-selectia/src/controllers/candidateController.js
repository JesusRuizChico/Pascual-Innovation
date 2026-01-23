// backend-selectia/src/controllers/candidateController.js
const Candidate = require('../models/Candidate');
const User = require('../models/User'); // <--- IMPORTANTE: Importamos el modelo User

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
            title, 
            phone, 
            location, 
            salary_expectations, 
            skills, 
            experience_years,
            education_level 
        } = req.body;

        // 1. BUSCAR AL USUARIO EN LA BD PARA OBTENER SU NOMBRE REAL
        const userRecord = await User.findById(req.user.id);
        
        if (!userRecord) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // 2. Armar el nombre completo real
        const realFullName = `${userRecord.name} ${userRecord.lastname}`;

        // Armar objeto de perfil
        const profileFields = {
            user: req.user.id,
            full_name: realFullName, // <--- AQUÍ USAMOS EL NOMBRE REAL
            title,
            phone,
            location,
            salary_expectations,
            skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()), 
            experience_years,
            education_level
        };

        // Buscar si ya existe y actualizar, si no, crear (upsert)
        let profile = await Candidate.findOne({ user: req.user.id });

        if (profile) {
            // Actualizar
            profile = await Candidate.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Crear
        profile = new Candidate(profileFields);
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// ... (código anterior) ...

// --- DESCARTAR UNA VACANTE ---
exports.discardVacancy = async (req, res) => {
    try {
        const { vacancyId } = req.params;
        
        // Usamos $addToSet para no agregar el mismo ID dos veces
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