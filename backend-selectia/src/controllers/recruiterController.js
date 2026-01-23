// backend-selectia/src/controllers/recruiterController.js
const Recruiter = require('../models/Recruiter');

// 1. Obtener mi perfil de empresa
exports.getMe = async (req, res) => {
    try {
        const profile = await Recruiter.findOne({ user: req.user.id });
        if (!profile) {
            return res.json(null); // Retornamos null si no ha configurado la empresa
        }
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor');
    }
};

// 2. Crear o Actualizar perfil
exports.updateProfile = async (req, res) => {
    const { company_name, website, location, industry, description } = req.body;

    // Construir objeto
    const profileFields = {
        user: req.user.id,
        company_name,
        website,
        location,
        industry,
        description,
        updated_at: Date.now()
    };

    try {
        let profile = await Recruiter.findOne({ user: req.user.id });

        if (profile) {
            // Actualizar
            profile = await Recruiter.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Crear
        profile = new Recruiter(profileFields);
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor');
    }
};

// 3. Subir Logo
exports.uploadLogo = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No se subió imagen' });

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        let profile = await Recruiter.findOne({ user: req.user.id });
        
        // Si no existe el perfil, lo creamos básico con el logo
        if (!profile) {
            profile = new Recruiter({
                user: req.user.id,
                company_name: 'Empresa Sin Nombre', // Placeholder
                logo_url: fileUrl
            });
        } else {
            profile.logo_url = fileUrl;
        }

        await profile.save();
        res.json({ msg: 'Logo actualizado', logo_url: fileUrl });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al subir logo');
    }
};