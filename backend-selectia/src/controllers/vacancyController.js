// backend-selectia/src/controllers/vacancyController.js
const Vacancy = require('../models/Vacancy');
const Recruiter = require('../models/Recruiter');

// --- 1. CREAR NUEVA VACANTE ---
exports.createVacancy = async (req, res) => {
    try {
        // Verificar que sea Reclutador o Admin
        if (req.user.role !== 'recruiter' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'No tienes permiso para crear vacantes' });
        }

        // Crear la vacante con los datos del body + el ID del usuario logueado
        const newVacancy = new Vacancy({
            ...req.body,
            created_by: req.user.id,
            posted_at: Date.now()
        });

        const vacancy = await newVacancy.save();
        res.json(vacancy);

    } catch (error) {
        console.error("Error al crear vacante:", error.message);
        res.status(500).send('Error del servidor al crear vacante');
    }
};

// --- 2. OBTENER VACANTES DEL RECLUTADOR ACTUAL (Para "Mis Vacantes") ---
exports.getMyVacancies = async (req, res) => {
    try {
        // Buscar vacantes donde created_by coincida con el usuario logueado
        // Ordenamos por fecha de creación descendente (lo más nuevo primero)
        const vacancies = await Vacancy.find({ created_by: req.user.id })
                                       .sort({ posted_at: -1 });
        res.json(vacancies);
    } catch (error) {
        console.error("Error al obtener mis vacantes:", error.message);
        res.status(500).send('Error del servidor');
    }
};

// --- 3. OBTENER TODAS LAS VACANTES (Público - Para el Candidato) ---
exports.getAllVacancies = async (req, res) => {
    try {
        // Obtenemos las vacantes ordenadas por fecha
        const vacancies = await Vacancy.find().sort({ posted_at: -1 });

        // Enriquecer con datos de la empresa (Recruiter Profile)
        const enrichedVacancies = await Promise.all(vacancies.map(async (job) => {
            // Buscamos el perfil del reclutador usando el ID del usuario creador
            const recruiterProfile = await Recruiter.findOne({ user: job.created_by });
            
            const jobObj = job.toObject();

            // Inyectamos la info de la empresa
            jobObj.company = {
                name: recruiterProfile ? recruiterProfile.company_name : 'Empresa Confidencial',
                logo: recruiterProfile ? recruiterProfile.logo_url : null,
                location: recruiterProfile ? recruiterProfile.location : 'Ubicación no especificada'
            };

            return jobObj;
        }));

        res.json(enrichedVacancies);
    } catch (error) {
        console.error("Error al obtener todas las vacantes:", error);
        res.status(500).send('Error al obtener vacantes');
    }
};

// --- 4. OBTENER UNA VACANTE POR ID ---
exports.getVacancyById = async (req, res) => {
    try {
        const vacancy = await Vacancy.findById(req.params.id);
        if (!vacancy) return res.status(404).json({ msg: 'Vacante no encontrada' });
        
        // También enriquecemos esta con datos de la empresa
        const recruiterProfile = await Recruiter.findOne({ user: vacancy.created_by });
        const vacancyObj = vacancy.toObject();
        
        vacancyObj.company = {
            name: recruiterProfile ? recruiterProfile.company_name : 'Empresa Confidencial',
            logo: recruiterProfile ? recruiterProfile.logo_url : null,
            location: recruiterProfile ? recruiterProfile.location : null
        };

        res.json(vacancyObj);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') return res.status(404).json({ msg: 'Vacante no encontrada' });
        res.status(500).send('Error del servidor');
    }
};