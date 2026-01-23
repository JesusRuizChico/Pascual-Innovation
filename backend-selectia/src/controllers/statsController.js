// backend-selectia/src/controllers/statsController.js
const User = require('../models/User');
const Vacancy = require('../models/Vacancy');
const Application = require('../models/Application');
const Candidate = require('../models/Candidate');

// --- ESTADÍSTICAS PARA EL RECLUTADOR ---
exports.getRecruiterStats = async (req, res) => {
    try {
        const recruiterId = req.user.id;

        // 1. Total de Vacantes del usuario
        const totalVacancies = await Vacancy.countDocuments({ created_by: recruiterId });
        
        // 2. Total de Vacantes Activas
        const activeVacancies = await Vacancy.countDocuments({ created_by: recruiterId, status: 'activa' });

        // 3. Obtener IDs de mis vacantes para buscar postulaciones
        const myVacancies = await Vacancy.find({ created_by: recruiterId }).select('_id');
        const myVacancyIds = myVacancies.map(v => v._id);

        // 4. Total de Candidatos (Postulaciones recibidas)
        const totalCandidates = await Application.countDocuments({ vacancy: { $in: myVacancyIds } });

        // 5. Candidatos Nuevos (status: 'nuevo')
        const newCandidates = await Application.countDocuments({ vacancy: { $in: myVacancyIds }, status: 'nuevo' });

        res.json({
            totalVacancies,
            activeVacancies,
            totalCandidates,
            newCandidates
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error al obtener estadísticas');
    }
};

// --- ESTADÍSTICAS PARA EL ADMIN (GLOBALES) ---
exports.getAdminStats = async (req, res) => {
    try {
        // Solo permitir admin (doble verificación aparte del middleware)
        if(req.user.role !== 'admin') return res.status(403).json({msg: 'Acceso denegado'});

        const totalUsers = await User.countDocuments();
        const totalCandidates = await User.countDocuments({ role: 'candidate' });
        const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
        const totalVacancies = await Vacancy.countDocuments();
        const totalApplications = await Application.countDocuments();

        // Ingresos simulados (Multiplicamos reclutadores * precio plan)
        const estimatedRevenue = totalRecruiters * 1500; 

        res.json({
            totalUsers,
            totalCandidates,
            totalRecruiters,
            totalVacancies,
            totalApplications,
            estimatedRevenue
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// --- DESCARGAR REPORTE CSV (CORREGIDO: Incluye Email) ---
exports.downloadReport = async (req, res) => {
    try {
        // 1. Obtener vacantes del reclutador
        const myVacancies = await Vacancy.find({ created_by: req.user.id });
        const vacancyIds = myVacancies.map(v => v._id);

        // 2. Obtener postulaciones con "Deep Populate" para sacar el email del Usuario
        const applications = await Application.find({ vacancy: { $in: vacancyIds } })
            .populate({
                path: 'candidate',
                select: 'full_name phone', // Datos del perfil de candidato
                populate: {
                    path: 'user',
                    select: 'email' // <--- AQUÍ TRAEMOS EL EMAIL DEL USUARIO (LOGIN)
                }
            })
            .populate('vacancy', 'title');

        // 3. Construir CSV
        // \ufeff es el BOM para que Excel abra bien los acentos
        let csv = '\ufeffCandidato,Email,Telefono,Vacante,Estado,Match IA,Fecha Postulacion\n';

        applications.forEach(app => {
            const date = new Date(app.applied_at).toLocaleDateString();
            
            // Extracción segura de datos
            const name = app.candidate?.full_name || 'Desconocido';
            
            // CORRECCIÓN: El email viene de candidate.user.email
            const email = app.candidate?.user?.email || 'No registrado';
            
            const phone = app.candidate?.phone || 'N/A';
            const title = app.vacancy?.title || 'Vacante eliminada';
            
            // Limpiar comas en los textos para no romper el CSV
            const cleanName = name.replace(/,/g, '');
            const cleanTitle = title.replace(/,/g, '');

            csv += `${cleanName},${email},${phone},"${cleanTitle}",${app.status},${app.ai_score}%,${date}\n`;
        });

        // 4. Enviar archivo
        res.header('Content-Type', 'text/csv');
        res.attachment('reporte_selectia.csv');
        res.send(csv);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al generar reporte');
    }
};